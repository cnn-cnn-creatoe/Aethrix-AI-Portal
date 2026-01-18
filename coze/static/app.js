// Coze 工作流应用 - Neubrutalism 风格

class CozeWorkflowApp {
  constructor() {
    this.state = {
      workflows: [],
      filteredWorkflows: [],
      currentPage: 1,
      perPage: 20,
      searchQuery: '',
      selectedCategory: 'all',
      categories: new Set(),
      isLoading: false
    };
    
    this.elements = {};
    this.searchDebounceTimer = null;
    this.currentWorkflow = null;
  }

  init() {
    this.cacheElements();
    this.setupEventListeners();
    this.loadWorkflows();
  }

  cacheElements() {
    const ids = [
      'searchInput', 'randomBtn', 'categoryPills', 'resultsText',
      'workflowGrid', 'loadMoreContainer', 'loadMoreBtn',
      'loadingState', 'errorState', 'noResultsState', 'errorMessage', 'retryBtn',
      'totalCount', 'sourceCount', 'categoryCount', 'officialCount',
      'workflowModal', 'modalTitle', 'modalClose', 'modalDescription',
      'modalInfo', 'downloadBtn', 'officialBtn'
    ];
    
    ids.forEach(id => {
      this.elements[id] = document.getElementById(id);
    });
  }

