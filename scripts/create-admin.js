const { createClient } = require('@supabase/supabase-js')

// 从环境变量获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('请设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    const adminEmail = 'admin@aitools.com'
    const adminPassword = 'admin123456'
    const adminName = '系统管理员'

    console.log('正在创建管理员用户...')

    // 创建认证用户
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { name: adminName }
    })

    if (authError) {
      console.error('创建认证用户失败:', authError)
      return
    }

    console.log('认证用户创建成功:', authUser.user.id)

    // 创建用户资料
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        name: adminName,
        email: adminEmail,
        role: 'admin',
        status: 'active',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('创建用户资料失败:', profileError)
      // 删除认证用户
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return
    }

    console.log('管理员用户创建成功!')
    console.log('邮箱:', adminEmail)
    console.log('密码:', adminPassword)
    console.log('角色:', userProfile.role)

  } catch (error) {
    console.error('创建管理员用户时发生错误:', error)
  }
}

createAdminUser()
