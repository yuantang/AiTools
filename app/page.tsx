"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { ToolsAPI } from "@/lib/api/tools"
import { CategoriesAPI } from "@/lib/api/categories"
import type { Tool, Category } from "@/lib/supabase"
import { SearchBar } from "@/components/SearchBar"
import { EnhancedSearchBar } from "@/components/EnhancedSearchBar"
import { RecommendationSection } from "@/components/RecommendationSection"

export default function HomePage() {
  const { user, userProfile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toolsResult, categoriesResult] = await Promise.all([
          ToolsAPI.getTools({ featured: true, limit: 8, sortBy: "popular" }),
          CategoriesAPI.getCategories({ active: true, withStats: true }),
        ])

        setFeaturedTools(toolsResult.data)
        setCategories(categoriesResult.slice(0, 8))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/tools?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI工具导航
              </span>
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
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                关于我们
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">欢迎，{userProfile?.name}</span>
                  {userProfile?.role === "admin" && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin">管理后台</Link>
                    </Button>
                  )}
                  <Button size="sm" asChild>
                    <Link href="/submit">提交工具</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">登录</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">注册</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              发现最好的
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI工具</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              收录全球最新最热门的AI产品，从写作助手到图像生成，从代码编程到数据分析，
              <br />
              帮助您快速找到适合的AI工具，提升工作效率
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <EnhancedSearchBar
                onSearch={(query, filters) => {
                  const params = new URLSearchParams()
                  params.set('search', query)
                  if (filters?.category_id) params.set('category', filters.category_id)
                  if (filters?.tags?.length) params.set('tags', filters.tags.join(','))
                  if (filters?.pricing_type) params.set('pricing', filters.pricing_type)
                  if (filters?.min_rating) params.set('rating', filters.min_rating.toString())
                  window.location.href = `/tools?${params.toString()}`
                }}
                placeholder="搜索AI工具，如：ChatGPT、Midjourney..."
                autoFocus={false}
                showFilters={true}
              />
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">AI工具</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">分类</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">10万+</div>
                <div className="text-gray-600">用户</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">精选工具</h2>
              <p className="text-gray-600">编辑推荐的优质AI工具</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/tools?featured=true">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
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
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool) => (
                <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
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
                        <p className="text-sm text-gray-500 truncate">{tool.category?.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{tool.rating}</span>
                        <span className="text-sm text-gray-500">({tool.total_ratings})</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {tool.pricing || "免费"}
                      </Badge>
                    </div>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href={`/tools/${tool.id}`}>查看详情</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <RecommendationSection
            title="智能推荐"
            subtitle="基于您的偏好和行为，为您推荐最适合的AI工具"
            limit={6}
            showRefresh={true}
          />
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">热门分类</h2>
              <p className="text-gray-600">按分类浏览AI工具</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/categories">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
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
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                      {category.trending && (
                        <Badge className="mt-3 bg-red-100 text-red-800">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          热门
                        </Badge>
                      )}
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">分享您发现的AI工具</h2>
            <p className="text-xl mb-8 opacity-90">帮助更多人发现优秀的AI工具，共同构建AI工具生态</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/submit">
                  <Users className="mr-2 h-5 w-5" />
                  提交工具
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/tools">浏览工具库</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">AI工具导航</span>
              </div>
              <p className="text-gray-400">发现和分享最好的AI工具</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tools" className="hover:text-white transition-colors">
                    工具库
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-white transition-colors">
                    分类
                  </Link>
                </li>
                <li>
                  <Link href="/submit" className="hover:text-white transition-colors">
                    提交工具
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">公司</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    联系我们
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    隐私政策
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    帮助中心
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-white transition-colors">
                    意见反馈
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    服务条款
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI工具导航. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
