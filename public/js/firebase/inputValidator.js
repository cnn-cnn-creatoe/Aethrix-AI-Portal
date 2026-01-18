// Input Validation Module
// Handles validation of email, password, and other user inputs

/**
 * Validate email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors array
 */
function validatePassword(password) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    return { isValid: false, errors: ['密码不能为空'] };
  }
  
  // Check minimum length (8 characters)
  if (password.length < 8) {
    errors.push('密码长度至少为 8 个字符');
  }
  
  // Check maximum length (to prevent DoS)
  if (password.length > 128) {
    errors.push('密码长度不能超过 128 个字符');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Calculate password strength score
 * @param {string} password - Password to evaluate
 * @returns {Object} Strength result with score (0-4) and label
 */
function calculatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { score: 0, label: '无效' };
  }
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score++; // lowercase
  if (/[A-Z]/.test(password)) score++; // uppercase
  if (/[0-9]/.test(password)) score++; // numbers
  if (/[^a-zA-Z0-9]/.test(password)) score++; // special characters
  
  // Normalize score to 0-4 range
  const normalizedScore = Math.min(Math.floor(score / 1.5), 4);
  
  // Map score to label
  const labels = ['很弱', '弱', '一般', '强', '很强'];
  
  return {
    score: normalizedScore,
    label: labels[normalizedScore]
  };
}

/**
 * Validate that two passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Second password to compare
 * @returns {boolean} True if passwords match, false otherwise
 */
function validatePasswordMatch(password, confirmPassword) {
  return password === confirmPassword && password.length > 0;
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .substring(0, 500); // Limit length
}

// Export functions for use in other modules
window.InputValidator = {
  validateEmail,
  validatePassword,
  calculatePasswordStrength,
  validatePasswordMatch,
  sanitizeInput
};
