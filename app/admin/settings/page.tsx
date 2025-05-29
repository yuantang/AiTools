"use client"

import { useState } from "react"
import { Save, Upload, Shield, Bell, Database, Globe } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // 基本设置
    siteName: "AI工具导航",
    siteDescription: "发现和分享最好的AI工具",
    siteUrl: "https://aitools.com",
    adminEmail: "admin@aitools.com",
    supportEmail: "support@aitools.com",

    // 功能设置
    enableUserRegistration: true,
    enableToolSubmission: true,
    enableComments: true,
    enableRatings: true,
    enableFavorites: true,
    requireEmailVerification: true,

    // 审核设置
    autoApproveTools: false,
    moderationLevel: "strict",
    spamFilterEnabled: true,

    // 通知设置
    emailNotifications: true,
    pushNotifications: false,
    slackWebhook: "",

    // SEO设置
    metaTitle: "AI工具导航 - 发现最好的AI工具",
    metaDescription: "收录全球最新最热门的AI产品，帮助您快速找到适合的AI工具",
    metaKeywords: "AI工具,人工智能,机器学习,深度学习",

    // 安全设置
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,

    // 备份设置
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // 模拟保存过程
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // 显示成功消息
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
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
              <Link href="/admin/settings" className="text-blue-600 font-medium">
                系统设置
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
            <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
            <p className="text-gray-600">配置网站的各项功能和参数</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "保存中..." : "保存设置"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">基本设置</TabsTrigger>
            <TabsTrigger value="features">功能设置</TabsTrigger>
            <TabsTrigger value="moderation">审核设置</TabsTrigger>
            <TabsTrigger value="notifications">通知设置</TabsTrigger>
            <TabsTrigger value="seo">SEO设置</TabsTrigger>
            <TabsTrigger value="security">安全设置</TabsTrigger>
            <TabsTrigger value="backup">备份设置</TabsTrigger>
          </TabsList>

          {/* 基本设置 */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>网站信息</span>
                </CardTitle>
                <CardDescription>配置网站的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">网站名称</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => updateSetting("siteName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">网站地址</Label>
                    <Input
                      id="siteUrl"
                      value={settings.siteUrl}
                      onChange={(e) => updateSetting("siteUrl", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">网站描述</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">管理员邮箱</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => updateSetting("adminEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">客服邮箱</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => updateSetting("supportEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>网站Logo</CardTitle>
                <CardDescription>上传网站Logo和图标</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>主Logo</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">点击上传或拖拽文件</p>
                      <p className="text-xs text-gray-400">推荐尺寸: 200x60px</p>
                    </div>
                  </div>
                  <div>
                    <Label>网站图标</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">点击上传或拖拽文件</p>
                      <p className="text-xs text-gray-400">推荐尺寸: 32x32px</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 功能设置 */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>用户功能</CardTitle>
                <CardDescription>控制用户相关功能的开启和关闭</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>用户注册</Label>
                    <p className="text-sm text-gray-500">允许新用户注册账号</p>
                  </div>
                  <Switch
                    checked={settings.enableUserRegistration}
                    onCheckedChange={(checked) => updateSetting("enableUserRegistration", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮箱验证</Label>
                    <p className="text-sm text-gray-500">新用户注册需要验证邮箱</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting("requireEmailVerification", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>工具提交</Label>
                    <p className="text-sm text-gray-500">允许用户提交新工具</p>
                  </div>
                  <Switch
                    checked={settings.enableToolSubmission}
                    onCheckedChange={(checked) => updateSetting("enableToolSubmission", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>评论功能</Label>
                    <p className="text-sm text-gray-500">允许用户发表评论</p>
                  </div>
                  <Switch
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => updateSetting("enableComments", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>评分功能</Label>
                    <p className="text-sm text-gray-500">允许用户对工具评分</p>
                  </div>
                  <Switch
                    checked={settings.enableRatings}
                    onCheckedChange={(checked) => updateSetting("enableRatings", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>收藏功能</Label>
                    <p className="text-sm text-gray-500">允许用户收藏工具</p>
                  </div>
                  <Switch
                    checked={settings.enableFavorites}
                    onCheckedChange={(checked) => updateSetting("enableFavorites", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 审核设置 */}
          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>内容审核</span>
                </CardTitle>
                <CardDescription>配置内容审核和过滤规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自动审核通过</Label>
                    <p className="text-sm text-gray-500">新提交的工具自动通过审核</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveTools}
                    onCheckedChange={(checked) => updateSetting("autoApproveTools", checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label>审核严格程度</Label>
                  <Select
                    value={settings.moderationLevel}
                    onValueChange={(value) => updateSetting("moderationLevel", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loose">宽松</SelectItem>
                      <SelectItem value="normal">普通</SelectItem>
                      <SelectItem value="strict">严格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>垃圾内容过滤</Label>
                    <p className="text-sm text-gray-500">自动检测和过滤垃圾内容</p>
                  </div>
                  <Switch
                    checked={settings.spamFilterEnabled}
                    onCheckedChange={(checked) => updateSetting("spamFilterEnabled", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>敏感词过滤</CardTitle>
                <CardDescription>配置敏感词库和过滤规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>敏感词列表</Label>
                  <Textarea placeholder="每行一个敏感词..." rows={6} className="mt-2" />
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">导入词库</Button>
                  <Button variant="outline">导出词库</Button>
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
                  <span>通知配置</span>
                </CardTitle>
                <CardDescription>配置各种通知方式和规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮件通知</Label>
                    <p className="text-sm text-gray-500">发送邮件通知</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>推送通知</Label>
                    <p className="text-sm text-gray-500">浏览器推送通知</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label>Slack Webhook</Label>
                  <Input
                    placeholder="https://hooks.slack.com/..."
                    value={settings.slackWebhook}
                    onChange={(e) => updateSetting("slackWebhook", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>邮件模板</CardTitle>
                <CardDescription>自定义各种邮件通知的模板</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>欢迎邮件模板</Label>
                  <Textarea placeholder="欢迎加入AI工具导航..." rows={4} className="mt-2" />
                </div>
                <div>
                  <Label>审核通过通知</Label>
                  <Textarea placeholder="您提交的工具已通过审核..." rows={4} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO设置 */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO优化</CardTitle>
                <CardDescription>配置搜索引擎优化相关设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">页面标题</Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={(e) => updateSetting("metaTitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">页面描述</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.metaDescription}
                    onChange={(e) => updateSetting("metaDescription", e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="metaKeywords">关键词</Label>
                  <Input
                    id="metaKeywords"
                    value={settings.metaKeywords}
                    onChange={(e) => updateSetting("metaKeywords", e.target.value)}
                    placeholder="用逗号分隔关键词"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>站点地图</CardTitle>
                <CardDescription>搜索引擎爬虫配置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自动生成站点地图</Label>
                    <p className="text-sm text-gray-500">自动更新sitemap.xml</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline">生成站点地图</Button>
                  <Button variant="outline">提交到搜索引擎</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 安全设置 */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>安全配置</span>
                </CardTitle>
                <CardDescription>配置系统安全相关设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>双因素认证</Label>
                    <p className="text-sm text-gray-500">管理员账号启用2FA</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => updateSetting("enableTwoFactor", checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label>会话超时时间（小时）</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <Separator />
                <div>
                  <Label>最大登录尝试次数</Label>
                  <Input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => updateSetting("maxLoginAttempts", Number.parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API安全</CardTitle>
                <CardDescription>API访问控制和限制</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>API密钥</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input value="sk-1234567890abcdef" readOnly />
                    <Button variant="outline">重新生成</Button>
                  </div>
                </div>
                <div>
                  <Label>请求频率限制（每分钟）</Label>
                  <Input type="number" defaultValue="100" className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 备份设置 */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>数据备份</span>
                </CardTitle>
                <CardDescription>配置自动备份和恢复设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自动备份</Label>
                    <p className="text-sm text-gray-500">定期自动备份数据</p>
                  </div>
                  <Switch
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                  />
                </div>
                <Separator />
                <div>
                  <Label>备份频率</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => updateSetting("backupFrequency", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">每小时</SelectItem>
                      <SelectItem value="daily">每天</SelectItem>
                      <SelectItem value="weekly">每周</SelectItem>
                      <SelectItem value="monthly">每月</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div>
                  <Label>备份保留天数</Label>
                  <Input
                    type="number"
                    value={settings.backupRetention}
                    onChange={(e) => updateSetting("backupRetention", Number.parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>手动备份</CardTitle>
                <CardDescription>立即创建备份或恢复数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button>立即备份</Button>
                  <Button variant="outline">下载备份</Button>
                  <Button variant="outline">恢复数据</Button>
                </div>
                <div>
                  <Label>最近备份记录</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">2024-01-15 10:30:00</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          下载
                        </Button>
                        <Button size="sm" variant="outline">
                          恢复
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm">2024-01-14 10:30:00</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          下载
                        </Button>
                        <Button size="sm" variant="outline">
                          恢复
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
