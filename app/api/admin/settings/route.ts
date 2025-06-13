import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取系统设置
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    
    // 获取所有系统设置
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*')

    if (error) {
      console.error('Settings query error:', error)
      return createErrorResponse('获取系统设置失败')
    }

    // 将设置转换为键值对格式
    const settingsMap: Record<string, any> = {}
    settings?.forEach(setting => {
      let value = setting.value
      
      // 根据类型转换值
      switch (setting.type) {
        case 'boolean':
          value = value === 'true'
          break
        case 'number':
          value = Number(value)
          break
        case 'json':
          try {
            value = JSON.parse(value)
          } catch {
            value = setting.value
          }
          break
        default:
          value = setting.value
      }
      
      settingsMap[setting.key] = value
    })

    return createAdminResponse({ settings: settingsMap })
  } catch (error) {
    console.error('GET /api/admin/settings error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// PUT - 更新系统设置
export async function PUT(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const body = await request.json()
    
    if (!body.settings || typeof body.settings !== 'object') {
      return createErrorResponse('无效的设置数据')
    }

    // 批量更新设置
    const updates = Object.entries(body.settings).map(([key, value]) => {
      let stringValue = String(value)
      let type = 'string'

      // 确定数据类型
      if (typeof value === 'boolean') {
        type = 'boolean'
        stringValue = value ? 'true' : 'false'
      } else if (typeof value === 'number') {
        type = 'number'
        stringValue = String(value)
      } else if (typeof value === 'object' && value !== null) {
        type = 'json'
        stringValue = JSON.stringify(value)
      }

      return {
        key,
        value: stringValue,
        type,
        updated_at: new Date().toISOString()
      }
    })

    // 使用upsert来插入或更新设置
    const { error } = await supabase
      .from('system_settings')
      .upsert(updates, { onConflict: 'key' })

    if (error) {
      console.error('Settings update error:', error)
      return createErrorResponse('更新系统设置失败')
    }

    return createAdminResponse({ 
      message: '系统设置更新成功',
      updatedCount: updates.length
    })
  } catch (error) {
    console.error('PUT /api/admin/settings error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
