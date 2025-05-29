# 🤖 AI工具导航 - 智能搜索与推荐平台

一个现代化的AI工具发现平台，集成了智能搜索、个性化推荐和用户行为分析功能。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yuantang/AiTools)

## ✨ 功能特性

### 🔍 智能搜索系统
- **实时搜索建议** - 输入时即时显示相关建议
- **搜索历史管理** - 云端同步的搜索历史
- **热门搜索展示** - 实时热门搜索词统计
- **多维度筛选** - 按分类、标签、评分等筛选
- **模糊匹配** - 支持拼写纠错和模糊搜索

### 🤖 AI推荐算法
- **个性化推荐** - 基于用户行为的智能推荐
- **协同过滤** - 基于相似用户偏好推荐
- **内容推荐** - 基于工具特征匹配推荐
- **相似工具** - 智能相似度算法推荐
- **推荐解释** - 详细的推荐理由说明

### 👥 完整用户系统
- **用户注册登录** - 完整的身份认证系统
- **个人中心** - 用户资料和偏好管理
- **收藏系统** - 工具收藏和管理
- **评论评分** - 用户反馈和评价系统
- **通知系统** - 实时消息通知

### 📊 管理后台
- **数据仪表板** - 实时统计数据和分析
- **内容审核** - 工具提交审核管理
- **用户管理** - 用户状态和权限管理
- **分类管理** - 分类的增删改查
- **系统设置** - 网站配置管理

## 🛠️ 技术栈

### 前端
- **Next.js 14** - React全栈框架 (App Router)
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Radix UI** - 无障碍的UI组件库
- **Lucide React** - 美观的图标库

### 后端
- **Supabase** - 开源的Firebase替代方案
- **PostgreSQL** - 强大的关系型数据库
- **Supabase Auth** - 身份认证服务
- **Supabase Storage** - 文件存储服务

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 pnpm
- Supabase 账户

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/yuantang/AiTools.git
   cd AiTools
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   pnpm install
   ```

3. **环境配置**
   创建 `.env.local` 文件并配置以下变量：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开 [http://localhost:3000](http://localhost:3000)

## 📊 项目健康检查

运行健康检查脚本验证项目状态：

```bash
npm run health-check
```

## 🗄️ 数据库设置

### 渐进式增强设计
项目采用渐进式增强设计，**无需数据库迁移即可使用基础功能**：
- ✅ 工具浏览和搜索
- ✅ 用户注册登录
- ✅ 基础推荐功能
- ✅ 收藏和评论系统

### 启用完整功能
要获得完整的搜索和推荐功能，请：

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 在 SQL Editor 中执行 `database/simple-search-migration.sql`
3. 重新运行 `npm run health-check` 验证

详细说明请参考 `DATABASE_SETUP.md`

## 📁 项目结构

```
├── app/                    # Next.js App Router页面
│   ├── page.tsx           # 首页
│   ├── tools/             # 工具相关页面
│   ├── profile/           # 个人中心
│   ├── admin/             # 管理后台
│   └── demo/              # 功能演示
├── components/            # React组件
│   ├── ui/                # 基础UI组件
│   ├── EnhancedSearchBar.tsx    # 增强搜索栏
│   ├── RecommendationSection.tsx # 推荐区域
│   └── SimilarTools.tsx   # 相似工具推荐
├── lib/                   # 工具库和API
│   ├── api/               # API接口
│   └── supabase.ts        # 数据库配置
├── database/              # 数据库脚本
└── scripts/               # 工具脚本
```

## 📝 开发指南

### 可用脚本

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 项目健康检查
npm run health-check
```

## 🌐 部署到Vercel

1. **推送到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 导入GitHub仓库
   - 配置环境变量
   - 部署

3. **环境变量配置**
   在Vercel中设置以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**
