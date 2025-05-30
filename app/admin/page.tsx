"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Settings, Database, FileText, Eye, Plus, Download, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import { useAuth } from "@/hooks/useAuth"
import { Header } from "@/components/layout/Header"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const router = useRouter()
  const { user, userProfile, loading: authLoading } = useAuth()
  const {
    data: dashboardData,
    loading,
    error,
    approveTool,
    rejectTool
  } = useAdminDashboard()

  // 认证检查
  useEffect(() => {
    if (!authLoading) {
      if (!user || !userProfile) {
        router.push('/login')
        return
      }

      if (userProfile.role !== 'admin' || userProfile.status !== 'active') {
        router.push('/login?error=unauthorized')
        return
      }
    }
  }, [user, userProfile, authLoading, router])

  const stats = dashboardData?.stats || {
    totalTools: 0,
    activeTools: 0,
    pendingTools: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalCategories: 0,
  }

  const pendingSubmissions = dashboardData?.pendingSubmissions || []
  const topTools = dashboardData?.topTools || []
  const recentUsers = dashboardData?.recentUsers || []
  const systemStatus = dashboardData?.systemStatus || {
    database: 'healthy',
    api: 'healthy',
    storage: 23,
    uptime: '99.9%'
  }

  const handleApprove = async (toolId: string) => {
    try {
      await approveTool(toolId)
    } catch (error) {
      console.error("Failed to approve tool:", error)
    }
  }

  const handleReject = async (toolId: string) => {
    try {
      await rejectTool(toolId)
    } catch (error) {
      console.error("Failed to reject tool:", error)
    }
  }

  // 如果正在认证检查，显示加载状态
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
        </div>
      </div>
    )
  }

  // 如果未登录或无权限，不显示内容（会被重定向）
  if (!user || !userProfile || userProfile.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载仪表盘数据...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            重新加载
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理仪表板</h1>
            <p className="text-gray-600">欢迎回来，系统管理员</p>
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
                          <span>提交者：{submission.users?.name || submission.submitter?.name || '未知'}</span>
                          <span>分类：{submission.categories?.name || submission.category?.name || '未分类'}</span>
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

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>系统状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>数据库连接</span>
                    <span className={systemStatus.database === 'healthy' ? "text-green-600" : "text-red-600"}>
                      {systemStatus.database === 'healthy' ? '正常' : '异常'}
                    </span>
                  </div>
                  <Progress value={systemStatus.database === 'healthy' ? 100 : 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API响应</span>
                    <span className={systemStatus.api === 'healthy' ? "text-green-600" : "text-red-600"}>
                      {systemStatus.api === 'healthy' ? '正常' : '异常'}
                    </span>
                  </div>
                  <Progress value={systemStatus.api === 'healthy' ? 95 : 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>存储空间</span>
                    <span>{systemStatus.storage}%</span>
                  </div>
                  <Progress value={systemStatus.storage} className="h-2" />
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
