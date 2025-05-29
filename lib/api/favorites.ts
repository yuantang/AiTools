import { supabase } from "@/lib/supabase"

export interface Favorite {
  id: string
  user_id: string
  tool_id: string
  created_at: string
  tool?: {
    id: string
    name: string
    description: string
    logo_url: string
    rating: number
    category: {
      name: string
      slug: string
    }
  }
}

export class FavoritesAPI {
  // 获取用户收藏列表
  static async getUserFavorites(userId: string, options: {
    page?: number
    limit?: number
    category?: string
  } = {}) {
    const { page = 1, limit = 20, category } = options
    const offset = (page - 1) * limit

    let query = supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        tool:tools (
          id,
          name,
          description,
          logo_url,
          rating,
          total_ratings,
          favorite_count,
          view_count,
          pricing,
          tags,
          category:categories (
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('tool.category.slug', category)
    }

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`)
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  }

  // 添加收藏
  static async addFavorite(userId: string, toolId: string) {
    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .single()

    if (existing) {
      throw new Error('Tool already favorited')
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        tool_id: toolId
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add favorite: ${error.message}`)
    }

    // 更新工具的收藏数
    await this.updateToolFavoriteCount(toolId)

    return data
  }

  // 移除收藏
  static async removeFavorite(userId: string, toolId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('tool_id', toolId)

    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`)
    }

    // 更新工具的收藏数
    await this.updateToolFavoriteCount(toolId)

    return true
  }

  // 切换收藏状态
  static async toggleFavorite(userId: string, toolId: string) {
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .single()

    if (existing) {
      await this.removeFavorite(userId, toolId)
      return false
    } else {
      await this.addFavorite(userId, toolId)
      return true
    }
  }

  // 检查是否已收藏
  static async isFavorited(userId: string, toolId: string) {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .single()

    return !!data
  }

  // 批量检查收藏状态
  static async checkFavoriteStatus(userId: string, toolIds: string[]) {
    const { data } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', userId)
      .in('tool_id', toolIds)

    const favoritedIds = data?.map(item => item.tool_id) || []
    
    return toolIds.reduce((acc, toolId) => {
      acc[toolId] = favoritedIds.includes(toolId)
      return acc
    }, {} as Record<string, boolean>)
  }

  // 更新工具收藏数
  private static async updateToolFavoriteCount(toolId: string) {
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)

    await supabase
      .from('tools')
      .update({ favorite_count: count || 0 })
      .eq('id', toolId)
  }

  // 获取收藏统计
  static async getFavoriteStats(userId: string) {
    const { count: totalFavorites } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // 按分类统计
    const { data: categoryStats } = await supabase
      .from('favorites')
      .select(`
        tool:tools (
          category:categories (
            name,
            slug
          )
        )
      `)
      .eq('user_id', userId)

    const categoryCounts = categoryStats?.reduce((acc, item) => {
      const categoryName = item.tool?.category?.name
      if (categoryName) {
        acc[categoryName] = (acc[categoryName] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    return {
      totalFavorites: totalFavorites || 0,
      categoryCounts
    }
  }

  // 获取最近收藏
  static async getRecentFavorites(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        tool:tools (
          id,
          name,
          logo_url,
          category:categories (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch recent favorites: ${error.message}`)
    }

    return data || []
  }

  // 导出收藏列表
  static async exportFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        created_at,
        tool:tools (
          name,
          description,
          url,
          category:categories (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to export favorites: ${error.message}`)
    }

    return data || []
  }
}
