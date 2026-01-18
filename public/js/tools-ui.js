/**
 * tools-ui.js
 * Handles UI interactions for tools.html including Theme Toggle, Auth UI, and User Profile.
 */

document.addEventListener('DOMContentLoaded', () => {
    initProfilePopup();

    // Initial UI update based on auth
    checkAndSetupAuthUI();
});

// =======================
// Theme Toggle Logic
// =======================
// Handled by public/js/theme-manager.js

// =======================
// Auth UI & Profile Logic
// =======================
async function checkAndSetupAuthUI() {
    const authLink = document.getElementById('auth-link');
    const userAvatar = document.getElementById('user-avatar');
    const avatarText = document.getElementById('avatar-text');
    const adminBtn = document.getElementById('tools-admin-btn');

    // Helper to update UI
    const updateUI = (user) => {
        if (user) {
            // Logged In
            if (authLink) authLink.style.display = 'none';
            if (userAvatar) {
                userAvatar.style.display = 'flex';
                // Set avatar text
                if (avatarText) {
                    const name = user.nickname || user.displayName || (user.email ? user.email.charAt(0) : 'U');
                    avatarText.textContent = name.charAt(0).toUpperCase();
                }
            }

            // Check Admin
            if (user.isAdmin || (window.RoleManager && window.RoleManager.checkAdminStatus && window.RoleManager.checkAdminStatus(user.email))) {
                if (adminBtn) adminBtn.style.display = 'flex';
            }
        } else {
            // Logged Out
            if (authLink) authLink.style.display = 'flex'; // or inline-flex
            if (userAvatar) userAvatar.style.display = 'none';
            if (adminBtn) adminBtn.style.display = 'none';
        }
    };

    // 1. Try window.currentUser (set by inline script)
    if (window.currentUser) {
        updateUI(window.currentUser);
    }

    // 2. Listen for AuthStateManager changes (safer for async updates)
    if (window.AuthStateManager && window.AuthStateManager.setupAuthStateListener) {
        window.AuthStateManager.setupAuthStateListener((state) => {
            if (state.isAuthenticated && state.user) {
                // Merge with window.currentUser if exists to keep nickname
                const finalUser = { ...state.user, ...(window.currentUser || {}) };
                updateUI(state.user); // Use state.user primarily, but we might need nickname from storage

                // If we have proper profile loading logic, use it.
                // For now, basic display is better than nothing.
                if (window.currentUser && window.currentUser.nickname) {
                    if (avatarText) avatarText.textContent = window.currentUser.nickname.charAt(0).toUpperCase();
                }
            } else {
                updateUI(null);
            }
        });
    }

    // 3. Fallback: Check AuthStateManager directly if not already handled
    if (!window.currentUser && window.AuthStateManager) {
        const user = await window.AuthStateManager.waitForAuthReady(2000);
        updateUI(user);
    }
}

// =======================
// User Profile Popup Logic
// =======================
let userProfile = {};

function initProfilePopup() {
    // Setup global functions for HTML onclick attributes
    window.toggleProfilePopup = toggleProfilePopup;
    window.closeProfilePopup = closeProfilePopup;
    window.enterEditMode = enterEditMode;
    window.cancelEditMode = cancelEditMode;
    window.saveProfileChanges = saveProfileChanges;
    window.handleLogout = handleLogout;

    // Close on outside click
    document.addEventListener('click', function (e) {
        const popup = document.getElementById('profile-popup');
        const avatar = document.getElementById('user-avatar');
        if (popup && popup.style.display === 'block' &&
            !popup.contains(e.target) && !avatar.contains(e.target)) {
            popup.style.display = 'none';
        }
    });

    // Initialize profile data if user exists
    if (window.currentUser) {
        userProfile = window.currentUser;
        updateProfilePopupContent();
    }
}

function toggleProfilePopup() {
    const popup = document.getElementById('profile-popup');
    if (!popup) return;

    if (popup.style.display === 'none') {
        // Refresh data before showing
        if (window.currentUser) {
            userProfile = window.currentUser;
            updateProfilePopupContent();
        }
        popup.style.display = 'block';
    } else {
        popup.style.display = 'none';
    }
}

function closeProfilePopup() {
    const popup = document.getElementById('profile-popup');
    if (popup) popup.style.display = 'none';
}

function updateProfilePopupContent() {
    const nicknameEl = document.getElementById('profile-nickname');
    const emailEl = document.getElementById('profile-email');

    if (nicknameEl) nicknameEl.textContent = userProfile.nickname || userProfile.displayName || 'User';
    if (emailEl) emailEl.textContent = userProfile.email || '-';
}

function enterEditMode() {
    document.getElementById('profile-view-mode').style.display = 'none';
    document.getElementById('profile-edit-mode').style.display = 'block';
    document.getElementById('profile-view-buttons').style.display = 'none';
    document.getElementById('profile-edit-buttons').style.display = 'block';

    // Pre-fill
    document.getElementById('edit-nickname').value = userProfile.nickname || userProfile.displayName || '';
    const errorEl = document.getElementById('edit-error');
    if (errorEl) errorEl.textContent = '';
}

function cancelEditMode() {
    document.getElementById('profile-view-mode').style.display = 'block';
    document.getElementById('profile-edit-mode').style.display = 'none';
    document.getElementById('profile-view-buttons').style.display = 'block';
    document.getElementById('profile-edit-buttons').style.display = 'none';
    const errorEl = document.getElementById('edit-error');
    if (errorEl) errorEl.textContent = '';
}

async function saveProfileChanges() {
    const nicknameInput = document.getElementById('edit-nickname');
    const nickname = nicknameInput.value.trim();
    const errorEl = document.getElementById('edit-error');

    if (!nickname || nickname.length < 2 || nickname.length > 20) {
        if (errorEl) errorEl.textContent = '昵称长度需要在2-20个字符之间';
        return;
    }

    try {
        const response = await fetch('/api/user/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Important for cookies
            body: JSON.stringify({ nickname })
        });

        const result = await response.json();

        if (result.success) {
            // Update local state
            userProfile.nickname = nickname;
            if (window.currentUser) window.currentUser.nickname = nickname;

            updateProfilePopupContent();

            // Update Avatar Text
            const avatarText = document.getElementById('avatar-text');
            if (avatarText) avatarText.textContent = nickname.charAt(0).toUpperCase();

            cancelEditMode();

            // Show Success Message (Simple alert or custom div if exists)
            // const msgEl = document.getElementById('profile-message');
            // if (msgEl) { ... } 
            alert('修改成功');
        } else {
            if (errorEl) errorEl.textContent = result.message || '更新失败';
        }
    } catch (error) {
        console.error('Update profile error:', error);
        if (errorEl) errorEl.textContent = '更新失败，请稍后重试';
    }
}

async function handleLogout() {
    try {
        if (window.AuthStateManager && window.AuthStateManager.clearAuthState) {
            window.AuthStateManager.clearAuthState();
        }

        const auth = window.FirebaseConfig.getAuth();
        if (auth && auth.currentUser) {
            await auth.signOut();
        }

        // Backend logout
        await fetch('/api/user/logout', { method: 'POST' });

        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        window.location.reload();
    }
}
