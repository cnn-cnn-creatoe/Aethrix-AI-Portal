/**
 * Bureau F Inspired Modern Web Application
 * High-Performance JavaScript Architecture
 * 
 * Features:
 * - Modular ES6+ Architecture
 * - Performance Optimized
 * - Accessibility Focused
 * - Progressive Enhancement
 * - Advanced Animation System (Task 4)
 */

'use strict';

// ===================================
// Core Application Class
// ===================================

class CreativeStudioApp {
  constructor() {
    this.modules = new Map();
    this.isInitialized = false;
    this.observers = new Map();

    // Bind methods
    this.init = this.init.bind(this);
    this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);
    this.handleLoad = this.handleLoad.bind(this);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    } else {
      this.handleDOMContentLoaded();
    }

    // Initialize when page is fully loaded
    if (document.readyState === 'complete') {
      this.handleLoad();
    } else {
      window.addEventListener('load', this.handleLoad);
    }
  }

  handleDOMContentLoaded() {
    this.init();
  }

  handleLoad() {
    this.initLazyLoading();
    // Initialize scroll animations after page load for better performance
    this.initScrollAnimations();
    // Trigger page load animations
    this.triggerPageLoadAnimations();
  }

  init() {
    if (this.isInitialized) return;

    try {
      // Initialize core modules
      this.initNavigation();
      this.initSideNavigation(); // New: Side navigation for tools page
      this.initPortfolioFilter();
      this.initSmoothScroll();
      this.initFormHandlers();
      this.initPerformanceOptimizations();
      this.initPageLoadAnimations(); // Task 4.1: Page load animations
      this.initCustomCursor(); // Custom cursor with trail effect

      this.isInitialized = true;
      console.log('✅ Creative Studio App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    }
  }

  // ===================================
  // Task 4.1: Page Load Animations
  // CSS fadeInUp 动画 + 交错动画延迟
  // Requirements: 1.1, 1.8
  // ===================================

  initPageLoadAnimations() {
    const pageLoadAnimations = new PageLoadAnimationModule();
    this.modules.set('pageLoadAnimations', pageLoadAnimations);
  }

  // ===================================
  // Custom Cursor Module
  // 鼠标拖尾延迟效果
  // ===================================

  initCustomCursor() {
    // Only initialize on desktop with fine pointer (mouse)
    if (window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const cursorModule = new CustomCursorModule();
    this.modules.set('customCursor', cursorModule);
  }

  triggerPageLoadAnimations() {
    const pageLoadModule = this.modules.get('pageLoadAnimations');
    if (pageLoadModule) {
      pageLoadModule.triggerAnimations();
    }
  }

  // ===================================
  // Side Navigation Module (Tools Page)
  // Task 4.3: Navigation Interaction Animations
  // Requirements: 1.3, 1.4
  // ===================================

  initSideNavigation() {
    const sideNav = document.querySelector('.side-nav');
    if (sideNav) {
      const sideNavModule = new SideNavigationModule();
      this.modules.set('sideNavigation', sideNavModule);
    }
  }

  // ===================================
  // Navigation Module
  // ===================================

  initNavigation() {
    const nav = new NavigationModule();
    this.modules.set('navigation', nav);
  }

  // ===================================
  // Portfolio Filter Module
  // ===================================

  initPortfolioFilter() {
    const portfolioSection = document.querySelector('.portfolio-section');
    if (portfolioSection) {
      const filter = new PortfolioFilter();
      this.modules.set('portfolioFilter', filter);
    }
  }

  // ===================================
  // Smooth Scroll Module
  // ===================================

  initSmoothScroll() {
    const smoothScroll = new SmoothScrollModule();
    this.modules.set('smoothScroll', smoothScroll);
  }

  // ===================================
  // Form Handlers
  // ===================================

  initFormHandlers() {
    const forms = new FormModule();
    this.modules.set('forms', forms);
  }

  // ===================================
  // Task 5.2: Enhanced Lazy Loading
  // 使用 loading="lazy" 属性 + 占位符和加载状态
  // Requirements: 3.3
  // ===================================

  initLazyLoading() {
    const lazyLoadModule = new LazyLoadModule();
    this.modules.set('lazyLoad', lazyLoadModule);
  }

  // ===================================
  // Task 4.2: Scroll Triggered Animations
  // Intersection Observer API
  // Requirements: 1.2, 1.7
  // ===================================

  initScrollAnimations() {
    const scrollAnimationModule = new ScrollAnimationModule();
    this.modules.set('scrollAnimations', scrollAnimationModule);
  }

  // ===================================
  // Performance Optimizations
  // ===================================

  initPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Initialize service worker if available
    this.initServiceWorker();

    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }

  preloadCriticalResources() {
    // 字体已通过 Google Fonts CDN 加载，无需预加载本地字体
    // 如果将来需要预加载其他资源，可以在这里添加
    const criticalResources = [];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('❌ Service Worker registration failed:', error);
        });
    }
  }

  optimizeScrollPerformance() {
    let ticking = false;

    const updateScrollPosition = () => {
      const scrolled = window.pageYOffset;

      // Update header background - always keep it opaque
      const header = document.querySelector('.site-header');
      if (header) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        if (isDark) {
          // Dark mode: always use solid dark background
          header.style.backgroundColor = '#0f172a';
        } else {
          // Light mode: always use solid white background
          header.style.backgroundColor = '#ffffff';
        }

        // Add scrolled class for any additional styling
        if (scrolled > 10) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // ===================================
  // Cleanup
  // ===================================

  destroy() {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    // Clean up modules
    this.modules.forEach(module => {
      if (module.destroy) module.destroy();
    });
    this.modules.clear();

    this.isInitialized = false;
  }
}

// ===================================
// Navigation Module
// ===================================

class NavigationModule {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.isMenuOpen = false;
    this.lastScrollY = window.pageYOffset;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initScrollBehavior();
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }

    // Close menu when clicking nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.toggleMobileMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.header.contains(e.target)) {
        this.toggleMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.toggleMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Update ARIA attributes
    this.navToggle.setAttribute('aria-expanded', this.isMenuOpen);

    // Toggle classes
    document.body.classList.toggle('nav-open', this.isMenuOpen);
    this.navMenu.classList.toggle('active', this.isMenuOpen);

    // Animate hamburger
    this.animateHamburger();

    // Manage focus
    if (this.isMenuOpen) {
      this.navMenu.focus();
    } else {
      this.navToggle.focus();
    }
  }

  animateHamburger() {
    const lines = this.navToggle.querySelectorAll('.nav-toggle-line');
    lines.forEach((line, index) => {
      if (this.isMenuOpen) {
        line.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
          index === 1 ? 'opacity(0)' :
            'rotate(-45deg) translate(7px, -6px)';
      } else {
        line.style.transform = '';
      }
    });
  }

  initScrollBehavior() {
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.pageYOffset;

      // Hide/show header based on scroll direction
      if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }

      this.lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }
}

// ===================================
// Hero Animation Configuration
// 首页标题动画配置 - 白天/夜晚模式
// Requirements: 8.1, 8.2, 8.4
// ===================================

const HeroAnimationConfig = {
  // 白天模式配置
  light: {
    background: '#f8fafc', // 极浅灰蓝
    title: {
      color: '#1e3a5f', // 深海军蓝
      fontFamily: "'Inter', sans-serif",
      fontSize: '4rem',
      fontSizeMobile: '2rem',
      fontSizeTablet: '3rem',
      animationDuration: 1500, // ms
      floatDistance: 30, // px
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    subtitle: {
      color: '#64748b', // 中灰色
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.25rem',
      fontSizeMobile: '1rem',
      fontWeight: 300,
      animationDelay: 1000, // ms
      animationDuration: 1000, // ms
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    buttons: {
      animationDelay: 2000, // ms
      animationDuration: 800, // ms
      bounceIntensity: 0.3,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // bounce
    },
    particles: {
      count: 50,
      countMobile: 25,
      colors: ['#87ceeb', '#ffffff', '#b0e0e6', '#e0f2fe'], // 天蓝、白、粉蓝
      speed: 0.5,
      size: { min: 2, max: 6 },
      opacity: { min: 0.3, max: 0.7 },
      direction: 'up', // 向上飘浮
      blur: 0,
      glow: false,
    },
    totalDuration: 8000, // 8秒循环
  },

  // 夜晚模式配置
  dark: {
    background: '#0a0f1a', // 深海军黑
    title: {
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      fontSize: '4rem',
      fontSizeMobile: '2rem',
      fontSizeTablet: '3rem',
      typewriterSpeed: 80, // ms per character
      glowColors: ['#8b5cf6', '#3b82f6', '#06b6d4'], // 紫、蓝、青
      glowIntensity: 20, // px
      glowAnimationDuration: 3000, // ms
    },
    subtitle: {
      color: '#22d3ee', // 浅青色
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.25rem',
      fontSizeMobile: '1rem',
      fontWeight: 300,
      animationDelay: 2500, // ms
      animationDuration: 1500, // ms
      shimmerEnabled: true,
      shimmerDuration: 2000, // ms
    },
    buttons: {
      primary: {
        background: '#06b6d4', // 青色填充
        glowColor: 'rgba(6, 182, 212, 0.5)',
        textColor: '#0a0f1a',
      },
      secondary: {
        background: 'transparent',
        border: '#06b6d4', // 青色边框
        glowColor: 'rgba(6, 182, 212, 0.3)',
        textColor: '#06b6d4',
      },
      animationDelay: 4000, // ms
      animationDuration: 1000, // ms
      pulseEnabled: true,
      pulseDuration: 2000, // ms
    },
    particles: {
      count: 100,
      countMobile: 40,
      colors: ['#8b5cf6', '#3b82f6', '#06b6d4', '#22c55e', '#ec4899', '#eab308'], // 彩虹色
      speed: 1.5,
      speedVariation: 0.5,
      size: { min: 2, max: 8 },
      opacity: { min: 0.4, max: 0.9 },
      direction: 'radial', // 四面八方
      trail: true, // 运动轨迹
      trailLength: 5,
      glow: true, // 发光效果
      glowSize: 10,
      blur: 2,
    },
    totalDuration: 10000, // 10秒循环
  },

  // 响应式配置
  responsive: {
    mobile: {
      breakpoint: 768,
      particleReduction: 0.5, // 减少50%粒子
      simplifyAnimations: true,
    },
    tablet: {
      breakpoint: 1024,
      particleReduction: 0.75, // 减少25%粒子
    },
  },

  // 性能配置
  performance: {
    lowPerformanceThreshold: 30, // fps
    reducedParticleCount: 20,
    disableTrails: true,
    disableGlow: true,
    checkInterval: 1000, // ms
  },

  // 可访问性配置
  accessibility: {
    reducedMotion: {
      disableParticles: true,
      disableTypewriter: true,
      simplifyAnimations: true,
      staticFallback: true,
    },
  },

  // Canvas配置
  canvas: {
    id: 'hero-particles-canvas',
    zIndex: 1,
    pointerEvents: 'none',
  },
};

// 导出配置供其他模块使用
window.HeroAnimationConfig = HeroAnimationConfig;

// ===================================
// Task 11.1: PerformanceMonitor Class
// 性能监测和优化 - 帧率监测、性能指标追踪
// Requirements: 3.3, 3.7
// ===================================

/**
 * PerformanceMonitor 类 - 性能监测器
 * 监测动画帧率、内存使用、渲染性能
 * Requirements: 3.3, 3.7
 */
class PerformanceMonitor {
  constructor(config) {
    this.config = config || window.HeroAnimationConfig;

    // 性能指标
    this.metrics = {
      fps: 60,
      frameTime: 0,
      avgFrameTime: 0,
      minFps: 60,
      maxFps: 60,
      droppedFrames: 0,
      totalFrames: 0,
      lastFrameTimestamp: 0,
      frameTimes: [], // 最近100帧的时间
      isLowPerformance: false,
      performanceLevel: 'high' // 'high', 'medium', 'low'
    };

    // 配置
    this.maxFrameTimeSamples = 100;
    this.fpsUpdateInterval = 500; // ms
    this.lowFpsThreshold = this.config.performance?.lowPerformanceThreshold || 30;
    this.mediumFpsThreshold = 45;

    // 定时器
    this.fpsUpdateTimer = null;
    this.isMonitoring = false;

    // 回调函数
    this.onPerformanceChange = null;
    this.onLowPerformance = null;

    // 绑定方法
    this.recordFrame = this.recordFrame.bind(this);
    this.updateMetrics = this.updateMetrics.bind(this);
  }

  /**
   * 开始性能监测
   */
  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.metrics.lastFrameTimestamp = performance.now();
    this.metrics.frameTimes = [];
    this.metrics.totalFrames = 0;
    this.metrics.droppedFrames = 0;

    // 定期更新FPS指标
    this.fpsUpdateTimer = setInterval(this.updateMetrics, this.fpsUpdateInterval);

    console.log('📊 PerformanceMonitor: Started');
  }

  /**
   * 停止性能监测
   */
  stop() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;

    if (this.fpsUpdateTimer) {
      clearInterval(this.fpsUpdateTimer);
      this.fpsUpdateTimer = null;
    }

    console.log('📊 PerformanceMonitor: Stopped');
  }

  /**
   * 记录一帧
   * 在每个动画帧调用此方法
   */
  recordFrame() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const frameTime = now - this.metrics.lastFrameTimestamp;
    this.metrics.lastFrameTimestamp = now;

    // 记录帧时间
    this.metrics.frameTimes.push(frameTime);
    if (this.metrics.frameTimes.length > this.maxFrameTimeSamples) {
      this.metrics.frameTimes.shift();
    }

    this.metrics.totalFrames++;
    this.metrics.frameTime = frameTime;

    // 检测掉帧（帧时间超过33ms，即低于30fps）
    if (frameTime > 33.33) {
      this.metrics.droppedFrames++;
    }
  }

  /**
   * 更新性能指标
   */
  updateMetrics() {
    if (!this.isMonitoring || this.metrics.frameTimes.length === 0) return;

    // 计算平均帧时间
    const sum = this.metrics.frameTimes.reduce((a, b) => a + b, 0);
    this.metrics.avgFrameTime = sum / this.metrics.frameTimes.length;

    // 计算FPS
    this.metrics.fps = Math.round(1000 / this.metrics.avgFrameTime);

    // 更新最小/最大FPS
    if (this.metrics.fps < this.metrics.minFps) {
      this.metrics.minFps = this.metrics.fps;
    }
    if (this.metrics.fps > this.metrics.maxFps) {
      this.metrics.maxFps = this.metrics.fps;
    }

    // 确定性能级别
    const previousLevel = this.metrics.performanceLevel;
    if (this.metrics.fps < this.lowFpsThreshold) {
      this.metrics.performanceLevel = 'low';
      this.metrics.isLowPerformance = true;
    } else if (this.metrics.fps < this.mediumFpsThreshold) {
      this.metrics.performanceLevel = 'medium';
      this.metrics.isLowPerformance = false;
    } else {
      this.metrics.performanceLevel = 'high';
      this.metrics.isLowPerformance = false;
    }

    // 触发回调
    if (previousLevel !== this.metrics.performanceLevel) {
      this.triggerPerformanceChange();
    }

    if (this.metrics.isLowPerformance && this.onLowPerformance) {
      this.onLowPerformance(this.metrics);
    }
  }

  /**
   * 触发性能变化回调
   */
  triggerPerformanceChange() {
    if (this.onPerformanceChange) {
      this.onPerformanceChange(this.metrics.performanceLevel, this.metrics);
    }

    console.log(`📊 PerformanceMonitor: Performance level changed to ${this.metrics.performanceLevel} (${this.metrics.fps} FPS)`);
  }

  /**
   * 获取当前性能指标
   * @returns {Object} 性能指标对象
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * 获取当前FPS
   * @returns {number}
   */
  getFPS() {
    return this.metrics.fps;
  }

  /**
   * 检查是否低性能
   * @returns {boolean}
   */
  isLowPerformance() {
    return this.metrics.isLowPerformance;
  }

  /**
   * 获取性能级别
   * @returns {string} 'high', 'medium', 'low'
   */
  getPerformanceLevel() {
    return this.metrics.performanceLevel;
  }

  /**
   * 设置性能变化回调
   * @param {Function} callback
   */
  setOnPerformanceChange(callback) {
    this.onPerformanceChange = callback;
  }

  /**
   * 设置低性能回调
   * @param {Function} callback
   */
  setOnLowPerformance(callback) {
    this.onLowPerformance = callback;
  }

  /**
   * 重置指标
   */
  reset() {
    this.metrics = {
      fps: 60,
      frameTime: 0,
      avgFrameTime: 0,
      minFps: 60,
      maxFps: 60,
      droppedFrames: 0,
      totalFrames: 0,
      lastFrameTimestamp: performance.now(),
      frameTimes: [],
      isLowPerformance: false,
      performanceLevel: 'high'
    };
  }

  /**
   * 销毁
   */
  destroy() {
    this.stop();
    this.onPerformanceChange = null;
    this.onLowPerformance = null;
  }
}

// 导出PerformanceMonitor供其他模块使用
window.PerformanceMonitor = PerformanceMonitor;

// ===================================
// Task 2.1: ThemeManager Class
// 主题管理器 - 白天/夜晚模式切换
// Requirements: 5.1, 5.2, 5.3, 5.4
// ===================================

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark'; // 'light' | 'dark'
    this.listeners = [];
    this.storageKey = 'hero-theme';
    this.systemMediaQuery = null;
  }

  /**
   * 初始化主题（从localStorage或系统偏好）
   * Requirements: 5.3, 5.4
   */
  init() {
    // 0. Check if theme-manager.js has already set the theme
    // If data-theme is already set on html, use it as current source of truth
    const existingTheme = document.documentElement.getAttribute('data-theme');

    if (existingTheme) {
      this.currentTheme = existingTheme;
    } else {
      // Fallback to local storage or system
      const savedTheme = this.loadTheme();
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else {
        this.currentTheme = this.detectSystemTheme();
      }
      // Only apply if not already set (though applying again is harmless if same)
      this.applyTheme(this.currentTheme);
    }

    // 3. Listen for system theme changes
    this.setupSystemThemeListener();

    return this;
  }


  /**
   * 切换主题
   * Requirements: 5.1, 5.2
   */
  toggle() {
    // 在切换主题前清理重复的标题元素
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const titleTexts = heroTitle.querySelectorAll('.hero-title-text');
      if (titleTexts.length > 1) {
        console.warn(`ThemeManager: 检测到 ${titleTexts.length} 个重复的 .hero-title-text 元素，正在清理...`);
        for (let i = 1; i < titleTexts.length; i++) {
          titleTexts[i].remove();
        }
      }
    }

    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  /**
   * 设置主题
   * Requirements: 5.1, 5.2, 5.5
   * @param {string} theme - 'light' 或 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`ThemeManager: Invalid theme "${theme}", using "dark"`);
      theme = 'dark';
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = theme;

    // 应用主题
    this.applyTheme(theme);

    // 保存到localStorage
    this.saveTheme(theme);

    // 通知所有监听器
    if (previousTheme !== theme) {
      this.notifyListeners(theme, previousTheme);
    }

    return this;
  }

  /**
   * 获取当前主题
   * @returns {string} 'light' 或 'dark'
   */
  getTheme() {
    return this.currentTheme;
  }

  /**
   * 保存主题到localStorage
   * Requirements: 5.3
   * @param {string} theme - 要保存的主题
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (e) {
      console.warn('ThemeManager: Unable to save theme to localStorage', e);
    }
  }

  /**
   * 从localStorage加载主题
   * Requirements: 5.4
   * @returns {string|null} 保存的主题或null
   */
  loadTheme() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (e) {
      console.warn('ThemeManager: Unable to load theme from localStorage', e);
      return null;
    }
  }

  /**
   * 检测系统主题偏好
   * Requirements: 5.1
   * @returns {string} 'light' 或 'dark'
   */
  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * 设置系统主题变化监听器
   */
  setupSystemThemeListener() {
    if (!window.matchMedia) return;

    this.systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // 只有在没有用户保存的主题时才跟随系统
      const savedTheme = this.loadTheme();
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
      }
    };

    // 使用addEventListener（现代浏览器）或addListener（旧浏览器）
    if (this.systemMediaQuery.addEventListener) {
      this.systemMediaQuery.addEventListener('change', handleChange);
    } else if (this.systemMediaQuery.addListener) {
      this.systemMediaQuery.addListener(handleChange);
    }
  }

  /**
   * 应用主题到DOM
   * Task 5.1: 优化主题切换性能
   * @param {string} theme - 要应用的主题
   */
  applyTheme(theme) {
    // 添加过渡类，确保平滑切换
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.add('theme-transitioning');
    }

    // 同步更新所有 data-theme 属性，确保立即生效
    // 更新document根元素的data-theme属性
    document.documentElement.setAttribute('data-theme', theme);

    // 更新body的data-theme属性（兼容性）
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }

    // 更新hero-section的data-theme属性（最重要！按钮样式依赖这个）
    if (heroSection) {
      // 先移除旧属性，再设置新属性，确保浏览器重新计算样式
      heroSection.removeAttribute('data-theme');
      // 强制重排
      heroSection.offsetHeight;
      // 设置新主题
      heroSection.setAttribute('data-theme', theme);
    }

    // 更新site-header的data-theme属性（确保导航栏主题正确）
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
      siteHeader.setAttribute('data-theme', theme);
    }

    // 更新meta theme-color（移动端浏览器地址栏颜色）
    this.updateMetaThemeColor(theme);

    // 强制重绘以确保样式立即更新
    document.documentElement.offsetHeight;

    // 使用双重 requestAnimationFrame 确保样式完全应用
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 移除过渡类
        if (heroSection) {
          heroSection.classList.remove('theme-transitioning');
        }

        // 强制重新计算所有按钮的样式
        const buttons = document.querySelectorAll('.hero-btn, .hero-btn--primary, .hero-btn--secondary, .btn, .btn--primary, .btn--secondary');
        buttons.forEach(button => {
          // 临时添加一个类来触发样式重新计算
          button.classList.add('theme-refresh');
          button.offsetHeight; // 强制重排
          button.classList.remove('theme-refresh');
        });

        // 再次强制重绘整个文档
        document.body.offsetHeight;
      });
    });
  }

  /**
   * 更新meta theme-color
   * @param {string} theme - 当前主题
   */
  updateMetaThemeColor(theme) {
    const config = window.HeroAnimationConfig;
    const color = theme === 'dark'
      ? (config?.dark?.background || '#0a0f1a')
      : (config?.light?.background || '#f8fafc');

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = color;
  }

  /**
   * 添加主题变化监听器
   * @param {Function} callback - 回调函数 (newTheme, previousTheme) => void
   * @returns {Function} 取消监听的函数
   */
  addListener(callback) {
    if (typeof callback !== 'function') {
      console.warn('ThemeManager: addListener requires a function');
      return () => { };
    }

    this.listeners.push(callback);

    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 移除主题变化监听器
   * @param {Function} callback - 要移除的回调函数
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器
   * @param {string} newTheme - 新主题
   * @param {string} previousTheme - 之前的主题
   */
  notifyListeners(newTheme, previousTheme) {
    this.listeners.forEach(callback => {
      try {
        callback(newTheme, previousTheme);
      } catch (e) {
        console.error('ThemeManager: Error in listener callback', e);
      }
    });
  }

  /**
   * 清理资源
   */
  destroy() {
    // 移除系统主题监听器
    if (this.systemMediaQuery) {
      if (this.systemMediaQuery.removeEventListener) {
        this.systemMediaQuery.removeEventListener('change', this.handleSystemThemeChange);
      } else if (this.systemMediaQuery.removeListener) {
        this.systemMediaQuery.removeListener(this.handleSystemThemeChange);
      }
    }

    // 清空监听器
    this.listeners = [];
  }
}

// 导出ThemeManager供其他模块使用
window.ThemeManager = ThemeManager;

// ===================================
// Task 2.3: Theme Toggle UI Interaction
// 主题切换UI交互
// Requirements: 5.1, 5.2
// ===================================

class HeroThemeToggle {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.toggleButton = null;
    this.isTransitioning = false;
    this.transitionDuration = 500; // ms

    this.init();
  }

  /**
   * 初始化主题切换UI
   */
  init() {
    // 获取主题切换按钮
    this.toggleButton = document.getElementById('hero-theme-toggle');

    if (!this.toggleButton) {
      console.warn('HeroThemeToggle: Toggle button not found');
      return;
    }

    // 绑定点击事件
    this.bindEvents();

    // 更新按钮状态
    this.updateButtonState(this.themeManager.getTheme());

    // 监听主题变化
    this.themeManager.addListener((newTheme) => {
      this.updateButtonState(newTheme);
    });

    console.log('✅ HeroThemeToggle initialized');
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 点击切换主题
    this.toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleToggle();
    });

    // 键盘支持
    this.toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleToggle();
      }
    });
  }

  /**
   * 处理主题切换
   * Requirements: 5.2 - 平滑过渡
   */
  handleToggle() {
    // 防止快速连续点击
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // 添加过渡类
    this.addTransitionClass();

    // 切换主题
    const newTheme = this.themeManager.toggle();

    // 更新按钮ARIA标签
    this.updateAriaLabel(newTheme);

    // 过渡结束后移除过渡类
    setTimeout(() => {
      this.removeTransitionClass();
      this.isTransitioning = false;
    }, this.transitionDuration);
  }

  /**
   * 添加主题过渡CSS类
   * Requirements: 5.2, 5.5 - 平滑过渡，避免突兀跳变
   */
  addTransitionClass() {
    document.documentElement.classList.add('theme-transitioning');
    document.body?.classList.add('theme-transitioning');

    // Hero section特殊过渡
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.add('theme-transitioning');
    }
  }

  /**
   * 移除主题过渡CSS类
   */
  removeTransitionClass() {
    document.documentElement.classList.remove('theme-transitioning');
    document.body?.classList.remove('theme-transitioning');

    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.classList.remove('theme-transitioning');
    }
  }

  /**
   * 更新按钮状态
   * @param {string} theme - 当前主题
   */
  updateButtonState(theme) {
    if (!this.toggleButton) return;

    // 更新data属性
    this.toggleButton.setAttribute('data-theme', theme);

    // 更新ARIA标签和aria-checked
    this.updateAriaLabel(theme);

    // 更新aria-checked (dark mode = checked/on)
    this.toggleButton.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');

    // 更新图标显示状态
    const sunIcon = this.toggleButton.querySelector('.theme-icon--sun');
    const moonIcon = this.toggleButton.querySelector('.theme-icon--moon');

    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        // 夜晚模式：显示太阳图标（点击切换到白天）
        sunIcon.style.opacity = '1';
        sunIcon.style.transform = 'scale(1) rotate(0deg)';
        moonIcon.style.opacity = '0';
        moonIcon.style.transform = 'scale(0.5) rotate(-90deg)';
      } else {
        // 白天模式：显示月亮图标（点击切换到夜晚）
        sunIcon.style.opacity = '0';
        sunIcon.style.transform = 'scale(0.5) rotate(90deg)';
        moonIcon.style.opacity = '1';
        moonIcon.style.transform = 'scale(1) rotate(0deg)';
      }
    }
  }

  /**
   * 更新ARIA标签
   * Requirements: 6.5
   * @param {string} theme - 当前主题
   */
  updateAriaLabel(theme) {
    if (!this.toggleButton) return;

    const label = theme === 'dark'
      ? '切换到白天模式'
      : '切换到夜晚模式';

    this.toggleButton.setAttribute('aria-label', label);
    this.toggleButton.setAttribute('title', label);
  }

  /**
   * 销毁
   */
  destroy() {
    // 移除事件监听器会在页面卸载时自动清理
    this.toggleButton = null;
  }
}

// 导出HeroThemeToggle供其他模块使用
window.HeroThemeToggle = HeroThemeToggle;

// ===================================
// Task 3: Particle System Implementation
// 粒子系统实现 - 白天/夜晚模式
// Requirements: 1.5, 1.6, 1.7, 2.5, 2.6, 2.7, 3.2, 3.5, 3.6
// ===================================

/**
 * Particle 类 - 单个粒子数据结构
 * Requirements: 3.2
 */
