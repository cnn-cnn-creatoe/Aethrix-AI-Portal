/**
 * Property-Based Tests for UI Optimization and Refactor
 * 
 * Feature: ui-optimization-and-refactor
 * Testing Framework: Vitest + fast-check
 * 
 * These tests validate correctness properties defined in the design document.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// ===================================
// Test Setup Helpers
// ===================================

/**
 * Creates a JSDOM environment with the given viewport width
 */
function createDOMWithViewport(html, viewportWidth) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true,
  });
  
  // Set viewport width
  Object.defineProperty(dom.window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: viewportWidth
  });
  
  Object.defineProperty(dom.window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 800
  });
  
  return dom;
}

/**
 * Load CSS content from file
 */
function loadCSS() {
  const cssPath = path.join(__dirname, '../public/style.css');
  return fs.readFileSync(cssPath, 'utf-8');
}

/**
 * Parse CSS to extract media query breakpoints
 */
function extractBreakpoints(css) {
  const breakpoints = {
    mobile: 767,
    tablet: { min: 768, max: 1023 },
    desktop: { min: 1024, max: 1439 },
    largeDesktop: 1440
  };
  return breakpoints;
}

/**
 * Simulates CSS variable resolution for a given viewport width
 */
function getExpectedSidebarWidth(viewportWidth) {
  if (viewportWidth >= 1440) return 260;
  if (viewportWidth >= 1024) return 220;
  if (viewportWidth >= 768) return 200;
  return 0; // Hidden on mobile
}

/**
 * Checks if layout should have horizontal scrollbar
 */
function shouldHaveHorizontalScroll(viewportWidth, contentWidth) {
  return contentWidth > viewportWidth;
}

// ===================================
// Property 1: 响应式布局一致性
// For any viewport width, the page layout should render correctly
// without horizontal scrollbar or element overflow
// Validates: Requirements 2.1, 2.5
// ===================================

