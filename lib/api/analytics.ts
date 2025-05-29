import { supabase } from "@/lib/supabase"

export interface AnalyticsData {
  totalVisitors: number
  activeUsers: number
  totalTools: number
  monthlyRevenue: number
  trafficData: Array<{
    date: string
    visitors: number
    pageViews: number
    newUsers: number
  }>
  categoryData: Array<{
    name: string
    value: number
    tools: number
    color: string
  }>
  topTools: Array<{
    id: string
    name: string
    views: number
    users: number
    rating: number
    growth: number
  }>
  userGrowth: Array<{
    month: string
    total: number
    active: number
    premium: number
  }>
  deviceData: Array<{
    name: string
    value: number
    color: string
  }>
  geographicData: Array<{
    country: string
    users: number
    percentage: number
  }>
}

export class AnalyticsAPI {
  // 获取总体统计数据
  static async getOverviewStats(timeRange: string = '30d') {
    try {
      // 获取工具总数
      const { count: totalTools } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // 获取用户总数
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // 获取总浏览量
      const { data: viewsData } = await supabase
        .from('tools')
        .select('view_count')
        .eq('status', 'active')

      const totalViews = viewsData?.reduce((sum, tool) => sum + (tool.view_count || 0), 0) || 0

      // 获取收藏总数
      const { count: totalFavorites } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })

