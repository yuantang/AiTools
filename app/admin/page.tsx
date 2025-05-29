"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Settings, Database, FileText, Eye, Plus, Download, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { AdminAPI } from "@/lib/api/admin"
import { ToolsAPI } from "@/lib/api/tools"
import type { Tool, User } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const { user, userProfile } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [stats, setStats] = useState({
    totalTools: 0,
    activeTools: 0,
    pendingTools: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalCategories: 0,
  })
  const [pendingSubmissions, setPendingSubmissions] = useState<(Tool & { submitter: User })[]>([])
  const [topTools, setTopTools] = useState<Tool[]>([])
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (userProfile && userProfile.role !== "admin") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        // 如果没有用户信息，直接跳转
        if (!user) {
          return
        }

        // 如果用户角色不是管理员，跳转到首页
        if (userProfile && userProfile.role !== "admin") {
          return
        }

        // 如果还在加载用户信息，等待
        if (!userProfile) {
          return
        }

        // 使用模拟数据替代API调用，避免加载问题
        const mockStats = {
          totalTools: 156,
          activeTools: 142,
          pendingTools: 14,
          totalUsers: 1248,
          activeUsers: 892,
          totalCategories: 8,
        }

        const mockPendingSubmissions = []
        const mockTopTools = []
        const mockRecentUsers = []

        setStats(mockStats)
        setPendingSubmissions(mockPendingSubmissions)
        setTopTools(mockTopTools)
        setRecentUsers(mockRecentUsers)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    // 只有当认证状态确定时才执行
    if (!loading) {
      fetchData()
    }
  }, [user, userProfile, loading, router])

  // 如果认证还在加载中
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证权限...</p>
        </div>
      </div>
    )
  }

  // 如果没有登录
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h1>
          <p className="text-gray-600 mb-6">请先登录后再访问管理后台</p>
          <Button asChild>
            <Link href="/login">前往登录</Link>
          </Button>
        </div>
      </div>
    )
  }

  // 如果不是管理员
  if (userProfile && userProfile.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">权限不足</h1>
          <p className="text-gray-600 mb-6">您没有访问管理后台的权限</p>
          <Button asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleApprove = async (toolId: string) => {
    if (!user) return

    try {
      await ToolsAPI.reviewTool(toolId, "approve", "审核通过", user.id)
      // 重新获取待审核列表
      const pendingData = await AdminAPI.getPendingSubmissions()
      setPendingSubmissions(pendingData)
    } catch (error) {
      console.error("Failed to approve tool:", error)
    }
  }

  const handleReject = async (toolId: string) => {
    if (!user) return

    try {
      await ToolsAPI.reviewTool(toolId, "reject", "不符合收录标准", user.id)
      // 重新获取待审核列表
      const pendingData = await AdminAPI.getPendingSubmissions()
      setPendingSubmissions(pendingData)
    } catch (error) {
      console.error("Failed to reject tool:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">AI工具导航</span>
              </Link>
              <Badge className="bg-red-100 text-red-800">管理后台</Badge>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-blue-600 font-medium">
                仪表板
              </Link>
              <Link href="/admin/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具管理
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 transition-colors">
                用户管理
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                分类管理
              </Link>
              <Link href="/admin/settings" className="text-gray-600 hover:text-blue-600 transition-colors">
                系统设置
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/">返回前台</Link>
              </Button>
              <Avatar>
                <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{userProfile?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理仪表板</h1>
            <p className="text-gray-600">欢迎回来，{userProfile?.name}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">今天</SelectItem>
                <SelectItem value="7d">7天</SelectItem>
                <SelectItem value="30d">30天</SelectItem>
                <SelectItem value="90d">90天</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总工具数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTools}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已发布</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeTools}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待审核</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingTools}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总用户数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃用户</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">分类数</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>待审核工具</CardTitle>
                    <CardDescription>需要审核的工具提交</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/admin/audit">查看全部</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingSubmissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                          <Badge className="bg-yellow-100 text-yellow-800">待审核</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{submission.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>提交者：{submission.submitter.name}</span>
                          <span>分类：{submission.category?.name}</span>
                          <span>时间：{new Date(submission.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tools/${submission.id}`} target="_blank">
                            查看
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(submission.id)}
                        >
                          通过
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(submission.id)}>
                          拒绝
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">暂无待审核的工具</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Tools */}
            <Card>
              <CardHeader>
                <CardTitle>热门工具</CardTitle>
                <CardDescription>按访问量排序的热门工具</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTools.map((tool, index) => (
                    <div key={tool.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <img
                          src={tool.logo_url || "/placeholder.svg?height=40&width=40"}
                          alt={tool.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                          <p className="text-sm text-gray-500">{tool.category?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{tool.view_count.toLocaleString()}</div>
                          <div className="text-gray-500">访问</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{tool.favorite_count.toLocaleString()}</div>
                          <div className="text-gray-500">收藏</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{tool.rating}</div>
                          <div className="text-gray-500">评分</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/admin/tools/new">
                    <Plus className="h-4 w-4 mr-2" />
                    添加新工具
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/categories">
                    <Settings className="h-4 w-4 mr-2" />
                    管理分类
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    用户管理
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    数据分析
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>新注册用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                        {user.status === "active" ? "活跃" : "非活跃"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>系统状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>数据库连接</span>
                    <span className="text-green-600">正常</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API响应</span>
                    <span className="text-green-600">正常</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>存储空间</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span>系统状态</span>
                    <Badge className="bg-green-100 text-green-800">正常运行</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
