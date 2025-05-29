-- 简化版搜索和推荐功能数据库迁移
-- 避免使用复杂的函数和触发器

-- 1. 搜索历史表
CREATE TABLE IF NOT EXISTS search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    clicked_tool_id UUID REFERENCES tools(id) ON DELETE SET NULL,
    search_filters JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 热门搜索表
CREATE TABLE IF NOT EXISTS popular_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT UNIQUE NOT NULL,
    search_count INTEGER DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 搜索建议表
CREATE TABLE IF NOT EXISTS search_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 用户行为表
CREATE TABLE IF NOT EXISTS user_behaviors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    behavior_type VARCHAR(50) NOT NULL,
    behavior_data JSONB DEFAULT '{}',
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 工具相似度表
CREATE TABLE IF NOT EXISTS tool_similarities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_a_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    tool_b_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    similarity_score DECIMAL(5,4) NOT NULL,
    similarity_type VARCHAR(50) NOT NULL,
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tool_a_id, tool_b_id, similarity_type)
);

-- 6. 用户推荐表
CREATE TABLE IF NOT EXISTS user_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    score DECIMAL(5,4) NOT NULL,
    reason TEXT,
    recommendation_data JSONB DEFAULT '{}',
    is_clicked BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. 用户偏好表
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_categories UUID[] DEFAULT '{}',
    preferred_tags TEXT[] DEFAULT '{}',
    preferred_pricing_types TEXT[] DEFAULT '{}',
    preferred_platforms TEXT[] DEFAULT '{}',
    interaction_weights JSONB DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建基本索引
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_popular_searches_query ON popular_searches(query);
CREATE INDEX IF NOT EXISTS idx_popular_searches_search_count ON popular_searches(search_count DESC);
CREATE INDEX IF NOT EXISTS idx_popular_searches_last_searched ON popular_searches(last_searched_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_suggestions_query ON search_suggestions(query);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_suggestion ON search_suggestions(suggestion);
CREATE INDEX IF NOT EXISTS idx_search_suggestions_active ON search_suggestions(is_active);

CREATE INDEX IF NOT EXISTS idx_user_behaviors_user_id ON user_behaviors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_tool_id ON user_behaviors(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_type ON user_behaviors(behavior_type);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_created_at ON user_behaviors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_behaviors_session ON user_behaviors(session_id);

CREATE INDEX IF NOT EXISTS idx_tool_similarities_tool_a ON tool_similarities(tool_a_id);
CREATE INDEX IF NOT EXISTS idx_tool_similarities_tool_b ON tool_similarities(tool_b_id);
CREATE INDEX IF NOT EXISTS idx_tool_similarities_score ON tool_similarities(similarity_score DESC);
CREATE INDEX IF NOT EXISTS idx_tool_similarities_type ON tool_similarities(similarity_type);

CREATE INDEX IF NOT EXISTS idx_user_recommendations_user_id ON user_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_tool_id ON user_recommendations(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_type ON user_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_score ON user_recommendations(score DESC);
CREATE INDEX IF NOT EXISTS idx_user_recommendations_expires ON user_recommendations(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- 创建简单的文本搜索索引
CREATE INDEX IF NOT EXISTS idx_tools_name_text ON tools(name);
CREATE INDEX IF NOT EXISTS idx_tools_description_text ON tools(description);

-- 插入一些示例搜索建议
INSERT INTO search_suggestions (query, suggestion, weight, is_active) VALUES
('ai', 'AI写作助手', 1.0, true),
('ai', 'AI图像生成', 0.9, true),
('chat', 'ChatGPT', 1.0, true),
('image', '图像生成工具', 0.8, true),
('code', '代码生成工具', 0.8, true),
('write', '写作助手', 0.7, true),
('design', '设计工具', 0.7, true),
('video', '视频编辑', 0.6, true),
('music', '音乐生成', 0.6, true),
('translate', '翻译工具', 0.5, true)
ON CONFLICT (query, suggestion) DO NOTHING;

-- 插入一些热门搜索示例
INSERT INTO popular_searches (query, search_count, click_count, last_searched_at) VALUES
('ChatGPT', 150, 120, NOW()),
('Midjourney', 120, 95, NOW()),
('GitHub Copilot', 100, 80, NOW()),
('Stable Diffusion', 90, 70, NOW()),
('Claude', 80, 60, NOW()),
('GPT-4', 75, 55, NOW()),
('DALL-E', 70, 50, NOW()),
('Notion AI', 65, 45, NOW()),
('Figma AI', 60, 40, NOW()),
('Canva AI', 55, 35, NOW())
ON CONFLICT (query) DO UPDATE SET
    search_count = popular_searches.search_count + EXCLUDED.search_count,
    click_count = popular_searches.click_count + EXCLUDED.click_count,
    last_searched_at = EXCLUDED.last_searched_at,
    updated_at = NOW();

-- 创建一些示例工具相似度数据（如果tools表中有数据的话）
-- 这部分需要在有实际工具数据后再执行

-- 创建视图来简化查询
CREATE OR REPLACE VIEW user_behavior_stats AS
SELECT 
    user_id,
    COUNT(*) as total_behaviors,
    COUNT(CASE WHEN behavior_type = 'view' THEN 1 END) as view_count,
    COUNT(CASE WHEN behavior_type = 'favorite' THEN 1 END) as favorite_count,
    COUNT(CASE WHEN behavior_type = 'rate' THEN 1 END) as rating_count,
    COUNT(CASE WHEN behavior_type = 'comment' THEN 1 END) as comment_count,
    COUNT(CASE WHEN behavior_type = 'share' THEN 1 END) as share_count,
    COUNT(DISTINCT tool_id) as unique_tools_interacted,
    MAX(created_at) as last_activity
FROM user_behaviors
GROUP BY user_id;

-- 创建工具热度视图
CREATE OR REPLACE VIEW tool_popularity AS
SELECT 
    t.id,
    t.name,
    t.category_id,
    COALESCE(ub.view_count, 0) as behavior_view_count,
    COALESCE(ub.favorite_count, 0) as behavior_favorite_count,
    COALESCE(ub.rating_count, 0) as behavior_rating_count,
    COALESCE(t.view_count, 0) + COALESCE(ub.view_count, 0) as total_views,
    COALESCE(t.favorite_count, 0) + COALESCE(ub.favorite_count, 0) as total_favorites,
    -- 计算热度分数 (浏览*1 + 收藏*3 + 评分*2)
    (COALESCE(t.view_count, 0) + COALESCE(ub.view_count, 0)) * 1 +
    (COALESCE(t.favorite_count, 0) + COALESCE(ub.favorite_count, 0)) * 3 +
    COALESCE(ub.rating_count, 0) * 2 as popularity_score
FROM tools t
LEFT JOIN (
    SELECT 
        tool_id,
        COUNT(CASE WHEN behavior_type = 'view' THEN 1 END) as view_count,
        COUNT(CASE WHEN behavior_type = 'favorite' THEN 1 END) as favorite_count,
        COUNT(CASE WHEN behavior_type = 'rate' THEN 1 END) as rating_count
    FROM user_behaviors
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY tool_id
) ub ON t.id = ub.tool_id
WHERE t.status = 'active'
ORDER BY popularity_score DESC;
