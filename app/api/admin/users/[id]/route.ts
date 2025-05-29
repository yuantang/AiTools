import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取单个用户
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        tools!tools_submitted_by_fkey(count),
        favorites(count)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('User query error:', error)
      return createErrorResponse('用户不存在', 404)
    }

    return createAdminResponse({ user })
  } catch (error) {
    console.error('GET /api/admin/users/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// PUT - 更新用户
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const body = await request.json()
    
    // 防止修改自己的角色和状态
    if (params.id === authResult.user!.id) {
      if (body.role && body.role !== authResult.user!.role) {
        return createErrorResponse('不能修改自己的角色')
      }
      if (body.status && body.status !== 'active') {
        return createErrorResponse('不能禁用自己的账户')
      }
    }
    
    // 更新用户资料
    const { data: user, error } = await supabase
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('User update error:', error)
      return createErrorResponse('更新用户失败')
    }

    // 如果更新了邮箱，同步到认证系统
    if (body.email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        params.id,
        { email: body.email }
      )
      
      if (authError) {
        console.error('Auth email update error:', authError)
        // 不返回错误，因为用户资料已更新
      }
    }

    return createAdminResponse({ user })
  } catch (error) {
    console.error('PUT /api/admin/users/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// DELETE - 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  // 防止删除自己
  if (params.id === authResult.user!.id) {
    return createErrorResponse('不能删除自己的账户')
  }

  try {
    const supabase = createClient()
    
    // 删除认证用户
    const { error: authError } = await supabase.auth.admin.deleteUser(params.id)
    if (authError) {
      console.error('Auth user deletion error:', authError)
      return createErrorResponse('删除认证用户失败')
    }

    // 删除用户资料（应该通过外键级联删除）
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('User profile deletion error:', error)
      return createErrorResponse('删除用户资料失败')
    }

    return createAdminResponse({ message: '用户已删除' })
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
