# 🔐 登录问题修复指南

## 🚨 当前问题：登录一直显示"登录中..."

您遇到的问题是登录按钮一直显示"登录中..."状态，这通常是由以下原因造成的：

### 🔍 可能的原因

1. **数据库连接问题** - Supabase配置错误
2. **用户不存在** - 尝试登录的用户未在数据库中
3. **密码错误** - 密码不匹配
4. **邮箱验证** - 用户需要验证邮箱
5. **网络问题** - 请求被阻止或超时
6. **浏览器缓存** - 缓存冲突

## 🛠️ 立即解决方案

### 方案1: 使用诊断工具（推荐）

1. **访问诊断页面**：
   ```
   http://localhost:3000/test-login
   ```

2. **按顺序测试**：
   - 点击"测试数据库连接"
   - 点击"查询用户列表"
   - 点击"测试注册"（如果用户不存在）
   - 点击"测试登录"

3. **查看结果**：
   - 绿色表示成功
   - 红色表示失败，查看错误信息

### 方案2: 先注册再登录

1. **访问注册页面**：
   ```
   http://localhost:3000/register
   ```

2. **注册新账号**：
   - 邮箱：使用真实邮箱
   - 密码：至少6位
   - 姓名：任意

3. **检查邮箱验证**：
   - 查看是否需要邮箱验证
   - 如果需要，点击验证链接

4. **尝试登录**：
   - 使用注册的邮箱和密码

### 方案3: 使用预设账号

如果您已经执行了数据库脚本，可以尝试：

- **邮箱**: `admin@aitools.com`
- **密码**: 需要在Supabase Auth中设置

但这个账号可能无法直接登录，因为Supabase Auth中没有对应记录。

## 🔧 详细排查步骤

### 1. 检查浏览器控制台

1. 打开开发者工具 (F12)
2. 查看Console标签页的错误信息
3. 查看Network标签页的请求状态

### 2. 检查数据库连接

运行诊断脚本：
```bash
node scripts/diagnose-login.js
```

### 3. 检查Supabase配置

确认 `.env.local` 文件包含正确的配置：
```bash
cat .env.local
```

应该看到：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. 检查用户表

在Supabase控制台中查询：
```sql
SELECT * FROM users LIMIT 10;
```

### 5. 检查认证设置

在Supabase控制台的Authentication设置中：
- 确认"Enable email confirmations"设置
- 检查"Site URL"配置

## 🎯 快速测试流程

1. **访问诊断页面**: `http://localhost:3000/test-login`
2. **测试数据库连接**: 确认基础连接正常
3. **查询用户列表**: 查看现有用户
4. **测试注册**: 创建新用户
5. **测试登录**: 验证登录功能

## 🔄 常见解决方案

### 解决方案1: 重新创建用户

```sql
-- 在Supabase SQL编辑器中执行
INSERT INTO users (
    id, email, name, role, status, email_verified
) VALUES (
    gen_random_uuid(),
    'test@example.com',
    '测试用户',
    'user',
    'active',
    true
);
```

然后在Supabase Auth中创建对应的认证用户。

### 解决方案2: 清理缓存

```bash
# 清理Next.js缓存
rm -rf .next

# 清理浏览器缓存
# 使用无痕模式或清空缓存

# 重启服务器
pnpm dev
```

### 解决方案3: 检查RLS策略

确认users表的RLS策略允许读取：
```sql
-- 查看当前策略
SELECT * FROM pg_policies WHERE tablename = 'users';

-- 如果需要，临时禁用RLS进行测试
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

## 📞 获取详细错误信息

1. **浏览器控制台**: 查看JavaScript错误
2. **网络请求**: 查看API调用状态
3. **Supabase日志**: 在Supabase控制台查看日志
4. **服务器日志**: 查看终端输出

## 🎉 成功标志

登录修复成功后，您应该看到：

1. ✅ 登录按钮不再卡在"登录中..."
2. ✅ 成功跳转到首页或仪表板
3. ✅ 右上角显示用户信息
4. ✅ 可以访问用户相关功能

---

**建议**: 先使用诊断工具 `http://localhost:3000/test-login` 来快速定位问题！
