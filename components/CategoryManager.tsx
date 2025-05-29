"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: number
  name: string
  slug: string
  description: string
  icon: string
  color: string
  toolCount: number
  popularityScore: number
  trending: boolean
  avgRating: number
  totalUsers: string
  tags: string[]
  featuredTools: string[]
  parentId?: number
  isActive: boolean
}

const mockCategories: Category[] = [
  {
    id: 1,
    name: "AI写作",
    slug: "ai-writing",
    description: "文本生成、内容创作、写作助手等AI工具",
    icon: "✍️",
    color: "bg-blue-500",
    toolCount: 156,
    popularityScore: 95,
    trending: true,
    avgRating: 4.6,
    totalUsers: "50M+",
    tags: ["文本生成", "内容创作", "写作助手", "SEO优化"],
    featuredTools: ["ChatGPT", "Claude", "Jasper"],
    isActive: true,
  },
  {
    id: 2,
    name: "图像生成",
    slug: "image-generation",
    description: "AI绘画、图像创作、照片编辑等视觉AI工具",
    icon: "🎨",
    color: "bg-purple-500",
    toolCount: 89,
    popularityScore: 92,
    trending: true,
    avgRating: 4.7,
    totalUsers: "30M+",
    tags: ["AI绘画", "图像生成", "艺术创作", "照片编辑"],
    featuredTools: ["Midjourney", "DALL-E", "Stable Diffusion"],
    isActive: true,
  },
]

const colorOptions = [
  { name: "蓝色", value: "bg-blue-500" },
  { name: "紫色", value: "bg-purple-500" },
  { name: "绿色", value: "bg-green-500" },
  { name: "红色", value: "bg-red-500" },
  { name: "橙色", value: "bg-orange-500" },
  { name: "靛蓝", value: "bg-indigo-500" },
  { name: "青色", value: "bg-cyan-500" },
  { name: "茶色", value: "bg-teal-500" },
  { name: "琥珀", value: "bg-amber-500" },
  { name: "玫红", value: "bg-rose-500" },
  { name: "翠绿", value: "bg-emerald-500" },
  { name: "紫罗兰", value: "bg-violet-500" },
]

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<Partial<Category>>({})

  const handleCreate = () => {
    setIsCreating(true)
    setEditingCategory(null)
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "bg-blue-500",
      tags: [],
      featuredTools: [],
      trending: false,
      isActive: true,
    })
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsCreating(false)
    setFormData({ ...category })
  }

  const handleSave = () => {
    if (isCreating) {
      const newCategory: Category = {
        ...formData,
        id: Math.max(...categories.map((c) => c.id)) + 1,
        toolCount: 0,
        popularityScore: 0,
        avgRating: 0,
        totalUsers: "0",
      } as Category

      setCategories([...categories, newCategory])
    } else if (editingCategory) {
      setCategories(categories.map((c) => (c.id === editingCategory.id ? { ...c, ...formData } : c)))
    }

    setEditingCategory(null)
    setIsCreating(false)
    setFormData({})
  }

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个分类吗？")) {
      setCategories(categories.filter((c) => c.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingCategory(null)
    setIsCreating(false)
    setFormData({})
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag],
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    })
  }

  const addFeaturedTool = (tool: string) => {
    if (tool && !formData.featuredTools?.includes(tool)) {
      setFormData({
        ...formData,
        featuredTools: [...(formData.featuredTools || []), tool],
      })
    }
  }

  const removeFeaturedTool = (toolToRemove: string) => {
    setFormData({
      ...formData,
      featuredTools: formData.featuredTools?.filter((tool) => tool !== toolToRemove) || [],
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">分类管理</h2>
          <p className="text-gray-600">管理AI工具的分类和标签</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          添加分类
        </Button>
      </div>

      {/* Category List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge variant="secondary">/{category.slug}</Badge>
                      {category.trending && <Badge className="bg-red-100 text-red-800">热门</Badge>}
                      {!category.isActive && (
                        <Badge variant="outline" className="text-gray-500">
                          已禁用
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{category.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">{category.toolCount}</span>
                        <span className="text-gray-500 ml-1">个工具</span>
                      </div>
                      <div>
                        <span className="font-medium">{category.avgRating}</span>
                        <span className="text-gray-500 ml-1">平均评分</span>
                      </div>
                      <div>
                        <span className="font-medium">{category.totalUsers}</span>
                        <span className="text-gray-500 ml-1">用户</span>
                      </div>
                      <div>
                        <span className="font-medium">{category.popularityScore}</span>
                        <span className="text-gray-500 ml-1">热度</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {category.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/categories/${category.slug}`} target="_blank" rel="noreferrer">
                      <Eye className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog
        open={isCreating || editingCategory !== null}
        onOpenChange={(open) => {
          if (!open) handleCancel()
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "添加新分类" : "编辑分类"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">分类名称</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：AI写作"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL路径</Label>
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="例如：ai-writing"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">分类描述</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="描述这个分类包含的工具类型..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">图标</Label>
                <Input
                  id="icon"
                  value={formData.icon || ""}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="例如：✍️"
                />
              </div>
              <div>
                <Label htmlFor="color">颜色</Label>
                <Select
                  value={formData.color || "bg-blue-500"}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 ${option.value} rounded`}></div>
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>标签</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="添加标签"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addTag(input.value)
                    input.value = ""
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>精选工具</Label>
              <div className="flex space-x-2 mb-2">
                <Input
                  placeholder="添加精选工具"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeaturedTool(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    addFeaturedTool(input.value)
                    input.value = ""
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.featuredTools?.map((tool) => (
                  <Badge key={tool} variant="secondary" className="flex items-center space-x-1">
                    <span>{tool}</span>
                    <button type="button" onClick={() => removeFeaturedTool(tool)} className="ml-1 hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trending"
                  checked={formData.trending || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, trending: checked as boolean })}
                />
                <Label htmlFor="trending">标记为热门</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive !== false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">启用分类</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
