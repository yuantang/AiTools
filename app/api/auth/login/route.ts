import { NextRequest } from 'next/server'
import { createClientWithAuth } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: '邮箱和密码不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClientWithAuth()
    
    // 使用服务端客户端登录
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error)
      return new Response(JSON.stringify({
        success: false,
        error: error.message === 'Invalid login credentials' ? '邮箱或密码错误' : error.message
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!data.user) {
      return new Response(JSON.stringify({
        success: false,
        error: '登录失败'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // 查询用户资料
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.user.email)
      .single()

    console.log('登录成功:', {
      user: data.user.email,
      profile: userProfile?.email,
      role: userProfile?.role
    })

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: userProfile?.role || 'user',
        name: userProfile?.name || data.user.user_metadata?.name || 'User'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Login API error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: '服务器内部错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
