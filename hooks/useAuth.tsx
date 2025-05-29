"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { AuthAPI } from "@/lib/api/auth"
import type { User as UserProfile } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取初始会话
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        if (session?.user) {
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await AuthAPI.getCurrentUser()
      setUserProfile(profile)
    } catch (error) {
      console.error("Error loading user profile:", error)

      // 尝试直接从数据库获取用户信息
      try {
        const { data: directProfile, error: directError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (!directError && directProfile) {
          setUserProfile(directProfile)
          return
        }

        // 如果按ID找不到，尝试按邮箱查找
        if (user?.email) {
          const { data: emailProfile, error: emailError } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!emailError && emailProfile) {
            setUserProfile(emailProfile)
            return
          }
        }
      } catch (dbError) {
        console.error("Error fetching user from database:", dbError)
      }

      // Create a minimal profile for display purposes
      if (user) {
        const defaultRole = user.email === 'admin@aitools.com' ? 'admin' : 'user'

        setUserProfile({
          id: userId,
          email: user.email || "",
          password_hash: "",
          name: user.user_metadata?.name || (user.email === 'admin@aitools.com' ? '系统管理员' : "User"),
          role: defaultRole,
          status: "active",
          email_verified: user.email_confirmed_at ? true : false,
          created_at: user.created_at,
          updated_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
          avatar_url: user.user_metadata?.avatar_url || null,
          bio: undefined,
          location: undefined,
          favorite_count: 0,
          tools_submitted: 0,
          tools_approved: 0,
        })
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await AuthAPI.signIn(email, password)
      if (user) {
        await loadUserProfile(user.id)
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await AuthAPI.signUp(email, password, name)
      // Don't try to load profile immediately after signup
      // The user will need to verify their email first
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AuthAPI.signOut()
      setUserProfile(null)
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error("No user logged in")
    try {
      const updatedProfile = await AuthAPI.updateProfile(user.id, data)
      setUserProfile(updatedProfile)
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
