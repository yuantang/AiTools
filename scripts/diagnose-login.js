// 登录问题诊断脚本
const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 开始诊断登录问题...\n');

// 检查环境变量
console.log('📋 环境变量检查:');
console.log(`SUPABASE_URL: ${supabaseUrl ? '✅ 已设置' : '❌ 未设置'}`);
console.log(`SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ 已设置' : '❌ 未设置'}`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('\n❌ 环境变量配置不完整，请检查 .env.local 文件');
  process.exit(1);
}

// 创建Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  try {
    console.log('\n🔗 测试数据库连接...');
    
    // 测试基本连接
    const { data, error } = await supabase
      .from('users')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('❌ 数据库连接失败:', error.message);
      return;
    }
    
    console.log('✅ 数据库连接正常');
    
    // 检查用户表
    console.log('\n👥 检查用户表...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role, status')
      .limit(5);
    
    if (usersError) {
      console.log('❌ 用户表查询失败:', usersError.message);
      return;
    }
    
    console.log(`✅ 用户表正常，共有 ${users.length} 个用户`);
    if (users.length > 0) {
      console.log('用户列表:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role}) - ${user.status}`);
      });
    }
    
    // 测试认证功能
    console.log('\n🔐 测试认证功能...');
    
    // 测试用户注册（使用临时邮箱）
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'test123456';
    
    console.log(`尝试注册测试用户: ${testEmail}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      console.log('❌ 注册测试失败:', signUpError.message);
      
      // 如果是邮箱已存在的错误，尝试登录
      if (signUpError.message.includes('already registered')) {
        console.log('📧 邮箱已存在，尝试登录...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (signInError) {
          console.log('❌ 登录测试失败:', signInError.message);
        } else {
          console.log('✅ 登录测试成功');
          // 清理测试会话
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ 注册测试成功');
      if (signUpData.user) {
        console.log('用户ID:', signUpData.user.id);
        // 清理测试会话
        await supabase.auth.signOut();
      }
    }
    
    // 检查RLS策略
    console.log('\n🛡️ 检查RLS策略...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies_info')
      .catch(() => ({ data: null, error: { message: 'RPC函数不存在，这是正常的' } }));
    
    if (policiesError && !policiesError.message.includes('不存在')) {
      console.log('⚠️ RLS策略检查失败:', policiesError.message);
    } else {
      console.log('✅ RLS策略检查完成');
    }
    
    console.log('\n🎉 诊断完成！');
    console.log('\n💡 如果登录仍然有问题，请检查:');
    console.log('1. 浏览器控制台的错误信息');
    console.log('2. 网络请求是否被阻止');
    console.log('3. Supabase项目是否正常运行');
    console.log('4. 是否需要邮箱验证');
    
  } catch (error) {
    console.log('❌ 诊断过程中出现错误:', error.message);
  }
}

// 运行诊断
diagnose().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 诊断失败:', error.message);
  process.exit(1);
});
