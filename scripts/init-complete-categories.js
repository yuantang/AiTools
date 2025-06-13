// AI工具导航 - 完整分类体系初始化脚本
// 包含50个精确定义的AI工具分类
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

// 50个AI工具分类的完整定义
const completeCategories = [
  // 核心内容创作类 (15个)
  {
    name: 'AI写作',
    slug: 'ai-writing',
    description: '智能写作助手，包括文章创作、文案生成、内容优化、语法检查等功能，帮助用户提升写作效率和质量',
    icon: '✍️',
    color: 'bg-blue-500',
    popularity_score: 95,
    trending: true
  },
  {
    name: '图像生成',
    slug: 'image-generation',
    description: 'AI图像创作工具，支持文本到图像、图像编辑、艺术风格转换、logo设计等功能，满足各种视觉创作需求',
    icon: '🎨',
    color: 'bg-purple-500',
    popularity_score: 92,
    trending: true
  },
  {
    name: '视频编辑',
    slug: 'video-editing',
    description: 'AI视频处理工具，包括视频生成、剪辑、特效添加、字幕生成、背景替换等功能，简化视频制作流程',
    icon: '🎬',
    color: 'bg-red-500',
    popularity_score: 88,
    trending: true
  },
  {
    name: '音频处理',
    slug: 'audio-processing',
    description: '音频AI工具，涵盖语音合成、音乐生成、音频编辑、降噪处理、语音转文字等功能',
    icon: '🎵',
    color: 'bg-yellow-500',
    popularity_score: 82,
    trending: false
  },
  {
    name: '代码编程',
    slug: 'coding',
    description: 'AI编程助手，提供代码生成、调试、优化、文档编写、代码审查等功能，提升开发效率',
    icon: '💻',
    color: 'bg-green-500',
    popularity_score: 90,
    trending: true
  },
  {
    name: '设计助手',
    slug: 'design-assistant',
    description: 'AI设计工具，包括UI/UX设计、平面设计、品牌设计、原型制作等功能，辅助设计师创作',
    icon: '🎯',
    color: 'bg-pink-500',
    popularity_score: 85,
    trending: true
  },
  {
    name: '内容创作',
    slug: 'content-creation',
    description: '综合内容创作平台，整合文字、图像、视频等多媒体内容生成功能，一站式创作解决方案',
    icon: '📝',
    color: 'bg-indigo-500',
    popularity_score: 87,
    trending: true
  },
  {
    name: '翻译工具',
    slug: 'translation',
    description: 'AI翻译服务，支持多语言实时翻译、文档翻译、语音翻译、本地化等功能',
    icon: '🌐',
    color: 'bg-cyan-500',
    popularity_score: 80,
    trending: false
  },
  {
    name: '语音识别',
    slug: 'speech-recognition',
    description: '语音AI技术，包括语音转文字、语音命令识别、多语言语音处理等功能',
    icon: '🎤',
    color: 'bg-orange-500',
    popularity_score: 78,
    trending: false
  },
  {
    name: '文本分析',
    slug: 'text-analysis',
    description: '文本智能分析工具，提供情感分析、关键词提取、文本分类、内容审核等功能',
    icon: '📊',
    color: 'bg-teal-500',
    popularity_score: 75,
    trending: false
  },
  {
    name: '图像识别',
    slug: 'image-recognition',
    description: '图像AI识别技术，包括物体识别、人脸识别、文字识别OCR、图像分类等功能',
    icon: '👁️',
    color: 'bg-gray-500',
    popularity_score: 77,
    trending: false
  },
  {
    name: '3D建模',
    slug: '3d-modeling',
    description: 'AI辅助3D建模工具，支持3D模型生成、纹理创建、动画制作等功能',
    icon: '🧊',
    color: 'bg-violet-500',
    popularity_score: 70,
    trending: false
  },
  {
    name: '数字人',
    slug: 'digital-human',
    description: 'AI数字人技术，包括虚拟主播、数字分身、AI客服形象等应用',
    icon: '🤖',
    color: 'bg-emerald-500',
    popularity_score: 72,
    trending: true
  },
  {
    name: '动画制作',
    slug: 'animation',
    description: 'AI动画生成工具，支持2D/3D动画创作、角色动画、特效制作等功能',
    icon: '🎭',
    color: 'bg-rose-500',
    popularity_score: 68,
    trending: false
  },
  {
    name: '演示文稿',
    slug: 'presentation',
    description: 'AI演示文稿制作工具，自动生成PPT、优化排版、内容建议等功能',
    icon: '📊',
    color: 'bg-amber-500',
    popularity_score: 65,
    trending: false
  },

  // 商业应用类 (15个)
  {
    name: '营销工具',
    slug: 'marketing',
    description: '数字营销AI工具，包括广告优化、内容营销、社交媒体管理、用户画像分析等功能',
    icon: '📈',
    color: 'bg-blue-600',
    popularity_score: 86,
    trending: true
  },
  {
    name: '客服机器人',
    slug: 'chatbot',
    description: 'AI客服系统，提供智能问答、多轮对话、情感识别、工单处理等客户服务功能',
    icon: '🤖',
    color: 'bg-green-600',
    popularity_score: 83,
    trending: true
  },
  {
    name: '电商零售',
    slug: 'ecommerce',
    description: '电商AI解决方案，包括商品推荐、价格优化、库存管理、用户行为分析等功能',
    icon: '🛒',
    color: 'bg-purple-600',
    popularity_score: 81,
    trending: true
  },
  {
    name: '金融科技',
    slug: 'fintech',
    description: '金融AI应用，涵盖风险评估、投资分析、智能投顾、反欺诈检测等功能',
    icon: '💰',
    color: 'bg-yellow-600',
    popularity_score: 79,
    trending: true
  },
  {
    name: '数据分析',
    slug: 'data-analysis',
    description: '数据智能分析平台，提供数据挖掘、预测分析、可视化报表、商业智能等功能',
    icon: '📊',
    color: 'bg-red-600',
    popularity_score: 84,
    trending: true
  },
  {
    name: 'CRM工具',
    slug: 'crm',
    description: '客户关系管理AI工具，包括客户画像、销售预测、自动化营销、客户服务等功能',
    icon: '👥',
    color: 'bg-indigo-600',
    popularity_score: 76,
    trending: false
  },
  {
    name: '人力资源',
    slug: 'hr',
    description: 'HR AI解决方案，涵盖简历筛选、人才匹配、绩效分析、员工培训等功能',
    icon: '👔',
    color: 'bg-pink-600',
    popularity_score: 73,
    trending: false
  },
  {
    name: '项目管理',
    slug: 'project-management',
    description: 'AI项目管理工具，提供任务分配、进度跟踪、风险预警、资源优化等功能',
    icon: '📋',
    color: 'bg-cyan-600',
    popularity_score: 71,
    trending: false
  },
  {
    name: '供应链',
    slug: 'supply-chain',
    description: '供应链AI优化工具，包括需求预测、库存优化、物流规划、供应商管理等功能',
    icon: '🚚',
    color: 'bg-orange-600',
    popularity_score: 69,
    trending: false
  },
  {
    name: '法律助手',
    slug: 'legal',
    description: '法律AI工具，提供合同审查、法律咨询、案例分析、文书生成等功能',
    icon: '⚖️',
    color: 'bg-gray-600',
    popularity_score: 67,
    trending: false
  },
  {
    name: '会计财务',
    slug: 'accounting',
    description: '财务AI助手，包括自动记账、发票识别、财务分析、税务计算等功能',
    icon: '💼',
    color: 'bg-teal-600',
    popularity_score: 66,
    trending: false
  },
  {
    name: '销售助手',
    slug: 'sales',
    description: '销售AI工具，提供销售预测、客户挖掘、话术优化、成交分析等功能',
    icon: '💼',
    color: 'bg-emerald-600',
    popularity_score: 74,
    trending: false
  },
  {
    name: '商业智能',
    slug: 'business-intelligence',
    description: 'BI商业智能平台，提供数据整合、分析建模、决策支持、趋势预测等功能',
    icon: '🧠',
    color: 'bg-violet-600',
    popularity_score: 72,
    trending: false
  },
  {
    name: '风险管理',
    slug: 'risk-management',
    description: '风险管理AI系统，包括风险识别、评估、监控、预警等功能',
    icon: '🛡️',
    color: 'bg-red-700',
    popularity_score: 68,
    trending: false
  },
  {
    name: '质量控制',
    slug: 'quality-control',
    description: '质量管理AI工具，提供缺陷检测、质量预测、流程优化等功能',
    icon: '✅',
    color: 'bg-green-700',
    popularity_score: 64,
    trending: false
  },

  // 专业领域类 (10个)
  {
    name: '医疗健康',
    slug: 'healthcare',
    description: '医疗AI应用，包括疾病诊断、药物发现、健康监测、医学影像分析等功能',
    icon: '🏥',
    color: 'bg-red-500',
    popularity_score: 85,
    trending: true
  },
  {
    name: '教育培训',
    slug: 'education',
    description: '教育AI工具，提供个性化学习、智能辅导、课程推荐、学习评估等功能',
    icon: '🎓',
    color: 'bg-blue-700',
    popularity_score: 82,
    trending: true
  },
  {
    name: '科学研究',
    slug: 'research',
    description: '科研AI助手，包括文献分析、实验设计、数据建模、论文写作等功能',
    icon: '🔬',
    color: 'bg-purple-700',
    popularity_score: 76,
    trending: false
  },
  {
    name: '农业科技',
    slug: 'agriculture',
    description: '农业AI应用，涵盖作物监测、病虫害识别、产量预测、精准农业等功能',
    icon: '🌾',
    color: 'bg-green-800',
    popularity_score: 63,
    trending: false
  },
  {
    name: '环境监测',
    slug: 'environment',
    description: '环境AI监测工具，包括空气质量分析、气候预测、污染检测等功能',
    icon: '🌍',
    color: 'bg-emerald-700',
    popularity_score: 61,
    trending: false
  },
  {
    name: '能源管理',
    slug: 'energy',
    description: '能源AI优化系统，提供能耗分析、智能调度、可再生能源管理等功能',
    icon: '⚡',
    color: 'bg-yellow-700',
    popularity_score: 65,
    trending: false
  },
  {
    name: '交通运输',
    slug: 'transportation',
    description: '交通AI解决方案，包括路线优化、自动驾驶、交通预测、物流配送等功能',
    icon: '🚗',
    color: 'bg-gray-700',
    popularity_score: 70,
    trending: true
  },
  {
    name: '安全监控',
    slug: 'security',
    description: '安全AI系统，提供视频监控、异常检测、身份验证、威胁分析等功能',
    icon: '🔒',
    color: 'bg-red-800',
    popularity_score: 74,
    trending: true
  },
  {
    name: '房地产',
    slug: 'real-estate',
    description: '房地产AI工具，包括房价预测、物业管理、客户匹配、市场分析等功能',
    icon: '🏠',
    color: 'bg-orange-700',
    popularity_score: 62,
    trending: false
  },
  {
    name: '体育健身',
    slug: 'sports',
    description: '体育AI应用，提供运动分析、健身指导、比赛预测、训练优化等功能',
    icon: '⚽',
    color: 'bg-indigo-700',
    popularity_score: 60,
    trending: false
  },

  // 技术工具类 (10个)
  {
    name: 'API工具',
    slug: 'api-tools',
    description: 'API开发和管理工具，包括接口测试、文档生成、监控分析、版本管理等功能',
    icon: '🔌',
    color: 'bg-cyan-700',
    popularity_score: 77,
    trending: false
  },
  {
    name: '自动化工具',
    slug: 'automation',
    description: '流程自动化AI工具，提供工作流设计、任务调度、RPA机器人等功能',
    icon: '⚙️',
    color: 'bg-gray-800',
    popularity_score: 78,
    trending: true
  },
  {
    name: '测试工具',
    slug: 'testing',
    description: '软件测试AI工具，包括自动化测试、缺陷检测、性能测试、代码审查等功能',
    icon: '🧪',
    color: 'bg-purple-800',
    popularity_score: 71,
    trending: false
  },
  {
    name: '监控运维',
    slug: 'monitoring',
    description: '系统监控AI工具，提供性能监控、故障预警、日志分析、容量规划等功能',
    icon: '📡',
    color: 'bg-blue-800',
    popularity_score: 73,
    trending: false
  },
  {
    name: '数据库工具',
    slug: 'database',
    description: '数据库AI助手，包括查询优化、数据建模、备份恢复、性能调优等功能',
    icon: '🗄️',
    color: 'bg-green-900',
    popularity_score: 69,
    trending: false
  },
  {
    name: '云计算',
    slug: 'cloud-computing',
    description: '云计算AI服务，提供资源调度、成本优化、安全管理、迁移规划等功能',
    icon: '☁️',
    color: 'bg-sky-600',
    popularity_score: 75,
    trending: true
  },
  {
    name: '网络安全',
    slug: 'cybersecurity',
    description: '网络安全AI工具，包括威胁检测、漏洞扫描、入侵防护、安全分析等功能',
    icon: '🛡️',
    color: 'bg-red-900',
    popularity_score: 80,
    trending: true
  },
  {
    name: '区块链',
    slug: 'blockchain',
    description: '区块链AI应用，涵盖智能合约、DeFi分析、NFT创作、加密货币等功能',
    icon: '⛓️',
    color: 'bg-yellow-800',
    popularity_score: 58,
    trending: false
  },
  {
    name: 'IoT物联网',
    slug: 'iot',
    description: '物联网AI解决方案，包括设备管理、数据采集、边缘计算、预测维护等功能',
    icon: '📱',
    color: 'bg-teal-800',
    popularity_score: 64,
    trending: false
  },
  {
    name: '机器人',
    slug: 'robotics',
    description: '机器人AI技术，提供机器人控制、路径规划、视觉导航、人机交互等功能',
    icon: '🤖',
    color: 'bg-indigo-800',
    popularity_score: 66,
    trending: true
  },

  // 效率工具类 (10个)
  {
    name: '办公助手',
    slug: 'office',
    description: 'AI办公自动化工具，包括文档处理、邮件管理、日程安排、会议记录等功能',
    icon: '📋',
    color: 'bg-orange-500',
    popularity_score: 79,
    trending: false
  },
  {
    name: '搜索引擎',
    slug: 'search',
    description: '智能搜索AI工具，提供语义搜索、知识图谱、问答系统、信息检索等功能',
    icon: '🔍',
    color: 'bg-blue-900',
    popularity_score: 81,
    trending: true
  },
  {
    name: '效率工具',
    slug: 'productivity',
    description: '生产力AI工具，包括时间管理、任务规划、习惯养成、专注力提升等功能',
    icon: '⚡',
    color: 'bg-yellow-900',
    popularity_score: 76,
    trending: false
  },
  {
    name: '笔记工具',
    slug: 'note-taking',
    description: '智能笔记AI工具，提供自动整理、知识关联、内容总结、思维导图等功能',
    icon: '📝',
    color: 'bg-purple-900',
    popularity_score: 72,
    trending: false
  },
  {
    name: '邮件工具',
    slug: 'email',
    description: '邮件AI助手，包括智能回复、邮件分类、垃圾邮件过滤、营销邮件等功能',
    icon: '📧',
    color: 'bg-red-700',
    popularity_score: 68,
    trending: false
  },
  {
    name: '日程管理',
    slug: 'calendar',
    description: '智能日程AI工具，提供会议安排、时间优化、提醒通知、冲突检测等功能',
    icon: '📅',
    color: 'bg-green-700',
    popularity_score: 67,
    trending: false
  },
  {
    name: '文件管理',
    slug: 'file-management',
    description: '文件管理AI工具，包括自动分类、重复检测、内容索引、智能搜索等功能',
    icon: '📁',
    color: 'bg-gray-900',
    popularity_score: 65,
    trending: false
  },
  {
    name: '密码管理',
    slug: 'password-manager',
    description: '密码安全AI工具，提供密码生成、安全检测、自动填充、多设备同步等功能',
    icon: '🔐',
    color: 'bg-indigo-900',
    popularity_score: 63,
    trending: false
  },
  {
    name: '浏览器工具',
    slug: 'browser-tools',
    description: '浏览器AI扩展，包括网页总结、广告拦截、隐私保护、书签管理等功能',
    icon: '🌐',
    color: 'bg-cyan-800',
    popularity_score: 70,
    trending: false
  },
  {
    name: '通讯工具',
    slug: 'communication',
    description: '通讯AI工具，提供智能客服、语音助手、视频会议、团队协作等功能',
    icon: '💬',
    color: 'bg-pink-700',
    popularity_score: 74,
    trending: false
  }
];

