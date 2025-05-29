# 🗄️ 数据库设置指南

## 📋 概述

本项目的搜索优化和AI推荐功能需要额外的数据库表。项目已经设计为**渐进式增强**，即使没有这些表也能正常运行，但创建这些表后将获得完整功能。

## 🚀 快速开始

### 当前状态
- ✅ **项目可以正常运行** - 无需数据库迁移
- ✅ **基础功能可用** - 搜索、推荐等核心功能正常工作
- ⚠️ **高级功能需要数据库表** - 搜索历史、个性化推荐等

### 立即可用的功能
- 🔍 智能搜索（基于工具名称和描述）
- 🤖 热门推荐（基于评分和热度）
- 🎯 相似工具推荐（基于分类和标签）
- 📱 响应式用户界面

## 🛠️ 数据库表创建步骤

### 方法一：Supabase Dashboard（推荐）

1. **登录 Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **选择您的项目**
   - 找到并点击您的AI工具导航项目

3. **打开 SQL Editor**
   - 在左侧菜单中点击 "SQL Editor"
   - 点击 "New query"

4. **执行数据库迁移**
   - 复制 `database/safe-migration.sql` 文件的全部内容（推荐）
   - 或者使用 `database/simple-search-migration.sql`（如果遇到问题）
   - 粘贴到 SQL Editor 中
   - 点击 "Run" 按钮执行

5. **验证创建结果**
   - 在左侧菜单点击 "Table Editor"
   - 确认以下表已创建：
     - `search_history`
     - `popular_searches`
     - `search_suggestions`
     - `user_behaviors`
     - `tool_similarities`
     - `user_recommendations`
     - `user_preferences`

### 方法二：命令行（高级用户）

如果您有 Supabase CLI：

```bash
# 安装 Supabase CLI（如果未安装）
npm install -g supabase

# 登录
supabase login

# 链接到您的项目
supabase link --project-ref YOUR_PROJECT_REF

# 执行迁移
supabase db push
```

## 📊 新增表说明

### 核心表结构

| 表名 | 用途 | 影响功能 |
|------|------|----------|
| `search_history` | 用户搜索历史 | 搜索历史显示、个性化建议 |
| `popular_searches` | 热门搜索统计 | 热门搜索展示、趋势分析 |
| `search_suggestions` | 搜索建议 | 智能搜索建议 |
| `user_behaviors` | 用户行为追踪 | 个性化推荐、行为分析 |
| `tool_similarities` | 工具相似度 | 相似工具推荐优化 |
| `user_recommendations` | 用户推荐记录 | 个性化推荐历史 |
| `user_preferences` | 用户偏好 | 个性化推荐算法 |

### 示例数据

迁移脚本会自动插入以下示例数据：

**搜索建议**：
- AI写作助手、AI图像生成、ChatGPT等

**热门搜索**：
- ChatGPT、Midjourney、GitHub Copilot等

## 🎯 功能对比

### 创建表前 vs 创建表后

| 功能 | 创建表前 | 创建表后 |
|------|----------|----------|
| 基础搜索 | ✅ 可用 | ✅ 增强 |
| 搜索建议 | ✅ 基于工具名 | ✅ 智能建议 |
| 搜索历史 | ⚠️ 本地存储 | ✅ 云端同步 |
| 热门搜索 | ✅ 静态数据 | ✅ 实时统计 |
| 工具推荐 | ✅ 基于评分 | ✅ 个性化推荐 |
| 相似工具 | ✅ 基于分类 | ✅ 智能相似度 |
| 用户行为 | ❌ 无追踪 | ✅ 完整追踪 |
| 推荐解释 | ❌ 无 | ✅ 详细理由 |

## 🔧 故障排除

### 常见问题

**Q: 执行SQL时出现权限错误**
```
A: 确保您是项目的所有者或具有数据库管理权限
```

**Q: 表已存在错误**
```
A: 这是正常的，脚本使用 CREATE TABLE IF NOT EXISTS，重复执行是安全的
```

**Q: 外键约束错误**
```
A: 确保基础表（users, tools, categories）已存在且有数据
```

**Q: ON CONFLICT 错误 (42P10)**
```
A: 使用 database/safe-migration.sql 脚本，它避免了所有冲突问题
```

**Q: 索引创建失败**
```
A: 某些索引可能已存在，这不影响功能，可以忽略
```

### 验证安装

执行以下查询验证表是否正确创建：

```sql
-- 检查所有新表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'search_history',
  'popular_searches',
  'search_suggestions',
  'user_behaviors',
  'tool_similarities',
  'user_recommendations',
  'user_preferences'
);

-- 检查示例数据
SELECT COUNT(*) as suggestion_count FROM search_suggestions;
SELECT COUNT(*) as popular_count FROM popular_searches;
```

## 📈 性能优化

### 自动创建的索引

迁移脚本会自动创建以下性能优化索引：

- 用户行为查询索引
- 搜索历史索引
- 推荐算法索引
- 相似度计算索引

### 定期维护

建议定期执行以下维护任务：

```sql
-- 清理90天前的搜索历史
DELETE FROM search_history
WHERE created_at < NOW() - INTERVAL '90 days';

-- 清理过期的推荐
DELETE FROM user_recommendations
WHERE expires_at < NOW();

-- 更新热门搜索统计
-- (这通常由应用程序自动处理)
```

## 🎉 完成后的功能

创建表后，您将获得：

- 🔍 **智能搜索体验** - 实时建议、历史记录
- 🤖 **个性化推荐** - 基于用户行为的智能推荐
- 📊 **用户行为分析** - 完整的用户交互追踪
- 🎯 **精准相似推荐** - 基于多维度相似度算法
- 📈 **实时热度统计** - 动态的热门搜索和工具排行

## 🆘 需要帮助？

如果在设置过程中遇到问题：

1. 检查 Supabase 项目状态
2. 确认数据库连接正常
3. 查看 Supabase Dashboard 的日志
4. 确保有足够的数据库权限

项目设计为渐进式增强，即使遇到问题也不会影响基础功能的使用。
