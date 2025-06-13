import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取所有用户
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // 获取查询参数
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''
    const status = searchParams.get('status') || ''
    const verified = searchParams.get('verified') === 'true'

    const offset = (page - 1) * limit

    // 构建查询
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })

    // 添加搜索条件
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (role) {
      query = query.eq('role', role)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (verified) {
      query = query.eq('email_verified', true)
    }

    // 执行查询
    const { data: users, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Users query error:', error)
      return createErrorResponse('获取用户列表失败')
    }

    // 获取统计数据
    const { data: stats } = await supabase
      .from('users')
      .select('role, status, email_verified')

    const statistics = {
      total: count || 0,
      active: stats?.filter(u => u.status === 'active').length || 0,
      inactive: stats?.filter(u => u.status === 'inactive').length || 0,
      banned: stats?.filter(u => u.status === 'banned').length || 0,
      verified: stats?.filter(u => u.email_verified).length || 0,
      admins: stats?.filter(u => u.role === 'admin').length || 0,
      moderators: stats?.filter(u => u.role === 'moderator').length || 0,
    }

    return createAdminResponse({
      users,
      statistics,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('GET /api/admin/users error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// POST - 创建新用户
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const body = await request.json()

    // 验证必填字段
    const { name, email, password, role = 'user' } = body
    if (!name || !email || !password) {
      return createErrorResponse('缺少必填字段')
    }

    // 创建认证用户
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name }
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      return createErrorResponse('创建认证用户失败')
    }

    // 创建用户资料
    const { data: user, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        name,
        email,
        role,
        status: 'active',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('User profile creation error:', profileError)
      // 如果创建用户资料失败，删除认证用户
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return createErrorResponse('创建用户资料失败')
    }

    return createAdminResponse({ user }, 201)
  } catch (error) {
    console.error('POST /api/admin/users error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