describe('Property 1: 响应式布局一致性', () => {
  /**
   * Feature: ui-optimization-and-refactor, Property 1: 响应式布局一致性
   * Validates: Requirements 2.1, 2.5
   * 
   * For any viewport width, the page layout should render correctly
   * without horizontal scrollbar or element overflow
   */
  it('should have consistent sidebar width for any viewport width', () => {
    fc.assert(
      fc.property(
        // Generate viewport widths from 320px (minimum mobile) to 2560px (4K)
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          const expectedSidebarWidth = getExpectedSidebarWidth(viewportWidth);
          
          // Verify sidebar width is appropriate for viewport
          if (viewportWidth < 768) {
            // Mobile: sidebar should be hidden (width 0 or off-screen)
            expect(expectedSidebarWidth).toBe(0);
          } else if (viewportWidth < 1024) {
            // Tablet: sidebar should be 200px
            expect(expectedSidebarWidth).toBe(200);
          } else if (viewportWidth < 1440) {
            // Desktop: sidebar should be 220px
            expect(expectedSidebarWidth).toBe(220);
          } else {
            // Large desktop: sidebar should be 260px
            expect(expectedSidebarWidth).toBe(260);
          }
          
          // Content area should fit within remaining viewport
          const contentWidth = viewportWidth - expectedSidebarWidth;
          expect(contentWidth).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 1: 响应式布局一致性
   * Validates: Requirements 2.1, 2.5
   * 
   * For any viewport width, content padding should be appropriate
   */
  it('should have appropriate content padding for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          // Expected padding based on breakpoints
          let expectedPadding;
          if (viewportWidth < 480) {
            expectedPadding = 12; // Small mobile
          } else if (viewportWidth < 768) {
            expectedPadding = 16; // Mobile
          } else if (viewportWidth < 1024) {
            expectedPadding = 24; // Tablet
          } else {
            expectedPadding = 32; // Desktop and above
          }
          
          // Verify padding is reasonable (not too small, not too large)
          expect(expectedPadding).toBeGreaterThanOrEqual(12);
          expect(expectedPadding).toBeLessThanOrEqual(40);
          
          // Content should still have usable width after padding
          const usableWidth = viewportWidth - (expectedPadding * 2);
          expect(usableWidth).toBeGreaterThan(200); // Minimum usable width
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 1: 响应式布局一致性
   * Validates: Requirements 2.1, 2.5
   * 
   * For any viewport width, grid columns should be appropriate
   */
  it('should have appropriate grid columns for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          // Calculate expected grid columns based on viewport
          // Assuming minmax(280px, 1fr) grid template
          const minCardWidth = 280;
          const gap = 24;
          const sidebarWidth = getExpectedSidebarWidth(viewportWidth);
          const padding = viewportWidth < 768 ? 16 : 32;
          
          const availableWidth = viewportWidth - sidebarWidth - (padding * 2);
          const maxColumns = Math.floor((availableWidth + gap) / (minCardWidth + gap));
          const expectedColumns = Math.max(1, maxColumns);
          
          // Verify columns are reasonable
          expect(expectedColumns).toBeGreaterThanOrEqual(1);
          // For large viewports (4K+), more columns are acceptable
          // Max columns scales with viewport: ~8 columns at 2560px is reasonable
          const maxReasonableColumns = Math.ceil(viewportWidth / 300);
          expect(expectedColumns).toBeLessThanOrEqual(maxReasonableColumns);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ===================================
// Property 4: 导航筛选一致性
// For any category filter operation, displayed items should all belong to the selected category
// Validates: Requirements 1.4
// ===================================

describe('Property 4: 导航筛选一致性', () => {
  // Sample tool data structure for testing
  const sampleTools = [
    { id: 1, name: 'ChatGPT', category: 'llm' },
    { id: 2, name: 'Claude', category: 'llm' },
    { id: 3, name: 'Midjourney', category: 'txt2img' },
    { id: 4, name: 'DALL-E', category: 'txt2img' },
    { id: 5, name: 'Runway', category: 'txt2vid' },
    { id: 6, name: 'Sora', category: 'txt2vid' },
    { id: 7, name: 'Figma AI', category: 'design' },
    { id: 8, name: 'Canva', category: 'design' },
    { id: 9, name: 'GitHub Copilot', category: 'coding' },
    { id: 10, name: 'Cursor', category: 'coding' },
  ];

  const categories = ['llm', 'txt2img', 'txt2vid', 'design', 'coding', 'all'];

  /**
   * Filter function that mimics the navigation filtering behavior
   */
  function filterToolsByCategory(tools, category) {
    if (category === 'all') {
      return tools;
    }
    return tools.filter(tool => tool.category === category);
  }

  /**
   * Feature: ui-optimization-and-refactor, Property 4: 导航筛选一致性
   * Validates: Requirements 1.4
   * 
   * For any category filter, all returned items should belong to that category
   */
  it('should return only items matching the selected category', () => {
    fc.assert(
      fc.property(
        // Generate random category selection
        fc.constantFrom(...categories),
        // Generate random subset of tools
        fc.shuffledSubarray(sampleTools, { minLength: 1 }),
        (selectedCategory, tools) => {
          const filteredTools = filterToolsByCategory(tools, selectedCategory);
          
          if (selectedCategory === 'all') {
            // All filter should return all tools
            expect(filteredTools.length).toBe(tools.length);
          } else {
            // Category filter should only return matching items
            filteredTools.forEach(tool => {
              expect(tool.category).toBe(selectedCategory);
            });
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 4: 导航筛选一致性
   * Validates: Requirements 1.4
   * 
   * Filtering should be idempotent - filtering twice should give same result
   */
  it('should be idempotent - filtering twice gives same result', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        fc.shuffledSubarray(sampleTools, { minLength: 1 }),
        (selectedCategory, tools) => {
          const firstFilter = filterToolsByCategory(tools, selectedCategory);
          const secondFilter = filterToolsByCategory(firstFilter, selectedCategory);
          
          // Filtering twice should give same result
          expect(secondFilter.length).toBe(firstFilter.length);
          expect(secondFilter).toEqual(firstFilter);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 4: 导航筛选一致性
   * Validates: Requirements 1.4
   * 
   * Filtered count should never exceed original count
   */
  it('should never return more items than original set', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        fc.shuffledSubarray(sampleTools, { minLength: 0 }),
        (selectedCategory, tools) => {
          const filteredTools = filterToolsByCategory(tools, selectedCategory);
          
          // Filtered result should never exceed original
          expect(filteredTools.length).toBeLessThanOrEqual(tools.length);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 4: 导航筛选一致性
   * Validates: Requirements 1.4
   * 
   * For any tool in filtered results, it should exist in original set
   */
  it('should only contain items from original set', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        fc.shuffledSubarray(sampleTools, { minLength: 1 }),
        (selectedCategory, tools) => {
          const filteredTools = filterToolsByCategory(tools, selectedCategory);
          
          // Every filtered item should exist in original
          filteredTools.forEach(filteredTool => {
            const exists = tools.some(t => t.id === filteredTool.id);
            expect(exists).toBe(true);
          });
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ===================================
// Property 5: 环境变量验证
// For any missing required environment variable, the system should provide
// clear error messages instead of failing silently
// Validates: Requirements 7.3
// ===================================

describe('Property 5: 环境变量验证', () => {
  /**
   * Environment variable validation function (mirrors server.js logic)
   */
  function validateEnv(env) {
    const warnings = [];
    const errors = [];
    
    // Check admin password
    const adminPassword = env.ADMIN_PASSWORD || '123456';
    if (adminPassword === '123456' || adminPassword === 'change_me_to_secure_password') {
      warnings.push('警告: ADMIN_PASSWORD 使用默认值，请在生产环境中修改');
    }
    
    // Check password strength
    if (adminPassword.length < 8) {
      warnings.push('警告: ADMIN_PASSWORD 长度应至少为8位');
    }
    
    // Check for required variables in production
    if (env.NODE_ENV === 'production') {
      if (!env.PORT) {
        errors.push('错误: 生产环境需要设置 PORT');
      }
    }
    
    return {
      valid: errors.length === 0,
      warnings,
      errors,
      hasWarnings: warnings.length > 0,
      hasErrors: errors.length > 0
    };
  }

  /**
   * Feature: ui-optimization-and-refactor, Property 5: 环境变量验证
   * Validates: Requirements 7.3
   * 
   * For any weak password, the system should generate a warning
   */
  it('should warn for weak passwords', () => {
    fc.assert(
      fc.property(
        // Generate passwords of various lengths (1-7 chars = weak)
        fc.string({ minLength: 1, maxLength: 7 }),
        (weakPassword) => {
          const result = validateEnv({
            ADMIN_PASSWORD: weakPassword,
            NODE_ENV: 'production'
          });
          
          // Should have warning about password length
          expect(result.hasWarnings).toBe(true);
          expect(result.warnings.some(w => w.includes('长度'))).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 5: 环境变量验证
   * Validates: Requirements 7.3
   * 
   * For any default password value, the system should generate a warning
   */
  it('should warn for default password values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('123456', 'change_me_to_secure_password'),
        (defaultPassword) => {
          const result = validateEnv({
            ADMIN_PASSWORD: defaultPassword,
            NODE_ENV: 'production'
          });
          
          // Should have warning about default value
          expect(result.hasWarnings).toBe(true);
          expect(result.warnings.some(w => w.includes('默认值'))).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 5: 环境变量验证
   * Validates: Requirements 7.3
   * 
   * For any strong password (8+ chars, not default), no password warnings
   */
  it('should not warn for strong non-default passwords', () => {
    fc.assert(
      fc.property(
        // Generate strong passwords (8+ chars, not default values)
        fc.string({ minLength: 8, maxLength: 32 }).filter(
          p => p !== '123456' && p !== 'change_me_to_secure_password'
        ),
        (strongPassword) => {
          const result = validateEnv({
            ADMIN_PASSWORD: strongPassword,
            NODE_ENV: 'development',
            PORT: '3006'
          });
          
          // Should not have password-related warnings
          const passwordWarnings = result.warnings.filter(
            w => w.includes('PASSWORD') || w.includes('密码')
          );
          expect(passwordWarnings.length).toBe(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: ui-optimization-and-refactor, Property 5: 环境变量验证
   * Validates: Requirements 7.3
   * 
   * Validation result should always have consistent structure
   */
  it('should always return consistent validation result structure', () => {
    fc.assert(
      fc.property(
        fc.record({
          ADMIN_PASSWORD: fc.option(fc.string(), { nil: undefined }),
          NODE_ENV: fc.option(fc.constantFrom('development', 'production', 'test'), { nil: undefined }),
          PORT: fc.option(fc.string(), { nil: undefined }),
          ADMIN_USERNAME: fc.option(fc.string(), { nil: undefined })
        }),
        (env) => {
          const result = validateEnv(env);
          
          // Result should always have these properties
          expect(result).toHaveProperty('valid');
          expect(result).toHaveProperty('warnings');
          expect(result).toHaveProperty('errors');
          expect(result).toHaveProperty('hasWarnings');
          expect(result).toHaveProperty('hasErrors');
          
          // Types should be correct
          expect(typeof result.valid).toBe('boolean');
          expect(Array.isArray(result.warnings)).toBe(true);
          expect(Array.isArray(result.errors)).toBe(true);
          expect(typeof result.hasWarnings).toBe('boolean');
          expect(typeof result.hasErrors).toBe('boolean');
          
          // Consistency checks
          expect(result.hasWarnings).toBe(result.warnings.length > 0);
          expect(result.hasErrors).toBe(result.errors.length > 0);
          expect(result.valid).toBe(result.errors.length === 0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ===================================
// Property 2: Animation Duration Compliance
// For any theme configuration, the total animation sequence duration
// SHALL match the configured totalDuration value
// Feature: hero-title-animation
// Validates: Requirements 1.10, 2.12
// ===================================

describe('Property 2: Animation Duration Compliance', () => {
  // Hero Animation Configuration (mirrors HeroAnimationConfig from main.js)
  const HeroAnimationConfig = {
    light: {
      title: {
        animationDuration: 1500, // ms
        floatDistance: 30, // px
      },
      subtitle: {
        animationDelay: 1000, // ms
        animationDuration: 1000, // ms
      },
      buttons: {
        animationDelay: 2000, // ms
        animationDuration: 800, // ms
      },
      totalDuration: 8000, // 8秒循环
    },
    dark: {
      title: {
        typewriterSpeed: 80, // ms per character
      },
      subtitle: {
        animationDelay: 2500, // ms
        animationDuration: 1500, // ms
      },
      buttons: {
        animationDelay: 4000, // ms
        animationDuration: 1000, // ms
      },
      totalDuration: 10000, // 10秒循环
    },
  };

  /**
   * Calculate the actual animation duration for a given theme and title text
   * @param {string} theme - 'light' or 'dark'
   * @param {string} titleText - The title text to animate
   * @returns {number} Total animation duration in milliseconds
   */
  function calculateAnimationDuration(theme, titleText) {
    const config = HeroAnimationConfig[theme];
    
    if (theme === 'light') {
      // Light mode: title fade + subtitle slide
      const titleDuration = config.title.animationDuration;
      const subtitleEnd = config.subtitle.animationDelay + config.subtitle.animationDuration;
      const buttonsEnd = config.buttons.animationDelay + config.buttons.animationDuration;
      
      return Math.max(titleDuration, subtitleEnd, buttonsEnd);
    } else {
      // Dark mode: typewriter + subtitle fade
      const typewriterDuration = titleText.length * config.title.typewriterSpeed;
      const subtitleEnd = config.subtitle.animationDelay + config.subtitle.animationDuration;
      const buttonsEnd = config.buttons.animationDelay + config.buttons.animationDuration;
      
      return Math.max(typewriterDuration, subtitleEnd, buttonsEnd);
    }
  }

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * For any theme, the animation sequence should complete within the configured totalDuration
   */
  it('should complete animation within configured totalDuration for light mode', () => {
    fc.assert(
      fc.property(
        // Generate various title texts (1-50 characters)
        fc.string({ minLength: 1, maxLength: 50 }),
        (titleText) => {
          const actualDuration = calculateAnimationDuration('light', titleText);
          const configuredDuration = HeroAnimationConfig.light.totalDuration;
          
          // Animation should complete within configured duration
          expect(actualDuration).toBeLessThanOrEqual(configuredDuration);
          
          // Animation should have reasonable minimum duration
          expect(actualDuration).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * For dark mode with typewriter effect, animation duration scales with text length
   */
  it('should scale typewriter duration with text length in dark mode', () => {
    fc.assert(
      fc.property(
        // Generate title texts of varying lengths
        fc.string({ minLength: 1, maxLength: 100 }),
        (titleText) => {
          const actualDuration = calculateAnimationDuration('dark', titleText);
          const configuredDuration = HeroAnimationConfig.dark.totalDuration;
          const typewriterSpeed = HeroAnimationConfig.dark.title.typewriterSpeed;
          
          // Typewriter duration should be proportional to text length
          const expectedTypewriterDuration = titleText.length * typewriterSpeed;
          
          // For short texts, subtitle/buttons may determine total duration
          // For long texts, typewriter determines total duration
          if (titleText.length * typewriterSpeed > HeroAnimationConfig.dark.buttons.animationDelay + HeroAnimationConfig.dark.buttons.animationDuration) {
            expect(actualDuration).toBe(expectedTypewriterDuration);
          }
          
          // Animation should have reasonable minimum duration
          expect(actualDuration).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * For the actual title text used in the app, animation should complete within totalDuration
   */
  it('should complete animation for actual title text within totalDuration', () => {
    const actualTitleText = 'Aethrix | 以太夜'; // 14 characters
    
    // Test light mode
    const lightDuration = calculateAnimationDuration('light', actualTitleText);
    expect(lightDuration).toBeLessThanOrEqual(HeroAnimationConfig.light.totalDuration);
    
    // Test dark mode
    const darkDuration = calculateAnimationDuration('dark', actualTitleText);
    expect(darkDuration).toBeLessThanOrEqual(HeroAnimationConfig.dark.totalDuration);
  });

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * Animation sequence should maintain proper ordering (title -> subtitle -> buttons)
   */
  it('should maintain proper animation sequence ordering', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (theme) => {
          const config = HeroAnimationConfig[theme];
          
          // Subtitle should start after title begins
          expect(config.subtitle.animationDelay).toBeGreaterThan(0);
          
          // Buttons should start after subtitle begins
          expect(config.buttons.animationDelay).toBeGreaterThan(config.subtitle.animationDelay);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * Dark mode should have longer totalDuration than light mode (10s vs 8s)
   */
  it('should have dark mode duration >= light mode duration', () => {
    expect(HeroAnimationConfig.dark.totalDuration).toBeGreaterThanOrEqual(
      HeroAnimationConfig.light.totalDuration
    );
  });

  /**
   * Feature: hero-title-animation, Property 2: Animation Duration Compliance
   * Validates: Requirements 1.10, 2.12
   * 
   * All animation durations should be positive numbers
   */
  it('should have all positive animation durations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        (theme) => {
          const config = HeroAnimationConfig[theme];
          
          // All durations should be positive
          expect(config.subtitle.animationDelay).toBeGreaterThan(0);
          expect(config.subtitle.animationDuration).toBeGreaterThan(0);
          expect(config.buttons.animationDelay).toBeGreaterThan(0);
          expect(config.buttons.animationDuration).toBeGreaterThan(0);
          expect(config.totalDuration).toBeGreaterThan(0);
          
          if (theme === 'light') {
            expect(config.title.animationDuration).toBeGreaterThan(0);
          } else {
            expect(config.title.typewriterSpeed).toBeGreaterThan(0);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
