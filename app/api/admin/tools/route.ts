import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取所有工具
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
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured') === 'true'
    const verified = searchParams.get('verified') === 'true'

    const offset = (page - 1) * limit

    // 构建查询
    let query = supabase
      .from('tools')
      .select(`
        *,
        categories(name)
      `, { count: 'exact' })

    // 添加搜索条件
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category) {
      query = query.eq('category_id', category)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (featured) {
      query = query.eq('featured', true)
    }

    if (verified) {
      query = query.eq('verified', true)
    }

    // 执行查询
    const { data: tools, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Tools query error:', error)
      return createErrorResponse('获取工具列表失败')
    }

    // 获取统计数据
    const { data: stats } = await supabase
      .from('tools')
      .select('status, featured, verified')

    const statistics = {
      total: count || 0,
      active: stats?.filter(t => t.status === 'active').length || 0,
      pending: stats?.filter(t => t.status === 'pending').length || 0,
      featured: stats?.filter(t => t.featured).length || 0,
      verified: stats?.filter(t => t.verified).length || 0,
    }

    return createAdminResponse({
      tools,
      statistics,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('GET /api/admin/tools error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// POST - 创建新工具
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const body = await request.json()

    // 验证必填字段
    const { name, description, url, category_id } = body
    if (!name || !description || !url || !category_id) {
      return createErrorResponse('缺少必填字段')
    }

    // 创建工具
    const { data: tool, error } = await supabase
      .from('tools')
      .insert({
        ...body,
        submitted_by: authResult.user!.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Tool creation error:', error)
      return createErrorResponse('创建工具失败')
    }

    return createAdminResponse({ tool }, 201)
  } catch (error) {
    console.error('POST /api/admin/tools error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
