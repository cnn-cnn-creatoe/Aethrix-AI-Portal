/**
 * AI Skill 页面 - JavaScript 交互逻辑
 */

// API 配置
const API_BASE_URL = 'http://localhost:4005/api';

// 应用状态
const state = {
  skills: [],
  categories: [],
  platforms: [],
  currentPage: 1,
  totalPages: 1,
  currentSkill: null,
  filters: {
    category: null,
    platform: [],
    languages: [],
    sort: 'latest',
    q: null
  },
  loading: false
};

// Global Copy Functions (Chinese and English)
window.copySystemPromptZH = function (skillId) {
  const skill = state.skills.find(s => s.id === skillId);
  if (!skill || !skill.systemPromptZH) {
    showToast('❌ 未找到中文提示词', 'error');
    return;
  }

  navigator.clipboard.writeText(skill.systemPromptZH).then(() => {
    showToast('📋 中文提示词已复制！');
  }).catch(err => {
    console.error('复制失败:', err);
    showToast('❌ 复制失败，请重试');
  });
};

window.copySystemPromptEN = function (skillId) {
  const skill = state.skills.find(s => s.id === skillId);
  if (!skill || !skill.systemPromptEN) {
    showToast('❌ English prompt not found', 'error');
    return;
  }

  navigator.clipboard.writeText(skill.systemPromptEN).then(() => {
    showToast('📋 English prompt copied!');
  }).catch(err => {
    console.error('Copy failed:', err);
    showToast('❌ Copy failed, please retry');
  });
};

