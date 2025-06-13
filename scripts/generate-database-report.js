// AI工具导航 - 数据库统计报告生成脚本
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ 环境变量配置不完整');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateDatabaseReport() {
  console.log('📊 AI工具导航数据库统计报告');
  console.log('=' .repeat(50));
  console.log(`生成时间: ${new Date().toLocaleString('zh-CN')}\n`);

  try {
    // 1. 分类统计
    console.log('📂 分类统计');
    console.log('-'.repeat(30));
    
    const { data: categories, count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('popularity_score', { ascending: false });

    console.log(`总分类数: ${totalCategories}`);
    
    const trendingCategories = categories.filter(c => c.trending);
    console.log(`热门分类: ${trendingCategories.length}`);
    
    const avgPopularity = Math.round(
      categories.reduce((sum, c) => sum + c.popularity_score, 0) / categories.length
    );
    console.log(`平均热度: ${avgPopularity}`);

    // 显示前10个热门分类
    console.log('\n🔥 热门分类 TOP 10:');
    categories.slice(0, 10).forEach((cat, index) => {
      const trending = cat.trending ? '🔥' : '  ';
      console.log(`${index + 1}.${trending} ${cat.name} (${cat.slug}) - 热度: ${cat.popularity_score}, 工具数: ${cat.tool_count}`);
    });

    // 2. 工具统计
    console.log('\n🛠️ 工具统计');
    console.log('-'.repeat(30));
    
    const { data: tools, count: totalTools } = await supabase
      .from('tools')
      .select('*, category:categories(name)', { count: 'exact' })
      .eq('status', 'active');

    console.log(`总工具数: ${totalTools}`);
    
    const featuredTools = tools.filter(t => t.featured);
    console.log(`精选工具: ${featuredTools.length}`);
    
    const verifiedTools = tools.filter(t => t.verified);
    console.log(`已验证工具: ${verifiedTools.length}`);

    const freeTools = tools.filter(t => t.pricing && (t.pricing.includes('免费') || t.pricing.includes('Free')));
    console.log(`免费工具: ${freeTools.length}`);

    const apiTools = tools.filter(t => t.api_available);
    console.log(`提供API: ${apiTools.length}`);

    const openSourceTools = tools.filter(t => t.open_source);
    console.log(`开源工具: ${openSourceTools.length}`);

    // 平均评分
    const avgRating = (tools.reduce((sum, t) => sum + (t.rating || 0), 0) / tools.length).toFixed(1);
    console.log(`平均评分: ${avgRating}`);

    // 总浏览量
    const totalViews = tools.reduce((sum, t) => sum + (t.view_count || 0), 0);
    console.log(`总浏览量: ${totalViews.toLocaleString()}`);

    // 总收藏数
    const totalFavorites = tools.reduce((sum, t) => sum + (t.favorite_count || 0), 0);
    console.log(`总收藏数: ${totalFavorites.toLocaleString()}`);

    // 3. 分类分布统计
    console.log('\n📊 分类工具分布');
    console.log('-'.repeat(30));
    
    const categoryStats = {};
    tools.forEach(tool => {
      const categoryName = tool.category?.name || '未分类';
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = {
          count: 0,
          featured: 0,
          avgRating: 0,
          totalViews: 0
        };
      }
      categoryStats[categoryName].count++;
      if (tool.featured) categoryStats[categoryName].featured++;
      categoryStats[categoryName].avgRating += tool.rating || 0;
      categoryStats[categoryName].totalViews += tool.view_count || 0;
    });

    // 计算平均评分
    Object.keys(categoryStats).forEach(cat => {
      categoryStats[cat].avgRating = (categoryStats[cat].avgRating / categoryStats[cat].count).toFixed(1);
    });

    // 按工具数量排序
    const sortedCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 15); // 显示前15个

    sortedCategories.forEach(([name, stats], index) => {
      console.log(`${index + 1}. ${name}: ${stats.count}个工具, 精选:${stats.featured}, 评分:${stats.avgRating}, 浏览:${stats.totalViews.toLocaleString()}`);
    });

    // 4. 质量指标
    console.log('\n⭐ 质量指标');
    console.log('-'.repeat(30));
    
    const highRatedTools = tools.filter(t => t.rating >= 4.5);
    console.log(`高评分工具(≥4.5): ${highRatedTools.length}`);
    
    const popularTools = tools.filter(t => t.view_count >= 50000);
    console.log(`热门工具(≥5万浏览): ${popularTools.length}`);
    
    const wellDocumentedTools = tools.filter(t => t.description && t.description.length >= 100);
    console.log(`详细描述工具(≥100字): ${wellDocumentedTools.length}`);

    // 5. 技术特性统计
    console.log('\n🔧 技术特性统计');
    console.log('-'.repeat(30));
    
    // 平台支持统计
    const platformStats = {};
    tools.forEach(tool => {
      if (tool.platforms) {
        tool.platforms.forEach(platform => {
          platformStats[platform] = (platformStats[platform] || 0) + 1;
        });
      }
    });

    console.log('平台支持分布:');
    Object.entries(platformStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([platform, count]) => {
        console.log(`  ${platform}: ${count}个工具`);
      });

    // 语言支持统计
    const languageStats = {};
    tools.forEach(tool => {
      if (tool.languages) {
        tool.languages.forEach(lang => {
          languageStats[lang] = (languageStats[lang] || 0) + 1;
        });
      }
    });

    console.log('\n语言支持分布:');
    Object.entries(languageStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([lang, count]) => {
        console.log(`  ${lang}: ${count}个工具`);
      });

    // 6. 数据完整性检查
    console.log('\n🔍 数据完整性检查');
    console.log('-'.repeat(30));
    
    const missingLogo = tools.filter(t => !t.logo_url || t.logo_url.includes('placeholder')).length;
    console.log(`缺少Logo: ${missingLogo}个工具`);
    
    const missingWebsite = tools.filter(t => !t.website).length;
    console.log(`缺少网站: ${missingWebsite}个工具`);
    
    const missingDescription = tools.filter(t => !t.description || t.description.length < 50).length;
    console.log(`描述不足: ${missingDescription}个工具`);
    
    const missingTags = tools.filter(t => !t.tags || t.tags.length === 0).length;
    console.log(`缺少标签: ${missingTags}个工具`);

    const missingFeatures = tools.filter(t => !t.features || t.features.length === 0).length;
    console.log(`缺少功能: ${missingFeatures}个工具`);

    // 7. 推荐改进建议
    console.log('\n💡 改进建议');
    console.log('-'.repeat(30));
    
    const emptyCategories = categories.filter(c => c.tool_count === 0);
    if (emptyCategories.length > 0) {
      console.log(`📂 空分类需要添加工具: ${emptyCategories.length}个`);
      emptyCategories.slice(0, 5).forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug})`);
      });
    }

    const lowRatedTools = tools.filter(t => t.rating < 4.0);
    if (lowRatedTools.length > 0) {
      console.log(`⭐ 低评分工具需要审查: ${lowRatedTools.length}个`);
    }

    if (missingLogo > 0) {
      console.log(`🖼️ 建议为${missingLogo}个工具添加Logo`);
    }

    if (missingDescription > 0) {
      console.log(`📝 建议完善${missingDescription}个工具的描述`);
    }

    // 8. 总结
    console.log('\n📋 数据库健康度总结');
    console.log('-'.repeat(30));
    
    const completenessScore = Math.round(
      ((totalTools - missingLogo) / totalTools * 20) +
      ((totalTools - missingWebsite) / totalTools * 20) +
      ((totalTools - missingDescription) / totalTools * 20) +
      ((totalTools - missingTags) / totalTools * 20) +
      ((totalTools - missingFeatures) / totalTools * 20)
    );
    
    console.log(`数据完整度: ${completenessScore}/100`);
    console.log(`分类覆盖度: ${Math.round((totalCategories - emptyCategories.length) / totalCategories * 100)}%`);
    console.log(`工具质量度: ${Math.round(verifiedTools.length / totalTools * 100)}%`);

    console.log('\n🎉 报告生成完成！');
    console.log(`\n📅 下次建议更新时间: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')}`);

  } catch (error) {
    console.log('\n❌ 报告生成失败:', error.message);
  }
}

// 运行报告生成
generateDatabaseReport().then(() => {
  process.exit(0);
}).catch(error => {
  console.log('❌ 脚本执行失败:', error.message);
  process.exit(1);
});
