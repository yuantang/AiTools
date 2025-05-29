"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Users, Eye, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for charts
const trafficData = [
  { date: "2024-01-01", visitors: 1200, pageViews: 3400, newUsers: 320 },
  { date: "2024-01-02", visitors: 1350, pageViews: 3800, newUsers: 280 },
  { date: "2024-01-03", visitors: 1100, pageViews: 3100, newUsers: 250 },
  { date: "2024-01-04", visitors: 1450, pageViews: 4200, newUsers: 380 },
  { date: "2024-01-05", visitors: 1600, pageViews: 4800, newUsers: 420 },
  { date: "2024-01-06", visitors: 1750, pageViews: 5200, newUsers: 450 },
  { date: "2024-01-07", visitors: 1900, pageViews: 5600, newUsers: 480 },
  { date: "2024-01-08", visitors: 1650, pageViews: 4900, newUsers: 390 },
  { date: "2024-01-09", visitors: 1800, pageViews: 5300, newUsers: 440 },
  { date: "2024-01-10", visitors: 2100, pageViews: 6200, newUsers: 520 },
  { date: "2024-01-11", visitors: 2250, pageViews: 6700, newUsers: 580 },
  { date: "2024-01-12", visitors: 2000, pageViews: 5900, newUsers: 490 },
  { date: "2024-01-13", visitors: 2300, pageViews: 6800, newUsers: 610 },
  { date: "2024-01-14", visitors: 2450, pageViews: 7200, newUsers: 650 },
]

const categoryData = [
  { name: "AI写作", value: 35, tools: 156, color: "#3B82F6" },
  { name: "图像生成", value: 25, tools: 89, color: "#8B5CF6" },
  { name: "AI编程", value: 20, tools: 124, color: "#10B981" },
  { name: "视频编辑", value: 10, tools: 45, color: "#F59E0B" },
  { name: "音频处理", value: 6, tools: 67, color: "#EF4444" },
  { name: "其他", value: 4, tools: 32, color: "#6B7280" },
]

const topToolsData = [
  { name: "ChatGPT", views: 125000, users: 45000, rating: 4.8, growth: 12 },
  { name: "Midjourney", views: 98000, users: 32000, rating: 4.9, growth: 18 },
  { name: "GitHub Copilot", views: 87000, users: 28000, rating: 4.7, growth: 8 },
  { name: "Claude", views: 76000, users: 25000, rating: 4.8, growth: 22 },
  { name: "Stable Diffusion", views: 65000, users: 22000, rating: 4.6, growth: 15 },
]

const userGrowthData = [
  { month: "2023-07", total: 1200, active: 800, premium: 120 },
  { month: "2023-08", total: 1450, active: 950, premium: 145 },
  { month: "2023-09", total: 1680, active: 1100, premium: 168 },
  { month: "2023-10", total: 1920, active: 1280, premium: 192 },
  { month: "2023-11", total: 2200, active: 1450, premium: 220 },
  { month: "2023-12", total: 2580, active: 1720, premium: 258 },
  { month: "2024-01", total: 3200, active: 2100, premium: 320 },
]

const deviceData = [
  { name: "桌面端", value: 45, color: "#3B82F6" },
  { name: "移动端", value: 40, color: "#10B981" },
  { name: "平板", value: 15, color: "#F59E0B" },
]

const geographicData = [
  { country: "中国", users: 12500, percentage: 45 },
  { country: "美国", users: 6800, percentage: 25 },
  { country: "日本", users: 2700, percentage: 10 },
  { country: "韩国", users: 1900, percentage: 7 },
  { country: "德国", users: 1350, percentage: 5 },
  { country: "其他", users: 2150, percentage: 8 },
]

