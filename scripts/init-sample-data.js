// 初始化示例数据脚本
require('dotenv').config({ path: '.env.local' });
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

// 示例分类数据
const sampleCategories = [
  {
    name: 'AI写作',
    slug: 'ai-writing',
    description: '智能写作助手，帮助创作文章、文案、代码等',
    icon: '✍️',
    color: 'bg-blue-500',
    trending: true
  },
  {
    name: '图像生成',
    slug: 'image-generation',
    description: 'AI图像创作工具，生成艺术作品、设计素材等',
    icon: '🎨',
    color: 'bg-purple-500',
    trending: true
  },
  {
    name: 'AI编程',
    slug: 'ai-coding',
    description: '编程助手工具，代码生成、调试、优化等',
    icon: '💻',
    color: 'bg-green-500',
    trending: false
  },
  {
    name: '视频编辑',
    slug: 'video-editing',
    description: 'AI视频处理工具，剪辑、特效、生成等',
    icon: '🎬',
    color: 'bg-red-500',
    trending: false
  },
  {
    name: '音频处理',
    slug: 'audio-processing',
    description: '音频AI工具，语音合成、音乐生成等',
    icon: '🎵',
    color: 'bg-yellow-500',
    trending: false
  },
  {
    name: '办公助手',
    slug: 'office-assistant',
    description: '提升办公效率的AI工具',
    icon: '📊',
    color: 'bg-indigo-500',
    trending: false
  }
];

// 示例工具数据
const sampleTools = [
  {
    name: 'ChatGPT',
    description: 'OpenAI开发的强大对话式AI助手，支持文本生成、问答、编程、创意写作等多种任务。基于GPT架构，能够理解上下文并提供高质量的回答。',
    website: 'https://chat.openai.com',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    category_slug: 'ai-writing',
    pricing: '免费试用',
    tags: ['对话', '文本生成', '编程', '写作助手', '问答'],
    platforms: ['web', 'ios', 'android', 'api'],
    features: ['自然语言对话', '多语言支持', '代码生成与调试', '文档写作', '数据分析', '创意写作'],
    api_available: true,
    open_source: false,
    featured: true,
    verified: true,
    status: 'active',
    developer: 'OpenAI',
    contact_email: 'support@openai.com'
  },
  {
    name: 'Midjourney',
    description: '顶级AI图像生成工具，能够根据文本描述创造令人惊艳的艺术作品和设计。支持多种艺术风格，广泛应用于创意设计、概念艺术等领域。',
    website: 'https://www.midjourney.com',
    logo_url: 'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/midjourney.png',
    category_slug: 'image-generation',
    pricing: '订阅制',
    tags: ['图像生成', '艺术创作', '设计', 'Discord'],
    platforms: ['web', 'discord'],
    features: ['文本到图像', '多种艺术风格', '高分辨率输出', '批量生成', '风格混合'],
    api_available: false,
    open_source: false,
    featured: true,
    verified: true,
    status: 'active',
    developer: 'Midjourney Inc',
    contact_email: 'support@midjourney.com'
  },
  {
    name: 'GitHub Copilot',
    description: 'GitHub和OpenAI合作开发的AI编程助手，提供实时代码建议和自动补全。支持多种编程语言，能够理解代码上下文并生成相关代码片段。',
    website: 'https://github.com/features/copilot',
    logo_url: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
    category_slug: 'ai-coding',
    pricing: '订阅制',
    tags: ['编程助手', '代码生成', '自动补全', 'IDE集成'],
    platforms: ['vscode', 'jetbrains', 'neovim', 'api'],
    features: ['实时代码建议', '多语言支持', 'IDE集成', '上下文理解', '代码解释'],
    api_available: true,
    open_source: false,
    featured: true,
    verified: true,
    status: 'active',
    developer: 'GitHub',
    contact_email: 'copilot@github.com'
  },
  {
    name: 'Stable Diffusion',
    description: '开源的AI图像生成模型，能够根据文本描述生成高质量图像。支持本地部署，拥有活跃的开源社区和丰富的扩展功能。',
    website: 'https://stability.ai/stable-diffusion',
    logo_url: 'https://stability.ai/favicon.ico',
    category_slug: 'image-generation',
    pricing: '免费',
    tags: ['图像生成', '开源', '本地部署', '文本到图像'],
    platforms: ['web', 'windows', 'mac', 'linux', 'api'],
    features: ['开源免费', '本地部署', '高度可定制', '社区扩展', 'API接口'],
    api_available: true,
    open_source: true,
    featured: true,
    verified: true,
    status: 'active',
    developer: 'Stability AI',
    contact_email: 'hello@stability.ai'
  },
  {
    name: 'Claude',
    description: 'Anthropic开发的AI助手，以安全性和有用性为核心设计。擅长分析、写作、数学、编程等任务，具有强大的推理能力。',
    website: 'https://claude.ai',
    logo_url: 'https://claude.ai/favicon.ico',
    category_slug: 'ai-writing',
    pricing: '免费试用',
    tags: ['对话', '分析', '写作', '推理', '安全'],
    platforms: ['web', 'api'],
    features: ['长文本处理', '安全对话', '代码分析', '文档总结', '多语言支持'],
    api_available: true,
    open_source: false,
    featured: true,
    verified: true,
    status: 'active',
    developer: 'Anthropic',
    contact_email: 'support@anthropic.com'
  }
];

