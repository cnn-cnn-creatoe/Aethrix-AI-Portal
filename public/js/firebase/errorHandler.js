// Error Handling Module
// Handles Firebase authentication errors and provides user-friendly messages

// Firebase error code to Chinese message mapping
const ERROR_MESSAGES = {
  // Email/Password errors
  'auth/email-already-in-use': '该邮箱已被注册',
  'auth/invalid-email': '邮箱格式不正确',
  'auth/operation-not-allowed': '此登录方式未启用',
  'auth/weak-password': '密码强度太弱，请使用至少 8 个字符',
  'auth/user-disabled': '该账号已被禁用',
  'auth/user-not-found': '用户不存在',
  'auth/wrong-password': '密码错误',
  
  // Network errors
  'auth/network-request-failed': '网络连接失败，请检查网络后重试',
  'auth/timeout': '请求超时，请重试',
  
  // Token errors
  'auth/invalid-user-token': '登录已过期，请重新登录',
  'auth/user-token-expired': '登录已过期，请重新登录',
  'auth/null-user': '用户未登录',
  
  // OAuth errors
  'auth/account-exists-with-different-credential': '该邮箱已使用其他登录方式注册',
  'auth/auth-domain-config-required': 'Firebase 配置错误',
  'auth/cancelled-popup-request': '登录已取消',
  'auth/operation-not-supported-in-this-environment': '当前环境不支持此操作',
  'auth/popup-blocked': '弹窗被浏览器阻止，请允许弹窗后重试',
  'auth/popup-closed-by-user': '登录已取消',
  'auth/unauthorized-domain': '当前域名未授权',
  
  // Rate limiting
  'auth/too-many-requests': '请求过于频繁，请稍后再试',
  
  // Configuration errors
  'auth/invalid-api-key': 'Firebase API Key 无效',
  'auth/app-deleted': 'Firebase 应用已删除',
  'auth/app-not-authorized': 'Firebase 应用未授权',
  'auth/argument-error': '参数错误',
  'auth/invalid-persistence-type': '持久化类型无效',
  
  // Email verification
  'auth/expired-action-code': '验证链接已过期',
  'auth/invalid-action-code': '验证链接无效',
  
  // Password reset
  'auth/missing-email': '请输入邮箱地址',
  'auth/invalid-recipient-email': '收件人邮箱无效',
  'auth/invalid-sender': '发件人配置错误',
  'auth/invalid-message-payload': '邮件内容无效',
  
  // Generic errors
  'auth/internal-error': '服务器内部错误，请稍后重试',
  'auth/invalid-credential': '登录凭证无效',
  'auth/credential-already-in-use': '该凭证已被其他账号使用'
};

/**
 * Handle Firebase authentication error
 * @param {Error} error - Firebase error object
 * @returns {string} User-friendly error message
 */
function handleAuthError(error) {
  if (!error) {
    return '未知错误';
  }
  
  console.error('Auth error:', error);
  
  // Get error message from mapping
  const message = getErrorMessage(error.code);
  
  // Sanitize error message
  return sanitizeErrorMessage(message);
}

/**
 * Get error message from error code
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
function getErrorMessage(errorCode) {
  if (!errorCode) {
    return '操作失败，请重试';
  }
  
  // Check if we have a mapping for this error code
  if (ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode];
  }
  
  // Return generic message for unknown errors
  return '操作失败，请重试';
}

/**
 * Sanitize error message to remove sensitive information
 * @param {string} message - Error message to sanitize
 * @returns {string} Sanitized error message
 */
function sanitizeErrorMessage(message) {
  if (!message || typeof message !== 'string') {
    return '操作失败，请重试';
  }
  
  // Remove any potential sensitive information
  let sanitized = message
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[邮箱]') // Remove emails
    .replace(/\b\d{10,}\b/g, '[数字]') // Remove long numbers
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/g, '[令牌]') // Remove tokens
    .replace(/password[:\s=]+[^\s]+/gi, 'password: [已隐藏]'); // Remove passwords
  
  // Limit message length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200) + '...';
  }
  
  return sanitized;
}

/**
 * Show error alert to user
 * @param {Error|string} error - Error object or message
 * @param {Function} displayCallback - Optional callback to display error (e.g., UI function)
 */
function showError(error, displayCallback = null) {
  let message;
  
  if (typeof error === 'string') {
    message = error;
  } else if (error && error.code) {
    message = handleAuthError(error);
  } else if (error && error.message) {
    message = sanitizeErrorMessage(error.message);
  } else {
    message = '操作失败，请重试';
  }
  
  // Use custom display callback if provided
  if (displayCallback && typeof displayCallback === 'function') {
    displayCallback(message, 'error');
  } else {
    // Fall back to alert
    alert(message);
  }
  
  return message;
}

/**
 * Log error for debugging (in development mode)
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 */
function logError(context, error) {
  // Only log in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.group(`Error in ${context}`);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    console.groupEnd();
  }
}

/**
 * Check if error is network-related
 * @param {Error} error - Error object
 * @returns {boolean} True if network error
 */
function isNetworkError(error) {
  if (!error || !error.code) {
    return false;
  }
  
  const networkErrors = [
    'auth/network-request-failed',
    'auth/timeout'
  ];
  
  return networkErrors.includes(error.code);
}

/**
 * Check if error is authentication-related
 * @param {Error} error - Error object
 * @returns {boolean} True if auth error
 */
function isAuthError(error) {
  if (!error || !error.code) {
    return false;
  }
  
  return error.code.startsWith('auth/');
}

/**
 * Get retry suggestion for error
 * @param {Error} error - Error object
 * @returns {string} Retry suggestion message
 */
function getRetrySuggestion(error) {
  if (isNetworkError(error)) {
    return '请检查网络连接后重试';
  }
  
  if (error && error.code === 'auth/too-many-requests') {
    return '请等待几分钟后再试';
  }
  
  return '请稍后重试';
}

// Export functions for use in other modules
window.ErrorHandler = {
  handleAuthError,
  getErrorMessage,
  sanitizeErrorMessage,
  showError,
  logError,
  isNetworkError,
  isAuthError,
  getRetrySuggestion,
  ERROR_MESSAGES // Export for testing
};
