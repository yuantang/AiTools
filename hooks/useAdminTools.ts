"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

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
  rating?: number
  views: number
  favorites: number
  pricing?: string
  submitted_by: string
  created_at: string
  updated_at: string
  categories?: { name: string }
  users?: { name: string; email: string }
}

interface ToolsResponse {
  tools: Tool[]
  statistics: {
    total: number
    active: number
    pending: number
    featured: number
    verified: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface UseAdminToolsOptions {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  featured?: boolean
  verified?: boolean
}

export function useAdminTools(options: UseAdminToolsOptions = {}) {
  const [data, setData] = useState<ToolsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.featured) params.append('featured', 'true')
      if (options.verified) params.append('verified', 'true')

      const response = await fetch(`/api/admin/tools?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取工具列表失败')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取工具列表失败'
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

  const createTool = async (toolData: Partial<Tool>) => {
    try {
      const response = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '创建工具失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "工具创建成功",
      })
      
      // 刷新列表
      await fetchTools()
      return result.tool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建工具失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const updateTool = async (id: string, toolData: Partial<Tool>) => {
    try {
      const response = await fetch(`/api/admin/tools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toolData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新工具失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "工具更新成功",
      })
      
      // 刷新列表
      await fetchTools()
      return result.tool
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新工具失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteTool = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/tools/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除工具失败')
      }

      toast({
        title: "成功",
        description: "工具删除成功",
      })
      
      // 刷新列表
      await fetchTools()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除工具失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const batchOperation = async (action: string, toolIds: string[]) => {
    try {
      const response = await fetch('/api/admin/tools/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, toolIds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '批量操作失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: result.message,
      })
      
      // 刷新列表
      await fetchTools()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量操作失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    fetchTools()
  }, [options.page, options.limit, options.search, options.category, options.status, options.featured, options.verified])

  return {
    data,
    loading,
    error,
    refetch: fetchTools,
    createTool,
    updateTool,
    deleteTool,
    batchOperation,
  }
}
