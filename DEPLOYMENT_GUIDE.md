# 🚀 部署指南 - GitHub + Vercel

本指南将帮助您将AI工具导航项目部署到GitHub并通过Vercel进行托管。

## 📋 前置要求

- ✅ 项目已在本地正常运行
- ✅ 拥有GitHub账户
- ✅ 拥有Vercel账户（可用GitHub登录）
- ✅ 拥有Supabase项目和配置

## 🐙 第一步：推送到GitHub

### 1.1 创建GitHub仓库

1. **访问GitHub**
   - 登录 [github.com](https://github.com)
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

2. **配置仓库**
   - **Repository name**: `AiTools` (或您喜欢的名称)
   - **Description**: `🤖 AI工具导航 - 智能搜索与推荐平台`
   - **Visibility**: Public (推荐) 或 Private
   - **不要**勾选 "Add a README file"、"Add .gitignore"、"Choose a license"
   - 点击 "Create repository"

### 1.2 推送代码到GitHub

在项目根目录执行以下命令：

```bash
# 添加远程仓库 (替换为您的GitHub用户名和仓库名)
git remote add origin https://github.com/YOUR_USERNAME/AiTools.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

**示例**：
```bash
git remote add origin https://github.com/yuantang/AiTools.git
git branch -M main
git push -u origin main
```

### 1.3 验证推送成功

- 刷新GitHub仓库页面
- 确认所有文件都已上传
- 检查README.md是否正确显示

## ⚡ 第二步：部署到Vercel

### 2.1 连接Vercel

1. **访问Vercel**
   - 登录 [vercel.com](https://vercel.com)
   - 使用GitHub账户登录（推荐）

2. **导入项目**
   - 点击 "New Project"
   - 选择 "Import Git Repository"
   - 找到您的 `ai-tools-navigator` 仓库
   - 点击 "Import"

### 2.2 配置项目设置

1. **项目配置**
   - **Project Name**: `ai-tools-navigator` (或自定义)
   - **Framework Preset**: Next.js (自动检测)
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

2. **环境变量配置**
   点击 "Environment Variables" 添加以下变量：

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SITE_URL=https://your-project-name.vercel.app
   ```

   **获取Supabase配置**：
   - 登录 [Supabase Dashboard](https://supabase.com/dashboard)
   - 选择您的项目
   - 进入 Settings > API
   - 复制 Project URL 和 anon public key
   - 复制 service_role secret key

### 2.3 部署项目

1. **开始部署**
   - 确认所有配置正确
   - 点击 "Deploy"
   - 等待部署完成（通常需要2-5分钟）

2. **验证部署**
   - 部署成功后会显示项目URL
   - 点击访问您的网站
   - 测试基本功能是否正常

## 🗄️ 第三步：配置数据库（可选）

### 3.1 基础功能（无需额外配置）

项目采用渐进式增强设计，基础功能无需数据库迁移即可使用：
- ✅ 工具浏览和搜索
- ✅ 用户注册登录
- ✅ 基础推荐功能

### 3.2 启用完整功能

要获得完整的搜索和推荐功能：

1. **执行数据库迁移**
   - 登录 [Supabase Dashboard](https://supabase.com/dashboard)
   - 选择您的项目
   - 进入 SQL Editor
   - 复制并执行项目中的 `database/simple-search-migration.sql` 文件内容

2. **验证功能**
   - 访问您的部署网站
   - 测试搜索建议功能
   - 测试个性化推荐功能

## 🔧 第四步：自定义域名（可选）

### 4.1 配置自定义域名

1. **在Vercel中配置**
   - 进入项目设置
   - 点击 "Domains"
   - 添加您的域名

2. **配置DNS**
   - 在您的域名提供商处
   - 添加CNAME记录指向Vercel

3. **更新环境变量**
   - 更新 `NEXT_PUBLIC_SITE_URL` 为您的自定义域名

## 📊 第五步：监控和维护

### 5.1 Vercel Analytics

1. **启用Analytics**
   - 在Vercel项目设置中
   - 启用 "Analytics"
   - 查看访问统计

### 5.2 错误监控

1. **查看部署日志**
   - 在Vercel Dashboard中查看部署日志
   - 监控运行时错误

2. **Supabase监控**
   - 在Supabase Dashboard中监控数据库性能
   - 查看API使用情况

## 🎯 部署后检查清单

- [ ] ✅ 网站可以正常访问
- [ ] ✅ 用户注册登录功能正常
- [ ] ✅ 工具浏览和搜索功能正常
- [ ] ✅ 搜索建议功能正常
- [ ] ✅ 推荐功能正常
- [ ] ✅ 响应式设计在移动端正常
- [ ] ✅ 数据库连接正常
- [ ] ✅ 环境变量配置正确
- [ ] ✅ 自定义域名配置（如适用）

## 🆘 常见问题

### Q: 部署失败怎么办？
**A**: 检查以下几点：
- 环境变量是否正确配置
- Supabase项目是否正常运行
- 代码是否有语法错误
- 查看Vercel部署日志获取详细错误信息

### Q: 网站可以访问但功能异常？
**A**: 检查以下几点：
- 浏览器控制台是否有错误
- 环境变量是否正确
- Supabase数据库连接是否正常
- 运行项目健康检查：访问 `/api/health`

### Q: 如何更新部署？
**A**:
1. 在本地修改代码
2. 提交并推送到GitHub：`git add . && git commit -m "更新说明" && git push`
3. Vercel会自动重新部署

### Q: 如何回滚到之前的版本？
**A**:
1. 在Vercel Dashboard中找到项目
2. 进入 "Deployments" 页面
3. 找到要回滚的版本，点击 "Promote to Production"

## 🎉 恭喜！

您的AI工具导航网站现在已经成功部署到生产环境！

**下一步建议**：
- 🔍 添加Google Analytics进行访问统计
- 📱 测试移动端用户体验
- 🎨 自定义网站样式和内容
- 📊 监控网站性能和用户反馈
- 🚀 考虑添加更多功能和优化

---

**需要帮助？** 查看项目的 `README.md` 或创建GitHub Issue。