      return {
        totalTools: totalTools || 0,
        totalUsers: totalUsers || 0,
        totalViews,
        totalFavorites: totalFavorites || 0
      }
    } catch (error) {
      console.error('Failed to fetch overview stats:', error)
      throw error
    }
  }

  // 获取分类统计
  static async getCategoryStats() {
    try {
      const { data: categories } = await supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          tool_count,
          color
        `)
        .eq('is_active', true)
        .order('tool_count', { ascending: false })

      const total = categories?.reduce((sum, cat) => sum + (cat.tool_count || 0), 0) || 1

      return categories?.map((category, index) => ({
        name: category.name,
        value: Math.round(((category.tool_count || 0) / total) * 100),
        tools: category.tool_count || 0,
        color: category.color || `hsl(${index * 60}, 70%, 50%)`
      })) || []
    } catch (error) {
      console.error('Failed to fetch category stats:', error)
      throw error
    }
  }

  // 获取热门工具
  static async getTopTools(limit: number = 10) {
    try {
      const { data: tools } = await supabase
        .from('tools')
        .select(`
          id,
          name,
          view_count,
          favorite_count,
          rating,
          total_ratings
        `)
        .eq('status', 'active')
        .order('view_count', { ascending: false })
        .limit(limit)

      return tools?.map(tool => ({
        id: tool.id,
        name: tool.name,
        views: tool.view_count || 0,
        users: tool.favorite_count || 0,
        rating: tool.rating || 0,
        growth: Math.floor(Math.random() * 30) // 模拟增长率，实际应该从历史数据计算
      })) || []
    } catch (error) {
      console.error('Failed to fetch top tools:', error)
      throw error
    }
  }

  // 获取用户增长数据
  static async getUserGrowthData(months: number = 6) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(endDate.getMonth() - months)

      // 这里应该从用户注册时间统计，为简化使用模拟数据
      const monthlyData = []
      for (let i = months; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthKey = date.toISOString().slice(0, 7)

        // 获取该月注册的用户数（简化实现）
        const { count: monthlyUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${monthKey}-01`)
          .lt('created_at', `${monthKey}-32`)

        monthlyData.push({
          month: monthKey,
          total: monthlyUsers || 0,
          active: Math.floor((monthlyUsers || 0) * 0.7), // 假设70%活跃
          premium: Math.floor((monthlyUsers || 0) * 0.1)  // 假设10%付费
        })
      }

      return monthlyData
    } catch (error) {
      console.error('Failed to fetch user growth data:', error)
      throw error
    }
  }

  // 获取工具提交统计
  static async getToolSubmissionStats(days: number = 30) {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)

      const { data: submissions } = await supabase
        .from('tools')
        .select('created_at, status')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      const dailyStats = []
      for (let i = 0; i < days; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const daySubmissions = submissions?.filter(s => 
          s.created_at.startsWith(dateStr)
        ) || []

        dailyStats.unshift({
          date: dateStr,
          total: daySubmissions.length,
          approved: daySubmissions.filter(s => s.status === 'active').length,
          pending: daySubmissions.filter(s => s.status === 'pending').length,
          rejected: daySubmissions.filter(s => s.status === 'rejected').length
        })
      }

      return dailyStats
    } catch (error) {
      console.error('Failed to fetch tool submission stats:', error)
      throw error
    }
  }

  // 获取评论统计
  static async getCommentStats() {
    try {
      const { count: totalComments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { data: recentComments } = await supabase
        .from('comments')
        .select('created_at')
        .eq('status', 'active')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      return {
        totalComments: totalComments || 0,
        weeklyComments: recentComments?.length || 0
      }
    } catch (error) {
      console.error('Failed to fetch comment stats:', error)
      throw error
    }
  }

  // 获取收藏统计
  static async getFavoriteStats() {
    try {
      const { count: totalFavorites } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })

      const { data: recentFavorites } = await supabase
        .from('user_favorites')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      return {
        totalFavorites: totalFavorites || 0,
        weeklyFavorites: recentFavorites?.length || 0
      }
    } catch (error) {
      console.error('Failed to fetch favorite stats:', error)
      throw error
    }
  }

  // 获取系统健康状态
  static async getSystemHealth() {
    try {
      // 检查数据库连接
      const { data: dbTest } = await supabase
        .from('users')
        .select('id')
        .limit(1)

      // 获取最近的错误日志数量
      const { count: errorCount } = await supabase
        .from('system_logs')
        .select('*', { count: 'exact', head: true })
        .eq('level', 'error')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      return {
        databaseStatus: dbTest ? 'healthy' : 'error',
        errorCount: errorCount || 0,
        uptime: '99.9%', // 这应该从监控系统获取
        responseTime: '120ms' // 这应该从监控系统获取
      }
    } catch (error) {
      console.error('Failed to fetch system health:', error)
      return {
        databaseStatus: 'error',
        errorCount: 0,
        uptime: 'unknown',
        responseTime: 'unknown'
      }
    }
  }

  // 导出分析报告
  static async exportAnalyticsReport(timeRange: string = '30d') {
    try {
      const [
        overviewStats,
        categoryStats,
        topTools,
        userGrowth,
        submissionStats,
        commentStats,
        favoriteStats
      ] = await Promise.all([
        this.getOverviewStats(timeRange),
        this.getCategoryStats(),
        this.getTopTools(),
        this.getUserGrowthData(),
        this.getToolSubmissionStats(),
        this.getCommentStats(),
        this.getFavoriteStats()
      ])

      return {
        generatedAt: new Date().toISOString(),
        timeRange,
        overview: overviewStats,
        categories: categoryStats,
        topTools,
        userGrowth,
        submissions: submissionStats,
        comments: commentStats,
        favorites: favoriteStats
      }
    } catch (error) {
      console.error('Failed to export analytics report:', error)
      throw error
    }
  }

  // 获取实时统计
  static async getRealTimeStats() {
    try {
      // 获取今日新增用户
      const today = new Date().toISOString().split('T')[0]
      const { count: todayUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)

      // 获取今日新增工具
      const { count: todayTools } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)

      // 获取今日新增评论
      const { count: todayComments } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`)

      return {
        todayUsers: todayUsers || 0,
        todayTools: todayTools || 0,
        todayComments: todayComments || 0,
        onlineUsers: Math.floor(Math.random() * 500) + 100 // 模拟在线用户数
      }
    } catch (error) {
      console.error('Failed to fetch real-time stats:', error)
      throw error
    }
  }
}
