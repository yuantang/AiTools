import { createClient } from "@supabase/supabase-js"

// 环境变量检查
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. " +
    "Please configure it in Vercel project settings."
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. " +
    "Please configure it in Vercel project settings."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface User {
  id: string
  email: string
  password_hash: string
  name: string
  avatar_url?: string
  role: "user" | "moderator" | "admin"
  status: "active" | "inactive" | "banned"
  email_verified: boolean
  location?: string
  bio?: string
  tools_submitted: number
  tools_approved: number
  favorite_count: number
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  tool_count: number
  popularity_score: number
  trending: boolean
  avg_rating: number
  total_users: string
  tags: string[]
  featured_tools: string[]
  parent_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  description: string
  website: string
  logo_url?: string
  category_id: string
  category?: Category
  status: "pending" | "active" | "inactive" | "rejected"
  featured: boolean
  verified: boolean
  rating: number
  total_ratings: number
  view_count: number
  favorite_count: number
  pricing?: string
  tags: string[]
  features: string[]
  screenshots: string[]
  platforms: string[]
  languages: string[]
  api_available: boolean
  open_source: boolean
  contact_email?: string
  developer?: string
  release_date?: string
  last_update?: string
  submitted_by: string
  reviewed_by?: string
  review_comment?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
  is_favorited?: boolean
  ratings?: ToolRating[]
}

export interface ToolRating {
  id: string
  user_id: string
  tool_id: string
  rating: number
  review?: string
  helpful_count: number
  created_at: string
  updated_at: string
  user?: User
}

export interface UserFavorite {
  id: string
  user_id: string
  tool_id: string
  created_at: string
}

export interface Comment {
  id: string
  user_id: string
  tool_id: string
  parent_id?: string
  content: string
  status: "active" | "hidden" | "deleted"
  helpful_count: number
  created_at: string
  updated_at: string
  user?: User
  replies?: Comment[]
}

export interface SystemLog {
  id: string
  level: "info" | "warning" | "error" | "success"
  action: string
  user_id?: string
  ip_address?: string
  user_agent?: string
  module?: string
  details?: string
  metadata?: any
  created_at: string
}

export interface Notification {
  id: string
  title: string
  content: string
  type: "system" | "feature" | "approval" | "warning"
  recipients: "all_users" | "active_users" | "submitters" | "premium_users"
  status: "draft" | "scheduled" | "sent" | "failed"
  read_count: number
  total_count: number
  scheduled_at?: string
  sent_at?: string
  created_by: string
  created_at: string
}

export interface UserNotification {
  id: string
  user_id: string
  notification_id: string
  read: boolean
  read_at?: string
  created_at: string
  notification?: Notification
}

export interface SystemSetting {
  id: string
  key: string
  value?: string
  type: "string" | "number" | "boolean" | "json"
  description?: string
  updated_by?: string
  updated_at: string
}