// DOM 元素
const elements = {
  skillGrid: document.getElementById('skill-grid'),
  loadingState: document.getElementById('loading-state'),
  errorState: document.getElementById('error-state'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  sortSelect: document.getElementById('sort-select'),
  resultsText: document.getElementById('results-text'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  loadMoreWrapper: document.getElementById('load-more-wrapper'),
  randomBtn: document.getElementById('random-btn'),
  animationToggle: document.getElementById('animation-toggle'),
  retryBtn: document.getElementById('retry-btn'),
  clearFiltersBtn: document.getElementById('clear-filters-btn')
};

// 初始化应用
async function init() {
  console.log('🚀 初始化 AI Skill 页面...');

  // 加载统计数据
  await loadStats();

  // 加载分类
  await loadCategories();

  // 加载平台
  await loadPlatforms();

  // 加载 Skills
  await loadSkills();

  // 绑定事件
  bindEvents();

  // 加载动画设置
  loadAnimationSettings();

  console.log('✅ 初始化完成');
}

// 加载统计数据
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    if (data.success) {
      const skillsCount = data.data.skills_count || 0;
      document.querySelectorAll('.stat-value-skills').forEach(el => animateCount(el, skillsCount));

      // 更新"全部"按钮的 count
      const countAllElement = document.getElementById('count-all');
      if (countAllElement) {
        countAllElement.textContent = skillsCount;
      }
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
}

// 数字计数动画
function animateCount(element, target, duration = 1000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// 加载分类
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();

    if (data.success) {
      state.categories = data.data.categories;
      renderCategories();

      // 更新统计
      document.querySelectorAll('.stat-value-categories').forEach(el => animateCount(el, data.data.categories.length));
    }
  } catch (error) {
    console.error('加载分类失败:', error);
  }
}

// 渲染分类按钮
function renderCategories() {
  const container = document.querySelector('.category-pills');

  // 为静态的"全部"按钮添加点击事件
  const allButton = container.querySelector('[data-category="all"]');
  if (allButton && !allButton.hasAttribute('data-bound')) {
    allButton.addEventListener('click', () => filterByCategory('all'));
    allButton.setAttribute('data-bound', 'true');
  }

  state.categories.forEach(cat => {
    const pill = document.createElement('button');
    pill.className = 'category-pill';
    pill.dataset.category = cat.id;
    pill.innerHTML = `${cat.name} <span class="count">${cat.count}</span>`;
    pill.addEventListener('click', () => filterByCategory(cat.id));
    container.appendChild(pill);
  });
}

// 加载平台
async function loadPlatforms() {
  try {
    const response = await fetch(`${API_BASE_URL}/platforms`);
    const data = await response.json();

    if (data.success) {
      state.platforms = data.data.platforms;
      renderPlatforms();

      // 更新统计
      document.querySelectorAll('.stat-value-platforms').forEach(el => animateCount(el, data.data.platforms.length));
    }
  } catch (error) {
    console.error('加载平台失败:', error);
  }
}

// 渲染平台按钮
function renderPlatforms() {
  const container = document.querySelector('.platform-pills');

  state.platforms.forEach(plat => {
    const pill = document.createElement('button');
    pill.className = 'platform-pill';
    pill.dataset.platform = plat.id;
    pill.textContent = plat.name;
    pill.addEventListener('click', () => togglePlatform(plat.id));
    container.appendChild(pill);
  });
}

// Helper to format description text
function formatDescription(text) {
  if (!text) return '';
  // Escape HTML first to prevent XSS (basic)
  let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Bold: **text** -> <strong>text</strong>
  safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Newlines: \n -> <br>
  safeText = safeText.replace(/\n/g, '<br>');

  // Bullet points: - text -> &bull; text (optional, or just handle via newline)
  // Let's just handle newlines for lists.

  return safeText;
}

// 加载 Skills
async function loadSkills(append = false) {
  if (state.loading) return;

  state.loading = true;
  showLoading();

  try {
    const params = new URLSearchParams({
      page: state.currentPage,
      per_page: 20,
      sort: state.filters.sort
    });

    if (state.filters.category) params.append('category', state.filters.category);
    if (state.filters.platform.length) params.append('platform', state.filters.platform.join(','));
    if (state.filters.q) params.append('q', state.filters.q);

    const response = await fetch(`${API_BASE_URL}/skills?${params}`);
    const data = await response.json();

    if (data.success) {
      if (append) {
        state.skills = [...state.skills, ...data.data.skills];
      } else {
        state.skills = data.data.skills;
      }

      state.totalPages = data.data.pagination.total_pages;

      renderSkills(append);
      updateResultsText(data.data.pagination.total);
      updateLoadMoreButton(data.data.pagination.has_next);

      hideLoading();

      if (state.skills.length === 0) {
        showEmpty();
      }
    }
  } catch (error) {
    console.error('加载 Skills 失败:', error);
    showError('无法加载 Skills 数据，请稍后重试');
  } finally {
    state.loading = false;
  }
}

// 渲染 Skills
function renderSkills(append = false) {
  if (!append) {
    elements.skillGrid.innerHTML = '';
  }

  state.skills.forEach(skill => {
    const card = createSkillCard(skill);
    elements.skillGrid.appendChild(card);
  });
}

// 创建 Skill 卡片
function createSkillCard(skill) {
  const card = document.createElement('div');
  card.className = 'skill-card';
  // 优先使用 skill 的个人图标，否则使用分类图标
  const skillIcon = skill.icon || getCategoryIcon(skill.category);
  card.innerHTML = `
    <div class="card-badges">
      ${skill.featured ? '<span class="badge badge-featured">精选</span>' : ''}
      <span class="badge badge-category">${getCategoryName(skill.category)}</span>
    </div>
    <h3 class="card-title">${skill.name}</h3>
    <p class="card-description">${skill.description}</p>
    <div class="card-tags">
      ${skill.languages.slice(0, 3).map(lang => `<span class="tag">${lang}</span>`).join('')}
      ${skill.languages.length > 3 ? `<span class="tag">+${skill.languages.length - 3}</span>` : ''}
    </div>
      <div class="platforms">
        <span>${skill.platforms.slice(0, 2).map(p => p.toLowerCase()).join(', ')}</span>
      </div>
      <div class="stats">
      </div>

    </div>
  `;

  card.addEventListener('click', () => showSkillModal(skill));

  // Initialize 3D Tilt Effect
  initTilt(card);

  return card;
}

// 3D Tilt Effect Initialization
function initTilt(card) {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (max 8 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    // Check if user has reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  });
}

function getCategoryName(categoryId) {
  if (categoryId === 'repositories') return '官方仓库';
  const cat = state.categories.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

// 翻译难度等级
function translateComplexity(complexity) {
  const translations = {
    'beginner': '入门',
    'intermediate': '中级',
    'advanced': '高级'
  };
  return translations[complexity.toLowerCase()] || complexity;
}

// 获取分类图标
function getCategoryIcon(categoryId) {
  const icons = {
    'frontend': '🎨',      // 艺术调色板
    'backend': '⚡',       // 闪电
    'mobile': '📲',        // 手机振动
    'ai-ml': '🧠',         // 大脑
    'devops': '🔧',        // 扳手
    'testing': '🧪',       // 试管
    'tools': '✨',         // 闪闪发光
    'platform-specific': '🎯',  // 靶心
    'repositories': '🏛️'   // 官方仓库
  };
  return icons[categoryId] || '💫';
}

// 显示 Skill 模态框
function showSkillModal(skill) {
  state.currentSkill = skill;
  const modal = document.getElementById('skill-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = skill.name;

  // 优先使用 skill 的个人图标，否则使用分类图标
  const skillIcon = skill.icon || getCategoryIcon(skill.category);

  modalBody.innerHTML = `
    <div class="modal-skill-header">
      <div class="modal-badges">
        ${skill.featured ? '<span class="badge badge-featured">精选</span>' : ''}
        <span class="badge badge-category">${getCategoryName(skill.category)}</span>
        <span class="badge" style="background: var(--neon-purple); color: var(--text-primary);">
          ${translateComplexity(skill.complexity)}
        </span>
      </div>
      
      ${(skill.systemPromptZH || skill.systemPromptEN) ? `
      <div class="copy-prompt-btns">
        ${skill.systemPromptZH ? `<button class="copy-prompt-btn copy-zh" onclick="window.copySystemPromptZH('${skill.id}')">复制中文提示词</button>` : ''}
        ${skill.systemPromptEN ? `<button class="copy-prompt-btn copy-en" onclick="window.copySystemPromptEN('${skill.id}')">Copy English Prompt</button>` : ''}
      </div>
      ` : ''}
    </div>
    
    <div class="modal-section">
      <h3>描述</h3>
      <p style="line-height: 1.6;">${formatDescription(skill.longDescription || skill.description)}</p>
    </div>
    
    <div class="modal-section">
      <h3>标签</h3>
      <div class="card-tags">
        ${skill.languages.map(lang => `<span class="tag">${lang}</span>`).join('')}
      </div>
    </div>
    
    <div class="modal-section">
      <h3>支持平台</h3>
      
      <!-- 直接支持平台 (Base Platforms) -->
      ${(() => {
      const DIRECT_PLATFORMS = ['cursor', 'claude', 'vscode', 'jetbrains'];
      const direct = skill.platforms.filter(p => DIRECT_PLATFORMS.includes(p.toLowerCase()));

      if (direct.length === 0) return '';

      return `
          <div class="platform-group">
            <h4 class="platform-group-title">核心支持</h4>
            <div class="platforms-list">
              ${direct.map(plat => `<span class="platform-badge platform-direct">${plat.toLowerCase()}</span>`).join('')}
            </div>
          </div>
        `;
    })()}

      <!-- 可调整/兼容平台 (Adjustable/Compatible Platforms) -->
      ${(() => {
      const DIRECT_PLATFORMS = ['cursor', 'claude', 'vscode', 'jetbrains'];
      const adjustable = skill.platforms.filter(p => !DIRECT_PLATFORMS.includes(p.toLowerCase()));

      if (adjustable.length === 0) return '';

      return `
          <div class="platform-group">
            <h4 class="platform-group-title">可调整/兼容使用</h4>
            <div class="platforms-list">
              ${adjustable.map(plat => `<span class="platform-badge platform-adjustable">${plat.toLowerCase()}</span>`).join('')}
            </div>
          </div>
        `;
    })()}

      <!-- Fallback if logic misses (shouldn't happen with above logic covering all) -->
      ${skill.platforms.length === 0 ? '<p class="no-data">暂无特定平台限制</p>' : ''}
    </div>
    
    ${skill.sourceRepo ? `
    <div class="modal-section">
      <h3>源代码</h3>
      <p><a href="${skill.sourceRepo}" target="_blank" rel="noopener">${skill.sourceRepo}</a></p>
    </div>
    ` : ''}
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
  const modal = document.getElementById('skill-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  state.currentSkill = null;
}

// 下载 Skill - 跳转到 GitHub 源代码页面
function downloadSkill(skill) {
  // 如果有 sourceRepo 链接，直接跳转
  if (skill.sourceRepo) {
    window.open(skill.sourceRepo, '_blank');
    showToast('正在跳转到 GitHub...', 'success');
    return;
  }

  // 如果没有 sourceRepo，尝试 API 下载
  showToast('该 Skill 暂无下载链接', 'warning');
}

// 分享 Skill
function shareSkill(skill) {
  const url = `${window.location.origin}${window.location.pathname}?skill=${skill.id}`;

  if (navigator.share) {
    navigator.share({
      title: skill.name,
      text: skill.description,
      url: url
    }).then(() => {
      showToast('分享成功！', 'success');
    }).catch((error) => {
      if (error.name !== 'AbortError') {
        copyToClipboard(url);
      }
    });
  } else {
    copyToClipboard(url);
  }
}

// 复制到剪贴板
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('链接已复制到剪贴板！', 'success');
    }).catch(() => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

// 备用复制方法
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showToast('链接已复制到剪贴板！', 'success');
  } catch (err) {
    showToast('复制失败，请手动复制', 'error');
  }

  document.body.removeChild(textArea);
}

// 格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return '今天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}

// 显示骨架屏
function showSkeletonLoading() {
  elements.skillGrid.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-icon"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton-tags">
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-tag"></div>
        <div class="skeleton skeleton-tag"></div>
      </div>
    `;
    elements.skillGrid.appendChild(skeleton);
  }
  elements.skillGrid.style.display = 'grid';
}

// 状态显示函数
function showLoading() {
  if (state.currentPage === 1) {
    showSkeletonLoading();
  }
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.emptyState.style.display = 'none';
}

function hideLoading() {
  elements.loadingState.style.display = 'none';
  elements.skillGrid.style.display = 'grid';
}

function showError(message) {
  elements.errorState.style.display = 'block';
  elements.loadingState.style.display = 'none';
  elements.emptyState.style.display = 'none';
  elements.skillGrid.style.display = 'none';
  document.getElementById('error-message').textContent = message;
}

function showEmpty() {
  elements.emptyState.style.display = 'block';
  elements.loadingState.style.display = 'none';
  elements.errorState.style.display = 'none';
  elements.skillGrid.style.display = 'none';
}

// 更新结果文本
function updateResultsText(total) {
  const categoryText = state.filters.category ? ` · ${getCategoryName(state.filters.category)}` : '';
  elements.resultsText.textContent = `共 ${total} 个 Skills${categoryText}`;
}

// 更新加载更多按钮
function updateLoadMoreButton(hasNext) {
  elements.loadMoreWrapper.style.display = hasNext ? 'block' : 'none';
}

// 筛选函数
function filterByCategory(categoryId) {
  // 如果点击的是当前激活的分类，不做任何事
  const currentCategory = state.filters.category;
  const newCategory = categoryId === 'all' ? null : categoryId;

  // 如果点击的是已激活的分类，直接返回
  if (currentCategory === newCategory) return;

  state.filters.category = newCategory;
  state.currentPage = 1;

  // 更新按钮状态
  document.querySelectorAll('.category-pill').forEach(pill => {
    const pillCategory = pill.dataset.category;
    // 如果选择"全部"（categoryId === 'all'），则激活 data-category="all" 的按钮
    // 否则激活对应分类的按钮
    if (categoryId === 'all') {
      pill.classList.toggle('active', pillCategory === 'all');
    } else {
      pill.classList.toggle('active', pillCategory === categoryId);
    }
  });

  loadSkills();
}

function togglePlatform(platformId) {
  const index = state.filters.platform.indexOf(platformId);
  if (index > -1) {
    state.filters.platform.splice(index, 1);
  } else {
    state.filters.platform.push(platformId);
  }

  state.currentPage = 1;

  // 更新按钮状态
  document.querySelectorAll('.platform-pill').forEach(pill => {
    pill.classList.toggle('active', state.filters.platform.includes(pill.dataset.platform));
  });

  loadSkills();
}

// Toast 通知
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msg = document.getElementById('toast-message');

  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  };

  icon.textContent = icons[type] || icons.info;
  msg.textContent = message;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// 绑定事件
function bindEvents() {
  // 搜索
  let searchTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.filters.q = e.target.value || null;
      state.currentPage = 1;
      loadSkills();
    }, 300);
  });

  // 排序
  elements.sortSelect.addEventListener('change', (e) => {
    state.filters.sort = e.target.value;
    state.currentPage = 1;
    loadSkills();
  });

  // 加载更多
  elements.loadMoreBtn.addEventListener('click', () => {
    state.currentPage++;
    loadSkills(true);
  });

  // 随机探索
  elements.randomBtn.addEventListener('click', () => {
    state.filters.sort = 'random';
    state.currentPage = 1;
    loadSkills();
  });

  // 重试
  elements.retryBtn.addEventListener('click', () => {
    loadSkills();
  });

  // 清除筛选 (两个按钮)
  const clearFilters = () => {
    state.filters = {
      category: null,
      platform: [],
      languages: [],
      sort: 'latest',
      q: null
    };
    state.currentPage = 1;
    elements.searchInput.value = '';
    elements.sortSelect.value = 'latest';

    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.category === 'all');
    });
    document.querySelectorAll('.platform-pill').forEach(pill => {
      pill.classList.remove('active');
    });

    loadSkills();
  };

  elements.clearFiltersBtn.addEventListener('click', clearFilters);
  const clearFiltersInline = document.getElementById('clear-filters-btn-inline');
  if (clearFiltersInline) {
    clearFiltersInline.addEventListener('click', clearFilters);
  }

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    // ESC - 关闭模态框
    if (e.key === 'Escape') {
      const modal = document.getElementById('skill-modal');
      if (modal && modal.style.display !== 'none') {
        closeModal();
      }
    }

    // Ctrl+K 或 Cmd+K - 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
    }

    // Ctrl+/ 或 Cmd+/ - 清除筛选
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      clearFilters();
    }
  });

  // 模态框关闭
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }


}