class Particle {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 0;
    this.color = '';
    this.opacity = 1;
    this.life = 1;
    this.maxLife = 1;
    this.trail = [];
    this.angle = 0;
    this.speed = 0;
    this.config = config;
  }

  /**
   * 初始化粒子属性
   * @param {string} theme - 'light' 或 'dark'
   * @param {number} canvasWidth - 画布宽度
   * @param {number} canvasHeight - 画布高度
   */
  init(theme, canvasWidth, canvasHeight) {
    const config = this.config[theme].particles;

    // 随机大小
    this.size = config.size.min + Math.random() * (config.size.max - config.size.min);

    // 随机颜色
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)];

    // 随机透明度
    this.opacity = config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min);

    // 随机速度
    const speedVariation = config.speedVariation || 0;
    this.speed = config.speed + (Math.random() - 0.5) * speedVariation * 2;

    // 根据方向模式设置位置和速度
    if (config.direction === 'up') {
      // 白天模式：从底部向上飘浮
      this.x = Math.random() * canvasWidth;
      this.y = canvasHeight + this.size;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -this.speed;
    } else if (config.direction === 'radial') {
      // 夜晚模式：从四面八方飘入
      this.initRadialPosition(canvasWidth, canvasHeight);
    }

    // 生命周期
    this.life = 1;
    this.maxLife = 1;

    // 轨迹
    this.trail = [];
  }

  /**
   * 初始化径向位置（夜晚模式）
   * Requirements: 2.6
   */
  initRadialPosition(canvasWidth, canvasHeight) {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // 随机选择从哪个边缘开始
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
      case 0: // 上边
        this.x = Math.random() * canvasWidth;
        this.y = -this.size;
        break;
      case 1: // 右边
        this.x = canvasWidth + this.size;
        this.y = Math.random() * canvasHeight;
        break;
      case 2: // 下边
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + this.size;
        break;
      case 3: // 左边
        this.x = -this.size;
        this.y = Math.random() * canvasHeight;
        break;
    }

    // 计算朝向中心的角度，加入随机偏移
    const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);
    const angleOffset = (Math.random() - 0.5) * Math.PI * 0.5; // ±45度偏移
    this.angle = angleToCenter + angleOffset;

    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  /**
   * 更新粒子位置
   * Task 11.1: 添加时间缩放支持以确保动画速度一致
   * @param {number} canvasWidth - 画布宽度
   * @param {number} canvasHeight - 画布高度
   * @param {string} theme - 当前主题
   * @param {number} timeScale - 时间缩放因子（基于60fps标准化）
   * @returns {boolean} - 粒子是否仍然存活
   * Requirements: 3.3, 3.7
   */
  update(canvasWidth, canvasHeight, theme, timeScale = 1) {
    const config = this.config[theme].particles;

    // 保存轨迹点（夜晚模式）
    if (config.trail && theme === 'dark') {
      this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
      const trailLength = config.trailLength || 5;
      if (this.trail.length > trailLength) {
        this.trail.shift();
      }
    }

    // 更新位置 - 使用时间缩放确保动画速度一致
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;

    // 检查是否超出边界
    const margin = this.size * 2;

    if (config.direction === 'up') {
      // 白天模式：超出顶部则重置到底部
      if (this.y < -margin) {
        this.x = Math.random() * canvasWidth;
        this.y = canvasHeight + margin;
        this.trail = [];
      }
    } else if (config.direction === 'radial') {
      // 夜晚模式：超出边界则重新初始化
      const isOutOfBounds =
        this.x < -margin * 5 ||
        this.x > canvasWidth + margin * 5 ||
        this.y < -margin * 5 ||
        this.y > canvasHeight + margin * 5;

      if (isOutOfBounds) {
        this.init(theme, canvasWidth, canvasHeight);
        return true;
      }
    }

    return true;
  }

  /**
   * 渲染粒子
   * Task 11.1: 优化粒子渲染性能
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {string} theme - 当前主题
   * Requirements: 3.3, 3.7
   */
  render(ctx, theme, simplifyEffects = false) {
    const config = this.config[theme].particles;

    // 优化：避免不必要的save/restore调用（性能开销大）
    // 只在需要特殊效果时使用
    const needsContextSave = (config.glow && theme === 'dark' && !simplifyEffects) ||
      (config.trail && theme === 'dark' && this.trail.length > 1 && !simplifyEffects);

    if (needsContextSave) {
      ctx.save();
    }

    // 渲染轨迹（夜晚模式，非简化模式）
    if (config.trail && theme === 'dark' && this.trail.length > 1 && !simplifyEffects) {
      this.renderTrail(ctx, config);
    }

    // 发光效果（夜晚模式，非简化模式）
    if (config.glow && theme === 'dark' && !simplifyEffects) {
      const glowSize = config.glowSize || 10;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = glowSize;
    }

    // 绘制粒子 - 优化：使用单一路径绘制
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // 白天模式柔光效果（非简化模式）
    if (theme === 'light' && !simplifyEffects) {
      ctx.globalAlpha = this.opacity * 0.3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (needsContextSave) {
      ctx.restore();
    } else {
      // 重置globalAlpha以避免影响后续绘制
      ctx.globalAlpha = 1;
    }
  }

  /**
   * 渲染粒子轨迹
   * Requirements: 2.7
   */
  renderTrail(ctx, config) {
    if (this.trail.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.trail[0].x, this.trail[0].y);

    for (let i = 1; i < this.trail.length; i++) {
      ctx.lineTo(this.trail[i].x, this.trail[i].y);
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size * 0.5;
    ctx.lineCap = 'round';
    ctx.globalAlpha = this.opacity * 0.3;
    ctx.stroke();
  }
}

/**
 * ParticleSystem 类 - 粒子系统管理器
 * Requirements: 3.2, 3.5, 3.6
 */
class ParticleSystem {
  constructor(canvasId, config) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.particles = [];
    this.config = config || window.HeroAnimationConfig;
    this.animationId = null;
    this.isRunning = false;
    this.isPaused = false;
    this.currentTheme = 'dark';
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 60;
    this.fpsCheckInterval = null;
    this.isLowPerformance = false;

    // 绑定方法
    this.animate = this.animate.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  /**
   * 初始化粒子系统
   * Requirements: 3.2
   */
  init() {
    if (!this.canvas) {
      console.warn('ParticleSystem: Canvas element not found');
      return false;
    }

    // 检查Canvas支持
    if (!this.canvas.getContext) {
      console.warn('ParticleSystem: Canvas not supported');
      return false;
    }

    this.ctx = this.canvas.getContext('2d');

    // 设置Canvas尺寸
    this.resizeCanvas();

    // 监听事件
    this.bindEvents();

    // 检测reduced-motion偏好
    if (this.shouldReduceMotion()) {
      console.log('ParticleSystem: Reduced motion preference detected');
      return false;
    }

    console.log('✅ ParticleSystem initialized');
    return true;
  }

  /**
   * 检测是否应该减少动画
   * Requirements: 6.1, 6.2
   */
  shouldReduceMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 调整Canvas尺寸
   */
  resizeCanvas() {
    if (!this.canvas) return;

    const heroSection = this.canvas.closest('.hero-section');
    if (heroSection) {
      this.canvas.width = heroSection.offsetWidth;
      this.canvas.height = heroSection.offsetHeight;
    } else {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * 绑定事件监听器
   * Requirements: 3.6, 10.2, 10.3
   */
  bindEvents() {
    // 页面可见性变化
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // 窗口大小变化
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * 处理页面可见性变化
   * Requirements: 3.6, 10.2, 10.3
   */
  handleVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * 处理窗口大小变化
   * Requirements: 4.5
   */
  handleResize() {
    this.resizeCanvas();
    // 重新初始化粒子以适应新尺寸
    if (this.isRunning) {
      this.createParticles(this.currentTheme);
    }
  }

  /**
   * 公共resize方法（供外部调用）
   * Requirements: 4.5
   */
  resize() {
    this.handleResize();
  }

  /**
   * 创建粒子
   * @param {string} theme - 'light' 或 'dark'
   * Requirements: 1.5, 2.5
   */
  createParticles(theme) {
    this.particles = [];

    const themeConfig = this.config[theme];
    if (!themeConfig || !themeConfig.particles) return;

    // 获取响应式粒子数量
    const count = this.getResponsiveParticleCount(theme);

    // 创建粒子
    for (let i = 0; i < count; i++) {
      const particle = new Particle(0, 0, this.config);
      particle.init(theme, this.canvas.width, this.canvas.height);
      this.particles.push(particle);
    }

    console.log(`🔵 ParticleSystem: Created ${count} particles for ${theme} mode`);
  }

  /**
   * 获取响应式粒子数量
   * Requirements: 4.2, 4.3
   * @param {string} theme - 当前主题
   * @returns {number} 粒子数量
   */
  getResponsiveParticleCount(theme) {
    const themeConfig = this.config[theme];
    if (!themeConfig || !themeConfig.particles) return 30;

    const particleConfig = themeConfig.particles;
    const responsiveConfig = this.config.responsive;
    let count = particleConfig.count;

    const screenWidth = window.innerWidth;

    // 移动端 (< 768px)
    if (screenWidth < (responsiveConfig?.mobile?.breakpoint || 768)) {
      count = particleConfig.countMobile || Math.floor(count * (responsiveConfig?.mobile?.particleReduction || 0.5));
    }
    // 平板端 (768px - 1024px)
    else if (screenWidth < (responsiveConfig?.tablet?.breakpoint || 1024)) {
      count = Math.floor(count * (responsiveConfig?.tablet?.particleReduction || 0.75));
    }

    // 低性能模式进一步减少
    if (this.isLowPerformance) {
      const perfConfig = this.config.performance;
      count = Math.min(count, perfConfig?.reducedParticleCount || 20);
    }

    // 确保至少有一些粒子
    return Math.max(count, 10);
  }

  /**
   * 检查是否应该简化动画效果（移动端）
   * Requirements: 4.3
   * @returns {boolean}
   */
  shouldSimplifyEffects() {
    const responsiveConfig = this.config.responsive;
    const mobileBreakpoint = responsiveConfig?.mobile?.breakpoint || 768;
    return window.innerWidth < mobileBreakpoint || this.isLowPerformance;
  }

  /**
   * 开始动画
   * Requirements: 1.7, 2.7
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();

    // 创建粒子
    this.createParticles(this.currentTheme);

    // 开始性能监测
    this.startPerformanceMonitoring();

    // 开始动画循环
    this.animate();

    console.log('✅ ParticleSystem started');
  }

  /**
   * 暂停动画
   * Requirements: 6.3, 10.2
   */
  pause() {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    console.log('⏸️ ParticleSystem paused');
  }

  /**
   * 恢复动画
   * Requirements: 6.3, 10.3
   */
  resume() {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.animate();

    console.log('▶️ ParticleSystem resumed');
  }

  /**
   * 停止并清理
   * Requirements: 10.1, 10.4
   */
  destroy() {
    this.isRunning = false;
    this.isPaused = false;

    // 取消动画帧
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // 停止性能监测
    this.stopPerformanceMonitoring();

    // 移除事件监听器
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('resize', this.handleResize);

    // 清空粒子
    this.particles = [];

    // 清空画布
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    console.log('🛑 ParticleSystem destroyed');
  }

  /**
   * 切换主题
   * @param {string} theme - 'light' 或 'dark'
   * Requirements: 5.5
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`ParticleSystem: Invalid theme "${theme}"`);
      return;
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = theme;

    // 优化：使用 requestAnimationFrame 包装主题切换
    // 分批更新粒子颜色，避免一次性更新导致卡顿
    if (this.isRunning && this.particles.length > 0) {
      this.updateParticleThemeBatched(theme, previousTheme);
    }
  }

  /**
   * 分批更新粒子主题颜色
   * Task 5.2: 优化粒子系统主题切换
   * @param {string} theme - 新主题
   * @param {string} previousTheme - 旧主题
   */
  updateParticleThemeBatched(theme, previousTheme) {
    const particles = this.particles;
    const totalParticles = particles.length;
    const batchSize = Math.ceil(totalParticles / 3); // 分3批更新
    let currentIndex = 0;

    const themeConfig = this.config[theme];
    if (!themeConfig || !themeConfig.particles) return;

    const colors = themeConfig.particles.colors || ['#ffffff'];

    const updateBatch = () => {
      const endIndex = Math.min(currentIndex + batchSize, totalParticles);

      // 使用 requestAnimationFrame 确保在下一帧更新
      requestAnimationFrame(() => {
        for (let i = currentIndex; i < endIndex; i++) {
          const particle = particles[i];
          if (particle) {
            // 更新粒子颜色
            particle.color = colors[Math.floor(Math.random() * colors.length)];
            // 更新粒子透明度范围
            const opacityRange = themeConfig.particles.opacity || { min: 0.3, max: 0.8 };
            particle.opacity = opacityRange.min + Math.random() * (opacityRange.max - opacityRange.min);
          }
        }

        currentIndex = endIndex;

        // 如果还有剩余粒子，继续下一批
        if (currentIndex < totalParticles) {
          updateBatch();
        }
      });
    };

    // 开始分批更新
    updateBatch();
  }

  /**
   * 动画循环
   * Task 11.1: 优化动画循环性能
   * Requirements: 3.3, 3.5, 3.7
   */
  animate() {
    if (!this.isRunning || this.isPaused) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // 帧率计数
    this.frameCount++;

    // 性能监测器记录帧
    if (this.performanceMonitor) {
      this.performanceMonitor.recordFrame();
    }

    // 帧率限制：如果帧时间太短，跳过此帧以节省资源
    // 目标60fps = 16.67ms/帧，允许一些余量
    if (deltaTime < 8) {
      this.animationId = requestAnimationFrame(this.animate);
      return;
    }

    // 清空画布 - 使用更高效的方式
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 更新和渲染粒子
    this.update(deltaTime);
    this.render();

    // 请求下一帧
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * 更新所有粒子
   * Task 11.1: 优化粒子更新逻辑
   * @param {number} deltaTime - 帧间隔时间（毫秒）
   */
  update(deltaTime) {
    // 使用deltaTime进行时间校正，确保动画速度一致
    const timeScale = deltaTime / 16.67; // 基于60fps标准化

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const isAlive = particle.update(
        this.canvas.width,
        this.canvas.height,
        this.currentTheme,
        timeScale
      );

      if (!isAlive) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * 渲染所有粒子
   * Task 11.1: 优化批量渲染
   * Requirements: 3.3, 3.7, 4.3
   */
  render() {
    const simplifyEffects = this.shouldSimplifyEffects();
    const particleCount = this.particles.length;

    // 批量渲染优化：按颜色分组减少状态切换
    if (particleCount > 50 && !simplifyEffects) {
      this.renderBatched(simplifyEffects);
    } else {
      // 少量粒子直接渲染
      for (const particle of this.particles) {
        particle.render(this.ctx, this.currentTheme, simplifyEffects);
      }
    }
  }

  /**
   * 批量渲染粒子（按颜色分组）
   * Task 11.1: 减少Canvas状态切换
   * Requirements: 3.3, 3.7
   */
  renderBatched(simplifyEffects) {
    // 按颜色分组粒子
    const colorGroups = new Map();

    for (const particle of this.particles) {
      if (!colorGroups.has(particle.color)) {
        colorGroups.set(particle.color, []);
      }
      colorGroups.get(particle.color).push(particle);
    }

    // 按颜色批量渲染
    for (const [color, particles] of colorGroups) {
      this.ctx.fillStyle = color;

      for (const particle of particles) {
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // 重置globalAlpha
    this.ctx.globalAlpha = 1;
  }

  /**
   * 开始性能监测
   * Task 11.1: 增强性能监测
   * Requirements: 3.3, 3.4, 3.7
   */
  startPerformanceMonitoring() {
    this.frameCount = 0;

    // 创建性能监测器
    this.performanceMonitor = new PerformanceMonitor(this.config);
    this.performanceMonitor.setOnPerformanceChange((level, metrics) => {
      this.handlePerformanceLevelChange(level, metrics);
    });
    this.performanceMonitor.setOnLowPerformance((metrics) => {
      if (!this.isLowPerformance) {
        this.isLowPerformance = true;
        this.adjustForLowPerformance();
      }
    });
    this.performanceMonitor.start();

    // 保留原有的FPS检测间隔（向后兼容）
    this.fpsCheckInterval = setInterval(() => {
      this.fps = this.frameCount;
      this.frameCount = 0;

      // 检测低性能
      const threshold = this.config.performance?.lowPerformanceThreshold || 30;
      if (this.fps < threshold && !this.isLowPerformance) {
        this.isLowPerformance = true;
        this.adjustForLowPerformance();
      }
    }, 1000);
  }

  /**
   * 处理性能级别变化
   * Task 11.1: 动态调整渲染质量
   * Requirements: 3.4, 3.7
   */
  handlePerformanceLevelChange(level, metrics) {
    console.log(`📊 ParticleSystem: Performance level changed to ${level}`);

    switch (level) {
      case 'low':
        // 低性能：大幅减少粒子和效果
        this.adjustParticleCount(this.config.performance?.reducedParticleCount || 20);
        break;
      case 'medium':
        // 中等性能：适度减少粒子
        const mediumCount = Math.floor(this.getResponsiveParticleCount(this.currentTheme) * 0.7);
        this.adjustParticleCount(mediumCount);
        break;
      case 'high':
        // 高性能：恢复正常粒子数量
        if (this.isLowPerformance) {
          this.isLowPerformance = false;
          this.createParticles(this.currentTheme);
        }
        break;
    }
  }

  /**
   * 停止性能监测
   * Task 11.1: 清理性能监测器
   */
  stopPerformanceMonitoring() {
    if (this.fpsCheckInterval) {
      clearInterval(this.fpsCheckInterval);
      this.fpsCheckInterval = null;
    }

    // 停止并销毁性能监测器
    if (this.performanceMonitor) {
      this.performanceMonitor.destroy();
      this.performanceMonitor = null;
    }
  }

  /**
   * 获取性能指标
   * Task 11.1: 暴露性能指标供外部访问
   * @returns {Object|null} 性能指标对象
   */
  getPerformanceMetrics() {
    if (this.performanceMonitor) {
      return this.performanceMonitor.getMetrics();
    }
    return {
      fps: this.fps,
      isLowPerformance: this.isLowPerformance,
      particleCount: this.particles.length
    };
  }

  /**
   * 低性能模式调整
   * Requirements: 3.4
   */
  adjustForLowPerformance() {
    console.log('⚠️ ParticleSystem: Switching to low performance mode');

    const perfConfig = this.config.performance;

    // 减少粒子数量
    const targetCount = perfConfig?.reducedParticleCount || 20;
    while (this.particles.length > targetCount) {
      this.particles.pop();
    }
  }

  /**
   * 调整粒子数量
   * @param {number} count - 目标粒子数量
   */
  adjustParticleCount(count) {
    if (count < this.particles.length) {
      // 减少粒子
      this.particles.length = count;
    } else if (count > this.particles.length) {
      // 增加粒子
      const toAdd = count - this.particles.length;
      for (let i = 0; i < toAdd; i++) {
        const particle = new Particle(0, 0, this.config);
        particle.init(this.currentTheme, this.canvas.width, this.canvas.height);
        this.particles.push(particle);
      }
    }
  }

  /**
   * 获取当前帧率
   * @returns {number} 当前FPS
   */
  getFPS() {
    return this.fps;
  }

  /**
   * 获取粒子数量
   * @returns {number} 当前粒子数量
   */
  getParticleCount() {
    return this.particles.length;
  }
}

// 导出ParticleSystem供其他模块使用
window.ParticleSystem = ParticleSystem;
window.Particle = Particle;

// ===================================
// Task 4: TitleAnimator Class
// 标题动画器 - 白天/夜晚模式标题动画
// Requirements: 1.2, 1.3, 2.2, 2.3, 2.4
// ===================================

/**
 * TitleAnimator 类 - 标题动画管理器
 * 负责管理Hero Section的标题和副标题动画
 * Requirements: 1.2, 1.3, 2.2, 2.3, 2.4
 */
class TitleAnimator {
  /**
   * 构造函数
   * @param {HTMLElement} titleElement - 标题元素
   * @param {HTMLElement} subtitleElement - 副标题元素
   * @param {Object} config - 动画配置
   */
  constructor(titleElement, subtitleElement, config) {
    this.titleEl = titleElement;
    this.subtitleEl = subtitleElement;
    this.config = config || window.HeroAnimationConfig;

    // 动画状态
    this.state = {
      isAnimating: false,
      isComplete: false,
      currentTheme: 'dark',
      typewriterTimeout: null,
      typewriterIndex: 0,
      animationStartTime: 0
    };

    // 原始文本内容
    this.originalTitleText = '';
    this.originalSubtitleText = '';

    // 绑定方法
    this.playLightAnimation = this.playLightAnimation.bind(this);
    this.playDarkAnimation = this.playDarkAnimation.bind(this);
    this.reset = this.reset.bind(this);

    // 初始化
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    if (!this.titleEl) {
      console.warn('TitleAnimator: Title element not found');
      return;
    }

    // 清理可能的重复元素
    const titleTexts = this.titleEl.querySelectorAll('.hero-title-text');
    if (titleTexts.length > 1) {
      console.warn(`TitleAnimator: 检测到 ${titleTexts.length} 个重复的 .hero-title-text 元素，正在清理...`);
      for (let i = 1; i < titleTexts.length; i++) {
        titleTexts[i].remove();
      }
    }

    // 保存原始文本
    const titleTextEl = this.titleEl.querySelector('.hero-title-text');
    this.originalTitleText = titleTextEl ? titleTextEl.textContent : this.titleEl.textContent;

    if (this.subtitleEl) {
      const subtitleTextEl = this.subtitleEl.querySelector('.hero-subtitle-text');
      this.originalSubtitleText = subtitleTextEl ? subtitleTextEl.textContent : this.subtitleEl.textContent;
    }

    // 检测reduced-motion偏好
    this.prefersReducedMotion = this.checkReducedMotion();

    console.log('✅ TitleAnimator initialized');
  }

  /**
   * 检测是否应该减少动画
   * Requirements: 6.1, 6.2
   * @returns {boolean}
   */
  checkReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 获取当前动画状态
   * @returns {Object} 动画状态对象
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 检查动画是否正在进行
   * @returns {boolean}
   */
  isAnimating() {
    return this.state.isAnimating;
  }

  /**
   * 检查动画是否已完成
   * @returns {boolean}
   */
  isComplete() {
    return this.state.isComplete;
  }

  /**
   * 播放动画（根据主题自动选择）
   * @param {string} theme - 'light' 或 'dark'
   * @returns {Promise} 动画完成的Promise
   */
  play(theme = 'dark') {
    this.state.currentTheme = theme;
    this.state.animationStartTime = performance.now();

    // 如果用户偏好减少动画，直接显示内容
    if (this.prefersReducedMotion) {
      return this.showStaticContent();
    }

    if (theme === 'light') {
      return this.playLightAnimation();
    } else {
      return this.playDarkAnimation();
    }
  }

  /**
   * 显示静态内容（无动画）
   * Requirements: 6.2, 6.4
   * @returns {Promise}
   */
  showStaticContent() {
    return new Promise((resolve) => {
      if (this.titleEl) {
        this.titleEl.style.opacity = '1';
        this.titleEl.style.transform = 'translateY(0)';
        this.titleEl.classList.add('animate');
      }

      if (this.subtitleEl) {
        this.subtitleEl.style.opacity = '1';
        this.subtitleEl.style.transform = 'translateY(0)';
        this.subtitleEl.classList.add('animate');
      }

      this.state.isComplete = true;
      resolve();
    });
  }

  /**
   * 播放白天模式标题动画
   * Requirements: 1.2, 1.3, 1.4
   * - 标题弹出并轻微弹跳（pop-in with bounce）
   * - 副标题弹出弹跳效果
   * @returns {Promise}
   */
  playLightAnimation() {
    return new Promise((resolve) => {
      if (this.state.isAnimating) {
        resolve();
        return;
      }

      this.state.isAnimating = true;
      this.state.isComplete = false;

      const lightConfig = this.config.light;
      const titleDuration = 800; // 弹跳动画时长
      const subtitleDelay = lightConfig.subtitle.animationDelay || 500;
      const subtitleDuration = 600; // 副标题弹跳动画时长

      // 1. 标题动画：弹出弹跳效果
      if (this.titleEl) {
        // 设置初始状态 - 缩小并透明
        this.titleEl.style.opacity = '0';
        this.titleEl.style.transform = 'scale(0.3)';

        // 触发动画
        requestAnimationFrame(() => {
          this.titleEl.classList.add('animate');
        });
      }

      // 2. 副标题动画：延迟后弹出弹跳
      if (this.subtitleEl) {
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.transform = 'scale(0.5) translateY(10px)';

        setTimeout(() => {
          this.subtitleEl.classList.add('animate');
        }, subtitleDelay);
      }

      // 3. 动画完成
      const totalDuration = subtitleDelay + subtitleDuration;
      setTimeout(() => {
        this.state.isAnimating = false;
        this.state.isComplete = true;
        resolve();
      }, totalDuration);
    });
  }

  /**
   * 播放夜晚模式标题动画
   * Requirements: 2.2, 2.3, 2.4
   * - 打字机逐字出现效果
   * - 霓虹渐变光晕（紫→蓝→青循环）
   * - 副标题渐显 + 微光闪烁
   * @returns {Promise}
   */
  playDarkAnimation() {
    return new Promise((resolve) => {
      if (this.state.isAnimating) {
        resolve();
        return;
      }

      this.state.isAnimating = true;
      this.state.isComplete = false;

      const darkConfig = this.config.dark;
      const typewriterSpeed = darkConfig.title.typewriterSpeed;
      const subtitleDelay = darkConfig.subtitle.animationDelay;
      const subtitleDuration = darkConfig.subtitle.animationDuration;

      // 1. 标题打字机效果
      if (this.titleEl) {
        this.titleEl.style.opacity = '1';
        this.titleEl.style.transform = 'translateY(0)';
        this.titleEl.classList.add('animate');

        // 执行打字机效果
        this.typewriterEffect(this.originalTitleText, typewriterSpeed);
      }

      // 2. 副标题渐显 + 微光闪烁
      if (this.subtitleEl) {
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.transform = 'translateY(20px)';

        setTimeout(() => {
          this.subtitleEl.classList.add('animate');

          // 添加微光闪烁效果
          if (darkConfig.subtitle.shimmerEnabled) {
            const subtitleTextEl = this.subtitleEl.querySelector('.hero-subtitle-text');
            if (subtitleTextEl) {
              subtitleTextEl.classList.add('shimmer-active');
            }
          }
        }, subtitleDelay);
      }

      // 3. 动画完成
      const typewriterDuration = this.originalTitleText.length * typewriterSpeed;
      const totalDuration = Math.max(typewriterDuration, subtitleDelay + subtitleDuration);

      setTimeout(() => {
        this.state.isAnimating = false;
        this.state.isComplete = true;
        resolve();
      }, totalDuration);
    });
  }

  /**
   * 打字机效果
   * Requirements: 2.2
   * @param {string} text - 要显示的文本
   * @param {number} speed - 每个字符的显示速度（毫秒）
   * @returns {Promise}
   */
  typewriterEffect(text, speed = 80) {
    return new Promise((resolve) => {
      const titleTextEl = this.titleEl.querySelector('.hero-title-text');
      if (!titleTextEl) {
        resolve();
        return;
      }

      // 清空文本
      titleTextEl.textContent = '';
      this.state.typewriterIndex = 0;

      // 添加光标
      let cursor = this.titleEl.querySelector('.hero-title-cursor');
      if (!cursor) {
        cursor = document.createElement('span');
        cursor.className = 'hero-title-cursor';
        titleTextEl.parentNode.appendChild(cursor);
      }
      cursor.style.display = 'inline-block';

      // 逐字显示
      const typeNextChar = () => {
        if (this.state.typewriterIndex < text.length) {
          titleTextEl.textContent += text.charAt(this.state.typewriterIndex);
          this.state.typewriterIndex++;
          this.state.typewriterTimeout = setTimeout(typeNextChar, speed);
        } else {
          // 打字完成，隐藏光标（延迟一会儿）
          setTimeout(() => {
            if (cursor) {
              cursor.style.display = 'none';
            }
          }, 1000);
          resolve();
        }
      };

      // 开始打字
      typeNextChar();
    });
  }

  /**
   * 重置动画状态
   * Requirements: 1.2, 1.3
   */
  reset() {
    // 清除打字机定时器
    if (this.state.typewriterTimeout) {
      clearTimeout(this.state.typewriterTimeout);
      this.state.typewriterTimeout = null;
    }

    // 重置状态
    this.state.isAnimating = false;
    this.state.isComplete = false;
    this.state.typewriterIndex = 0;

    // 重置标题元素
    if (this.titleEl) {
      this.titleEl.classList.remove('animate');

      // 根据主题设置不同的初始状态
      if (this.state.currentTheme === 'light') {
        // 白天模式：缩小状态
        this.titleEl.style.opacity = '0';
        this.titleEl.style.transform = 'scale(0.3)';
      } else {
        // 夜晚模式：向下偏移状态
        this.titleEl.style.opacity = '0';
        this.titleEl.style.transform = 'translateY(30px)';
      }

      // 恢复原始文本
      const titleTextEl = this.titleEl.querySelector('.hero-title-text');
      if (titleTextEl) {
        titleTextEl.textContent = this.originalTitleText;
      }

      // 移除光标
      const cursor = this.titleEl.querySelector('.hero-title-cursor');
      if (cursor) {
        cursor.style.display = 'none';
      }
    }

    // 重置副标题元素
    if (this.subtitleEl) {
      this.subtitleEl.classList.remove('animate');

      // 根据主题设置不同的初始状态
      if (this.state.currentTheme === 'light') {
        // 白天模式：缩小状态
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.transform = 'scale(0.5) translateY(10px)';
      } else {
        // 夜晚模式：向下偏移状态
        this.subtitleEl.style.opacity = '0';
        this.subtitleEl.style.transform = 'translateY(20px)';
      }

      // 移除微光效果
      const subtitleTextEl = this.subtitleEl.querySelector('.hero-subtitle-text');
      if (subtitleTextEl) {
        subtitleTextEl.classList.remove('shimmer-active');
      }
    }

    console.log('🔄 TitleAnimator reset');
  }

  /**
   * 切换主题
   * @param {string} theme - 'light' 或 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`TitleAnimator: Invalid theme "${theme}"`);
      return;
    }

    // 如果主题改变且动画已完成，重新播放动画
    if (this.state.currentTheme !== theme && this.state.isComplete) {
      this.reset();
      this.play(theme);
    }

    this.state.currentTheme = theme;
  }

  /**
   * 暂停动画
   */
  pause() {
    if (this.state.typewriterTimeout) {
      clearTimeout(this.state.typewriterTimeout);
      this.state.typewriterTimeout = null;
    }
  }

  /**
   * 恢复动画（从当前位置继续）
   */
  resume() {
    // 如果是打字机效果中断，继续打字
    if (this.state.currentTheme === 'dark' &&
      this.state.isAnimating &&
      this.state.typewriterIndex < this.originalTitleText.length) {
      const darkConfig = this.config.dark;
      const speed = darkConfig.title.typewriterSpeed;

      const titleTextEl = this.titleEl.querySelector('.hero-title-text');
      if (titleTextEl) {
        const remainingText = this.originalTitleText.slice(this.state.typewriterIndex);
        this.typewriterEffect(remainingText, speed);
      }
    }
  }

  /**
   * 获取动画持续时间
   * @param {string} theme - 'light' 或 'dark'
   * @returns {number} 总动画时长（毫秒）
   */
  getAnimationDuration(theme = this.state.currentTheme) {
    const config = this.config[theme];

    if (theme === 'light') {
      return config.subtitle.animationDelay + config.subtitle.animationDuration;
    } else {
      const typewriterDuration = this.originalTitleText.length * config.title.typewriterSpeed;
      return Math.max(
        typewriterDuration,
        config.subtitle.animationDelay + config.subtitle.animationDuration
      );
    }
  }

  /**
   * 销毁
   */
  destroy() {
    // 清除定时器
    if (this.state.typewriterTimeout) {
      clearTimeout(this.state.typewriterTimeout);
      this.state.typewriterTimeout = null;
    }

    // 重置状态
    this.state = {
      isAnimating: false,
      isComplete: false,
      currentTheme: 'dark',
      typewriterTimeout: null,
      typewriterIndex: 0,
      animationStartTime: 0
    };

    console.log('🛑 TitleAnimator destroyed');
  }
}

// 导出TitleAnimator供其他模块使用
window.TitleAnimator = TitleAnimator;

// ===================================
// Task 5.1: ButtonAnimator Class
// 按钮动画器 - 入场动画和弹跳效果
// Requirements: 1.8, 2.8, 2.9, 2.10
// ===================================

/**
 * ButtonAnimator 类 - 按钮动画控制器
 * 实现入场动画（从下方弹出）和弹跳效果
 * Requirements: 1.8
 */
class ButtonAnimator {
  /**
   * 构造函数
   * @param {HTMLElement|NodeList|Array} buttons - 按钮元素或按钮元素集合
   * @param {Object} config - 动画配置
   */
  constructor(buttons, config) {
    // 处理不同类型的按钮输入
    if (buttons instanceof HTMLElement) {
      this.buttons = [buttons];
    } else if (buttons instanceof NodeList || Array.isArray(buttons)) {
      this.buttons = Array.from(buttons);
    } else {
      this.buttons = [];
    }

    this.config = config || window.HeroAnimationConfig;

    // 动画状态
    this.state = {
      isAnimating: false,
      isComplete: false,
      currentTheme: 'dark',
      isPulsing: false,
      animationStartTime: 0
    };

    // 存储按钮原始样式
    this.originalStyles = new Map();

    // 绑定方法
    this.playEntrance = this.playEntrance.bind(this);
    this.reset = this.reset.bind(this);
    this.setNeonEffect = this.setNeonEffect.bind(this);
    this.startPulse = this.startPulse.bind(this);
    this.stopPulse = this.stopPulse.bind(this);

    // 初始化
    this.init();
  }

  /**
   * 初始化
   */
  init() {
    if (this.buttons.length === 0) {
      console.warn('ButtonAnimator: No buttons found');
      return;
    }

    // 保存原始样式
    this.buttons.forEach((btn, index) => {
      this.originalStyles.set(index, {
        opacity: btn.style.opacity,
        transform: btn.style.transform,
        boxShadow: btn.style.boxShadow
      });
    });

    // 检测reduced-motion偏好
    this.prefersReducedMotion = this.checkReducedMotion();

    console.log(`✅ ButtonAnimator initialized with ${this.buttons.length} buttons`);
  }

  /**
   * 检测是否应该减少动画
   * Requirements: 6.1, 6.2
   * @returns {boolean}
   */
  checkReducedMotion() {
    return window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * 获取当前动画状态
   * @returns {Object} 动画状态对象
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 检查动画是否正在进行
   * @returns {boolean}
   */
  isAnimating() {
    return this.state.isAnimating;
  }

  /**
   * 检查动画是否已完成
   * @returns {boolean}
   */
  isComplete() {
    return this.state.isComplete;
  }

  /**
   * 播放入场动画（从下方弹出 + 弹跳效果）
   * DISABLED: Animation removed to fix button position stability
   * Requirements: 11.1, 11.7
   * @param {number} delay - 动画延迟（毫秒）
   * @returns {Promise} 动画完成的Promise
   */
  playEntrance(delay = 0) {
    return new Promise((resolve) => {
      // 禁用入场动画，直接设置按钮为可见状态
      const heroActions = document.getElementById('hero-actions');

      if (heroActions) {
        heroActions.style.opacity = '1';
        heroActions.style.transform = 'none';
        // 不添加 animate 类，避免触发CSS动画
      }

      this.buttons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.transform = 'none';
      });

      this.state.isComplete = true;
      this.state.isAnimating = false;

      // 夜晚模式下启动脉动效果（保留其他功能）
      const themeConfig = this.config[this.state.currentTheme];
      const btnConfig = themeConfig.buttons;
      if (this.state.currentTheme === 'dark' && btnConfig.pulseEnabled) {
        this.startPulse();
      }

      console.log('🎯 ButtonAnimator: Buttons set to visible (animation disabled for stability)');
      resolve();
    });
  }

  /**
   * 显示静态内容（无动画）
   * Requirements: 6.2, 6.4
   * @returns {Promise}
   */
  showStaticContent() {
    return new Promise((resolve) => {
      const heroActions = document.getElementById('hero-actions');

      if (heroActions) {
        heroActions.style.opacity = '1';
        heroActions.style.transform = 'translateY(0)';
        heroActions.classList.add('animate');
      }

      this.buttons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      });

      this.state.isComplete = true;
      resolve();
    });
  }

  /**
   * 设置霓虹效果（夜晚模式）
   * Requirements: 2.8, 2.9
   * @param {boolean} enabled - 是否启用霓虹效果
   */
  setNeonEffect(enabled) {
    if (this.state.currentTheme !== 'dark') {
      return;
    }

    const darkConfig = this.config.dark.buttons;

    this.buttons.forEach(btn => {
      if (enabled) {
        // 判断是primary还是secondary按钮
        const isPrimary = btn.classList.contains('hero-btn--primary');

        if (isPrimary) {
          // 青色霓虹填充效果
          btn.style.background = darkConfig.primary.background;
          btn.style.color = darkConfig.primary.textColor;
          btn.style.boxShadow = `0 0 15px ${darkConfig.primary.glowColor}`;
        } else {
          // 青色霓虹边框效果
          btn.style.background = darkConfig.secondary.background;
          btn.style.color = darkConfig.secondary.textColor;
          btn.style.borderColor = darkConfig.secondary.border;
          btn.style.boxShadow = `0 0 10px ${darkConfig.secondary.glowColor}, inset 0 0 10px rgba(6, 182, 212, 0.1)`;
        }
      } else {
        // 移除霓虹效果
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      }
    });
  }

  /**
   * 启动脉动发光动画
   * Requirements: 2.10
   */
  startPulse() {
    if (this.state.isPulsing) return;

    this.state.isPulsing = true;

    this.buttons.forEach(btn => {
      btn.classList.add('pulse');
    });
  }

  /**
   * 停止脉动动画
   */
  stopPulse() {
    this.state.isPulsing = false;

    this.buttons.forEach(btn => {
      btn.classList.remove('pulse');
    });
  }

  /**
   * 重置动画状态
   */
  reset() {
    // 停止脉动
    this.stopPulse();

    // 重置状态
    this.state.isAnimating = false;
    this.state.isComplete = false;

    // 重置hero-actions容器
    const heroActions = document.getElementById('hero-actions');
    if (heroActions) {
      heroActions.classList.remove('animate');
      heroActions.style.opacity = '0';
      heroActions.style.transform = 'translateY(30px)';
    }

    // 重置按钮样式
    this.buttons.forEach((btn, index) => {
      const original = this.originalStyles.get(index);
      if (original) {
        btn.style.opacity = original.opacity;
        btn.style.transform = original.transform;
        btn.style.boxShadow = original.boxShadow;
      }
      btn.classList.remove('pulse');
    });

    console.log('🔄 ButtonAnimator reset');
  }

  /**
   * 切换主题
   * @param {string} theme - 'light' 或 'dark'
   */
  setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
      console.warn(`ButtonAnimator: Invalid theme "${theme}"`);
      return;
    }

    const previousTheme = this.state.currentTheme;
    this.state.currentTheme = theme;

    // 停止脉动（主题切换时）
    this.stopPulse();

    // 如果切换到夜晚模式且动画已完成，启用霓虹效果和脉动
    if (theme === 'dark' && this.state.isComplete) {
      this.setNeonEffect(true);
      const darkConfig = this.config.dark.buttons;
      if (darkConfig.pulseEnabled) {
        this.startPulse();
      }
    } else if (theme === 'light') {
      // 白天模式移除霓虹效果
      this.setNeonEffect(false);
    }
  }

  /**
   * 暂停动画
   */
  pause() {
    this.stopPulse();
  }

  /**
   * 恢复动画
   */
  resume() {
    // 如果是夜晚模式且动画已完成，恢复脉动
    if (this.state.currentTheme === 'dark' && this.state.isComplete) {
      const darkConfig = this.config.dark.buttons;
      if (darkConfig.pulseEnabled) {
        this.startPulse();
      }
    }
  }

  /**
   * 获取动画持续时间
   * @param {string} theme - 'light' 或 'dark'
   * @returns {number} 动画时长（毫秒）
   */
  getAnimationDuration(theme = this.state.currentTheme) {
    const config = this.config[theme];
    return config.buttons.animationDuration || 800;
  }

  /**
   * 获取动画延迟
   * @param {string} theme - 'light' 或 'dark'
   * @returns {number} 动画延迟（毫秒）
   */
  getAnimationDelay(theme = this.state.currentTheme) {
    const config = this.config[theme];
    return config.buttons.animationDelay || 2000;
  }

  /**
   * 销毁
   */
  destroy() {
    // 停止脉动
    this.stopPulse();

    // 清除样式缓存
    this.originalStyles.clear();

    // 重置状态
    this.state = {
      isAnimating: false,
      isComplete: false,
      currentTheme: 'dark',
      isPulsing: false,
      animationStartTime: 0
    };

    console.log('🛑 ButtonAnimator destroyed');
  }
}

// 导出ButtonAnimator供其他模块使用
window.ButtonAnimator = ButtonAnimator;

// ===================================
// Task 8.1: HeroAccessibilityManager Class
// 可访问性管理器 - prefers-reduced-motion检测和处理
// Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
// ===================================

/**
 * HeroAccessibilityManager 类 - 可访问性管理器
 * 检测用户的减少动画偏好，管理动画暂停功能
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */
class HeroAccessibilityManager {
  /**
   * 构造函数
   * @param {Object} config - 动画配置对象
   */
  constructor(config) {
    this.config = config || window.HeroAnimationConfig;

    // 状态管理
    this.state = {
      isInitialized: false,
      reducedMotionEnabled: false,
      animationsPaused: false,
      userPausedManually: false
    };

    // 媒体查询引用
    this.reducedMotionQuery = null;

    // 事件监听器引用（用于清理）
    this.eventListeners = {
      reducedMotionChange: null,
      pauseButtonClick: null,
      pauseButtonKeydown: null
    };

    // DOM元素引用
    this.pauseButton = null;
    this.liveRegion = null;

    // 回调函数
    this.onReducedMotionChange = null;
    this.onPauseStateChange = null;

    // 绑定方法
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);
    this.handlePauseToggle = this.handlePauseToggle.bind(this);
  }

  /**
   * 初始化可访问性管理器
   * Requirements: 6.1, 6.2
   * @returns {HeroAccessibilityManager} this
   */
  init() {
    if (this.state.isInitialized) {
      console.warn('HeroAccessibilityManager: Already initialized');
      return this;
    }

    try {
      // 1. 检测prefers-reduced-motion设置
      this.initReducedMotionDetection();

      // 2. 初始化暂停按钮
      this.initPauseButton();

      // 3. 设置ARIA live region
      this.initLiveRegion();

      // 4. 应用初始状态
      this.applyReducedMotionState();

      this.state.isInitialized = true;
      console.log('✅ HeroAccessibilityManager initialized');
      console.log(`   Reduced motion: ${this.state.reducedMotionEnabled ? 'enabled' : 'disabled'}`);

      return this;
    } catch (error) {
      console.error('❌ HeroAccessibilityManager initialization failed:', error);
      return this;
    }
  }

  /**
   * 初始化prefers-reduced-motion检测
   * Requirements: 6.1
   */
  initReducedMotionDetection() {
    if (!window.matchMedia) {
      console.warn('HeroAccessibilityManager: matchMedia not supported');
      return;
    }

    // 创建媒体查询
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // 检测初始状态
    this.state.reducedMotionEnabled = this.reducedMotionQuery.matches;

    // 监听变化
    this.eventListeners.reducedMotionChange = this.handleReducedMotionChange;

    if (this.reducedMotionQuery.addEventListener) {
      this.reducedMotionQuery.addEventListener('change', this.eventListeners.reducedMotionChange);
    } else if (this.reducedMotionQuery.addListener) {
      // 兼容旧浏览器
      this.reducedMotionQuery.addListener(this.eventListeners.reducedMotionChange);
    }
  }

  /**
   * 处理prefers-reduced-motion变化
   * Requirements: 6.1, 6.2
   * @param {MediaQueryListEvent} event - 媒体查询变化事件
   */
  handleReducedMotionChange(event) {
    const wasEnabled = this.state.reducedMotionEnabled;
    this.state.reducedMotionEnabled = event.matches;

    if (wasEnabled !== this.state.reducedMotionEnabled) {
      console.log(`♿ HeroAccessibilityManager: Reduced motion ${this.state.reducedMotionEnabled ? 'enabled' : 'disabled'}`);

      // 应用新状态
      this.applyReducedMotionState();

      // 通知用户
      this.announce(
        this.state.reducedMotionEnabled
          ? '动画已减少以适应您的偏好设置'
          : '动画已恢复正常'
      );

      // 触发回调
      if (this.onReducedMotionChange) {
        this.onReducedMotionChange(this.state.reducedMotionEnabled);
      }
    }
  }

  /**
   * 应用减少动画状态
   * Requirements: 6.2, 6.4
   */
  applyReducedMotionState() {
    const heroSection = document.querySelector('.hero-section');
    const body = document.body;

    if (this.state.reducedMotionEnabled) {
      // 添加reduced-motion类
      body.classList.add('reduced-motion');
      if (heroSection) {
        heroSection.classList.add('reduced-motion');
      }

      // 更新data属性
      body.setAttribute('data-reduced-motion', 'true');
      if (heroSection) {
        heroSection.setAttribute('data-reduced-motion', 'true');
      }
    } else {
      // 移除reduced-motion类
      body.classList.remove('reduced-motion');
      if (heroSection) {
        heroSection.classList.remove('reduced-motion');
      }

      // 更新data属性
      body.setAttribute('data-reduced-motion', 'false');
      if (heroSection) {
        heroSection.setAttribute('data-reduced-motion', 'false');
      }
    }
  }

  /**
   * 初始化暂停按钮
   * Requirements: 6.3
   */
  initPauseButton() {
    this.pauseButton = document.getElementById('hero-pause-toggle');

    if (!this.pauseButton) {
      console.warn('HeroAccessibilityManager: Pause button not found');
      return;
    }

    // 确保按钮有正确的ARIA属性
    this.updatePauseButtonAria();

    // 绑定点击事件
    this.eventListeners.pauseButtonClick = (e) => {
      e.preventDefault();
      this.handlePauseToggle();
    };
    this.pauseButton.addEventListener('click', this.eventListeners.pauseButtonClick);

    // 绑定键盘事件
    this.eventListeners.pauseButtonKeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handlePauseToggle();
      }
    };
    this.pauseButton.addEventListener('keydown', this.eventListeners.pauseButtonKeydown);
  }

  /**
   * 处理暂停/播放切换
   * Requirements: 6.3
   */
  handlePauseToggle() {
    this.state.animationsPaused = !this.state.animationsPaused;
    this.state.userPausedManually = this.state.animationsPaused;

    // 更新按钮状态
    this.updatePauseButtonState();

    // 通知用户
    this.announce(
      this.state.animationsPaused
        ? '动画已暂停'
        : '动画已恢复'
    );

    // 触发回调
    if (this.onPauseStateChange) {
      this.onPauseStateChange(this.state.animationsPaused);
    }

    console.log(`⏯️ HeroAccessibilityManager: Animation ${this.state.animationsPaused ? 'paused' : 'resumed'} by user`);
  }

  /**
   * 更新暂停按钮状态
   * Requirements: 6.3, 6.5
   */
  updatePauseButtonState() {
    if (!this.pauseButton) return;

    if (this.state.animationsPaused) {
      this.pauseButton.classList.add('paused');
      this.pauseButton.setAttribute('aria-pressed', 'true');
    } else {
      this.pauseButton.classList.remove('paused');
      this.pauseButton.setAttribute('aria-pressed', 'false');
    }

    this.updatePauseButtonAria();
  }

  /**
   * 更新暂停按钮ARIA属性
   * Requirements: 6.5
   */
  updatePauseButtonAria() {
    if (!this.pauseButton) return;

    const label = this.state.animationsPaused
      ? '播放动画'
      : '暂停动画';

    this.pauseButton.setAttribute('aria-label', label);
    this.pauseButton.setAttribute('title', label);
    this.pauseButton.setAttribute('role', 'button');
    this.pauseButton.setAttribute('aria-pressed', this.state.animationsPaused ? 'true' : 'false');
  }

  /**
   * 初始化ARIA live region
   * Requirements: 6.5
   */
  initLiveRegion() {
    this.liveRegion = document.getElementById('aria-live-region');

    if (!this.liveRegion) {
      // 创建live region
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'aria-live-region';
      this.liveRegion.className = 'aria-live-region';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.liveRegion);
    }
  }

  /**
   * 向屏幕阅读器宣布消息
   * Requirements: 6.5
   * @param {string} message - 要宣布的消息
   * @param {string} priority - 优先级 ('polite' 或 'assertive')
   */
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.setAttribute('aria-live', priority);

    // 清空后重新设置以触发屏幕阅读器
    this.liveRegion.textContent = '';

    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  }

  /**
   * 检查是否应该减少动画
   * Requirements: 6.1, 6.2
   * @returns {boolean}
   */
  shouldReduceMotion() {
    return this.state.reducedMotionEnabled;
  }

  /**
   * 检查动画是否被暂停
   * Requirements: 6.3
   * @returns {boolean}
   */
  isAnimationPaused() {
    return this.state.animationsPaused;
  }

  /**
   * 检查是否是用户手动暂停
   * @returns {boolean}
   */
  isUserPausedManually() {
    return this.state.userPausedManually;
  }

  /**
   * 设置暂停状态（供外部调用）
   * @param {boolean} paused - 是否暂停
   * @param {boolean} isManual - 是否是手动操作
   */
  setPauseState(paused, isManual = false) {
    this.state.animationsPaused = paused;
    if (isManual) {
      this.state.userPausedManually = paused;
    }
    this.updatePauseButtonState();
  }

  /**
   * 设置减少动画变化回调
   * @param {Function} callback - 回调函数
   */
  setOnReducedMotionChange(callback) {
    this.onReducedMotionChange = callback;
  }

  /**
   * 设置暂停状态变化回调
   * @param {Function} callback - 回调函数
   */
  setOnPauseStateChange(callback) {
    this.onPauseStateChange = callback;
  }

  /**
   * 获取当前状态
   * @returns {Object} 状态对象
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 销毁可访问性管理器
   */
  destroy() {
    console.log('🛑 HeroAccessibilityManager: Destroying...');

    // 移除媒体查询监听器
    if (this.reducedMotionQuery && this.eventListeners.reducedMotionChange) {
      if (this.reducedMotionQuery.removeEventListener) {
        this.reducedMotionQuery.removeEventListener('change', this.eventListeners.reducedMotionChange);
      } else if (this.reducedMotionQuery.removeListener) {
        this.reducedMotionQuery.removeListener(this.eventListeners.reducedMotionChange);
      }
    }

    // 移除暂停按钮事件监听器
    if (this.pauseButton) {
      if (this.eventListeners.pauseButtonClick) {
        this.pauseButton.removeEventListener('click', this.eventListeners.pauseButtonClick);
      }
      if (this.eventListeners.pauseButtonKeydown) {
        this.pauseButton.removeEventListener('keydown', this.eventListeners.pauseButtonKeydown);
      }
    }

    // 重置状态
    this.state = {
      isInitialized: false,
      reducedMotionEnabled: false,
      animationsPaused: false,
      userPausedManually: false
    };

    // 清空引用
    this.reducedMotionQuery = null;
    this.pauseButton = null;
    this.liveRegion = null;
    this.onReducedMotionChange = null;
    this.onPauseStateChange = null;
    this.eventListeners = {
      reducedMotionChange: null,
      pauseButtonClick: null,
      pauseButtonKeydown: null
    };

    console.log('✅ HeroAccessibilityManager: Destroyed');
  }
}

