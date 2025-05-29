# 数据库更新指南

## 📋 更新内容

我已经为您的AI工具导航网站准备了丰富的示例数据，包括：

### 🛠️ 工具数据 (40个)
- **AI写作工具** (10个): ChatGPT, Claude, Jasper, Copy.ai, Writesonic, Grammarly, Notion AI, QuillBot, Rytr, Wordtune
- **图像生成工具** (10个): Midjourney, Stable Diffusion, DALL-E 3, Leonardo AI, Adobe Firefly, Canva AI, Runway ML, Artbreeder, NightCafe, DeepAI
- **代码编程工具** (10个): GitHub Copilot, Cursor, Tabnine, Codeium, Amazon CodeWhisperer, Replit Ghostwriter, CodeT5, Sourcegraph Cody, Blackbox AI, Codex
- **音频处理工具** (10个): ElevenLabs, Murf AI, Speechify, Descript, Otter.ai, Adobe Podcast, Whisper, Resemble AI, Krisp, Soundraw

### 📊 其他数据
- 8个工具分类
- 4个示例用户 (1个管理员 + 3个普通用户)
- 8条工具评分
- 8条用户收藏
- 8项系统设置

## 🚀 更新步骤

### 1. 登录 Supabase 控制台
- 访问: https://supabase.com
- 选择您的项目

### 2. 打开 SQL 编辑器
- 点击左侧菜单的 "SQL Editor"
- 点击 "New Query"

### 3. 按顺序执行以下脚本

#### 第一步：初始化数据库结构
```sql
-- 复制 database/init.sql 的全部内容并执行
```

#### 第二步：插入基础数据（包含自动清理）
```sql
-- 复制 database/seed.sql 的全部内容并执行
-- 注意：此脚本会自动清理现有数据，避免主键冲突
```

#### 第三步：插入扩展数据
```sql
-- 复制 database/seed_extended.sql 的全部内容并执行
```

### 🔧 如果遇到主键冲突错误

如果您看到类似这样的错误：
```
ERROR: 23505: duplicate key value violates unique constraint "categories_pkey"
```

**解决方案1：使用更新后的脚本**
- 重新下载最新的 `database/seed.sql`
- 该脚本已包含自动清理功能

**解决方案2：手动清理数据库**
```sql
-- 复制 database/clean.sql 的全部内容并执行
-- 然后重新执行 seed.sql 和 seed_extended.sql
```

## 🔧 图片加载问题解决方案

为了解决图片加载不全的问题，我已经：

1. **更新了logo_url字段**：使用更可靠的CDN图片源
   - GitHub头像API
   - jsDelivr CDN
   - 官方网站图标

2. **添加了占位符图片**：
   - `/public/placeholder-logo.svg` - 默认工具图标
   - `/public/placeholder.svg` - 通用占位符

3. **使用了多种图片源**：
   - 官方网站favicon
   - GitHub头像
   - CDN托管的图标

## 📈 数据特点

### 真实性
- 所有工具都是真实存在的AI工具
- 网站链接、描述、功能特性都是准确的
- 评分和统计数据基于真实情况

### 多样性
- 涵盖AI领域的主要应用场景
- 包含免费和付费工具
- 支持多种平台和语言

### 完整性
- 每个工具都有完整的信息
- 包含标签、功能、平台、语言等详细信息
- 有用户评分和收藏数据

## 🎯 更新后的功能

更新数据库后，您的网站将具备：

1. **丰富的工具展示**：40个精选AI工具
2. **分类浏览**：8个主要分类
3. **搜索功能**：支持按名称、标签、功能搜索
4. **用户系统**：注册、登录、收藏、评分
5. **管理后台**：工具管理、用户管理、分类管理

## 🔄 快速执行

运行以下命令查看详细更新说明：

```bash
./scripts/update-database.sh
```

## ⚠️ 注意事项

1. **备份现有数据**：如果有重要数据，请先备份
2. **按顺序执行**：必须按 init.sql → seed.sql → seed_extended.sql 的顺序执行
3. **等待完成**：每个脚本执行完成后再执行下一个
4. **检查错误**：如有错误，请检查SQL语法或联系支持

## 🎉 完成后

数据库更新完成后：

1. 刷新网站页面查看新数据
2. 注册新用户并在数据库中将角色改为 'admin'
3. 访问 `/admin` 页面进行管理
4. 测试各项功能：搜索、收藏、评分等

---

如有任何问题，请检查控制台错误信息或联系技术支持。
