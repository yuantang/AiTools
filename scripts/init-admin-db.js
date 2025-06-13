const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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

async function initAdminDatabase() {
  try {
    console.log('正在初始化管理后台数据库...')

    // 读取SQL文件
    const sqlFile = path.join(__dirname, 'init-admin-tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    // 分割SQL语句（简单的分割，实际应用中可能需要更复杂的解析）
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`找到 ${statements.length} 个SQL语句`)

    // 执行每个SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`执行语句 ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement })
          
          if (error) {
            console.warn(`语句 ${i + 1} 执行警告:`, error.message)
          }
        } catch (err) {
          console.warn(`语句 ${i + 1} 执行失败:`, err.message)
        }
      }
    }

    // 验证表是否创建成功
    console.log('验证表结构...')
    
    const tables = ['system_settings', 'admin_logs', 'page_views']
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error) {
        console.error(`表 ${table} 验证失败:`, error.message)
      } else {
        console.log(`✓ 表 ${table} 创建成功`)
      }
    }

    console.log('管理后台数据库初始化完成!')

  } catch (error) {
    console.error('初始化管理后台数据库时发生错误:', error)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initAdminDatabase()
}

module.exports = { initAdminDatabase }
