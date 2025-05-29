import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyAdminAuth, createAdminResponse, createErrorResponse } from '@/lib/auth-admin'

// POST - 批量操作工具
export async function POST(request: NextRequest) {
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return createErrorResponse(authResult.error!, authResult.status!)
  }

  try {
    const supabase = createClient()
    const { action, toolIds } = await request.json()
    
    if (!action || !toolIds || !Array.isArray(toolIds) || toolIds.length === 0) {
      return createErrorResponse('缺少必要参数')
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    switch (action) {
      case 'publish':
        updateData.status = 'active'
        break
      case 'unpublish':
        updateData.status = 'inactive'
        break
      case 'feature':
        updateData.featured = true
        break
      case 'unfeature':
        updateData.featured = false
        break
      case 'verify':
        updateData.verified = true
        break
      case 'unverify':
        updateData.verified = false
        break
      case 'delete':
        // 批量删除
        const { error: deleteError } = await supabase
          .from('tools')
          .delete()
          .in('id', toolIds)

        if (deleteError) {
          console.error('Batch delete error:', deleteError)
          return createErrorResponse('批量删除失败')
        }

        return createAdminResponse({ 
          message: `成功删除 ${toolIds.length} 个工具`,
          affectedCount: toolIds.length
        })
      default:
        return createErrorResponse('不支持的操作类型')
    }

    // 批量更新
    const { data: updatedTools, error } = await supabase
      .from('tools')
      .update(updateData)
      .in('id', toolIds)
      .select()

    if (error) {
      console.error('Batch update error:', error)
      return createErrorResponse('批量操作失败')
    }

    return createAdminResponse({ 
      message: `成功处理 ${updatedTools.length} 个工具`,
      tools: updatedTools,
      affectedCount: updatedTools.length
    })
  } catch (error) {
    console.error('POST /api/admin/tools/batch error:', error)
    return createErrorResponse('服务器内部错误', 500)
  }
}
