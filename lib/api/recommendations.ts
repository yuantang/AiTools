import { supabase } from "@/lib/supabase"
import { UserBehaviorsAPI } from "./user-behaviors"

export interface Recommendation {
  id: string
  tool_id: string
  recommendation_type: 'collaborative' | 'content_based' | 'popular' | 'trending' | 'hybrid'
  score: number
  reason: string
  tool: {
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
  }
}

export interface SimilarTool {
  tool_id: string
  similarity_score: number
  similarity_type: string
  tool: any
}

export class RecommendationsAPI {
  // 获取用户个性化推荐
  static async getUserRecommendations(userId: string, options: {
    limit?: number
    recommendation_types?: string[]
    exclude_viewed?: boolean
    exclude_favorited?: boolean
  } = {}) {
    try {
      const { limit = 10 } = options

      // 如果用户行为表不存在，直接返回热门推荐
      try {
        // 尝试获取用户行为数据
        const userBehaviors = await UserBehaviorsAPI.getUserBehaviors(userId, {
          limit: 100
        })

        const userPreferences = await UserBehaviorsAPI.getUserPreferences(userId)

        // 获取用户已查看和收藏的工具ID
        const viewedToolIds = options.exclude_viewed
          ? userBehaviors.filter(b => b.behavior_type === 'view').map(b => b.tool_id)
          : []

        const favoritedToolIds = options.exclude_favorited
          ? userBehaviors.filter(b => b.behavior_type === 'favorite').map(b => b.tool_id)
          : []

        const excludeToolIds = [...new Set([...viewedToolIds, ...favoritedToolIds])]

        // 生成不同类型的推荐
        const recommendations = await Promise.all([
          this.getCollaborativeRecommendations(userId, excludeToolIds, Math.ceil(limit * 0.4)),
          this.getContentBasedRecommendations(userId, userPreferences, excludeToolIds, Math.ceil(limit * 0.3)),
          this.getTrendingRecommendations(excludeToolIds, Math.ceil(limit * 0.2)),
          this.getPopularRecommendations(excludeToolIds, Math.ceil(limit * 0.1))
        ])

        // 合并和排序推荐
        const allRecommendations = recommendations.flat()
        const sortedRecommendations = allRecommendations
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)

        // 尝试保存推荐到数据库
        try {
          await this.saveUserRecommendations(userId, sortedRecommendations)
        } catch (saveError) {
          // 无法保存推荐到数据库，跳过保存
        }

        return sortedRecommendations
      } catch (behaviorError) {
        // 用户行为表不存在，返回热门推荐
        return await this.getPopularRecommendations([], limit)
      }
    } catch (error) {
      console.error('Error getting user recommendations:', error)
      // 返回热门推荐作为后备
      return await this.getPopularRecommendations([], limit)
    }
  }

  // 协同过滤推荐
  static async getCollaborativeRecommendations(userId: string, excludeToolIds: string[], limit: number) {
    try {
      // 找到相似用户
      const similarUsers = await this.findSimilarUsers(userId, 10)

      if (similarUsers.length === 0) {
        return []
      }

      // 获取相似用户喜欢的工具
      const { data: similarUserBehaviors } = await supabase
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
            ),
            tags
          )
        `)
        .in('user_id', similarUsers.map(u => u.user_id))
        .in('behavior_type', ['favorite', 'rate'])
        .eq('tools.status', 'active')
        .not('tool_id', 'in', `(${excludeToolIds.join(',')})`)

      // 计算推荐分数
      const toolScores = new Map<string, { score: number, tool: any, reasons: string[] }>()

      similarUserBehaviors?.forEach(behavior => {
        if (!behavior.tool) return

        const toolId = behavior.tool_id
        const current = toolScores.get(toolId) || { score: 0, tool: behavior.tool, reasons: [] }

        // 根据行为类型给分
        const behaviorScore = behavior.behavior_type === 'favorite' ? 2 : 1
        current.score += behaviorScore
        current.reasons.push(`相似用户${behavior.behavior_type === 'favorite' ? '收藏' : '评价'}了此工具`)

        toolScores.set(toolId, current)
      })

      // 转换为推荐格式
      const recommendations: Recommendation[] = Array.from(toolScores.entries())
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, limit)
        .map(([toolId, data]) => ({
          id: `collab_${toolId}`,
          tool_id: toolId,
          recommendation_type: 'collaborative' as const,
          score: Math.min(data.score / 10, 1), // 归一化到0-1
          reason: data.reasons[0] || '基于相似用户的偏好推荐',
          tool: data.tool
        }))

      return recommendations
    } catch (error) {
      console.error('Error getting collaborative recommendations:', error)
      return []
    }
  }

  // 基于内容的推荐
  static async getContentBasedRecommendations(userId: string, userPreferences: any, excludeToolIds: string[], limit: number) {
    try {
      if (!userPreferences) {
        return []
      }

      let query = supabase
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
          category_id,
          tags,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'active')

      if (excludeToolIds.length > 0) {
        query = query.not('id', 'in', `(${excludeToolIds.join(',')})`)
      }

      // 基于用户偏好的分类过滤
      if (userPreferences.preferred_categories?.length > 0) {
        query = query.in('category_id', userPreferences.preferred_categories)
      }

      const { data: tools } = await query.limit(limit * 3) // 获取更多候选

      if (!tools) return []

      // 计算内容相似度分数
      const recommendations: Recommendation[] = tools
        .map(tool => {
          let score = 0
          const reasons: string[] = []

          // 分类匹配
          if (userPreferences.preferred_categories?.includes(tool.category_id)) {
            score += 0.4
            reasons.push(`匹配您偏好的${tool.category.name}分类`)
          }

          // 标签匹配
          if (userPreferences.preferred_tags?.length > 0 && tool.tags) {
            const matchingTags = tool.tags.filter(tag =>
              userPreferences.preferred_tags.includes(tag)
            )
            if (matchingTags.length > 0) {
              score += (matchingTags.length / userPreferences.preferred_tags.length) * 0.3
              reasons.push(`包含您感兴趣的标签: ${matchingTags.slice(0, 2).join(', ')}`)
            }
          }

          // 质量分数
          score += (tool.rating / 5) * 0.2
          score += Math.min(Math.log10(tool.view_count + 1) / 5, 0.1)

          return {
            id: `content_${tool.id}`,
            tool_id: tool.id,
            recommendation_type: 'content_based' as const,
            score,
            reason: reasons[0] || '基于您的偏好推荐',
            tool
          }
        })
        .filter(rec => rec.score > 0.1) // 过滤低分推荐
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      return recommendations
    } catch (error) {
      console.error('Error getting content-based recommendations:', error)
      return []
    }
  }

  // 热门推荐
  static async getTrendingRecommendations(excludeToolIds: string[], limit: number) {
    try {
      const trendingTools = await UserBehaviorsAPI.getTrendingTools({
        days: 7,
        limit: limit * 2
      })

      const recommendations: Recommendation[] = trendingTools
        .filter(tool => !excludeToolIds.includes(tool.id))
        .slice(0, limit)
        .map((tool, index) => ({
          id: `trending_${tool.id}`,
          tool_id: tool.id,
          recommendation_type: 'trending' as const,
          score: Math.max(0.8 - (index * 0.1), 0.3),
          reason: '近期热门工具',
          tool
        }))

      return recommendations
    } catch (error) {
      console.error('Error getting trending recommendations:', error)
      return []
    }
  }

  // 热门推荐
  static async getPopularRecommendations(excludeToolIds: string[], limit: number) {
    try {
      let query = supabase
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
          category:categories (
            id,
            name,
            slug
          ),
          tags
        `)
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .order('favorite_count', { ascending: false })

      if (excludeToolIds.length > 0) {
        query = query.not('id', 'in', `(${excludeToolIds.join(',')})`)
      }

      const { data: tools } = await query.limit(limit)

      const recommendations: Recommendation[] = (tools || []).map((tool, index) => ({
        id: `popular_${tool.id}`,
        tool_id: tool.id,
        recommendation_type: 'popular' as const,
        score: Math.max(0.7 - (index * 0.05), 0.3),
        reason: '高评分热门工具',
        tool
      }))

      return recommendations
    } catch (error) {
      console.error('Error getting popular recommendations:', error)
      return []
    }
  }

  // 获取相似工具
  static async getSimilarTools(toolId: string, limit: number = 5) {
    try {
      // 首先尝试从预计算的相似度表获取
      const { data: similarities } = await supabase
        .from('tool_similarities')
        .select(`
          tool_b_id,
          similarity_score,
          similarity_type,
          tool:tools!tool_similarities_tool_b_id_fkey (
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
            ),
            tags
          )
        `)
        .eq('tool_a_id', toolId)
        .eq('tools.status', 'active')
        .order('similarity_score', { ascending: false })
        .limit(limit)

      if (similarities && similarities.length > 0) {
        return similarities.map(sim => ({
          tool_id: sim.tool_b_id,
          similarity_score: sim.similarity_score,
          similarity_type: sim.similarity_type,
          tool: sim.tool
        }))
      }

      // 如果没有预计算的相似度，实时计算
      return await this.calculateSimilarToolsRealtime(toolId, limit)
    } catch (error) {
      console.error('Error getting similar tools:', error)
      return []
    }
  }

  // 实时计算相似工具
  private static async calculateSimilarToolsRealtime(toolId: string, limit: number) {
    try {
      // 获取目标工具信息
      const { data: targetTool } = await supabase
        .from('tools')
        .select('category_id, tags')
        .eq('id', toolId)
        .single()

      if (!targetTool) return []

      // 获取同分类的其他工具
      const { data: candidateTools } = await supabase
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
          category_id,
          tags,
          category:categories (
            id,
            name,
            slug
          )
        `)
        .eq('status', 'active')
        .eq('category_id', targetTool.category_id)
        .neq('id', toolId)
        .limit(50)

      if (!candidateTools) return []

      // 计算相似度
      const similarities = candidateTools.map(tool => {
        let score = 0

        // 分类匹配 (40%)
        if (tool.category_id === targetTool.category_id) {
          score += 0.4
        }

        // 标签重叠 (60%)
        if (targetTool.tags && tool.tags) {
          const intersection = targetTool.tags.filter(tag => tool.tags.includes(tag))
          const union = [...new Set([...targetTool.tags, ...tool.tags])]
          if (union.length > 0) {
            score += (intersection.length / union.length) * 0.6
          }
        }

        return {
          tool_id: tool.id,
          similarity_score: score,
          similarity_type: 'hybrid',
          tool
        }
      })

      return similarities
        .filter(sim => sim.similarity_score > 0.1)
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, limit)
    } catch (error) {
      console.error('Error calculating similar tools:', error)
      return []
    }
  }

  // 找到相似用户
  private static async findSimilarUsers(userId: string, limit: number) {
    try {
      // 获取用户的行为数据
      const userBehaviors = await UserBehaviorsAPI.getUserBehaviors(userId, {
        behavior_type: 'favorite',
        limit: 50
      })

      if (userBehaviors.length === 0) return []

      const userToolIds = userBehaviors.map(b => b.tool_id)

      // 找到有相似偏好的用户
      const { data: similarUserBehaviors } = await supabase
        .from('user_behaviors')
        .select('user_id, tool_id')
        .in('tool_id', userToolIds)
        .eq('behavior_type', 'favorite')
        .neq('user_id', userId)

      if (!similarUserBehaviors) return []

      // 计算用户相似度
      const userSimilarities = new Map<string, number>()

      similarUserBehaviors.forEach(behavior => {
        const currentScore = userSimilarities.get(behavior.user_id) || 0
        userSimilarities.set(behavior.user_id, currentScore + 1)
      })

      // 返回最相似的用户
      return Array.from(userSimilarities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([user_id, score]) => ({ user_id, similarity_score: score }))
    } catch (error) {
      console.error('Error finding similar users:', error)
      return []
    }
  }

  // 保存用户推荐
  private static async saveUserRecommendations(userId: string, recommendations: Recommendation[]) {
    try {
      // 删除旧的推荐
      await supabase
        .from('user_recommendations')
        .delete()
        .eq('user_id', userId)
        .lt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 删除24小时前的

      // 插入新推荐
      const recommendationData = recommendations.map(rec => ({
        user_id: userId,
        tool_id: rec.tool_id,
        recommendation_type: rec.recommendation_type,
        score: rec.score,
        reason: rec.reason,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7天后过期
      }))

      await supabase
        .from('user_recommendations')
        .insert(recommendationData)
    } catch (error) {
      console.error('Error saving user recommendations:', error)
    }
  }

  // 记录推荐点击
  static async recordRecommendationClick(userId: string, recommendationId: string, toolId: string) {
    try {
      // 更新推荐记录
      await supabase
        .from('user_recommendations')
        .update({ is_clicked: true })
        .eq('user_id', userId)
        .eq('id', recommendationId)

      // 记录用户行为
      await UserBehaviorsAPI.trackBehavior({
        user_id: userId,
        tool_id: toolId,
        behavior_type: 'click',
        behavior_data: {
          source: 'recommendation',
          recommendation_id: recommendationId
        }
      })

      return true
    } catch (error) {
      console.error('Error recording recommendation click:', error)
      return false
    }
  }

  // 忽略推荐
  static async dismissRecommendation(userId: string, recommendationId: string) {
    try {
      await supabase
        .from('user_recommendations')
        .update({ is_dismissed: true })
        .eq('user_id', userId)
        .eq('id', recommendationId)

      return true
    } catch (error) {
      console.error('Error dismissing recommendation:', error)
      return false
    }
  }
}
