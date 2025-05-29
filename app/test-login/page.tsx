"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestLoginPage() {
  const [email, setEmail] = useState("root@root")
  const [password, setPassword] = useState("root@123")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const testConnection = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      console.log("🔍 测试数据库连接...")
      
      // 测试基本连接
      const { data, error } = await supabase
        .from('users')
        .select('count(*)')
        .limit(1)

      if (error) {
        throw new Error(`数据库连接失败: ${error.message}`)
      }

      console.log("✅ 数据库连接成功")
      setResult({ type: "success", message: "数据库连接成功" })
    } catch (err: any) {
      console.error("❌ 连接测试失败:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      console.log("🔐 测试登录...")
      console.log("邮箱:", email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(`登录失败: ${error.message}`)
      }

      console.log("✅ 登录成功")
      console.log("用户数据:", data.user)
      
      setResult({
        type: "success",
        message: "登录成功",
        user: data.user,
        session: data.session
      })
    } catch (err: any) {
      console.error("❌ 登录失败:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testRegister = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      console.log("📝 测试注册...")
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: "测试用户"
          }
        }
      })

      if (error) {
        throw new Error(`注册失败: ${error.message}`)
      }

      console.log("✅ 注册成功")
      console.log("用户数据:", data.user)
      
      setResult({
        type: "success",
        message: "注册成功",
        user: data.user,
        session: data.session
      })
    } catch (err: any) {
      console.error("❌ 注册失败:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checkUsers = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      console.log("👥 查询用户列表...")
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, status, created_at')
        .limit(10)

      if (error) {
        throw new Error(`查询失败: ${error.message}`)
      }

      console.log("✅ 查询成功")
      console.log("用户列表:", data)
      
      setResult({
        type: "success",
        message: `找到 ${data.length} 个用户`,
        users: data
      })
    } catch (err: any) {
      console.error("❌ 查询失败:", err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">登录问题诊断工具</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试账号信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">测试功能</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              测试数据库连接
            </button>
            <button
              onClick={checkUsers}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              查询用户列表
            </button>
            <button
              onClick={testRegister}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              测试注册
            </button>
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              测试登录
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800">测试中...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">错误信息</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold">测试结果</h3>
            <p className="text-green-700 mt-1">{result.message}</p>
            {result.user && (
              <div className="mt-2">
                <p className="text-sm text-green-600">用户ID: {result.user.id}</p>
                <p className="text-sm text-green-600">邮箱: {result.user.email}</p>
              </div>
            )}
            {result.users && (
              <div className="mt-2">
                <p className="text-sm text-green-600">用户列表:</p>
                <ul className="text-xs text-green-600 mt-1">
                  {result.users.map((user: any) => (
                    <li key={user.id}>
                      {user.email} ({user.role}) - {user.status}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            返回正常登录页面
          </a>
        </div>
      </div>
    </div>
  )
}
