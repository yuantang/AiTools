-- 管理后台相关表结构

-- 系统设置表
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 管理员操作日志表
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('info', 'warning', 'error')),
    action VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 页面访问统计表（用于分析）
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(500) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_level ON admin_logs(level);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);

-- 创建更新时间触发器
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认系统设置
INSERT INTO system_settings (key, value, type, description) VALUES
('site_name', 'AI工具导航', 'string', '网站名称'),
('site_description', '发现和分享最好的AI工具', 'string', '网站描述'),
('site_url', 'https://aitools.com', 'string', '网站地址'),
('admin_email', 'admin@aitools.com', 'string', '管理员邮箱'),
('support_email', 'support@aitools.com', 'string', '客服邮箱'),
('enable_user_registration', 'true', 'boolean', '允许用户注册'),
('enable_tool_submission', 'true', 'boolean', '允许工具提交'),
('enable_comments', 'true', 'boolean', '启用评论功能'),
('enable_ratings', 'true', 'boolean', '启用评分功能'),
('enable_favorites', 'true', 'boolean', '启用收藏功能'),
('require_email_verification', 'true', 'boolean', '需要邮箱验证'),
('auto_approve_tools', 'false', 'boolean', '自动审核通过工具'),
('moderation_level', 'strict', 'string', '审核严格程度'),
('spam_filter_enabled', 'true', 'boolean', '启用垃圾内容过滤'),
('email_notifications', 'true', 'boolean', '启用邮件通知'),
('push_notifications', 'false', 'boolean', '启用推送通知'),
('slack_webhook', '', 'string', 'Slack Webhook URL'),
('meta_title', 'AI工具导航 - 发现最好的AI工具', 'string', '页面标题'),
('meta_description', '收录全球最新最热门的AI产品，帮助您快速找到适合的AI工具', 'string', '页面描述'),
('meta_keywords', 'AI工具,人工智能,机器学习,深度学习', 'string', '关键词'),
('enable_two_factor', 'false', 'boolean', '启用双因素认证'),
('session_timeout', '24', 'number', '会话超时时间（小时）'),
('max_login_attempts', '5', 'number', '最大登录尝试次数'),
('auto_backup', 'true', 'boolean', '自动备份'),
('backup_frequency', 'daily', 'string', '备份频率'),
('backup_retention', '30', 'number', '备份保留天数')
ON CONFLICT (key) DO NOTHING;

-- 插入一些示例日志
INSERT INTO admin_logs (user_id, level, action, message, ip_address) VALUES
(NULL, 'info', 'system_init', '系统初始化完成', '127.0.0.1'),
(NULL, 'info', 'database_setup', '数据库表结构创建完成', '127.0.0.1');
