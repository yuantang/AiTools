import { supabase } from "@/lib/supabase"
import { UserBehaviorsAPI } from "./user-behaviors"

export interface SearchResult {
  id: string
  name: string
  description: string
  logo_url: string
  rating: number
  total_ratings: number
  favorite_count: number
  view_count: number
  category: {
    id: string
    name: string
    slug: string
  }
  tags: string[]
  relevance_score: number
  highlight?: {
    name?: string
    description?: string
    tags?: string[]
  }
}

export interface SearchSuggestion {
  id: string
  query: string
  suggestion: string
  weight: number
  category?: {
    id: string
    name: string
  }
}

export interface PopularSearch {
  id: string
  query: string
  search_count: number
  click_count: number
  last_searched_at: string
}

export class SearchAPI {
  // 增强的全文搜索
  static async searchTools(options: {
    query: string
    user_id?: string
    category_id?: string
    tags?: string[]
    pricing_type?: string
    platforms?: string[]
    min_rating?: number
    sort_by?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'name'
    page?: number
    limit?: number
    include_highlights?: boolean
  }) {
    try {
      const {
        query,
        user_id,
        category_id,
        tags,
        pricing_type,
        platforms,
        min_rating,
        sort_by = 'relevance',
        page = 1,
        limit = 20,
        include_highlights = true
      } = options

      // 记录搜索历史
      if (user_id) {
        await this.recordSearchHistory({
          user_id,
          query,
          search_filters: {
            category_id,
            tags,
            pricing_type,
            platforms,
            min_rating,
            sort_by
          }
        })
      }

      // 构建搜索查询
      let searchQuery = supabase
        .from('tools')
        .select(`
          id,
          name,
          description,
          logo_url,
          rating,
          total_ratings,
          favorite_count,
          view_count,
          tags,
          pricing,
          platforms,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'active')

      // 全文搜索
      if (query.trim()) {
        // 使用PostgreSQL的全文搜索，分别搜索不同字段
        searchQuery = searchQuery.or(`
          name.ilike.%${query}%,
          description.ilike.%${query}%,
          tags.cs.{${query}}
        `)
      }

      // 应用过滤器
      if (category_id) {
        searchQuery = searchQuery.eq('category_id', category_id)
      }

      if (tags && tags.length > 0) {
        searchQuery = searchQuery.overlaps('tags', tags)
      }

      if (pricing_type) {
        searchQuery = searchQuery.eq('pricing', pricing_type)
      }

      if (platforms && platforms.length > 0) {
        searchQuery = searchQuery.overlaps('platforms', platforms)
      }

      if (min_rating) {
        searchQuery = searchQuery.gte('rating', min_rating)
      }

      // 排序
      switch (sort_by) {
        case 'rating':
          searchQuery = searchQuery.order('rating', { ascending: false })
          break
        case 'popularity':
          searchQuery = searchQuery.order('view_count', { ascending: false })
          break
        case 'newest':
          searchQuery = searchQuery.order('created_at', { ascending: false })
          break
        case 'name':
          searchQuery = searchQuery.order('name', { ascending: true })
          break
        default: // relevance
          // PostgreSQL的全文搜索会自动按相关性排序
          break
      }

      // 分页
      const offset = (page - 1) * limit
      searchQuery = searchQuery.range(offset, offset + limit - 1)

      const { data: tools, error, count } = await searchQuery

      if (error) {
        throw new Error(`Search failed: ${error.message}`)
      }

      // 计算相关性分数和高亮
      const results: SearchResult[] = (tools || []).map(tool => {
        const relevanceScore = this.calculateRelevanceScore(tool, query, options)
        const highlight = include_highlights ? this.generateHighlights(tool, query) : undefined

        return {
          ...tool,
          relevance_score: relevanceScore,
          highlight
        }
      })

      // 如果按相关性排序，重新排序结果
      if (sort_by === 'relevance' && query.trim()) {
        results.sort((a, b) => b.relevance_score - a.relevance_score)
      }

      return {
        results,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        query,
        filters: {
          category_id,
          tags,
          pricing_type,
          platforms,
          min_rating
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  // 获取搜索建议
  static async getSearchSuggestions(query: string, limit: number = 10) {
    try {
      if (!query.trim()) return []

      // 尝试从搜索建议表获取，如果表不存在则使用工具数据
      try {
        const { data: suggestions, error } = await supabase
          .from('search_suggestions')
          .select(`
            id,
            query,
            suggestion,
            weight,
            category:categories (
              id,
              name
            )
          `)
          .ilike('suggestion', `%${query}%`)
          .eq('is_active', true)
          .order('weight', { ascending: false })
          .limit(limit)

        if (!error && suggestions) {
          return suggestions
        }
      } catch (tableError) {
        // 搜索建议表不存在，使用工具数据生成建议
      }

      // 回退到从工具名称生成建议
      const { data: tools } = await supabase
        .from('tools')
        .select('name, tags')
        .eq('status', 'active')
        .ilike('name', `%${query}%`)
        .limit(limit)

      const toolSuggestions = tools?.map(tool => ({
        id: `tool_${tool.name}`,
        query,
        suggestion: tool.name,
        weight: 0.5,
        category: null
      })) || []

      return toolSuggestions
    } catch (error) {
      console.error('Error getting search suggestions:', error)
      return []
    }
  }

  // 获取热门搜索
  static async getPopularSearches(limit: number = 10, days: number = 30) {
    try {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        const { data, error } = await supabase
          .from('popular_searches')
          .select('*')
          .gte('last_searched_at', startDate.toISOString())
          .order('search_count', { ascending: false })
          .limit(limit)

        if (!error && data) {
          return data
        }
      } catch (tableError) {
        // 热门搜索表不存在，返回默认热门搜索
      }

      // 返回默认热门搜索
      return [
        { id: '1', query: 'ChatGPT', search_count: 150, click_count: 120, last_searched_at: new Date().toISOString() },
        { id: '2', query: 'Midjourney', search_count: 120, click_count: 95, last_searched_at: new Date().toISOString() },
        { id: '3', query: 'GitHub Copilot', search_count: 100, click_count: 80, last_searched_at: new Date().toISOString() },
        { id: '4', query: 'Stable Diffusion', search_count: 90, click_count: 70, last_searched_at: new Date().toISOString() },
        { id: '5', query: 'Claude', search_count: 80, click_count: 60, last_searched_at: new Date().toISOString() }
      ].slice(0, limit)
    } catch (error) {
      console.error('Error getting popular searches:', error)
      return []
    }
  }

  // 获取用户搜索历史
  static async getUserSearchHistory(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw new Error(`Failed to get search history: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error getting search history:', error)
      return []
    }
  }

  // 清除用户搜索历史
  static async clearUserSearchHistory(userId: string) {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw new Error(`Failed to clear search history: ${error.message}`)
      }

      return true
    } catch (error) {
      console.error('Error clearing search history:', error)
      throw error
    }
  }

  // 记录搜索点击
  static async recordSearchClick(data: {
    user_id?: string
    query: string
    tool_id: string
    position: number
  }) {
    try {
      // 更新搜索历史中的点击工具
      if (data.user_id) {
        await supabase
          .from('search_history')
          .update({ clicked_tool_id: data.tool_id })
          .eq('user_id', data.user_id)
          .eq('query', data.query)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      // 更新热门搜索的点击数
      await supabase
        .from('popular_searches')
        .update({ click_count: supabase.sql`click_count + 1` })
        .eq('query', data.query)

      // 记录用户行为
      if (data.user_id) {
        await UserBehaviorsAPI.trackBehavior({
          user_id: data.user_id,
          tool_id: data.tool_id,
          behavior_type: 'click',
          behavior_data: {
            source: 'search',
            query: data.query,
            position: data.position
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error recording search click:', error)
      return false
    }
  }

  // 记录搜索历史
  private static async recordSearchHistory(data: {
    user_id: string
    query: string
    search_filters: Record<string, any>
  }) {
    try {
      await supabase
        .from('search_history')
        .insert({
          user_id: data.user_id,
          query: data.query,
          search_filters: data.search_filters,
          results_count: 0 // 这个会在搜索完成后更新
        })
    } catch (error) {
      console.error('Error recording search history:', error)
    }
  }

  // 计算相关性分数
  private static calculateRelevanceScore(tool: any, query: string, options: any): number {
    if (!query.trim()) return 0

    const queryLower = query.toLowerCase()
    let score = 0

    // 名称匹配权重最高
    if (tool.name.toLowerCase().includes(queryLower)) {
      score += 10
      if (tool.name.toLowerCase().startsWith(queryLower)) {
        score += 5 // 前缀匹配额外加分
      }
    }

    // 描述匹配
    if (tool.description.toLowerCase().includes(queryLower)) {
      score += 5
    }

    // 标签匹配
    if (tool.tags) {
      const matchingTags = tool.tags.filter((tag: string) =>
        tag.toLowerCase().includes(queryLower)
      )
      score += matchingTags.length * 3
    }

    // 质量分数（评分和受欢迎程度）
    score += (tool.rating || 0) * 0.5
    score += Math.log10((tool.view_count || 0) + 1) * 0.3
    score += Math.log10((tool.favorite_count || 0) + 1) * 0.2

    return Math.round(score * 100) / 100
  }

  // 生成搜索高亮
  private static generateHighlights(tool: any, query: string) {
    if (!query.trim()) return undefined

    const queryLower = query.toLowerCase()
    const highlight: any = {}

    // 高亮名称
    if (tool.name.toLowerCase().includes(queryLower)) {
      highlight.name = this.highlightText(tool.name, query)
    }

    // 高亮描述
    if (tool.description.toLowerCase().includes(queryLower)) {
      highlight.description = this.highlightText(tool.description, query)
    }

    // 高亮标签
    if (tool.tags) {
      const highlightedTags = tool.tags
        .filter((tag: string) => tag.toLowerCase().includes(queryLower))
        .map((tag: string) => this.highlightText(tag, query))

      if (highlightedTags.length > 0) {
        highlight.tags = highlightedTags
      }
    }

    return Object.keys(highlight).length > 0 ? highlight : undefined
  }

  // 高亮文本
  private static highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  // 自动完成搜索建议
  static async getAutocompleteSuggestions(query: string, limit: number = 5) {
    try {
      if (!query.trim() || query.length < 2) return []

      // 从多个来源获取建议
      const [toolNames, popularSearches, searchSuggestions] = await Promise.all([
        // 工具名称
        supabase
          .from('tools')
          .select('name')
          .eq('status', 'active')
          .ilike('name', `${query}%`)
          .limit(3),

        // 热门搜索
        supabase
          .from('popular_searches')
          .select('query')
          .ilike('query', `${query}%`)
          .order('search_count', { ascending: false })
          .limit(2),

        // 搜索建议
        supabase
          .from('search_suggestions')
          .select('suggestion')
          .eq('is_active', true)
          .ilike('suggestion', `${query}%`)
          .order('weight', { ascending: false })
          .limit(2)
      ])

      const suggestions = [
        ...(toolNames.data?.map(t => t.name) || []),
        ...(popularSearches.data?.map(p => p.query) || []),
        ...(searchSuggestions.data?.map(s => s.suggestion) || [])
      ]

      // 去重并限制数量
      const uniqueSuggestions = [...new Set(suggestions)]
      return uniqueSuggestions.slice(0, limit)
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error)
      return []
    }
  }
}
