import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取所有分类
export async function GET(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()

    // 获取分类及其工具数量
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Categories query error:', error)
      return createErrorResponse('获取分类列表失败')
    }

    // 计算统计数据
    const statistics = {
      total: categories.length,
      active: categories.filter(c => c.is_active).length,
      inactive: categories.filter(c => !c.is_active).length,
      trending: categories.filter(c => c.trending).length,
    }

    return createAdminResponse({
      categories,
      statistics
    })
  } catch (error) {
    console.error('GET /api/admin/categories error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// POST - 创建新分类
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const body = await request.json()

    // 验证必填字段
    const { name, slug, description } = body
    if (!name || !slug || !description) {
      return createErrorResponse('缺少必填字段')
    }

    // 检查slug是否已存在
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return createErrorResponse('URL路径已存在')
    }

    // 创建分类
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Category creation error:', error)
      return createErrorResponse('创建分类失败')
    }

    return createAdminResponse({ category }, 201)
  } catch (error) {
    console.error('POST /api/admin/categories error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
