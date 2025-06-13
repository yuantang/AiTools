# Vercel环境变量配置指南

## 🚨 当前问题

**错误**: `supabaseUrl is required`  
**原因**: Vercel环境变量未配置  
**解决方案**: 在Vercel项目设置中添加环境变量

## 🔧 环境变量配置

### 必需的环境变量

请在Vercel项目设置中添加以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xnhfhzuolbiqdrnyuwda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaGZoenVvbGJpcWRybnl1d2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzUwNDAsImV4cCI6MjA2MzkxMTA0MH0.lPrHB7aVCbZtVfRk9btrcRDqYPOKbxj4by93s71xqOY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuaGZoenVvbGJpcWRybnl1d2RhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODMzNTA0MCwiZXhwIjoyMDYzOTExMDQwfQ.FB5-sqwzsf-Oc1vck8extRLLgaz98vA_HuqvRUyVJ-8
```

### 可选的环境变量

```env
NEXT_PUBLIC_SITE_URL=https://ai-tools-git-main-yuantangs-projects.vercel.app
NEXT_PUBLIC_SITE_NAME=AI工具导航
NEXT_PUBLIC_SITE_DESCRIPTION=发现和分享最好的AI工具
```

## 📋 配置步骤

### 1. 访问Vercel项目设置
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择 `ai-tools` 项目
3. 点击 `Settings` 标签
4. 选择 `Environment Variables`

### 2. 添加环境变量
对于每个环境变量：
1. 点击 `Add New`
2. 输入变量名（如 `NEXT_PUBLIC_SUPABASE_URL`）
3. 输入变量值
4. 选择环境：`Production`, `Preview`, `Development`
5. 点击 `Save`

### 3. 重新部署
配置完环境变量后：
1. 返回 `Deployments` 标签
2. 点击最新部署的 `...` 菜单
3. 选择 `Redeploy`
4. 确认重新部署

## 🎯 验证步骤

### 部署成功后验证
1. **访问网站**: https://ai-tools-git-main-yuantangs-projects.vercel.app
2. **检查首页**: 应该显示342个AI工具
3. **测试搜索**: 搜索功能应该正常
4. **检查分类**: 63个分类应该正常显示
5. **测试用户功能**: 注册登录应该正常

### 常见问题排查
- **仍然显示错误**: 检查环境变量名称是否正确
- **数据库连接失败**: 检查Supabase URL和密钥
- **功能异常**: 检查SERVICE_ROLE_KEY是否配置

## 🚀 快速配置脚本

如果您有Vercel CLI，可以使用以下命令快速配置：

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# 重新部署
vercel --prod
```

## 📞 技术支持

### 如果仍有问题
1. **检查Supabase项目状态**
   - 确认项目未暂停
   - 检查API密钥是否有效

2. **验证环境变量**
   - 确认所有必需变量已添加
   - 检查变量值是否正确

3. **查看Vercel日志**
   - 检查Function Logs
   - 查看Runtime Logs

---

**下一步**: 配置环境变量后重新部署，网站应该正常运行！
