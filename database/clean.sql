-- AI工具导航网站数据库清理脚本
-- 此脚本将清空所有表的数据，请谨慎使用

-- 禁用外键检查（如果支持）
SET session_replication_role = replica;

-- 按依赖关系顺序删除数据
-- 1. 删除依赖表数据
DELETE FROM tool_ratings;
DELETE FROM user_favorites;
DELETE FROM system_settings;

-- 2. 删除工具数据
DELETE FROM tools;

-- 3. 删除分类和用户数据
DELETE FROM categories;
DELETE FROM users;

-- 重新启用外键检查
SET session_replication_role = DEFAULT;

-- 重置序列（如果有自增字段）
-- 注意：UUID字段不需要重置序列

-- 显示清理结果
SELECT 'Database cleaned successfully' as status;
