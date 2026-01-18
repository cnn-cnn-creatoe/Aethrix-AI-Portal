/**
 * 诊断脚本 - 检查 Skill 页面问题
 */

console.log('🔍 开始诊断...');

// 1. 检查 DOM 元素
console.log('\n1. 检查 DOM 元素:');
const elements = {
  skillGrid: document.getElementById('skill-grid'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  sortSelect: document.getElementById('sort-select'),
  resultsText: document.getElementById('results-text')
};

Object.entries(elements).forEach(([name, el]) => {
  console.log(`  ${name}:`, el ? '✅ 存在' : '❌ 不存在');
});

// 2. 检查 API 连接
console.log('\n2. 检查 API 连接:');
const API_BASE_URL = 'http://localhost:4005/api';

async function testAPI() {
  try {
    console.log(`  请求: ${API_BASE_URL}/health`);
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('  ✅ API 连接成功');
    console.log('  Skills 数量:', data.data.skills_count);
    
    // 测试 skills 接口
    console.log(`\n  请求: ${API_BASE_URL}/skills?page=1&per_page=5`);
    const skillsResponse = await fetch(`${API_BASE_URL}/skills?page=1&per_page=5`);
    const skillsData = await skillsResponse.json();
    console.log('  ✅ Skills 接口成功');
    console.log('  返回 Skills:', skillsData.data.skills.length);
    console.log('  第一个 Skill:', skillsData.data.skills[0]?.name);
    
  } catch (error) {
    console.error('  ❌ API 连接失败:', error);
  }
}

// 3. 检查全局变量
console.log('\n3. 检查全局变量:');
console.log('  window.motionAnimate:', typeof window.motionAnimate);
console.log('  window.VANTA:', typeof window.VANTA);
console.log('  window.gsap:', typeof window.gsap);

// 4. 检查 app.js 是否加载
console.log('\n4. 检查函数定义:');
console.log('  init:', typeof init);
console.log('  loadSkills:', typeof loadSkills);
console.log('  renderSkills:', typeof renderSkills);

// 5. 运行 API 测试
console.log('\n5. 运行 API 测试:');
testAPI();

// 6. 检查事件监听器
console.log('\n6. 检查 DOMContentLoaded:');
if (document.readyState === 'loading') {
  console.log('  ⏳ 文档还在加载中...');
} else {
  console.log('  ✅ 文档已加载完成');
  console.log('  readyState:', document.readyState);
}

// 7. 手动触发初始化（如果需要）
console.log('\n7. 尝试手动初始化:');
setTimeout(() => {
  if (typeof init === 'function') {
    console.log('  🚀 手动调用 init()...');
    try {
      init();
      console.log('  ✅ init() 调用成功');
    } catch (error) {
      console.error('  ❌ init() 调用失败:', error);
    }
  } else {
    console.log('  ❌ init 函数未定义');
  }
}, 1000);

console.log('\n✅ 诊断完成，请查看上面的输出');
