"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useCategories } from "@/hooks/useCategories"
import { Header } from "@/components/layout/Header"

interface Tool {
  id: string
  name: string
  description: string
  url: string
  logo?: string
  category_id: string
  status: 'active' | 'pending' | 'rejected' | 'inactive'
  featured: boolean
  verified: boolean
  pricing?: string
  tags?: string[]
}

export default function EditToolPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { categories } = useCategories()
  
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    logo: "",
    category_id: "",
    status: "active" as const,
    featured: false,
    verified: false,
    pricing: "",
    tags: ""
  })

  // 获取工具详情
  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/tools/${params.id}`)
        
        if (!response.ok) {
          throw new Error('获取工具信息失败')
        }
        
        const result = await response.json()
        const toolData = result.tool
        
        setTool(toolData)
        setFormData({
          name: toolData.name || "",
          description: toolData.description || "",
          url: toolData.url || "",
          logo: toolData.logo || "",
          category_id: toolData.category_id || "",
          status: toolData.status || "active",
          featured: toolData.featured || false,
          verified: toolData.verified || false,
          pricing: toolData.pricing || "",
          tags: Array.isArray(toolData.tags) ? toolData.tags.join(", ") : ""
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取工具信息失败')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTool()
    }
  }, [params.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean) : []
      }

      const response = await fetch(`/api/admin/tools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新工具失败')
      }

      toast({
        title: "成功",
        description: "工具更新成功",
      })

      router.push('/admin/tools')
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新工具失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error && !tool) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="admin" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-2">加载失败</div>
            <div className="text-gray-500 text-sm mb-4">{error}</div>
            <Button asChild>
              <Link href="/admin/tools">返回工具列表</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/tools">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回列表
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">编辑工具</h1>
              <p className="text-gray-600">修改工具信息和设置</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">工具名称 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="输入工具名称"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="url">工具链接 *</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">工具描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="详细描述工具的功能和特点"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    type="url"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="category">分类 *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pricing">定价信息</Label>
                  <Input
                    id="pricing"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange("pricing", e.target.value)}
                    placeholder="免费 / $9.99/月 / 等"
                  />
                </div>
                <div>
                  <Label htmlFor="tags">标签</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="用逗号分隔，如：AI, 设计, 效率"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>状态设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">发布状态</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">已发布</SelectItem>
                    <SelectItem value="pending">待审核</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="inactive">已下线</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">精选工具</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={formData.verified}
                    onCheckedChange={(checked) => handleInputChange("verified", checked)}
                  />
                  <Label htmlFor="verified">官方认证</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/tools">取消</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  保存更改
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
