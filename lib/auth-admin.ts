import { createClientWithAuth } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function verifyAdminAuth(request: NextRequest) {
  try {
    const supabase = createClientWithAuth()

    // 获取认证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        error: '未登录或认证失败',
        status: 401
      }
    }

    // 查询用户资料 - 先按ID查找，如果找不到再按邮箱查找
    let { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    // 如果按ID找不到，尝试按邮箱查找
    if (profileError || !userProfile) {
      const { data: profileByEmail, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single()

      if (emailError || !profileByEmail) {
        return {
          success: false,
          error: '用户资料不存在',
          status: 403
        }
      }

      userProfile = profileByEmail
    }

    // 验证管理员权限
    if (userProfile.role !== 'admin') {
      return {
        success: false,
        error: '权限不足，需要管理员权限',
        status: 403
      }
    }

    // 验证账户状态
    if (userProfile.status !== 'active') {
      return {
        success: false,
        error: '账户已被禁用',
        status: 403
      }
    }

    return {
      success: true,
      user: userProfile,
      authUser: user
    }
  } catch (error) {
    console.error('Admin auth verification error:', error)
    return {
      success: false,
      error: '服务器内部错误',
      status: 500
    }
  }
}

export function createAdminResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export function createErrorResponse(error: string, status: number = 400) {
  return createAdminResponse({ error }, status)
}
