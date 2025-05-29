import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const startTime = Date.now()
    
    // 检查环境变量
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing environment variables',
        timestamp: new Date().toISOString(),
        checks: {
          environment: false,
          database: false,
          tables: false
        }
      }, { status: 500 })
    }

    // 创建Supabase客户端
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 检查数据库连接
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (connectionError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: connectionError.message,
        timestamp: new Date().toISOString(),
        checks: {
          environment: true,
          database: false,
          tables: false
        }
      }, { status: 500 })
    }

    // 检查基础表
    const basicTables = ['users', 'tools', 'categories']
    const tableChecks: Record<string, boolean> = {}
    
    for (const table of basicTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        tableChecks[table] = !error
      } catch (err) {
        tableChecks[table] = false
      }
    }

    // 检查增强功能表
    const enhancedTables = [
      'search_history',
      'popular_searches', 
      'search_suggestions',
      'user_behaviors',
      'tool_similarities',
      'user_recommendations',
      'user_preferences'
    ]
    
    const enhancedTableChecks: Record<string, boolean> = {}
    
    for (const table of enhancedTables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        enhancedTableChecks[table] = !error
      } catch (err) {
        enhancedTableChecks[table] = false
      }
    }

    const responseTime = Date.now() - startTime
    const allBasicTablesExist = Object.values(tableChecks).every(Boolean)
    const enhancedTablesCount = Object.values(enhancedTableChecks).filter(Boolean).length
    const allEnhancedTablesExist = enhancedTablesCount === enhancedTables.length

    return NextResponse.json({
      status: 'healthy',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: {
        environment: true,
        database: true,
        basicTables: allBasicTablesExist,
        enhancedTables: allEnhancedTablesExist
      },
      tables: {
        basic: tableChecks,
        enhanced: enhancedTableChecks
      },
      features: {
        basicFunctionality: allBasicTablesExist,
        enhancedSearch: enhancedTableChecks.search_suggestions && enhancedTableChecks.popular_searches,
        userBehaviors: enhancedTableChecks.user_behaviors,
        recommendations: enhancedTableChecks.user_recommendations && enhancedTableChecks.tool_similarities,
        userPreferences: enhancedTableChecks.user_preferences
      },
      stats: {
        basicTablesCount: Object.values(tableChecks).filter(Boolean).length,
        totalBasicTables: basicTables.length,
        enhancedTablesCount,
        totalEnhancedTables: enhancedTables.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      checks: {
        environment: false,
        database: false,
        tables: false
      }
    }, { status: 500 })
  }
}
