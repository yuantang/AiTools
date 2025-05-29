"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Plus, Edit, Trash2, Eye, Star, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAdminTools } from "@/hooks/useAdminTools"
import { useCategories } from "@/hooks/useCategories"
import { Header } from "@/components/layout/Header"

const statuses = ["全部", "active", "pending", "rejected", "inactive"]

export default function AdminToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedStatus, setSelectedStatus] = useState("全部")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [page, setPage] = useState(1)

  // 获取分类数据
  const { categories } = useCategories()
  const categoryOptions = ["全部", ...(categories?.map(c => c.name) || [])]

  // 获取工具数据
  const {
    data: toolsData,
    loading,
    error,
    deleteTool,
    batchOperation
  } = useAdminTools({
    page,
    search: searchQuery || undefined,
    category: selectedCategory !== "全部" ? selectedCategory : undefined,
    status: selectedStatus !== "全部" ? selectedStatus : undefined,
    featured: showFeaturedOnly || undefined,
    verified: showVerifiedOnly || undefined,
  })

  const tools = toolsData?.tools || []
  const statistics = toolsData?.statistics || { total: 0, active: 0, pending: 0, featured: 0, verified: 0 }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "已发布"
      case "pending":
        return "待审核"
      case "rejected":
        return "已拒绝"
      case "inactive":
        return "已下线"
      default:
        return "未知"
    }
  }

  const handleSelectTool = (toolId: string) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSelectAll = () => {
    if (selectedTools.length === tools.length) {
      setSelectedTools([])
    } else {
      setSelectedTools(tools.map((tool) => tool.id))
    }
  }

  const handleDelete = async (toolId: string) => {
    if (confirm("确定要删除这个工具吗？")) {
      try {
        await deleteTool(toolId)
        setSelectedTools(prev => prev.filter(id => id !== toolId))
      } catch (error) {
        // 错误已在hook中处理
      }
    }
  }

  const handleBatchOperation = async (action: string) => {
    if (selectedTools.length === 0) return

    const actionNames: Record<string, string> = {
      publish: '发布',
      unpublish: '下线',
      delete: '删除'
    }

    const actionName = actionNames[action] || action
    if (confirm(`确定要${actionName}选中的 ${selectedTools.length} 个工具吗？`)) {
      try {
        await batchOperation(action, selectedTools)
        setSelectedTools([])
      } catch (error) {
        // 错误已在hook中处理
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">工具管理</h1>
            <p className="text-gray-600">管理平台上的所有AI工具</p>
          </div>
          <Button asChild>
            <Link href="/admin/tools/new">
              <Plus className="h-4 w-4 mr-2" />
              添加工具
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总工具数</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已发布</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.active}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">精选工具</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.featured}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-purple-600" />
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
                    placeholder="搜索工具名称或描述..."
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
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "全部" ? "全部状态" : getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" checked={showFeaturedOnly} onCheckedChange={setShowFeaturedOnly} />
                  <label htmlFor="featured" className="text-sm">
                    仅精选
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" checked={showVerifiedOnly} onCheckedChange={setShowVerifiedOnly} />
                  <label htmlFor="verified" className="text-sm">
                    仅认证
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTools.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已选择 {selectedTools.length} 个工具</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleBatchOperation('publish')}>
                    批量发布
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleBatchOperation('unpublish')}>
                    批量下线
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleBatchOperation('delete')}>
                    批量删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">加载中...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 mb-2">加载失败</div>
                <div className="text-gray-500 text-sm">{error}</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTools.length === tools.length && tools.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                  <TableHead>工具</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>数据</TableHead>
                  <TableHead>提交者</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                  {tools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTools.includes(tool.id)}
                          onCheckedChange={() => handleSelectTool(tool.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={tool.logo || "/placeholder.svg"}
                            alt={tool.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">{tool.name}</p>
                              {tool.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">精选</Badge>}
                              {tool.verified && <Badge className="bg-green-100 text-green-800 text-xs">认证</Badge>}
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tool.categories?.name || '未分类'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(tool.status)}>{getStatusText(tool.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{tool.views?.toLocaleString() || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{tool.rating || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900">{tool.users?.name || tool.users?.email || '未知'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-500">{new Date(tool.updated_at).toLocaleDateString()}</p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/tools/${tool.id}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/tools/${tool.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(tool.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!loading && !error && tools.length === 0 && (
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
                setSelectedStatus("全部")
                setShowFeaturedOnly(false)
                setShowVerifiedOnly(false)
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
