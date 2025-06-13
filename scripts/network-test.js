// 网络连接测试脚本
// 测试AI工具导航网站的网络访问情况

const http = require('http');
const os = require('os');

// 获取本机IP地址
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

// 测试网络连接
function testConnection(host, port, path = '/') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          dataLength: data.length
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runNetworkTest() {
  console.log('🌐 AI工具导航网络连接测试');
  console.log('================================\n');

  const localIP = getLocalIP();
  const port = 3000;

  console.log(`📍 本机IP地址: ${localIP}`);
  console.log(`🔌 服务端口: ${port}`);
  console.log(`🌍 访问地址: http://${localIP}:${port}\n`);

  const testUrls = [
    { path: '/', name: '首页' },
    { path: '/tools', name: '工具页面' },
    { path: '/categories', name: '分类页面' },
    { path: '/api/tools', name: 'API接口' }
  ];

  console.log('🧪 开始连接测试...\n');

  for (const testUrl of testUrls) {
    try {
      console.log(`测试 ${testUrl.name} (${testUrl.path})...`);
      
      const result = await testConnection(localIP, port, testUrl.path);
      
      if (result.status === 200) {
        console.log(`✅ ${testUrl.name}: 连接成功`);
        console.log(`   状态码: ${result.status}`);
        console.log(`   数据大小: ${result.dataLength} bytes`);
      } else {
        console.log(`⚠️ ${testUrl.name}: 状态码 ${result.status}`);
      }
    } catch (error) {
      console.log(`❌ ${testUrl.name}: 连接失败`);
      console.log(`   错误: ${error.message}`);
    }
    console.log('');
  }

  console.log('📱 移动设备访问指南:');
  console.log('--------------------------------');
  console.log('1. 确保移动设备与电脑在同一WiFi网络');
  console.log(`2. 在移动设备浏览器中访问: http://${localIP}:${port}`);
  console.log('3. 如果无法访问，请检查防火墙设置');
  console.log('4. 确保端口3000没有被其他程序占用\n');

  console.log('🔧 故障排除:');
  console.log('--------------------------------');
  console.log('- 检查防火墙是否允许端口3000');
  console.log('- 确认Next.js服务器使用 --hostname 0.0.0.0 启动');
  console.log('- 验证网络连接和路由器设置');
  console.log('- 尝试使用curl命令测试: curl http://' + localIP + ':3000\n');

  console.log('✨ 测试完成！');
}

// 运行测试
runNetworkTest().catch(console.error);
