#!/bin/bash

# AI工具导航网站部署脚本
# 使用方法: ./scripts/deploy.sh [environment]
# 环境: development, staging, production

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取环境参数
ENVIRONMENT=${1:-development}

echo -e "${BLUE}🚀 开始部署 AI工具导航网站 (环境: $ENVIRONMENT)${NC}"

# 检查环境
if [[ "$ENVIRONMENT" != "development" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ 错误: 无效的环境参数. 请使用: development, staging, 或 production${NC}"
    exit 1
fi

# 检查必要的工具
echo -e "${YELLOW}📋 检查必要工具...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm 未安装，尝试使用 npm...${NC}"
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 也未安装${NC}"
        exit 1
    fi
    PACKAGE_MANAGER="npm"
else
    PACKAGE_MANAGER="pnpm"
fi

echo -e "${GREEN}✅ 工具检查完成${NC}"

# 检查环境变量文件
echo -e "${YELLOW}🔧 检查环境配置...${NC}"

ENV_FILE=".env.local"
if [[ "$ENVIRONMENT" == "staging" ]]; then
    ENV_FILE=".env.staging"
elif [[ "$ENVIRONMENT" == "production" ]]; then
    ENV_FILE=".env.production"
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo -e "${RED}❌ 环境配置文件 $ENV_FILE 不存在${NC}"
    echo -e "${YELLOW}💡 请复制 .env.example 并配置相应的环境变量${NC}"
    exit 1
fi

# 检查必要的环境变量
source "$ENV_FILE"
if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" || -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]]; then
    echo -e "${RED}❌ 缺少必要的 Supabase 配置${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 环境配置检查完成${NC}"

# 安装依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
$PACKAGE_MANAGER install

# 运行类型检查
echo -e "${YELLOW}🔍 运行类型检查...${NC}"
$PACKAGE_MANAGER run lint

# 构建项目
echo -e "${YELLOW}🏗️  构建项目...${NC}"
if [[ "$ENVIRONMENT" == "production" ]]; then
    NODE_ENV=production $PACKAGE_MANAGER run build
else
    $PACKAGE_MANAGER run build
fi

echo -e "${GREEN}✅ 构建完成${NC}"

# 根据环境执行不同的部署策略
case $ENVIRONMENT in
    "development")
        echo -e "${YELLOW}🚀 启动开发服务器...${NC}"
        $PACKAGE_MANAGER run dev
        ;;
    "staging")
        echo -e "${YELLOW}🚀 启动预览服务器...${NC}"
        $PACKAGE_MANAGER run start
        ;;
    "production")
        echo -e "${GREEN}🎉 生产环境构建完成!${NC}"
        echo -e "${BLUE}📝 部署说明:${NC}"
        echo -e "   1. 将 .next 文件夹上传到服务器"
        echo -e "   2. 确保服务器已安装 Node.js 18+"
        echo -e "   3. 运行: $PACKAGE_MANAGER run start"
        echo -e "   4. 或使用 PM2: pm2 start ecosystem.config.js"
        ;;
esac

echo -e "${GREEN}🎉 部署完成!${NC}"
