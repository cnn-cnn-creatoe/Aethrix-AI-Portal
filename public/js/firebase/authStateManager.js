// Authentication State Management Module
// 处理认证状态监听和持久化

const AUTH_STATE_KEY = 'firebase_auth_state';
const REMEMBER_ME_KEY = 'firebase_remember_me';

/**
 * 设置认证状态监听器
 * @param {Function} callback - 状态变化回调函数
 * @returns {Function} 取消监听函数
 */
function setupAuthStateListener(callback) {
    const auth = window.FirebaseConfig.getAuth();
    
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        console.log('认证状态变化:', user ? user.email : '未登录');
        
        if (user) {
            // 用户已登录
            const token = await user.getIdToken();
            
            // 持久化状态
            await persistAuthState(user);
            
            callback({
                isAuthenticated: true,
                user: user,
                token: token
            });
        } else {
            // 用户已登出
            clearAuthState();
            
            callback({
                isAuthenticated: false,
                user: null,
                token: null
            });
        }
    });
    
    return unsubscribe;
}

/**
 * 持久化认证状态
 * @param {Object} user - Firebase user object
 */
async function persistAuthState(user) {
    try {
        const token = await user.getIdToken();
        
        const authState = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            provider: user.providerData[0]?.providerId || 'password',
            token: token,
            timestamp: Date.now()
        };
        
        // 始终保存到 localStorage 以支持快速认证检查
        // 同时根据记住我选项决定是否也保存到 sessionStorage
        localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
        
        console.log('认证状态已保存到 localStorage');
    } catch (error) {
        console.error('保存认证状态失败:', error);
    }
}

/**
 * 清除认证状态
 */
function clearAuthState() {
    try {
        localStorage.removeItem(AUTH_STATE_KEY);
        sessionStorage.removeItem(AUTH_STATE_KEY);
        console.log('认证状态已清除');
    } catch (error) {
        console.error('清除认证状态失败:', error);
    }
}

/**
 * 获取存储的认证状态
 * @returns {Object|null}
 */
function getStoredAuthState() {
    try {
        const authStateStr = localStorage.getItem(AUTH_STATE_KEY);
        
        if (!authStateStr) return null;
        
        const authState = JSON.parse(authStateStr);
        
        // 检查 token 是否过期（1小时）
        const tokenAge = Date.now() - (authState.timestamp || 0);
        if (tokenAge > 60 * 60 * 1000) {
            console.log('存储的 token 已过期');
            clearAuthState();
            return null;
        }
        
        return authState;
    } catch (error) {
        console.error('获取存储的认证状态失败:', error);
        return null;
    }
}

/**
 * 检查是否已认证
 * @returns {boolean}
 */
function isAuthenticated() {
    const auth = window.FirebaseConfig.getAuth();
    return auth.currentUser !== null;
}

/**
 * 获取当前用户
 * @returns {Object|null}
 */
function getCurrentUser() {
    const auth = window.FirebaseConfig.getAuth();
    return auth.currentUser;
}

/**
 * 获取当前用户的 ID Token
 * @param {boolean} forceRefresh - 是否强制刷新
 * @returns {Promise<string|null>}
 */
async function getCurrentUserToken(forceRefresh = false) {
    try {
        const user = getCurrentUser();
        if (!user) return null;
        
        const token = await user.getIdToken(forceRefresh);
        return token;
    } catch (error) {
        console.error('获取用户 token 失败:', error);
        return null;
    }
}

/**
 * 获取记住我偏好
 * @returns {boolean}
 */
function getRememberMePreference() {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
}

/**
 * 设置记住我偏好
 * @param {boolean} remember
 */
function setRememberMePreference(remember) {
    if (remember) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
    }
}

/**
 * 等待认证状态就绪
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Object|null>}
 */
function waitForAuthReady(timeout = 5000) {
    return new Promise((resolve) => {
        const auth = window.FirebaseConfig.getAuth();
        
        // 如果已有用户，直接返回
        if (auth.currentUser) {
            resolve(auth.currentUser);
            return;
        }
        
        // 设置超时
        const timeoutId = setTimeout(() => {
            unsubscribe();
            resolve(null);
        }, timeout);
        
        // 监听状态变化
        const unsubscribe = auth.onAuthStateChanged((user) => {
            clearTimeout(timeoutId);
            unsubscribe();
            resolve(user);
        });
    });
}

/**
 * 获取用户登录方式
 * @returns {string|null}
 */
function getLoginProvider() {
    const user = getCurrentUser();
    if (!user) return null;
    
    if (user.providerData.length > 0) {
        return user.providerData[0].providerId;
    }
    return 'password';
}

// 导出到全局
window.AuthStateManager = {
    setupAuthStateListener,
    persistAuthState,
    clearAuthState,
    getStoredAuthState,
    isAuthenticated,
    getCurrentUser,
    getCurrentUserToken,
    getRememberMePreference,
    setRememberMePreference,
    waitForAuthReady,
    getLoginProvider
};
