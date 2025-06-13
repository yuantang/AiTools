"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, ExternalLink, Heart, Share2, Flag, Users, ArrowLeft, Zap, Globe, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { ToolsAPI } from "@/lib/api/tools"
import { Comments } from "@/components/Comments"
import { SimilarTools } from "@/components/SimilarTools"
import type { Tool } from "@/lib/supabase"

interface ToolDetailPageProps {
  params: {
    id: string
  }
}

// Mock data - 在实际应用中这些数据会从数据库获取
const toolData = {
  id: "715d5501-cc5e-488d-ab58-4bf581d4491f",
  name: "ChatGPT",
  description:
    "ChatGPT是OpenAI开发的大型语言模型，基于GPT架构。它能够进行自然语言对话，协助用户完成写作、编程、分析、创意等多种任务。",
  logo: "/placeholder.svg?height=80&width=80",
  category: "AI写作",
  rating: 4.8,
  totalRatings: 12543,
  users: "100M+",
  pricing: "免费试用",
  tags: ["对话", "文本生成", "编程", "写作助手", "问答"],
  featured: true,
  url: "https://chat.openai.com",
  screenshots: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  features: ["自然语言对话", "多语言支持", "代码生成与调试", "文档写作", "数据分析", "创意写作"],
  pricingPlans: [
    {
      name: "免费版",
      price: "¥0",
      period: "/月",
      features: ["基础对话功能", "有限次数使用", "标准响应速度"],
    },
    {
      name: "Plus版",
      price: "¥140",
      period: "/月",
      features: ["无限制使用", "优先访问", "更快响应速度", "GPT-4访问权限"],
      popular: true,
    },
    {
      name: "Team版",
      price: "¥210",
      period: "/月/用户",
      features: ["团队协作", "管理控制台", "数据安全", "优先支持"],
    },
  ],
  details: {
    developer: "OpenAI",
    releaseDate: "2022-11-30",
    lastUpdate: "2024-01-15",
    languages: ["中文", "英文", "日文", "韩文", "法文", "德文"],
    platforms: ["Web", "iOS", "Android", "API"],
    apiAvailable: true,
    openSource: false,
  },
  is_favorited: false,
}

