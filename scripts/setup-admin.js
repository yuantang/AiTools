// 管理员账号设置脚本
const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ 环境变量配置不完整');
  console.log('请确保 .env.local 文件包含:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 使用服务角色密钥创建客户端（绕过RLS）
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  console.log('🔧 开始设置管理员账号...\n');

  try {
    // 1. 创建管理员用户（在Auth中）
    console.log('📝 创建管理员认证账号...');
    const adminEmail = 'admin@aitools.com';
    const adminPassword = 'admin123456';
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: '系统管理员'
      }
    });

    if (authError && !authError.message.includes('already registered')) {
      throw authError;
    }

    const userId = authData?.user?.id || null;
    console.log(`✅ 管理员认证账号创建成功: ${adminEmail}`);
    
    if (userId) {
      console.log(`用户ID: ${userId}`);
    }

    // 2. 在数据库中创建或更新用户记录
    console.log('\n👤 创建管理员用户记录...');
    
    // 先检查是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (existingUser) {
      // 更新现有用户为管理员
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          status: 'active',
          name: '系统管理员',
          updated_at: new Date().toISOString()
        })
        .eq('email', adminEmail)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      console.log('✅ 已更新现有用户为管理员');
      console.log(`用户信息: ${updatedUser.name} (${updatedUser.email}) - ${updatedUser.role}`);
    } else {
      // 创建新用户记录
      const newUser = {
        id: userId || crypto.randomUUID(),
        email: adminEmail,
        name: '系统管理员',
        role: 'admin',
        status: 'active',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        avatar_url: null,
        bio: '系统管理员账号',
        website: null,
        location: null,
        favorite_count: 0,
        tools_submitted: 0,
        tools_approved: 0,
        reputation_score: 100
      };

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      console.log('✅ 管理员用户记录创建成功');
      console.log(`用户信息: ${createdUser.name} (${createdUser.email}) - ${createdUser.role}`);
    }

    // 3. 验证设置
    console.log('\n🔍 验证管理员设置...');
    
    const { data: adminUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .eq('role', 'admin')
      .single();

    if (verifyError || !adminUser) {
      throw new Error('管理员验证失败');
    }

    console.log('✅ 管理员设置验证成功');

    // 4. 显示登录信息
    console.log('\n🎉 管理员账号设置完成！');
    console.log('\n📋 登录信息:');
    console.log(`邮箱: ${adminEmail}`);
    console.log(`密码: ${adminPassword}`);
    console.log(`角色: ${adminUser.role}`);
    console.log(`状态: ${adminUser.status}`);
    
    console.log('\n🔗 访问链接:');
    console.log('登录页面: http://192.168.1.63:3001/login');
    console.log('管理后台: http://192.168.1.63:3001/admin');
    
    console.log('\n💡 使用说明:');
    console.log('1. 使用上述邮箱和密码登录');
    console.log('2. 登录成功后会自动跳转到管理后台');
    console.log('3. 如果没有自动跳转，请手动访问 /admin');

  } catch (error) {
    console.log('\n❌ 设置失败:', error.message);
    
    if (error.message.includes('already registered')) {
      console.log('\n💡 用户已存在，尝试更新角色...');
      
      try {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ role: 'admin', status: 'active' })
          .eq('email', 'admin@aitools.com')
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        console.log('✅ 已将现有用户设置为管理员');
        console.log('\n📋 登录信息:');
        console.log('邮箱: admin@aitools.com');
        console.log('密码: 使用您之前设置的密码');
        console.log(`角色: ${updatedUser.role}`);
      } catch (updateErr) {
        console.log('❌ 更新角色失败:', updateErr.message);
      }
    }
  }
}

// 运行设置
setupAdmin().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 脚本执行失败:', error.message);
  process.exit(1);
});