async function initSampleData() {
  console.log('🚀 开始初始化示例数据...\n');

  try {
    // 0. 创建管理员用户
    console.log('👤 创建管理员用户...');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .upsert({
        email: 'admin@aitools.com',
        name: '系统管理员',
        role: 'admin',
        status: 'active',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (adminError) {
      console.log('❌ 创建管理员用户失败:', adminError.message);
      return;
    }

    console.log('✅ 管理员用户创建成功:', adminUser.email);

    // 1. 插入分类数据
    console.log('\n📂 插入分类数据...');
    const categoryInserts = [];

    for (const category of sampleCategories) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          ...category,
          is_active: true,
          tool_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'slug'
        })
        .select()
        .single();

      if (error) {
        console.log(`❌ 插入分类 ${category.name} 失败:`, error.message);
      } else {
        console.log(`✅ 分类 ${category.name} 插入成功`);
        categoryInserts.push(data);
      }
    }

    // 2. 插入工具数据
    console.log('\n🛠️ 插入工具数据...');

    for (const tool of sampleTools) {
      // 获取分类ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', tool.category_slug)
        .single();

      if (!category) {
        console.log(`❌ 找不到分类: ${tool.category_slug}`);
        continue;
      }

      // 移除category_slug字段，因为它不在数据库表中
      const { category_slug, ...toolData } = tool;

      // 检查工具是否已存在
      const { data: existingTool } = await supabase
        .from('tools')
        .select('id')
        .eq('website', toolData.website)
        .single();

      if (existingTool) {
        console.log(`⚠️ 工具 ${tool.name} 已存在，跳过`);
        continue;
      }

      const { data, error } = await supabase
        .from('tools')
        .insert({
          ...toolData,
          category_id: category.id,
          submitted_by: adminUser.id,
          rating: 4.5 + Math.random() * 0.5, // 随机评分 4.5-5.0
          total_ratings: Math.floor(Math.random() * 1000) + 100,
          favorite_count: Math.floor(Math.random() * 500) + 50,
          view_count: Math.floor(Math.random() * 10000) + 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.log(`❌ 插入工具 ${tool.name} 失败:`, error.message);
      } else {
        console.log(`✅ 工具 ${tool.name} 插入成功`);
      }
    }

    // 3. 更新分类的工具数量
    console.log('\n📊 更新分类统计...');

    for (const category of categoryInserts) {
      const { count } = await supabase
        .from('tools')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)
        .eq('status', 'active');

      await supabase
        .from('categories')
        .update({ tool_count: count || 0 })
        .eq('id', category.id);

      console.log(`✅ 分类 ${category.name} 工具数量: ${count || 0}`);
    }

    console.log('\n🎉 示例数据初始化完成！');
    console.log('\n📋 数据统计:');
    console.log(`- 分类数量: ${sampleCategories.length}`);
    console.log(`- 工具数量: ${sampleTools.length}`);
    console.log('\n🌐 现在可以访问以下页面:');
    console.log('- 首页: http://192.168.1.63:3001/');
    console.log('- 工具库: http://192.168.1.63:3001/tools');
    console.log('- 分类页面: http://192.168.1.63:3001/categories');
    console.log('- 管理后台: http://192.168.1.63:3001/admin');

  } catch (error) {
    console.log('\n❌ 初始化失败:', error.message);
  }
}

// 运行初始化
initSampleData().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 脚本执行失败:', error.message);
  process.exit(1);
});
