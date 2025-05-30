import { NextRequest } from 'next/server'
import { createClientWithAuth } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 检查认证状态...')
    
    const supabase = createClientWithAuth()
    
    // 获取认证用户
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('认证结果:', { 
      user: user?.email, 
      userId: user?.id,
      error: authError?.message 
    })
    
    if (authError || !user) {
      return new Response(JSON.stringify({
        success: false,
        authenticated: false,
        error: '未登录或认证失败',
        details: authError?.message
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // 查询用户资料
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single()
    
    console.log('用户资料查询结果:', { 
      profile: userProfile?.email, 
      role: userProfile?.role,
      status: userProfile?.status,
      error: profileError?.message 
    })
    
    return new Response(JSON.stringify({
      success: true,
      authenticated: true,
      authUser: {
        id: user.id,
        email: user.email,
        confirmed: user.email_confirmed_at ? true : false
      },
      userProfile: userProfile ? {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        status: userProfile.status
      } : null,
      isAdmin: userProfile?.role === 'admin' && userProfile?.status === 'active'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('认证状态检查错误:', error)
    return new Response(JSON.stringify({
      success: false,
      authenticated: false,
      error: '服务器内部错误',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
