#!/bin/bash

# AI工具导航网站数据库更新脚本
# 使用方法: ./scripts/update-database.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 开始更新AI工具导航网站数据库...${NC}"

# 检查必要文件
echo -e "${YELLOW}📋 检查数据库脚本文件...${NC}"

if [[ ! -f "database/init.sql" ]]; then
    echo -e "${RED}❌ 错误: database/init.sql 文件不存在${NC}"
    exit 1
fi

if [[ ! -f "database/seed.sql" ]]; then
    echo -e "${RED}❌ 错误: database/seed.sql 文件不存在${NC}"
    exit 1
fi

if [[ ! -f "database/seed_extended.sql" ]]; then
    echo -e "${RED}❌ 错误: database/seed_extended.sql 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 所有数据库脚本文件检查完成${NC}"

# 检查环境变量
echo -e "${YELLOW}🔧 检查环境配置...${NC}"

if [[ ! -f ".env.local" ]]; then
    echo -e "${RED}❌ 错误: .env.local 文件不存在${NC}"
    echo -e "${YELLOW}💡 请先配置 Supabase 环境变量${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境配置检查完成${NC}"

# 显示数据库脚本信息
echo -e "${BLUE}📊 数据库更新内容:${NC}"
echo -e "   📄 init.sql - 创建表结构、索引、触发器"
echo -e "   📄 seed.sql - 基础示例数据 (AI写作工具 10个 + 图像生成工具 10个)"
echo -e "   📄 seed_extended.sql - 扩展数据 (代码编程工具 10个 + 音频处理工具 10个)"
echo ""

# 询问用户确认
echo -e "${YELLOW}⚠️  注意: 此操作将会清空现有数据并重新初始化数据库${NC}"
read -p "是否继续? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ 操作已取消${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 开始执行数据库更新...${NC}"

# 显示Supabase使用说明
echo -e "${YELLOW}📝 请按以下步骤在 Supabase 中执行:${NC}"
echo ""
echo -e "${BLUE}1. 登录 Supabase 控制台${NC}"
echo -e "   访问: https://supabase.com"
echo -e "   选择您的项目"
echo ""
echo -e "${BLUE}2. 打开 SQL 编辑器${NC}"
echo -e "   点击左侧菜单的 'SQL Editor'"
echo -e "   点击 'New Query'"
echo ""
echo -e "${BLUE}3. 执行初始化脚本${NC}"
echo -e "   复制并执行: database/init.sql"
echo -e "   等待执行完成"
echo ""
echo -e "${BLUE}4. 执行基础数据脚本${NC}"
echo -e "   复制并执行: database/seed.sql"
echo -e "   等待执行完成"
echo ""
echo -e "${BLUE}5. 执行扩展数据脚本${NC}"
echo -e "   复制并执行: database/seed_extended.sql"
echo -e "   等待执行完成"
echo ""

# 显示脚本内容统计
echo -e "${GREEN}📈 数据统计:${NC}"
echo -e "   🏷️  分类: 8个 (AI写作、图像生成、代码编程、音频处理等)"
echo -e "   🛠️  工具: 40个 (每个分类10个优质工具)"
echo -e "   👥 用户: 4个 (1个管理员 + 3个普通用户)"
echo -e "   ⭐ 评分: 8条示例评分"
echo -e "   💖 收藏: 8条示例收藏"
echo -e "   ⚙️  设置: 8项系统配置"
echo ""

# 显示完成后的操作建议
echo -e "${GREEN}🎉 数据库更新完成后，您可以:${NC}"
echo -e "   1. 刷新网站页面查看新数据"
echo -e "   2. 注册新用户并在数据库中将角色改为 'admin'"
echo -e "   3. 访问 /admin 页面进行管理"
echo -e "   4. 测试工具提交、评分、收藏等功能"
echo ""

echo -e "${BLUE}📁 相关文件位置:${NC}"
echo -e "   📄 database/init.sql - 表结构初始化"
echo -e "   📄 database/seed.sql - 基础示例数据"
echo -e "   📄 database/seed_extended.sql - 扩展示例数据"
echo -e "   📄 .env.local - 环境配置"
echo ""

echo -e "${GREEN}✅ 数据库更新脚本执行完成!${NC}"
echo -e "${YELLOW}💡 请按照上述步骤在 Supabase 中执行 SQL 脚本${NC}"
