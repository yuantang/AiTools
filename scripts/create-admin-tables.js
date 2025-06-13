const { createClient } = require('@supabase/supabase-js')

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminTables() {
  try {
    console.log('正在创建管理后台表...')

    // 创建系统设置表
    console.log('创建 system_settings 表...')
    const { error: settingsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS system_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          key VARCHAR(100) UNIQUE NOT NULL,
          value TEXT NOT NULL,
          type VARCHAR(20) DEFAULT 'string',
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (settingsError) {
      console.log('system_settings 表可能已存在')
    }

    // 插入默认设置
    console.log('插入默认系统设置...')
    const defaultSettings = [
      { key: 'site_name', value: 'AI工具导航', type: 'string', description: '网站名称' },
      { key: 'site_description', value: '发现和分享最好的AI工具', type: 'string', description: '网站描述' },
      { key: 'enable_user_registration', value: 'true', type: 'boolean', description: '允许用户注册' },
      { key: 'enable_tool_submission', value: 'true', type: 'boolean', description: '允许工具提交' },
      { key: 'auto_approve_tools', value: 'false', type: 'boolean', description: '自动审核通过工具' },
    ]

    for (const setting of defaultSettings) {
      const { error } = await supabase
        .from('system_settings')
        .upsert(setting, { onConflict: 'key' })

      if (error) {
        console.warn(`插入设置 ${setting.key} 失败:`, error.message)
      }
    }

    console.log('管理后台表创建完成!')

  } catch (error) {
    console.error('创建管理后台表时发生错误:', error)
  }
}

createAdminTables()
