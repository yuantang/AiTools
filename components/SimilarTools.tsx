"use client"

import { useState, useEffect } from "react"
import { Star, Heart, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { RecommendationsAPI, type SimilarTool } from "@/lib/api/recommendations"
import { UserBehaviorsAPI } from "@/lib/api/user-behaviors"

interface SimilarToolsProps {
  toolId: string
  title?: string
  limit?: number
  className?: string
}

export function SimilarTools({
  toolId,
  title = "相似工具",
  limit = 4,
  className = ""
}: SimilarToolsProps) {
  const { user } = useAuth()
  const [similarTools, setSimilarTools] = useState<SimilarTool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSimilarTools()
  }, [toolId, limit])

  const fetchSimilarTools = async () => {
    try {
      setLoading(true)
      const tools = await RecommendationsAPI.getSimilarTools(toolId, limit)
      setSimilarTools(tools)
    } catch (error) {
      console.error('Error fetching similar tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToolClick = async (tool: SimilarTool) => {
    if (user) {
      // 记录用户行为
      await UserBehaviorsAPI.trackBehavior({
        user_id: user.id,
        tool_id: tool.tool_id,
        behavior_type: 'view',
        behavior_data: {
          source: 'similar_tools',
          source_tool_id: toolId,
          similarity_score: tool.similarity_score
        }
      })
    }
  }

  const getSimilarityLabel = (score: number) => {
    if (score >= 0.8) return '非常相似'
    if (score >= 0.6) return '很相似'
    if (score >= 0.4) return '相似'
    if (score >= 0.2) return '有些相似'
    return '略微相似'
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800'
    if (score >= 0.6) return 'bg-blue-100 text-blue-800'
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800'
    if (score >= 0.2) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(limit)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg animate-pulse">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (similarTools.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">🔍</div>
              <p className="text-gray-500">暂无相似工具</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Badge variant="outline" className="text-xs">
              {similarTools.length} 个相似工具
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {similarTools.map((similarTool) => (
              <Link
                key={similarTool.tool_id}
                href={`/tools/${similarTool.tool_id}`}
                onClick={() => handleToolClick(similarTool)}
                className="block"
              >
                <div className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200 group">
                  <img
                    src={similarTool.tool.logo_url || "/placeholder.svg?height=48&width=48"}
                    alt={similarTool.tool.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {similarTool.tool.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSimilarityColor(similarTool.similarity_score)}`}
                      >
                        {getSimilarityLabel(similarTool.similarity_score)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {similarTool.tool.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{similarTool.tool.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{similarTool.tool.view_count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{similarTool.tool.favorite_count || 0}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {similarTool.tool.category?.name}
                      </Badge>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
          
          {similarTools.length >= limit && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                查看更多相似工具
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
