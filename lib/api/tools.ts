import { supabase } from "../supabase"
import type { Tool } from "../supabase"

export class ToolsAPI {
  // 获取工具列表
  static async getTools(
    params: {
      page?: number
      limit?: number
      category?: string
      search?: string
      status?: string
      featured?: boolean
      sortBy?: "popular" | "rating" | "newest" | "name"
    } = {},
  ) {
    const { page = 1, limit = 20, category, search, status = "active", featured, sortBy = "popular" } = params

    let query = supabase
      .from("tools")
      .select(`
        *,
        category:categories(*)
      `)
      .eq("status", status)

    // 分类筛选
    if (category && category !== "全部") {
      query = query.eq("category_id", category)
    }

    // 搜索
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
    }

    // 精选筛选
    if (featured) {
      query = query.eq("featured", true)
    }

    // 排序
    switch (sortBy) {
      case "rating":
        query = query.order("rating", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "name":
        query = query.order("name", { ascending: true })
        break
      default: // popular
        query = query.order("view_count", { ascending: false })
    }

    // 分页
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Tool[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  // 获取单个工具详情
  static async getTool(id: string, userId?: string) {
    const query = supabase
      .from("tools")
      .select(`
        *,
        category:categories(*),
        ratings:tool_ratings(
          *,
          user:users(name, avatar_url)
        )
      `)
      .eq("id", id)
      .single()

    const { data: tool, error } = await query

    if (error) throw error

    // 检查用户是否收藏了这个工具
    if (userId) {
      const { data: favorite } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("tool_id", id)
        .single()

      tool.is_favorited = !!favorite
    }

    // 增加浏览量
    await this.incrementViewCount(id)

    return tool as Tool
  }

  // 创建工具
  static async createTool(toolData: Partial<Tool>, userId: string) {
    const { data, error } = await supabase
      .from("tools")
      .insert({
        ...toolData,
        submitted_by: userId,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // 记录日志
    await this.logAction("tool_submitted", userId, `提交新工具: ${toolData.name}`)

    return data as Tool
  }

  // 更新工具
  static async updateTool(id: string, toolData: Partial<Tool>, userId: string) {
    const { data, error } = await supabase
      .from("tools")
      .update({
        ...toolData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // 记录日志
    await this.logAction("tool_updated", userId, `更新工具: ${data.name}`)

    return data as Tool
  }

  // 删除工具
  static async deleteTool(id: string, userId: string) {
    const { error } = await supabase.from("tools").delete().eq("id", id)

    if (error) throw error

    // 记录日志
    await this.logAction("tool_deleted", userId, `删除工具: ${id}`)
  }

  // 审核工具
  static async reviewTool(id: string, action: "approve" | "reject", comment: string, reviewerId: string) {
    const status = action === "approve" ? "active" : "rejected"

    const { data, error } = await supabase
      .from("tools")
      .update({
        status,
        reviewed_by: reviewerId,
        review_comment: comment,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // 记录日志
    await this.logAction(
      action === "approve" ? "tool_approved" : "tool_rejected",
      reviewerId,
      `${action === "approve" ? "通过" : "拒绝"}工具: ${data.name}`,
    )

    return data as Tool
  }

  // 收藏/取消收藏工具
  static async toggleFavorite(toolId: string, userId: string) {
    // 检查是否已收藏
    const { data: existing } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("tool_id", toolId)
      .single()

    if (existing) {
      // 取消收藏
      const { error } = await supabase.from("user_favorites").delete().eq("user_id", userId).eq("tool_id", toolId)

      if (error) throw error

      // 更新工具收藏数
      await supabase.rpc("decrement_favorite_count", { tool_id: toolId })

      return false
    } else {
      // 添加收藏
      const { error } = await supabase.from("user_favorites").insert({
        user_id: userId,
        tool_id: toolId,
      })

      if (error) throw error

      // 更新工具收藏数
      await supabase.rpc("increment_favorite_count", { tool_id: toolId })

      return true
    }
  }

  // 评分工具
  static async rateTool(toolId: string, userId: string, rating: number, review?: string) {
    const { data, error } = await supabase
      .from("tool_ratings")
      .upsert({
        user_id: userId,
        tool_id: toolId,
        rating,
        review,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    // 重新计算工具平均评分
    await this.updateToolRating(toolId)

    return data
  }

  // 增加浏览量
  private static async incrementViewCount(toolId: string) {
    await supabase.rpc("increment_view_count", { tool_id: toolId })
  }

  // 更新工具评分
  private static async updateToolRating(toolId: string) {
    const { data } = await supabase.from("tool_ratings").select("rating").eq("tool_id", toolId)

    if (data && data.length > 0) {
      const avgRating = data.reduce((sum, r) => sum + r.rating, 0) / data.length
      const totalRatings = data.length

      await supabase
        .from("tools")
        .update({
          rating: Number(avgRating.toFixed(1)),
          total_ratings: totalRatings,
        })
        .eq("id", toolId)
    }
  }

  // 记录操作日志
  private static async logAction(action: string, userId: string, details: string) {
    await supabase.from("system_logs").insert({
      level: "info",
      action,
      user_id: userId,
      details,
      module: "tools",
    })
  }
}
