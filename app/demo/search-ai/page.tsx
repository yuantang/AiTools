"use client"

import { useState } from "react"
import { Sparkles, Search, TrendingUp, Target, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedSearchBar } from "@/components/EnhancedSearchBar"
import { RecommendationSection } from "@/components/RecommendationSection"

export default function SearchAIDemoPage() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string, filters?: any) => {
    setSearchQuery(query)
    // 这里可以调用实际的搜索API
    console.log("搜索:", query, filters)
  }

  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: "智能搜索",
      description: "全文搜索、自动完成、搜索建议",
      details: [
        "实时搜索建议",
        "搜索历史记录",
        "热门搜索展示",
        "模糊匹配和拼写纠错",
        "多维度筛选"
      ]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI推荐算法",
      description: "基于用户行为的智能推荐",
      details: [
        "协同过滤推荐",
        "基于内容的推荐",
        "混合推荐算法",
        "实时个性化",
        "推荐解释"
      ]
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "个性化体验",
      description: "根据用户偏好定制内容",
      details: [
        "用户行为追踪",
        "偏好学习",
        "动态调整",
        "多场景适配",
        "隐私保护"
      ]
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "趋势分析",
      description: "发现热门和趋势工具",
      details: [
        "实时热度计算",
        "趋势预测",
        "用户行为分析",
        "热门推荐",
        "新工具发现"
      ]
    }
  ]

  const algorithmTypes = [
    {
      name: "协同过滤",
      description: "基于相似用户的偏好推荐",
      accuracy: "85%",
      coverage: "高",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "内容推荐",
      description: "基于工具特征和用户偏好",
      accuracy: "78%",
      coverage: "中",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "热门推荐",
      description: "基于全站用户行为",
      accuracy: "72%",
      coverage: "高",
      color: "bg-orange-100 text-orange-800"
    },
    {
      name: "混合算法",
      description: "多种算法智能融合",
      accuracy: "92%",
      coverage: "最高",
      color: "bg-purple-100 text-purple-800"
    }
  ]

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
              <Link href="/demo/search-ai" className="text-blue-600 font-medium">
                搜索AI演示
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">智能搜索与AI推荐</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            体验下一代AI工具发现平台，通过智能搜索和个性化推荐，快速找到最适合您的AI工具
          </p>
          
          {/* Demo Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <EnhancedSearchBar
              onSearch={handleSearch}
              placeholder="尝试搜索：ChatGPT、图像生成、代码助手..."
              autoFocus={true}
              showFilters={true}
              className="shadow-lg"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              ChatGPT
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              Midjourney
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              GitHub Copilot
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              AI写作助手
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              图像生成
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">核心功能特性</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center">
                        <Zap className="h-3 w-3 text-green-500 mr-2" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Algorithm Showcase */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">推荐算法展示</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithmTypes.map((algorithm, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{algorithm.name}</CardTitle>
                    <Badge className={algorithm.color}>
                      {algorithm.accuracy}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{algorithm.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>准确率:</span>
                      <span className="font-medium">{algorithm.accuracy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>覆盖度:</span>
                      <span className="font-medium">{algorithm.coverage}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Demo */}
        <section className="mb-16">
          <Tabs defaultValue="recommendations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">智能推荐演示</TabsTrigger>
              <TabsTrigger value="search">搜索功能演示</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recommendations" className="mt-8">
              <RecommendationSection
                title="个性化推荐演示"
                subtitle="基于您的浏览历史和偏好，智能推荐相关工具"
                limit={6}
                showRefresh={true}
              />
            </TabsContent>
            
            <TabsContent value="search" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>搜索功能演示</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">搜索特性</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">✨ 智能建议</h4>
                          <p className="text-sm text-gray-600">输入时实时显示相关建议</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">🕒 搜索历史</h4>
                          <p className="text-sm text-gray-600">记录并快速访问历史搜索</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">🔥 热门搜索</h4>
                          <p className="text-sm text-gray-600">展示当前热门搜索词</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">🎯 精确匹配</h4>
                          <p className="text-sm text-gray-600">支持模糊搜索和拼写纠错</p>
                        </div>
                      </div>
                    </div>
                    
                    {searchQuery && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-blue-800">
                          <strong>当前搜索:</strong> "{searchQuery}"
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                          搜索结果将在实际应用中显示在这里
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">开始体验智能AI工具发现</h2>
          <p className="text-xl mb-8 opacity-90">
            立即使用我们的智能搜索和推荐系统，发现最适合您的AI工具
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools">
                <Search className="h-5 w-5 mr-2" />
                开始搜索
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/register">
                <Sparkles className="h-5 w-5 mr-2" />
                注册获取推荐
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
