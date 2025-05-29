import { supabase } from "../supabase"
import type { Category } from "../supabase"

export class CategoriesAPI {
  // 获取分类列表
  static async getCategories(
    params: {
      active?: boolean
      withStats?: boolean
    } = {},
  ) {
    const { active = true, withStats = false } = params

    let query = supabase.from("categories").select("*").order("popularity_score", { ascending: false })

    if (active) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) throw error

    // 如果需要统计信息，获取每个分类的工具数量
    if (withStats && data) {
      for (const category of data) {
        const { count } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true })
          .eq("category_id", category.id)
          .eq("status", "active")

        category.tool_count = count || 0
      }
    }

    return data as Category[]
  }

  // 获取单个分类
  static async getCategory(slug: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()

    if (error) throw error

    // 获取分类下的工具数量
    const { count } = await supabase
      .from("tools")
      .select("*", { count: "exact", head: true })
      .eq("category_id", data.id)
      .eq("status", "active")

    data.tool_count = count || 0

    return data as Category
  }

  // 创建分类
  static async createCategory(categoryData: Partial<Category>, userId: string) {
    const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

    if (error) throw error

    // 记录日志
    await this.logAction("category_created", userId, `创建分类: ${categoryData.name}`)

    return data as Category
  }

  // 更新分类
  static async updateCategory(id: string, categoryData: Partial<Category>, userId: string) {
    const { data, error } = await supabase
      .from("categories")
      .update({
        ...categoryData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    // 记录日志
    await this.logAction("category_updated", userId, `更新分类: ${data.name}`)

    return data as Category
  }

  // 删除分类
  static async deleteCategory(id: string, userId: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) throw error

    // 记录日志
    await this.logAction("category_deleted", userId, `删除分类: ${id}`)
  }

  // 记录操作日志
  private static async logAction(action: string, userId: string, details: string) {
    await supabase.from("system_logs").insert({
      level: "info",
      action,
      user_id: userId,
      details,
      module: "categories",
    })
  }
}
