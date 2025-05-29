"use client"

import { useState } from "react"
import { ArrowLeft, Star, Heart, ExternalLink, Grid, List } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategory } from "@/hooks/useCategories"
import { useTools } from "@/hooks/useTools"
import { useAuth } from "@/hooks/useAuth"
import { ToolsAPI } from "@/lib/api/tools"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { user } = useAuth()
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "name">("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)

  const { category, loading: categoryLoading, error: categoryError } = useCategory(params.slug)
  const {
    tools,
    loading: toolsLoading,
    error: toolsError,
    pagination,
    refetch,
  } = useTools({
    page: currentPage,
    limit: 20,
    category: category?.id,
    sortBy,
  })

  const handleFavorite = async (toolId: string) => {
    if (!user) {
      window.location.href = "/login"
      return
    }

    try {
      await ToolsAPI.toggleFavorite(toolId, user.id)
      refetch()
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">分类不存在或加载失败</p>
          <Button asChild>
            <Link href="/categories">返回分类列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">AI工具导航</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具库
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                分类
              </Link>
              <Link href="/submit" className="text-gray-600 hover:text-blue-600 transition-colors">
                提交工具
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            首页
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-blue-600">
            分类
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex items-start space-x-6">
            <div
              className={`w-16 h-16 ${category.color || "bg-blue-500"} rounded-lg flex items-center justify-center text-3xl`}
            >
              {category.icon || "🔧"}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                {category.trending && <Badge className="bg-red-100 text-red-800">热门</Badge>}
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{category.tool_count} 个工具</span>
                {category.avg_rating > 0 && <span>平均评分 {category.avg_rating.toFixed(1)}</span>}
                <span>热度 {category.popularity_score}</span>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回分类
              </Link>
            </Button>
          </div>
        </div>

        {/* Tools Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">相关工具</h2>
            <Badge variant="secondary">{pagination.total} 个工具</Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">最热门</SelectItem>
                <SelectItem value="rating">评分最高</SelectItem>
                <SelectItem value="newest">最新发布</SelectItem>
                <SelectItem value="name">名称排序</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1 border rounded-lg p-1">
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {toolsLoading && (
          <div
            className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}
          >
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {toolsError && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{toolsError}</p>
            <Button onClick={refetch}>重试</Button>
          </div>
        )}

        {/* Tools Grid/List */}
        {!toolsLoading && !toolsError && (
          <>
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {tools.map((tool) => (
                  <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={tool.logo_url || "/placeholder.svg?height=48&width=48"}
                          alt={tool.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {tool.name}
                            </h3>
                            {tool.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">精选</Badge>}
                            {tool.verified && <Badge className="bg-green-100 text-green-800 text-xs">认证</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{tool.developer}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                          <span className="text-sm text-gray-500">({tool.total_ratings})</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tool.pricing || "免费"}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link href={`/tools/${tool.id}`}>查看详情</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFavorite(tool.id)}
                          className={tool.is_favorited ? "text-red-600" : ""}
                        >
                          <Heart className={`h-4 w-4 ${tool.is_favorited ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={tool.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {tools.map((tool) => (
                  <Card key={tool.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={tool.logo_url || "/placeholder.svg?height=64&width=64"}
                          alt={tool.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              <Link href={`/tools/${tool.id}`}>{tool.name}</Link>
                            </h3>
                            {tool.featured && <Badge className="bg-yellow-100 text-yellow-800">精选</Badge>}
                            {tool.verified && <Badge className="bg-green-100 text-green-800">认证</Badge>}
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>开发者：{tool.developer}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>
                                {tool.rating} ({tool.total_ratings})
                              </span>
                            </div>
                            <span>浏览：{tool.view_count}</span>
                            <Badge variant="outline">{tool.pricing || "免费"}</Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFavorite(tool.id)}
                            className={tool.is_favorited ? "text-red-600" : ""}
                          >
                            <Heart className={`h-4 w-4 ${tool.is_favorited ? "fill-current" : ""}`} />
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={tool.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  上一页
                </Button>
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一页
                </Button>
              </div>
            )}

            {/* Empty State */}
            {tools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl">
                    {category.icon || "🔧"}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">该分类暂无工具</h3>
                <p className="text-gray-500 mb-4">成为第一个提交{category.name}工具的用户</p>
                <Button asChild>
                  <Link href="/submit">提交工具</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