// 动画开关
function toggleAnimations() {
  const current = document.body.dataset.animations || 'low';
  const levels = ['none', 'low', 'full'];
  const currentIndex = levels.indexOf(current);
  const nextIndex = (currentIndex + 1) % levels.length;
  const next = levels[nextIndex];

  document.body.dataset.animations = next;
  document.documentElement.dataset.animations = next;
  localStorage.setItem('animations', next);

  const texts = {
    none: '无',
    low: '低',
    full: '高'
  };

  // Update button text
  const toggleText = document.querySelector('.toggle-text');
  if (toggleText) {
    toggleText.textContent = `动画: ${texts[next]}`;
  }

  showToast(`动画效果: ${texts[next]}`);
}

// 加载动画设置
function loadAnimationSettings() {
  const saved = localStorage.getItem('animations') || 'low';
  document.body.dataset.animations = saved;
  document.documentElement.dataset.animations = saved;

  const texts = {
    none: '无',
    low: '低',
    full: '高'
  };

  const toggleText = document.querySelector('.toggle-text');
  if (toggleText) {
    toggleText.textContent = `动画: ${texts[saved]}`;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// ============================================================================
// Motion Animation Integration
// ============================================================================

/**
 * Initialize Motion animations based on animation level
 */
function initMotionAnimations() {
  // Wait for Motion to be available
  if (typeof window.motionAnimate === 'undefined') {
    setTimeout(initMotionAnimations, 100);
    return;
  }

  const animationLevel = document.body.dataset.animations || 'low';

  // Skip animations if disabled
  if (animationLevel === 'none') return;

  console.log('🎬 Initializing Motion animations...');

  // Animation configurations based on level
  const config = {
    low: {
      duration: 0.4,
      staggerDelay: 0.05,
      springStiffness: 100,
      springDamping: 15
    },
    full: {
      duration: 0.8,
      staggerDelay: 0.1,
      springStiffness: 200,
      springDamping: 20
    }
  };

  const settings = config[animationLevel] || config.low;

  // 1. Header entrance animation
  animateHeader(settings);

  // 2. Skill cards stagger animation on scroll
  animateSkillCards(settings);

  // 3. Stat cards count-up animation
  animateStatCards(settings);

  // 4. Modal entrance animation
  setupModalAnimations(settings);

  // 5. Button hover effects
  setupButtonHoverEffects(settings);

  console.log('✅ Motion animations initialized');
}

/**
 * Animate header elements on page load
 */
function animateHeader(settings) {
  const { motionAnimate, motionStagger } = window;

  // Logo badge entrance
  motionAnimate('.logo-badge', {
    opacity: [0, 1],
    y: [-20, 0],
    scale: [0.9, 1]
  }, {
    duration: settings.duration,
    easing: 'ease-out'
  });

  // Title entrance with gradient shimmer
  motionAnimate('.title', {
    opacity: [0, 1],
    y: [-30, 0],
    scale: [0.95, 1]
  }, {
    duration: settings.duration * 1.2,
    delay: 0.1,
    easing: 'ease-out'
  });

  // Subtitle and description
  motionAnimate('.subtitle, .description', {
    opacity: [0, 1],
    y: [20, 0]
  }, {
    duration: settings.duration,
    delay: window.motionStagger(settings.staggerDelay, { start: 0.2 }),
    easing: 'ease-out'
  });

  // Stat cards with stagger
  motionAnimate('.stat-card', {
    opacity: [0, 1],
    y: [30, 0],
    scale: [0.9, 1]
  }, {
    duration: settings.duration,
    delay: window.motionStagger(settings.staggerDelay, { start: 0.3 }),
    easing: [0.4, 0, 0.2, 1]
  });
}

/**
 * Animate skill cards as they enter viewport
 */
function animateSkillCards(settings) {
  const { motionInView } = window;

  // Observe skill grid for new cards
  const observer = new MutationObserver(() => {
    const cards = document.querySelectorAll('.skill-card');

    cards.forEach((card, index) => {
      // Skip if already animated
      if (card.dataset.motionAnimated) return;
      card.dataset.motionAnimated = 'true';

      // Animate card entrance
      motionInView(card, (info) => {
        window.motionAnimate(card, {
          opacity: [0, 1],
          y: [40, 0],
          scale: [0.95, 1]
        }, {
          duration: settings.duration,
          delay: (index % 4) * settings.staggerDelay,
          easing: [0.4, 0, 0.2, 1]
        });
      }, {
        amount: 0.2
      });

      // Add hover animation
      card.addEventListener('mouseenter', () => {
        if (document.body.dataset.animations === 'none') return;

        window.motionAnimate(card, {
          y: -8,
          scale: 1.02
        }, {
          duration: 0.3,
          easing: [0.4, 0, 0.2, 1]
        });

        // Animate card icon
        const icon = card.querySelector('.card-icon');
        if (icon) {
          window.motionAnimate(icon, {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }, {
            duration: 0.5,
            easing: 'ease-in-out'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (document.body.dataset.animations === 'none') return;

        window.motionAnimate(card, {
          y: 0,
          scale: 1
        }, {
          duration: 0.3,
          easing: [0.4, 0, 0.2, 1]
        });
      });
    });
  });

  const skillGrid = document.getElementById('skill-grid');
  if (skillGrid) {
    observer.observe(skillGrid, { childList: true });
  }
}

/**
 * Animate stat cards with spring effect
 */
function animateStatCards(settings) {
  const statCards = document.querySelectorAll('.stat-card');

  statCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(card, {
        scale: 1.05,
        y: -4
      }, {
        duration: 0.3,
        easing: [0.4, 0, 0.2, 1]
      });

      // Pulse the stat number
      const statNumber = card.querySelector('.stat-number');
      if (statNumber) {
        window.motionAnimate(statNumber, {
          scale: [1, 1.1, 1]
        }, {
          duration: 0.4,
          easing: 'ease-in-out'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(card, {
        scale: 1,
        y: 0
      }, {
        duration: 0.3,
        easing: [0.4, 0, 0.2, 1]
      });
    });
  });
}

/**
 * Setup modal entrance/exit animations
 */
function setupModalAnimations(settings) {
  const modal = document.getElementById('skill-modal');
  const modalContent = modal?.querySelector('.modal-content');
  const modalOverlay = modal?.querySelector('.modal-overlay');

  if (!modal || !modalContent || !modalOverlay) return;

  // Store original display function
  const originalShowModal = window.showSkillModal;
  const originalCloseModal = window.closeModal;

  // Override showSkillModal to add animation
  window.showSkillModal = function (skill) {
    originalShowModal.call(this, skill);

    if (document.body.dataset.animations === 'none') return;

    // Animate overlay
    window.motionAnimate(modalOverlay, {
      opacity: [0, 1]
    }, {
      duration: settings.duration * 0.8,
      easing: 'ease-out'
    });

    // Animate modal content
    window.motionAnimate(modalContent, {
      opacity: [0, 1],
      scale: [0.9, 1],
      y: [30, 0]
    }, {
      duration: settings.duration,
      easing: [0.4, 0, 0.2, 1]
    });

    // Animate modal sections with stagger
    setTimeout(() => {
      const sections = modalContent.querySelectorAll('.modal-section');
      window.motionAnimate(sections, {
        opacity: [0, 1],
        x: [-20, 0]
      }, {
        duration: settings.duration * 0.8,
        delay: window.motionStagger(settings.staggerDelay),
        easing: 'ease-out'
      });
    }, settings.duration * 500);
  };

  // Override closeModal to add animation
  window.closeModal = function () {
    if (document.body.dataset.animations === 'none') {
      originalCloseModal.call(this);
      return;
    }

    // Animate out
    window.motionAnimate(modalContent, {
      opacity: 0,
      scale: 0.95,
      y: 20
    }, {
      duration: settings.duration * 0.6,
      easing: 'ease-in'
    });

    window.motionAnimate(modalOverlay, {
      opacity: 0
    }, {
      duration: settings.duration * 0.6,
      easing: 'ease-in'
    }).finished.then(() => {
      originalCloseModal.call(this);
    });
  };
}

/**
 * Setup button hover effects
 */
function setupButtonHoverEffects(settings) {
  // Random button
  const randomBtn = document.getElementById('random-btn');
  if (randomBtn) {
    randomBtn.addEventListener('mouseenter', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(randomBtn, {
        scale: 1.05,
        y: -2
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });

    randomBtn.addEventListener('mouseleave', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(randomBtn, {
        scale: 1,
        y: 0
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });

    randomBtn.addEventListener('click', () => {
      if (document.body.dataset.animations === 'none') return;

      // Spin animation on click
      window.motionAnimate(randomBtn, {
        rotate: [0, 360]
      }, {
        duration: 0.6,
        easing: 'ease-in-out'
      });
    });
  }

  // Category pills
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(pill, {
        scale: 1.05,
        y: -2
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });

    pill.addEventListener('mouseleave', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(pill, {
        scale: 1,
        y: 0
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });
  });

  // Platform pills
  const platformPills = document.querySelectorAll('.platform-pill');
  platformPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(pill, {
        scale: 1.05,
        y: -2
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });

    pill.addEventListener('mouseleave', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(pill, {
        scale: 1,
        y: 0
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });
  });

  // Load more button
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('mouseenter', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(loadMoreBtn, {
        scale: 1.05,
        y: -3
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });

    loadMoreBtn.addEventListener('mouseleave', () => {
      if (document.body.dataset.animations === 'none') return;

      window.motionAnimate(loadMoreBtn, {
        scale: 1,
        y: 0
      }, {
        duration: 0.2,
        easing: 'ease-out'
      });
    });
  }
}

/**
 * Re-initialize animations when animation level changes
 */
const originalToggleAnimations = toggleAnimations;
toggleAnimations = function () {
  originalToggleAnimations.call(this);

  // Re-initialize Motion animations with new level
  setTimeout(() => {
    initMotionAnimations();
  }, 100);
};

// Initialize Motion animations after page load
window.addEventListener('load', () => {
  setTimeout(initMotionAnimations, 500);
});

// ============================================================================
// Enhanced Effects - Particles, Scroll Progress, Spotlight Cards
// ============================================================================

/**
 * Initialize Vanta.js NET background
 * 3D 网络连接效果
 */
let vantaEffect = null;

function initVantaNet() {
  if (typeof VANTA === 'undefined' || typeof VANTA.NET === 'undefined') {
    console.warn('Vanta.js NET 库未加载');
    return;
  }

  const container = document.getElementById('particles-js');
  if (!container) {
    console.warn('粒子容器未找到');
    return;
  }

  // 如果已有效果，先销毁
  if (vantaEffect) {
    vantaEffect.destroy();
  }

  try {
    vantaEffect = VANTA.NET({
      el: container,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 400.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0xff69b4,           // 霓虹粉色
      backgroundColor: 0x050614,  // 深色背景
      points: 8.00,              // 网络点数量
      maxDistance: 20.00,        // 连接线最大距离
      spacing: 18.00,            // 点间距
      showDots: true             // 显示点
    });

    console.log('✨ Vanta.js NET 3D 网络背景已加载');
  } catch (err) {
    console.error('Vanta.js 初始化失败:', err);
  }
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  console.log('📊 滚动进度条已启用');
}

/**
 * Spotlight Card Effect - Mouse tracking light
 */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Observe new cards and apply spotlight effect
 */
function observeNewCards() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.classList.contains('skill-card')) {
          // Apply spotlight effect
          node.addEventListener('mousemove', (e) => {
            const rect = node.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            node.style.setProperty('--mouse-x', `${x}px`);
            node.style.setProperty('--mouse-y', `${y}px`);
          });

          // Apply entrance animation
          setTimeout(() => {
            node.classList.add('visible');
          }, 50);
        }
      });
    });
  });

  const skillGrid = document.getElementById('skill-grid');
  if (skillGrid) {
    observer.observe(skillGrid, { childList: true });
  }
}

