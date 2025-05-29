import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取单个分类
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
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        tools(count)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Category query error:', error)
      return createErrorResponse('分类不存在', 404)
    }

    return createAdminResponse({ category })
  } catch (error) {
    console.error('GET /api/admin/categories/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// PUT - 更新分类
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
    
    // 如果更新slug，检查是否已存在
    if (body.slug) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (existingCategory) {
        return createErrorResponse('URL路径已存在')
      }
    }
    
    // 更新分类
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Category update error:', error)
      return createErrorResponse('更新分类失败')
    }

    return createAdminResponse({ category })
  } catch (error) {
    console.error('PUT /api/admin/categories/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// DELETE - 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    
    // 检查是否有工具使用此分类
    const { data: tools, error: toolsError } = await supabase
      .from('tools')
      .select('id')
      .eq('category_id', params.id)
      .limit(1)

    if (toolsError) {
      console.error('Tools check error:', toolsError)
      return createErrorResponse('检查分类使用情况失败')
    }

    if (tools && tools.length > 0) {
      return createErrorResponse('无法删除：该分类下还有工具')
    }
    
    // 删除分类
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Category deletion error:', error)
      return createErrorResponse('删除分类失败')
    }

    return createAdminResponse({ message: '分类已删除' })
  } catch (error) {
    console.error('DELETE /api/admin/categories/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
