"use client"

import { useState } from "react"
import { Search, UserPlus, Edit, Trash2, Mail, Shield, Ban } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const users = [
  {
    id: 1,
    name: "张小明",
    email: "zhang@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "user",
    status: "active",
    verified: true,
    joinedAt: "2024-01-15",
    lastLoginAt: "2024-01-20",
    toolsSubmitted: 3,
    toolsApproved: 2,
    favoriteCount: 15,
    location: "北京",
  },
  {
    id: 2,
    name: "李小红",
    email: "li@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "moderator",
    status: "active",
    verified: true,
    joinedAt: "2024-01-14",
    lastLoginAt: "2024-01-20",
    toolsSubmitted: 1,
    toolsApproved: 1,
    favoriteCount: 8,
    location: "上海",
  },
  {
    id: 3,
    name: "王小华",
    email: "wang@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "user",
    status: "inactive",
    verified: false,
    joinedAt: "2024-01-13",
    lastLoginAt: "2024-01-18",
    toolsSubmitted: 0,
    toolsApproved: 0,
    favoriteCount: 3,
    location: "广州",
  },
  {
    id: 4,
    name: "赵小丽",
    email: "zhao@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "admin",
    status: "active",
    verified: true,
    joinedAt: "2023-12-01",
    lastLoginAt: "2024-01-20",
    toolsSubmitted: 5,
    toolsApproved: 5,
    favoriteCount: 25,
    location: "深圳",
  },
  {
    id: 5,
    name: "陈小军",
    email: "chen@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    role: "user",
    status: "banned",
    verified: false,
    joinedAt: "2024-01-10",
    lastLoginAt: "2024-01-16",
    toolsSubmitted: 2,
    toolsApproved: 0,
    favoriteCount: 1,
    location: "杭州",
  },
]

const roles = ["全部", "user", "moderator", "admin"]
const statuses = ["全部", "active", "inactive", "banned"]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("全部")
  const [selectedStatus, setSelectedStatus] = useState("全部")
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === "全部" || user.role === selectedRole
    const matchesStatus = selectedStatus === "全部" || user.status === selectedStatus
    const matchesVerified = !showVerifiedOnly || user.verified

    return matchesSearch && matchesRole && matchesStatus && matchesVerified
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "moderator":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "管理员"
      case "moderator":
        return "版主"
      case "user":
        return "用户"
      default:
        return "未知"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-yellow-100 text-yellow-800"
      case "banned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "活跃"
      case "inactive":
        return "非活跃"
      case "banned":
        return "已封禁"
      default:
        return "未知"
    }
  }

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
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
              <Link href="/admin/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具管理
              </Link>
              <Link href="/admin/users" className="text-blue-600 font-medium">
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
            <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
            <p className="text-gray-600">管理平台上的所有用户</p>
          </div>
          <Button asChild>
            <Link href="/admin/users/new">
              <UserPlus className="h-4 w-4 mr-2" />
              添加用户
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总用户数</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃用户</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已认证</p>
                  <p className="text-2xl font-bold text-gray-900">{users.filter((u) => u.verified).length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已封禁</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter((u) => u.status === "banned").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Ban className="h-6 w-6 text-red-600" />
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
                    placeholder="搜索用户名或邮箱..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role === "全部" ? "全部角色" : getRoleText(role)}
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
              <div className="flex items-center space-x-2">
                <Checkbox id="verified" checked={showVerifiedOnly} onCheckedChange={setShowVerifiedOnly} />
                <label htmlFor="verified" className="text-sm">
                  仅已认证
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已选择 {selectedUsers.length} 个用户</span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    批量激活
                  </Button>
                  <Button size="sm" variant="outline">
                    批量禁用
                  </Button>
                  <Button size="sm" variant="destructive">
                    批量删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>活动数据</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>最后登录</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{user.name}</p>
                            {user.verified && <Badge className="bg-green-100 text-green-800 text-xs">已认证</Badge>}
                          </div>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>提交: {user.toolsSubmitted}</div>
                        <div>通过: {user.toolsApproved}</div>
                        <div>收藏: {user.favoriteCount}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">{user.joinedAt}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-500">{user.lastLoginAt}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${user.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/users/${user.id}/edit`}>
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关用户</h3>
            <p className="text-gray-500 mb-4">尝试调整搜索条件或筛选器</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedRole("全部")
                setSelectedStatus("全部")
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
