"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FixAdminPage() {
  const [email, setEmail] = useState("admin@aitools.com")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const createAdmin = async () => {
    setLoading(true)
    setResult("开始创建管理员账号...\n")

    try {
      // 1. 注册用户
      setResult(prev => prev + "📝 注册管理员账号...\n")
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: "admin123456",
        options: {
          data: {
            name: "系统管理员"
          }
        }
      })

      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError
      }

      setResult(prev => prev + "✅ 账号注册成功\n")

      // 2. 获取用户ID
      let userId = signUpData?.user?.id
      if (!userId) {
        // 如果注册失败（用户已存在），尝试登录获取ID
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password: "admin123456"
        })
        userId = signInData?.user?.id
      }

      if (!userId) {
        throw new Error("无法获取用户ID")
      }

      setResult(prev => prev + `用户ID: ${userId}\n`)

      // 3. 创建或更新用户记录
      setResult(prev => prev + "👤 设置用户信息...\n")
      
      const userRecord = {
        id: userId,
        email,
        name: "系统管理员",
        role: "admin",
        status: "active",
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        avatar_url: null,
        bio: "系统管理员账号",
        website: null,
        location: null,
        favorite_count: 0,
        tools_submitted: 0,
        tools_approved: 0,
        reputation_score: 100
      }

      // 先尝试插入，如果失败则更新
      const { error: insertError } = await supabase
        .from('users')
        .insert(userRecord)

      if (insertError) {
        // 如果插入失败，尝试更新
        const { error: updateError } = await supabase
          .from('users')
          .update({
            role: "admin",
            status: "active",
            name: "系统管理员",
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        if (updateError) {
          throw updateError
        }
        setResult(prev => prev + "✅ 已更新现有用户为管理员\n")
      } else {
        setResult(prev => prev + "✅ 管理员用户记录创建成功\n")
      }

      // 4. 验证
      setResult(prev => prev + "🔍 验证管理员设置...\n")
      const { data: adminUser, error: verifyError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (verifyError) {
        throw verifyError
      }

      setResult(prev => prev + "✅ 验证成功\n")
      setResult(prev => prev + `角色: ${adminUser.role}\n`)
      setResult(prev => prev + `状态: ${adminUser.status}\n`)

      setResult(prev => prev + "\n🎉 管理员账号设置完成！\n")
      setResult(prev => prev + "\n📋 登录信息:\n")
      setResult(prev => prev + `邮箱: ${email}\n`)
      setResult(prev => prev + "密码: admin123456\n")
      setResult(prev => prev + "\n💡 现在可以使用这个账号登录了！\n")

    } catch (error: any) {
      setResult(prev => prev + `❌ 错误: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const makeUserAdmin = async () => {
    if (!email) {
      setResult("请输入邮箱地址\n")
      return
    }

    setLoading(true)
    setResult(`设置 ${email} 为管理员...\n`)

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          role: 'admin',
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (!data) {
        throw new Error("用户不存在，请先注册")
      }

      setResult(prev => prev + "✅ 用户角色更新成功\n")
      setResult(prev => prev + `用户: ${data.name} (${data.email})\n`)
      setResult(prev => prev + `角色: ${data.role}\n`)
      setResult(prev => prev + `状态: ${data.status}\n`)
      setResult(prev => prev + "\n💡 现在可以使用管理员权限登录了！\n")

    } catch (error: any) {
      setResult(prev => prev + `❌ 错误: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult("测试管理员登录...\n")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: "admin123456"
      })

      if (error) {
        throw error
      }

      setResult(prev => prev + "✅ 登录成功\n")
      setResult(prev => prev + `用户: ${data.user?.email}\n`)
      setResult(prev => prev + `ID: ${data.user?.id}\n`)

      // 检查角色
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', data.user?.id)
        .single()

      if (profile) {
        setResult(prev => prev + `角色: ${profile.role}\n`)
        setResult(prev => prev + `状态: ${profile.status}\n`)
        
        if (profile.role === 'admin') {
          setResult(prev => prev + "\n🎉 管理员权限验证成功！\n")
          setResult(prev => prev + "💡 可以访问管理后台了\n")
        } else {
          setResult(prev => prev + "\n⚠️ 用户角色不是管理员\n")
        }
      }

    } catch (error: any) {
      setResult(prev => prev + `❌ 登录失败: ${error.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">管理员账号修复工具</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">设置管理员邮箱</h2>
          <div className="mb-4">
            <Label htmlFor="email">管理员邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aitools.com"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={createAdmin}
              disabled={loading}
              className="w-full"
            >
              {loading ? "处理中..." : "创建管理员账号"}
            </Button>
            
            <Button
              onClick={makeUserAdmin}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? "处理中..." : "设为管理员"}
            </Button>
            
            <Button
              onClick={testLogin}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              {loading ? "测试中..." : "测试登录"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">操作结果</h3>
          <div className="bg-gray-100 rounded-lg p-4 min-h-[300px]">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result || "点击按钮开始操作..."}
            </pre>
          </div>
        </div>

        <div className="mt-6 text-center space-x-4">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            前往登录
          </a>
          <a
            href="/admin"
            className="text-green-600 hover:text-green-800 underline"
          >
            管理后台
          </a>
          <a
            href="/"
            className="text-gray-600 hover:text-gray-800 underline"
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}
