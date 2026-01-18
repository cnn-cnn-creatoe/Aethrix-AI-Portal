// Role Management Module
// Handles user role checking and role-based redirects

// Admin email list (should match backend configuration)
const ADMIN_EMAILS = [
  'nan323660@gmail.com',
  '3236606446@qq.com'
];

/**
 * Get user role based on email
 * @param {Object} user - Firebase user object
 * @returns {string} User role ('admin' or 'user')
 */
function getUserRole(user) {
  if (!user || !user.email) {
    return 'user';
  }
  
  const isAdmin = checkAdminStatus(user.email);
  return isAdmin ? 'admin' : 'user';
}

/**
 * Check if email is in admin list
 * @param {string} email - Email address to check
 * @returns {boolean} True if email is admin, false otherwise
 */
function checkAdminStatus(email) {
  if (!email) {
    return false;
  }
  
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(adminEmail => 
    adminEmail.toLowerCase().trim() === normalizedEmail
  );
}

/**
 * Check if current user is admin
 * @returns {boolean} True if current user is admin
 */
function isCurrentUserAdmin() {
  const user = window.AuthStateManager.getCurrentUser();
  if (!user) {
    return false;
  }
  
  return checkAdminStatus(user.email);
}

/**
 * Handle role-based redirect after login
 * @param {Object} user - Firebase user object
 * @param {string} role - User role ('admin' or 'user')
 * @param {string} returnUrl - Optional return URL to redirect to
 */
function handleRoleBasedRedirect(user, role, returnUrl = null) {
  console.log('Handling redirect for role:', role, 'returnUrl:', returnUrl);
  
  // ✅ 静默跳转 - 不显示管理员选择模态框
  if (role === 'admin') {
    console.log('管理员登录成功，静默跳转到管理后台...');
    // 直接跳转到管理后台，不显示选择界面
    window.location.href = '/admin.html';
    return;
  }
  
  // For regular users, redirect to returnUrl or home
  if (returnUrl && returnUrl !== '/auth.html') {
    window.location.href = returnUrl;
  } else {
    window.location.href = '/index.html';
  }
}

/**
 * Show admin choice modal
 * Allows admin to choose between admin panel and user interface
 */
function showAdminChoiceModal() {
  const modal = document.getElementById('admin-choice-modal');
  if (modal) {
    modal.style.display = 'flex';
    
    // Set up global functions for modal buttons
    window.goToAdmin = function() {
      // Clear stored return URL
      sessionStorage.removeItem('admin_return_url');
      window.location.href = '/admin.html';
    };
    
    window.goToUser = function() {
      // Use stored return URL if available, otherwise go to index
      const returnUrl = sessionStorage.getItem('admin_return_url');
      sessionStorage.removeItem('admin_return_url');
      
      if (returnUrl) {
        window.location.href = returnUrl;
      } else {
        window.location.href = '/index.html';
      }
    };
  } else {
    // Fallback if modal not found
    console.warn('Admin choice modal not found, redirecting to admin panel');
    window.location.href = '/admin.html';
  }
}

/**
 * Require authentication for current page
 * Redirects to login if not authenticated
 * @param {string} requiredRole - Optional required role ('admin' or 'user')
 * @returns {Promise<Object|null>} Current user if authenticated, null otherwise
 */
async function requireAuth(requiredRole = null) {
  try {
    // Wait for auth state to be ready
    const user = await window.AuthStateManager.waitForAuthReady();
    
    if (!user) {
      // Not authenticated, redirect to login
      const currentUrl = window.location.pathname;
      window.location.href = `/auth.html?returnUrl=${encodeURIComponent(currentUrl)}`;
      return null;
    }
    
    // Check role if required
    if (requiredRole) {
      const userRole = getUserRole(user);
      
      if (requiredRole === 'admin' && userRole !== 'admin') {
        // Not admin, redirect to home
        alert('您没有权限访问此页面');
        window.location.href = '/index.html';
        return null;
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error in requireAuth:', error);
    window.location.href = '/auth.html';
    return null;
  }
}

/**
 * Require admin role for current page
 * Redirects to login or home if not admin
 * @returns {Promise<Object|null>} Current user if admin, null otherwise
 */
async function requireAdmin() {
  return await requireAuth('admin');
}

/**
 * Get return URL from query parameters
 * @returns {string|null} Return URL or null
 */
function getReturnUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');
  
  // Validate return URL to prevent open redirect
  if (returnUrl && returnUrl.startsWith('/')) {
    return returnUrl;
  }
  
  return null;
}

/**
 * Add admin email to list (for dynamic configuration)
 * @param {string} email - Email to add to admin list
 */
function addAdminEmail(email) {
  if (email && !ADMIN_EMAILS.includes(email)) {
    ADMIN_EMAILS.push(email);
    console.log('Admin email added:', email);
  }
}

/**
 * Load admin emails from server
 * @returns {Promise<Array>} Array of admin emails
 */
async function loadAdminEmailsFromServer() {
  try {
    const response = await fetch('/api/admin/emails');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.emails)) {
        // Clear and update admin emails
        ADMIN_EMAILS.length = 0;
        ADMIN_EMAILS.push(...data.emails);
        console.log('Admin emails loaded from server:', ADMIN_EMAILS.length);
        return ADMIN_EMAILS;
      }
    }
  } catch (error) {
    console.error('Error loading admin emails from server:', error);
  }
  
  return ADMIN_EMAILS;
}

// Export functions for use in other modules
window.RoleManager = {
  getUserRole,
  checkAdminStatus,
  isCurrentUserAdmin,
  handleRoleBasedRedirect,
  showAdminChoiceModal,
  requireAuth,
  requireAdmin,
  getReturnUrl,
  addAdminEmail,
  loadAdminEmailsFromServer,
  ADMIN_EMAILS // Export for testing
};
