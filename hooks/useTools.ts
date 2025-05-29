"use client"

import { useState, useEffect } from "react"
import { ToolsAPI } from "@/lib/api/tools"
import type { Tool } from "@/lib/supabase"

export function useTools(
  params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    status?: string
    featured?: boolean
    sortBy?: "popular" | "rating" | "newest" | "name"
  } = {},
) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })

  const fetchTools = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await ToolsAPI.getTools(params)
      setTools(result.data)
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tools")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTools()
  }, [params.page, params.limit, params.category, params.search, params.status, params.featured, params.sortBy])

  const refetch = () => {
    fetchTools()
  }

  return {
    tools,
    loading,
    error,
    pagination,
    refetch,
  }
}

export function useTool(id: string, userId?: string) {
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTool = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await ToolsAPI.getTool(id, userId)
        setTool(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tool")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTool()
    }
  }, [id, userId])

  const toggleFavorite = async () => {
    if (!userId || !tool) return

    try {
      const isFavorited = await ToolsAPI.toggleFavorite(tool.id, userId)
      setTool((prev) => (prev ? { ...prev, is_favorited: isFavorited } : null))
    } catch (err) {
      console.error("Failed to toggle favorite:", err)
    }
  }

  const rateTool = async (rating: number, review?: string) => {
    if (!userId || !tool) return

    try {
      await ToolsAPI.rateTool(tool.id, userId, rating, review)
      // 重新获取工具数据以更新评分
      const updatedTool = await ToolsAPI.getTool(tool.id, userId)
      setTool(updatedTool)
    } catch (err) {
      console.error("Failed to rate tool:", err)
    }
  }

  return {
    tool,
    loading,
    error,
    toggleFavorite,
    rateTool,
  }
}
