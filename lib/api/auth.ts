import { supabase } from "../supabase"
import type { User } from "../supabase"

export class AuthAPI {
  // 用户登录
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, session: data.session }
  }

  // 用户注册
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (error) throw error

    // Note: User profile will be created automatically via database trigger
    // or we'll create it when the user first logs in
    return { user: data.user, session: data.session }
  }

  // 用户登出
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("No authenticated user")

    // 尝试从数据库获取用户资料
    const { data: profile, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error || !profile) {
      // 如果没有找到用户资料，尝试创建一个
      const newProfile: Omit<User, "created_at" | "updated_at"> = {
        id: user.id,
        email: user.email || "",
        name: user.user_metadata?.name || "User",
        role: "user",
        status: "active",
        email_verified: user.email_confirmed_at ? true : false,
        last_login: new Date().toISOString(),
        avatar_url: user.user_metadata?.avatar_url || null,
        bio: null,
        website: null,
        location: null,
        favorite_count: 0,
        tools_submitted: 0,
        tools_approved: 0,
        reputation_score: 0,
      }

      // 尝试创建用户资料
      const { data: createdProfile, error: createError } = await supabase
        .from("users")
        .insert({
          ...newProfile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error("Failed to create user profile:", createError)
        // 返回基本资料，即使数据库插入失败
        return {
          ...newProfile,
          created_at: user.created_at,
          updated_at: new Date().toISOString(),
        }
      }

      return createdProfile as User
    }

    return profile as User
  }

  // 更新用户资料
  static async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data as User
  }

  // 重置密码
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  }

  // 更新密码
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }
}
