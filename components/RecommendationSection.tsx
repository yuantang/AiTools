"use client"

import { useState, useEffect } from "react"
import { Sparkles, Star, Heart, Eye, TrendingUp, X, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { RecommendationsAPI, type Recommendation } from "@/lib/api/recommendations"
import { UserBehaviorsAPI } from "@/lib/api/user-behaviors"

interface RecommendationSectionProps {
  title?: string
  subtitle?: string
  limit?: number
  showRefresh?: boolean
  className?: string
}

export function RecommendationSection({
  title = "为您推荐",
  subtitle = "基于您的偏好和行为智能推荐",
  limit = 6,
  showRefresh = true,
  className = ""
}: RecommendationSectionProps) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    } else {
      // 未登录用户显示热门推荐
      fetchPopularRecommendations()
    }
  }, [user, limit])

  const fetchRecommendations = async () => {
    if (!user) return

    try {
      setLoading(true)
      const userRecommendations = await RecommendationsAPI.getUserRecommendations(user.id, {
        limit,
        exclude_viewed: true,
        exclude_favorited: true
      })
      setRecommendations(userRecommendations)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      // 如果个性化推荐失败，回退到热门推荐
      await fetchPopularRecommendations()
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularRecommendations = async () => {
    try {
      setLoading(true)
      const popularRecommendations = await RecommendationsAPI.getPopularRecommendations([], limit)
      setRecommendations(popularRecommendations)
    } catch (error) {
      console.error('Error fetching popular recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchRecommendations()
    setRefreshing(false)
  }

  const handleToolClick = async (recommendation: Recommendation) => {
    if (user) {
      // 记录推荐点击
      await RecommendationsAPI.recordRecommendationClick(
        user.id,
        recommendation.id,
        recommendation.tool_id
      )

      // 记录用户行为
      await UserBehaviorsAPI.trackBehavior({
        user_id: user.id,
        tool_id: recommendation.tool_id,
        behavior_type: 'view',
        behavior_data: {
          source: 'recommendation',
          recommendation_type: recommendation.recommendation_type,
          recommendation_id: recommendation.id
        }
      })
    }
  }

  const handleDismiss = async (recommendation: Recommendation) => {
    if (user) {
      await RecommendationsAPI.dismissRecommendation(user.id, recommendation.id)
    }
    
    setDismissedIds(prev => new Set(prev).add(recommendation.id))
    setRecommendations(prev => prev.filter(r => r.id !== recommendation.id))
  }

  const getRecommendationTypeLabel = (type: string) => {
    switch (type) {
      case 'collaborative':
        return '协同推荐'
      case 'content_based':
        return '内容推荐'
      case 'trending':
        return '热门推荐'
      case 'popular':
        return '精选推荐'
      case 'hybrid':
        return '智能推荐'
      default:
        return '推荐'
    }
  }

  const getRecommendationTypeColor = (type: string) => {
    switch (type) {
      case 'collaborative':
        return 'bg-blue-100 text-blue-800'
      case 'content_based':
        return 'bg-green-100 text-green-800'
      case 'trending':
        return 'bg-orange-100 text-orange-800'
      case 'popular':
        return 'bg-purple-100 text-purple-800'
      case 'hybrid':
        return 'bg-pink-100 text-pink-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRecommendations = recommendations.filter(r => !dismissedIds.has(r.id))

  if (!user && filteredRecommendations.length === 0 && !loading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">个性化推荐</h3>
            <p className="text-gray-500 mb-4">登录后获取基于您偏好的智能推荐</p>
            <Button asChild>
              <Link href="/login">立即登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span>{title}</span>
          </h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        {showRefresh && !loading && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>刷新推荐</span>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((recommendation) => (
            <Card 
              key={recommendation.id} 
              className="group hover:shadow-lg transition-all duration-200 relative"
            >
              {/* 忽略按钮 */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8 p-0"
                onClick={() => handleDismiss(recommendation)}
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-6">
                <Link 
                  href={`/tools/${recommendation.tool_id}`}
                  onClick={() => handleToolClick(recommendation)}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={recommendation.tool.logo_url || "/placeholder.svg?height=48&width=48"}
                      alt={recommendation.tool.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {recommendation.tool.name}
                      </h3>
                      <p className="text-sm text-gray-500">{recommendation.tool.category?.name}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {recommendation.tool.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{recommendation.tool.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{recommendation.tool.view_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{recommendation.tool.favorite_count || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={getRecommendationTypeColor(recommendation.recommendation_type)}
                    >
                      {getRecommendationTypeLabel(recommendation.recommendation_type)}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      匹配度: {Math.round(recommendation.score * 100)}%
                    </div>
                  </div>

                  {recommendation.reason && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        💡 {recommendation.reason}
                      </p>
                    </div>
                  )}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐</h3>
            <p className="text-gray-500 mb-4">
              {user ? "多使用一些工具，我们会为您提供更好的推荐" : "登录后获取个性化推荐"}
            </p>
            {!user && (
              <Button asChild>
                <Link href="/login">立即登录</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
