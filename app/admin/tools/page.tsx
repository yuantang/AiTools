"use client"

import { useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, Eye, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const tools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "强大的对话式AI助手，支持文本生成、问答、编程等多种任务",
    logo: "/placeholder.svg?height=40&width=40",
    category: "AI写作",
    status: "active",
    featured: true,
    verified: true,
    rating: 4.8,
    users: "100M+",
    views: 125000,
    favorites: 8900,
    pricing: "免费试用",
    submittedBy: "OpenAI",
    createdAt: "2023-11-30",
    updatedAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Midjourney",
    description: "顶级AI图像生成工具，创造令人惊艳的艺术作品和设计",
    logo: "/placeholder.svg?height=40&width=40",
    category: "图像生成",
    status: "active",
    featured: true,
    verified: true,
    rating: 4.9,
    users: "20M+",
    views: 98000,
    favorites: 7200,
    pricing: "订阅制",
    submittedBy: "Midjourney Inc",
    createdAt: "2022-07-12",
    updatedAt: "2024-01-14",
  },
  {
    id: 3,
    name: "GitHub Copilot",
    description: "AI编程助手，实时代码建议和自动补全",
    logo: "/placeholder.svg?height=40&width=40",
    category: "AI编程",
    status: "active",
    featured: false,
    verified: true,
    rating: 4.7,
    users: "5M+",
    views: 87000,
    favorites: 6500,
    pricing: "订阅制",
    submittedBy: "GitHub",
    createdAt: "2021-06-29",
    updatedAt: "2024-01-13",
  },
  {
    id: 4,
    name: "AI写作助手Pro",
    description: "专业的AI写作工具，支持多种文体创作",
    logo: "/placeholder.svg?height=40&width=40",
    category: "AI写作",
    status: "pending",
    featured: false,
    verified: false,
    rating: 0,
    users: "0",
    views: 0,
    favorites: 0,
    pricing: "免费试用",
    submittedBy: "张小明",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
]

const categories = ["全部", "AI写作", "图像生成", "AI编程", "视频编辑", "音频处理", "办公助手"]
const statuses = ["全部", "active", "pending", "rejected", "inactive"]

export default function AdminToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedStatus, setSelectedStatus] = useState("全部")
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [selectedTools, setSelectedTools] = useState<number[]>([])

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || tool.category === selectedCategory
    const matchesStatus = selectedStatus === "全部" || tool.status === selectedStatus
    const matchesFeatured = !showFeaturedOnly || tool.featured
    const matchesVerified = !showVerifiedOnly || tool.verified

    return matchesSearch && matchesCategory && matchesStatus && matchesFeatured && matchesVerified
  })

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

  const handleSelectTool = (toolId: number) => {
    setSelectedTools((prev) => (prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]))
  }

  const handleSelectAll = () => {
    if (selectedTools.length === filteredTools.length) {
      setSelectedTools([])
    } else {
      setSelectedTools(filteredTools.map((tool) => tool.id))
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
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                仪表板
              </Link>
              <Link href="/admin/tools" className="text-blue-600 font-medium">
                工具管理
              </Link>
              <Link href="/admin/users" className="text-gray-600 hover:text-blue-600 transition-colors">
                用户管理
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                分类管理
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/">返回前台</Link>
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>管理员</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

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
                  <p className="text-2xl font-bold text-gray-900">{tools.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {tools.filter((t) => t.status === "active").length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">
                    {tools.filter((t) => t.status === "pending").length}
                  </p>
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
                  <p className="text-2xl font-bold text-gray-900">{tools.filter((t) => t.featured).length}</p>
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
                  {categories.map((category) => (
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
                  <Button size="sm" variant="outline">
                    批量发布
                  </Button>
                  <Button size="sm" variant="outline">
                    批量下线
                  </Button>
                  <Button size="sm" variant="destructive">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTools.length === filteredTools.length}
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
                {filteredTools.map((tool) => (
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
                      <Badge variant="outline">{tool.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tool.status)}>{getStatusText(tool.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{tool.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{tool.rating || "N/A"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-900">{tool.submittedBy}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">{tool.updatedAt}</p>
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
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredTools.length === 0 && (
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
