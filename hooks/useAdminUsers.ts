"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'moderator' | 'admin'
  status: 'active' | 'inactive' | 'banned'
  email_verified: boolean
  created_at: string
  updated_at: string
  tools?: { count: number }[]
  favorites?: { count: number }[]
}

interface UsersResponse {
  users: User[]
  statistics: {
    total: number
    active: number
    inactive: number
    banned: number
    verified: number
    admins: number
    moderators: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface UseAdminUsersOptions {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
  verified?: boolean
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const [data, setData] = useState<UsersResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.role) params.append('role', options.role)
      if (options.status) params.append('status', options.status)
      if (options.verified) params.append('verified', 'true')

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取用户列表失败')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取用户列表失败'
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

  const createUser = async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '创建用户失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "用户创建成功",
      })
      
      // 刷新列表
      await fetchUsers()
      return result.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建用户失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const updateUser = async (id: string, userData: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新用户失败')
      }

      const result = await response.json()
      toast({
        title: "成功",
        description: "用户更新成功",
      })
      
      // 刷新列表
      await fetchUsers()
      return result.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新用户失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '删除用户失败')
      }

      toast({
        title: "成功",
        description: "用户删除成功",
      })
      
      // 刷新列表
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除用户失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [options.page, options.limit, options.search, options.role, options.status, options.verified])

  return {
    data,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
