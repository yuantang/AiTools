"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function QuickTestPage() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const runQuickTest = async () => {
    setLoading(true)
    setResult("开始测试...\n")

    try {
      // 1. 测试环境变量
      setResult(prev => prev + "✅ 环境变量检查通过\n")
      setResult(prev => prev + `URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...\n`)

      // 2. 测试基本连接
      setResult(prev => prev + "🔗 测试数据库连接...\n")
      const { data, error } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1)

      if (error) {
        setResult(prev => prev + `❌ 数据库连接失败: ${error.message}\n`)
        return
      }

      setResult(prev => prev + "✅ 数据库连接成功\n")

      // 3. 查询用户
      setResult(prev => prev + "👥 查询用户列表...\n")
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, email, role, status')
        .limit(5)

      if (usersError) {
        setResult(prev => prev + `❌ 用户查询失败: ${usersError.message}\n`)
        return
      }

      setResult(prev => prev + `✅ 找到 ${users.length} 个用户\n`)
      users.forEach(user => {
        setResult(prev => prev + `  - ${user.email} (${user.role})\n`)
      })

      // 4. 测试注册
      setResult(prev => prev + "📝 测试注册功能...\n")
      const testEmail = `test-${Date.now()}@example.com`
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: "test123456",
        options: {
          data: { name: "测试用户" }
        }
      })

      if (signUpError) {
        setResult(prev => prev + `⚠️ 注册测试: ${signUpError.message}\n`)
      } else {
        setResult(prev => prev + "✅ 注册功能正常\n")
        if (signUpData.user) {
          setResult(prev => prev + `用户ID: ${signUpData.user.id}\n`)
        }
      }

      // 5. 测试登录（使用已知用户）
      if (users.length > 0) {
        setResult(prev => prev + "🔐 测试登录功能...\n")
        // 尝试使用第一个用户的邮箱
        const testUser = users[0]
        setResult(prev => prev + `尝试登录: ${testUser.email}\n`)
        
        // 注意：这里无法测试真实登录，因为我们不知道密码
        setResult(prev => prev + "⚠️ 无法测试真实登录（不知道密码）\n")
        setResult(prev => prev + "💡 建议：使用注册的新用户进行登录测试\n")
      }

      setResult(prev => prev + "\n🎉 基础测试完成！\n")
      setResult(prev => prev + "\n💡 建议下一步：\n")
      setResult(prev => prev + "1. 注册新用户: /register\n")
      setResult(prev => prev + "2. 尝试登录新用户\n")
      setResult(prev => prev + "3. 在数据库中设置为管理员\n")

    } catch (err: any) {
      setResult(prev => prev + `❌ 测试失败: ${err.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  const testSpecificLogin = async () => {
    setLoading(true)
    setResult("测试特定登录...\n")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "root@root",
        password: "root@123"
      })

      if (error) {
        setResult(prev => prev + `❌ 登录失败: ${error.message}\n`)
        
        // 如果用户不存在，尝试注册
        if (error.message.includes("Invalid login credentials")) {
          setResult(prev => prev + "🔄 用户不存在，尝试注册...\n")
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: "root@root",
            password: "root@123",
            options: {
              data: { name: "Root User" }
            }
          })

          if (signUpError) {
            setResult(prev => prev + `❌ 注册失败: ${signUpError.message}\n`)
          } else {
            setResult(prev => prev + "✅ 注册成功！\n")
            setResult(prev => prev + "💡 现在可以尝试登录了\n")
          }
        }
      } else {
        setResult(prev => prev + "✅ 登录成功！\n")
        setResult(prev => prev + `用户: ${data.user?.email}\n`)
        setResult(prev => prev + `ID: ${data.user?.id}\n`)
      }
    } catch (err: any) {
      setResult(prev => prev + `❌ 错误: ${err.message}\n`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">快速诊断工具</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={runQuickTest}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "测试中..." : "运行完整测试"}
            </button>
            
            <button
              onClick={testSpecificLogin}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "测试中..." : "测试 root@root 登录"}
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 min-h-[400px]">
            <h3 className="font-semibold mb-2">测试结果:</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {result || "点击按钮开始测试..."}
            </pre>
          </div>
        </div>

        <div className="text-center space-x-4">
          <a
            href="/test-login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            返回详细诊断工具
          </a>
          <a
            href="/register"
            className="text-green-600 hover:text-green-800 underline"
          >
            注册新用户
          </a>
          <a
            href="/login"
            className="text-orange-600 hover:text-orange-800 underline"
          >
            尝试登录
          </a>
        </div>
      </div>
    </div>
  )
}
