#!/bin/bash

# 🚀 AI工具导航 - 快速部署脚本
# 此脚本帮助您快速设置GitHub仓库并准备Vercel部署

echo "🤖 AI工具导航 - 快速部署设置"
echo "=================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo "📝 初始化Git仓库..."
    git init
    echo "✅ Git仓库已初始化"
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 添加所有文件到Git..."
    git add .
    
    echo "💬 提交代码..."
    git commit -m "🎉 Initial commit: AI工具导航 - 智能搜索与推荐平台

✨ 功能特性:
- 🔍 智能搜索系统 (实时建议、搜索历史、热门搜索)
- 🤖 AI推荐算法 (个性化推荐、协同过滤、内容推荐)
- 👥 完整用户系统 (注册登录、个人中心、收藏系统)
- 💬 评论评分系统
- 🔔 通知系统
- 📊 管理后台
- 📱 响应式设计

🛠️ 技术栈:
- Next.js 14 + TypeScript
- Tailwind CSS + Radix UI
- Supabase (PostgreSQL)
- Vercel 部署就绪

🚀 特色:
- 渐进式增强设计 (无需数据库迁移即可使用)
- 优雅降级处理
- 现代化UI/UX
- 生产就绪"
    
    echo "✅ 代码已提交"
else
    echo "✅ 代码已是最新状态"
fi

echo ""
echo "🐙 GitHub设置指南"
echo "=================="
echo "1. 访问 https://github.com/new"
echo "2. 创建新仓库："
echo "   - Repository name: ai-tools-navigator"
echo "   - Description: 🤖 AI工具导航 - 智能搜索与推荐平台"
echo "   - 选择 Public 或 Private"
echo "   - 不要勾选任何初始化选项"
echo "3. 创建后，复制仓库URL"

echo ""
read -p "请输入您的GitHub仓库URL (例如: https://github.com/username/ai-tools-navigator.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ 未输入仓库URL，跳过远程仓库设置"
else
    echo "🔗 添加远程仓库..."
    git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
    
    echo "📤 推送代码到GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ 代码已成功推送到GitHub"
    else
        echo "❌ 推送失败，请检查仓库URL和权限"
        echo "💡 您可以手动执行："
        echo "   git remote add origin $REPO_URL"
        echo "   git branch -M main"
        echo "   git push -u origin main"
    fi
fi

echo ""
echo "⚡ Vercel部署指南"
echo "================"
echo "1. 访问 https://vercel.com"
echo "2. 使用GitHub账户登录"
echo "3. 点击 'New Project'"
echo "4. 导入您的GitHub仓库"
echo "5. 配置环境变量："
echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo "6. 点击 'Deploy'"

echo ""
echo "📊 项目健康检查"
echo "================"
echo "部署完成后，运行以下命令检查项目状态："
echo "npm run health-check"

echo ""
echo "📚 更多信息"
echo "==========="
echo "- 详细部署指南: DEPLOYMENT_GUIDE.md"
echo "- 数据库设置: DATABASE_SETUP.md"
echo "- 项目状态: PROJECT_STATUS.md"

echo ""
echo "🎉 设置完成！"
echo "============="
echo "您的项目现在已准备好部署到Vercel。"
echo "按照上面的Vercel部署指南完成最后的部署步骤。"

echo ""
echo "🔗 有用的链接："
echo "- GitHub: https://github.com"
echo "- Vercel: https://vercel.com"
echo "- Supabase: https://supabase.com/dashboard"

echo ""
echo "💡 提示：如果遇到问题，请查看 DEPLOYMENT_GUIDE.md 获取详细帮助。"
