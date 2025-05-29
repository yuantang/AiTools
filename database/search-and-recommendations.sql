-- 搜索和推荐功能相关表结构

-- 搜索历史表
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

-- 热门搜索表
CREATE TABLE IF NOT EXISTS popular_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    query TEXT UNIQUE NOT NULL,
    search_count INTEGER DEFAULT 1,
    click_count INTEGER DEFAULT 0,
    last_searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 搜索建议表
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

-- 用户行为表
CREATE TABLE IF NOT EXISTS user_behaviors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    behavior_type VARCHAR(50) NOT NULL, -- 'view', 'favorite', 'unfavorite', 'rate', 'comment', 'share', 'click'
    behavior_data JSONB DEFAULT '{}', -- 存储额外的行为数据，如评分值、停留时间等
    session_id TEXT,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 工具相似度表
CREATE TABLE IF NOT EXISTS tool_similarities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_a_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    tool_b_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    similarity_score DECIMAL(5,4) NOT NULL, -- 0.0000 到 1.0000
    similarity_type VARCHAR(50) NOT NULL, -- 'content', 'category', 'tags', 'user_behavior', 'hybrid'
    calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tool_a_id, tool_b_id, similarity_type)
);

-- 用户推荐表
CREATE TABLE IF NOT EXISTS user_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL, -- 'collaborative', 'content_based', 'popular', 'trending', 'hybrid'
    score DECIMAL(5,4) NOT NULL, -- 推荐分数 0.0000 到 1.0000
    reason TEXT, -- 推荐理由
    recommendation_data JSONB DEFAULT '{}', -- 推荐相关数据
    is_clicked BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户偏好表
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    preferred_categories UUID[] DEFAULT '{}', -- 偏好分类ID数组
    preferred_tags TEXT[] DEFAULT '{}', -- 偏好标签数组
    preferred_pricing_types TEXT[] DEFAULT '{}', -- 偏好定价类型
    preferred_platforms TEXT[] DEFAULT '{}', -- 偏好平台
    interaction_weights JSONB DEFAULT '{}', -- 各种交互行为的权重
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
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

-- 创建全文搜索索引（PostgreSQL）
-- 注意：由于函数不是IMMUTABLE，我们需要创建一个IMMUTABLE函数或使用其他方法
-- 这里我们先创建基本的文本索引
CREATE INDEX IF NOT EXISTS idx_tools_name_search ON tools USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_tools_description_search ON tools USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_tools_tags_search ON tools USING gin(tags);

-- 创建触发器来自动更新热门搜索
CREATE OR REPLACE FUNCTION update_popular_searches()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO popular_searches (query, search_count, last_searched_at)
    VALUES (NEW.query, 1, NEW.created_at)
    ON CONFLICT (query)
    DO UPDATE SET
        search_count = popular_searches.search_count + 1,
        last_searched_at = NEW.created_at,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_popular_searches
    AFTER INSERT ON search_history
    FOR EACH ROW
    EXECUTE FUNCTION update_popular_searches();

-- 创建触发器来更新用户偏好
CREATE OR REPLACE FUNCTION update_user_preferences()
RETURNS TRIGGER AS $$
DECLARE
    tool_category UUID;
    tool_tags TEXT[];
BEGIN
    -- 获取工具的分类和标签
    SELECT category_id, tags INTO tool_category, tool_tags
    FROM tools WHERE id = NEW.tool_id;

    -- 更新用户偏好
    INSERT INTO user_preferences (user_id, preferred_categories, preferred_tags, last_updated)
    VALUES (
        NEW.user_id,
        ARRAY[tool_category],
        tool_tags,
        NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
        preferred_categories = array_append(
            COALESCE(user_preferences.preferred_categories, '{}'),
            tool_category
        ),
        preferred_tags = array_cat(
            COALESCE(user_preferences.preferred_tags, '{}'),
            tool_tags
        ),
        last_updated = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_preferences
    AFTER INSERT ON user_behaviors
    FOR EACH ROW
    WHEN (NEW.behavior_type IN ('view', 'favorite', 'rate'))
    EXECUTE FUNCTION update_user_preferences();

-- 创建函数来计算工具相似度
CREATE OR REPLACE FUNCTION calculate_tool_similarity(tool_a UUID, tool_b UUID)
RETURNS DECIMAL AS $$
DECLARE
    similarity_score DECIMAL := 0.0;
    category_match BOOLEAN := false;
    tag_overlap INTEGER := 0;
    total_tags INTEGER := 0;
BEGIN
    -- 检查分类匹配
    SELECT COUNT(*) > 0 INTO category_match
    FROM tools t1, tools t2
    WHERE t1.id = tool_a AND t2.id = tool_b AND t1.category_id = t2.category_id;

    -- 计算标签重叠
    SELECT
        array_length(array_intersect(t1.tags, t2.tags), 1) as overlap,
        array_length(array_union(t1.tags, t2.tags), 1) as total
    INTO tag_overlap, total_tags
    FROM tools t1, tools t2
    WHERE t1.id = tool_a AND t2.id = tool_b;

    -- 计算相似度分数
    similarity_score := 0.0;

    -- 分类匹配权重 40%
    IF category_match THEN
        similarity_score := similarity_score + 0.4;
    END IF;

    -- 标签重叠权重 60%
    IF total_tags > 0 THEN
        similarity_score := similarity_score + (0.6 * tag_overlap / total_tags);
    END IF;

    RETURN similarity_score;
END;
$$ LANGUAGE plpgsql;

-- 创建视图来简化查询
CREATE OR REPLACE VIEW popular_tools_view AS
SELECT
    t.*,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(ub.view_count, 0) as behavior_view_count,
    COALESCE(ub.favorite_count, 0) as behavior_favorite_count
FROM tools t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN (
    SELECT
        tool_id,
        COUNT(CASE WHEN behavior_type = 'view' THEN 1 END) as view_count,
        COUNT(CASE WHEN behavior_type = 'favorite' THEN 1 END) as favorite_count
    FROM user_behaviors
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY tool_id
) ub ON t.id = ub.tool_id
WHERE t.status = 'active'
ORDER BY (t.rating * 0.3 + COALESCE(ub.view_count, 0) * 0.4 + COALESCE(ub.favorite_count, 0) * 0.3) DESC;