/**
 * GSAP ScrollTrigger Animations
 */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP 库未加载');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const animationLevel = document.body.dataset.animations || 'low';
  if (animationLevel === 'none') return;

  // Animate elements with data-animate attribute on scroll
  const fadeUpElements = document.querySelectorAll('[data-animate="fade-up"]');
  fadeUpElements.forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Stat cards stagger animation
  const statCards = document.querySelectorAll('.stat-card');
  gsap.fromTo(statCards,
    { opacity: 0, y: 40, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: '.stat-grid',
        start: "top 85%"
      }
    }
  );

  console.log('🎬 GSAP 滚动动画已启用');
}

/**
 * Button Ripple Effect
 */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.random-btn, .load-more-btn, .modal-btn');

  buttons.forEach(btn => {
    btn.classList.add('btn-ripple');

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      btn.style.setProperty('--ripple-x', `${x}px`);
      btn.style.setProperty('--ripple-y', `${y}px`);

      btn.classList.add('rippling');

      setTimeout(() => {
        btn.classList.remove('rippling');
      }, 600);
    });
  });
}

/**
 * Apply visible class to existing cards
 */
function showExistingCards() {
  const cards = document.querySelectorAll('.skill-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 100);
  });
}

/**
 * Initialize all enhanced effects
 */
function initEnhancedEffects() {
  console.log('🚀 初始化增强效果...');

  // Vanta.js NET background
  initVantaNet();

  // Scroll progress bar
  initScrollProgress();

  // Spotlight cards
  observeNewCards();

  // GSAP animations
  initGSAPAnimations();

  // Button ripple effect
  initRippleEffect();

  // Show existing cards
  setTimeout(showExistingCards, 500);

  console.log('✨ 增强效果初始化完成');
}

// Initialize enhanced effects after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initEnhancedEffects, 100);
});
