# 🚀 快速启动指南

## 🚨 当前问题：浏览器缓存冲突

您遇到的404错误是因为浏览器缓存了其他项目（Nuxt.js）的资源。

## 🔧 立即解决方案

### 方案1: 使用无痕模式（推荐）

1. **打开无痕窗口**：
   - Chrome: `Ctrl+Shift+N` (Windows) 或 `Cmd+Shift+N` (Mac)
   - Firefox: `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)
   - Safari: `Cmd+Shift+N` (Mac)

2. **访问网站**：
   ```
   http://localhost:3000
   ```

### 方案2: 清理浏览器缓存

1. **打开开发者工具**: 按 `F12`
2. **右键点击刷新按钮**
3. **选择**: "清空缓存并硬性重新加载"

### 方案3: 使用不同端口

```bash
# 停止当前服务器 (Ctrl+C)
# 使用不同端口启动
pnpm dev -- -p 3001
```

然后访问: `http://localhost:3001`

## ✅ 验证网站正常工作

网站正常工作时，您应该看到：

1. **首页**: AI工具导航网站
2. **无404错误**: 浏览器控制台没有资源加载错误
3. **正常样式**: 页面有正确的CSS样式

## 🎯 创建管理员账号步骤

网站正常工作后：

### 1. 注册新账号
访问: `http://localhost:3000/register`
- 填写邮箱、密码、姓名
- 完成注册

### 2. 升级为管理员
在 Supabase SQL 编辑器中执行：
```sql
UPDATE users 
SET role = 'admin', status = 'active', email_verified = true 
WHERE email = 'your-email@example.com';
```

### 3. 登录管理员账号
访问: `http://localhost:3000/login`
- 使用注册的邮箱和密码登录

### 4. 访问管理后台
访问: `http://localhost:3000/admin`

## 🛠️ 管理后台功能测试

登录后测试以下功能：

- **📊 仪表板**: `/admin` - 查看系统统计
- **👥 用户管理**: `/admin/users` - 管理用户
- **🛠️ 工具管理**: `/admin/tools` - 管理AI工具
- **🏷️ 分类管理**: `/admin/categories` - 管理分类
- **📝 审核中心**: `/admin/audit` - 审核提交
- **⚙️ 系统设置**: `/admin/settings` - 系统配置

## 🔍 故障排除

如果仍有问题：

1. **检查终端**: 确认没有编译错误
2. **检查环境变量**: 确认 `.env.local` 文件存在
3. **重启服务器**: `Ctrl+C` 然后 `pnpm dev`
4. **查看详细指南**: `TROUBLESHOOTING.md`

## 📞 快速诊断

运行以下命令检查状态：

```bash
# 检查服务器是否响应
curl http://localhost:3000

# 检查端口占用
lsof -i :3000

# 检查进程
ps aux | grep next
```

## 🎉 成功标志

当一切正常时，您应该看到：

1. ✅ 网站首页正常加载
2. ✅ 没有404错误
3. ✅ 可以注册和登录
4. ✅ 管理员可以访问 `/admin`
5. ✅ 所有管理功能正常

---

**重要提示**: 使用无痕模式是最快的解决方案！
