// 项目健康检查脚本
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ 环境变量配置不完整');
  console.log('请检查 .env.local 文件中的以下变量:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProjectHealth() {
  console.log('🔍 开始项目健康检查...\n');

  const results = {
    database: false,
    basicTables: false,
    enhancedTables: false,
    sampleData: false
  };

  try {
    // 1. 检查数据库连接
    console.log('📡 检查数据库连接...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      console.log('❌ 数据库连接失败:', connectionError.message);
      return;
    }
    
    console.log('✅ 数据库连接正常');
    results.database = true;

    // 2. 检查基础表
    console.log('\n📋 检查基础表...');
    const basicTables = ['users', 'tools', 'categories'];
    let basicTablesExist = true;

    for (const table of basicTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ 表 ${table} 不存在或无法访问`);
          basicTablesExist = false;
        } else {
          console.log(`✅ 表 ${table} 存在`);
        }
      } catch (err) {
        console.log(`❌ 表 ${table} 检查失败:`, err.message);
        basicTablesExist = false;
      }
    }

    results.basicTables = basicTablesExist;

    // 3. 检查增强功能表
    console.log('\n🚀 检查增强功能表...');
    const enhancedTables = [
      'search_history',
      'popular_searches', 
      'search_suggestions',
      'user_behaviors',
      'tool_similarities',
      'user_recommendations',
      'user_preferences'
    ];
    
    let enhancedTablesCount = 0;

    for (const table of enhancedTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`⚠️ 增强表 ${table} 不存在`);
        } else {
          console.log(`✅ 增强表 ${table} 存在`);
          enhancedTablesCount++;
        }
      } catch (err) {
        console.log(`⚠️ 增强表 ${table} 检查失败`);
      }
    }

    results.enhancedTables = enhancedTablesCount === enhancedTables.length;

    // 4. 检查示例数据
    console.log('\n📊 检查示例数据...');
    try {
      const { data: toolsData } = await supabase
        .from('tools')
        .select('*')
        .limit(5);
      
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (toolsData && toolsData.length > 0) {
        console.log(`✅ 工具数据: ${toolsData.length} 条记录`);
      } else {
        console.log('⚠️ 工具数据为空');
      }

      if (categoriesData && categoriesData.length > 0) {
        console.log(`✅ 分类数据: ${categoriesData.length} 条记录`);
      } else {
        console.log('⚠️ 分类数据为空');
      }

      results.sampleData = (toolsData?.length > 0) && (categoriesData?.length > 0);
    } catch (err) {
      console.log('⚠️ 示例数据检查失败:', err.message);
    }

    // 5. 生成报告
    console.log('\n📋 健康检查报告');
    console.log('='.repeat(50));
    
    console.log(`数据库连接: ${results.database ? '✅ 正常' : '❌ 失败'}`);
    console.log(`基础表结构: ${results.basicTables ? '✅ 完整' : '❌ 缺失'}`);
    console.log(`增强功能表: ${results.enhancedTables ? '✅ 完整' : '⚠️ 部分缺失'}`);
    console.log(`示例数据: ${results.sampleData ? '✅ 存在' : '⚠️ 缺失'}`);

    console.log('\n🎯 功能状态');
    console.log('='.repeat(50));
    
    if (results.database && results.basicTables) {
      console.log('✅ 基础功能: 完全可用');
      console.log('  - 工具浏览和搜索');
      console.log('  - 分类导航');
      console.log('  - 用户注册登录');
    }

    if (results.enhancedTables) {
      console.log('✅ 增强功能: 完全可用');
      console.log('  - 智能搜索建议');
      console.log('  - 个性化推荐');
      console.log('  - 用户行为追踪');
      console.log('  - 搜索历史');
    } else {
      console.log('⚠️ 增强功能: 部分可用');
      console.log('  - 基础搜索和推荐可用');
      console.log('  - 需要创建增强表获得完整功能');
      console.log('  - 请参考 DATABASE_SETUP.md');
    }

    console.log('\n🌐 访问地址');
    console.log('='.repeat(50));
    console.log('🏠 首页: http://localhost:3000');
    console.log('🔍 工具库: http://localhost:3000/tools');
    console.log('🎯 演示页面: http://localhost:3000/demo/search-ai');
    console.log('👤 个人中心: http://localhost:3000/profile');

    if (!results.enhancedTables) {
      console.log('\n📝 下一步操作');
      console.log('='.repeat(50));
      console.log('1. 查看 DATABASE_SETUP.md 获取详细指南');
      console.log('2. 在 Supabase Dashboard 中执行 database/simple-search-migration.sql');
      console.log('3. 重新运行此检查脚本验证安装');
      console.log('4. 享受完整的搜索和推荐功能！');
    }

    console.log('\n🎉 项目健康检查完成！');

  } catch (error) {
    console.log('\n❌ 健康检查失败:', error.message);
  }
}

checkProjectHealth().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 脚本执行失败:', error.message);
  process.exit(1);
});
