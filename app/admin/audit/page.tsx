"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Check, X, Clock, Filter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/useAuth"
import { AdminAPI } from "@/lib/api/admin"
import { ToolsAPI } from "@/lib/api/tools"
import type { Tool, User } from "@/lib/supabase"

export default function AdminAuditPage() {
  const { user, userProfile } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [submissions, setSubmissions] = useState<(Tool & { submitter: User })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])

  useEffect(() => {
    // 检查管理员权限
    if (userProfile && userProfile.role !== "admin") {
      window.location.href = "/"
      return
    }

    fetchSubmissions()
  }, [userProfile, statusFilter])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const data = await AdminAPI.getSubmissions({ status: statusFilter, search: searchQuery })
      setSubmissions(data)
    } catch (error) {
      console.error("Failed to fetch submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (toolId: string) => {
    if (!user) return

    try {
      await ToolsAPI.reviewTool(toolId, "approve", "审核通过", user.id)
      fetchSubmissions() // 重新获取数据
    } catch (error) {
      console.error("Failed to approve tool:", error)
    }
  }

  const handleReject = async (toolId: string) => {
    if (!user) return

    try {
      await ToolsAPI.reviewTool(toolId, "reject", "不符合收录标准", user.id)
      fetchSubmissions() // 重新获取数据
    } catch (error) {
      console.error("Failed to reject tool:", error)
    }
  }

  const handleBatchApprove = async () => {
    if (!user || selectedSubmissions.length === 0) return

    try {
      await Promise.all(
        selectedSubmissions.map((toolId) => ToolsAPI.reviewTool(toolId, "approve", "批量审核通过", user.id)),
      )
      setSelectedSubmissions([])
      fetchSubmissions()
    } catch (error) {
      console.error("Failed to batch approve:", error)
    }
  }

  const handleBatchReject = async () => {
    if (!user || selectedSubmissions.length === 0) return

    try {
      await Promise.all(
        selectedSubmissions.map((toolId) => ToolsAPI.reviewTool(toolId, "reject", "批量审核拒绝", user.id)),
      )
      setSelectedSubmissions([])
      fetchSubmissions()
    } catch (error) {
      console.error("Failed to batch reject:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待审核"
      case "active":
        return "已通过"
      case "rejected":
        return "已拒绝"
      default:
        return "未知"
    }
  }

  const handleSelectSubmission = (toolId: string) => {
    setSelectedSubmissions((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSelectAll = () => {
    if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([])
    } else {
      setSelectedSubmissions(submissions.map((s) => s.id))
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
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                仪表板
              </Link>
              <Link href="/admin/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具管理
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 transition-colors">
                用户管理
              </Link>
              <Link href="/admin/audit" className="text-blue-600 font-medium">
                审核管理
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
            <h1 className="text-3xl font-bold text-gray-900">审核管理</h1>
            <p className="text-gray-600">审核用户提交的AI工具</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待审核</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === "pending").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已通过</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已拒绝</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {submissions.filter((s) => s.status === "rejected").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总提交数</p>
                  <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索工具名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="active">已通过</SelectItem>
                  <SelectItem value="rejected">已拒绝</SelectItem>
                  <SelectItem value="all">全部状态</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchSubmissions}>
                <Search className="h-4 w-4 mr-2" />
                搜索
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Batch Actions */}
        {selectedSubmissions.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已选择 {selectedSubmissions.length} 个提交</span>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleBatchApprove}>
                    批量通过
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleBatchReject}>
                    批量拒绝
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>工具提交列表</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedSubmissions.length === submissions.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>工具信息</TableHead>
                  <TableHead>提交者</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={() => handleSelectSubmission(submission.id)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={submission.logo_url || "/placeholder.svg?height=40&width=40"}
                          alt={submission.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{submission.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{submission.description}</p>
                          <p className="text-xs text-gray-400">{submission.website}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={submission.submitter.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{submission.submitter.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{submission.submitter.name}</p>
                          <p className="text-xs text-gray-500">{submission.submitter.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>{getStatusText(submission.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tools/${submission.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {submission.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(submission.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(submission.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无提交记录</h3>
            <p className="text-gray-500">当前筛选条件下没有找到相关提交</p>
          </div>
        )}
      </div>
    </div>
  )
}
