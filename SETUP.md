# 🚀 AI工具导航网站 - 完整设置指南

本指南将帮助您从零开始设置和部署AI工具导航网站。

## 📋 前置要求

- Node.js 18+ 
- pnpm (推荐) 或 npm
- Git
- Supabase 账户

## 🔧 详细设置步骤

### 1. 项目初始化

```bash
# 克隆项目
git clone <your-repo-url>
cd ai-tools-directory

# 安装依赖
pnpm install

# 复制环境变量文件
cp .env.example .env.local
```

### 2. Supabase 设置

#### 2.1 创建 Supabase 项目
1. 访问 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 选择组织并填写项目信息
4. 等待项目创建完成

#### 2.2 获取项目配置
1. 在项目仪表板中，点击左侧的 "Settings" → "API"
2. 复制以下信息：
   - Project URL
   - anon public key
   - service_role key (仅用于服务端)

#### 2.3 配置环境变量
编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 数据库初始化

#### 3.1 运行初始化脚本
1. 在 Supabase 仪表板中，点击左侧的 "SQL Editor"
2. 点击 "New Query"
3. 复制 `database/init.sql` 的内容并执行
4. 复制 `database/seed.sql` 的内容并执行

#### 3.2 设置 Row Level Security (RLS)
在 SQL Editor 中运行以下脚本：

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 用户表策略
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 工具表策略
CREATE POLICY "Anyone can view active tools" ON tools FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert tools" ON tools FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Users can update own tools" ON tools FOR UPDATE USING (auth.uid() = submitted_by);
CREATE POLICY "Admins can update any tool" ON tools FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 分类表策略
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- 评分表策略
CREATE POLICY "Anyone can view ratings" ON tool_ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own ratings" ON tool_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON tool_ratings FOR UPDATE USING (auth.uid() = user_id);

-- 收藏表策略
CREATE POLICY "Users can view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- 评论表策略
CREATE POLICY "Anyone can view active comments" ON comments FOR SELECT USING (status = 'active');
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
```

### 4. 认证设置

#### 4.1 配置认证提供商
1. 在 Supabase 仪表板中，点击 "Authentication" → "Settings"
2. 在 "Auth Providers" 中启用 "Email"
3. 配置邮件模板（可选）

#### 4.2 设置重定向 URL
在 "URL Configuration" 中添加：
- Site URL: `http://localhost:3000` (开发环境)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 5. 存储设置（可选）

如果需要文件上传功能：

1. 在 Supabase 仪表板中，点击 "Storage"
2. 创建一个名为 "uploads" 的存储桶
3. 设置存储桶策略：

```sql
-- 允许认证用户上传文件
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 允许所有人查看文件
CREATE POLICY "Anyone can view files" ON storage.objects
FOR SELECT USING (true);
```

### 6. 启动项目

```bash
# 开发环境
pnpm dev

# 生产环境构建
pnpm build
pnpm start
```

### 7. 创建管理员账户

1. 启动项目后，访问 `/register` 注册一个账户
2. 在 Supabase 仪表板的 "Table Editor" 中找到 `users` 表
3. 找到您的用户记录，将 `role` 字段改为 `admin`

### 8. 验证设置

访问以下页面确认功能正常：

- 首页: `http://localhost:3000`
- 工具库: `http://localhost:3000/tools`
- 分类页: `http://localhost:3000/categories`
- 管理后台: `http://localhost:3000/admin` (需要管理员权限)

## 🚀 部署到生产环境

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量
4. 部署

### 自托管部署

```bash
# 使用部署脚本
./scripts/deploy.sh production

# 或使用 PM2
pm2 start ecosystem.config.js --env production
```

## 🔧 常见问题

### Q: 数据库连接失败
A: 检查 Supabase URL 和 API 密钥是否正确配置

### Q: 认证不工作
A: 确认重定向 URL 配置正确，检查 RLS 策略

### Q: 管理后台无法访问
A: 确认用户角色已设置为 `admin`

### Q: 文件上传失败
A: 检查存储桶配置和策略设置

## 📞 获取帮助

如果遇到问题：
1. 查看项目 Issues
2. 检查 Supabase 文档
3. 联系项目维护者

## 🎉 完成！

恭喜！您已经成功设置了AI工具导航网站。现在可以开始添加工具和管理内容了。
