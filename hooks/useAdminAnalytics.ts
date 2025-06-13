"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface AnalyticsData {
  overview: {
    totalVisitors: number
    activeUsers: number
    totalTools: number
    avgRating: number
  }
  tools: {
    total: number
    active: number
    pending: number
    totalViews: number
    totalFavorites: number
  }
  users: {
    total: number
    active: number
    newUsers: number
  }
  categories: Array<{
    name: string
    toolCount: number
    percentage: number
  }>
  traffic: Array<{
    date: string
    visitors: number
    pageViews: number
    newUsers: number
  }>
  geographic: Array<{
    country: string
    users: number
    percentage: number
  }>
  timeRange: string
  generatedAt: string
}

export function useAdminAnalytics(timeRange: string = '30d') {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchAnalytics = async (range: string = timeRange) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/analytics?timeRange=${range}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取分析数据失败')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取分析数据失败'
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

  useEffect(() => {
    fetchAnalytics(timeRange)
  }, [timeRange])

  return {
    data,
    loading,
    error,
    refetch: () => fetchAnalytics(timeRange),
    fetchAnalytics,
  }
}
