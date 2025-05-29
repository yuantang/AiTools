import { supabase } from "@/lib/supabase"

export interface UserBehavior {
  id: string
  user_id: string
  tool_id: string
  behavior_type: 'view' | 'favorite' | 'unfavorite' | 'rate' | 'comment' | 'share' | 'click'
  behavior_data: Record<string, any>
  session_id?: string
  ip_address?: string
  user_agent?: string
  referrer?: string
  created_at: string
}

export interface UserPreferences {
  id: string
  user_id: string
  preferred_categories: string[]
  preferred_tags: string[]
  preferred_pricing_types: string[]
  preferred_platforms: string[]
  interaction_weights: Record<string, number>
  last_updated: string
  created_at: string
}

export class UserBehaviorsAPI {
  // 记录用户行为
  static async trackBehavior(data: {
    user_id?: string
    tool_id: string
    behavior_type: UserBehavior['behavior_type']
    behavior_data?: Record<string, any>
    session_id?: string
  }) {
    try {
      const behaviorData = {
        user_id: data.user_id || null,
        tool_id: data.tool_id,
        behavior_type: data.behavior_type,
        behavior_data: data.behavior_data || {},
        session_id: data.session_id || this.generateSessionId(),
        ip_address: null, // 在实际应用中可以从请求中获取
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null
      }

      const { data: behavior, error } = await supabase
        .from('user_behaviors')
        .insert(behaviorData)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to track behavior: ${error.message}`)
      }

      return behavior
    } catch (error) {
      console.error('Error tracking user behavior:', error)
      // 不抛出错误，避免影响用户体验
      return null
    }
  }

  // 批量记录用户行为
  static async trackBehaviors(behaviors: Array<{
    user_id?: string
    tool_id: string
    behavior_type: UserBehavior['behavior_type']
    behavior_data?: Record<string, any>
    session_id?: string
  }>) {
    try {
      const sessionId = this.generateSessionId()

      const behaviorData = behaviors.map(behavior => ({
        user_id: behavior.user_id || null,
        tool_id: behavior.tool_id,
        behavior_type: behavior.behavior_type,
        behavior_data: behavior.behavior_data || {},
        session_id: behavior.session_id || sessionId,
        ip_address: null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        referrer: typeof document !== 'undefined' ? document.referrer : null
      }))

      const { data, error } = await supabase
        .from('user_behaviors')
        .insert(behaviorData)
        .select()

      if (error) {
        throw new Error(`Failed to track behaviors: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error tracking user behaviors:', error)
      return null
    }
  }

