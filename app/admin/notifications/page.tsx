"use client"

import { useState } from "react"
import { Bell, Send, Users, Mail, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

const notificationHistory = [
  {
    id: 1,
    title: "系统维护通知",
    content: "系统将于今晚22:00-24:00进行维护升级，期间可能影响正常使用。",
    type: "system",
    recipients: "all_users",
    sentAt: "2024-01-15 14:30",
    status: "sent",
    readCount: 1250,
    totalCount: 1500,
  },
  {
    id: 2,
    title: "新功能上线",
    content: "AI工具评分功能正式上线，快来为你喜欢的工具打分吧！",
    type: "feature",
    recipients: "active_users",
    sentAt: "2024-01-14 10:00",
    status: "sent",
    readCount: 890,
    totalCount: 1200,
  },
  {
    id: 3,
    title: "工具审核通过",
    content: "您提交的工具已通过审核，现已在平台上展示。",
    type: "approval",
    recipients: "submitters",
    sentAt: "2024-01-13 16:45",
    status: "sent",
    readCount: 45,
    totalCount: 50,
  },
]

export default function NotificationsPage() {
  const [notificationData, setNotificationData] = useState({
    title: "",
    content: "",
    type: "system",
    recipients: "all_users",
    sendImmediately: true,
    scheduledTime: "",
  })

  const [isSending, setIsSending] = useState(false)

  const handleSendNotification = async () => {
    setIsSending(true)
    // 模拟发送过程
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSending(false)
    // 重置表单
    setNotificationData({
      title: "",
      content: "",
      type: "system",
      recipients: "all_users",
      sendImmediately: true,
      scheduledTime: "",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system":
        return "bg-blue-100 text-blue-800"
      case "feature":
        return "bg-green-100 text-green-800"
      case "approval":
        return "bg-purple-100 text-purple-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "system":
        return "系统通知"
      case "feature":
        return "功能更新"
      case "approval":
        return "审核通知"
      case "warning":
        return "警告通知"
      default:
        return "其他"
    }
  }

  const getRecipientsText = (recipients: string) => {
    switch (recipients) {
      case "all_users":
        return "全部用户"
      case "active_users":
        return "活跃用户"
      case "submitters":
        return "工具提交者"
      case "premium_users":
        return "付费用户"
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
              <Link href="/admin/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具管理
              </Link>
              <Link href="/admin/notifications" className="text-blue-600 font-medium">
                通知管理
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
            <h1 className="text-3xl font-bold text-gray-900">通知管理</h1>
            <p className="text-gray-600">发送和管理系统通知</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">今日发送</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总用户数</p>
                  <p className="text-2xl font-bold text-gray-900">1,500</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均打开率</p>
                  <p className="text-2xl font-bold text-gray-900">78%</p>
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
                  <p className="text-sm font-medium text-gray-600">待发送</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList>
            <TabsTrigger value="send">发送通知</TabsTrigger>
            <TabsTrigger value="history">通知历史</TabsTrigger>
            <TabsTrigger value="templates">通知模板</TabsTrigger>
            <TabsTrigger value="settings">通知设置</TabsTrigger>
          </TabsList>

          {/* 发送通知 */}
          <TabsContent value="send" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>发送新通知</span>
                </CardTitle>
                <CardDescription>创建并发送通知给用户</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">通知标题</Label>
                    <Input
                      id="title"
                      value={notificationData.title}
                      onChange={(e) => setNotificationData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="输入通知标题..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">通知类型</Label>
                    <Select
                      value={notificationData.type}
                      onValueChange={(value) => setNotificationData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">系统通知</SelectItem>
                        <SelectItem value="feature">功能更新</SelectItem>
                        <SelectItem value="approval">审核通知</SelectItem>
                        <SelectItem value="warning">警告通知</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="content">通知内容</Label>
                  <Textarea
                    id="content"
                    value={notificationData.content}
                    onChange={(e) => setNotificationData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="输入通知内容..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="recipients">接收对象</Label>
                  <Select
                    value={notificationData.recipients}
                    onValueChange={(value) => setNotificationData((prev) => ({ ...prev, recipients: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_users">全部用户</SelectItem>
                      <SelectItem value="active_users">活跃用户</SelectItem>
                      <SelectItem value="submitters">工具提交者</SelectItem>
                      <SelectItem value="premium_users">付费用户</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendImmediately"
                    checked={notificationData.sendImmediately}
                    onCheckedChange={(checked) =>
                      setNotificationData((prev) => ({ ...prev, sendImmediately: checked as boolean }))
                    }
                  />
                  <Label htmlFor="sendImmediately">立即发送</Label>
                </div>

                {!notificationData.sendImmediately && (
                  <div>
                    <Label htmlFor="scheduledTime">定时发送</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      value={notificationData.scheduledTime}
                      onChange={(e) => setNotificationData((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <Button variant="outline">保存草稿</Button>
                  <Button onClick={handleSendNotification} disabled={isSending}>
                    {isSending ? "发送中..." : "发送通知"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知历史 */}
          <TabsContent value="history" className="space-y-6">
            <div className="space-y-4">
              {notificationHistory.map((notification) => (
                <Card key={notification.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{notification.title}</h3>
                          <Badge className={getTypeColor(notification.type)}>{getTypeText(notification.type)}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{notification.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>发送时间：{notification.sentAt}</span>
                          <span>接收对象：{getRecipientsText(notification.recipients)}</span>
                          <span>阅读率：{Math.round((notification.readCount / notification.totalCount) * 100)}%</span>
                          <span>
                            ({notification.readCount}/{notification.totalCount})
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        <Button variant="outline" size="sm">
                          重新发送
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 通知模板 */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>通知模板</CardTitle>
                <CardDescription>管理常用的通知模板</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">系统维护通知</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        系统将于{"{时间}"}进行维护升级，期间可能影响正常使用。
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">审核通过通知</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        您提交的工具"{"{工具名称}"}"已通过审核，现已在平台上展示。
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">新功能发布</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{"{功能名称}"}功能正式上线，快来体验吧！</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">欢迎新用户</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">欢迎加入AI工具导航！开始探索最好的AI工具吧。</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant="outline">
                          使用
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    创建新模板
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>通知设置</span>
                </CardTitle>
                <CardDescription>配置通知相关的设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮件通知</Label>
                    <p className="text-sm text-gray-500">通过邮件发送通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>浏览器推送</Label>
                    <p className="text-sm text-gray-500">通过浏览器推送通知</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>短信通知</Label>
                    <p className="text-sm text-gray-500">通过短信发送重要通知</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label>通知频率限制</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高频率（无限制）</SelectItem>
                      <SelectItem value="normal">正常（每天最多5条）</SelectItem>
                      <SelectItem value="low">低频率（每天最多2条）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>默认发送时间</Label>
                  <Input type="time" defaultValue="10:00" className="mt-2" />
                </div>

                <div className="flex justify-end">
                  <Button>保存设置</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