const revenueData = [
  { month: "2023-07", subscription: 12000, ads: 3000, commission: 1500 },
  { month: "2023-08", subscription: 14500, ads: 3500, commission: 1800 },
  { month: "2023-09", subscription: 16800, ads: 4200, commission: 2100 },
  { month: "2023-10", subscription: 19200, ads: 4800, commission: 2400 },
  { month: "2023-11", subscription: 22000, ads: 5500, commission: 2750 },
  { month: "2023-12", subscription: 25800, ads: 6450, commission: 3225 },
  { month: "2024-01", subscription: 32000, ads: 8000, commission: 4000 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("visitors")

  const exportData = (type: string) => {
    // 模拟数据导出
    console.log(`Exporting ${type} data...`)
    // 在实际应用中，这里会调用API导出数据
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
              <Link href="/admin/analytics" className="text-blue-600 font-medium">
                数据分析
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
            <h1 className="text-3xl font-bold text-gray-900">数据分析</h1>
            <p className="text-gray-600">深入了解平台的运营数据和用户行为</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7天</SelectItem>
                <SelectItem value="30d">30天</SelectItem>
                <SelectItem value="90d">90天</SelectItem>
                <SelectItem value="1y">1年</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => exportData("all")}>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总访问量</p>
                  <p className="text-2xl font-bold text-gray-900">2.4M</p>
                  <p className="text-sm text-green-600">+12.5% 较上期</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃用户</p>
                  <p className="text-2xl font-bold text-gray-900">45.6K</p>
                  <p className="text-sm text-green-600">+8.2% 较上期</p>
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
                  <p className="text-sm font-medium text-gray-600">工具收录</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                  <p className="text-sm text-green-600">+15.3% 较上期</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">月收入</p>
                  <p className="text-2xl font-bold text-gray-900">¥44K</p>
                  <p className="text-sm text-green-600">+22.1% 较上期</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="traffic">流量分析</TabsTrigger>
            <TabsTrigger value="users">用户分析</TabsTrigger>
            <TabsTrigger value="tools">工具分析</TabsTrigger>
            <TabsTrigger value="revenue">收入分析</TabsTrigger>
            <TabsTrigger value="geographic">地域分析</TabsTrigger>
            <TabsTrigger value="realtime">实时监控</TabsTrigger>
          </TabsList>

          {/* Traffic Analysis */}
          <TabsContent value="traffic" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>流量趋势</CardTitle>
                  <CardDescription>网站访问量和用户行为趋势</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="visitors"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="pageViews"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>设备分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>页面性能</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>平均加载时间</span>
                      <span>1.2s</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>跳出率</span>
                      <span>32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>页面停留时间</span>
                      <span>3.5min</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>流量来源</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">直接访问</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">搜索引擎</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">社交媒体</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">其他</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Analysis */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>用户增长趋势</CardTitle>
                  <CardDescription>用户注册和活跃度变化</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="premium" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>用户行为分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">用户活跃度</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>日活跃用户</span>
                        <span>12,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>周活跃用户</span>
                        <span>35,600</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>月活跃用户</span>
                        <span>89,200</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">用户留存率</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>次日留存</span>
                        <span>68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>7日留存</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>30日留存</span>
                        <span>28%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>用户画像</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">年龄分布</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>18-25岁</span>
                        <span>25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>26-35岁</span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>36-45岁</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>46岁以上</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">职业分布</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>程序员</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>设计师</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>产品经理</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>其他</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">使用频率</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>每日使用</span>
                        <span>40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>每周使用</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>每月使用</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>偶尔使用</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Analysis */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>热门工具排行</CardTitle>
                  <CardDescription>按访问量排序的工具表现</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topToolsData.map((tool, index) => (
                      <div key={tool.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{tool.name}</h3>
                            <p className="text-sm text-gray-500">{tool.users.toLocaleString()} 用户</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{tool.views.toLocaleString()}</div>
                            <div className="text-gray-500">访问量</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{tool.rating}</div>
                            <div className="text-gray-500">评分</div>
                          </div>
                          <div className="text-green-600 font-semibold">+{tool.growth}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>分类分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>工具提交趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trafficData.slice(-7)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="newUsers" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>工具质量指标</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>平均评分</span>
                      <span>4.6/5.0</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>审核通过率</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>用户满意度</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Analysis */}
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>收入趋势</CardTitle>
                <CardDescription>各收入来源的变化趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="subscription"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area type="monotone" dataKey="ads" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area
                      type="monotone"
                      dataKey="commission"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>订阅收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">¥32,000</div>
                  <p className="text-sm text-green-600 mb-4">+24% 较上月</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>基础版</span>
                      <span>¥12,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>专业版</span>
                      <span>¥15,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>企业版</span>
                      <span>¥5,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>广告收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">¥8,000</div>
                  <p className="text-sm text-green-600 mb-4">+18% 较上月</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>横幅广告</span>
                      <span>¥4,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>推广位</span>
                      <span>¥2,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>赞助内容</span>
                      <span>¥1,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>佣金收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-2">¥4,000</div>
                  <p className="text-sm text-green-600 mb-4">+32% 较上月</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>工具推荐</span>
                      <span>¥2,800</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>会员转化</span>
                      <span>¥800</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>其他</span>
                      <span>¥400</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geographic Analysis */}
          <TabsContent value="geographic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>地域分布</CardTitle>
                  <CardDescription>用户地理位置分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {geographicData.map((item, index) => (
                      <div key={item.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                            {index + 1}
                          </div>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{item.percentage}%</span>
                          <span className="text-sm text-gray-500 w-16">{item.users.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>时区分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>UTC+8 (亚洲)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <span className="text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>UTC-5 (美东)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <span className="text-sm">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>UTC+1 (欧洲)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                        <span className="text-sm">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>其他时区</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: "5%" }}></div>
                        </div>
                        <span className="text-sm">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>城市排行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">国内城市</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>北京</span>
                        <span>3,200 (25%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>上海</span>
                        <span>2,800 (22%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>深圳</span>
                        <span>2,100 (17%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>杭州</span>
                        <span>1,500 (12%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>广州</span>
                        <span>1,200 (10%)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">国际城市</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>纽约</span>
                        <span>1,800 (35%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>旧金山</span>
                        <span>1,200 (23%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>伦敦</span>
                        <span>800 (15%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>东京</span>
                        <span>600 (12%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>其他</span>
                        <span>800 (15%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-time Monitoring */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">在线用户</p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">实时访问</p>
                      <p className="text-2xl font-bold text-gray-900">567</p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">服务器负载</p>
                      <p className="text-2xl font-bold text-gray-900">45%</p>
                    </div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">响应时间</p>
                      <p className="text-2xl font-bold text-gray-900">120ms</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>实时活动</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-500">刚刚</span>
                      <span>用户 张小明 查看了 ChatGPT</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-500">1分钟前</span>
                      <span>用户 李小红 提交了新工具</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-500">2分钟前</span>
                      <span>用户 王小华 注册了账号</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-500">3分钟前</span>
                      <span>用户 赵小丽 收藏了 Midjourney</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-500">5分钟前</span>
                      <span>系统检测到异常访问</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>系统状态</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU使用率</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>内存使用率</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>磁盘使用率</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>网络带宽</span>
                      <span>156 Mbps</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
