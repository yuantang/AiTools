"use client"

import { useState } from "react"
import { Search, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCategories } from "@/hooks/useCategories"
import { Header } from "@/components/layout/Header"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { categories, loading, error } = useCategories({ active: true, withStats: true })

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>重试</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="categories" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI工具分类</h1>
          <p className="text-xl text-gray-600 mb-8">按分类浏览和发现AI工具</p>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="搜索分类..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer"
              asChild
            >
              <Link href={`/categories/${category.slug}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className={`w-12 h-12 ${category.color || "bg-blue-500"} rounded-lg flex items-center justify-center text-2xl`}
                    >
                      {category.icon || "🔧"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">{category.tool_count} 个工具</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {category.trending && (
                        <Badge className="bg-red-100 text-red-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          热门
                        </Badge>
                      )}
                      {category.avg_rating > 0 && (
                        <Badge variant="outline" className="text-xs">
                          ⭐ {category.avg_rating.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关分类</h3>
            <p className="text-gray-500 mb-4">尝试使用其他关键词搜索</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              清除搜索
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{categories.length}</div>
              <div className="text-gray-600">个分类</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {categories.reduce((sum, cat) => sum + cat.tool_count, 0)}
              </div>
              <div className="text-gray-600">个工具</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.filter((cat) => cat.trending).length}
              </div>
              <div className="text-gray-600">个热门分类</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