  // 获取用户行为历史
  static async getUserBehaviors(userId: string, options: {
    behavior_type?: UserBehavior['behavior_type']
    tool_id?: string
    limit?: number
    offset?: number
    start_date?: string
    end_date?: string
  } = {}) {
    try {
      let query = supabase
        .from('user_behaviors')
        .select(`
          *,
          tool:tools (
            id,
            name,
            logo_url,
            category:categories (
              name,
              slug
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (options.behavior_type) {
        query = query.eq('behavior_type', options.behavior_type)
      }

      if (options.tool_id) {
        query = query.eq('tool_id', options.tool_id)
      }

      if (options.start_date) {
        query = query.gte('created_at', options.start_date)
      }

      if (options.end_date) {
        query = query.lte('created_at', options.end_date)
      }

      if (options.limit) {
        const offset = options.offset || 0
        query = query.range(offset, offset + options.limit - 1)
      }

      const { data, error } = await query

      if (error) {
        // 如果表不存在，返回空数组
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          return []
        }
        throw new Error(`Failed to get user behaviors: ${error.message}`)
      }

      return data || []
    } catch (error) {
      // 如果是表不存在的错误，返回空数组
      if (error instanceof Error && error.message.includes('does not exist')) {
        return []
      }
      console.error('Error getting user behaviors:', error)
      return []
    }
  }

  // 获取用户偏好
  static async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to get user preferences: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error getting user preferences:', error)
      throw error
    }
  }

  // 更新用户偏好
  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          last_updated: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update user preferences: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  }

  // 获取用户行为统计
  static async getUserBehaviorStats(userId: string, days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('user_behaviors')
        .select('behavior_type, tool_id, created_at')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())

      if (error) {
        throw new Error(`Failed to get behavior stats: ${error.message}`)
      }

      // 统计各种行为
      const stats = {
        total_behaviors: data?.length || 0,
        views: data?.filter(b => b.behavior_type === 'view').length || 0,
        favorites: data?.filter(b => b.behavior_type === 'favorite').length || 0,
        ratings: data?.filter(b => b.behavior_type === 'rate').length || 0,
        comments: data?.filter(b => b.behavior_type === 'comment').length || 0,
        shares: data?.filter(b => b.behavior_type === 'share').length || 0,
        unique_tools: new Set(data?.map(b => b.tool_id)).size,
        daily_activity: this.groupBehaviorsByDay(data || [])
      }

      return stats
    } catch (error) {
      console.error('Error getting behavior stats:', error)
      throw error
    }
  }

  // 获取工具的用户行为统计
  static async getToolBehaviorStats(toolId: string, days: number = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('user_behaviors')
        .select('behavior_type, user_id, created_at, behavior_data')
        .eq('tool_id', toolId)
        .gte('created_at', startDate.toISOString())

      if (error) {
        throw new Error(`Failed to get tool behavior stats: ${error.message}`)
      }

      const stats = {
        total_interactions: data?.length || 0,
        unique_users: new Set(data?.filter(b => b.user_id).map(b => b.user_id)).size,
        views: data?.filter(b => b.behavior_type === 'view').length || 0,
        favorites: data?.filter(b => b.behavior_type === 'favorite').length || 0,
        unfavorites: data?.filter(b => b.behavior_type === 'unfavorite').length || 0,
        ratings: data?.filter(b => b.behavior_type === 'rate').length || 0,
        comments: data?.filter(b => b.behavior_type === 'comment').length || 0,
        shares: data?.filter(b => b.behavior_type === 'share').length || 0,
        clicks: data?.filter(b => b.behavior_type === 'click').length || 0,
        daily_activity: this.groupBehaviorsByDay(data || []),
        average_rating: this.calculateAverageRating(data || [])
      }

      return stats
    } catch (error) {
      console.error('Error getting tool behavior stats:', error)
      throw error
    }
  }

  // 获取热门工具（基于用户行为）
  static async getTrendingTools(options: {
    days?: number
    limit?: number
    category_id?: string
  } = {}) {
    try {
      const { days = 7, limit = 10, category_id } = options
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      let query = supabase
        .from('user_behaviors')
        .select(`
          tool_id,
          behavior_type,
          tool:tools (
            id,
            name,
            description,
            logo_url,
            rating,
            total_ratings,
            favorite_count,
            view_count,
            category:categories (
              id,
              name,
              slug
            )
          )
        `)
        .gte('created_at', startDate.toISOString())

      if (category_id) {
        // 这里需要通过工具表来过滤分类，实际实现可能需要调整查询
      }

      const { data, error } = await query

      if (error) {
        throw new Error(`Failed to get trending tools: ${error.message}`)
      }

      // 计算工具的趋势分数
      const toolScores = new Map<string, number>()
      const toolData = new Map<string, any>()

      data?.forEach(behavior => {
        if (!behavior.tool) return

        const toolId = behavior.tool_id
        const currentScore = toolScores.get(toolId) || 0

        // 不同行为的权重
        const weights = {
          view: 1,
          favorite: 3,
          rate: 2,
          comment: 2,
          share: 4,
          click: 1
        }

        const weight = weights[behavior.behavior_type as keyof typeof weights] || 1
        toolScores.set(toolId, currentScore + weight)
        toolData.set(toolId, behavior.tool)
      })

      // 排序并返回前N个
      const sortedTools = Array.from(toolScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([toolId, score]) => ({
          ...toolData.get(toolId),
          trend_score: score
        }))

      return sortedTools
    } catch (error) {
      console.error('Error getting trending tools:', error)
      throw error
    }
  }

  // 辅助方法：生成会话ID
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 辅助方法：按天分组行为数据
  private static groupBehaviorsByDay(behaviors: any[]) {
    const grouped = behaviors.reduce((acc, behavior) => {
      const date = new Date(behavior.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return grouped
  }

  // 辅助方法：计算平均评分
  private static calculateAverageRating(behaviors: any[]) {
    const ratings = behaviors
      .filter(b => b.behavior_type === 'rate' && b.behavior_data?.rating)
      .map(b => b.behavior_data.rating)

    if (ratings.length === 0) return 0

    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
  }

  // 清理旧的行为数据
  static async cleanupOldBehaviors(daysToKeep: number = 90) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const { error } = await supabase
        .from('user_behaviors')
        .delete()
        .lt('created_at', cutoffDate.toISOString())

      if (error) {
        throw new Error(`Failed to cleanup old behaviors: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error cleaning up old behaviors:', error)
      throw error
    }
  }
}