// 导出HeroAccessibilityManager供其他模块使用
window.HeroAccessibilityManager = HeroAccessibilityManager;

// ===================================
// Task 6.1: HeroAnimationManager Class
// 主控制器 - 整合所有动画组件
// Requirements: 1.9, 2.11, 3.6, 4.5, 10.1, 10.2, 10.3, 10.4
// ===================================

/**
 * HeroAnimationManager 类 - 主动画控制器
 * 整合ThemeManager、ParticleSystem、TitleAnimator、ButtonAnimator
 * 实现动画序列编排和生命周期管理
 * Requirements: 1.9, 2.11
 */
class HeroAnimationManager {
  /**
   * 构造函数
   * @param {Object} config - 动画配置对象
   */
  constructor(config) {
    this.config = config || window.HeroAnimationConfig;

    // 子组件实例
    this.themeManager = null;
    this.themeToggle = null;
    this.particleSystem = null;
    this.titleAnimator = null;
    this.buttonAnimator = null;
    this.accessibilityManager = null; // Task 8: 可访问性管理器

    // 状态管理
    this.state = {
      isInitialized: false,
      isRunning: false,
      isPaused: false,
      currentTheme: 'dark',
      animationSequenceStartTime: 0,
      reducedMotionEnabled: false // Task 8.1: 减少动画状态
    };

    // 事件监听器引用（用于清理）
    this.eventListeners = {
      visibilityChange: null,
      resize: null,
      themeChange: null
    };

    // 防抖定时器
    this.resizeDebounceTimer = null;
    this.resizeDebounceDelay = 250; // ms

    // 绑定方法
    this.init = this.init.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.resume = this.resume.bind(this);
    this.destroy = this.destroy.bind(this);
    this.onThemeChange = this.onThemeChange.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onReducedMotionChange = this.onReducedMotionChange.bind(this); // Task 8.1
    this.onAccessibilityPauseChange = this.onAccessibilityPauseChange.bind(this); // Task 8.2
  }

  /**
   * 初始化动画系统
   * Requirements: 1.9, 2.11
   * @returns {HeroAnimationManager} this
   */
  init() {
    if (this.state.isInitialized) {
      console.warn('HeroAnimationManager: Already initialized');
      return this;
    }

    try {
      // 0. 初始化可访问性管理器（最先初始化，以便其他组件可以检查状态）
      this.initAccessibilityManager();

      // 1. 初始化主题管理器
      this.initThemeManager();

      // 2. 初始化粒子系统（如果不是减少动画模式）
      this.initParticleSystem();

      // 3. 初始化标题动画器
      this.initTitleAnimator();

      // 4. 初始化按钮动画器
      this.initButtonAnimator();

      // 5. 初始化暂停按钮（由accessibilityManager处理）
      // this.initPauseButton(); // 已移至accessibilityManager

      // 6. 设置事件监听器
      this.setupEventListeners();

      this.state.isInitialized = true;
      this.state.currentTheme = this.themeManager.getTheme();

      console.log('✅ HeroAnimationManager initialized');
      return this;
    } catch (error) {
      console.error('❌ HeroAnimationManager initialization failed:', error);
      return this;
    }
  }

  /**
   * 初始化主题管理器
   * Modified to avoid conflict with theme-manager.js
   */
  initThemeManager() {
    // Check if theme-manager.js has already set up global toggleTheme
    if (typeof window.toggleTheme === 'function') {
      console.log('🎨 HeroAnimationManager: Using global theme-manager.js');
      // Create a lightweight wrapper that observes data-theme changes
      this.themeManager = {
        getTheme: () => document.documentElement.getAttribute('data-theme') || 'dark',
        toggle: () => {
          window.toggleTheme();
          return document.documentElement.getAttribute('data-theme');
        },
        addListener: (callback) => {
          // Use MutationObserver to watch data-theme attribute changes
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === 'data-theme') {
                const newTheme = document.documentElement.getAttribute('data-theme');
                callback(newTheme, mutation.oldValue);
              }
            });
          });
          observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
            attributeOldValue: true
          });
          // Return unsubscribe function
          return () => observer.disconnect();
        },
        setTheme: (theme) => {
          document.documentElement.setAttribute('data-theme', theme);
          document.body.setAttribute('data-theme', theme);
          localStorage.setItem('hero-theme', theme);
        }
      };
      // DO NOT create HeroThemeToggle as theme-manager.js handles the button
      this.themeToggle = null;
    } else {
      // Fallback: use the original ThemeManager
      this.themeManager = new ThemeManager();
      this.themeManager.init();
      this.themeToggle = new HeroThemeToggle(this.themeManager);
    }

    // Listen for theme changes to update animations
    this.eventListeners.themeChange = this.themeManager.addListener(this.onThemeChange);
  }

  /**
   * 初始化可访问性管理器
   * Task 8: 可访问性实现
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
   */
  initAccessibilityManager() {
    this.accessibilityManager = new HeroAccessibilityManager(this.config);
    this.accessibilityManager.init();

    // 设置回调函数
    this.accessibilityManager.setOnReducedMotionChange(this.onReducedMotionChange);
    this.accessibilityManager.setOnPauseStateChange(this.onAccessibilityPauseChange);

    // 同步初始状态
    this.state.reducedMotionEnabled = this.accessibilityManager.shouldReduceMotion();
  }

  /**
   * 处理减少动画偏好变化
   * Task 8.1: prefers-reduced-motion检测
   * Requirements: 6.1, 6.2
   * @param {boolean} reducedMotionEnabled - 是否启用减少动画
   */
  onReducedMotionChange(reducedMotionEnabled) {
    this.state.reducedMotionEnabled = reducedMotionEnabled;

    if (reducedMotionEnabled) {
      // 禁用或简化动画
      this.disableAnimationsForReducedMotion();
    } else {
      // 恢复动画
      this.enableAnimationsAfterReducedMotion();
    }

    console.log(`♿ HeroAnimationManager: Reduced motion ${reducedMotionEnabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 处理可访问性暂停状态变化
   * Task 8.2: 暂停动画功能
   * Requirements: 6.3
   * @param {boolean} isPaused - 是否暂停
   */
  onAccessibilityPauseChange(isPaused) {
    if (isPaused) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * 禁用动画以适应减少动画偏好
   * Task 8.1: Requirements 6.2, 6.4
   */
  disableAnimationsForReducedMotion() {
    // 停止粒子系统
    if (this.particleSystem) {
      this.particleSystem.pause();
      // 隐藏粒子画布
      const canvas = document.getElementById('hero-particles-canvas');
      if (canvas) {
        canvas.style.display = 'none';
      }
    }

    // 停止标题动画
    if (this.titleAnimator) {
      this.titleAnimator.pause();
      // 确保内容可见
      this.titleAnimator.showStaticContent();
    }

    // 停止按钮动画
    if (this.buttonAnimator) {
      this.buttonAnimator.pause();
      // 确保按钮可见
      this.buttonAnimator.showStaticContent();
    }

    console.log('♿ HeroAnimationManager: Animations disabled for reduced motion');
  }

  /**
   * 恢复动画（减少动画偏好关闭后）
   * Task 8.1: Requirements 6.2
   */
  enableAnimationsAfterReducedMotion() {
    // 显示粒子画布
    const canvas = document.getElementById('hero-particles-canvas');
    if (canvas) {
      canvas.style.display = '';
    }

    // 恢复粒子系统
    if (this.particleSystem && this.state.isRunning && !this.state.isPaused) {
      this.particleSystem.resume();
    }

    // 恢复标题动画
    if (this.titleAnimator && this.state.isRunning && !this.state.isPaused) {
      this.titleAnimator.resume();
    }

    // 恢复按钮动画
    if (this.buttonAnimator && this.state.isRunning && !this.state.isPaused) {
      this.buttonAnimator.resume();
    }

    console.log('♿ HeroAnimationManager: Animations restored after reduced motion disabled');
  }

  /**
   * 检查是否应该减少动画
   * @returns {boolean}
   */
  shouldReduceMotion() {
    return this.accessibilityManager ? this.accessibilityManager.shouldReduceMotion() : false;
  }

  /**
   * 初始化粒子系统
   * Task 9.2: 添加Canvas不支持时的降级方案
   * Requirements: 7.2, 7.3
   */
  initParticleSystem() {
    const heroSection = document.getElementById('hero');

    // 如果启用了减少动画，跳过粒子系统初始化
    if (this.state.reducedMotionEnabled) {
      console.log('♿ HeroAnimationManager: Skipping particle system (reduced motion enabled)');
      this.applyCanvasFallback(heroSection);
      return;
    }

    // 检测Canvas支持
    if (!this.isCanvasSupported()) {
      console.warn('⚠️ HeroAnimationManager: Canvas not supported, applying CSS fallback');
      this.applyCanvasFallback(heroSection);
      return;
    }

    this.particleSystem = new ParticleSystem('hero-particles-canvas', this.config);
    const initialized = this.particleSystem.init();

    if (initialized) {
      this.particleSystem.setTheme(this.themeManager.getTheme());
    } else {
      console.warn('HeroAnimationManager: ParticleSystem initialization failed, applying CSS fallback');
      this.applyCanvasFallback(heroSection);
    }
  }

  /**
   * 检测Canvas是否支持
   * Task 9.2: Canvas支持检测
   * Requirements: 7.2
   */
  isCanvasSupported() {
    const canvas = document.getElementById('hero-particles-canvas');
    if (!canvas) return false;

    // 检查getContext方法是否存在
    if (!canvas.getContext) return false;

    // 尝试获取2D上下文
    try {
      const ctx = canvas.getContext('2d');
      return ctx !== null;
    } catch (e) {
      console.warn('Canvas context creation failed:', e);
      return false;
    }
  }

  /**
   * 应用Canvas降级方案
   * Task 9.2: CSS-only备用动画
   * Requirements: 7.2, 7.3
   */
  applyCanvasFallback(heroSection) {
    if (!heroSection) {
      heroSection = document.getElementById('hero');
    }

    if (heroSection) {
      // 添加no-canvas-fallback类以启用CSS-only动画
      heroSection.classList.add('no-canvas-fallback');
      console.log('✅ Canvas fallback applied: CSS-only animations enabled');

      // 检测CSS动画支持
      if (!this.isCSSAnimationSupported()) {
        heroSection.classList.add('no-animation-fallback');
        console.log('⚠️ CSS animations not supported, using static fallback');
      }

      // 隐藏Canvas元素
      const canvas = document.getElementById('hero-particles-canvas');
      if (canvas) {
        canvas.style.display = 'none';
      }
    }
  }

  /**
   * 检测CSS动画是否支持
   * Task 9.2: CSS动画支持检测
   * Requirements: 7.3
   */
  isCSSAnimationSupported() {
    const testElement = document.createElement('div');
    const animationProps = [
      'animation',
      'webkitAnimation',
      'MozAnimation',
      'OAnimation',
      'msAnimation'
    ];

    for (const prop of animationProps) {
      if (testElement.style[prop] !== undefined) {
        return true;
      }
    }

    return false;
  }

  /**
   * 初始化标题动画器
   * DISABLED: Causes duplicate title text issue when theme changes.
   * Static title in HTML is sufficient.
   */
  initTitleAnimator() {
    // DISABLED to prevent title duplication bug
    // The static title in HTML works fine without animation
    console.log('🎬 TitleAnimator: Disabled to prevent duplicate text');
    this.titleAnimator = null;

    /* Original code:
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');

    if (heroTitle) {
      this.titleAnimator = new TitleAnimator(heroTitle, heroSubtitle, this.config);
    } else {
      console.warn('HeroAnimationManager: Hero title element not found');
    }
    */
  }

  /**
   * 初始化按钮动画器
   */
  initButtonAnimator() {
    const heroButtons = document.querySelectorAll('.hero-btn');

    if (heroButtons.length > 0) {
      this.buttonAnimator = new ButtonAnimator(heroButtons, this.config);
      this.buttonAnimator.state.currentTheme = this.themeManager.getTheme();
    } else {
      console.warn('HeroAnimationManager: Hero buttons not found');
    }
  }

  /**
   * 设置事件监听器
   * Requirements: 3.6, 4.5, 10.2, 10.3
   */
  setupEventListeners() {
    // 页面可见性变化监听
    this.eventListeners.visibilityChange = () => {
      this.onVisibilityChange(!document.hidden);
    };
    document.addEventListener('visibilitychange', this.eventListeners.visibilityChange);

    // 窗口大小变化监听（防抖）
    this.eventListeners.resize = () => {
      if (this.resizeDebounceTimer) {
        clearTimeout(this.resizeDebounceTimer);
      }
      this.resizeDebounceTimer = setTimeout(() => {
        this.onResize();
      }, this.resizeDebounceDelay);
    };
    window.addEventListener('resize', this.eventListeners.resize);
  }

  /**
   * 开始动画序列
   * Requirements: 1.9, 2.11
   * @returns {Promise} 动画完成的Promise
   */
  async start() {
    if (!this.state.isInitialized) {
      console.warn('HeroAnimationManager: Not initialized, call init() first');
      return;
    }

    if (this.state.isRunning) {
      console.warn('HeroAnimationManager: Animation already running');
      return;
    }

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.animationSequenceStartTime = performance.now();

    const currentTheme = this.themeManager.getTheme();
    const themeConfig = this.config[currentTheme];

    try {
      // 1. 启动粒子系统（立即开始）
      if (this.particleSystem) {
        this.particleSystem.start();
      }

      // 2. 播放标题动画
      if (this.titleAnimator) {
        this.titleAnimator.play(currentTheme);
      }

      // 3. 播放按钮入场动画（延迟）
      if (this.buttonAnimator) {
        const btnDelay = themeConfig.buttons.animationDelay;
        this.buttonAnimator.playEntrance(btnDelay);
      }

      console.log(`🎬 HeroAnimationManager: Animation sequence started (${currentTheme} mode)`);
    } catch (error) {
      console.error('HeroAnimationManager: Error starting animation:', error);
    }
  }

  /**
   * 暂停所有动画
   * Requirements: 6.3, 10.4
   */
  pause() {
    if (!this.state.isRunning || this.state.isPaused) {
      return;
    }

    this.state.isPaused = true;

    // 暂停粒子系统
    if (this.particleSystem) {
      this.particleSystem.pause();
    }

    // 暂停标题动画
    if (this.titleAnimator) {
      this.titleAnimator.pause();
    }

    // 暂停按钮动画
    if (this.buttonAnimator) {
      this.buttonAnimator.pause();
    }

    console.log('⏸️ HeroAnimationManager: Animation paused');
  }

  /**
   * 恢复所有动画
   * Requirements: 10.3
   */
  resume() {
    if (!this.state.isRunning || !this.state.isPaused) {
      return;
    }

    this.state.isPaused = false;

    // 恢复粒子系统
    if (this.particleSystem) {
      this.particleSystem.resume();
    }

    // 恢复标题动画
    if (this.titleAnimator) {
      this.titleAnimator.resume();
    }

    // 恢复按钮动画
    if (this.buttonAnimator) {
      this.buttonAnimator.resume();
    }

    console.log('▶️ HeroAnimationManager: Animation resumed');
  }

  /**
   * 停止并清理所有资源
   * Requirements: 10.1, 10.4
   */
  destroy() {
    console.log('🛑 HeroAnimationManager: Destroying...');

    // 1. 移除事件监听器
    if (this.eventListeners.visibilityChange) {
      document.removeEventListener('visibilitychange', this.eventListeners.visibilityChange);
    }

    if (this.eventListeners.resize) {
      window.removeEventListener('resize', this.eventListeners.resize);
    }

    // 清除防抖定时器
    if (this.resizeDebounceTimer) {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = null;
    }

    // 2. 销毁子组件
    if (this.accessibilityManager) {
      this.accessibilityManager.destroy();
      this.accessibilityManager = null;
    }

    if (this.particleSystem) {
      this.particleSystem.destroy();
      this.particleSystem = null;
    }

    if (this.titleAnimator) {
      this.titleAnimator.destroy();
      this.titleAnimator = null;
    }

    if (this.buttonAnimator) {
      this.buttonAnimator.destroy();
      this.buttonAnimator = null;
    }

    if (this.themeManager) {
      this.themeManager.destroy();
      this.themeManager = null;
    }

    this.themeToggle = null;

    // 3. 重置状态
    this.state = {
      isInitialized: false,
      isRunning: false,
      isPaused: false,
      currentTheme: 'dark',
      animationSequenceStartTime: 0,
      reducedMotionEnabled: false
    };

    // 4. 清空事件监听器引用
    this.eventListeners = {
      visibilityChange: null,
      resize: null,
      themeChange: null
    };

    console.log('✅ HeroAnimationManager: Destroyed');
  }

  /**
   * 处理主题切换
   * Requirements: 5.2, 5.5
   * @param {string} newTheme - 新主题 ('light' 或 'dark')
   * @param {string} previousTheme - 之前的主题
   */
  onThemeChange(newTheme, previousTheme) {
    this.state.currentTheme = newTheme;

    // 更新粒子系统主题
    if (this.particleSystem) {
      this.particleSystem.setTheme(newTheme);
    }

    // 更新标题动画主题
    if (this.titleAnimator) {
      this.titleAnimator.setTheme(newTheme);
    }

    // 更新按钮动画主题
    if (this.buttonAnimator) {
      this.buttonAnimator.setTheme(newTheme);
    }

    console.log(`🎨 HeroAnimationManager: Theme changed to ${newTheme}`);
  }

  /**
   * 处理页面可见性变化
   * Requirements: 3.6, 10.2, 10.3
   * @param {boolean} isVisible - 页面是否可见
   */
  onVisibilityChange(isVisible) {
    if (!this.state.isRunning) {
      return;
    }

    if (isVisible) {
      // 页面变为可见，恢复动画（如果之前不是手动暂停的）
      if (this.state.isPaused && !this.wasManuallyPaused) {
        this.resume();
      }
    } else {
      // 页面变为不可见，暂停动画以节省资源
      if (!this.state.isPaused) {
        this.wasManuallyPaused = false;
        this.pause();
      } else {
        this.wasManuallyPaused = true;
      }
    }

    console.log(`👁️ HeroAnimationManager: Visibility changed to ${isVisible ? 'visible' : 'hidden'}`);
  }

  /**
   * 处理窗口大小变化
   * Requirements: 4.5
   */
  onResize() {
    // 更新粒子系统画布大小
    if (this.particleSystem) {
      this.particleSystem.resize();
    }

    console.log('📐 HeroAnimationManager: Window resized');
  }

  /**
   * 获取当前状态
   * @returns {Object} 状态对象
   */
  getState() {
    return { ...this.state };
  }

  /**
   * 获取当前主题
   * @returns {string} 'light' 或 'dark'
   */
  getTheme() {
    return this.themeManager ? this.themeManager.getTheme() : this.state.currentTheme;
  }

  /**
   * 获取动画总时长
   * @param {string} theme - 主题
   * @returns {number} 总时长（毫秒）
   */
  getTotalDuration(theme = this.state.currentTheme) {
    return this.config[theme]?.totalDuration || 8000;
  }

  /**
   * 检查动画是否正在运行
   * @returns {boolean}
   */
  isRunning() {
    return this.state.isRunning;
  }

  /**
   * 检查动画是否已暂停
   * @returns {boolean}
   */
  isPaused() {
    return this.state.isPaused;
  }
}

// 导出HeroAnimationManager供其他模块使用
window.HeroAnimationManager = HeroAnimationManager;

// ===================================
// Task 11.2: 加载优化
// 异步初始化动画系统，不阻塞页面渲染
// Requirements: 9.1, 9.2, 9.5
// ===================================

/**
 * 异步初始化Hero动画系统
 * 使用requestIdleCallback或setTimeout确保不阻塞首次内容绘制
 * Requirements: 9.1, 9.2, 9.5
 */
function initHeroAnimationAsync() {
  // 检查是否在首页（有hero-section）
  const heroSection = document.querySelector('.hero-section');

  if (!heroSection) {
    return;
  }

  // 使用requestIdleCallback在浏览器空闲时初始化动画
  // 这确保不会阻塞首次内容绘制（FCP）
  const initAnimation = () => {
    try {
      // 添加js-ready类，启用动画初始状态
      heroSection.classList.add('js-ready');

      // 创建并初始化HeroAnimationManager
      const heroAnimationManager = new HeroAnimationManager(window.HeroAnimationConfig);
      heroAnimationManager.init();

      // 启动动画序列
      heroAnimationManager.start();

      // 导出实例供全局访问
      window.heroAnimationManager = heroAnimationManager;

      // 为了向后兼容，也导出子组件引用
      window.heroThemeManager = heroAnimationManager.themeManager;
      window.heroThemeToggle = heroAnimationManager.themeToggle;
      window.heroParticleSystem = heroAnimationManager.particleSystem;
      window.heroTitleAnimator = heroAnimationManager.titleAnimator;
      window.heroButtonAnimator = heroAnimationManager.buttonAnimator;
      window.heroAccessibilityManager = heroAnimationManager.accessibilityManager;

      console.log('✅ Hero animation initialized asynchronously');
    } catch (error) {
      console.error('❌ Failed to initialize hero animation:', error);
      // 确保内容仍然可见 - 移除js-ready类
      heroSection.classList.remove('js-ready');
      showStaticHeroContent(heroSection);
    }
  };

  // 优先使用requestIdleCallback，回退到setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initAnimation, { timeout: 1000 });
  } else {
    // 使用setTimeout作为回退，延迟50ms以确保DOM渲染完成
    setTimeout(initAnimation, 50);
  }
}

/**
 * 显示静态Hero内容（在动画加载前或加载失败时）
 * Requirements: 9.3, 9.5
 * @param {HTMLElement} heroSection - Hero section元素
 */
function showStaticHeroContent(heroSection) {
  if (!heroSection) return;

  // 确保标题和副标题可见
  const heroTitle = heroSection.querySelector('.hero-title');
  const heroSubtitle = heroSection.querySelector('.hero-subtitle');
  const heroActions = heroSection.querySelector('.hero-actions');

  // 添加静态显示类
  heroSection.classList.add('hero-static-fallback');

  // 设置初始可见状态（CSS会处理动画）
  if (heroTitle) {
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
  }

  if (heroSubtitle) {
    heroSubtitle.style.opacity = '1';
    heroSubtitle.style.transform = 'translateY(0)';
  }

  if (heroActions) {
    heroActions.style.opacity = '1';
    heroActions.style.transform = 'translateY(0)';
  }
}

/**
 * 预加载关键动画资源
 * Requirements: 9.4
 */
function preloadAnimationResources() {
  // 预加载字体（如果尚未加载）
  if ('fonts' in document) {
    document.fonts.load('1em Inter').catch(() => {
      console.warn('Font preload failed, using fallback');
    });
  }
}

// ===================================
// 初始化主题管理系统（使用HeroAnimationManager）
// Task 11.2: 优化加载顺序
// ===================================

// 在DOM加载完成后异步初始化
document.addEventListener('DOMContentLoaded', () => {
  // 预加载资源
  preloadAnimationResources();

  // 异步初始化动画系统
  initHeroAnimationAsync();
});

// ===================================
// Task 4.1: Page Load Animation Module
// CSS fadeInUp 动画 + 交错动画延迟
// Requirements: 1.1, 1.8
// ===================================

class PageLoadAnimationModule {
  constructor() {
    this.animatedElements = [];
    this.hasTriggered = false;
    this.init();
  }

  init() {
    // Collect all elements that should animate on page load
    this.collectAnimatedElements();

    // Set initial state for staggered elements
    this.setInitialState();
  }

  collectAnimatedElements() {
    // Hero section elements
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroActions = document.querySelector('.hero-actions');

    // Content header elements
    const contentHeader = document.querySelector('.content-header');
    const contentTitle = document.querySelector('.content-title');
    const contentSubtitle = document.querySelector('.content-subtitle');

    // Side navigation
    const sideNav = document.querySelector('.side-nav');

    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title');

    // Store elements with their animation config
    if (heroTitle) {
      this.animatedElements.push({
        element: heroTitle,
        animation: 'animate-in',
        delay: 'stagger-slow-1'
      });
    }

    if (heroSubtitle) {
      this.animatedElements.push({
        element: heroSubtitle,
        animation: 'animate-in',
        delay: 'stagger-slow-2'
      });
    }

    if (heroActions) {
      this.animatedElements.push({
        element: heroActions,
        animation: 'animate-in',
        delay: 'stagger-slow-3'
      });
    }

    if (contentTitle) {
      this.animatedElements.push({
        element: contentTitle,
        animation: 'animate-in',
        delay: 'stagger-1'
      });
    }

    if (contentSubtitle) {
      this.animatedElements.push({
        element: contentSubtitle,
        animation: 'animate-in',
        delay: 'stagger-2'
      });
    }

    if (sideNav) {
      // Don't animate side-nav - it should always be visible
      // this.animatedElements.push({
      //   element: sideNav,
      //   animation: 'animate-slide-left',
      //   delay: 'stagger-1'
      // });
    }

    // Add section titles with stagger
    sectionTitles.forEach((title, index) => {
      this.animatedElements.push({
        element: title,
        animation: 'animate-in',
        delay: `stagger-${Math.min(index + 1, 8)}`
      });
    });
  }

  setInitialState() {
    // Set opacity to 0 for elements that will animate
    this.animatedElements.forEach(({ element, delay }) => {
      if (element) {
        element.style.opacity = '0';
        element.classList.add(delay);
      }
    });
  }

  triggerAnimations() {
    if (this.hasTriggered) return;
    this.hasTriggered = true;

    // Small delay to ensure CSS is loaded
    requestAnimationFrame(() => {
      this.animatedElements.forEach(({ element, animation }) => {
        if (element) {
          element.classList.add(animation);
          // Remove inline opacity after animation starts
          setTimeout(() => {
            element.style.opacity = '';
          }, 50);
        }
      });
    });
  }
}

// ===================================
// Task 4.2: Scroll Animation Module
// Intersection Observer API
// Requirements: 1.2, 1.7
// ===================================

class ScrollAnimationModule {
  constructor() {
    this.observer = null;
    this.observedElements = new Set();
    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      this.showAllElements();
      return;
    }

    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '50px 0px -50px 0px', // Trigger earlier for better UX
      threshold: 0.05 // Trigger when 5% of element is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          // Unobserve after animation to improve performance
          this.observer.unobserve(entry.target);
          this.observedElements.delete(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    // Select all elements with scroll animation classes
    const scrollAnimateElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger'
    );

    // Also observe tool cards, portfolio items, service cards
    const contentElements = document.querySelectorAll(
      '.tool-card, .portfolio-item, .service-card, .about-content, .stat-item'
    );

    // Add scroll-animate class to content elements if not present
    contentElements.forEach(el => {
      if (!el.classList.contains('scroll-animate') &&
        !el.classList.contains('scroll-animate-left') &&
        !el.classList.contains('scroll-animate-right') &&
        !el.classList.contains('scroll-animate-scale') &&
        !el.classList.contains('scroll-animate-stagger')) {
        el.classList.add('scroll-animate');
      }
    });

    // Re-select all scroll animate elements
    const allAnimateElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger'
    );

    // Add stagger delays to grid items
    this.addStaggerDelays();

    // Observe all elements
    allAnimateElements.forEach(el => {
      this.observedElements.add(el);
      this.observer.observe(el);
    });

    // Immediately show elements that are already in viewport
    this.showElementsInViewport(allAnimateElements);
  }

  showElementsInViewport(elements) {
    // Check each element and show if already in viewport
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // If element is in viewport (with some margin)
      if (rect.top < windowHeight + 100 && rect.bottom > -100) {
        this.animateElement(el);
        if (this.observer) {
          this.observer.unobserve(el);
        }
        this.observedElements.delete(el);
      }
    });
  }

  addStaggerDelays() {
    // Disabled: Don't add scroll-animate-stagger to tool cards
    // This was causing cards to be hidden (opacity: 0)
    // Tool cards are now always visible by default

    // Only add stagger to portfolio items (if they exist)
    const portfolioGrids = document.querySelectorAll('.portfolio-grid');
    portfolioGrids.forEach(grid => {
      const items = grid.querySelectorAll('.portfolio-item');
      items.forEach((item, index) => {
        const delay = (index % 6) + 1;
        item.setAttribute('data-delay', delay);
        item.classList.add('scroll-animate-stagger');
      });
    });

    // Add stagger to service cards (if they exist)
    const serviceGrids = document.querySelectorAll('.services-grid');
    serviceGrids.forEach(grid => {
      const cards = grid.querySelectorAll('.service-card');
      cards.forEach((card, index) => {
        const delay = (index % 4) + 1;
        card.setAttribute('data-delay', delay);
        card.classList.add('scroll-animate-stagger');
      });
    });
  }

  animateElement(element) {
    // Add visible class to trigger CSS transition
    element.classList.add('visible');

    // Also add section title animation
    const sectionTitle = element.closest('.tool-section, section')?.querySelector('.section-title');
    if (sectionTitle && !sectionTitle.classList.contains('visible')) {
      sectionTitle.classList.add('visible');
    }
  }

  showAllElements() {
    // Fallback for browsers without IntersectionObserver
    const elements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger'
    );
    elements.forEach(el => el.classList.add('visible'));
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.observedElements.clear();
  }
}

// ===================================
// Task 5.2: Lazy Load Module
// 使用 loading="lazy" 属性 + 占位符和加载状态
// Requirements: 3.3
// ===================================

class LazyLoadModule {
  constructor() {
    this.observer = null;
    this.loadedImages = new Set();
    this.placeholderColor = '#f5f5f5';

    // Configuration
    this.config = {
      rootMargin: '50px 0px',
      threshold: 0.01,
      fadeInDuration: 300
    };

    this.init();
  }

  init() {
    // Process all images with loading="lazy"
    this.processLazyImages();

    // Set up Intersection Observer for enhanced lazy loading
    this.setupObserver();

    // Handle images that fail to load
    this.setupErrorHandling();
  }

  // ===================================
  // Process Lazy Images
  // ===================================

  processLazyImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(img => {
      // Skip already processed images
      if (img.dataset.lazyProcessed) return;

      // Mark as processed
      img.dataset.lazyProcessed = 'true';

      // Add loading state class
      img.classList.add('lazy-image');

      // Create and add placeholder wrapper if not exists
      this.wrapWithPlaceholder(img);

      // Set up load event listener
      this.setupLoadListener(img);
    });
  }

  // ===================================
  // Placeholder Wrapper
  // ===================================

  wrapWithPlaceholder(img) {
    // Check if already wrapped
    if (img.parentElement?.classList.contains('lazy-image-wrapper')) return;

    // Get image dimensions
    const width = img.getAttribute('width') || img.naturalWidth || 400;
    const height = img.getAttribute('height') || img.naturalHeight || 300;
    const aspectRatio = (height / width) * 100;

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'lazy-image-wrapper';
    wrapper.style.cssText = `
      position: relative;
      overflow: hidden;
      background-color: ${this.placeholderColor};
    `;

    // Create placeholder with aspect ratio
    const placeholder = document.createElement('div');
    placeholder.className = 'lazy-image-placeholder';
    placeholder.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
      transition: opacity ${this.config.fadeInDuration}ms ease;
    `;

    // Add loading spinner
    placeholder.innerHTML = `
      <div class="lazy-loading-spinner" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    `;

    // Only wrap if parent allows it (not already in a special container)
    const parent = img.parentElement;
    if (parent && !parent.classList.contains('tool-card-image') &&
      !parent.classList.contains('portfolio-image')) {
      // Insert wrapper
      parent.insertBefore(wrapper, img);
      wrapper.appendChild(placeholder);
      wrapper.appendChild(img);
    } else {
      // Just add placeholder to existing container
      if (parent && !parent.querySelector('.lazy-image-placeholder')) {
        parent.style.position = 'relative';
        parent.insertBefore(placeholder, img);
      }
    }

    // Set initial image styles
    img.style.cssText = `
      opacity: 0;
      transition: opacity ${this.config.fadeInDuration}ms ease;
    `;
  }

  // ===================================
  // Load Event Listener
  // ===================================

  setupLoadListener(img) {
    // Handle successful load
    const onLoad = () => {
      this.handleImageLoaded(img);
      img.removeEventListener('load', onLoad);
    };

    // Check if already loaded (cached)
    if (img.complete && img.naturalHeight !== 0) {
      this.handleImageLoaded(img);
    } else {
      img.addEventListener('load', onLoad);
    }
  }

  handleImageLoaded(img) {
    // Skip if already processed
    if (this.loadedImages.has(img)) return;
    this.loadedImages.add(img);

    // Fade in the image
    requestAnimationFrame(() => {
      img.style.opacity = '1';
      img.classList.add('lazy-loaded');
      img.classList.remove('lazy-image');
    });

    // Remove placeholder
    const placeholder = img.parentElement?.querySelector('.lazy-image-placeholder');
    if (placeholder) {
      placeholder.style.opacity = '0';
      setTimeout(() => {
        placeholder.remove();
      }, this.config.fadeInDuration);
    }

    // Dispatch custom event
    img.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
  }

  // ===================================
  // Intersection Observer for Enhanced Loading
  // ===================================

  setupObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      this.loadAllImages();
      return;
    }

    const options = {
      root: null,
      rootMargin: this.config.rootMargin,
      threshold: this.config.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.triggerLoad(img);
          this.observer.unobserve(img);
        }
      });
    }, options);

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (!this.loadedImages.has(img)) {
        this.observer.observe(img);
      }
    });
  }

  triggerLoad(img) {
    // If image has data-src, swap it
    const dataSrc = img.dataset.src;
    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-src');
    }

    // Add animation class
    img.classList.add('lazy-loading');
  }

  // ===================================
  // Error Handling
  // ===================================

  setupErrorHandling() {
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG' && e.target.loading === 'lazy') {
        this.handleImageError(e.target);
      }
    }, true);
  }

  handleImageError(img) {
    // Add error class
    img.classList.add('lazy-error');
    img.classList.remove('lazy-loading', 'lazy-image');

    // Create error placeholder
    const errorPlaceholder = document.createElement('div');
    errorPlaceholder.className = 'lazy-error-placeholder';
    errorPlaceholder.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
      <span>图片加载失败</span>
    `;
    errorPlaceholder.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #f5f5f5;
      color: #999;
      font-size: 12px;
    `;

    // Replace placeholder
    const existingPlaceholder = img.parentElement?.querySelector('.lazy-image-placeholder');
    if (existingPlaceholder) {
      existingPlaceholder.replaceWith(errorPlaceholder);
    } else if (img.parentElement) {
      img.parentElement.style.position = 'relative';
      img.parentElement.appendChild(errorPlaceholder);
    }

    // Hide broken image
    img.style.display = 'none';

    // Log error for debugging
    console.warn('Image failed to load:', img.src);
  }

  // ===================================
  // Fallback for browsers without IntersectionObserver
  // ===================================

  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      this.triggerLoad(img);
    });
  }

  // ===================================
  // Public Methods
  // ===================================

  // Manually trigger lazy loading for dynamically added images
  refresh() {
    this.processLazyImages();

    if (this.observer) {
      const newImages = document.querySelectorAll('img[loading="lazy"]:not(.lazy-loaded)');
      newImages.forEach(img => {
        if (!this.loadedImages.has(img)) {
          this.observer.observe(img);
        }
      });
    }
  }

  // ===================================
  // Cleanup
  // ===================================

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.loadedImages.clear();
  }
}