const reviews = [
  {
    id: 1,
    user: {
      name: "张小明",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    date: "2024-01-10",
    content: "非常强大的AI工具，在编程和写作方面帮助很大。响应速度快，回答质量高。",
    helpful: 23,
  },
  {
    id: 2,
    user: {
      name: "李小红",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
    rating: 4,
    date: "2024-01-08",
    content: "界面简洁易用，功能丰富。免费版本有一些限制，但对于日常使用已经足够。",
    helpful: 15,
  },
  {
    id: 3,
    user: {
      name: "王小华",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    date: "2024-01-05",
    content: "作为程序员，这个工具大大提高了我的工作效率。代码生成和调试功能特别实用。",
    helpful: 31,
  },
]

const similarTools = [
  {
    id: 2,
    name: "Claude",
    description: "Anthropic开发的AI助手",
    logo: "/placeholder.svg?height=48&width=48",
    rating: 4.7,
    category: "AI写作",
  },
  {
    id: 3,
    name: "Gemini",
    description: "Google的多模态AI模型",
    logo: "/placeholder.svg?height=48&width=48",
    rating: 4.6,
    category: "AI写作",
  },
  {
    id: 4,
    name: "Copilot",
    description: "Microsoft的AI助手",
    logo: "/placeholder.svg?height=48&width=48",
    rating: 4.5,
    category: "AI写作",
  },
]

export default function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { user } = useAuth()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [userReview, setUserReview] = useState("")
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const toolData = await ToolsAPI.getTool(params.id as string, user?.id)
        console.log('Tool data loaded:', toolData)
        console.log('Tool URL:', toolData.url)
        setTool(toolData)
        setIsFavorited(toolData.is_favorited || false)

        // 查找用户的评分
        if (user && toolData.ratings) {
          const userRatingData = toolData.ratings.find((r: any) => r.user_id === user.id)
          if (userRatingData) {
            setUserRating(userRatingData.rating)
            setReviewText(userRatingData.review || "")
          }
        }
      } catch (error) {
        console.error("Failed to fetch tool:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTool()
    }
  }, [params.id, user])

  const toggleFavorite = async () => {
    console.log('toggleFavorite clicked')
    if (!tool) return

    try {
      setTool((prev) => prev ? ({ ...prev, is_favorited: !prev.is_favorited }) : null)
      // TODO: Implement API call
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const handleRatingSubmit = async () => {
    if (!userRating) return

    setIsSubmittingReview(true)
    try {
      // TODO: Implement rating submission
      setUserRating(0)
      setUserReview("")
    } catch (error) {
      console.error("Failed to submit rating:", error)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    setIsSubmittingComment(true)
    try {
      // TODO: Implement comment submission
      setNewComment("")
    } catch (error) {
      console.error("Failed to submit comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">工具不存在或加载失败</p>
          <Button asChild>
            <Link href="/tools">返回工具库</Link>
          </Button>
        </div>
      </div>
    )
  }

  const ratingDistribution = [
    { stars: 5, percentage: 68 },
    { stars: 4, percentage: 22 },
    { stars: 3, percentage: 7 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 },
  ]

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
              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/profile">个人中心</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/submit">提交工具</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">登录</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/submit">提交工具</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            首页
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-blue-600">
            工具库
          </Link>
          <span>/</span>
          <Link href={`/categories/${tool.category?.id || tool.category_id || ''}`} className="hover:text-blue-600">
            {tool.category?.name || tool.category || '未分类'}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{tool.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tool Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={tool.logo || "/placeholder.svg"}
                    alt={tool.name}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge className="bg-blue-100 text-blue-800">{tool.category?.name || tool.category || '未分类'}</Badge>
                          {tool.featured && <Badge className="bg-yellow-100 text-yellow-800">精选推荐</Badge>}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{tool.rating}</span>
                            <span className="text-gray-500">({(tool.totalRatings || 0).toLocaleString()} 评价)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{tool.users} 用户</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={toggleFavorite}
                          className={`cursor-pointer ${tool.is_favorited ? "text-red-600" : ""}`}
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${tool.is_favorited ? "fill-current" : ""}`} />
                          {tool.is_favorited ? "已收藏" : "收藏"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Share button clicked')
                            if (navigator.share) {
                              navigator.share({ title: tool.name, url: window.location.href })
                            } else {
                              alert('分享功能不支持，已复制链接到剪贴板')
                              navigator.clipboard?.writeText(window.location.href)
                            }
                          }}
                          className="cursor-pointer"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          分享
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Report button clicked')
                            alert('举报功能开发中，感谢您的反馈！')
                          }}
                          className="cursor-pointer"
                          style={{ pointerEvents: 'auto' }}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          举报
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(tool.tags || []).map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-3" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                      <Button
                        size="lg"
                        className="cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => {
                          const url = tool.website || tool.url
                          console.log('访问官网 clicked, URL:', url)
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer')
                          } else {
                            alert('暂无官网链接')
                          }
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        访问官网
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="cursor-pointer"
                        style={{ pointerEvents: 'auto' }}
                        onClick={() => {
                          const url = tool.website || tool.url
                          console.log('免费试用 clicked, URL:', url)
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer')
                          } else {
                            alert('暂无试用链接')
                          }
                        }}
                      >
                        免费试用
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screenshots */}
            <Card>
              <CardHeader>
                <CardTitle>产品截图</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {(tool.screenshots || []).map((screenshot, index) => (
                    <img
                      key={index}
                      src={screenshot || "/placeholder.svg"}
                      alt={`${tool.name} 截图 ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>主要功能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {(tool.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>价格方案</CardTitle>
                <CardDescription>选择适合您需求的方案</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {(tool.pricingPlans || []).map((plan, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-6 relative ${
                        plan.popular ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">推荐</Badge>
                      )}
                      <div className="text-center mb-4">
                        <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold">{plan.price}</span>
                          <span className="text-gray-500 ml-1">{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => {
                          const url = tool.website || tool.url
                          console.log('选择方案 clicked, URL:', url)
                          if (url) {
                            window.open(url, '_blank', 'noopener,noreferrer')
                          } else {
                            alert('暂无购买链接')
                          }
                        }}
                      >
                        选择方案
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>用户评价</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Rating Summary */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">{tool.rating}</div>
                    <div className="flex items-center justify-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= Math.floor(tool.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-500">{(tool.totalRatings || 0).toLocaleString()} 条评价</p>
                  </div>
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center space-x-3">
                        <span className="text-sm w-8">{item.stars}星</span>
                        <Progress value={item.percentage} className="flex-1" />
                        <span className="text-sm text-gray-500 w-10">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{review.user.name}</span>
                            {review.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                已验证
                              </Badge>
                            )}
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{review.content}</p>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              有用 ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                              回复
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // 滚动到评价区域
                      const reviewsSection = document.querySelector('[data-reviews-section]')
                      reviewsSection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    查看更多评价
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Comments toolId={params.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tool Info */}
            <Card>
              <CardHeader>
                <CardTitle>工具信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">开发商</span>
                  <span className="font-medium">{tool.details?.developer || '未知'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">发布日期</span>
                  <span className="font-medium">{tool.details?.releaseDate || '未知'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">最近更新</span>
                  <span className="font-medium">{tool.details?.lastUpdate || '未知'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">支持平台</span>
                  <div className="flex flex-wrap gap-1">
                    {(tool.details?.platforms || []).map((platform, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API支持</span>
                  <span className="font-medium">{tool.details?.apiAvailable ? "✅ 支持" : "❌ 不支持"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">开源</span>
                  <span className="font-medium">{tool.details?.openSource ? "✅ 是" : "❌ 否"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Supported Languages */}
            <Card>
              <CardHeader>
                <CardTitle>支持语言</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(tool.details?.languages || []).map((language, index) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Tools */}
            <SimilarTools
              toolId={params.id}
              title="相似工具"
              limit={4}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    const url = tool.website || tool.url
                    console.log('侧边栏访问官网 clicked, URL:', url)
                    if (url) {
                      window.open(url, '_blank', 'noopener,noreferrer')
                    } else {
                      alert('暂无官网链接')
                    }
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  访问官网
                </Button>
                <Button variant="outline" className="w-full" onClick={toggleFavorite}>
                  <Heart className="h-4 w-4 mr-2" />
                  {tool.is_favorited ? "取消收藏" : "添加到收藏"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigator.share?.({ title: tool.name, url: window.location.href })}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  分享给朋友
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
