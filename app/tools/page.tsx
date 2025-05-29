"use client"

import { useState, useEffect } from "react"
import { Search, Grid, List, Star, Heart, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchBar } from "@/components/SearchBar"
import { useTools } from "@/hooks/useTools"
import { useCategories } from "@/hooks/useCategories"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "name">("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [page, setPage] = useState(1)

  const { tools, loading, pagination, refetch } = useTools({
    page,
    limit: 20,
    category: selectedCategory === "全部" ? undefined : selectedCategory,
    search: searchQuery,
    featured: showFeaturedOnly,
    sortBy,
  })

  const { categories } = useCategories()

  useEffect(() => {
    setPage(1) // 重置页码当筛选条件改变时
  }, [searchQuery, selectedCategory, sortBy, showFeaturedOnly])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
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
              <Link href="/tools" className="text-blue-600 font-medium">
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
                <Link href="/submit">提交工具</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI工具库</h1>
          <p className="text-gray-600">发现最新最好用的AI工具</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} className="max-w-2xl" />

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="全部">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    热门
                  </div>
                </SelectItem>
                <SelectItem value="rating">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    评分
                  </div>
                </SelectItem>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    最新
                  </div>
                </SelectItem>
                <SelectItem value="name">名称</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={showFeaturedOnly} onCheckedChange={setShowFeaturedOnly} />
              <label htmlFor="featured" className="text-sm">
                仅显示精选
              </label>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            找到 {pagination.total} 个工具
            {searchQuery && (
              <span>
                {" "}
                关于 "<strong>{searchQuery}</strong>"
              </span>
            )}
          </p>
          <div className="text-sm text-gray-500">
            第 {pagination.page} 页，共 {pagination.totalPages} 页
          </div>
        </div>

        {/* Tools Grid/List */}
        {loading && page === 1 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : tools.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={tool.logo_url || "/placeholder.svg?height=48&width=48"}
                          alt={tool.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-500">{tool.category?.name}</p>
                        </div>
                        {tool.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">精选</Badge>}
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tool.rating}</span>
                          <span className="text-xs text-gray-500">({tool.total_ratings})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-500">{tool.favorite_count}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {tool.tags && tool.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/tools/${tool.id}`}>查看详情</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
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
                            <Badge variant="outline">{tool.category?.name}</Badge>
                            {tool.featured && <Badge className="bg-yellow-100 text-yellow-800">精选</Badge>}
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                          <div className="flex items-center space-x-6 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{tool.rating}</span>
                              <span className="text-xs text-gray-500">({tool.total_ratings} 评价)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{tool.favorite_count} 收藏</span>
                            </div>
                            <div className="text-xs text-gray-500">{tool.view_count} 浏览</div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tool.tags?.slice(0, 5).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button asChild>
                            <Link href={`/tools/${tool.id}`}>查看详情</Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {pagination.page < pagination.totalPages && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} disabled={loading} size="lg">
                  {loading ? "加载中..." : "加载更多"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关工具</h3>
            <p className="text-gray-500 mb-4">尝试调整搜索条件或筛选器</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("全部")
                setShowFeaturedOnly(false)
                setSortBy("popular")
              }}
            >
              清除筛选条件
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
