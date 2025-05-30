import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取仪表盘统计数据
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()

    // 并行获取所有统计数据
    const [
      toolsResult,
      usersResult,
      categoriesResult,
      pendingToolsResult,
      topToolsResult,
      recentUsersResult
    ] = await Promise.all([
      // 工具统计
      supabase
        .from('tools')
        .select('status', { count: 'exact' }),

      // 用户统计
      supabase
        .from('users')
        .select('status', { count: 'exact' }),

      // 分类统计
      supabase
        .from('categories')
        .select('id', { count: 'exact' }),

      // 待审核工具
      supabase
        .from('tools')
        .select(`
          *,
          categories(name),
          users!tools_submitted_by_fkey(name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5),

      // 热门工具（按浏览量排序）
      supabase
        .from('tools')
        .select(`
          *,
          categories(name)
        `)
        .eq('status', 'active')
        .order('view_count', { ascending: false })
        .limit(10),

      // 最近注册用户
      supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    // 检查错误
    if (toolsResult.error) {
      console.error('Tools query error:', toolsResult.error)
      return createErrorResponse('获取工具统计失败')
    }

    if (usersResult.error) {
      console.error('Users query error:', usersResult.error)
      return createErrorResponse('获取用户统计失败')
    }

    if (categoriesResult.error) {
      console.error('Categories query error:', categoriesResult.error)
      return createErrorResponse('获取分类统计失败')
    }

    // 计算工具统计
    const tools = toolsResult.data || []
    const toolStats = {
      total: toolsResult.count || 0,
      active: tools.filter(t => t.status === 'active').length,
      pending: tools.filter(t => t.status === 'pending').length,
      inactive: tools.filter(t => t.status === 'inactive').length,
      rejected: tools.filter(t => t.status === 'rejected').length,
    }

    // 计算用户统计
    const users = usersResult.data || []
    const userStats = {
      total: usersResult.count || 0,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      banned: users.filter(u => u.status === 'banned').length,
    }

    // 分类统计
    const categoryStats = {
      total: categoriesResult.count || 0,
    }

    // 组装响应数据
    const dashboardData = {
      stats: {
        totalTools: toolStats.total,
        activeTools: toolStats.active,
        pendingTools: toolStats.pending,
        inactiveTools: toolStats.inactive,
        rejectedTools: toolStats.rejected,
        totalUsers: userStats.total,
        activeUsers: userStats.active,
        inactiveUsers: userStats.inactive,
        bannedUsers: userStats.banned,
        totalCategories: categoryStats.total,
      },
      pendingSubmissions: pendingToolsResult.data || [],
      topTools: topToolsResult.data || [],
      recentUsers: recentUsersResult.data || [],
      systemStatus: {
        database: 'healthy',
        api: 'healthy',
        storage: 23, // 可以从实际存储API获取
        uptime: '99.9%'
      }
    }

    return createAdminResponse(dashboardData)
  } catch (error) {
    console.error('GET /api/admin/dashboard error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
