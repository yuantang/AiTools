"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface DashboardStats {
  totalTools: number
  activeTools: number
  pendingTools: number
  inactiveTools: number
  rejectedTools: number
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  bannedUsers: number
  totalCategories: number
}

interface PendingSubmission {
  id: string
  name: string
  description: string
  created_at: string
  categories?: { name: string }
  users?: { name: string; email: string }
  submitter?: { name: string; email: string }
  category?: { name: string }
}

interface TopTool {
  id: string
  name: string
  logo_url?: string
  views: number
  view_count: number
  favorites: number
  favorite_count: number
  rating: number
  categories?: { name: string }
  category?: { name: string }
}

interface RecentUser {
  id: string
  name: string
  email: string
  avatar_url?: string
  status: string
  created_at: string
}

interface SystemStatus {
  database: string
  api: string
  storage: number
  uptime: string
}

interface DashboardData {
  stats: DashboardStats
  pendingSubmissions: PendingSubmission[]
  topTools: TopTool[]
  recentUsers: RecentUser[]
  systemStatus: SystemStatus
}

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/dashboard')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取仪表盘数据失败')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取仪表盘数据失败'
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

  const approveTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'active',
          reviewed_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '审核通过失败')
      }

      toast({
        title: "成功",
        description: "工具审核通过",
      })

      // 刷新数据
      await fetchDashboardData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '审核通过失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const rejectTool = async (toolId: string, reason?: string) => {
    try {
      const response = await fetch(`/api/admin/tools/${toolId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          review_comment: reason || '不符合收录标准',
          reviewed_at: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '审核拒绝失败')
      }

      toast({
        title: "成功",
        description: "工具审核拒绝",
      })

      // 刷新数据
      await fetchDashboardData()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '审核拒绝失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    approveTool,
    rejectTool,
  }
}
