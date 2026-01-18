// Email/Password Authentication Module
// 处理邮箱密码登录和注册

/**
 * 使用邮箱和密码注册新用户
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 注册结果
 */
async function registerWithEmail(email, password) {
    try {
        console.log('开始 Firebase 注册, email:', email);
        const auth = window.FirebaseConfig.getAuth();

        if (!auth) {
            console.error('Firebase Auth 未初始化');
            return {
                success: false,
                message: 'Firebase 未正确初始化'
            };
        }

        console.log('调用 createUserWithEmailAndPassword...');
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);

        console.log('注册成功:', userCredential.user.email);

        return {
            success: true,
            user: userCredential.user,
            message: '注册成功'
        };
    } catch (error) {
        console.error('注册失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);

        let message = '注册失败，请稍后重试';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = '该邮箱已被注册';
                break;
            case 'auth/invalid-email':
                message = '邮箱格式不正确';
                break;
            case 'auth/weak-password':
                message = '密码强度不够，请使用至少6位密码';
                break;
            case 'auth/operation-not-allowed':
                message = '邮箱/密码登录未启用，请在 Firebase Console 中启用';
                break;
            case 'auth/network-request-failed':
                message = '网络错误，请检查网络连接';
                break;
            default:
                message = '注册失败: ' + (error.message || error.code);
        }

        return {
            success: false,
            error: error,
            message: message
        };
    }
}

/**
 * 使用邮箱和密码登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Promise<Object>} 登录结果
 */
async function loginWithEmail(email, password) {
    try {
        const auth = window.FirebaseConfig.getAuth();
        console.log('开始 Firebase 登录, email:', email);

        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        console.log('Firebase 登录成功:', userCredential.user.email);

        // 同步到后端（这是关键验证步骤，必须等待）
        try {
            await syncUserToBackend(userCredential.user);
        } catch (err) {
            console.error('后端同步检测失败:', err);
            if (err.message === 'ACCOUNT_BANNED') {
                await auth.signOut();
                return {
                    success: false,
                    message: '该账号已被注销或封禁，无法登录'
                };
            }
            // 其他同步错误暂不阻止登录（视业务需求而定，目前保持宽容）
            console.warn('后端同步失败，但非封禁错误，允许登录');
        }

        return {
            success: true,
            user: userCredential.user,
            message: '登录成功'
        };
    } catch (error) {
        console.error('登录失败:', error);
        console.error('错误代码:', error.code);

        let message = '登录失败，请检查邮箱和密码';
        switch (error.code) {
            case 'auth/user-not-found':
                message = '用户不存在';
                break;
            case 'auth/wrong-password':
                message = '密码错误';
                break;
            case 'auth/invalid-email':
                message = '邮箱格式不正确';
                break;
            case 'auth/user-disabled':
                message = '该账号已被禁用';
                break;
            case 'auth/too-many-requests':
                message = '登录尝试次数过多，请稍后再试';
                break;
            case 'auth/invalid-credential':
                message = '邮箱或密码错误';
                break;
            case 'auth/invalid-login-credentials':
                message = '邮箱或密码错误';
                break;
            default:
                message = '登录失败: ' + (error.message || error.code || '未知错误');
        }

        return {
            success: false,
            error: error,
            message: message
        };
    }
}

/**
 * 发送密码重置邮件
 * @param {string} email - 用户邮箱
 * @returns {Promise<Object>} 结果
 */
async function sendPasswordReset(email) {
    try {
        const auth = window.FirebaseConfig.getAuth();
        await auth.sendPasswordResetEmail(email);

        return {
            success: true,
            message: '密码重置邮件已发送，请检查你的邮箱'
        };
    } catch (error) {
        console.error('发送重置邮件失败:', error);

        let message = '发送失败，请稍后重试';
        switch (error.code) {
            case 'auth/user-not-found':
                message = '该邮箱未注册';
                break;
            case 'auth/invalid-email':
                message = '邮箱格式不正确';
                break;
        }

        return {
            success: false,
            error: error,
            message: message
        };
    }
}

/**
 * 登出
 * @returns {Promise<Object>} 结果
 */
async function logout() {
    try {
        const auth = window.FirebaseConfig.getAuth();
        await auth.signOut();

        // 清除 localStorage 中的认证状态（防止页面闪烁）
        if (window.AuthStateManager && window.AuthStateManager.clearAuthState) {
            window.AuthStateManager.clearAuthState();
        } else {
            // 直接清除 localStorage
            localStorage.removeItem('firebase_auth_state');
        }

        // 清除后端 session
        await fetch('/api/user/logout', { method: 'POST' });

        return {
            success: true,
            message: '已登出'
        };
    } catch (error) {
        console.error('登出失败:', error);

        // 即使出错也要清除本地状态
        if (window.AuthStateManager && window.AuthStateManager.clearAuthState) {
            window.AuthStateManager.clearAuthState();
        } else {
            localStorage.removeItem('firebase_auth_state');
        }

        return {
            success: false,
            error: error,
            message: '登出失败'
        };
    }
}

/**
 * 同步用户信息到后端
 * @param {Object} user - Firebase user object
 */
async function syncUserToBackend(user) {
    try {
        const idToken = await user.getIdToken();

        const response = await fetch('/api/auth/firebase-sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                provider: user.providerData[0]?.providerId || 'password'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('用户同步成功:', data);
            return data;
        } else {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 403 && errorData.error === 'ACCOUNT_BANNED') {
                throw new Error('ACCOUNT_BANNED');
            }
            throw new Error(`Sync failed: ${response.status} ${errorData.message || ''}`);
        }
    } catch (error) {
        console.error('用户同步失败:', error);
        throw error; // Re-throw so caller can handle it
    }
}

// 导出到全局
window.EmailAuth = {
    registerWithEmail,
    loginWithEmail,
    sendPasswordReset,
    logout,
    syncUserToBackend
};
