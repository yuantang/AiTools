"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { NotificationsAPI } from "@/lib/api/notifications"
import type { UserNotification, Notification } from "@/lib/supabase"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<(UserNotification & { notification: Notification })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 20
  })

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, activeTab, page])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const result = await NotificationsAPI.getUserNotifications(user.id, {
        page,
        limit: 20,
        unreadOnly: activeTab === 'unread'
      })
      
      setNotifications(result.data)
      setPagination({
        total: result.total,
        totalPages: result.totalPages,
        page: result.page,
        limit: result.limit
      })
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await NotificationsAPI.markAsRead(user.id, notificationId)
      setNotifications(prev => 
        prev.map(notif => 
          notif.notification_id === notificationId 
            ? { ...notif, read: true, read_at: new Date().toISOString() }
            : notif
        )
      )
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return

    try {
      await NotificationsAPI.markAllAsRead(user.id)
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          read: true, 
          read_at: new Date().toISOString() 
        }))
      )
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const handleDeleteNotification = async (notificationId: string) => {
    if (!user || !confirm("确定要删除这条通知吗？")) return

    try {
      await NotificationsAPI.deleteNotification(user.id, notificationId)
      setNotifications(prev => 
        prev.filter(notif => notif.notification_id !== notificationId)
      )
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tool_approved':
        return '✅'
      case 'tool_rejected':
        return '❌'
      case 'comment_reply':
        return '💬'
      case 'tool_featured':
        return '⭐'
      case 'system_announcement':
        return '📢'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'tool_approved':
        return 'bg-green-100 text-green-800'
      case 'tool_rejected':
        return 'bg-red-100 text-red-800'
      case 'comment_reply':
        return 'bg-blue-100 text-blue-800'
      case 'tool_featured':
        return 'bg-yellow-100 text-yellow-800'
      case 'system_announcement':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tool_approved':
        return '工具审核'
      case 'tool_rejected':
        return '工具审核'
      case 'comment_reply':
        return '评论回复'
      case 'tool_featured':
        return '工具推荐'
      case 'system_announcement':
        return '系统公告'
      default:
        return '通知'
    }
  }

  const filteredNotifications = notifications.filter(userNotification => {
    const notification = userNotification.notification
    const matchesSearch = searchQuery === "" || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === "all" || notification.type === filterType
    
    return matchesSearch && matchesType
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">需要登录</h2>
            <p className="text-gray-600 mb-4">请先登录查看您的通知</p>
            <Button asChild>
              <Link href="/login">登录</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <Link href="/notifications" className="text-blue-600 font-medium">
                通知
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 transition-colors">
                个人中心
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">通知中心</h1>
            <p className="text-gray-600">管理您的通知和消息</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              全部标记为已读
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索通知..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="tool_approved">工具审核通过</SelectItem>
                <SelectItem value="tool_rejected">工具审核未通过</SelectItem>
                <SelectItem value="comment_reply">评论回复</SelectItem>
                <SelectItem value="tool_featured">工具推荐</SelectItem>
                <SelectItem value="system_announcement">系统公告</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              全部通知 ({pagination.total})
            </TabsTrigger>
            <TabsTrigger value="unread">
              未读通知 ({unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <>
            <div className="space-y-4">
              {filteredNotifications.map((userNotification) => {
                const notification = userNotification.notification
                return (
                  <Card 
                    key={userNotification.id} 
                    className={`transition-all hover:shadow-md ${
                      !userNotification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {notification.title}
                              </h3>
                              <Badge variant="outline">
                                {getTypeLabel(notification.type)}
                              </Badge>
                              {!userNotification.read && (
                                <Badge variant="default" className="bg-blue-600">
                                  新
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {!userNotification.read && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  标记已读
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3">
                            {notification.content}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {new Date(userNotification.created_at).toLocaleString()}
                            </span>
                            {userNotification.read && userNotification.read_at && (
                              <span>
                                已读于 {new Date(userNotification.read_at).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    上一页
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    第 {page} 页，共 {pagination.totalPages} 页
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterType !== "all" ? "未找到匹配的通知" : "暂无通知"}
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterType !== "all" ? "尝试调整搜索条件或筛选器" : "当有新通知时，会在这里显示"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
