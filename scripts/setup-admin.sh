#!/bin/bash

# AI工具导航网站管理员账号设置脚本
# 使用方法: ./scripts/setup-admin.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 AI工具导航网站 - 管理员账号设置${NC}"
echo ""

# 检查环境
if [[ ! -f ".env.local" ]]; then
    echo -e "${RED}❌ 错误: .env.local 文件不存在${NC}"
    echo -e "${YELLOW}💡 请先配置 Supabase 环境变量${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查完成${NC}"
echo ""

# 显示设置选项
echo -e "${YELLOW}📋 管理员账号设置选项:${NC}"
echo ""
echo -e "${BLUE}选项1: 注册新账号后升级为管理员 (推荐)${NC}"
echo -e "   ✅ 完整的认证流程"
echo -e "   ✅ 可以正常登录"
echo -e "   ✅ 所有功能可用"
echo ""
echo -e "${BLUE}选项2: 使用预设管理员账号${NC}"
echo -e "   ⚠️  需要先执行数据库脚本"
echo -e "   ⚠️  无法直接登录"
echo -e "   ✅ 适合测试权限检查"
echo ""

# 询问用户选择
echo -e "${YELLOW}请选择设置方式:${NC}"
echo "1) 注册新账号后升级为管理员"
echo "2) 查看预设管理员账号信息"
echo "3) 创建测试管理员账号"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}🚀 选项1: 注册新账号后升级为管理员${NC}"
        echo ""
        echo -e "${YELLOW}步骤:${NC}"
        echo "1. 启动开发服务器: ${BLUE}pnpm dev${NC}"
        echo "2. 访问注册页面: ${BLUE}http://localhost:3000/register${NC}"
        echo "3. 注册一个新账号（记住邮箱地址）"
        echo "4. 在 Supabase SQL 编辑器中执行以下 SQL:"
        echo ""
        echo -e "${PURPLE}UPDATE users SET role = 'admin', status = 'active', email_verified = true WHERE email = 'your-email@example.com';${NC}"
        echo ""
        echo "5. 使用注册的邮箱和密码登录"
        echo "6. 访问管理后台: ${BLUE}http://localhost:3000/admin${NC}"
        ;;
    2)
        echo ""
        echo -e "${GREEN}📋 预设管理员账号信息${NC}"
        echo ""
        echo -e "${YELLOW}账号信息:${NC}"
        echo "邮箱: admin@aitools.com"
        echo "角色: admin"
        echo "状态: active"
        echo ""
        echo -e "${RED}⚠️  注意: 此账号无法直接登录${NC}"
        echo "因为 Supabase Auth 中没有对应的认证记录"
        echo ""
        echo -e "${YELLOW}如需使用此账号:${NC}"
        echo "1. 在 Supabase Auth 中手动创建用户"
        echo "2. 或使用选项1创建新的管理员账号"
        ;;
    3)
        echo ""
        echo -e "${GREEN}🧪 创建测试管理员账号${NC}"
        echo ""
        echo -e "${YELLOW}在 Supabase SQL 编辑器中执行:${NC}"
        echo ""
        echo -e "${PURPLE}-- 复制 scripts/create-admin.sql 的内容并执行${NC}"
        echo ""
        echo -e "${YELLOW}测试账号信息:${NC}"
        echo "邮箱: test-admin@aitools.com"
        echo "角色: admin"
        echo "状态: active"
        echo ""
        echo -e "${RED}⚠️  注意: 此账号仅用于测试，无法登录${NC}"
        ;;
    *)
        echo -e "${RED}❌ 无效选项${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📚 相关文档:${NC}"
echo "- 详细设置指南: ${YELLOW}ADMIN_SETUP.md${NC}"
echo "- 管理员SQL脚本: ${YELLOW}scripts/create-admin.sql${NC}"
echo "- 数据库更新指南: ${YELLOW}DATABASE_UPDATE.md${NC}"
echo ""

echo -e "${GREEN}🎯 设置完成后测试项目:${NC}"
echo "1. 登录管理员账号"
echo "2. 访问管理后台: /admin"
echo "3. 测试用户管理: /admin/users"
echo "4. 测试工具管理: /admin/tools"
echo "5. 测试分类管理: /admin/categories"
echo "6. 测试审核功能: /admin/audit"
echo "7. 测试系统设置: /admin/settings"
echo ""

echo -e "${GREEN}✅ 管理员账号设置指南完成!${NC}"
echo -e "${YELLOW}💡 请按照上述步骤完成管理员账号设置${NC}"