// ===================================
// Task 4.3 & 5.1: Side Navigation Module (Refactored)
// 子菜单展开/收起动画 + 悬停过渡效果
// 导航菜单展开/收起逻辑 + 滚动监听和高亮当前区域 + 移动端导航切换
// Requirements: 1.3, 1.4, 2.1
// ===================================

class SideNavigationModule {
  constructor() {
    // DOM Elements
    this.sideNav = document.querySelector('.side-nav');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileOverlay = document.querySelector('.mobile-overlay');
    this.submenuToggles = document.querySelectorAll('.nav-item.has-submenu');
    this.navItems = document.querySelectorAll('.nav-item:not(.has-submenu), .submenu-item');
    this.submenus = document.querySelectorAll('.submenu');

    // State
    this.isOpen = false;
    this.activeSection = null;
    this.scrollSpyObserver = null;
    this.resizeHandler = null;
    this.scrollHandler = null;
    this.isScrolling = false;
    this.scrollTimeout = null;

    // Configuration
    this.config = {
      mobileBreakpoint: 768,
      scrollSpyOffset: 100,
      animationDuration: 300,
      debounceDelay: 150
    };

    this.init();
  }

  init() {
    if (!this.sideNav) return;

    this.bindEvents();
    this.initActiveState();
    this.initScrollSpy();
    this.initKeyboardNavigation();
  }

  // ===================================
  // Event Binding
  // ===================================

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', this.handleMobileToggleClick.bind(this));
    }

    // Mobile overlay click to close
    if (this.mobileOverlay) {
      this.mobileOverlay.addEventListener('click', this.closeMobileNav.bind(this));
    }

    // Submenu toggles with animation
    this.submenuToggles.forEach(toggle => {
      console.log('[SideNav] Binding click event to:', toggle);
      toggle.addEventListener('click', (e) => this.toggleSubmenu(e, toggle));

      // Keyboard support for submenu toggles
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleSubmenu(e, toggle);
        }
        // Arrow key navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          this.handleArrowNavigation(e, toggle);
        }
      });
    });

    // Nav item clicks
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavClick(e, item));
    });

    // Close mobile nav on escape
    document.addEventListener('keydown', this.handleEscapeKey.bind(this));

    // Handle resize events
    this.resizeHandler = Utils.debounce(() => {
      if (window.innerWidth >= this.config.mobileBreakpoint && this.isOpen) {
        this.closeMobileNav();
      }
    }, this.config.debounceDelay);
    window.addEventListener('resize', this.resizeHandler);

    // Handle hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
  }

  // ===================================
  // Mobile Navigation Toggle (Task 5.1)
  // Requirements: 2.1
  // ===================================

  handleMobileToggleClick(e) {
    e.preventDefault();
    this.toggleMobileNav();
  }

  toggleMobileNav() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.openMobileNav();
    } else {
      this.closeMobileNav();
    }
  }

  openMobileNav() {
    this.isOpen = true;

    // Update toggle button with animation
    if (this.mobileToggle) {
      this.mobileToggle.classList.add('active');
      this.mobileToggle.setAttribute('aria-expanded', 'true');
      this.animateHamburgerToX();
    }

    // Show nav with slide animation
    if (this.sideNav) {
      this.sideNav.classList.add('open');
      this.sideNav.setAttribute('aria-hidden', 'false');
    }

    // Show overlay with fade animation
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.add('visible');
      this.mobileOverlay.setAttribute('aria-hidden', 'false');
    }

    // Prevent body scroll
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';

    // Focus first nav item for accessibility
    this.focusFirstNavItem();

    // Trap focus within nav
    this.trapFocus();
  }

  closeMobileNav() {
    this.isOpen = false;

    // Update toggle button with animation
    if (this.mobileToggle) {
      this.mobileToggle.classList.remove('active');
      this.mobileToggle.setAttribute('aria-expanded', 'false');
      this.animateXToHamburger();
    }

    // Hide nav with slide animation
    if (this.sideNav) {
      this.sideNav.classList.remove('open');
      this.sideNav.setAttribute('aria-hidden', 'true');
    }

    // Hide overlay with fade animation
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.remove('visible');
      this.mobileOverlay.setAttribute('aria-hidden', 'true');
    }

    // Restore body scroll
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';

    // Return focus to toggle
    if (this.mobileToggle) {
      this.mobileToggle.focus();
    }

    // Release focus trap
    this.releaseFocusTrap();
  }

  // Hamburger animation to X
  animateHamburgerToX() {
    const spans = this.mobileToggle?.querySelectorAll('span');
    if (!spans || spans.length < 3) return;

    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  }

  // X animation back to hamburger
  animateXToHamburger() {
    const spans = this.mobileToggle?.querySelectorAll('span');
    if (!spans || spans.length < 3) return;

    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  // ===================================
  // Submenu Expand/Collapse (Task 5.1)
  // Requirements: 1.4
  // ===================================

  toggleSubmenu(e, toggle) {
    console.log('[SideNav] toggleSubmenu called', toggle);
    e.preventDefault();
    e.stopPropagation();

    const submenuId = toggle.getAttribute('aria-controls');
    const submenu = submenuId ? document.getElementById(submenuId) : toggle.nextElementSibling;

    if (!submenu || !submenu.classList.contains('submenu')) {
      console.log('[SideNav] submenu not found or invalid');
      return;
    }

    // 使用 expanded 类作为主要判断依据
    const isExpanded = toggle.classList.contains('expanded');

    console.log('[SideNav] Current state - isExpanded:', isExpanded);
    console.log('[SideNav] Toggle classes:', toggle.classList.toString());
    console.log('[SideNav] Submenu classes:', submenu.classList.toString());

    if (isExpanded) {
      console.log('[SideNav] Will collapse');
      this.collapseSubmenu(toggle, submenu);
    } else {
      console.log('[SideNav] Will expand');
      this.expandSubmenu(toggle, submenu);
    }
  }

  expandSubmenu(toggle, submenu) {
    console.log('[SideNav] expandSubmenu called');

    // Get the natural height of the submenu
    submenu.style.height = 'auto';
    const height = submenu.scrollHeight;
    submenu.style.height = '0';

    console.log('[SideNav] Setting height from 0 to', height);

    // Force reflow
    submenu.offsetHeight;

    // Animate to full height
    submenu.style.height = height + 'px';

    // Update classes and ARIA
    toggle.classList.add('expanded');
    toggle.setAttribute('aria-expanded', 'true');
    submenu.classList.add('expanded');

    // Update arrow rotation - 展开时箭头向上（180度）
    const arrow = toggle.querySelector('.nav-item-arrow');
    if (arrow) {
      console.log('[SideNav] Rotating arrow to 180deg (up)');
      arrow.style.transform = 'rotate(180deg)';
    }

    // Remove height after animation completes
    setTimeout(() => {
      submenu.style.height = 'auto';
      console.log('[SideNav] Expand animation complete');
    }, this.config.animationDuration);
  }

  collapseSubmenu(toggle, submenu) {
    console.log('[SideNav] collapseSubmenu called');

    // Set explicit height for animation
    const currentHeight = submenu.scrollHeight;
    submenu.style.height = currentHeight + 'px';

    console.log('[SideNav] Setting height from', currentHeight, 'to 0');

    // Force reflow
    submenu.offsetHeight;

    // Animate to 0
    submenu.style.height = '0';

    // Update classes and ARIA
    toggle.classList.remove('expanded');
    toggle.setAttribute('aria-expanded', 'false');

    // Update arrow rotation - 收起时箭头向下（0度）
    const arrow = toggle.querySelector('.nav-item-arrow');
    if (arrow) {
      console.log('[SideNav] Rotating arrow to 0deg (down)');
      arrow.style.transform = 'rotate(0deg)';
    }

    // Remove expanded class after animation
    setTimeout(() => {
      submenu.classList.remove('expanded');
      console.log('[SideNav] Collapse animation complete');
    }, this.config.animationDuration);
  }

  // ===================================
  // Navigation Click Handling
  // ===================================

  handleNavClick(e, item) {
    // Update active state
    this.setActiveItem(item);

    // Close mobile nav after click on mobile
    if (window.innerWidth < this.config.mobileBreakpoint) {
      setTimeout(() => this.closeMobileNav(), 150);
    }

    // Update page title if on tools page
    this.updatePageTitle(item);

    // Smooth scroll to section
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      this.scrollToSection(href.substring(1));
    }
  }

  setActiveItem(item) {
    // Remove active from all items
    this.navItems.forEach(navItem => navItem.classList.remove('active'));
    this.submenuToggles.forEach(toggle => toggle.classList.remove('active'));

    // Add active to clicked item with animation
    item.classList.add('active');

    // If it's a submenu item, also highlight parent
    const parentSubmenu = item.closest('.submenu');
    if (parentSubmenu) {
      const parentToggle = parentSubmenu.previousElementSibling;
      if (parentToggle && parentToggle.classList.contains('has-submenu')) {
        parentToggle.classList.add('active');

        // Ensure parent submenu is expanded
        if (!parentToggle.classList.contains('expanded')) {
          this.expandSubmenu(parentToggle, parentSubmenu);
        }
      }
    }
  }

  updatePageTitle(item) {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle && item.textContent) {
      const newTitle = item.textContent.trim();

      // Animate title change
      pageTitle.style.opacity = '0';
      pageTitle.style.transform = 'translateY(-10px)';

      setTimeout(() => {
        pageTitle.textContent = newTitle;
        pageTitle.style.opacity = '1';
        pageTitle.style.transform = 'translateY(0)';

        // Announce navigation change for screen readers
        if (window.CreativeStudioApp && window.CreativeStudioApp.accessibilityEnhancements) {
          window.CreativeStudioApp.accessibilityEnhancements.announceNavigation(newTitle);
        }
      }, 150);
    }
  }

  // ===================================
  // Scroll to Section with Smooth Animation
  // ===================================

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
    const targetPosition = section.offsetTop - headerHeight - 20;

    // Mark as programmatic scroll to prevent scroll spy interference
    this.isScrolling = true;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Reset scrolling flag after animation
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.isScrolling = false;
    }, 1000);

    // Update URL hash without triggering scroll
    history.pushState(null, null, `#${sectionId}`);
  }

  // ===================================
  // Initial Active State
  // ===================================

  initActiveState() {
    // Set initial active state based on URL hash
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      const activeItem = document.querySelector(
        `.submenu-item[href="${hash}"], .nav-item[href="${hash}"], ` +
        `.submenu-item[data-section="${sectionId}"], .nav-item[data-section="${sectionId}"]`
      );

      if (activeItem) {
        this.setActiveItem(activeItem);
      }
    } else {
      // Default to first item
      const firstItem = this.sideNav?.querySelector('.submenu-item, .nav-item:not(.has-submenu)');
      if (firstItem) {
        this.setActiveItem(firstItem);
      }
    }
  }

  // ===================================
  // Scroll Spy - Highlight Current Section (Task 5.1)
  // Requirements: 1.4
  // ===================================

  initScrollSpy() {
    // Get all sections with IDs
    const sections = document.querySelectorAll('.tool-section[id], section[id]');

    if (sections.length === 0) return;

    // Use Intersection Observer for efficient scroll detection
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      // Skip if programmatic scrolling
      if (this.isScrolling) return;

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          const sectionId = entry.target.id;

          // Find corresponding nav item
          const navItem = document.querySelector(
            `.submenu-item[href="#${sectionId}"], .nav-item[href="#${sectionId}"], ` +
            `.submenu-item[data-section="${sectionId}"], .nav-item[data-section="${sectionId}"]`
          );

          if (navItem && sectionId !== this.activeSection) {
            this.activeSection = sectionId;
            this.setActiveItem(navItem);

            // Update URL hash silently
            if (history.replaceState) {
              history.replaceState(null, null, `#${sectionId}`);
            }
          }
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => this.scrollSpyObserver.observe(section));
  }

  // ===================================
  // Keyboard Navigation (Accessibility)
  // ===================================

  initKeyboardNavigation() {
    this.sideNav?.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
  }

  handleKeyboardNavigation(e) {
    const focusableItems = this.sideNav.querySelectorAll(
      '.nav-item, .submenu-item, button'
    );
    const currentIndex = Array.from(focusableItems).indexOf(document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < focusableItems.length - 1) {
          focusableItems[currentIndex + 1].focus();
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          focusableItems[currentIndex - 1].focus();
        }
        break;

      case 'Home':
        e.preventDefault();
        focusableItems[0]?.focus();
        break;

      case 'End':
        e.preventDefault();
        focusableItems[focusableItems.length - 1]?.focus();
        break;
    }
  }

  handleArrowNavigation(e, toggle) {
    const submenu = toggle.nextElementSibling;
    if (!submenu) return;

    if (e.key === 'ArrowDown' && toggle.classList.contains('expanded')) {
      const firstItem = submenu.querySelector('.submenu-item');
      firstItem?.focus();
    }
  }

  handleEscapeKey(e) {
    if (e.key === 'Escape' && this.isOpen) {
      this.closeMobileNav();
    }
  }

  handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      const navItem = document.querySelector(
        `.submenu-item[href="${hash}"], .nav-item[href="${hash}"]`
      );

      if (navItem) {
        this.setActiveItem(navItem);
      }
    }
  }

  // ===================================
  // Focus Management
  // ===================================

  focusFirstNavItem() {
    const firstNavItem = this.sideNav?.querySelector('.nav-item, .submenu-item');
    if (firstNavItem) {
      setTimeout(() => firstNavItem.focus(), this.config.animationDuration);
    }
  }

  trapFocus() {
    if (!this.sideNav) return;

    const focusableElements = this.sideNav.querySelectorAll(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.sideNav.addEventListener('keydown', this.focusTrapHandler);
  }

  releaseFocusTrap() {
    if (this.focusTrapHandler && this.sideNav) {
      this.sideNav.removeEventListener('keydown', this.focusTrapHandler);
      this.focusTrapHandler = null;
    }
  }

  // ===================================
  // Cleanup
  // ===================================

  destroy() {
    // Disconnect scroll spy observer
    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
      this.scrollSpyObserver = null;
    }

    // Remove resize handler
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    // Clear timeouts
    clearTimeout(this.scrollTimeout);

    // Release focus trap
    this.releaseFocusTrap();

    // Reset state
    this.isOpen = false;
    document.body.style.overflow = '';
    document.body.classList.remove('nav-open');
  }
}

// ===================================
// Portfolio Filter Module
// ===================================

class PortfolioFilter {
  constructor() {
    this.filterContainer = document.querySelector('.portfolio-filter');
    this.activeFilter = 'all';

    this.init();
  }

  init() {
    // Don't bind events here - let index.html inline script handle filtering
    // This class is kept for compatibility but filtering is handled by inline script
  }

  // Get current filter buttons (may be regenerated)
  get filterButtons() {
    return this.filterContainer ? this.filterContainer.querySelectorAll('.filter-btn') : [];
  }

  // Get current portfolio items (may be regenerated)
  get portfolioItems() {
    return document.querySelectorAll('.portfolio-item');
  }
}

// ===================================
// Smooth Scroll Module
// ===================================

class SmoothScrollModule {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      this.scrollToElement(target);
    });
  }

  scrollToElement(element) {
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// ===================================
// Form Module
// ===================================

class FormModule {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      this.enhanceForm(form);
    });
  }

  enhanceForm(form) {
    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
      if (!this.validateForm(form)) {
        e.preventDefault();
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = '此字段为必填项';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = '请输入有效的邮箱地址';
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = '请输入有效的电话号码';
      }
    }

    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }

  validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  showFieldValidation(field, isValid, message) {
    // Remove existing error
    this.clearFieldError(field);

    if (!isValid) {
      field.classList.add('error');

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.setAttribute('role', 'alert');

      field.parentNode.appendChild(errorElement);
    }
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// ===================================
// Utility Functions
// ===================================

const Utils = {
  // Debounce function
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Get scroll position
  getScrollPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  },

  // Animate element
  animate(element, keyframes, options = {}) {
    if ('animate' in element) {
      return element.animate(keyframes, {
        duration: 300,
        easing: 'ease-out',
        fill: 'forwards',
        ...options
      });
    }

    // Fallback for browsers without Web Animations API
    return new Promise(resolve => {
      element.style.transition = `all ${options.duration || 300}ms ${options.easing || 'ease-out'}`;

      Object.keys(keyframes[keyframes.length - 1]).forEach(prop => {
        element.style[prop] = keyframes[keyframes.length - 1][prop];
      });

      setTimeout(resolve, options.duration || 300);
    });
  }
};

// ===================================
// Performance Monitoring (Web Vitals)
// ===================================

class WebVitalsMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    this.measureCLS();
    this.measureFID();
    this.measureLCP();

    // Monitor custom metrics
    this.measurePageLoadTime();
    this.measureResourceLoadTime();
  }

  measureCLS() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    }
  }

  measureFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
    }
  }

  measureLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    }
  }

  measurePageLoadTime() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
    });
  }

  measureResourceLoadTime() {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      this.metrics.resourceLoadTime = resources.reduce((total, resource) => {
        return total + (resource.responseEnd - resource.startTime);
      }, 0);
    });
  }

  getMetrics() {
    return this.metrics;
  }

  logMetrics() {
    console.group('📊 Performance Metrics');
    console.log('CLS (Cumulative Layout Shift):', this.metrics.cls);
    console.log('FID (First Input Delay):', this.metrics.fid, 'ms');
    console.log('LCP (Largest Contentful Paint):', this.metrics.lcp, 'ms');
    console.log('Page Load Time:', this.metrics.pageLoadTime, 'ms');
    console.log('Resource Load Time:', this.metrics.resourceLoadTime, 'ms');
    console.groupEnd();
  }
}

// ===================================
// Error Handling
// ===================================

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });
  }

  logError(type, error) {
    console.group(`❌ ${type}`);
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.error('Timestamp:', new Date().toISOString());
    console.groupEnd();

    // In production, you might want to send errors to a logging service
    // this.sendErrorToService(type, error);
  }

  sendErrorToService(type, error) {
    // Implementation for error reporting service
    // e.g., Sentry, LogRocket, etc.
  }
}

// ===================================
// Task 9: Accessibility Enhancements
// 添加 ARIA 标签 + 实现键盘导航 + 确保颜色对比度 + 添加图片 alt 文本
// Requirements: 9.1, 9.2, 9.3, 9.4
// ===================================

class AccessibilityEnhancements {
  constructor() {
    this.liveRegion = null;
    this.focusableElements = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.init();
  }

  init() {
    this.setupLiveRegion();
    this.enhanceKeyboardNavigation();
    this.enhanceCardAccessibility();
    this.enhanceImageAccessibility();
    this.setupReducedMotion();
    this.enhanceFormAccessibility();
    this.setupFocusManagement();
  }

