import { supabase } from "@/lib/supabase"

export interface Comment {
  id: string
  user_id: string
  tool_id: string
  parent_id?: string
  content: string
  status: 'active' | 'hidden' | 'deleted'
  helpful_count: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    avatar_url?: string
    role: string
  }
  replies?: Comment[]
}

export class CommentsAPI {
  // 获取工具的评论
  static async getToolComments(toolId: string, options: {
    page?: number
    limit?: number
    sortBy?: 'newest' | 'oldest' | 'helpful'
  } = {}) {
    const { page = 1, limit = 20, sortBy = 'newest' } = options
    const offset = (page - 1) * limit

    let orderBy = 'created_at'
    let ascending = false

    switch (sortBy) {
      case 'oldest':
        orderBy = 'created_at'
        ascending = true
        break
      case 'helpful':
        orderBy = 'helpful_count'
        ascending = false
        break
      default:
        orderBy = 'created_at'
        ascending = false
    }

    const { data, error, count } = await supabase
      .from('comments')
      .select(`
        id,
        user_id,
        tool_id,
        parent_id,
        content,
        status,
        helpful_count,
        created_at,
        updated_at,
        user:users (
          id,
          name,
          avatar_url,
          role
        )
      `, { count: 'exact' })
      .eq('tool_id', toolId)
      .eq('status', 'active')
      .is('parent_id', null) // 只获取顶级评论
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`)
    }

    // 获取每个评论的回复
    const commentsWithReplies = await Promise.all(
      (data || []).map(async (comment) => {
        const { data: replies } = await supabase
          .from('comments')
          .select(`
            id,
            user_id,
            tool_id,
            parent_id,
            content,
            status,
            helpful_count,
            created_at,
            updated_at,
            user:users (
              id,
              name,
              avatar_url,
              role
            )
          `)
          .eq('parent_id', comment.id)
          .eq('status', 'active')
          .order('created_at', { ascending: true })

        return {
          ...comment,
          replies: replies || []
        }
      })
    )

    return {
      data: commentsWithReplies,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  }

  // 创建评论
  static async createComment(data: {
    tool_id: string
    user_id: string
    content: string
    parent_id?: string
  }) {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        tool_id: data.tool_id,
        user_id: data.user_id,
        content: data.content,
        parent_id: data.parent_id || null,
        status: 'active',
        helpful_count: 0
      })
      .select(`
        id,
        user_id,
        tool_id,
        parent_id,
        content,
        status,
        helpful_count,
        created_at,
        updated_at,
        user:users (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`)
    }

    return comment
  }

  // 更新评论
  static async updateComment(commentId: string, content: string, userId: string) {
    // 验证用户权限
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment || comment.user_id !== userId) {
      throw new Error('Unauthorized to update this comment')
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select(`
        id,
        user_id,
        tool_id,
        parent_id,
        content,
        status,
        helpful_count,
        created_at,
        updated_at,
        user:users (
          id,
          name,
          avatar_url,
          role
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to update comment: ${error.message}`)
    }

    return data
  }

  // 删除评论
  static async deleteComment(commentId: string, userId: string) {
    // 验证用户权限
    const { data: comment } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (!comment || comment.user_id !== userId) {
      throw new Error('Unauthorized to delete this comment')
    }

    const { error } = await supabase
      .from('comments')
      .update({ status: 'deleted' })
      .eq('id', commentId)

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`)
    }

    return true
  }

  // 点赞评论
  static async toggleHelpful(commentId: string, userId: string) {
    // 这里可以实现更复杂的点赞逻辑，比如记录用户的点赞状态
    // 为简化，这里直接增加helpful_count
    const { data, error } = await supabase
      .from('comments')
      .select('helpful_count')
      .eq('id', commentId)
      .single()

    if (error) {
      throw new Error(`Failed to get comment: ${error.message}`)
    }

    const { error: updateError } = await supabase
      .from('comments')
      .update({ helpful_count: (data.helpful_count || 0) + 1 })
      .eq('id', commentId)

    if (updateError) {
      throw new Error(`Failed to update helpful count: ${updateError.message}`)
    }

    return true
  }

  // 获取评论统计
  static async getCommentStats(toolId: string) {
    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('tool_id', toolId)
      .eq('status', 'active')

    return {
      totalComments: count || 0
    }
  }

  // 管理员功能：隐藏评论
  static async hideComment(commentId: string, adminUserId: string) {
    // 验证管理员权限
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminUserId)
      .single()

    if (!user || !['admin', 'moderator'].includes(user.role)) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { error } = await supabase
      .from('comments')
      .update({ status: 'hidden' })
      .eq('id', commentId)

    if (error) {
      throw new Error(`Failed to hide comment: ${error.message}`)
    }

    return true
  }

  // 管理员功能：恢复评论
  static async restoreComment(commentId: string, adminUserId: string) {
    // 验证管理员权限
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', adminUserId)
      .single()

    if (!user || !['admin', 'moderator'].includes(user.role)) {
      throw new Error('Unauthorized: Admin access required')
    }

    const { error } = await supabase
      .from('comments')
      .update({ status: 'active' })
      .eq('id', commentId)

    if (error) {
      throw new Error(`Failed to restore comment: ${error.message}`)
    }

    return true
  }
}
