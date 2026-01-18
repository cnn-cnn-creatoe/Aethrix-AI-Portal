/**
 * PROMPT 工坊 - 交互逻辑
 * 独立服务版本
 */

(function () {
    'use strict';

    // 状态管理
    const state = {
        categories: [],
        tools: []
    };

    // ========================================================================
    // 工具: 图标初始化
    // ========================================================================
    function initIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            setTimeout(initIcons, 100);
        }
    }

    // ========================================================================
    // 工具: Toast 提示
    // ========================================================================
    function showToast(message, type = 'info', duration = 2500) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        // 移除旧的 toasts (可选: 如果希望堆叠则不移除)
        // container.innerHTML = '';

        const toast = document.createElement('div');
        toast.className = 'toast';

        const iconName = type === 'success' ? 'check-circle' :
            type === 'error' ? 'alert-circle' : 'info';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        if (typeof lucide !== 'undefined') lucide.createIcons();

        // 动画入场
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });

        // 自动销毁
        setTimeout(() => {
            toast.style.transform = 'translateY(20px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ========================================================================
    // 功能: 模态框管理
    // ========================================================================
    const modal = {
        el: document.getElementById('template-modal'),
        title: document.querySelector('.modal-title'),
        icon: document.querySelector('.modal-icon i'),
        body: document.getElementById('template-list-container'),
        closeBtn: document.querySelector('.modal-close'),

        init() {
            if (!this.el) return;

            // 关闭事件
            this.closeBtn?.addEventListener('click', () => this.close());
            this.el.addEventListener('click', (e) => {
                if (e.target === this.el) this.close();
            });

            // ESC 关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.el.classList.contains('active')) {
                    this.close();
                }
            });
        },

        open(categoryData) {
            if (!this.el) return;

            this.title.textContent = categoryData.name;
            // 更新图标 (可选)
            // this.icon.setAttribute('data-lucide', categoryData.icon);
            // lucide.createIcons();

            this.el.classList.add('active');
            document.body.style.overflow = 'hidden'; // 禁止背景滚动
        },

        close() {
            if (!this.el) return;

            this.el.classList.remove('active');
            document.body.style.overflow = '';
        },

        renderTemplates(templates) {
            if (!this.body) return;

            if (templates.length === 0) {
                this.body.innerHTML = `
                    <div style="text-align: center; color: var(--text-muted); padding: 40px;">
                        <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                        <p>该分类下暂无模板</p>
                    </div>
                `;
            } else {
                this.body.innerHTML = templates.map(t => `
                    <div class="template-card">
                        <div class="template-header">
                            <h4 class="template-title">${t.title}</h4>
                            <div class="template-actions">
                                <button class="btn-copy" onclick="copyToClipboard(this, \`${t.content.replace(/`/g, '\\`').replace(/"/g, '&quot;')}\`)">
                                    <i data-lucide="copy"></i>
                                    复制
                                </button>
                            </div>
                        </div>
                        <p class="template-desc">${t.description}</p>
                        <div class="template-content-box">${t.content}</div>
                        <div class="template-tags">
                            ${t.tags.map(tag => `<span class="template-tag">#${tag}</span>`).join('')}
                        </div>
                    </div>
                `).join('');
            }

            initIcons();
        }
    };

    // 全局复制函数
    window.copyToClipboard = function (btn, content) {
        navigator.clipboard.writeText(content).then(() => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="check"></i> 已复制`;
            btn.classList.add('success');

            showToast('提示词已复制到剪贴板', 'success');
            initIcons();

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('success');
                initIcons();
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败，请重试', 'error');
        });
    };

    // ========================================================================
    // 逻辑: 加载数据
    // ========================================================================
    async function loadTemplates(categoryId) {
        showToast('正在加载模板...', 'info', 1000);

        try {
            const response = await fetch(`/api/templates?category=${categoryId}`);
            const data = await response.json();

            if (data.success) {
                // 查找分类信息用于显示标题
                const category = state.categories.find(c => c.id === categoryId) || { name: '模板列表', icon: 'list' };

                modal.renderTemplates(data.data.templates);
                modal.open(category);
            } else {
                showToast('加载失败', 'error');
            }
        } catch (error) {
            console.error('API Error:', error);
            showToast('网络错误，请稍后重试', 'error');
        }
    }

    async function fetchData() {
        try {
            // 获取统计
            const statsRes = await fetch('/api/stats');
            const statsData = await statsRes.json();

            if (statsData.success) {
                const toolsStat = document.querySelector('.stat-tools .stat-number');
                const templatesStat = document.querySelector('.stat-templates .stat-number');
                if (toolsStat) toolsStat.dataset.target = statsData.data.toolsCount;
                if (templatesStat) templatesStat.dataset.target = statsData.data.templatesCount;
                animateNumbers();
            }

            // 获取分类 (用于缓存名称)
            const catRes = await fetch('/api/categories');
            const catData = await catRes.json();
            if (catData.success) {
                state.categories = catData.data.categories;

                // 更新分类卡片上的数量
                updateCategoryCounts();
            }

        } catch (error) {
            console.warn('初始化数据加载失败', error);
        }
    }

    function updateCategoryCounts() {
        if (!state.categories.length) return;

        document.querySelectorAll('.category-card').forEach(card => {
            const catId = card.dataset.category;
            const catData = state.categories.find(c => c.id === catId);
            if (catData) {
                const badge = card.querySelector('.cat-badge');
                if (badge) badge.textContent = catData.count;
            }
        });
    }

    // ========================================================================
    // 交互绑定
    // ========================================================================
    function initInteractions() {
        // 工具链接跳转
        document.querySelectorAll('.bento-tool, .bento-tool-large, .bento-community').forEach(card => {
            if (card.dataset.url) {
                card.addEventListener('click', () => window.open(card.dataset.url, '_blank'));
            }
        });

        // 更多工具链接
        // (a标签自带跳转，无需JS)

        // 分类点击 -> 打开模态框
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const catId = card.dataset.category;
                loadTemplates(catId);
            });
        });

        // Bento 中的分类快捷入口
        document.querySelectorAll('.bento-category').forEach(card => {
            card.addEventListener('click', () => {
                const catId = card.dataset.category;
                loadTemplates(catId);
            });
        });

        // 功能占位符
        document.querySelectorAll('.bento-feature').forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.feature-title')?.textContent;
                showToast(`"${title}" 功能即将上线`, 'info');
            });
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // 筛选标签功能
        initFilterTabs();
    }

    function initFilterTabs() {
        const tabs = document.querySelectorAll('.filter-tab');
        const toolCards = document.querySelectorAll('.tool-card-premium');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 更新激活状态
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                // 筛选卡片
                toolCards.forEach(card => {
                    const pricing = card.dataset.pricing;
                    if (filter === 'all' || pricing === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ========================================================================
    // 动画效果
    // ========================================================================
    function animateNumbers() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target) || 0;
            if (target === 0) {
                el.textContent = '0';
                return;
            }

            let current = 0;
            const increment = Math.ceil(target / 30);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = current;
            }, 30);
        });
    }

    function initCardAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50); // 错落动画
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.bento-card, .category-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    // ========================================================================
    // 初始化入口
    // ========================================================================
    function init() {
        console.log('🚀 Prompt Workshop Init');
        modal.init();
        initIcons();
        initInteractions();
        fetchData(); // 异步加载数据

        // 延迟开启动画，避免阻塞首屏
        setTimeout(initCardAnimations, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
