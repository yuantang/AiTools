"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  color?: string
  is_active: boolean
  trending?: boolean
  tags?: string[]
  featured_tools?: string[]
  created_at: string
  updated_at: string
  tools?: { count: number }[]
}

interface CategoriesResponse {
  categories: Category[]
  statistics: {
    total: number
    active: number
    inactive: number
    trending: number
  }
}

export function useAdminCategories() {
  const [data, setData] = useState<CategoriesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/categories')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取分类列表失败')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取分类列表失败'
      setError(errorMessage)
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '创建分类失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "分类创建成功",
      })
      
      // 刷新列表
      await fetchCategories()
      return result.category
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建分类失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新分类失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "分类更新成功",
      })
      
      // 刷新列表
      await fetchCategories()
      return result.category
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新分类失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除分类失败')
      }

      toast({
        title: "成功",
        description: "分类删除成功",
      })
      
      // 刷新列表
      await fetchCategories()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除分类失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
