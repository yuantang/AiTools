-- 创建管理员账号脚本
-- 使用方法：在 Supabase SQL 编辑器中执行此脚本

-- 方法1：创建新的管理员账号（推荐）
-- 注意：这个账号需要在 Supabase Auth 中也存在，所以建议先注册再修改角色

-- 如果您已经注册了账号，请将下面的 email 替换为您的邮箱
-- 然后执行这个 UPDATE 语句将您的账号设置为管理员
UPDATE users 
SET 
    role = 'admin',
    status = 'active',
    email_verified = true,
    updated_at = NOW()
WHERE email = 'your-email@example.com';  -- 请替换为您的邮箱

-- 方法2：直接插入管理员账号（仅用于测试）
-- 注意：这种方法创建的账号无法登录，因为 Supabase Auth 中没有对应记录
-- 仅用于测试数据库中的管理员权限检查

INSERT INTO users (
    id, 
    email, 
    name, 
    role, 
    status, 
    email_verified, 
    tools_submitted, 
    tools_approved,
    favorite_count,
    reputation_score,
    created_at,
    updated_at
) VALUES (
    '550e8400-e29b-41d4-a716-446655440999',  -- 固定ID用于测试
    'test-admin@aitools.com',
    '测试管理员',
    'admin',
    'active',
    true,
    0,
    0,
    0,
    100,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    role = 'admin',
    status = 'active',
    email_verified = true,
    updated_at = NOW();

-- 验证管理员账号是否创建成功
SELECT 
    id,
    email,
    name,
    role,
    status,
    email_verified,
    created_at
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
