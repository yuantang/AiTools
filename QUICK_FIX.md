# 🚨 主键冲突错误快速修复

## 问题描述
您遇到了这个错误：
```
ERROR: 23505: duplicate key value violates unique constraint "categories_pkey"
DETAIL: Key (id)=(550e8400-e29b-41d4-a716-446655440001) already exists.
```

## 🔧 立即解决方案

### 方案1：使用更新后的脚本（推荐）

我已经更新了 `database/seed.sql` 脚本，现在它会自动清理现有数据。

**步骤：**
1. 在 Supabase SQL 编辑器中
2. 复制并执行 `database/seed.sql` 的全部内容
3. 等待执行完成
4. 复制并执行 `database/seed_extended.sql` 的全部内容

### 方案2：手动清理后重新插入

如果方案1不工作，请按以下步骤：

**第一步：清理现有数据**
```sql
-- 复制以下内容到 Supabase SQL 编辑器并执行

-- 禁用外键检查
SET session_replication_role = replica;

-- 按依赖关系顺序删除数据
DELETE FROM tool_ratings;
DELETE FROM user_favorites;
DELETE FROM system_settings;
DELETE FROM tools;
DELETE FROM categories;
DELETE FROM users;

-- 重新启用外键检查
SET session_replication_role = DEFAULT;

SELECT 'Database cleaned successfully' as status;
```

**第二步：重新插入数据**
1. 执行 `database/seed.sql` 的全部内容
2. 执行 `database/seed_extended.sql` 的全部内容

## ⚠️ 重要提醒

- 清理操作会删除所有现有数据
- 如果您有重要数据，请先备份
- 按顺序执行，不要跳过步骤

## 🎯 执行后效果

成功后您将看到：
- 40个AI工具（4个分类，每个10个）
- 图片加载正常
- 完整的用户、评分、收藏数据

## 📞 如果仍有问题

1. 检查 Supabase 控制台的错误信息
2. 确保按正确顺序执行脚本
3. 检查网络连接和权限设置

---

**快速执行命令：**
```bash
# 查看详细说明
cat DATABASE_UPDATE.md

# 或运行更新脚本
./scripts/update-database.sh
```