  setupLiveRegion() {
    this.liveRegion = document.getElementById('aria-live-region');

    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.id = 'aria-live-region';
      this.liveRegion.className = 'aria-live-region';
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.liveRegion);
    }
  }

  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 3000);
  }

  enhanceKeyboardNavigation() {
    this.setupRovingTabindex('.tool-grid', '.tool-card');
    this.setupRovingTabindex('.portfolio-grid', '.portfolio-item');
    this.setupRovingTabindex('.services-grid', '.service-card');
    this.setupKeyboardShortcuts();
    this.enhanceFilterButtons();
  }

  setupRovingTabindex(containerSelector, itemSelector) {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const items = container.querySelectorAll(itemSelector);
      if (items.length === 0) return;
      items.forEach((item, index) => {
        item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        item.setAttribute('role', 'listitem');
      });
      container.setAttribute('role', 'list');
      container.addEventListener('keydown', (e) => {
        const currentItem = document.activeElement;
        const currentIndex = Array.from(items).indexOf(currentItem);
        if (currentIndex === -1) return;
        let nextIndex = currentIndex;
        const columns = this.getGridColumns(container);
        switch (e.key) {
          case 'ArrowRight': e.preventDefault(); nextIndex = Math.min(currentIndex + 1, items.length - 1); break;
          case 'ArrowLeft': e.preventDefault(); nextIndex = Math.max(currentIndex - 1, 0); break;
          case 'ArrowDown': e.preventDefault(); nextIndex = Math.min(currentIndex + columns, items.length - 1); break;
          case 'ArrowUp': e.preventDefault(); nextIndex = Math.max(currentIndex - columns, 0); break;
          case 'Home': e.preventDefault(); nextIndex = 0; break;
          case 'End': e.preventDefault(); nextIndex = items.length - 1; break;
          case 'Enter': case ' ': e.preventDefault(); const link = currentItem.querySelector('a'); if (link) link.click(); return;
          default: return;
        }
        items[currentIndex].setAttribute('tabindex', '-1');
        items[nextIndex].setAttribute('tabindex', '0');
        items[nextIndex].focus();
      });
    });
  }

  getGridColumns(container) {
    const items = container.querySelectorAll('.tool-card, .portfolio-item, .service-card');
    if (items.length < 2) return 1;
    const firstItemTop = items[0].getBoundingClientRect().top;
    let columns = 1;
    for (let i = 1; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top === firstItemTop) columns++;
      else break;
    }
    return columns;
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) { searchInput.focus(); this.announce('搜索框已获得焦点'); }
      }
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        const nav = document.querySelector('.side-nav, .nav-menu');
        if (nav) { const firstLink = nav.querySelector('a, button'); if (firstLink) { firstLink.focus(); this.announce('导航已获得焦点'); } }
      }
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) { main.setAttribute('tabindex', '-1'); main.focus(); this.announce('主要内容区域已获得焦点'); }
      }
      if (e.key === 'Escape') {
        const mobileOverlay = document.querySelector('.mobile-overlay.visible');
        if (mobileOverlay) { const toggle = document.querySelector('.mobile-menu-toggle'); if (toggle) toggle.click(); }
      }
    });
  }

  enhanceFilterButtons() {
    const filterContainer = document.querySelector('.portfolio-filter, .filter-bar');
    if (!filterContainer) return;

    // Prevent duplicate event binding
    if (filterContainer.dataset.a11yEnhanced) return;
    filterContainer.dataset.a11yEnhanced = 'true';

    // Use event delegation for keyboard navigation
    filterContainer.addEventListener('keydown', (e) => {
      const buttons = filterContainer.querySelectorAll('.filter-btn');
      const currentButton = document.activeElement;
      const currentIndex = Array.from(buttons).indexOf(currentButton);
      if (currentIndex === -1) return;
      let nextIndex = currentIndex;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': e.preventDefault(); nextIndex = (currentIndex + 1) % buttons.length; break;
        case 'ArrowLeft': case 'ArrowUp': e.preventDefault(); nextIndex = (currentIndex - 1 + buttons.length) % buttons.length; break;
        case 'Home': e.preventDefault(); nextIndex = 0; break;
        case 'End': e.preventDefault(); nextIndex = buttons.length - 1; break;
        default: return;
      }
      buttons[nextIndex].focus();
    });

    // Use event delegation for click announcements
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (btn) {
        this.announce(`已筛选: ${btn.textContent.trim()}`);
      }
    });
  }

  enhanceCardAccessibility() {
    const cards = document.querySelectorAll('.tool-card, .portfolio-item, .service-card');
    cards.forEach(card => {
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const link = card.querySelector('a'); if (link) link.click(); }
      });
      if (!card.hasAttribute('aria-label')) {
        const title = card.querySelector('.tool-card-title, .portfolio-title, .service-title');
        if (title) card.setAttribute('aria-label', title.textContent.trim());
      }
    });
  }

  enhanceImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        const card = img.closest('.tool-card, .portfolio-item');
        if (card) {
          const title = card.querySelector('.tool-card-title, .portfolio-title');
          if (title) img.setAttribute('alt', `${title.textContent.trim()} 的图片`);
          else { img.setAttribute('alt', ''); img.setAttribute('role', 'presentation'); }
        } else { img.setAttribute('alt', ''); img.setAttribute('role', 'presentation'); }
      }
    });
    const decorativeIcons = document.querySelectorAll('.service-icon svg, .tool-card-link-arrow, .nav-item-arrow');
    decorativeIcons.forEach(icon => { if (!icon.hasAttribute('aria-hidden')) icon.setAttribute('aria-hidden', 'true'); });
  }

  setupReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotion = (e) => {
      if (e.matches) { document.body.classList.add('reduced-motion'); this.announce('动画已减少以适应您的偏好设置'); }
      else document.body.classList.remove('reduced-motion');
    };
    handleReducedMotion(prefersReducedMotion);
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
  }

  enhanceFormAccessibility() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const id = input.id;
        if (id) {
          const label = form.querySelector(`label[for="${id}"]`);
          if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
            const placeholder = input.getAttribute('placeholder');
            if (placeholder) input.setAttribute('aria-label', placeholder);
          }
        }
        if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) input.setAttribute('aria-required', 'true');
      });
    });
  }

  setupFocusManagement() {
    let lastFocusedElement = null;
    document.addEventListener('focusin', (e) => { lastFocusedElement = e.target; });
    this.restoreFocus = () => { if (lastFocusedElement && document.body.contains(lastFocusedElement)) lastFocusedElement.focus(); };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'hidden') {
          const target = mutation.target;
          if (!target.hidden && target.matches('[role="region"], [role="tabpanel"], section')) {
            const firstFocusable = target.querySelector(this.focusableElements);
            if (firstFocusable) firstFocusable.focus();
          }
        }
      });
    });
    const sections = document.querySelectorAll('[role="region"], [role="tabpanel"], section');
    sections.forEach(section => { observer.observe(section, { attributes: true }); });
  }

  announceNavigation(sectionName) { this.announce(`已导航到 ${sectionName} 部分`); }
  announceLoading(isLoading, context = '') {
    if (isLoading) this.announce(`正在加载${context}...`, 'polite');
    else this.announce(`${context}加载完成`, 'polite');
  }
  announceError(message) { this.announce(`错误: ${message}`, 'assertive'); }
}

// ===================================
// AI Tools Loading for Tools Page
// ===================================

const categoryNames = {
  workflow: '工作流平台',
  llm: '大语言模型',
  txt2img: '文生图',
  txt2vid: '文生视频',
  img2x: '图生图/视频',
  onestop: '一站式AI',
  design: '设计(UI/Logo)',
  marketing: '市场营销/电商',
  coding: '编程/运维',
  crawler: '爬虫/OSINT',
  data: '数据分析',
  voice: '声音克隆/TTS',
  '3d': 'AI 3D建模',
  frontend: '前端资源库',
  academic: '学术论文',
  solopreneur: '一人公司'
};

const categoryDescriptions = {
  workflow: '自动化工作流和AI编排平台',
  llm: '主流大语言模型和对话AI',
  txt2img: 'AI图像生成工具',
  txt2vid: 'AI视频生成工具',
  img2x: '图像转换和增强工具',
  onestop: '综合性AI平台',
  design: 'AI设计和创意工具',
  marketing: 'AI营销和电商工具',
  coding: 'AI编程和开发工具',
  crawler: '数据采集和情报工具',
  data: 'AI数据分析工具',
  voice: 'AI语音合成和克隆',
  '3d': 'AI 3D建模和生成',
  frontend: '前端开发资源',
  academic: '学术研究和论文工具',
  solopreneur: '一人公司必备工具 - 从创意到盈利的完整工具链'
};

async function loadAITools() {
  console.log('[Tools] loadAITools called');
  const container = document.getElementById('ai-tools-container');
  const loading = document.getElementById('tools-loading');

  console.log('[Tools] Container found:', !!container, 'Loading element:', !!loading);

  if (!container) {
    console.log('[Tools] No container found, returning');
    return;
  }

  try {
    console.log('[Tools] Fetching /api/tools...');
    const response = await fetch('/api/tools');
    if (!response.ok) throw new Error('Failed to fetch tools');

    const data = await response.json();
    console.log('[Tools] Data received, tools count:', data.tools?.length || 0);
    const tools = data.tools || [];

    // Group tools by category
    const grouped = {};
    tools.forEach(tool => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push(tool);
    });

    // Define category order
    const categoryOrder = ['llm', 'workflow', 'txt2img', 'txt2vid', 'img2x', 'onestop', 'design', 'marketing', 'coding', 'crawler', 'data', 'voice', '3d', 'frontend', 'academic', 'solopreneur'];

    // Build HTML
    let html = '';
    categoryOrder.forEach(category => {
      const categoryTools = grouped[category];
      if (!categoryTools || categoryTools.length === 0) return;

      const categoryName = categoryNames[category] || category;
      const categoryDesc = categoryDescriptions[category] || '';

      html += `
        <section class="tool-section" id="${category}" aria-labelledby="${category}-title">
          <h2 class="section-title" id="${category}-title">${categoryName}</h2>
          ${categoryDesc ? `<p class="section-description">${categoryDesc}</p>` : ''}
          <div class="tool-grid">
            ${categoryTools.map((tool, index) => {
        // Extract domain from URL for favicon
        let domain = '';
        try {
          const url = new URL(tool.url);
          domain = url.hostname;
        } catch (e) {
          domain = tool.url;
        }
        // Use custom logo if provided, otherwise use favicon API
        const logoUrl = tool.logo || `https://icon.horse/icon/${domain}`;

        return `
              <article class="tool-card" data-delay="${(index % 8) + 1}">
                <div class="tool-card-content">
                  <div class="tool-card-header-with-logo">
                    <img src="${logoUrl}" alt="${escapeHtml(tool.title || tool.name)} logo" class="tool-card-logo" onerror="this.style.display='none'">
                    <h3 class="tool-card-title">${escapeHtml(tool.title || tool.name)}</h3>
                  </div>
                  <p class="tool-card-description">${escapeHtml(tool.description)}</p>
                  <div class="tool-card-tags">
                    ${(tool.tags || []).map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('')}
                  </div>
                </div>
                <div class="tool-card-actions">
                  <a href="${escapeHtml(tool.url)}" target="_blank" rel="noopener" class="tool-card-link">访问 <span class="tool-card-link-arrow">→</span></a>
                </div>
              </article>
              `;
      }).join('')}
          </div>
        </section>
      `;
    });

    // Hide loading and show content
    if (loading) loading.style.display = 'none';
    container.innerHTML = html;

    console.log(`✅ Loaded ${tools.length} AI tools in ${Object.keys(grouped).length} categories`);

  } catch (error) {
    console.error('Failed to load AI tools:', error);
    if (loading) {
      loading.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
    }
  }
}

// ===================================
// Data Loading Functions for Index Page
// Load announcement, solo content, and thoughts
// ===================================

async function loadIndexPageData() {
  // Load announcement/settings and update site info
  try {
    console.log('📦 Loading index page data...');
    const settingsRes = await fetch('/api/settings');
    if (settingsRes.ok) {
      const settings = await settingsRes.json();
      console.log('✅ Settings loaded:', settings);

      // Update marquee/announcement
      const marqueeContent = document.getElementById('marquee-content');
      if (marqueeContent && settings.notice) {
        marqueeContent.innerHTML = `<span class="marquee-text">${escapeHtml(settings.notice)}</span>`;
      } else if (marqueeContent && !settings.notice) {
        // Hide marquee if no announcement
        const marquee = document.getElementById('announcement-marquee');
        if (marquee) marquee.style.display = 'none';
      }

      // Update site name in various places
      if (settings.siteName) {
        // Update brand text
        const brandTexts = document.querySelectorAll('.brand-text, .logo-text');
        brandTexts.forEach(el => el.textContent = settings.siteName);

        // Update hero title - preserve inner structure
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) {
          const heroTitleText = heroTitle.querySelector('.hero-title-text');
          if (heroTitleText) {
            heroTitleText.textContent = settings.siteName;
          } else {
            heroTitle.textContent = settings.siteName;
          }
          // Update data-text attribute for effects
          heroTitle.setAttribute('data-text', settings.siteName);
        }

        // Update footer title
        const footerTitle = document.querySelector('.footer-title');
        if (footerTitle) footerTitle.textContent = settings.siteName;

        // 不再修改页面标题，由后端动态渲染处理
      }

      // Update slogan
      if (settings.slogan) {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
          const heroSubtitleText = heroSubtitle.querySelector('.hero-subtitle-text');
          if (heroSubtitleText) {
            heroSubtitleText.textContent = settings.slogan;
          } else {
            heroSubtitle.textContent = settings.slogan;
          }
        }

        const footerDesc = document.querySelector('.footer-description');
        if (footerDesc) footerDesc.textContent = settings.slogan;

        const contentSubtitle = document.querySelector('.content-subtitle');
        if (contentSubtitle) contentSubtitle.textContent = settings.slogan;
      }

      // Update SEO description
      if (settings.seoDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', settings.seoDescription);
      }

      // Update Portfolio section
      if (settings.portfolio) {
        console.log('📁 Updating portfolio section...');
        const portfolioTitle = document.getElementById('portfolio-title');
        if (portfolioTitle) portfolioTitle.textContent = settings.portfolio.title || '精选作品';

        const portfolioSubtitle = document.querySelector('.portfolio-section .section-subtitle');
        if (portfolioSubtitle) portfolioSubtitle.textContent = settings.portfolio.subtitle || '';

        // Update filter buttons
        const portfolioFilter = document.querySelector('.portfolio-filter');
        if (portfolioFilter && settings.portfolio.filters && settings.portfolio.filters.length > 0) {
          const filterMap = { '全部': 'all', 'AI 工具': 'ai-tools', '网页设计': 'web-design', '品牌设计': 'branding', '应用': 'app' };
          portfolioFilter.innerHTML = settings.portfolio.filters.map((filter, index) => {
            const filterValue = filterMap[filter] || filter.toLowerCase().replace(/\s+/g, '-');
            return `<button class="filter-btn ${index === 0 ? 'filter-btn--active' : ''}" data-filter="${filterValue}" role="tab" aria-selected="${index === 0}">${escapeHtml(filter)}</button>`;
          }).join('');
        }

        // Update portfolio items - only update if items exist and have content
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const portfolioItems = settings.portfolio.items || [];
        console.log('📁 Portfolio grid element:', portfolioGrid);
        console.log('📁 Portfolio items count:', portfolioItems.length);

        if (portfolioGrid && portfolioItems.length > 0) {
          // Filter out empty items (items without title)
          const validItems = portfolioItems.filter(item => item && item.title && item.title.trim());
          console.log('📁 Valid portfolio items:', validItems.length);

          if (validItems.length > 0) {
            portfolioGrid.innerHTML = validItems.map(item => {
              const hasLink = item.link && item.link.trim() !== '';
              const encodedLink = hasLink ? encodeURIComponent(item.link) : '';

              // Use custom image if available, otherwise use SVG placeholder
              const hasImage = item.image && item.image.trim() !== '';
              const imageSrc = hasImage
                ? escapeHtml(item.image)
                : `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='16' fill='%23666'%3E${encodeURIComponent(item.title || '')}%3C/text%3E%3C/svg%3E`;

              return `
              <article class="portfolio-item fade-in visible" data-category="${item.category || 'all'}">
                <div class="portfolio-image">
                  <img src="${imageSrc}" 
                       alt="${escapeHtml(item.title || '')} - ${escapeHtml(item.description || '')}" 
                       loading="lazy" width="400" height="300"
                       style="${hasImage ? 'object-fit: cover;' : ''}">
                </div>
                <div class="portfolio-content">
                  <h3 class="portfolio-title">${escapeHtml(item.title || '')}</h3>
                  <p class="portfolio-description">${escapeHtml(item.description || '')}</p>
                  <div class="portfolio-tags">
                    ${(item.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                  </div>
                </div>
                <div class="portfolio-actions">
                  ${hasLink ?
                  `<a href="#" class="portfolio-link portfolio-link--active" data-link="${encodedLink}" onclick="handlePortfolioLinkClick(event, '${encodedLink}')">点此预览 <span class="link-arrow">→</span></a>` :
                  `<span class="portfolio-link portfolio-link--disabled">暂无预览</span>`
                }
                </div>
              </article>
            `}).join('');
            console.log('✅ Portfolio items rendered successfully');
          }
        }
      }

      // Update Services section
      if (settings.services) {
        console.log('🛠️ Updating services section...');
        const servicesTitle = document.getElementById('services-title');
        if (servicesTitle) servicesTitle.textContent = settings.services.title || '专业服务';

        const servicesSubtitle = document.querySelector('.services-section .section-subtitle');
        if (servicesSubtitle) servicesSubtitle.textContent = settings.services.subtitle || '';

        // Update service cards - only update if items exist and have content
        const servicesGrid = document.querySelector('.services-grid');
        const serviceItems = settings.services.items || [];
        console.log('🛠️ Services grid element:', servicesGrid);
        console.log('🛠️ Services items count:', serviceItems.length);

        if (servicesGrid && serviceItems.length > 0) {
          // Filter out empty items (items without title)
          const validItems = serviceItems.filter(item => item && item.title && item.title.trim());
          console.log('🛠️ Valid service items:', validItems.length);

          if (validItems.length > 0) {
            const iconMap = {
              'lightning': '<path d="M13 10V3L4 14h7v7l9-11h-7z"/>',
              'monitor': '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
              'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
              'star': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
              'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
              'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
              'cloud': '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
              'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
              'smartphone': '<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>',
              'palette': '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>',
              'chart': '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
              'message': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
              'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
              'rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
              'heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
              'lock': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
            };
            servicesGrid.innerHTML = validItems.map(item => `
              <article class="service-card fade-in visible">
                <div class="service-icon" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    ${iconMap[item.icon] || iconMap['star']}
                  </svg>
                </div>
                <h3 class="service-title">${escapeHtml(item.title || '')}</h3>
                <p class="service-description">${escapeHtml(item.description || '')}</p>
              </article>
            `).join('');
            console.log('✅ Service items rendered successfully');
          }
        }
      }

      // Update About section
      if (settings.about) {
        console.log('👥 Updating about section...');
        const aboutTitle = document.getElementById('about-title');
        if (aboutTitle) aboutTitle.textContent = settings.about.title || '关于我们';

        const aboutSubtitle = document.querySelector('.about-section .section-subtitle');
        if (aboutSubtitle) aboutSubtitle.textContent = settings.about.subtitle || '';

        const aboutDesc = document.querySelector('.about-description');
        if (aboutDesc && settings.about.content) {
          aboutDesc.innerHTML = settings.about.content.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
        }

        // Update about image
        const aboutImage = document.getElementById('about-section-image');
        if (aboutImage && settings.about.image && settings.about.image.trim()) {
          aboutImage.src = settings.about.image;
          aboutImage.alt = settings.about.title || '团队工作场景';
        }

        // Update stats - only update if stats exist and have content
        const aboutStats = document.querySelector('.about-stats');
        const statItems = settings.about.stats || [];
        console.log('👥 Stats items count:', statItems.length);

        if (aboutStats && statItems.length > 0) {
          // Filter out empty items (items without value)
          const validStats = statItems.filter(stat => stat && stat.value && stat.value.trim());
          console.log('👥 Valid stat items:', validStats.length);

          if (validStats.length > 0) {
            aboutStats.innerHTML = validStats.map(stat => `
              <div class="stat-item">
                <div class="stat-number">${escapeHtml(stat.value || '')}</div>
                <div class="stat-label">${escapeHtml(stat.label || '')}</div>
              </div>
            `).join('');
            console.log('✅ Stats rendered successfully');
          }
        }
      }

      // Update Footer
      if (settings.footer) {
        const footerCopyright = document.querySelector('.footer-copyright');
        if (footerCopyright) footerCopyright.textContent = settings.footer.copyright || '';

        // Update contact info in footer-contact-list (display only, not clickable)
        const footerContactList = document.getElementById('footer-contact-list');
        if (footerContactList) {
          let contactHtml = `<li><span class="footer-text">${escapeHtml(settings.footer.email || 'hello@studio.com')}</span></li>`;
          if (settings.footer.phone) {
            contactHtml += `<li><span class="footer-text">${escapeHtml(settings.footer.phone)}</span></li>`;
          }
          contactHtml += `<li><span class="footer-text">${escapeHtml(settings.footer.address || '北京市朝阳区')}</span></li>`;
          footerContactList.innerHTML = contactHtml;
        }
      }

      // Update Footer Services List (from services.items)
      const footerServicesList = document.getElementById('footer-services-list');
      if (footerServicesList && settings.services && settings.services.items) {
        const validServices = settings.services.items.filter(item => item && item.title && item.title.trim());
        if (validServices.length > 0) {
          footerServicesList.innerHTML = validServices.map(item =>
            `<li><a href="#services" class="footer-link">${escapeHtml(item.title)}</a></li>`
          ).join('');
        } else {
          footerServicesList.innerHTML = '<li><span class="footer-text">暂无服务</span></li>';
        }
      }

      // Update Footer Resources List (portfolio title, about title, AI tools)
      const footerResourcesList = document.getElementById('footer-resources-list');
      if (footerResourcesList) {
        const resources = [];
        // AI 工具 link
        resources.push('<li><a href="#" class="footer-link" onclick="checkLoginAndGo(event)">AI 工具</a></li>');
        // Tutorials link
        resources.push('<li><a href="tutorials.html" class="footer-link">教程/案例</a></li>');
        // APIs link
        resources.push('<li><a href="apis.html" class="footer-link">API集合</a></li>');
        // Portfolio title
        if (settings.portfolio && settings.portfolio.title) {
          resources.push(`<li><a href="#portfolio" class="footer-link">${escapeHtml(settings.portfolio.title)}</a></li>`);
        }
        // About title
        if (settings.about && settings.about.title) {
          resources.push(`<li><a href="#about" class="footer-link">${escapeHtml(settings.about.title)}</a></li>`);
        }
        footerResourcesList.innerHTML = resources.join('');
      }

      // Update Footer Site Name and Slogan
      const footerSiteName = document.getElementById('footer-site-name');
      if (footerSiteName && settings.siteName) {
        footerSiteName.textContent = settings.siteName;
      }

      const footerSlogan = document.getElementById('footer-slogan');
      if (footerSlogan && settings.slogan) {
        footerSlogan.textContent = settings.slogan;
      }
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  // 加载工作流卡片列表（首页）
  try {
    const contentRes = await fetch('/api/content');
    if (contentRes.ok) {
      const content = await contentRes.json();

      // 更新一人公司描述
      const soloDesc = document.getElementById('solo-description');
      if (soloDesc && content.solo) {
        soloDesc.textContent = content.solo;
      }

      // 渲染工作流卡片列表
      if (content.workflows && Array.isArray(content.workflows)) {
        const visibleWorkflows = content.workflows.filter(w => w.visible !== false);
        visibleWorkflows.sort((a, b) => (a.order || 0) - (b.order || 0));
        renderIndexWorkflowCards(visibleWorkflows);
      }
    }
  } catch (e) {
    console.error('Failed to load content for index:', e);
  }
}

// 首页工作流卡片渲染函数
function renderIndexWorkflowCards(workflows) {
  const gridEl = document.getElementById('workflows-grid');
  const countEl = document.getElementById('workflows-count');

  if (!gridEl) return;

  if (countEl) {
    countEl.textContent = workflows.length;
  }

  if (workflows.length === 0) {
    gridEl.innerHTML = `
      <div class="empty-workflows">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="9" y1="9" x2="15" y2="9"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
        <p>暂无工作流</p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = workflows.map(workflow => `
    <div class="workflow-card" onclick="viewWorkflowDetail('${workflow.id}')">
      <div class="workflow-card-header">
        <h4 class="workflow-card-title">${escapeHtml(workflow.title || '未命名')}</h4>
      </div>
      <p class="workflow-card-desc">${escapeHtml(workflow.description || '')}</p>
      <div class="workflow-card-preview">
        <div class="workflow-card-preview-canvas" style="width: 2000px; height: 1200px;">
          ${renderIndexWorkflowPreview(workflow)}
        </div>
      </div>
    </div>
  `).join('');

  // 保存工作流数据供查看使用
  window.allWorkflowsData = workflows;
}

// 首页工作流预览渲染
function renderIndexWorkflowPreview(workflow) {
  if (!workflow.nodes || workflow.nodes.length === 0) {
    return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:12px;">空画布</div>';
  }

  return workflow.nodes.map(node => `
    <div style="position:absolute;left:${node.position.x}px;top:${node.position.y}px;width:200px;background:var(--background-subtle);border:2px solid var(--accent-blue);border-radius:8px;padding:16px;">
      <div style="color:var(--text-primary);font-size:14px;font-weight:600;margin-bottom:8px;">${escapeHtml(node.title || '未命名')}</div>
      <div style="color:var(--text-secondary);font-size:12px;">${escapeHtml(node.description || '')}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle portfolio link click - make globally accessible
window.handlePortfolioLinkClick = async function (event, encodedLink) {
  event.preventDefault();
  event.stopPropagation();

  if (!encodedLink) return;

  const link = decodeURIComponent(encodedLink);
  console.log('[Portfolio] Link clicked:', link);

  // Check if it's a tools link
  const isToolsLink = link === 'tools' || link === '/tools.html' || link.includes('tools.html');

  if (isToolsLink) {
    // Check login status first
    try {
      const response = await fetch('/api/user/status', { credentials: 'include' });
      const data = await response.json();

      if (data.isUser) {
        window.location.href = '/tools.html';
      } else {
        window.location.href = '/auth.html?redirect=tools';
      }
    } catch (error) {
      window.location.href = '/auth.html?redirect=tools';
    }
  } else if (link.startsWith('http://') || link.startsWith('https://')) {
    // External link - open in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  } else {
    // Internal link - handle both with and without leading slash
    const finalLink = link.startsWith('/') ? link : '/' + link;
    window.location.href = finalLink;
  }
};

// Switch Apps/Products display tab - make globally accessible
window.switchAppsDisplayTab = function (tabId) {
  // Update tab buttons
  document.querySelectorAll('.apps-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabId) {
      tab.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.apps-tab-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });

  const activeContent = document.getElementById(tabId);
  if (activeContent) {
    activeContent.classList.add('active');
    activeContent.style.display = 'block';
  }
};

// Switch Workshop tab - AI 开发工坊标签切换
window.switchWorkshopTab = function (tabId) {
  console.log(`[Workshop] Switching to tab: ${tabId}`);

  // Update tab buttons
  document.querySelectorAll('.workshop-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === tabId) {
      tab.classList.add('active');
    }
  });

  // Update tab content
  document.querySelectorAll('.workshop-tab-content').forEach(content => {
    content.classList.remove('active');
    content.style.display = 'none';
  });

  const activeContent = document.getElementById(tabId);
  if (activeContent) {
    activeContent.classList.add('active');
    activeContent.style.display = 'block';
  }

  // Render items for the selected tab
  renderWorkshopItems(tabId);
};

// --- Workshop (AI 开发工坊) 加载和渲染 ---
let workshopData = null;

// Load Workshop data
async function loadWorkshopData() {
  try {
    const response = await fetch('/api/workshop');
    if (!response.ok) throw new Error('Failed to fetch workshop data');
    workshopData = await response.json();
    console.log('✅ Workshop data loaded:', workshopData);

    // 额外加载 Skill 数据（通过代理避免跨域）
    try {
      const skillResponse = await fetch('/api/skill-proxy/skills?per_page=20');
      if (skillResponse.ok) {
        const skillData = await skillResponse.json();
        console.log('✅ Skill data loaded from proxy:', skillData);

        // 处理 API 返回格式：{ data: { skills: [...] } }
        const skills = skillData.data?.skills || skillData.skills || [];
        console.log(`✅ Extracted ${skills.length} skills`);

        // 过滤掉"整合仓库"类别的 skills，然后只取前8个
        const filteredSkills = skills.filter(skill => skill.category !== 'repositories').slice(0, 8);
        console.log(`✅ Filtered to ${filteredSkills.length} skills (excluded repositories, limited to 8)`);

        // 将 Skill 数据转换为 workshop 格式并添加到 workshopData
        if (filteredSkills.length > 0) {
          const skillItems = filteredSkills.map(skill => ({
            id: skill.id || skill.name,
            title: skill.name,
            description: skill.description || '',
            tags: skill.tags || [],
            category: 'skill',
            fileName: skill.filename || '',
            systemPrompt: skill.system_prompt || '',
            // 保存完整的 skill 数据用于详情展示
            fullData: skill
          }));

          // 确保 itemsByCategory 存在
          if (!workshopData.itemsByCategory) {
            workshopData.itemsByCategory = {};
          }

          // 添加 skill 分类
          workshopData.itemsByCategory.skill = {
            name: 'Skill 组件库',
            items: skillItems
          };

          console.log(`✅ Added ${skillItems.length} skill items to workshopData`);

          // 添加 skill 的 moreLinks
          if (!workshopData.moreLinks) {
            workshopData.moreLinks = {};
          }
          workshopData.moreLinks.skill = [
            {
              text: '查看更多 Skill',
              url: 'https://skill.cdproveai.com/',
              description: '精选 AI 技能组件库'
            },
            {
              text: 'Agent Skills Marketplace',
              url: 'https://skillsmp.com/',
              description: 'AI Agent 技能市场'
            }
          ];

          console.log('✅ Skill data merged into workshopData');
        } else {
          console.warn('⚠️ No skills found in API response');
        }
      } else {
        console.warn('⚠️ Skill API returned non-OK status:', skillResponse.status);
      }
    } catch (skillError) {
      console.warn('⚠️ Failed to load skill data from proxy:', skillError);
    }

    // Render n8n items by default (first tab)
    renderWorkshopItems('n8n');
  } catch (error) {
    console.error('Failed to load workshop data:', error);
  }
}

// Render workshop items for a specific category
function renderWorkshopItems(category) {
  if (!workshopData) return;

  // Skip 'prompt' category - it has static HTML content
  if (category === 'prompt') return;

  const gridId = `${category}-grid`;
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const categoryData = workshopData.itemsByCategory?.[category];
  const items = categoryData?.items || [];

  // Handle "more link" visibility for n8n
  const moreLinkEl = document.getElementById(`${category}-more-link`);
  console.log(`[Workshop] Checking moreLinks for category: ${category}`, {
    moreLinkEl: !!moreLinkEl,
    moreLinks: workshopData.moreLinks?.[category],
    itemsLength: items.length
  });

  if (moreLinkEl) {
    const moreLinks = workshopData.moreLinks?.[category];
    if (items.length > 0 && moreLinks) {
      // Support both array and single object format
      const linksArray = Array.isArray(moreLinks) ? moreLinks : [moreLinks];
      moreLinkEl.innerHTML = linksArray.map(link => `
        <div class="workshop-more-link-item">
          <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="more-link-btn">
            <span>${escapeHtml(link.text)}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <p class="more-link-desc">${escapeHtml(link.description)}</p>
        </div>
      `).join('');
      moreLinkEl.style.display = 'flex';
      console.log(`[Workshop] Displayed moreLinks for ${category}`);
    } else {
      moreLinkEl.style.display = 'none';
      console.log(`[Workshop] Hidden moreLinks for ${category} (items: ${items.length}, links: ${!!moreLinks})`);
    }
  }

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-text">暂无${categoryData?.name || '内容'}，敬请期待...</p>`;
    return;
  }

  grid.innerHTML = items.map((item, index) => `
    <article class="workshop-card" data-delay="${(index % 8) + 1}">
      <div class="workshop-card-content">
        <h3 class="workshop-card-title">${escapeHtml(item.title)}</h3>
        <p class="workshop-card-description">${escapeHtml(item.description || '')}</p>
        <div class="workshop-card-tags">
          ${(item.tags || []).map(tag => `<span class="workshop-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
      <div class="workshop-card-actions">
        ${category === 'dify' || category === 'coze' ? `
          <button class="workshop-btn workshop-btn-download ${category}-detail-trigger" 
                  data-workflow-id="${escapeHtml(item.id)}"
                  data-workflow-title="${escapeHtml(item.title)}"
                  data-workflow-description="${escapeHtml(item.description || '')}"
                  data-workflow-tags='${JSON.stringify(item.tags || [])}'
                  data-workflow-stats='${JSON.stringify(item.stats || {})}'
                  data-workflow-filename="${escapeHtml(item.fileName || '')}"
                  data-workflow-category="${escapeHtml(item.category)}"
                  title="查看详情">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span>查看详情</span>
          </button>
        ` : category === 'skill' ? `
          <button class="workshop-btn workshop-btn-download skill-detail-trigger" 
                  data-skill-id="${escapeHtml(item.id)}"
                  data-skill-title="${escapeHtml(item.title)}"
                  data-skill-description="${escapeHtml(item.description || '')}"
                  data-skill-tags='${JSON.stringify(item.tags || [])}'
                  data-skill-data='${JSON.stringify(item.fullData || {})}'
                  title="查看详情">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <span>查看详情</span>
          </button>
        ` : `
          <button class="workshop-btn workshop-btn-copy" onclick="copyWorkshopJson('${item.category}', '${escapeHtml(item.fileName)}', this)" title="复制 JSON">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制</span>
          </button>
          <a href="/workshop/${item.category}/${encodeURIComponent(item.fileName)}" class="workshop-btn workshop-btn-download" download title="下载 JSON">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>下载</span>
          </a>
        `}
      </div>
    </article>
  `).join('');

  // Add event listeners for Dify and Coze detail buttons
  if (category === 'dify' || category === 'coze') {
    setTimeout(() => {
      const detailButtons = grid.querySelectorAll(`.${category}-detail-trigger`);
      console.log(`[${category} Detail] Found ${detailButtons.length} detail buttons`);
      detailButtons.forEach((btn, index) => {
        console.log(`[${category} Detail] Binding event to button ${index}:`, {
          id: btn.dataset.workflowId,
          title: btn.dataset.workflowTitle
        });
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`[${category} Detail] Button clicked!`, this.dataset);
          const workflow = {
            id: this.dataset.workflowId,
            title: this.dataset.workflowTitle,
            description: this.dataset.workflowDescription,
            tags: JSON.parse(this.dataset.workflowTags || '[]'),
            stats: this.dataset.workflowStats ? JSON.parse(this.dataset.workflowStats) : null,
            fileName: this.dataset.workflowFilename,
            category: this.dataset.workflowCategory
          };
          console.log(`[${category} Detail] Calling showDifyWorkflowDetail with:`, workflow);
          window.showDifyWorkflowDetail(workflow);
        });
      });
    }, 0);
  }

  // Add event listeners for Skill copy buttons and detail button
  if (category === 'skill') {
    setTimeout(() => {
      // Detail button
      const detailButtons = grid.querySelectorAll('.skill-detail-trigger');
      console.log(`[Skill Detail] Found ${detailButtons.length} detail buttons`);
      detailButtons.forEach((btn) => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`[Skill Detail] Button clicked!`, this.dataset);
          const skill = {
            id: this.dataset.skillId,
            title: this.dataset.skillTitle,
            description: this.dataset.skillDescription,
            tags: JSON.parse(this.dataset.skillTags || '[]'),
            fullData: JSON.parse(this.dataset.skillData || '{}')
          };
          console.log(`[Skill Detail] Calling showSkillDetail with:`, skill);
          window.showSkillDetail(skill);
        });
      });

      // Chinese prompt copy buttons
      const copyZhButtons = grid.querySelectorAll('.skill-copy-zh');
      console.log(`[Skill Copy] Found ${copyZhButtons.length} Chinese copy buttons`);
      copyZhButtons.forEach((btn) => {
        btn.addEventListener('click', async function (e) {
          e.preventDefault();
          e.stopPropagation();
          const prompt = decodeURIComponent(this.dataset.promptEncoded);
          try {
            await navigator.clipboard.writeText(prompt);
            const originalText = this.querySelector('span').textContent;
            this.querySelector('span').textContent = '已复制!';
            this.classList.add('copied');
            setTimeout(() => {
              this.querySelector('span').textContent = originalText;
              this.classList.remove('copied');
            }, 2000);
          } catch (error) {
            console.error('Failed to copy Chinese prompt:', error);
          }
        });
      });

      // English prompt copy buttons
      const copyEnButtons = grid.querySelectorAll('.skill-copy-en');
      console.log(`[Skill Copy] Found ${copyEnButtons.length} English copy buttons`);
      copyEnButtons.forEach((btn) => {
        btn.addEventListener('click', async function (e) {
          e.preventDefault();
          e.stopPropagation();
          const prompt = decodeURIComponent(this.dataset.promptEncoded);
          try {
            await navigator.clipboard.writeText(prompt);
            const originalText = this.querySelector('span').textContent;
            this.querySelector('span').textContent = 'Copied!';
            this.classList.add('copied');
            setTimeout(() => {
              this.querySelector('span').textContent = originalText;
              this.classList.remove('copied');
            }, 2000);
          } catch (error) {
            console.error('Failed to copy English prompt:', error);
          }
        });
      });
    }, 0);
  }

  console.log(`✅ Rendered ${items.length} ${category} items`);
}

// Copy workshop JSON to clipboard
window.copyWorkshopJson = async function (category, fileName, btn) {
  try {
    const response = await fetch(`/workshop/${category}/${encodeURIComponent(fileName)}`);
    if (!response.ok) throw new Error('Failed to fetch JSON');

    const jsonText = await response.text();
    await navigator.clipboard.writeText(jsonText);

    // Show success feedback
    const originalText = btn.querySelector('span').textContent;
    btn.querySelector('span').textContent = '已复制!';
    btn.classList.add('copied');

    setTimeout(() => {
      btn.querySelector('span').textContent = originalText;
      btn.classList.remove('copied');
    }, 2000);
  } catch (error) {
    console.error('Failed to copy JSON:', error);
    alert('复制失败，请重试');
  }
};

// Show Dify workflow detail modal
window.showDifyWorkflowDetail = function (workflow) {
  console.log('[showDifyWorkflowDetail] Function called with:', workflow);

  // Extract properties from workflow object
  const { id, title, description, tags, stats, fileName, category } = workflow;
  console.log('[showDifyWorkflowDetail] Extracted properties:', { id, title, description, tags, stats });

  // Create modal if it doesn't exist
  let modal = document.getElementById('dify-detail-modal');
  console.log('[showDifyWorkflowDetail] Modal element:', modal);
  if (!modal) {
    console.log('[showDifyWorkflowDetail] Creating new modal...');
    modal = document.createElement('div');
    modal.id = 'dify-detail-modal';
    modal.className = 'dify-detail-modal';
    modal.innerHTML = `
      <div class="dify-detail-overlay" onclick="closeDifyDetailModal()"></div>
      <div class="dify-detail-content">
        <button class="dify-detail-close" onclick="closeDifyDetailModal()" aria-label="关闭">×</button>
        <div class="dify-detail-body">
          <div class="dify-detail-header">
            <h2 class="dify-detail-title" id="dify-detail-title"></h2>
          </div>
          
          <div class="dify-detail-section">
            <h4 class="dify-section-label">描述</h4>
            <p class="dify-detail-description" id="dify-detail-description"></p>
          </div>
          
          <div class="dify-detail-tags" id="dify-detail-tags"></div>
          
          <div class="dify-detail-section">
            <h4 class="dify-section-label">统计信息</h4>
            <div class="dify-stats-grid" id="dify-stats-grid"></div>
          </div>
          
          <div class="dify-detail-actions">
            <button class="dify-action-btn dify-btn-primary dify-btn-full" id="dify-download-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>下载 YML</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    console.log('[showDifyWorkflowDetail] Modal created and appended to body');
  }

  // Update modal content
  console.log('[showDifyWorkflowDetail] Updating modal content...');
  document.getElementById('dify-detail-title').textContent = title;
  document.getElementById('dify-detail-description').textContent = description;

  // Render tags
  const tagsContainer = document.getElementById('dify-detail-tags');
  tagsContainer.innerHTML = tags.map(tag => `<span class="dify-tag">${escapeHtml(tag)}</span>`).join('');

  // Render stats
  const statsGrid = document.getElementById('dify-stats-grid');
  if (stats) {
    const typeLabels = {
      'workflow': '工作流',
      'agent-chat': 'Agent',
      'advanced-chat': '高级对话',
      'completion': '文本生成',
      'video': '视频',
      'picture': '图片',
      'word': '文档',
      'table': '表格',
      'music': '音乐'
    };

    // Coze 工作流使用 features 字段，Dify 使用其他字段
    const isCoze = category === 'coze';

    if (isCoze) {
      // Coze 工作流统计信息
      statsGrid.innerHTML = `
        <div class="dify-stat-card">
          <div class="dify-stat-value">${stats.nodes || 0}</div>
          <div class="dify-stat-label">节点数量</div>
        </div>
        <div class="dify-stat-card">
          <div class="dify-stat-value">${typeLabels[stats.type] || stats.type}</div>
          <div class="dify-stat-label">类型</div>
        </div>
        <div class="dify-stat-card dify-stat-full">
          <div class="dify-stat-value">${stats.category || '未分类'}</div>
          <div class="dify-stat-label">分类</div>
        </div>
        ${stats.features && stats.features.length > 0 ? `
          <div class="dify-stat-card dify-stat-full">
            <div class="dify-stat-value" style="font-size: 14px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
              ${stats.features.map(f => `<span class="dify-tag">${f}</span>`).join('')}
            </div>
            <div class="dify-stat-label">特性</div>
          </div>
        ` : ''}
      `;
    } else {
      // Dify 工作流统计信息
      statsGrid.innerHTML = `
        <div class="dify-stat-card">
          <div class="dify-stat-value">${stats.nodes || 0}</div>
          <div class="dify-stat-label">节点数量</div>
        </div>
        <div class="dify-stat-card">
          <div class="dify-stat-value">${stats.llmNodes || 0}</div>
          <div class="dify-stat-label">LLM 节点</div>
        </div>
        <div class="dify-stat-card">
          <div class="dify-stat-value">${stats.codeNodes || 0}</div>
          <div class="dify-stat-label">代码节点</div>
        </div>
        <div class="dify-stat-card">
          <div class="dify-stat-value">${typeLabels[stats.type] || stats.type}</div>
          <div class="dify-stat-label">类型</div>
        </div>
        <div class="dify-stat-card dify-stat-full">
          <div class="dify-stat-value">${stats.category || '未分类'}</div>
          <div class="dify-stat-label">分类</div>
        </div>
        <div class="dify-stat-card">
          <div class="dify-stat-value">${stats.connections || 0}</div>
          <div class="dify-stat-label">连接数</div>
        </div>
      `;
    }
  } else {
    statsGrid.innerHTML = '<p class="dify-no-stats">暂无统计信息</p>';
  }

  // Setup download button
  const downloadBtn = document.getElementById('dify-download-btn');
  if (fileName && category) {
    const fileExtension = category === 'coze' ? 'ZIP' : 'YML';
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = `/workshop/${category}/${encodeURIComponent(fileName)}`;
      link.download = fileName;
      link.click();
    };
    downloadBtn.querySelector('span').textContent = `下载 ${fileExtension}`;
  } else {
    downloadBtn.disabled = true;
    downloadBtn.querySelector('span').textContent = '暂无文件';
  }

  // Show modal
  console.log('[showDifyWorkflowDetail] Showing modal...');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  console.log('[showDifyWorkflowDetail] Modal should now be visible');
};

