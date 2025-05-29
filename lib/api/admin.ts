import { supabase } from "../supabase"
import type { User, Tool, SystemLog, Notification } from "../supabase"

export class AdminAPI {
  // 获取仪表板统计数据
  static async getDashboardStats() {
    const [
      { count: totalTools },
      { count: activeTools },
      { count: pendingTools },
      { count: totalUsers },
      { count: activeUsers },
      { count: totalCategories },
    ] = await Promise.all([
      supabase.from("tools").select("*", { count: "exact", head: true }),
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("tools").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true),
    ])

    return {
      totalTools: totalTools || 0,
      activeTools: activeTools || 0,
      pendingTools: pendingTools || 0,
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalCategories: totalCategories || 0,
    }
  }

  // 获取用户列表
  static async getUsers(
    params: {
      page?: number
      limit?: number
      search?: string
      role?: string
      status?: string
    } = {},
  ) {
    const { page = 1, limit = 20, search, role, status } = params

    let query = supabase.from("users").select("*").order("created_at", { ascending: false })

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (role && role !== "全部") {
      query = query.eq("role", role)
    }

    if (status && status !== "全部") {
      query = query.eq("status", status)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as User[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  // 更新用户状态
  static async updateUserStatus(userId: string, status: string, adminId: string) {
    const { data, error } = await supabase.from("users").update({ status }).eq("id", userId).select().single()

    if (error) throw error

    // 记录日志
    await this.logAction("user_status_updated", adminId, `更新用户状态: ${data.email} -> ${status}`)

    return data as User
  }

  // 获取待审核内容
  static async getPendingSubmissions(type?: string) {
    const query = supabase
      .from("tools")
      .select(`
        *,
        category:categories(*),
        submitter:users!submitted_by(name, email, avatar_url)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    const { data, error } = await query

    if (error) throw error

    return data as (Tool & { submitter: User })[]
  }

  // 获取系统日志
  static async getSystemLogs(
    params: {
      page?: number
      limit?: number
      level?: string
      module?: string
      search?: string
    } = {},
  ) {
    const { page = 1, limit = 50, level, module, search } = params

    let query = supabase.from("system_logs").select("*").order("created_at", { ascending: false })

    if (level && level !== "全部") {
      query = query.eq("level", level)
    }

    if (module && module !== "全部") {
      query = query.eq("module", module)
    }

    if (search) {
      query = query.or(`action.ilike.%${search}%,details.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as SystemLog[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  // 发送通知
  static async sendNotification(notificationData: Partial<Notification>, adminId: string) {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        ...notificationData,
        created_by: adminId,
        sent_at: new Date().toISOString(),
        status: "sent",
      })
      .select()
      .single()

    if (error) throw error

    // 创建用户通知关联
    await this.createUserNotifications(data.id, data.recipients)

    // 记录日志
    await this.logAction("notification_sent", adminId, `发送通知: ${data.title}`)

    return data as Notification
  }

  // 创建用户通知关联
  private static async createUserNotifications(notificationId: string, recipients: string) {
    let userQuery = supabase.from("users").select("id")

    switch (recipients) {
      case "active_users":
        userQuery = userQuery.eq("status", "active")
        break
      case "submitters":
        userQuery = userQuery.gt("tools_submitted", 0)
        break
      case "premium_users":
        // 假设有付费用户标识
        userQuery = userQuery.eq("role", "premium")
        break
      default: // all_users
        break
    }

    const { data: users } = await userQuery

    if (users) {
      const userNotifications = users.map((user) => ({
        user_id: user.id,
        notification_id: notificationId,
      }))

      await supabase.from("user_notifications").insert(userNotifications)

      // 更新通知的总数
      await supabase.from("notifications").update({ total_count: users.length }).eq("id", notificationId)
    }
  }

  // 记录操作日志
  private static async logAction(action: string, userId: string, details: string) {
    await supabase.from("system_logs").insert({
      level: "info",
      action,
      user_id: userId,
      details,
      module: "admin",
    })
  }
}
