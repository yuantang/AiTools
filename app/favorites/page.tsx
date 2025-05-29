"use client"

import { useState, useEffect } from "react"
import { Heart, Grid, List, Download, Trash2, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { FavoritesAPI } from "@/lib/api/favorites"
import { useCategories } from "@/hooks/useCategories"
import type { Favorite } from "@/lib/api/favorites"

export default function FavoritesPage() {
  const { user } = useAuth()
  const { categories } = useCategories()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user, page, selectedCategory])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)
      const result = await FavoritesAPI.getUserFavorites(user.id, {
        page,
        limit: 20,
        category: selectedCategory === "all" ? undefined : selectedCategory
      })
      
      setFavorites(result.data)
      setPagination(result.pagination)
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (toolId: string) => {
    if (!user) return

    try {
      await FavoritesAPI.removeFavorite(user.id, toolId)
      setFavorites(prev => prev.filter(fav => fav.tool?.id !== toolId))
    } catch (error) {
      console.error("Failed to remove favorite:", error)
    }
  }

  const handleExport = async () => {
    if (!user) return

    try {
      const data = await FavoritesAPI.exportFavorites(user.id)
      const csv = [
        "名称,描述,网址,分类,收藏时间",
        ...data.map(item => [
          item.tool?.name || "",
          item.tool?.description || "",
          item.tool?.url || "",
          item.tool?.category?.name || "",
          new Date(item.created_at).toLocaleDateString()
        ].join(","))
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "favorites.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export favorites:", error)
    }
  }

  const filteredFavorites = favorites.filter(favorite =>
    favorite.tool?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.tool?.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">需要登录</h2>
            <p className="text-gray-600 mb-4">请先登录查看您的收藏</p>
            <Button asChild>
              <Link href="/login">登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">AI工具导航</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具库
              </Link>
              <Link href="/favorites" className="text-blue-600 font-medium">
                我的收藏
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
            <p className="text-gray-600">管理您收藏的AI工具</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出收藏
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索收藏的工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
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
        <div className="mb-6">
          <p className="text-gray-600">
            共 {pagination.total} 个收藏
            {searchQuery && (
              <span>
                ，找到 {filteredFavorites.length} 个匹配结果
              </span>
            )}
          </p>
        </div>

        {/* Favorites Grid/List */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={favorite.tool?.logo_url || "/placeholder.svg?height=48&width=48"}
                          alt={favorite.tool?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {favorite.tool?.name}
                          </h3>
                          <p className="text-sm text-gray-500">{favorite.tool?.category?.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFavorite(favorite.tool?.id || "")}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {favorite.tool?.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline">{favorite.tool?.category?.name}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(favorite.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <Button className="w-full" asChild>
                        <Link href={`/tools/${favorite.tool?.id}`}>查看详情</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFavorites.map((favorite) => (
                  <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={favorite.tool?.logo_url || "/placeholder.svg?height=64&width=64"}
                          alt={favorite.tool?.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              <Link href={`/tools/${favorite.tool?.id}`}>
                                {favorite.tool?.name}
                              </Link>
                            </h3>
                            <Badge variant="outline">{favorite.tool?.category?.name}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {favorite.tool?.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              收藏于 {new Date(favorite.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button asChild>
                            <Link href={`/tools/${favorite.tool?.id}`}>查看详情</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFavorite(favorite.tool?.id || "")}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
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
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    上一页
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    第 {page} 页，共 {pagination.totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "未找到匹配的收藏" : "还没有收藏任何工具"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "尝试调整搜索条件" : "去工具库发现喜欢的AI工具吧"}
            </p>
            <Button asChild>
              <Link href="/tools">浏览工具库</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