  setupEventListeners() {
    this.elements.searchInput.addEventListener('input', (e) => {
      this.state.searchQuery = e.target.value.toLowerCase();
      this.debounceSearch();
    });

    this.elements.randomBtn.addEventListener('click', () => this.showRandomWorkflow());
    this.elements.loadMoreBtn.addEventListener('click', () => this.loadMore());
    this.elements.retryBtn.addEventListener('click', () => this.loadWorkflows());
    
    this.elements.modalClose.addEventListener('click', () => this.closeModal());
    this.elements.workflowModal.addEventListener('click', (e) => {
      if (e.target === this.elements.workflowModal) this.closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  debounceSearch() {
    clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.filterWorkflows();
    }, 300);
  }

  async loadWorkflows() {
    this.showState('loading');
    this.state.isLoading = true;

    try {
      // 模拟加载数据 - 实际应该从 API 获取
      const response = await this.fetchWorkflows();
      this.state.workflows = response;
      
      // 提取分类
      this.state.workflows.forEach(w => {
        if (w.category) this.state.categories.add(w.category);
      });
      
      this.updateStats();
      this.renderCategories();
      this.filterWorkflows();
      
    } catch (error) {
      this.showError('加载失败: ' + error.message);
    }
    
    this.state.isLoading = false;
  }

  async fetchWorkflows() {
    try {
      const response = await fetch('/api/workflows?per_page=1000');
      if (!response.ok) throw new Error('网络请求失败');
      const data = await response.json();
      return data.workflows || [];
    } catch (error) {
      console.error('获取工作流失败:', error);
      throw error;
    }
  }

  updateStats() {
    const total = this.state.workflows.length;
    const official = this.state.workflows.filter(w => w.source === 'official').length;
    const categories = this.state.categories.size;
    
    this.elements.totalCount.textContent = total;
    this.elements.officialCount.textContent = official;
    this.elements.categoryCount.textContent = categories;
  }

  renderCategories() {
    const categories = ['all', ...Array.from(this.state.categories)];
    
    let html = '';
    categories.forEach(cat => {
      const count = cat === 'all' 
        ? this.state.workflows.length 
        : this.state.workflows.filter(w => w.category === cat).length;
      
      const isActive = cat === this.state.selectedCategory ? 'active' : '';
      const displayName = cat === 'all' ? '全部' : cat;
      
      html += `
        <button class="category-pill ${isActive}" data-category="${cat}">
          ${displayName}
          <span class="count">${count}</span>
        </button>
      `;
    });
    
    this.elements.categoryPills.innerHTML = html;
    
    // 添加事件监听
    this.elements.categoryPills.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        this.state.selectedCategory = pill.dataset.category;
        this.filterWorkflows();
        
        // 更新激活状态
        this.elements.categoryPills.querySelectorAll('.category-pill').forEach(p => {
          p.classList.remove('active');
        });
        pill.classList.add('active');
      });
    });
  }

  filterWorkflows() {
    let filtered = this.state.workflows;
    
    // 按分类筛选
    if (this.state.selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category === this.state.selectedCategory);
    }
    
    // 按搜索词筛选
    if (this.state.searchQuery) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(this.state.searchQuery) ||
        w.description.toLowerCase().includes(this.state.searchQuery) ||
        w.tags.some(t => t.toLowerCase().includes(this.state.searchQuery))
      );
    }
    
    this.state.filteredWorkflows = filtered;
    this.state.currentPage = 1;
    this.renderWorkflows();
  }

  renderWorkflows() {
    const start = 0;
    const end = this.state.currentPage * this.state.perPage;
    const workflows = this.state.filteredWorkflows.slice(start, end);
    
    if (workflows.length === 0) {
      this.showState('no-results');
      return;
    }
    
    this.showState('content');
    
    // 更新结果文本
    const catName = this.state.selectedCategory === 'all' ? '全部' : this.state.selectedCategory;
    this.elements.resultsText.textContent = 
      `找到 ${this.state.filteredWorkflows.length} 个工作流 · 分类: ${catName}`;
    
    // 渲染卡片
    this.elements.workflowGrid.innerHTML = workflows.map(w => this.createCard(w)).join('');
    
    // 添加点击事件
    this.elements.workflowGrid.querySelectorAll('.workflow-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        this.openDetail(workflows[i]);
      });
    });
    
    // 显示/隐藏加载更多按钮
    const hasMore = end < this.state.filteredWorkflows.length;
    this.elements.loadMoreContainer.classList.toggle('hidden', !hasMore);
  }

  createCard(workflow) {
    const sourceLabel = workflow.source === 'official' ? '官方' : '社区';
    const sourceBadge = workflow.source === 'official' ? 'badge-source' : '';
    
    return `
      <div class="workflow-card" data-id="${workflow.id}">
        <div class="card-header">
          <div class="card-badges">
            <span class="badge ${sourceBadge}">${sourceLabel}</span>
            <span class="badge">${workflow.category}</span>
          </div>
        </div>
        <h3 class="card-title">${this.escapeHtml(workflow.name)}</h3>
        <p class="card-description">${this.escapeHtml(workflow.description)}</p>
        <div class="card-footer">
          <div class="card-tags">
            ${workflow.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  loadMore() {
    this.state.currentPage++;
    this.renderWorkflows();
  }

  showRandomWorkflow() {
    if (this.state.workflows.length === 0) return;
    
    const random = this.state.workflows[Math.floor(Math.random() * this.state.workflows.length)];
    this.openDetail(random);
  }

  openDetail(workflow) {
    this.currentWorkflow = workflow;
    
    this.elements.modalTitle.textContent = workflow.name;
    this.elements.modalDescription.textContent = workflow.description;
    
    // 信息
    const sourceLabel = workflow.source === 'official' ? '官方模板' : '社区贡献';
    this.elements.modalInfo.innerHTML = `
      <p><strong>分类:</strong> ${workflow.category}</p>
      <p><strong>来源:</strong> ${sourceLabel}</p>
      <p><strong>标签:</strong> ${workflow.tags.join(', ')}</p>
    `;
    
    // 按钮
    this.elements.downloadBtn.href = workflow.url;
    this.elements.officialBtn.href = workflow.url;
    
    if (workflow.source === 'community') {
      this.elements.officialBtn.style.display = 'none';
    } else {
      this.elements.officialBtn.style.display = 'inline-flex';
    }
    
    this.elements.workflowModal.classList.remove('hidden');
  }

  closeModal() {
    this.elements.workflowModal.classList.add('hidden');
    this.currentWorkflow = null;
  }

  showState(state) {
    this.elements.loadingState.classList.add('hidden');
    this.elements.errorState.classList.add('hidden');
    this.elements.noResultsState.classList.add('hidden');
    this.elements.workflowGrid.classList.add('hidden');
    
    switch(state) {
      case 'loading':
        this.elements.loadingState.classList.remove('hidden');
        break;
      case 'error':
        this.elements.errorState.classList.remove('hidden');
        break;
      case 'no-results':
        this.elements.noResultsState.classList.remove('hidden');
        break;
      case 'content':
        this.elements.workflowGrid.classList.remove('hidden');
        break;
    }
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.showState('error');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const app = new CozeWorkflowApp();
  app.init();
});
