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

const categories = [
  {
    name: 'AI写作',
    slug: 'ai-writing',
    description: '文本生成、内容创作、写作助手等AI工具',
    icon: '✍️',
    color: 'bg-blue-500',
    popularity_score: 95,
    trending: true,
    is_active: true,
    tags: ['文本生成', '内容创作', '写作助手', 'SEO优化'],
    featured_tools: []
  },
  {
    name: '图像生成',
    slug: 'image-generation',
    description: 'AI绘画、图像创作、照片编辑等视觉AI工具',
    icon: '🎨',
    color: 'bg-purple-500',
    popularity_score: 92,
    trending: true,
    is_active: true,
    tags: ['AI绘画', '图像生成', '艺术创作', '照片编辑'],
    featured_tools: []
  },
  {
    name: '代码编程',
    slug: 'coding',
    description: 'AI编程助手，代码生成、调试、优化',
    icon: '💻',
    color: 'bg-green-500',
    popularity_score: 85,
    trending: true,
    is_active: true,
    tags: ['代码生成', '编程助手', '调试', '代码优化'],
    featured_tools: []
  },
  {
    name: '音频处理',
    slug: 'audio',
    description: 'AI音频生成、编辑、转换工具',
    icon: '🎵',
    color: 'bg-yellow-500',
    popularity_score: 75,
    trending: false,
    is_active: true,
    tags: ['音频生成', '音频编辑', '语音合成', '音乐创作'],
    featured_tools: []
  },
  {
    name: '视频编辑',
    slug: 'video',
    description: 'AI视频生成、剪辑、特效工具',
    icon: '🎬',
    color: 'bg-red-500',
    popularity_score: 80,
    trending: true,
    is_active: true,
    tags: ['视频生成', '视频剪辑', '特效制作', '动画创作'],
    featured_tools: []
  }
]

async function seedCategories() {
  try {
    console.log('正在插入分类数据...')

    // 清除现有分类
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // 删除所有

    if (deleteError) {
      console.error('清除现有分类失败:', deleteError)
    }

    // 插入新分类
    const { data, error } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (error) {
      console.error('插入分类失败:', error)
      return
    }

    console.log('分类数据插入成功!')
    console.log(`插入了 ${data.length} 个分类:`)
    data.forEach(category => {
      console.log(`- ${category.name} (${category.slug})`)
    })

  } catch (error) {
    console.error('插入分类数据时发生错误:', error)
  }
}

seedCategories()
