import { supabase } from "../supabase"
import type { Notification, UserNotification } from "../supabase"

export class NotificationsAPI {
  // 获取用户通知
  static async getUserNotifications(
    userId: string,
    params: {
      page?: number
      limit?: number
      unreadOnly?: boolean
    } = {},
  ) {
    const { page = 1, limit = 20, unreadOnly = false } = params

    let query = supabase
      .from("user_notifications")
      .select(`
        *,
        notification:notifications(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (unreadOnly) {
      query = query.eq("read", false)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as (UserNotification & { notification: Notification })[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  }

  // 标记通知为已读
  static async markAsRead(userId: string, notificationId: string) {
    const { error } = await supabase
      .from("user_notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("notification_id", notificationId)

    if (error) throw error
  }

  // 标记所有通知为已读
  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("user_notifications")
      .update({ read: true, read_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error
  }

  // 删除通知
  static async deleteNotification(userId: string, notificationId: string) {
    const { error } = await supabase
      .from("user_notifications")
      .delete()
      .eq("user_id", userId)
      .eq("notification_id", notificationId)

    if (error) throw error
  }

  // 获取未读通知数量
  static async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from("user_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error

    return count || 0
  }

  // 创建系统通知
  static async createSystemNotification(
    title: string,
    content: string,
    type = "info",
    recipients: "all" | "active" | string[] = "all",
  ) {
    // 创建通知
    const { data: notification, error: notificationError } = await supabase
      .from("notifications")
      .insert({
        title,
        content,
        type,
        recipients: Array.isArray(recipients) ? "custom" : recipients,
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (notificationError) throw notificationError

    // 获取目标用户
    let userQuery = supabase.from("users").select("id")

    if (recipients === "active") {
      userQuery = userQuery.eq("status", "active")
    } else if (Array.isArray(recipients)) {
      userQuery = userQuery.in("id", recipients)
    }

    const { data: users } = await userQuery

    if (users) {
      // 创建用户通知关联
      const userNotifications = users.map((user) => ({
        user_id: user.id,
        notification_id: notification.id,
      }))

      await supabase.from("user_notifications").insert(userNotifications)

      // 更新通知总数
      await supabase.from("notifications").update({ total_count: users.length }).eq("id", notification.id)
    }

    return notification
  }
}
