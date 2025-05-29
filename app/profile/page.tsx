"use client"

import { useState, useEffect } from "react"
import { Heart, Upload, Star, Settings, Bell, Shield } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/hooks/useAuth"
import { ToolsAPI } from "@/lib/api/tools"
import { supabase } from "@/lib/supabase"
import type { Tool } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, userProfile, updateProfile } = useAuth()
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([])
  const [submittedTools, setSubmittedTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || "",
    bio: userProfile?.bio || "",
    website: userProfile?.website || "",
    location: userProfile?.location || "",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    marketing: false,
  })

  useEffect(() => {
    if (!user) return

    const fetchUserData = async () => {
      try {
        setLoading(true)

        // 获取用户收藏的工具
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select(`
            tool:tools (
              id,
              name,
              description,
              logo_url,
              rating,
              total_ratings,
              view_count,
              created_at,
              category:categories (
                name,
                slug
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // 获取用户提交的工具
        const { data: submitted } = await supabase
          .from('tools')
          .select(`
            id,
            name,
            description,
            logo_url,
            rating,
            total_ratings,
            view_count,
            status,
            created_at,
            category:categories (
              name,
              slug
            )
          `)
          .eq('submitted_by', user.id)
          .order('created_at', { ascending: false });

        setFavoriteTools(favorites?.map(f => f.tool).filter(Boolean) || [])
        setSubmittedTools(submitted || [])
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleProfileUpdate = async () => {
    setIsUpdating(true)
    try {
      await updateProfile(profileData)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <Button asChild>
            <Link href="/login">登录</Link>
          </Button>
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
              <Button variant="outline" asChild>
                <Link href="/tools">浏览工具</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{userProfile?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{userProfile?.name}</h1>
                  {userProfile?.role === "admin" && (
                    <Badge className="bg-red-100 text-red-800">
                      <Shield className="w-3 h-3 mr-1" />
                      管理员
                    </Badge>
                  )}
                  {userProfile?.verified && <Badge className="bg-green-100 text-green-800">已验证</Badge>}
                </div>
                <p className="text-gray-600 mb-4">{userProfile?.bio || "这个用户还没有添加个人简介"}</p>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userProfile?.tools_submitted || 0}</div>
                    <div className="text-sm text-gray-500">提交工具</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProfile?.tools_approved || 0}</div>
                    <div className="text-sm text-gray-500">通过审核</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{userProfile?.favorite_count || 0}</div>
                    <div className="text-sm text-gray-500">收藏工具</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userProfile?.reputation_score || 0}</div>
                    <div className="text-sm text-gray-500">声誉积分</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            <TabsTrigger value="submissions">我的提交</TabsTrigger>
            <TabsTrigger value="settings">个人设置</TabsTrigger>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
          </TabsList>

          {/* 我的收藏 */}
          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>我的收藏</span>
                </CardTitle>
                <CardDescription>您收藏的AI工具</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : favoriteTools.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteTools.map((tool) => (
                      <Card key={tool.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <img
                              src={tool.logo_url || "/placeholder.svg?height=40&width=40"}
                              alt={tool.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{tool.name}</h3>
                              <p className="text-sm text-gray-500">{tool.category?.name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{tool.rating}</span>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/tools/${tool.id}`}>查看</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏任何工具</h3>
                    <p className="text-gray-500 mb-4">去发现一些有趣的AI工具吧</p>
                    <Button asChild>
                      <Link href="/tools">浏览工具</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 我的提交 */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>我的提交</span>
                </CardTitle>
                <CardDescription>您提交的AI工具</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : submittedTools.length > 0 ? (
                  <div className="space-y-4">
                    {submittedTools.map((tool) => (
                      <Card key={tool.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <img
                              src={tool.logo_url || "/placeholder.svg?height=48&width=48"}
                              alt={tool.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-900">{tool.name}</h3>
                                <Badge
                                  className={
                                    tool.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : tool.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {tool.status === "active"
                                    ? "已发布"
                                    : tool.status === "pending"
                                      ? "审核中"
                                      : "已拒绝"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>提交时间：{new Date(tool.created_at).toLocaleDateString()}</span>
                                {tool.status === "active" && (
                                  <>
                                    <span>浏览：{tool.view_count}</span>
                                    <span>评分：{tool.rating}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {tool.status === "active" && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/tools/${tool.id}`}>查看</Link>
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                编辑
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">还没有提交任何工具</h3>
                    <p className="text-gray-500 mb-4">分享您发现的优秀AI工具</p>
                    <Button asChild>
                      <Link href="/submit">提交工具</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 个人设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>个人设置</span>
                </CardTitle>
                <CardDescription>管理您的个人信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">邮箱</Label>
                    <Input id="email" value={user.email} disabled />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="介绍一下自己..."
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">个人网站</Label>
                    <Input
                      id="website"
                      value={profileData.website}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">所在地</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="城市, 国家"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate} disabled={isUpdating}>
                    {isUpdating ? "保存中..." : "保存更改"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 通知设置 */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>通知设置</span>
                </CardTitle>
                <CardDescription>管理您的通知偏好</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮件通知</Label>
                    <p className="text-sm text-gray-500">接收重要更新和审核结果</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, email: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>浏览器通知</Label>
                    <p className="text-sm text-gray-500">接收实时推送通知</p>
                  </div>
                  <Switch
                    checked={notifications.browser}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, browser: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>营销邮件</Label>
                    <p className="text-sm text-gray-500">接收产品更新和推广信息</p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, marketing: checked }))}
                  />
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
