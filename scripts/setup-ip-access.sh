#!/bin/bash

# IP访问配置脚本

echo "🌐 配置IP访问..."

# 获取本机IP地址
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

if [ -z "$IP" ]; then
    echo "❌ 无法获取IP地址"
    exit 1
fi

echo "📍 检测到IP地址: $IP"

# 备份原始配置
cp .env.local .env.local.backup
echo "💾 已备份 .env.local 到 .env.local.backup"

# 更新环境变量
sed -i.bak "s|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=http://$IP:3000|g" .env.local
echo "✅ 已更新 NEXT_PUBLIC_SITE_URL 为 http://$IP:3000"

# 检查package.json是否已配置
if grep -q "next dev -H 0.0.0.0" package.json; then
    echo "✅ package.json 已配置IP访问"
else
    echo "⚠️ 需要手动更新package.json中的dev脚本"
    echo "   将 'next dev' 改为 'next dev -H 0.0.0.0'"
fi

echo ""
echo "🎉 IP访问配置完成！"
echo ""
echo "📋 访问地址:"
echo "   本地访问: http://localhost:3000"
echo "   IP访问:   http://$IP:3000"
echo ""
echo "🔧 下一步:"
echo "1. 重启开发服务器: pnpm dev"
echo "2. 在浏览器中访问: http://$IP:3000"
echo "3. 确保防火墙允许3000端口访问"
echo ""
echo "📱 移动设备访问:"
echo "   确保设备连接到同一WiFi网络"
echo "   在移动浏览器中访问: http://$IP:3000"
echo ""
echo "🔒 安全提醒:"
echo "   - 仅在可信网络中使用IP访问"
echo "   - 生产环境请使用HTTPS"
echo "   - 考虑配置防火墙规则"
