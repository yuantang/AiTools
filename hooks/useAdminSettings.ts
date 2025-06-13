"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'

export interface SystemSettings {
  // 基本设置
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  supportEmail: string

  // 功能设置
  enableUserRegistration: boolean
  enableToolSubmission: boolean
  enableComments: boolean
  enableRatings: boolean
  enableFavorites: boolean
  requireEmailVerification: boolean

  // 审核设置
  autoApproveTools: boolean
  moderationLevel: string
  spamFilterEnabled: boolean

  // 通知设置
  emailNotifications: boolean
  pushNotifications: boolean
  slackWebhook: string

  // SEO设置
  metaTitle: string
  metaDescription: string
  metaKeywords: string

  // 安全设置
  enableTwoFactor: boolean
  sessionTimeout: number
  maxLoginAttempts: number

  // 备份设置
  autoBackup: boolean
  backupFrequency: string
  backupRetention: number
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/settings')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '获取系统设置失败')
      }

      const result = await response.json()
      
      // 设置默认值
      const defaultSettings: SystemSettings = {
        siteName: 'AI工具导航',
        siteDescription: '发现和分享最好的AI工具',
        siteUrl: 'https://aitools.com',
        adminEmail: 'admin@aitools.com',
        supportEmail: 'support@aitools.com',
        enableUserRegistration: true,
        enableToolSubmission: true,
        enableComments: true,
        enableRatings: true,
        enableFavorites: true,
        requireEmailVerification: true,
        autoApproveTools: false,
        moderationLevel: 'strict',
        spamFilterEnabled: true,
        emailNotifications: true,
        pushNotifications: false,
        slackWebhook: '',
        metaTitle: 'AI工具导航 - 发现最好的AI工具',
        metaDescription: '收录全球最新最热门的AI产品，帮助您快速找到适合的AI工具',
        metaKeywords: 'AI工具,人工智能,机器学习,深度学习',
        enableTwoFactor: false,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        autoBackup: true,
        backupFrequency: 'daily',
        backupRetention: 30,
      }

      // 合并默认设置和从服务器获取的设置
      const mergedSettings = { ...defaultSettings, ...result.settings }
      setSettings(mergedSettings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取系统设置失败'
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

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      setSaving(true)

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: newSettings
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '更新系统设置失败')
      }

      // 更新本地状态
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)

      toast({
        title: "成功",
        description: "系统设置更新成功",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新系统设置失败'
      toast({
        title: "错误",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : null)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    saving,
    refetch: fetchSettings,
    updateSettings,
    updateSetting,
  }
}
