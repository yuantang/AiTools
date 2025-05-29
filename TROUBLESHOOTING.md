# 🔧 故障排除指南

## 🚨 常见问题和解决方案

### 问题1: 404错误 - 资源找不到

**症状**: 浏览器显示 "Failed to load resource: the server responded with a status of 404 (Not Found)"

**可能原因**:
1. 浏览器缓存了其他项目的资源（如Nuxt.js项目）
2. Next.js编译缓存问题
3. 开发服务器没有正确启动

**解决方案**:

#### 方案1: 清理缓存并重启
```bash
# 停止开发服务器 (Ctrl+C)
# 清理Next.js缓存
rm -rf .next

# 清理node_modules (如果需要)
rm -rf node_modules
pnpm install

# 重新启动
pnpm dev
```

#### 方案2: 清理浏览器缓存
1. 打开浏览器开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择 "清空缓存并硬性重新加载"
4. 或者使用无痕模式访问

#### 方案3: 检查端口冲突
```bash
# 检查3000端口是否被占用
lsof -i :3000

# 如果被占用，杀死进程
kill -9 <PID>

# 或使用不同端口
pnpm dev -- -p 3001
```

### 问题2: 数据库连接错误

**症状**: 页面加载但显示数据库连接错误

**解决方案**:
1. 检查 `.env.local` 文件是否存在
2. 确认 Supabase 环境变量正确
3. 测试数据库连接

```bash
# 检查环境变量
cat .env.local

# 应该包含:
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 问题3: 编译错误

**症状**: 终端显示编译错误

**解决方案**:
1. 检查代码语法错误
2. 确认所有依赖已安装
3. 重新安装依赖

```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
pnpm install

# 检查TypeScript错误
pnpm run type-check
```

### 问题4: 管理员权限问题

**症状**: 无法访问 `/admin` 页面

**解决方案**:
1. 确认已登录
2. 检查用户角色是否为 `admin`
3. 清除浏览器localStorage

```sql
-- 在Supabase中检查用户角色
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';

-- 如果角色不是admin，更新为admin
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 🛠️ 调试步骤

### 1. 检查开发服务器状态
```bash
# 确认服务器正在运行
curl http://localhost:3000

# 应该返回HTML内容，不是404
```

### 2. 检查浏览器控制台
1. 打开开发者工具 (F12)
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页的失败请求

### 3. 检查环境配置
```bash
# 检查Node.js版本
node --version  # 应该 >= 18

# 检查pnpm版本
pnpm --version

# 检查项目依赖
pnpm list
```

### 4. 检查文件权限
```bash
# 确保有读写权限
ls -la .env.local
ls -la package.json
```

## 🔄 完整重置流程

如果问题持续存在，可以执行完整重置：

```bash
# 1. 停止所有进程
pkill -f "next dev"

# 2. 清理所有缓存
rm -rf .next
rm -rf node_modules
rm -rf .pnpm-store

# 3. 重新安装
pnpm install

# 4. 重新启动
pnpm dev
```

## 📞 获取帮助

如果问题仍然存在：

1. **检查日志**: 查看终端输出的详细错误信息
2. **检查网络**: 确认网络连接正常
3. **检查防火墙**: 确认3000端口没有被阻止
4. **重启系统**: 有时重启可以解决端口占用问题

## 🎯 快速诊断命令

```bash
# 一键诊断脚本
echo "=== 环境检查 ==="
node --version
pnpm --version

echo "=== 端口检查 ==="
lsof -i :3000

echo "=== 文件检查 ==="
ls -la .env.local
ls -la package.json

echo "=== 进程检查 ==="
ps aux | grep next
```

---

**记住**: 大多数问题都可以通过清理缓存和重启来解决！
