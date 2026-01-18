// UI Controller Module
// Handles UI updates, loading states, alerts, and user interactions

/**
 * Show or hide loading state
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} elementId - Optional specific element ID to show loading on
 */
function showLoadingState(isLoading, elementId = null) {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      if (isLoading) {
        element.disabled = true;
        element.classList.add('loading');
        
        // Store original text
        if (!element.dataset.originalText) {
          element.dataset.originalText = element.textContent;
        }
        element.textContent = '加载中...';
      } else {
        element.disabled = false;
        element.classList.remove('loading');
        
        // Restore original text
        if (element.dataset.originalText) {
          element.textContent = element.dataset.originalText;
        }
      }
    }
  } else {
    // Global loading state
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    }
  }
}

/**
 * Show alert message to user
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success', 'error', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds (0 = no auto-hide)
 */
function showAlert(message, type = 'info', duration = 5000) {
  // Try to find alert container
  let alertContainer = document.getElementById('alert-container');
  
  // Create alert container if it doesn't exist
  if (!alertContainer) {
    alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    alertContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    `;
    document.body.appendChild(alertContainer);
  }
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.style.cssText = `
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border-left: 4px solid;
  `;
  
  // Set color based on type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b'
  };
  alert.style.borderLeftColor = colors[type] || colors.info;
  
  // Create message element
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  messageEl.style.cssText = 'flex: 1; color: #1f2937;';
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    margin-left: 10px;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.onclick = () => {
    alert.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => alert.remove(), 300);
  };
  
  alert.appendChild(messageEl);
  alert.appendChild(closeBtn);
  alertContainer.appendChild(alert);
  
  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => {
      if (alert.parentNode) {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
      }
    }, duration);
  }
  
  // Add animations if not already added
  if (!document.getElementById('alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Switch between login and register tabs
 * @param {string} tabName - Tab name ('login' or 'register')
 */
function switchTab(tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected tab content
  const selectedContent = document.getElementById(`${tabName}-tab`);
  if (selectedContent) {
    selectedContent.style.display = 'block';
  }
  
  // Add active class to selected tab
  const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
}

/**
 * Toggle password visibility
 * @param {string} inputId - Password input element ID
 */
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const toggleBtn = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    if (toggleBtn) {
      toggleBtn.textContent = '🙈';
      toggleBtn.setAttribute('aria-label', '隐藏密码');
    }
  } else {
    input.type = 'password';
    if (toggleBtn) {
      toggleBtn.textContent = '👁️';
      toggleBtn.setAttribute('aria-label', '显示密码');
    }
  }
}

/**
 * Update password strength indicator
 * @param {number} strength - Strength score (0-4)
 * @param {string} label - Strength label
 * @param {string} indicatorId - Indicator element ID
 */
function updatePasswordStrengthIndicator(strength, label, indicatorId = 'password-strength') {
  const indicator = document.getElementById(indicatorId);
  if (!indicator) return;
  
  // Update indicator bar
  const bar = indicator.querySelector('.strength-bar');
  const text = indicator.querySelector('.strength-text');
  
  if (bar) {
    // Set width based on strength
    const width = (strength / 4) * 100;
    bar.style.width = `${width}%`;
    
    // Set color based on strength
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'];
    bar.style.backgroundColor = colors[strength] || colors[0];
  }
  
  if (text) {
    text.textContent = label;
  }
  
  // Show indicator
  indicator.style.display = 'block';
}

/**
 * Clear form inputs
 * @param {string} formId - Form element ID
 */
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    
    // Clear any error messages
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    
    // Hide password strength indicator
    const strengthIndicator = form.querySelector('.password-strength');
    if (strengthIndicator) {
      strengthIndicator.style.display = 'none';
    }
  }
}

/**
 * Show field error message
 * @param {string} fieldId - Input field ID
 * @param {string} message - Error message
 */
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Add error class to field
  field.classList.add('error');
  
  // Find or create error message element
  let errorEl = field.parentElement.querySelector('.error-message');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.style.cssText = 'color: #ef4444; font-size: 12px; margin-top: 4px;';
    field.parentElement.appendChild(errorEl);
  }
  
  errorEl.textContent = message;
}

/**
 * Clear field error message
 * @param {string} fieldId - Input field ID
 */
function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  // Remove error class
  field.classList.remove('error');
  
  // Clear error message
  const errorEl = field.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = '';
  }
}

/**
 * Disable form submission
 * @param {string} formId - Form element ID
 * @param {boolean} disabled - Whether to disable
 */
function disableForm(formId, disabled = true) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, button, select, textarea');
  inputs.forEach(input => {
    input.disabled = disabled;
  });
}

/**
 * Show modal dialog
 * @param {string} title - Modal title
 * @param {string} content - Modal content (HTML)
 * @param {Array} buttons - Array of button objects {text, onClick, type}
 */
function showModal(title, content, buttons = []) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  `;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  `;
  
  // Create modal content
  modal.innerHTML = `
    <h3 style="margin: 0 0 16px 0; font-size: 20px; color: #1f2937;">${title}</h3>
    <div style="margin-bottom: 24px; color: #4b5563;">${content}</div>
    <div class="modal-buttons" style="display: flex; gap: 12px; justify-content: flex-end;"></div>
  `;
  
  // Add buttons
  const buttonContainer = modal.querySelector('.modal-buttons');
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.text;
    button.className = btn.type || 'secondary';
    button.style.cssText = `
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
    `;
    
    if (btn.type === 'primary') {
      button.style.background = '#3b82f6';
      button.style.color = 'white';
    } else {
      button.style.background = '#e5e7eb';
      button.style.color = '#1f2937';
    }
    
    button.onclick = () => {
      overlay.remove();
      if (btn.onClick) btn.onClick();
    };
    
    buttonContainer.appendChild(button);
  });
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  };
}

// Export functions for use in other modules
window.UIController = {
  showLoadingState,
  showAlert,
  switchTab,
  togglePasswordVisibility,
  updatePasswordStrengthIndicator,
  clearForm,
  showFieldError,
  clearFieldError,
  disableForm,
  showModal
};