// Close Dify detail modal
window.closeDifyDetailModal = function () {
  const modal = document.getElementById('dify-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Show Skill detail modal
window.showSkillDetail = function (skill) {
  console.log('[showSkillDetail] Function called with:', skill);

  const { id, title, description, tags, fullData } = skill;
  console.log('[showSkillDetail] Extracted properties:', { id, title, description, tags });

  // Create modal if it doesn't exist
  let modal = document.getElementById('skill-detail-modal');
  console.log('[showSkillDetail] Modal element:', modal);

  if (!modal) {
    console.log('[showSkillDetail] Creating new modal...');
    modal = document.createElement('div');
    modal.id = 'skill-detail-modal';
    modal.className = 'dify-detail-modal';
    modal.innerHTML = `
      <div class="dify-detail-overlay" onclick="closeSkillDetailModal()"></div>
      <div class="dify-detail-content">
        <button class="dify-detail-close" onclick="closeSkillDetailModal()" aria-label="关闭">×</button>
        <div class="dify-detail-body">
          <div class="dify-detail-header">
            <h2 class="dify-detail-title" id="skill-detail-title"></h2>
          </div>
          
          <div class="dify-detail-section">
            <h4 class="dify-section-label">描述</h4>
            <p class="dify-detail-description" id="skill-detail-description"></p>
          </div>
          
          <div class="dify-detail-tags" id="skill-detail-tags"></div>
          
          <div class="dify-detail-section">
            <h4 class="dify-section-label">技能信息</h4>
            <div class="dify-stats-grid" id="skill-stats-grid"></div>
          </div>
          
          <div class="dify-detail-section" id="skill-prompts-section">
            <h4 class="dify-section-label">提示词</h4>
            <div class="dify-detail-actions" id="skill-prompt-buttons" style="margin-bottom: 16px;"></div>
          </div>
          
          <div class="dify-detail-section" id="skill-source-section">
            <h4 class="dify-section-label">源代码</h4>
            <div class="dify-detail-actions">
              <a class="dify-action-btn dify-btn-primary" id="skill-source-btn" target="_blank" rel="noopener noreferrer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>查看源代码</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    console.log('[showSkillDetail] Modal created and appended to body');
  }

  // Update modal content
  console.log('[showSkillDetail] Updating modal content...');
  document.getElementById('skill-detail-title').textContent = title;
  document.getElementById('skill-detail-description').textContent = description;

  // Render tags
  const tagsContainer = document.getElementById('skill-detail-tags');
  tagsContainer.innerHTML = tags.map(tag => `<span class="dify-tag">${escapeHtml(tag)}</span>`).join('');

  // Render skill info stats
  const statsGrid = document.getElementById('skill-stats-grid');
  const complexityLabels = {
    'basic': '基础',
    'intermediate': '中级',
    'advanced': '高级'
  };

  statsGrid.innerHTML = `
    <div class="dify-stat-card">
      <div class="dify-stat-value">${fullData.category || '未分类'}</div>
      <div class="dify-stat-label">分类</div>
    </div>
    <div class="dify-stat-card">
      <div class="dify-stat-value">${complexityLabels[fullData.complexity] || fullData.complexity || '未知'}</div>
      <div class="dify-stat-label">复杂度</div>
    </div>
    ${fullData.platforms && fullData.platforms.length > 0 ? `
      <div class="dify-stat-card dify-stat-full">
        <div class="dify-stat-value" style="font-size: 14px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
          ${fullData.platforms.map(p => `<span class="dify-tag">${escapeHtml(p)}</span>`).join('')}
        </div>
        <div class="dify-stat-label">支持平台</div>
      </div>
    ` : ''}
    ${fullData.languages && fullData.languages.length > 0 ? `
      <div class="dify-stat-card dify-stat-full">
        <div class="dify-stat-value" style="font-size: 14px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
          ${fullData.languages.map(l => `<span class="dify-tag">${escapeHtml(l)}</span>`).join('')}
        </div>
        <div class="dify-stat-label">技术栈</div>
      </div>
    ` : ''}
  `;

  // Render prompt copy buttons
  const promptButtonsContainer = document.getElementById('skill-prompt-buttons');
  const promptButtons = [];

  if (fullData.systemPromptZH) {
    promptButtons.push({
      label: '复制中文提示词',
      content: fullData.systemPromptZH,
      lang: 'zh',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>`
    });
  }
  if (fullData.systemPromptEN) {
    promptButtons.push({
      label: '复制英文提示词',
      content: fullData.systemPromptEN,
      lang: 'en',
      icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>`
    });
  }

  if (promptButtons.length > 0) {
    promptButtonsContainer.innerHTML = promptButtons.map((prompt, index) => `
      <button class="dify-action-btn dify-btn-secondary skill-prompt-copy-btn" data-prompt-index="${index}" data-prompt-content="${escapeHtml(prompt.content)}">
        ${prompt.icon}
        <span>${escapeHtml(prompt.label)}</span>
      </button>
    `).join('');

    // Add copy button event listeners
    setTimeout(() => {
      const copyButtons = promptButtonsContainer.querySelectorAll('.skill-prompt-copy-btn');
      copyButtons.forEach(btn => {
        btn.addEventListener('click', async function (e) {
          e.preventDefault();
          const content = this.dataset.promptContent;
          try {
            await navigator.clipboard.writeText(content);
            const originalText = this.querySelector('span').textContent;
            this.querySelector('span').textContent = '已复制!';
            this.classList.add('copied');
            setTimeout(() => {
              this.querySelector('span').textContent = originalText;
              this.classList.remove('copied');
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
      });
    }, 0);

    // Show prompts section
    document.getElementById('skill-prompts-section').style.display = 'block';
  } else {
    // Hide prompts section if no prompts
    document.getElementById('skill-prompts-section').style.display = 'none';
  }

  // Setup source code link
  const sourceBtn = document.getElementById('skill-source-btn');
  const sourceSection = document.getElementById('skill-source-section');
  if (fullData.sourceRepo) {
    sourceBtn.href = fullData.sourceRepo;
    sourceSection.style.display = 'block';
  } else {
    sourceSection.style.display = 'none';
  }

  // Show modal
  console.log('[showSkillDetail] Showing modal...');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  console.log('[showSkillDetail] Modal should now be visible');
};

// Close Skill detail modal
window.closeSkillDetailModal = function () {
  const modal = document.getElementById('skill-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDifyDetailModal();
    closeSkillDetailModal();
  }
});

// Override switchWorkshopTab to also load data
const originalSwitchWorkshopTab = window.switchWorkshopTab;
window.switchWorkshopTab = function (tabId) {
  originalSwitchWorkshopTab(tabId);

  // Extract category from tabId (e.g., 'n8n-list' -> 'n8n')
  const category = tabId.replace('-list', '');
  renderWorkshopItems(category);
};

// Load Apps section dynamically
async function loadAppsSection() {
  const appsGrid = document.getElementById('apps-grid');
  if (!appsGrid) return;

  // Initialize tab display - ensure apps-list is visible by default
  const appsListTab = document.getElementById('apps-list');
  if (appsListTab) {
    appsListTab.style.display = 'block';
  }

  try {
    const response = await fetch('/api/apps');
    if (!response.ok) throw new Error('Failed to fetch apps');

    const data = await response.json();
    const apps = data.apps || [];

    if (apps.length === 0) {
      appsGrid.innerHTML = '<p class="empty-text">暂无应用</p>';
    } else {
      appsGrid.innerHTML = apps.map((app, index) => `
        <article class="tool-card" data-delay="${(index % 8) + 1}">
          <div class="tool-card-content">
            <h3 class="tool-card-title">${escapeHtml(app.title)}</h3>
            <p class="tool-card-description">${escapeHtml(app.description)}</p>
            <div class="tool-card-tags">
              ${(app.tags || []).map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>
          <div class="tool-card-actions">
            <a href="${escapeHtml(app.port)}" target="_blank" rel="noopener" class="tool-card-link">访问 <span class="tool-card-link-arrow">→</span></a>
          </div>
        </article>
      `).join('');
      console.log(`✅ Loaded ${apps.length} apps`);
    }
  } catch (error) {
    console.error('Failed to load apps:', error);
    appsGrid.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
  }
}

// Load Products section dynamically
async function loadProductsSection() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();
    const products = data.products || [];

    if (products.length === 0) {
      productsGrid.innerHTML = '<p class="empty-text">暂无产品</p>';
    } else {
      productsGrid.innerHTML = products.map((product, index) => `
        <article class="tool-card" data-delay="${(index % 8) + 1}">
          <div class="tool-card-content">
            <h3 class="tool-card-title">${escapeHtml(product.title)}</h3>
            <p class="tool-card-description">${escapeHtml(product.description || '')}</p>
            ${product.fileName ? `<div class="tool-card-tags"><span class="tool-tag">📎 ${escapeHtml(product.fileName)}</span></div>` : ''}
          </div>
          <div class="tool-card-actions">
            ${product.hasFile ? `<a href="/api/products/${product.id}/download" class="tool-card-link" download>下载 <span class="tool-card-link-arrow">↓</span></a>` : '<span class="tool-card-link" style="color:#999;">无附件</span>'}
          </div>
        </article>
      `).join('');
      console.log(`✅ Loaded ${products.length} products`);
    }
  } catch (error) {
    console.error('Failed to load products:', error);
    productsGrid.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
  }
}

// Load Tutorials section dynamically
let allTutorialsData = [];
let currentTutorialCategory = '';

async function loadTutorialsSection() {
  const tutorialsGrid = document.getElementById('tutorials-grid');
  const filtersContainer = document.getElementById('tutorials-filters');
  if (!tutorialsGrid) return;

  try {
    const response = await fetch('/api/tutorials');
    if (!response.ok) throw new Error('Failed to fetch tutorials');

    const data = await response.json();
    allTutorialsData = data.tutorials || [];

    // 初始化分类按钮
    if (filtersContainer && allTutorialsData.length > 0) {
      initTutorialFilters();
    }

    // 渲染教程
    renderTutorials();

    console.log(`✅ Loaded ${allTutorialsData.length} tutorials`);
  } catch (error) {
    console.error('Failed to load tutorials:', error);
    tutorialsGrid.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
  }
}

function initTutorialFilters() {
  const filtersContainer = document.getElementById('tutorials-filters');
  if (!filtersContainer) return;

  const categories = [
    '总榜教程', 'AI聊天教程', 'AI搜索教程', 'AI音乐教程',
    'AI语音教程', 'AI智能体教程', 'AI数字人教程', 'AI办公教程',
    'AI设计教程', 'AI翻译教程', 'AI数据分析教程', 'AI 3D教程',
    'AI编程教程', 'AI生图教程', 'AI视频教程', 'AI写作教程'
  ];

  let html = '<button class="category-filter-btn active" data-category="" onclick="filterTutorials(\'\')">全部分类</button>';
  categories.forEach(function (cat) {
    html += '<button class="category-filter-btn" data-category="' + cat + '" onclick="filterTutorials(\'' + cat + '\')">' + cat + '</button>';
  });

  filtersContainer.innerHTML = html;
}

function filterTutorials(category) {
  currentTutorialCategory = category;

  // 更新按钮状态
  document.querySelectorAll('#tutorials-filters .category-filter-btn').forEach(function (btn) {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderTutorials();
}

function renderTutorials() {
  const tutorialsGrid = document.getElementById('tutorials-grid');
  if (!tutorialsGrid) return;

  const filtered = currentTutorialCategory ?
    allTutorialsData.filter(function (t) { return t.category === currentTutorialCategory; }) :
    allTutorialsData;

  if (filtered.length === 0) {
    tutorialsGrid.innerHTML = '<p class="empty-text">暂无教程/案例</p>';
  } else {
    tutorialsGrid.innerHTML = filtered.map((item, index) => `
      <article class="tool-card" data-delay="${(index % 8) + 1}">
        <div class="tool-card-content">
          <h3 class="tool-card-title">${escapeHtml(item.title)}</h3>
          <p class="tool-card-description">${escapeHtml(item.description || '')}</p>
          ${(item.tags || []).length > 0 ? `<div class="tool-card-tags">${item.tags.map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="tool-card-actions">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="tool-card-link">访问 <span class="tool-card-link-arrow">→</span></a>
        </div>
      </article>
    `).join('');
  }
}

// Load APIs section dynamically
let allApisData = [];
let currentApiCategory = '';
let currentApiPricing = '';

async function loadApisSection() {
  const apisGrid = document.getElementById('apis-grid');
  const categoryFiltersContainer = document.getElementById('apis-category-filters');
  const pricingFiltersContainer = document.getElementById('apis-pricing-filters');
  if (!apisGrid) return;

  try {
    const response = await fetch('/api/apis');
    if (!response.ok) throw new Error('Failed to fetch apis');

    const data = await response.json();
    allApisData = data.apis || [];

    // 初始化分类按钮
    if (categoryFiltersContainer && allApisData.length > 0) {
      initApiCategoryFilters();
    }
    if (pricingFiltersContainer && allApisData.length > 0) {
      initApiPricingFilters();
    }

    // 渲染API
    renderApis();

    console.log(`✅ Loaded ${allApisData.length} apis`);
  } catch (error) {
    console.error('Failed to load apis:', error);
    apisGrid.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
  }
}

function initApiCategoryFilters() {
  const container = document.getElementById('apis-category-filters');
  if (!container) return;

  const categories = ['官方API', 'API聚合平台', '国内平台', '开源项目'];

  let html = '<button class="category-filter-btn active" data-category="" onclick="filterApisByCategory(\'\')">全部</button>';
  categories.forEach(function (cat) {
    html += '<button class="category-filter-btn" data-category="' + cat + '" onclick="filterApisByCategory(\'' + cat + '\')">' + cat + '</button>';
  });

  container.innerHTML = html;
}

function initApiPricingFilters() {
  const container = document.getElementById('apis-pricing-filters');
  if (!container) return;

  const pricingOptions = [
    { value: '', label: '全部定价' },
    { value: 'free', label: '免费' },
    { value: 'freemium', label: '免费+付费' },
    { value: 'paid', label: '付费' }
  ];

  let html = '';
  pricingOptions.forEach(function (option, index) {
    const activeClass = index === 0 ? ' active' : '';
    html += '<button class="category-filter-btn' + activeClass + '" data-pricing="' + option.value + '" onclick="filterApisByPricing(\'' + option.value + '\')">' + option.label + '</button>';
  });

  container.innerHTML = html;
}

function filterApisByCategory(category) {
  currentApiCategory = category;

  // 更新按钮状态
  document.querySelectorAll('#apis-category-filters .category-filter-btn').forEach(function (btn) {
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderApis();
}

function filterApisByPricing(pricing) {
  currentApiPricing = pricing;

  // 更新按钮状态
  document.querySelectorAll('#apis-pricing-filters .category-filter-btn').forEach(function (btn) {
    if (btn.dataset.pricing === pricing) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderApis();
}

function renderApis() {
  const apisGrid = document.getElementById('apis-grid');
  if (!apisGrid) return;

  let filtered = allApisData;

  // 应用主分类筛选
  if (currentApiCategory) {
    filtered = filtered.filter(function (api) { return api.category === currentApiCategory; });
  }

  // 应用定价筛选
  if (currentApiPricing) {
    filtered = filtered.filter(function (api) { return api.pricing === currentApiPricing; });
  }

  if (filtered.length === 0) {
    apisGrid.innerHTML = '<p class="empty-text">暂无API</p>';
  } else {
    apisGrid.innerHTML = filtered.map((item, index) => `
      <article class="tool-card" data-delay="${(index % 8) + 1}">
        <div class="tool-card-content">
          <h3 class="tool-card-title">${escapeHtml(item.title)}</h3>
          <p class="tool-card-description">${escapeHtml(item.description || '')}</p>
          ${(item.tags || []).length > 0 ? `<div class="tool-card-tags">${item.tags.map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="tool-card-actions">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="tool-card-link">访问 <span class="tool-card-link-arrow">→</span></a>
        </div>
      </article>
    `).join('');
  }
}

// Load Trends section dynamically
async function loadTrendsSection() {
  const trendsGrid = document.getElementById('trends-grid');
  if (!trendsGrid) return;

  // Record trends view
  fetch('/api/metrics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'trends_view' })
  }).catch(() => { });

  try {
    const response = await fetch('/api/trends');
    if (!response.ok) throw new Error('Failed to fetch trends');

    const data = await response.json();
    const trends = data.trends || [];

    if (trends.length === 0) {
      trendsGrid.innerHTML = '<p class="empty-text">暂无热点</p>';
    } else {
      trendsGrid.innerHTML = trends.map((item, index) => `
        <article class="tool-card" data-delay="${(index % 8) + 1}">
          <div class="tool-card-content">
            <h3 class="tool-card-title">${escapeHtml(item.title)}</h3>
            <p class="tool-card-description">${escapeHtml(item.description || '')}</p>
            ${(item.tags || []).length > 0 ? `<div class="tool-card-tags">${item.tags.map(tag => `<span class="tool-tag">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
          </div>
          <div class="tool-card-actions">
            <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener" class="tool-card-link">访问 <span class="tool-card-link-arrow">→</span></a>
          </div>
        </article>
      `).join('');
      console.log(`✅ Loaded ${trends.length} trends`);
    }
  } catch (error) {
    console.error('Failed to load trends:', error);
    trendsGrid.innerHTML = '<p class="error-text">加载失败，请刷新页面重试</p>';
  }
}

// Load data when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Main.js] DOMContentLoaded fired');

  // Load AI tools on tools page
  const toolsContainer = document.getElementById('ai-tools-container');
  console.log('[Main.js] ai-tools-container found:', !!toolsContainer);
  if (toolsContainer) {
    loadAITools();
  }

  // Load on index page (check for marquee - index page specific element)
  const marquee = document.getElementById('announcement-marquee');
  console.log('[Main.js] announcement-marquee found:', !!marquee);
  if (marquee) {
    loadIndexPageData();

    // 初始化 Skill Section Manager
    if (window.SkillSectionManager) {
      console.log('[Main.js] Initializing SkillSectionManager...');
      window.SkillSectionManager.init();
    }
  }

  // Load Apps/Products and other content on tools page
  const appsGrid = document.getElementById('apps-grid');
  const thoughtsContainer = document.getElementById('thoughts-container');
  const tutorialsGrid = document.getElementById('tutorials-grid');
  const apisGrid = document.getElementById('apis-grid');
  const workshopSection = document.getElementById('workshop');
  const n8nGrid = document.getElementById('n8n-grid');
  console.log('[Main.js] apps-grid found:', !!appsGrid, 'thoughts-container found:', !!thoughtsContainer);
  console.log('[Main.js] tutorials-grid found:', !!tutorialsGrid, 'apis-grid found:', !!apisGrid);
  console.log('[Main.js] workshop-section found:', !!workshopSection, 'n8n-grid found:', !!n8nGrid);

  // Load tools page data if any tools page element is found
  if (appsGrid || thoughtsContainer || tutorialsGrid || apisGrid || workshopSection || n8nGrid) {
    loadToolsPageData();
  }
});

// Load data for tools page (solo content and thoughts)
async function loadToolsPageData() {
  console.log('📦 Loading tools page data...');

  // Record AI tools page view
  fetch('/api/metrics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'ai_tool_click' })
  }).catch(() => { });

  // Load site settings first
  try {
    const settingsRes = await fetch('/api/settings');
    if (settingsRes.ok) {
      const settings = await settingsRes.json();

      // Update site name
      if (settings.siteName) {
        const logoTexts = document.querySelectorAll('.logo-text');
        logoTexts.forEach(el => el.textContent = settings.siteName);

        // 不再修改页面标题，由后端动态渲染处理

        // Update footer
        const footerText = document.querySelector('.footer-text');
        if (footerText) {
          footerText.textContent = `© 2024 ${settings.siteName}. ${settings.slogan || '一人打造的 AI 工具导航与自建生态'}`;
        }
      }

      // Update slogan
      if (settings.slogan) {
        const contentSubtitle = document.querySelector('.content-subtitle');
        if (contentSubtitle) contentSubtitle.textContent = settings.slogan;
      }

      // Update SEO description
      if (settings.seoDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', settings.seoDescription);
      }
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  // Load Apps and Products from API
  await loadAppsSection();
  await loadProductsSection();

  // Load Workshop (AI 开发工坊)
  await loadWorkshopData();

  // Load Tutorials, APIs, Trends
  await loadTutorialsSection();
  await loadApisSection();
  await loadTrendsSection();

  // Load solo content
  try {
    const contentRes = await fetch('/api/content');
    if (contentRes.ok) {
      const content = await contentRes.json();
      const soloContent = document.getElementById('solo-content');
      if (soloContent) {
        let html = '';

        // 简介内容
        if (content.solo && content.solo.trim()) {
          html += `<div class="solo-intro">${escapeHtml(content.solo)}</div>`;
        }

        if (html) {
          soloContent.innerHTML = html;
        } else {
          soloContent.innerHTML = '<p class="empty-text">内容即将上线...</p>';
        }
      }

      // 渲染工作流卡片列表 - 和admin.html一样的样式
      if (content.workflows && Array.isArray(content.workflows)) {
        const visibleWorkflows = content.workflows.filter(w => w.visible !== false);
        visibleWorkflows.sort((a, b) => (a.order || 0) - (b.order || 0));
        renderWorkflowCards(visibleWorkflows);
      }
    }
  } catch (e) {
    console.error('Failed to load content:', e);
  }

  // 渲染工作流卡片列表
  function renderWorkflowCards(workflows) {
    const gridEl = document.getElementById('workflows-grid');
    const countEl = document.getElementById('workflows-count');

    if (!gridEl) return;

    if (countEl) {
      countEl.textContent = workflows.length;
    }

    if (workflows.length === 0) {
      gridEl.innerHTML = `
        <div class="empty-workflows">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
          <p>暂无工作流</p>
        </div>
      `;
      return;
    }

    gridEl.innerHTML = workflows.map(workflow => `
      <div class="workflow-card" onclick="viewWorkflowDetail('${workflow.id}')">
        <div class="workflow-card-header">
          <h4 class="workflow-card-title">${escapeHtml(workflow.title || '未命名')}</h4>
        </div>
        <p class="workflow-card-desc">${escapeHtml(workflow.description || '')}</p>
        <div class="workflow-card-preview">
          <div class="workflow-card-preview-canvas" style="width: 2000px; height: 1200px;">
            ${renderWorkflowCardPreview(workflow)}
          </div>
        </div>
      </div>
    `).join('');

    // 保存工作流数据供查看使用
    window.allWorkflowsData = workflows;
  }

  // 渲染工作流卡片预览
  function renderWorkflowCardPreview(workflow) {
    if (!workflow.nodes || workflow.nodes.length === 0) {
      return '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:12px;">空画布</div>';
    }

    return workflow.nodes.map(node => `
      <div style="position:absolute;left:${node.position.x}px;top:${node.position.y}px;width:200px;background:var(--background-subtle);border:2px solid var(--accent-blue);border-radius:8px;padding:16px;">
        <div style="color:var(--text-primary);font-size:14px;font-weight:600;margin-bottom:8px;">${escapeHtml(node.title || '未命名')}</div>
        <div style="color:var(--text-secondary);font-size:12px;">${escapeHtml(node.description || '')}</div>
      </div>
    `).join('');
  }

  // 查看工作流详情
  window.viewWorkflowDetail = function (workflowId) {
    if (!window.allWorkflowsData) return;

    const workflow = window.allWorkflowsData.find(w => w.id === workflowId);
    if (!workflow) return;

    window.currentViewingWorkflow = workflow;

    // 设置标题
    const titleEl = document.getElementById('workflow-viewer-title');
    if (titleEl) {
      titleEl.textContent = workflow.title || '未命名工作流';
    }

    // 渲染画布
    renderViewerCanvas(workflow);

    // 初始化画布拖拽
    initCanvasPan();

    // 显示模态框
    const modal = document.getElementById('workflow-viewer-modal');
    if (modal) {
      modal.classList.add('active');
    }
  };

  // 画布拖拽状态
  let canvasPanState = {
    isPanning: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0
  };

  // 初始化画布拖拽功能
  function initCanvasPan() {
    const canvas = document.getElementById('workflow-viewer-canvas');
    const container = document.querySelector('.workflow-viewer-canvas-container');
    if (!canvas || !container) return;

    // 重置偏移
    canvasPanState.offsetX = 0;
    canvasPanState.offsetY = 0;
    canvas.style.transform = 'translate(0px, 0px)';

    // 获取触摸或鼠标位置的辅助函数
    function getEventPosition(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    // 开始拖拽（鼠标或触摸）
    function startPan(e) {
      // 如果点击的是节点，不启动拖拽
      if (e.target.closest('[data-node-id]')) return;

      const pos = getEventPosition(e);
      canvasPanState.isPanning = true;
      canvasPanState.startX = pos.x - canvasPanState.offsetX;
      canvasPanState.startY = pos.y - canvasPanState.offsetY;
      container.style.cursor = 'grabbing';

      // 阻止默认行为（防止页面滚动）
      if (e.type === 'touchstart') {
        e.preventDefault();
      }
    }

    // 拖拽移动（鼠标或触摸）
    function movePan(e) {
      if (!canvasPanState.isPanning) return;

      const pos = getEventPosition(e);
      canvasPanState.offsetX = pos.x - canvasPanState.startX;
      canvasPanState.offsetY = pos.y - canvasPanState.startY;

      canvas.style.transform = `translate(${canvasPanState.offsetX}px, ${canvasPanState.offsetY}px)`;

      // 同步移动SVG连接线
      const svg = document.getElementById('workflow-viewer-connections');
      if (svg) {
        svg.style.transform = `translate(${canvasPanState.offsetX}px, ${canvasPanState.offsetY}px)`;
      }

      // 阻止默认行为（防止页面滚动）
      if (e.type === 'touchmove') {
        e.preventDefault();
      }
    }

    // 结束拖拽（鼠标或触摸）
    function endPan() {
      canvasPanState.isPanning = false;
      container.style.cursor = 'grab';
    }

    // 鼠标事件
    container.onmousedown = startPan;
    container.onmousemove = movePan;
    container.onmouseup = endPan;
    container.onmouseleave = endPan;

    // 触摸事件（移动端）
    container.addEventListener('touchstart', startPan, { passive: false });
    container.addEventListener('touchmove', movePan, { passive: false });
    container.addEventListener('touchend', endPan);
    container.addEventListener('touchcancel', endPan);

    // 设置初始光标
    container.style.cursor = 'grab';
  }

  // 更新查看器画布尺寸（无限画布实现，与后端同步）
  function updateViewerCanvasSize(workflow) {
    const canvas = document.getElementById('workflow-viewer-canvas');
    const container = document.querySelector('.workflow-viewer-canvas-container');
    const svg = document.getElementById('workflow-viewer-connections');

    if (!canvas || !workflow.nodes || workflow.nodes.length === 0) return;

    // 计算节点边界 - 与后端参数完全一致
    let maxY = 0;
    let maxX = 0;
    let minY = Infinity;
    let minX = Infinity;
    const nodeHeight = 150;  // 与后端同步：150px
    const nodeWidth = 250;   // 与后端同步：250px（实际渲染180px，但计算用250px）
    const padding = 500;     // 与后端同步：500px

    workflow.nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
    });

    // 无限画布：根据内容自动扩展
    const requiredHeight = Math.max(2000, maxY + padding);  // 默认2000px
    const requiredWidth = Math.max(3000, maxX + padding);   // 默认3000px

    console.log('Viewer canvas size (infinite):', {
      width: requiredWidth,
      height: requiredHeight,
      nodes: workflow.nodes.length,
      bounds: { minX, minY, maxX, maxY }
    });

    // 更新画布尺寸
    canvas.style.width = requiredWidth + 'px';
    canvas.style.height = requiredHeight + 'px';
    canvas.style.minWidth = requiredWidth + 'px';
    canvas.style.minHeight = requiredHeight + 'px';

    // 更新SVG尺寸
    if (svg) {
      svg.setAttribute('width', requiredWidth);
      svg.setAttribute('height', requiredHeight);
      svg.style.width = requiredWidth + 'px';
      svg.style.height = requiredHeight + 'px';
    }
  }

  // 渲染查看器画布
  function renderViewerCanvas(workflow) {
    const canvas = document.getElementById('workflow-viewer-canvas');
    if (!canvas) return;

    // 更新画布尺寸（无限画布）
    updateViewerCanvasSize(workflow);

    canvas.innerHTML = '';
    canvas.style.transform = 'translate(0px, 0px)';

    // 重置SVG
    const svg = document.getElementById('workflow-viewer-connections');
    if (svg) {
      svg.style.transform = 'translate(0px, 0px)';
    }

    if (!workflow.nodes || workflow.nodes.length === 0) {
      canvas.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);">暂无节点</div>';
      return;
    }

    // 检测当前主题
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';

    // 渲染节点
    workflow.nodes.forEach(node => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'workflow-viewer-node';
      nodeEl.dataset.nodeId = node.id;
      nodeEl.style.cssText = `
        position: absolute;
        left: ${node.position.x}px;
        top: ${node.position.y}px;
        width: 180px;
        padding: 16px;
        cursor: pointer;
        z-index: 2;
      `;

      nodeEl.innerHTML = `
        <h4 class="workflow-viewer-node-title">● ${escapeHtml(node.title || '未命名')}</h4>
        <p class="workflow-viewer-node-description">${escapeHtml(node.description || '')}</p>
      `;

      // 点击显示详情
      nodeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        showNodeDetailModal(node);
      });

      canvas.appendChild(nodeEl);
    });

    // 渲染连接线
    requestAnimationFrame(() => renderViewerConnections(workflow));
  }

  // 渲染查看器连接线
  function renderViewerConnections(workflow) {
    const svg = document.getElementById('workflow-viewer-connections');
    const canvas = document.getElementById('workflow-viewer-canvas');
    if (!svg || !canvas) return;

    // 检测当前主题 - 白天黑色，夜晚青色霓虹
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const arrowColor = isDarkTheme ? '#06b6d4' : '#000000';

    const defs = `
      <defs>
        <marker id="viewer-arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="${arrowColor}" />
        </marker>
      </defs>
    `;

    if (!workflow.connections || workflow.connections.length === 0) {
      svg.innerHTML = defs;
      return;
    }

    const paths = workflow.connections.map(conn => {
      const fromNode = canvas.querySelector(`[data-node-id="${conn.from}"]`);
      const toNode = canvas.querySelector(`[data-node-id="${conn.to}"]`);

      if (!fromNode || !toNode) return '';

      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      const fromSide = conn.fromSide || 'right';
      const toSide = conn.toSide || 'left';

      let x1, y1, x2, y2;

      if (fromSide === 'right') {
        x1 = fromRect.right - canvasRect.left;
      } else {
        x1 = fromRect.left - canvasRect.left;
      }
      y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;

      if (toSide === 'left') {
        x2 = toRect.left - canvasRect.left;
      } else {
        x2 = toRect.right - canvasRect.left;
      }
      y2 = toRect.top + toRect.height / 2 - canvasRect.top;

      const midX = (x1 + x2) / 2;
      // 白天黑色，夜晚青色霓虹
      const strokeColor = isDarkTheme ? '#06b6d4' : '#000000';
      const strokeWidth = isDarkTheme ? '2.5' : '2';
      const glowFilter = isDarkTheme ? 'drop-shadow(0 0 5px rgba(6, 182, 212, 0.6))' : 'none';

      return `
        <path d="M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}" 
              stroke="${strokeColor}" 
              stroke-width="${strokeWidth}" 
              fill="none"
              opacity="${isDarkTheme ? '0.9' : '0.8'}"
              style="filter: ${glowFilter}"
              marker-end="url(#viewer-arrowhead)">
        </path>
      `;
    }).join('');

    svg.innerHTML = defs + paths;
  }

  // 显示节点详情模态框
  function showNodeDetailModal(node) {
    const titleEl = document.getElementById('node-detail-title');
    const descEl = document.getElementById('node-detail-desc');
    const textEl = document.getElementById('node-detail-text');
    const linkEl = document.getElementById('node-detail-link');

    if (titleEl) titleEl.textContent = node.title || '';
    if (descEl) descEl.textContent = node.description || '';
    if (textEl) textEl.textContent = node.content || '';

    if (linkEl) {
      if (node.link) {
        linkEl.href = node.link;
        linkEl.style.display = 'inline-block';
      } else {
        linkEl.style.display = 'none';
      }
    }

    const modal = document.getElementById('node-detail-modal');
    if (modal) {
      modal.classList.add('active');
    }
  }

  // 关闭工作流查看器
  window.closeWorkflowViewer = function () {
    const modal = document.getElementById('workflow-viewer-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    window.currentViewingWorkflow = null;
  };

  // 关闭节点详情
  window.closeNodeDetail = function () {
    const modal = document.getElementById('node-detail-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  };

  // 键盘事件
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const nodeModal = document.getElementById('node-detail-modal');
      const viewerModal = document.getElementById('workflow-viewer-modal');

      if (nodeModal && nodeModal.classList.contains('active')) {
        closeNodeDetail();
      } else if (viewerModal && viewerModal.classList.contains('active')) {
        closeWorkflowViewer();
      }
    }
  });

  // 点击模态框背景关闭
  const viewerModal = document.getElementById('workflow-viewer-modal');
  if (viewerModal) {
    viewerModal.addEventListener('click', (e) => {
      if (e.target.id === 'workflow-viewer-modal') {
        closeWorkflowViewer();
      }
    });
  }

  const nodeModal = document.getElementById('node-detail-modal');
  if (nodeModal) {
    nodeModal.addEventListener('click', (e) => {
      if (e.target.id === 'node-detail-modal') {
        closeNodeDetail();
      }
    });
  }

  // Function to render workflow connections (legacy - kept for compatibility)
  function renderWorkflowConnections() {
    const svg = document.getElementById('workflow-viewer-svg');
    const canvas = document.getElementById('workflow-viewer-canvas');
    if (!svg || !canvas || !window.workflowViewerData) return;

    const canvasRect = canvas.getBoundingClientRect();

    // Define arrow marker
    const defs = `
      <defs>
        <marker id="arrowhead-viewer" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
        </marker>
      </defs>
    `;

    let pathsHtml = '';

    window.workflowViewerData.connections.forEach(conn => {
      const fromNode = document.querySelector(`[data-node-id="${conn.from}"]`);
      const toNode = document.querySelector(`[data-node-id="${conn.to}"]`);

      if (!fromNode || !toNode) return;

      const fromRect = fromNode.getBoundingClientRect();
      const toRect = toNode.getBoundingClientRect();

      const x1 = fromRect.right - canvasRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
      const x2 = toRect.left - canvasRect.left;
      const y2 = toRect.top + toRect.height / 2 - canvasRect.top;

      const midX = (x1 + x2) / 2;

      pathsHtml += `
        <path d="M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}" 
              stroke="#3b82f6" 
              stroke-width="2" 
              fill="none" 
              marker-end="url(#arrowhead-viewer)"
              opacity="0.7"/>
      `;
    });

    svg.innerHTML = defs + pathsHtml;
  }

  // Function to show node details
  window.showNodeDetails = function (nodeId) {
    if (!window.workflowViewerData) return;

    const node = window.workflowViewerData.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;';
    modal.onclick = function (e) {
      if (e.target === modal) modal.remove();
    };

    modal.innerHTML = `
      <div style="background: #1e293b; border-radius: 12px; padding: 24px; max-width: 600px; width: 100%; border: 1px solid #334155;">
        <h3 style="color: #e2e8f0; margin: 0 0 16px 0; font-size: 20px;">${escapeHtml(node.title || '未命名')}</h3>
        ${node.description ? `<p style="color: #94a3b8; margin: 0 0 12px 0; font-size: 14px;">${escapeHtml(node.description)}</p>` : ''}
        ${node.content ? `<p style="color: #cbd5e1; margin: 0 0 16px 0; font-size: 14px; line-height: 1.6;">${escapeHtml(node.content)}</p>` : ''}
        ${node.link ? `
          <a href="${escapeHtml(node.link)}" target="_blank" rel="noopener noreferrer" 
             style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
            访问工具 →
          </a>
        ` : ''}
        <button onclick="this.closest('div[style*=fixed]').remove()" 
                style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: #94a3b8; font-size: 24px; cursor: pointer; padding: 4px 8px;">×</button>
      </div>
    `;

    document.body.appendChild(modal);
  };


  // Store all thoughts for filtering
  let allThoughts = [];
  let currentThoughtsFilter = 'all';

  // Render thoughts based on filter
  function renderThoughts(filter = 'all') {
    const thoughtsContainer = document.getElementById('thoughts-container');
    if (!thoughtsContainer) return;

    let posts = allThoughts;
    if (filter !== 'all') {
      posts = allThoughts.filter(p => p.category === filter);
    }

    if (posts && posts.length > 0) {
      thoughtsContainer.innerHTML = posts.map(post => `
        <article class="thought-card" data-category="${post.category}">
          <div class="thought-header">
            <span class="thought-date">${escapeHtml(post.date)}</span>
            <span class="thought-category-badge ${post.category}">${post.category === 'emotion' ? '情绪分享' : '给作者建议'}</span>
          </div>
          <div class="thought-body">${escapeHtml(post.content)}</div>
          ${post.comments && post.comments.length > 0 ? `
            <div class="thought-comments">
              <div class="thought-comments-title">作者回复 (${post.comments.length})</div>
              ${post.comments.map(c => `
                <div class="thought-comment">${escapeHtml(c.content)}</div>
              `).join('')}
            </div>
          ` : ''}
        </article>
      `).join('');
    } else {
      thoughtsContainer.innerHTML = '<p class="empty-text">暂无内容，来写下第一条吧！</p>';
    }
  }

  // Setup filter buttons
  function setupThoughtsFilters() {
    const filterBtns = document.querySelectorAll('.thoughts-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const filter = this.dataset.category;
        currentThoughtsFilter = filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Re-render with filter
        renderThoughts(filter);
      });
    });
  }

  // Load anonymous thoughts
  try {
    const thoughtsRes = await fetch('/api/anonymous-thoughts');
    if (thoughtsRes.ok) {
      const data = await thoughtsRes.json();
      allThoughts = data.posts || [];
      renderThoughts('all');
      setupThoughtsFilters();
    }
  } catch (e) {
    console.error('Failed to load thoughts:', e);
  }
}

// ===================================
// Custom Cursor Module
// 白天：蓝色光圈 + 蓝色拖尾（清新科技感）
// 黑夜：赛博朋克风格 - 白色光圈 + 彩虹拖尾
// ===================================

class CustomCursorModule {
  constructor() {
    this.cursorDot = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastTrailX = 0;
    this.lastTrailY = 0;
    this.rafId = null;
    this.hasMouseEntered = false;
    this.hue = 0;
    this.lightHue = 217; // Blue hue for light mode

    // Trail particles
    this.trails = [];
    this.trailCount = 6;
    this.trailPositions = [];

    this.init();
  }

  init() {
    this.createCursorElements();
    this.bindEvents();
    this.animate();
  }

  createCursorElements() {
    // Check if we're on a touch device
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(max-width: 767px)').matches) {
      return;
    }

    // Create main cursor dot
    this.cursorDot = document.createElement('div');
    this.cursorDot.className = 'cursor-dot';
    this.cursorDot.style.opacity = '0';
    document.body.appendChild(this.cursorDot);

    // Create trail particles
    for (let i = 0; i < this.trailCount; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      const size = 12 - i * 1.5;
      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.opacity = '0';
      document.body.appendChild(trail);
      this.trails.push(trail);
      this.trailPositions.push({ x: -100, y: -100 });
    }

    // Store trail base opacities
    this.trailBaseOpacities = [];
    for (let i = 0; i < this.trailCount; i++) {
      this.trailBaseOpacities.push((1 - i / this.trailCount) * 0.5);
    }
  }

  isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  bindEvents() {
    if (!this.cursorDot) return;

    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.hasMouseEntered) {
        this.hasMouseEntered = true;
        this.lastTrailX = this.mouseX;
        this.lastTrailY = this.mouseY;
        // Initialize positions
        for (let i = 0; i < this.trailPositions.length; i++) {
          this.trailPositions[i].x = this.mouseX;
          this.trailPositions[i].y = this.mouseY;
        }
        // Show cursor
        this.cursorDot.style.opacity = '1';
        document.body.classList.add('cursor-active');
      }

      // Create trail particles based on distance
      const distance = Math.sqrt(
        Math.pow(this.mouseX - this.lastTrailX, 2) +
        Math.pow(this.mouseY - this.lastTrailY, 2)
      );

      const trailDistance = this.isDarkMode() ? 30 : 35;

      if (distance > trailDistance) {
        this.createTrailParticle(this.mouseX, this.mouseY);
        this.lastTrailX = this.mouseX;
        this.lastTrailY = this.mouseY;
      }
    });

    // Hover detection
    const interactiveElements = 'a, button, [onclick], .tool-card, .nav-item, .submenu-item, .filter-btn, .user-avatar, .portfolio-item, .service-card, .btn, .header-icon, .thought-card, .nav-link';

    document.addEventListener('mouseover', (e) => {
      if (!this.cursorDot) return;
      const target = e.target.closest(interactiveElements);
      if (target) {
        this.cursorDot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!this.cursorDot) return;
      const target = e.target.closest(interactiveElements);
      if (target) {
        this.cursorDot.classList.remove('cursor-hover');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (!this.cursorDot) return;
      this.cursorDot.style.opacity = '0';
      this.trails.forEach(trail => trail.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
      if (!this.cursorDot || !this.hasMouseEntered) return;
      this.cursorDot.style.opacity = '1';
    });
  }

  createTrailParticle(x, y) {
    const particle = document.createElement('div');

    if (this.isDarkMode()) {
      // Dark mode: rainbow trail
      particle.className = 'rainbow-trail-particle';
      particle.style.backgroundColor = `hsl(${this.hue}, 100%, 50%)`;
      particle.style.boxShadow = `0 0 15px hsl(${this.hue}, 100%, 50%)`;
      this.hue = (this.hue + 15) % 360;
    } else {
      // Light mode: blue trail
      particle.className = 'blue-trail-particle';
      const lightness = 50 + (this.lightHue % 30);
      particle.style.backgroundColor = `hsl(217, 100%, ${lightness}%)`;
      particle.style.boxShadow = `0 0 12px hsl(217, 100%, ${lightness}%)`;
    }

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, this.isDarkMode() ? 800 : 700);
  }

  animate() {
    if (!this.cursorDot) return;

    // Update cursor dot position
    this.cursorDot.style.left = `${this.mouseX}px`;
    this.cursorDot.style.top = `${this.mouseY}px`;

    // Update trail particles with cascading delay
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const speed = 0.12 - i * 0.012;
      if (i === 0) {
        this.trailPositions[i].x += (this.mouseX - this.trailPositions[i].x) * speed;
        this.trailPositions[i].y += (this.mouseY - this.trailPositions[i].y) * speed;
      } else {
        this.trailPositions[i].x += (this.trailPositions[i - 1].x - this.trailPositions[i].x) * speed;
        this.trailPositions[i].y += (this.trailPositions[i - 1].y - this.trailPositions[i].y) * speed;
      }

      this.trails[i].style.left = `${this.trailPositions[i].x}px`;
      this.trails[i].style.top = `${this.trailPositions[i].y}px`;

      // Hide old trail system (we use particle system now)
      this.trails[i].style.opacity = '0';
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.cursorDot) this.cursorDot.remove();
    this.trails.forEach(trail => trail.remove());
    document.body.classList.remove('cursor-active');
  }
}

// Initialize card 3D tilt effect for dark mode
document.addEventListener('DOMContentLoaded', () => {
  initCardTiltEffect();
});

// Card 3D Tilt Effect for Dark Mode
function initCardTiltEffect() {
  const cards = document.querySelectorAll('.tool-card, .portfolio-item, .service-card, .thought-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (document.documentElement.getAttribute('data-theme') !== 'dark') return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.addEventListener('mousedown', () => {
      if (document.documentElement.getAttribute('data-theme') !== 'dark') return;
      card.style.transform = 'perspective(1000px) translateY(-4px) scale(1.05)';
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseup', () => {
      card.style.transition = '';
    });
  });
}

// Log performance metrics after page load
// Removed: performanceMonitor.logMetrics() - not needed for tools page

// ===================================
// Dynamic Background Particle System
// 全屏动态背景粒子效果
// 深色模式：彩虹/青色赛博朋克粒子
// 白天模式：柔和蓝白清新粒子
// ===================================

class DynamicBackgroundModule {
  constructor(options = {}) {
    // Configuration
    this.config = {
      particleCount: window.innerWidth < 768 ? 40 : 80,
      minSize: 3,
      maxSize: 8,
      minSpeed: 20,
      maxSpeed: 80,
      swayAmplitude: 30,
      swayFrequency: 0.002,
      mouseRadius: 150,
      mouseForce: 15,
      burstParticleCount: 10,
      mode: options.mode || 'energy', // 'energy', 'snow', 'stars'
      ...options
    };

    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.burstParticles = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.animationId = null;
    this.lastTime = 0;
    this.hue = 0;

    this.init();
  }

  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();

    console.log('✅ Dynamic Background initialized');
  }

  createCanvas() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dynamic-background';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      pointer-events: none;
    `;

    // Insert at the end of body (on top of everything)
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);

    // Update particle count based on screen size
    const targetCount = window.innerWidth < 768 ? 40 : 80;
    while (this.particles.length < targetCount) {
      this.particles.push(this.createParticle());
    }
    while (this.particles.length > targetCount) {
      this.particles.pop();
    }
  }

  isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  createParticle(x = null, y = null, isBurst = false) {
    const size = this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize);
    const speed = this.config.minSpeed + Math.random() * (this.config.maxSpeed - this.config.minSpeed);

    return {
      x: x !== null ? x : Math.random() * window.innerWidth,
      y: y !== null ? y : (isBurst ? y : -size - Math.random() * 100),
      size: size,
      baseSize: size,
      speed: speed,
      speedX: isBurst ? (Math.random() - 0.5) * 200 : 0,
      speedY: isBurst ? (Math.random() - 0.5) * 200 : speed,
      opacity: isBurst ? 1 : 0.3 + Math.random() * 0.5,
      hue: Math.random() * 360,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 1.5,
      life: isBurst ? 1 : -1, // -1 means infinite life
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 1 + Math.random() * 2
    };
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      const particle = this.createParticle();
      // Distribute particles across the screen initially
      particle.y = Math.random() * window.innerHeight;
      this.particles.push(particle);
    }
  }

  bindEvents() {
    // Resize handler
    window.addEventListener('resize', () => this.resize());

    // Mouse move - enable pointer events temporarily
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Mouse click - burst effect
    document.addEventListener('click', (e) => {
      this.createBurst(e.clientX, e.clientY);
    });

    // Theme change observer
    const observer = new MutationObserver(() => {
      // Theme changed, particles will automatically adapt
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  createBurst(x, y) {
    for (let i = 0; i < this.config.burstParticleCount; i++) {
      const particle = this.createParticle(x, y, true);
      this.burstParticles.push(particle);
    }
  }

  updateParticle(particle, deltaTime, index) {
    const isDark = this.isDarkMode();
    const mode = this.config.mode;

    // Update position based on mode
    if (mode === 'stars') {
      // Stars float upward
      particle.y -= particle.speed * deltaTime;
      if (particle.y < -particle.size) {
        particle.y = window.innerHeight + particle.size;
        particle.x = Math.random() * window.innerWidth;
      }
    } else {
      // Energy/Snow fall downward
      particle.y += particle.speed * deltaTime;
      if (particle.y > window.innerHeight + particle.size) {
        particle.y = -particle.size;
        particle.x = Math.random() * window.innerWidth;
      }
    }

    // Sway effect (sine wave)
    const sway = Math.sin(Date.now() * this.config.swayFrequency * particle.swaySpeed + particle.swayOffset);
    particle.x += sway * this.config.swayAmplitude * deltaTime;

    // Keep particles in bounds horizontally
    if (particle.x < -particle.size) particle.x = window.innerWidth + particle.size;
    if (particle.x > window.innerWidth + particle.size) particle.x = -particle.size;

    // Mouse interaction - magnetic effect
    const dx = this.mouseX - particle.x;
    const dy = this.mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.config.mouseRadius && distance > 0) {
      const force = (1 - distance / this.config.mouseRadius) * this.config.mouseForce;
      // Repel particles (negative force for attraction)
      particle.x -= (dx / distance) * force * deltaTime * 60;
      particle.y -= (dy / distance) * force * deltaTime * 60;
    }

    // Twinkle effect for stars mode
    if (mode === 'stars') {
      particle.twinkle += particle.twinkleSpeed * deltaTime;
      particle.size = particle.baseSize * (0.7 + 0.3 * Math.sin(particle.twinkle));
    }

    // Update hue for rainbow effect
    particle.hue = (particle.hue + 30 * deltaTime) % 360;
  }

  updateBurstParticle(particle, deltaTime) {
    particle.x += particle.speedX * deltaTime;
    particle.y += particle.speedY * deltaTime;
    particle.life -= deltaTime;
    particle.opacity = Math.max(0, particle.life);
    particle.size = particle.baseSize * particle.life;

    // Add gravity
    particle.speedY += 100 * deltaTime;

    // Slow down
    particle.speedX *= 0.98;
    particle.speedY *= 0.98;
  }

  drawParticle(particle) {
    const isDark = this.isDarkMode();
    const mode = this.config.mode;

    this.ctx.save();

    let color, glowColor, glowSize;

    if (isDark) {
      // Dark mode - cyberpunk style
      if (mode === 'energy') {
        // Rainbow/cyan energy particles
        color = `hsla(${particle.hue}, 100%, 60%, ${particle.opacity})`;
        glowColor = `hsla(${particle.hue}, 100%, 50%, ${particle.opacity * 0.5})`;
        glowSize = particle.size * 3;
      } else if (mode === 'snow') {
        // White snow
        color = `rgba(255, 255, 255, ${particle.opacity})`;
        glowColor = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
        glowSize = particle.size * 2;
      } else {
        // Stars - twinkling
        color = `hsla(${180 + particle.hue * 0.2}, 80%, 70%, ${particle.opacity})`;
        glowColor = `hsla(${180 + particle.hue * 0.2}, 100%, 60%, ${particle.opacity * 0.6})`;
        glowSize = particle.size * 4;
      }

      // Draw glow
      this.ctx.shadowBlur = glowSize;
      this.ctx.shadowColor = glowColor;
    } else {
      // Light mode - soft blue/white
      if (mode === 'energy') {
        // Soft blue gradient
        const blueHue = 200 + (particle.hue % 30);
        color = `hsla(${blueHue}, 70%, 70%, ${particle.opacity * 0.7})`;
        glowColor = `hsla(${blueHue}, 60%, 80%, ${particle.opacity * 0.2})`;
        glowSize = particle.size * 1.5;
      } else if (mode === 'snow') {
        // Light snow
        color = `rgba(200, 220, 240, ${particle.opacity * 0.8})`;
        glowColor = `rgba(200, 220, 240, ${particle.opacity * 0.2})`;
        glowSize = particle.size;
      } else {
        // Stars - subtle
        color = `hsla(210, 50%, 80%, ${particle.opacity * 0.6})`;
        glowColor = `hsla(210, 50%, 90%, ${particle.opacity * 0.2})`;
        glowSize = particle.size * 2;
      }

      // Subtle glow for light mode
      this.ctx.shadowBlur = glowSize;
      this.ctx.shadowColor = glowColor;
    }

    // Draw particle
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.restore();
  }

  animate(currentTime = 0) {
    const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Update and draw regular particles
    for (let i = 0; i < this.particles.length; i++) {
      this.updateParticle(this.particles[i], deltaTime, i);
      this.drawParticle(this.particles[i]);
    }

    // Update and draw burst particles
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      this.updateBurstParticle(this.burstParticles[i], deltaTime);
      if (this.burstParticles[i].life <= 0) {
        this.burstParticles.splice(i, 1);
      } else {
        this.drawParticle(this.burstParticles[i]);
      }
    }

    this.animationId = requestAnimationFrame((time) => this.animate(time));
  }

  setMode(mode) {
    this.config.mode = mode;
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize dynamic background
let dynamicBackground = null;
document.addEventListener('DOMContentLoaded', () => {
  // Initialize on all devices (particle count is reduced for mobile)
  dynamicBackground = new DynamicBackgroundModule({ mode: 'energy' });
});

// Expose for external control
window.DynamicBackgroundModule = DynamicBackgroundModule;
window.setBackgroundMode = (mode) => {
  if (dynamicBackground) {
    dynamicBackground.setMode(mode);
  }
};

// ===================================
// Sidebar Collapse Module
// ===================================
class SidebarCollapseModule {
  constructor() {
    this.sidebar = document.getElementById('side-nav');
    this.toggleBtn = document.getElementById('sidebar-toggle');
    this.isCollapsed = false;
    this.hideTimeout = null;
    this.tooltipHideTimeout = null;

    // Load saved state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
      this.isCollapsed = true;
      this.applyCollapsedState();
    }

    this.init();
  }

  init() {
    if (!this.toggleBtn || !this.sidebar) return;

    this.toggleBtn.addEventListener('click', () => this.toggle());

    // Keyboard shortcut: Press '[' to toggle sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === '[' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeEl = document.activeElement;
        const isInput = activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable;
        if (!isInput) {
          this.toggle();
        }
      }
    });

    // Setup submenu popup with 0.5s delay
    this.setupSubmenuPopup();

    // Setup submenu item tooltips with 0.5s delay
    this.setupSubmenuTooltips();

    // Handle clicks on submenu popup items
    const submenuPopupItems = this.sidebar.querySelectorAll('.submenu-popup-item');
    submenuPopupItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        e.stopPropagation(); // Stop event from bubbling to parent button

        // Update active state in both popup and regular submenu
        const section = item.dataset.section;
        if (section) {
          // Update popup items
          submenuPopupItems.forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          // Update regular submenu items
          const regularItems = this.sidebar.querySelectorAll('.submenu-item');
          regularItems.forEach(i => {
            i.classList.toggle('active', i.dataset.section === section);
          });

          // Scroll to section
          const targetSection = document.getElementById(section);
          if (targetSection) {
            const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Prevent clicks on submenu popup from triggering parent button
    const submenuPopup = this.sidebar.querySelector('.nav-submenu-popup');
    if (submenuPopup) {
      submenuPopup.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupSubmenuPopup() {
    const aiToolsNav = this.sidebar.querySelector('.nav-item.has-submenu');
    const submenuPopup = this.sidebar.querySelector('.nav-submenu-popup');

    if (!aiToolsNav || !submenuPopup) return;

    // Show popup on hover
    aiToolsNav.addEventListener('mouseenter', () => {
      if (!this.sidebar.classList.contains('collapsed')) return;
      clearTimeout(this.hideTimeout);
      submenuPopup.classList.add('visible');
    });

    // Hide popup with 0.5s delay when leaving nav item
    aiToolsNav.addEventListener('mouseleave', () => {
      if (!this.sidebar.classList.contains('collapsed')) return;
      this.hideTimeout = setTimeout(() => {
        if (!submenuPopup.matches(':hover')) {
          submenuPopup.classList.remove('visible');
        }
      }, 500);
    });

    // Keep popup visible when hovering over it
    submenuPopup.addEventListener('mouseenter', () => {
      clearTimeout(this.hideTimeout);
    });

    // Hide popup with 0.5s delay when leaving popup
    submenuPopup.addEventListener('mouseleave', () => {
      if (!this.sidebar.classList.contains('collapsed')) return;
      this.hideTimeout = setTimeout(() => {
        if (!aiToolsNav.matches(':hover')) {
          submenuPopup.classList.remove('visible');
        }
      }, 500);
    });
  }

  setupSubmenuTooltips() {
    const submenuItems = this.sidebar.querySelectorAll('.submenu-popup-item');
    const allTooltips = this.sidebar.querySelectorAll('.submenu-tooltip');

    // Hide all tooltips function
    const hideAllTooltips = () => {
      allTooltips.forEach(t => t.classList.remove('visible'));
    };

    submenuItems.forEach(item => {
      const tooltip = item.querySelector('.submenu-tooltip');
      if (!tooltip) return;

      // Show tooltip on hover - hide all others first
      item.addEventListener('mouseenter', () => {
        clearTimeout(this.tooltipHideTimeout);
        // Hide all tooltips immediately
        hideAllTooltips();
        // Show this tooltip
        tooltip.classList.add('visible');
      });

      // Hide tooltip with 0.5s delay when leaving item
      item.addEventListener('mouseleave', () => {
        this.tooltipHideTimeout = setTimeout(() => {
          tooltip.classList.remove('visible');
        }, 500);
      });
    });

    // Also hide all tooltips when mouse leaves the popup
    const submenuPopup = this.sidebar.querySelector('.nav-submenu-popup');
    if (submenuPopup) {
      submenuPopup.addEventListener('mouseleave', () => {
        this.tooltipHideTimeout = setTimeout(() => {
          hideAllTooltips();
        }, 500);
      });
    }
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.applyCollapsedState();
    localStorage.setItem('sidebarCollapsed', this.isCollapsed);
  }

  applyCollapsedState() {
    if (this.isCollapsed) {
      this.sidebar.classList.add('collapsed');
      document.body.classList.add('sidebar-collapsed');
    } else {
      this.sidebar.classList.remove('collapsed');
      document.body.classList.remove('sidebar-collapsed');
    }
  }
}

// Initialize sidebar collapse on tools page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('side-nav') && document.getElementById('sidebar-toggle')) {
    new SidebarCollapseModule();
  }
});

// Expose CustomCursorModule globally for fallback initialization
window.CustomCursorModule = CustomCursorModule;

// ===================================
// Navigation Control Buttons (Pause/Theme)
// For index.html header nav buttons
// ===================================

class NavControlButtons {
  constructor() {
    this.pauseBtn = document.getElementById('nav-pause-toggle');
    this.themeBtn = document.getElementById('nav-theme-toggle');
    this.isPaused = false;

    this.init();
  }

  init() {
    this.bindPauseButton();
    this.bindThemeButton();
    this.syncThemeButtonState();
  }

  bindPauseButton() {
    if (!this.pauseBtn) return;

    this.pauseBtn.addEventListener('click', () => {
      this.togglePause();
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;

    // Update button icons
    const pauseIcon = this.pauseBtn.querySelector('.nav-control-icon--pause');
    const playIcon = this.pauseBtn.querySelector('.nav-control-icon--play');

    if (this.isPaused) {
      // Show play icon, hide pause icon
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (playIcon) playIcon.style.display = 'block';
      this.pauseBtn.setAttribute('aria-label', '播放动画');
      this.pauseBtn.setAttribute('title', '播放动画');

      // Pause particle system
      if (window.heroAnimationManager) {
        window.heroAnimationManager.pause();
      } else if (window.heroParticleSystem) {
        window.heroParticleSystem.pause();
      }
    } else {
      // Show pause icon, hide play icon
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (playIcon) playIcon.style.display = 'none';
      this.pauseBtn.setAttribute('aria-label', '暂停动画');
      this.pauseBtn.setAttribute('title', '暂停/播放动画');

      // Resume particle system
      if (window.heroAnimationManager) {
        window.heroAnimationManager.resume();
      } else if (window.heroParticleSystem) {
        window.heroParticleSystem.resume();
      }
    }
  }

  bindThemeButton() {
    if (!this.themeBtn) return;

    this.themeBtn.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    // Use heroAnimationManager's themeManager if available
    if (window.heroAnimationManager && window.heroAnimationManager.themeManager) {
      window.heroAnimationManager.themeManager.toggle();
    } else if (window.heroThemeManager) {
      window.heroThemeManager.toggle();
    } else {
      // Fallback: toggle data-theme attribute directly
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('hero-theme', newTheme);
    }

    // Update button state
    this.syncThemeButtonState();
  }

  syncThemeButtonState() {
    if (!this.themeBtn) return;

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const sunIcon = this.themeBtn.querySelector('.nav-control-icon--sun');
    const moonIcon = this.themeBtn.querySelector('.nav-control-icon--moon');

    if (currentTheme === 'dark') {
      // Dark mode: show sun icon (to switch to light)
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      // Light mode: show moon icon (to switch to dark)
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }
}

// Initialize nav control buttons on index page
document.addEventListener('DOMContentLoaded', () => {
  const navPauseBtn = document.getElementById('nav-pause-toggle');
  const navThemeBtn = document.getElementById('nav-theme-toggle');
  const navAdminBtn = document.getElementById('nav-admin-btn');

  if (navPauseBtn || navThemeBtn) {
    window.navControlButtons = new NavControlButtons();

    // Listen for theme changes to sync button state
    if (window.heroAnimationManager && window.heroAnimationManager.themeManager) {
      window.heroAnimationManager.themeManager.addListener(() => {
        if (window.navControlButtons) {
          window.navControlButtons.syncThemeButtonState();
        }
      });
    }
  }

  // ✅ 检查管理员状态，显示/隐藏管理员后台按钮
  if (navAdminBtn) {
    // 先检查localStorage缓存的管理员状态
    const cachedAdminStatus = localStorage.getItem('isAdmin');
    if (cachedAdminStatus === 'true') {
      navAdminBtn.style.visibility = 'visible';
      navAdminBtn.style.display = 'flex';
      console.log('✅ 管理员按钮已显示（缓存）');
    }

    // 然后异步验证
    fetch('/api/user/status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.isUser && data.isAdmin) {
          navAdminBtn.style.visibility = 'visible';
          navAdminBtn.style.display = 'flex';
          localStorage.setItem('isAdmin', 'true');
          console.log('✅ 管理员按钮已显示');
        } else {
          navAdminBtn.style.display = 'none';
          localStorage.removeItem('isAdmin');
        }
      })
      .catch(err => {
        console.log('检查管理员状态失败:', err);
        // 出错时保持缓存状态
        if (cachedAdminStatus !== 'true') {
          navAdminBtn.style.display = 'none';
        }
      });
  }
});

// Development helpers
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  window.devTools = {
    app,
    webVitalsMonitor,
    errorHandler,
    accessibilityEnhancements,
    Utils
  };
}


// ========== Workflow Visualization (Frontend Display) ==========

class WorkflowVisualization {
  constructor(containerId, workflowData = null) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById('workflow-canvas');
    this.nodesContainer = document.getElementById('workflow-nodes');
    this.svg = document.getElementById('workflow-connections');
    this.modal = document.getElementById('workflow-modal');
    this.selector = document.getElementById('workflow-selector');

    this.workflowData = workflowData || { nodes: [], connections: [] };
    this.allWorkflows = [];
    this.currentWorkflowId = null;
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Node dimensions (must match CSS)
    this.nodeWidth = 220;
    this.nodeHeight = 80;

    this.init();
  }

  async init() {
    // Only load data if not provided in constructor
    if (!this.workflowData || !this.workflowData.nodes || this.workflowData.nodes.length === 0) {
      await this.loadWorkflowData();
    }
    this.renderSelector();
    this.render();
    this.setupControls();
    this.setupPanZoom();
    this.setupModal();
  }

  async loadWorkflowData() {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        // Use new workflows array structure
        if (data.workflows && Array.isArray(data.workflows)) {
          // Store all visible workflows
          this.allWorkflows = data.workflows.filter(w => w.visible !== false);
          this.allWorkflows.sort((a, b) => (a.order || 0) - (b.order || 0));

          console.log('加载工作流数量:', this.allWorkflows.length);

          if (this.allWorkflows.length > 0) {
            this.currentWorkflowId = this.allWorkflows[0].id;
            this.workflowData = this.allWorkflows[0];
          }
        }
      }
    } catch (error) {
      console.error('Failed to load workflow data:', error);
    }
  }

  renderSelector() {
    if (!this.selector) {
      console.log('选择器元素不存在');
      return;
    }

    console.log('渲染选择器，工作流数量:', this.allWorkflows.length);

    if (this.allWorkflows.length === 0) {
      this.selector.style.display = 'none';
      return;
    }

    this.selector.style.display = 'flex';
    const tabsHtml = this.allWorkflows.map(w => `
            <button class="workflow-tab ${w.id === this.currentWorkflowId ? 'active' : ''}" 
                    data-workflow-id="${w.id}"
                    type="button">
                ${this.escapeHtml(w.title || '未命名工作流')}
            </button>
        `).join('');
    const refreshHtml = `
            <button class="workflow-refresh-btn" data-action="refresh" type="button">刷新画布</button>
            <span class="workflow-hint-text">画面如果出现错乱请刷新</span>
        `;
    this.selector.innerHTML = tabsHtml + refreshHtml;

    console.log('选择器按钮数量:', this.selector.querySelectorAll('.workflow-tab').length);

    // Add click handlers
    this.selector.querySelectorAll('.workflow-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const workflowId = tab.dataset.workflowId;
        console.log('点击工作流:', workflowId);
        this.selectWorkflow(workflowId);
      });
    });
    const refreshBtn = this.selector.querySelector('[data-action="refresh"]');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.refreshCanvas();
      });
    }
  }

  selectWorkflow(workflowId) {
    if (this.currentWorkflowId === workflowId) return;

    const workflow = this.allWorkflows.find(w => w.id === workflowId);
    if (!workflow) return;

    this.currentWorkflowId = workflowId;
    this.workflowData = workflow;

    // Update selector UI
    this.selector.querySelectorAll('.workflow-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.workflowId === workflowId);
    });

    // Update title and description
    const titleEl = document.getElementById('workflow-title');
    const descEl = document.getElementById('workflow-description');
    if (titleEl) titleEl.textContent = workflow.title || '工具流程图';
    if (descEl) descEl.textContent = workflow.description || '';

    // Re-render
    this.render();
  }

  render() {
    this.renderNodes();
    // Render connections after a longer delay to ensure nodes are fully rendered and have correct dimensions
    setTimeout(() => {
      this.renderConnections();
    }, 100);
  }

  refreshCanvas() {
    this.render();
    requestAnimationFrame(() => this.renderConnections());
    setTimeout(() => this.renderConnections(), 120);
  }

  renderNodes() {
    if (!this.nodesContainer) return;

    this.nodesContainer.innerHTML = this.workflowData.nodes.map(node => `
            <div class="workflow-node" 
                 data-node-id="${node.id}"
                 style="left: ${node.position.x}px; top: ${node.position.y}px;">
                <h4 class="workflow-node-title">${this.escapeHtml(node.title)}</h4>
                <p class="workflow-node-description">${this.escapeHtml(node.description)}</p>
            </div>
        `).join('');

    // Add click handlers
    this.nodesContainer.querySelectorAll('.workflow-node').forEach(node => {
      node.addEventListener('click', (e) => {
        e.stopPropagation();
        const nodeId = node.dataset.nodeId;
        this.showNodeDetail(nodeId);
      });
    });
  }

  renderConnections() {
    if (!this.svg) {
      console.log('SVG element not found');
      return;
    }

    // Get actual node dimensions from rendered elements
    const nodeElements = this.nodesContainer.querySelectorAll('.workflow-node');
    const nodeDimensions = {};

    nodeElements.forEach(el => {
      const nodeId = el.dataset.nodeId;

      // Get the actual position from style (since getBoundingClientRect includes transforms)
      const left = parseInt(el.style.left) || 0;
      const top = parseInt(el.style.top) || 0;

      nodeDimensions[nodeId] = {
        width: el.offsetWidth,
        height: el.offsetHeight,
        x: left,
        y: top
      };
    });

    // Calculate canvas bounds for SVG sizing
    const bounds = this.calculateCanvasBounds();

    // Set SVG to cover the entire canvas area (no viewBox, use direct pixel coordinates)
    this.svg.style.position = 'absolute';
    this.svg.style.top = '0';
    this.svg.style.left = '0';
    this.svg.style.width = bounds.width + 'px';
    this.svg.style.height = bounds.height + 'px';
    this.svg.style.overflow = 'visible';
    this.svg.removeAttribute('viewBox');

    // Determine theme for colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const strokeColor = isDark ? '#ffffff' : '#1a1a1a';
    const arrowId = isDark ? 'arrowhead-dark' : 'arrowhead-light';

    // Clear old paths but preserve defs
    const existingPaths = this.svg.querySelectorAll(':scope > path');
    existingPaths.forEach(p => p.remove());

    console.log('Rendering', this.workflowData.connections.length, 'connections');

    this.workflowData.connections.forEach(conn => {
      const fromNode = this.workflowData.nodes.find(n => n.id === conn.from);
      const toNode = this.workflowData.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return;

      // Get actual dimensions from rendered nodes
      const fromDim = nodeDimensions[conn.from] || { width: this.nodeWidth, height: this.nodeHeight, x: fromNode.position.x, y: fromNode.position.y };
      const toDim = nodeDimensions[conn.to] || { width: this.nodeWidth, height: this.nodeHeight, x: toNode.position.x, y: toNode.position.y };

      // Connection starts from right edge of source node, ends at left edge of target node
      const x1 = fromDim.x + fromDim.width;
      const y1 = fromDim.y + fromDim.height / 2;
      const x2 = toDim.x - 10;
      const y2 = toDim.y + toDim.height / 2;

      // Calculate control points for smooth bezier curve
      const midX = (x1 + x2) / 2;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', '2.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', `url(#${arrowId})`);
      this.svg.appendChild(path);

      console.log(`Drew path from ${conn.from} to ${conn.to}`);
    });
  }

  calculateCanvasBounds() {
    if (this.workflowData.nodes.length === 0) {
      return { width: 1200, height: 600 };
    }

    let maxX = 0, maxY = 0;

    this.workflowData.nodes.forEach(node => {
      maxX = Math.max(maxX, node.position.x + this.nodeWidth + 50);
      maxY = Math.max(maxY, node.position.y + this.nodeHeight + 50);
    });

    return { width: Math.max(maxX, 1200), height: Math.max(maxY, 600) };
  }

  setupControls() {
    const zoomIn = document.getElementById('workflow-zoom-in');
    const zoomOut = document.getElementById('workflow-zoom-out');
    const reset = document.getElementById('workflow-reset');

    if (zoomIn) {
      zoomIn.addEventListener('click', () => this.zoom(1.2));
    }

    if (zoomOut) {
      zoomOut.addEventListener('click', () => this.zoom(0.8));
    }

    if (reset) {
      reset.addEventListener('click', () => this.resetView());
    }
  }

  setupPanZoom() {
    if (!this.canvas) return;

    // Mouse wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      this.zoom(delta);
    }, { passive: false });

    // Pan with mouse drag - allow dragging from anywhere on canvas
    this.canvas.addEventListener('mousedown', (e) => {
      // Allow drag from canvas, svg, or nodes container background
      if (e.target === this.canvas || e.target === this.svg ||
        e.target === this.nodesContainer || e.target.closest('.workflow-canvas')) {
        // Don't start drag if clicking on a node
        if (e.target.closest('.workflow-node')) return;

        this.isDragging = true;
        this.dragStartX = e.clientX - this.panX;
        this.dragStartY = e.clientY - this.panY;
        this.canvas.classList.add('dragging');
        e.preventDefault();
      }
    });

    // Use bound handlers for proper cleanup
    this.handleMouseMove = (e) => {
      if (this.isDragging) {
        this.panX = e.clientX - this.dragStartX;
        this.panY = e.clientY - this.dragStartY;
        this.updateTransform();
      }
    };

    this.handleMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.classList.remove('dragging');
      }
    };

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.target.closest('.workflow-node')) return;
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX - this.panX;
        this.dragStartY = e.touches[0].clientY - this.panY;
        this.canvas.classList.add('dragging');
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        this.panX = e.touches[0].clientX - this.dragStartX;
        this.panY = e.touches[0].clientY - this.dragStartY;
        this.updateTransform();
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isDragging = false;
      this.canvas.classList.remove('dragging');
    });
  }

  zoom(factor) {
    this.scale *= factor;
    this.scale = Math.max(0.5, Math.min(2, this.scale)); // Limit scale
    this.updateTransform();
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.updateTransform();
  }

  updateTransform() {
    const transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    const transformOrigin = '0 0';

    if (this.nodesContainer) {
      this.nodesContainer.style.transform = transform;
      this.nodesContainer.style.transformOrigin = transformOrigin;
    }
    if (this.svg) {
      this.svg.style.transform = transform;
      this.svg.style.transformOrigin = transformOrigin;
    }
  }

  setupModal() {
    const closeBtn = document.getElementById('workflow-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideModal());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.hideModal();
        }
      });
    }
  }

  showNodeDetail(nodeId) {
    const node = this.workflowData.nodes.find(n => n.id === nodeId);
    if (!node || !this.modal) return;

    document.getElementById('workflow-modal-title').textContent = node.title;
    document.getElementById('workflow-modal-description').textContent = node.description;
    document.getElementById('workflow-modal-content-text').textContent = node.content || '暂无详细说明';

    const link = document.getElementById('workflow-modal-link');
    if (node.link) {
      link.href = node.link;
      link.style.display = 'inline-flex';
    } else {
      link.style.display = 'none';
    }

    this.modal.classList.add('active');
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export WorkflowVisualization to window for external access
window.WorkflowVisualization = WorkflowVisualization;

// ========================================
// Homepage Workflow Manager - 首页多工作流管理
// ========================================

const HomepageWorkflowManager = {
  allWorkflows: [],
  currentWorkflowId: null,
  pollInterval: null,
  lastDataHash: null,
  POLL_INTERVAL: 30000,
  isInitialized: false,
  connectionPositions: [], // 缓存连接线位置

  getDataHash(data) {
    return JSON.stringify(data);
  },

  hasDataChanged(newData) {
    const newHash = this.getDataHash(newData);
    if (this.lastDataHash !== newHash) {
      this.lastDataHash = newHash;
      return true;
    }
    return false;
  },

  getCurrentWorkflow() {
    return this.allWorkflows.find(w => w.id === this.currentWorkflowId);
  },

  selectWorkflow(workflowId) {
    if (this.currentWorkflowId === workflowId) return;
    this.currentWorkflowId = workflowId;
    this.updateSelectorUI();
    this.updateTitleAndDescription();
    this.renderWorkflow();
  },

  updateSelectorUI() {
    document.querySelectorAll('.workflow-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.workflowId === this.currentWorkflowId);
    });
  },

  updateTitleAndDescription() {
    const workflow = this.getCurrentWorkflow();
    if (workflow) {
      const titleEl = document.getElementById('workflow-title');
      const descEl = document.getElementById('workflow-description');
      if (titleEl) titleEl.textContent = workflow.title || '工具流程图';
      if (descEl) descEl.textContent = workflow.description || '';
    }
  },

  renderSelector() {
    const selector = document.getElementById('workflow-selector');
    if (!selector) {
      console.warn('工作流选择器元素未找到');
      return;
    }

    console.log('渲染工作流选择器，工作流数量:', this.allWorkflows.length);
    console.log('工作流列表:', this.allWorkflows.map(w => ({ id: w.id, title: w.title, visible: w.visible })));

    // 没有工作流时隐藏选择器
    if (this.allWorkflows.length === 0) {
      selector.style.display = 'none';
      console.log('没有工作流，隐藏选择器');
      return;
    }

    // 只有一个工作流时也显示选择器（让用户知道当前是哪个工作流）
    // 强制显示选择器
    selector.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important;';

    const buttonsHTML = this.allWorkflows.map(w => `
            <button class="workflow-tab ${w.id === this.currentWorkflowId ? 'active' : ''}" 
                    data-workflow-id="${w.id}"
                    type="button">
                ${this.escapeHtml(w.title || '未命名工作流')}
            </button>
        `).join('');

    const refreshHtml = `
            <button class="workflow-refresh-btn" data-action="refresh" type="button">刷新画布</button>
            <span class="workflow-hint-text">画面如果出现错乱请刷新</span>
        `;
    selector.innerHTML = buttonsHTML + refreshHtml;

    console.log('选择器HTML:', buttonsHTML);
    console.log('选择器已渲染，按钮数量:', selector.querySelectorAll('.workflow-tab').length);
    console.log('选择器display:', selector.style.display);
    console.log('选择器offsetHeight:', selector.offsetHeight);

    selector.querySelectorAll('.workflow-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('点击工作流:', tab.dataset.workflowId);
        this.selectWorkflow(tab.dataset.workflowId);
      });
    });
    const refreshBtn = selector.querySelector('[data-action="refresh"]');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.refreshCanvas();
      });
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  renderWorkflow() {
    console.log('renderWorkflow called');
    const workflowData = this.getCurrentWorkflow();
    if (!workflowData || !workflowData.nodes) {
      console.log('No workflow data or nodes');
      return;
    }
    console.log('Workflow has', workflowData.nodes.length, 'nodes and', workflowData.connections?.length || 0, 'connections');

    const canvas = document.getElementById('workflow-canvas');
    const nodesContainer = document.getElementById('workflow-nodes');
    const wrapper = document.querySelector('.workflow-canvas-wrapper');
    const svg = document.getElementById('workflow-connections');
    if (!canvas || !nodesContainer) {
      console.log('Canvas or nodes container not found');
      return;
    }

    // 计算画布需要的最小高度 - 无限画布实现（与后端同步）
    let maxY = 0;
    let maxX = 0;
    let minY = Infinity;
    let minX = Infinity;
    const nodeHeight = 150;  // 与后端同步：150px
    const nodeWidth = 250;   // 与后端同步：250px
    const padding = 500;     // 与后端同步：500px

    workflowData.nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxY = Math.max(maxY, node.position.y + nodeHeight);
      maxX = Math.max(maxX, node.position.x + nodeWidth);
    });

    // 无限画布：根据内容自动扩展，与后端保持一致
    const requiredHeight = Math.max(2000, maxY + padding);  // 默认2000px
    const requiredWidth = Math.max(3000, maxX + padding);   // 默认3000px

    console.log('Frontend canvas size (infinite):', {
      width: requiredWidth,
      height: requiredHeight,
      nodes: workflowData.nodes.length,
      bounds: { minX, minY, maxX, maxY }
    });

    if (wrapper) {
      wrapper.style.minHeight = requiredHeight + 'px';
      wrapper.style.height = requiredHeight + 'px';
      wrapper.style.width = requiredWidth + 'px';
    }
    if (canvas) {
      canvas.style.minHeight = requiredHeight + 'px';
      canvas.style.height = requiredHeight + 'px';
      canvas.style.width = requiredWidth + 'px';
    }
    if (svg) {
      svg.style.height = requiredHeight + 'px';
      svg.style.width = requiredWidth + 'px';
      svg.setAttribute('width', requiredWidth);
      svg.setAttribute('height', requiredHeight);
    }

    // 渲染节点
    const nodesHTML = workflowData.nodes.map(node => `
            <div class="workflow-node" 
                 data-node-id="${node.id}" 
                 style="left: ${node.position.x}px; top: ${node.position.y}px;">
                <div class="node-connector node-connector-left"></div>
                <div class="node-connector node-connector-right"></div>
                <h4>${this.escapeHtml(node.title || '未命名')}</h4>
                <p>${this.escapeHtml(node.description || '')}</p>
            </div>
        `).join('');

    nodesContainer.innerHTML = '';
    nodesContainer.innerHTML = nodesHTML;

    // 绑定点击事件
    nodesContainer.querySelectorAll('.workflow-node').forEach(node => {
      node.addEventListener('click', () => {
        const nodeId = node.dataset.nodeId;
        const nodeData = workflowData.nodes.find(n => n.id === nodeId);
        if (nodeData) this.showNodeDetails(nodeData);
      });
    });

    // 清除缓存的连接线位置
    this.connectionPositions = [];

    // 渲染连接线 - 使用多次延迟确保节点已渲染
    const self = this;
    requestAnimationFrame(() => {
      setTimeout(() => {
        console.log('Calling renderConnections...');
        self.renderConnections(true); // true = 计算并缓存位置
      }, 100);
    });
  },

  refreshCanvas() {
    this.renderWorkflow();
    requestAnimationFrame(() => this.renderConnections(true));
    setTimeout(() => this.renderConnections(true), 120);
  },

  // 只更新连接线颜色，不重新计算位置
  updateConnectionColors() {
    const svg = document.getElementById('workflow-connections');
    if (!svg) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const strokeColor = isDark ? '#ffffff' : '#1a1a1a';
    const arrowId = isDark ? 'arrowhead-dark' : 'arrowhead-light';

    console.log('更新连接线颜色:', isDark ? 'dark' : 'light');

    // 更新所有现有路径的颜色
    const paths = svg.querySelectorAll(':scope > path');
    paths.forEach(path => {
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('marker-end', `url(#${arrowId})`);
    });
  },

  renderConnections(cachePositions = false) {
    const workflowData = this.getCurrentWorkflow();
    if (!workflowData || !workflowData.connections || workflowData.connections.length === 0) {
      console.log('No workflow data or connections');
      return;
    }

    const svg = document.getElementById('workflow-connections');
    const canvas = document.getElementById('workflow-canvas');
    const nodesContainer = document.getElementById('workflow-nodes');
    if (!svg || !canvas || !nodesContainer) {
      console.log('SVG, canvas or nodes container not found:', { svg: !!svg, canvas: !!canvas, nodesContainer: !!nodesContainer });
      return;
    }

    // 检查节点是否已渲染
    const nodeCount = nodesContainer.querySelectorAll('.workflow-node').length;
    if (nodeCount === 0) {
      console.log('Nodes not yet rendered, retrying...');
      setTimeout(() => this.renderConnections(cachePositions), 100);
      return;
    }

    // 确保 SVG 有正确的尺寸
    const canvasHeight = canvas.offsetHeight || 350;
    const canvasWidth = canvas.offsetWidth || 800;
    svg.setAttribute('width', canvasWidth);
    svg.setAttribute('height', canvasHeight);
    svg.style.width = canvasWidth + 'px';
    svg.style.height = canvasHeight + 'px';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.overflow = 'visible';
    svg.style.pointerEvents = 'none';

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const strokeColor = isDark ? '#ffffff' : '#1a1a1a';
    const arrowId = isDark ? 'arrowhead-dark' : 'arrowhead-light';

    console.log('Theme:', isDark ? 'dark' : 'light', 'Stroke:', strokeColor, 'Arrow:', arrowId);

    // 清除旧的路径（保留 defs 中的内容）
    const existingPaths = svg.querySelectorAll(':scope > path, :scope > line');
    existingPaths.forEach(p => p.remove());

    console.log('Rendering connections:', workflowData.connections.length);

    // 如果有缓存的位置且不需要重新计算，使用缓存
    if (!cachePositions && this.connectionPositions.length > 0) {
      this.connectionPositions.forEach(pos => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pos.d);
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', `url(#${arrowId})`);
        svg.appendChild(path);
      });
      console.log('Used cached positions for', this.connectionPositions.length, 'connections');
      return;
    }

    // 计算新位置
    const newPositions = [];

    workflowData.connections.forEach(conn => {
      const fromNodeEl = nodesContainer.querySelector(`.workflow-node[data-node-id="${conn.from}"]`);
      const toNodeEl = nodesContainer.querySelector(`.workflow-node[data-node-id="${conn.to}"]`);

      if (fromNodeEl && toNodeEl) {
        const fromRect = fromNodeEl.getBoundingClientRect();
        const toRect = toNodeEl.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        const x1 = fromRect.right - canvasRect.left;
        const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
        const x2 = toRect.left - canvasRect.left - 10;
        const y2 = toRect.top + toRect.height / 2 - canvasRect.top;

        const midX = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

        newPositions.push({ d, from: conn.from, to: conn.to });

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', `url(#${arrowId})`);
        svg.appendChild(path);

        console.log(`Drew path from ${conn.from} to ${conn.to}`);
      } else {
        console.log(`Could not find nodes: from=${conn.from}, to=${conn.to}`);
      }
    });

    // 缓存位置
    if (cachePositions) {
      this.connectionPositions = newPositions;
    }

    console.log('SVG children after render:', svg.children.length);
  },

  showNodeDetails(nodeData) {
    const modal = document.getElementById('workflow-modal');
    if (!modal) return;

    document.getElementById('workflow-modal-title').textContent = nodeData.title || '';
    document.getElementById('workflow-modal-description').textContent = nodeData.description || '';
    document.getElementById('workflow-modal-content-text').textContent = nodeData.content || '暂无详细说明';

    const link = document.getElementById('workflow-modal-link');
    if (nodeData.link) {
      link.href = nodeData.link;
      link.style.display = 'inline-block';
    } else {
      link.style.display = 'none';
    }

    modal.classList.add('active');
  },

  hideModal() {
    const modal = document.getElementById('workflow-modal');
    if (modal) modal.classList.remove('active');
  },

  startPolling() {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(() => this.syncData(), this.POLL_INTERVAL);
  },

  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  },

  async syncData() {
    try {
      const indicator = document.getElementById('sync-indicator');
      if (indicator) indicator.classList.add('syncing');

      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('API error');

      const data = await res.json();

      if (data.workflows && this.hasDataChanged(data.workflows)) {
        const visibleWorkflows = data.workflows.filter(w => w.visible !== false);
        visibleWorkflows.sort((a, b) => (a.order || 0) - (b.order || 0));

        this.allWorkflows = visibleWorkflows;

        const currentExists = visibleWorkflows.some(w => w.id === this.currentWorkflowId);
        if (!currentExists && visibleWorkflows.length > 0) {
          this.currentWorkflowId = visibleWorkflows[0].id;
        }

        this.renderSelector();
        this.updateTitleAndDescription();
        this.renderWorkflow();
      }

      if (indicator) setTimeout(() => indicator.classList.remove('syncing'), 500);
    } catch (e) {
      console.error('Sync failed:', e);
      const indicator = document.getElementById('sync-indicator');
      if (indicator) indicator.classList.remove('syncing');
    }
  },

  async init() {
    console.log('HomepageWorkflowManager 初始化开始...');
    try {
      const res = await fetch('/api/content');
      console.log('API响应状态:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('获取到数据:', data);

        // 更新一人公司描述
        const descEl = document.getElementById('solo-description');
        if (descEl && data.solo) {
          descEl.textContent = data.solo;
        }

        // 同时更新 solo-content 元素（tools.html 使用这个）
        const soloContent = document.getElementById('solo-content');
        if (soloContent && data.solo) {
          soloContent.innerHTML = `<p class="solo-description">${data.solo}</p>`;
        }

        if (data.workflows && Array.isArray(data.workflows)) {
          console.log('工作流总数:', data.workflows.length);

          const visibleWorkflows = data.workflows.filter(w => w.visible !== false);
          visibleWorkflows.sort((a, b) => (a.order || 0) - (b.order || 0));

          console.log('可见工作流数量:', visibleWorkflows.length);
          console.log('可见工作流:', visibleWorkflows.map(w => w.title));

          this.allWorkflows = visibleWorkflows;
          this.lastDataHash = this.getDataHash(data.workflows);

          if (visibleWorkflows.length > 0) {
            this.currentWorkflowId = visibleWorkflows[0].id;
            console.log('当前选中工作流:', this.currentWorkflowId);

            this.renderSelector();
            this.updateTitleAndDescription();
            // 延迟渲染工作流，确保 DOM 完全准备好
            setTimeout(() => {
              this.renderWorkflow();
            }, 100);
          }

          this.startPolling();
        } else {
          console.warn('没有找到工作流数据');
        }
      }
    } catch (e) {
      console.error('加载工作流失败:', e);
    }

    // 设置弹窗关闭事件
    const closeBtn = document.getElementById('workflow-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideModal());
    }

    const modal = document.getElementById('workflow-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.hideModal();
      });
    }

    // 监听主题变化，重新渲染连接线
    this.setupThemeChangeListener();

    console.log('HomepageWorkflowManager 初始化完成');
  },

  setupThemeChangeListener() {
    // 监听 data-theme 属性变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          console.log('主题变化，更新连接线颜色');
          // 只更新颜色，不重新计算位置
          requestAnimationFrame(() => {
            this.updateConnectionColors();
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    this.themeObserver = observer;

    // 监听窗口大小变化，重新计算连接线位置
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        console.log('窗口大小变化，重新渲染连接线');
        this.connectionPositions = []; // 清除缓存
        this.renderConnections(true);
      }, 200);
    });
  }
};

