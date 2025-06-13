import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取分析数据
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    const timeRange = searchParams.get('timeRange') || '30d'
    const metric = searchParams.get('metric') || 'all'

    // 计算时间范围
    const endDate = new Date()
    const startDate = new Date()
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // 并行获取各种统计数据
    const [
      toolsResult,
      usersResult,
      categoriesResult,
      viewsResult,
      ratingsResult
    ] = await Promise.all([
      // 工具统计
      supabase
        .from('tools')
        .select('status, created_at, view_count, favorite_count')
        .gte('created_at', startDate.toISOString()),

      // 用户统计
      supabase
        .from('users')
        .select('status, created_at, last_login_at')
        .gte('created_at', startDate.toISOString()),

      // 分类统计
      supabase
        .from('categories')
        .select(`
          id,
          name,
          tools(count)
        `),

      // 浏览量统计（如果有访问日志表）
      supabase
        .from('page_views')
        .select('created_at, page_path')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true }),

      // 评分统计
      supabase
        .from('tool_ratings')
        .select('rating, created_at')
        .gte('created_at', startDate.toISOString())
    ])

    // 处理工具数据
    const tools = toolsResult.data || []
    const toolStats = {
      total: tools.length,
      active: tools.filter(t => t.status === 'active').length,
      pending: tools.filter(t => t.status === 'pending').length,
      totalViews: tools.reduce((sum, t) => sum + (t.view_count || 0), 0),
      totalFavorites: tools.reduce((sum, t) => sum + (t.favorite_count || 0), 0),
    }

    // 处理用户数据
    const users = usersResult.data || []
    const userStats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      newUsers: users.length, // 在时间范围内注册的用户
    }

    // 处理分类数据
    const categories = categoriesResult.data || []
    const categoryStats = categories.map(cat => ({
      name: cat.name,
      toolCount: cat.tools?.[0]?.count || 0,
      percentage: 0 // 将在后面计算
    }))

    // 计算分类百分比
    const totalCategoryTools = categoryStats.reduce((sum, cat) => sum + cat.toolCount, 0)
    categoryStats.forEach(cat => {
      cat.percentage = totalCategoryTools > 0 ? Math.round((cat.toolCount / totalCategoryTools) * 100) : 0
    })

    // 处理浏览量数据（生成时间序列）
    const views = viewsResult.data || []
    const trafficData = generateTimeSeriesData(startDate, endDate, views, 'day')

    // 处理评分数据
    const ratings = ratingsResult.data || []
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : 0

    // 生成模拟的地理数据（实际应用中应该从真实数据源获取）
    const geographicData = [
      { country: '中国', users: Math.floor(userStats.total * 0.45), percentage: 45 },
      { country: '美国', users: Math.floor(userStats.total * 0.25), percentage: 25 },
      { country: '日本', users: Math.floor(userStats.total * 0.10), percentage: 10 },
      { country: '韩国', users: Math.floor(userStats.total * 0.07), percentage: 7 },
      { country: '德国', users: Math.floor(userStats.total * 0.05), percentage: 5 },
      { country: '其他', users: Math.floor(userStats.total * 0.08), percentage: 8 },
    ]

    const analyticsData = {
      overview: {
        totalVisitors: toolStats.totalViews,
        activeUsers: userStats.active,
        totalTools: toolStats.total,
        avgRating: Number(avgRating.toFixed(1)),
      },
      tools: toolStats,
      users: userStats,
      categories: categoryStats,
      traffic: trafficData,
      geographic: geographicData,
      timeRange,
      generatedAt: new Date().toISOString()
    }

    return createAdminResponse(analyticsData)
  } catch (error) {
    console.error('GET /api/admin/analytics error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// 生成时间序列数据的辅助函数
function generateTimeSeriesData(startDate: Date, endDate: Date, data: any[], interval: 'day' | 'hour' = 'day') {
  const result = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    const dayData = data.filter(item => 
      item.created_at.startsWith(dateStr)
    )
    
    result.push({
      date: dateStr,
      visitors: dayData.length,
      pageViews: dayData.length * 1.5, // 模拟页面浏览量
      newUsers: Math.floor(dayData.length * 0.3), // 模拟新用户
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return result
}
