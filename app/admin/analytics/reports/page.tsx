"use client"

import { useState } from "react"
import { Download, FileText, Calendar, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ReportExporter } from "@/components/ReportExporter"

const reportHistory = [
  {
    id: 1,
    name: "月度流量报告",
    type: "traffic",
    format: "PDF",
    createdAt: "2024-01-15",
    createdBy: "管理员",
    status: "completed",
    fileSize: "2.3 MB",
    downloadCount: 12,
  },
  {
    id: 2,
    name: "用户增长分析",
    type: "users",
    format: "Excel",
    createdAt: "2024-01-14",
    createdBy: "数据分析师",
    status: "completed",
    fileSize: "1.8 MB",
    downloadCount: 8,
  },
  {
    id: 3,
    name: "工具使用统计",
    type: "tools",
    format: "CSV",
    createdAt: "2024-01-13",
    createdBy: "产品经理",
    status: "processing",
    fileSize: "-",
    downloadCount: 0,
  },
  {
    id: 4,
    name: "收入季度报告",
    type: "revenue",
    format: "PDF",
    createdAt: "2024-01-12",
    createdBy: "财务经理",
    status: "failed",
    fileSize: "-",
    downloadCount: 0,
  },
]

const reportTypes = ["全部", "traffic", "users", "tools", "revenue"]
const reportStatuses = ["全部", "completed", "processing", "failed"]

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("全部")
  const [selectedStatus, setSelectedStatus] = useState("全部")

  const filteredReports = reportHistory.filter((report) => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "全部" || report.type === selectedType
    const matchesStatus = selectedStatus === "全部" || report.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "processing":
        return "生成中"
      case "failed":
        return "失败"
      default:
        return "未知"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "traffic":
        return "流量报告"
      case "users":
        return "用户报告"
      case "tools":
        return "工具报告"
      case "revenue":
        return "收入报告"
      default:
        return "未知"
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
              <Link href="/admin/analytics" className="text-blue-600 font-medium">
                数据分析
              </Link>
              <Link href="/admin/analytics/reports" className="text-blue-600 font-medium">
                报告管理
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
            <h1 className="text-3xl font-bold text-gray-900">报告管理</h1>
            <p className="text-gray-600">管理和下载数据分析报告</p>
          </div>
          <ReportExporter />
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总报告数</p>
                  <p className="text-2xl font-bold text-gray-900">{reportHistory.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportHistory.filter((r) => r.status === "completed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">生成中</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportHistory.filter((r) => r.status === "processing").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总下载量</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportHistory.reduce((sum, r) => sum + r.downloadCount, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Filter className="h-6 w-6 text-purple-600" />
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
                    placeholder="搜索报告名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "全部" ? "全部类型" : getTypeText(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "全部" ? "全部状态" : getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>报告名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>格式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建者</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>文件大小</TableHead>
                  <TableHead>下载次数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{report.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeText(report.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{report.format}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>{getStatusText(report.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{report.createdBy}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{report.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{report.fileSize}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{report.downloadCount}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {report.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                        )}
                        {report.status === "failed" && (
                          <Button size="sm" variant="outline">
                            重新生成
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          删除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关报告</h3>
            <p className="text-gray-500 mb-4">尝试调整搜索条件或筛选器</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedType("全部")
                setSelectedStatus("全部")
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