async function initCompleteCategories() {
  console.log('🚀 开始初始化完整分类体系...\n');
  console.log(`📂 准备创建 ${completeCategories.length} 个分类\n`);

  try {
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const category of completeCategories) {
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
        errorCount++;
      } else {
        console.log(`✅ 分类 ${category.name} (${category.slug}) 创建成功`);
        successCount++;
      }
    }

    console.log('\n📊 分类创建统计:');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`⚠️ 跳过: ${skipCount} 个`);
    console.log(`❌ 失败: ${errorCount} 个`);
    console.log(`📂 总计: ${completeCategories.length} 个分类`);

    // 显示分类分布统计
    console.log('\n🏷️ 分类热度分布:');
    const trendingCategories = completeCategories.filter(c => c.trending);
    console.log(`🔥 热门分类: ${trendingCategories.length} 个`);
    console.log(`📈 平均热度: ${Math.round(completeCategories.reduce((sum, c) => sum + c.popularity_score, 0) / completeCategories.length)}`);

    console.log('\n🎉 完整分类体系初始化完成！');
    console.log('\n🌐 现在可以访问以下页面测试分类功能:');
    console.log('- 工具库: http://192.168.1.63:3001/tools');
    console.log('- 分类页面: http://192.168.1.63:3001/categories');

  } catch (error) {
    console.log('\n❌ 初始化失败:', error.message);
  }
}

// 运行初始化
initCompleteCategories().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 脚本执行失败:', error.message);
  process.exit(1);
});