// 导出到全局
window.HomepageWorkflowManager = HomepageWorkflowManager;

// ========================================
// AI Skill Section Manager - 首页 Skill 卡片加载
// ========================================

const SkillSectionManager = {
  skills: [],

  async init() {
    console.log('[SkillSectionManager] 初始化开始...');

    try {
      // 检查是否在首页
      const skillSection = document.getElementById('ai-skill');
      if (!skillSection) {
        console.log('[SkillSectionManager] 未找到 Skill section (#ai-skill)，跳过初始化');
        return;
      }

      console.log('[SkillSectionManager] 找到 Skill section，开始加载数据...');

      // 加载 skills 数据
      const apiUrl = 'https://skill.cdproveai.com/api/skills';
      console.log('[SkillSectionManager] 正在请求:', apiUrl);

      const response = await fetch(apiUrl);
      console.log('[SkillSectionManager] API 响应状态:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to load skills: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      this.skills = result.data?.skills || [];

      console.log(`[SkillSectionManager] 成功加载 ${this.skills.length} 个 skills`);

      // 只显示前8个
      const displaySkills = this.skills.slice(0, 8);
      console.log(`[SkillSectionManager] 准备显示前 ${displaySkills.length} 个 skills`);

      this.renderSkillCards(displaySkills);

      console.log('[SkillSectionManager] 初始化完成 ✓');
    } catch (error) {
      console.error('[SkillSectionManager] 初始化失败:', error);
      console.error('[SkillSectionManager] 错误详情:', error.message);
      this.showError();
    }
  },

  renderSkillCards(skills) {
    const grid = document.getElementById('skill-grid');
    if (!grid) {
      console.error('[SkillSectionManager] 未找到 skill-grid 元素');
      return;
    }

    console.log('[SkillSectionManager] 找到 skill-grid，开始渲染卡片...');

    if (skills.length === 0) {
      grid.innerHTML = '<p class="loading-text">暂无 Skill 数据</p>';
      return;
    }

    grid.innerHTML = skills.map(skill => this.createSkillCard(skill)).join('');
    console.log(`[SkillSectionManager] 已渲染 ${skills.length} 个卡片到 DOM`);

    // No need for card click events anymore - buttons handle navigation
    console.log('[SkillSectionManager] 卡片渲染完成，按钮已就绪');
  },

  createSkillCard(skill) {
    const icon = skill.icon || '🔧';
    const name = this.escapeHtml(skill.name || 'Unnamed Skill');
    const description = this.escapeHtml(skill.description || '');
    const category = this.escapeHtml(skill.category || 'general');
    const complexity = this.escapeHtml(skill.complexity || 'intermediate');

    // Build buttons HTML
    let buttonsHtml = '';

    // Always show detail button
    buttonsHtml += `
      <button class="skill-card-btn skill-card-btn--detail" onclick="event.stopPropagation(); window.open('https://skill.cdproveai.com/?skill=${skill.id}', '_blank');" title="查看详情">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>查看详情</span>
      </button>
    `;

    // Chinese prompt button - use systemPromptZH
    if (skill.systemPromptZH) {
      const promptContent = this.escapeHtml(skill.systemPromptZH).replace(/'/g, "\\'").replace(/\n/g, '\\n');
      buttonsHtml += `
        <button class="skill-card-btn skill-card-btn--copy" onclick="event.stopPropagation(); window.copySkillPrompt(this, '${promptContent}', 'zh');" title="复制中文提示词">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>中文提示词</span>
        </button>
      `;
    }

    // English prompt button - use systemPromptEN
    if (skill.systemPromptEN) {
      const promptContent = this.escapeHtml(skill.systemPromptEN).replace(/'/g, "\\'").replace(/\n/g, '\\n');
      buttonsHtml += `
        <button class="skill-card-btn skill-card-btn--copy" onclick="event.stopPropagation(); window.copySkillPrompt(this, '${promptContent}', 'en');" title="复制英文提示词">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>English Prompt</span>
        </button>
      `;
    }

    // Source code button - use sourceRepo
    if (skill.sourceRepo) {
      buttonsHtml += `
        <a class="skill-card-btn skill-card-btn--source" href="${skill.sourceRepo}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" title="查看源代码">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <span>源代码</span>
        </a>
      `;
    }

    return `
      <div class="skill-card" data-skill-id="${skill.id}">
        <div class="skill-card-header">
          <div class="skill-card-icon">${icon}</div>
          <h3 class="skill-card-title">${name}</h3>
        </div>
        <p class="skill-card-description">${description}</p>
        <div class="skill-card-meta">
          <span class="skill-card-tag">${category}</span>
          <span class="skill-card-tag">${complexity}</span>
        </div>
        ${buttonsHtml ? `<div class="skill-card-actions">${buttonsHtml}</div>` : ''}
      </div>
    `;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  showError() {
    const grid = document.getElementById('skill-grid');
    if (grid) {
      grid.innerHTML = '<p class="loading-text" style="color: #ef4444;">加载失败，请检查 Skill 服务是否可用</p>';
    }
  }
};

// 导出到全局
window.SkillSectionManager = SkillSectionManager;

// Global function for copying skill prompts from homepage cards
window.copySkillPrompt = async function (button, content, lang) {
  try {
    await navigator.clipboard.writeText(content);
    const originalText = button.querySelector('span').textContent;
    const feedbackText = lang === 'zh' ? '已复制!' : 'Copied!';
    button.querySelector('span').textContent = feedbackText;
    button.classList.add('copied');
    setTimeout(() => {
      button.querySelector('span').textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('复制失败，请手动复制');
  }
};

// Initialize workflow on homepage
// ===================================
// Application Initialization
// ===================================

// Initialize the application
const app = new CreativeStudioApp();

// Initialize performance monitoring (Web Vitals)
const webVitalsMonitor = new WebVitalsMonitor();

// Initialize error handling
const errorHandler = new ErrorHandler();

// Initialize accessibility enhancements
const accessibilityEnhancements = new AccessibilityEnhancements();

// Export for potential use in other scripts (after initialization)
window.CreativeStudioApp = {
  app,
  webVitalsMonitor,
  errorHandler,
  accessibilityEnhancements,
  Utils
};

document.addEventListener('DOMContentLoaded', () => {
  // ===================================
  // 修复：清理可能的重复标题元素（提前到最早执行）
  // ===================================
  function cleanupDuplicateTitleElements() {
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const titleTexts = heroTitle.querySelectorAll('.hero-title-text');
      if (titleTexts.length > 1) {
        console.warn(`检测到 ${titleTexts.length} 个重复的 .hero-title-text 元素，正在清理...`);
        // 保留第一个，删除其他的
        for (let i = 1; i < titleTexts.length; i++) {
          titleTexts[i].remove();
        }
        console.log('✅ 已清理重复的标题元素');
      }
    }
  }

  // 立即执行清理
  cleanupDuplicateTitleElements();

  // 在 DOMContentLoaded 后再次清理（防止动态创建）
  document.addEventListener('DOMContentLoaded', cleanupDuplicateTitleElements);

  // 在页面完全加载后再次清理
  window.addEventListener('load', cleanupDuplicateTitleElements);

  // 检查是否在首页（有solopreneur section）或 tools 页面（有 solo section）
  const solopreneurSection = document.getElementById('solopreneur') || document.getElementById('solo');
  const workflowCanvas = document.getElementById('workflow-canvas');

  if (solopreneurSection && workflowCanvas) {
    // 首页或 tools 页面 - 使用新的多工作流管理器
    setTimeout(() => {
      HomepageWorkflowManager.init();
    }, 300);
  } else if (workflowCanvas && !window.workflowVisualization) {
    // 其他页面 - 使用原有的单工作流可视化
    setTimeout(() => {
      window.workflowVisualization = new WorkflowVisualization('workflow-canvas');
    }, 500);
  }

  // Note: Skill Section initialization is handled in the main DOMContentLoaded handler above
});

// 页面卸载时停止轮询
window.addEventListener('beforeunload', () => {
  if (HomepageWorkflowManager.pollInterval) {
    HomepageWorkflowManager.stopPolling();
  }
});
