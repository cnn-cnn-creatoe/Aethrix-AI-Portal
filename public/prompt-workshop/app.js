/**
 * PROMPT 工坊 - 交互逻辑
 * Bento 风格页面脚本
 */

(function () {
    'use strict';

    // ========================================================================
    // 工具卡片点击跳转
    // ========================================================================
    function initToolCardClicks() {
        const toolCards = document.querySelectorAll('.bento-tool, .bento-tool-large, .bento-community');

        toolCards.forEach(card => {
            const url = card.dataset.url;
            if (url) {
                card.addEventListener('click', () => {
                    window.open(url, '_blank', 'noopener,noreferrer');
                });
            }
        });
    }

    // ========================================================================
    // 分类卡片点击
    // ========================================================================
    function initCategoryClicks() {
        const categoryCards = document.querySelectorAll('.category-card');

        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('.cat-name')?.textContent;
                showToast(`"${categoryName}" 模板即将上线，敬请期待！`);
            });
        });

        // Bento 中的分类卡片
        const bentoCategories = document.querySelectorAll('.bento-category');
        bentoCategories.forEach(card => {
            card.addEventListener('click', () => {
                const categoryName = card.querySelector('.cat-title')?.textContent;
                showToast(`"${categoryName}" 模板即将上线，敬请期待！`);
            });
        });
    }

    // ========================================================================
    // 功能卡片点击
    // ========================================================================
    function initFeatureClicks() {
        const featureCards = document.querySelectorAll('.bento-feature');

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const featureName = card.querySelector('.feature-title')?.textContent;
                showToast(`"${featureName}" 功能开发中，敬请期待！`);
            });
        });
    }

    // ========================================================================
    // Toast 提示
    // ========================================================================
    function showToast(message, duration = 2500) {
        // 移除已有的 toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的 toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <span class="toast-icon">💡</span>
            <span class="toast-message">${message}</span>
        `;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #2D3436;
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-size: 0.95rem;
            font-weight: 500;
            opacity: 0;
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // 显示动画
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(-50%) translateY(0)';
            toast.style.opacity = '1';
        });

        // 自动隐藏
        setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ========================================================================
    // 数字动画
    // ========================================================================
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');

        statNumbers.forEach(el => {
            const text = el.textContent;
            const match = text.match(/(\d+)/);
            if (match) {
                const target = parseInt(match[1]);
                const suffix = text.replace(/\d+/, '');
                let current = 0;
                const increment = Math.ceil(target / 30);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = current + suffix;
                }, 30);
            }
        });
    }

    // ========================================================================
    // 平滑滚动
    // ========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================================================
    // 卡片入场动画
    // ========================================================================
    function initCardAnimations() {
        const cards = document.querySelectorAll('.bento-card, .category-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    // ========================================================================
    // 初始化
    // ========================================================================
    function init() {
        initToolCardClicks();
        initCategoryClicks();
        initFeatureClicks();
        initSmoothScroll();

        // 延迟执行动画效果
        setTimeout(() => {
            animateNumbers();
            initCardAnimations();
        }, 100);

        console.log('✅ PROMPT 工坊已加载');
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
