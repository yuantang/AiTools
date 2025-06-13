import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// GET - 获取单个工具
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
    const { data: tool, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(name)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Tool query error:', error)
      return createErrorResponse('工具不存在', 404)
    }

    return createAdminResponse({ tool })
  } catch (error) {
    console.error('GET /api/admin/tools/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// PUT - 更新工具
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

    // 更新工具
    const { data: tool, error } = await supabase
      .from('tools')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Tool update error:', error)
      return createErrorResponse('更新工具失败')
    }

    return createAdminResponse({ tool })
  } catch (error) {
    console.error('PUT /api/admin/tools/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}

// DELETE - 删除工具
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

    // 删除工具
    const { error } = await supabase
      .from('tools')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Tool deletion error:', error)
      return createErrorResponse('删除工具失败')
    }

    return createAdminResponse({ message: '工具已删除' })
  } catch (error) {
    console.error('DELETE /api/admin/tools/[id] error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
