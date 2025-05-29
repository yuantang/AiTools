"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Plus, X, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import { useCategories } from "@/hooks/useCategories"
import { ToolsAPI } from "@/lib/api/tools"

const pricingOptions = [
  { value: "free", label: "免费" },
  { value: "freemium", label: "免费试用" },
  { value: "paid", label: "付费" },
  { value: "subscription", label: "订阅制" },
  { value: "one-time", label: "一次性付费" },
]

const platformOptions = [
  { value: "web", label: "Web" },
  { value: "ios", label: "iOS" },
  { value: "android", label: "Android" },
  { value: "windows", label: "Windows" },
  { value: "mac", label: "Mac" },
  { value: "linux", label: "Linux" },
  { value: "api", label: "API" },
]

export default function SubmitToolPage() {
  const { user, userProfile } = useAuth()
  const { categories } = useCategories()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    logo_url: "",
    category_id: "",
    pricing_type: "",
    tags: [] as string[],
    platforms: [] as string[],
    features: [] as string[],
    api_available: false,
    open_source: false,
  })

  const [newTag, setNewTag] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }))
  }

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "请输入工具名称"
    if (!formData.description.trim()) return "请输入工具描述"
    if (!formData.url.trim()) return "请输入工具网址"
    if (!formData.category_id) return "请选择工具分类"
    if (!formData.pricing_type) return "请选择价格类型"
    if (formData.platforms.length === 0) return "请至少选择一个支持平台"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setSubmitError("请先登录后再提交工具")
      return
    }

    const error = validateForm()
    if (error) {
      setSubmitError(error)
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      await ToolsAPI.createTool(formData, user.id)
      setSubmitSuccess(true)
      // 重置表单
      setFormData({
        name: "",
        description: "",
        url: "",
        logo_url: "",
        category_id: "",
        pricing_type: "",
        tags: [],
        platforms: [],
        features: [],
        api_available: false,
        open_source: false,
      })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "提交失败，请重试")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>需要登录</CardTitle>
            <CardDescription>请先登录后再提交AI工具</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/register">注册新账号</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>提交成功！</CardTitle>
            <CardDescription>您的工具已提交，我们会在24小时内完成审核</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => setSubmitSuccess(false)}>
              继续提交
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/profile">查看我的提交</Link>
            </Button>
          </CardContent>
        </Card>
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
              <Link href="/submit" className="text-blue-600 font-medium">
                提交工具
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/profile">个人中心</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">提交AI工具</h1>
            <p className="text-gray-600">分享您发现的优秀AI工具，帮助更多人发现和使用</p>
          </div>

          {/* Submission Guidelines */}
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>提交须知：</strong>
              请确保提交的工具是真实可用的AI工具，我们会在24小时内完成审核。重复提交或虚假信息可能导致账号被限制。
            </AlertDescription>
          </Alert>

          {/* Submit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>工具信息</span>
              </CardTitle>
              <CardDescription>请填写完整的工具信息，以便用户更好地了解和使用</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">工具名称 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="例如：ChatGPT"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">工具网址 *</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleInputChange("url", e.target.value)}
                      placeholder="https://..."
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
                    placeholder="详细描述工具的功能和特点..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="logo_url">Logo网址（可选）</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => handleInputChange("logo_url", e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {/* Category and Pricing */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">工具分类 *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => handleInputChange("category_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pricing">价格类型 *</Label>
                    <Select
                      value={formData.pricing_type}
                      onValueChange={(value) => handleInputChange("pricing_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择价格类型" />
                      </SelectTrigger>
                      <SelectContent>
                        {pricingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Platforms */}
                <div>
                  <Label>支持平台 *</Label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                    {platformOptions.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.value}
                          checked={formData.platforms.includes(platform.value)}
                          onCheckedChange={() => togglePlatform(platform.value)}
                        />
                        <Label htmlFor={platform.value} className="text-sm">
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>标签</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="添加标签..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label>主要功能</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="添加功能特点..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addFeature()
                        }
                      }}
                    />
                    <Button type="button" onClick={addFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.features.map((feature) => (
                      <div key={feature} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{feature}</span>
                        <button type="button" onClick={() => removeFeature(feature)}>
                          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="api_available"
                      checked={formData.api_available}
                      onCheckedChange={(checked) => handleInputChange("api_available", checked)}
                    />
                    <Label htmlFor="api_available">提供API接口</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="open_source"
                      checked={formData.open_source}
                      onCheckedChange={(checked) => handleInputChange("open_source", checked)}
                    />
                    <Label htmlFor="open_source">开源项目</Label>
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "提交中..." : "提交工具"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/tools">取消</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
