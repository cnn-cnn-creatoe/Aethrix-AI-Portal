// GitHub Authentication Module
// 处理 GitHub OAuth 登录
// 参考: https://firebase.google.com/docs/auth/web/github-auth

/**
 * 使用 GitHub 登录
 * @returns {Promise<Object>} 登录结果
 */
async function loginWithGitHub() {
    try {
        console.log('=== 开始 GitHub 登录流程 ===');

        // 1. 获取 Firebase Auth 实例
        const auth = window.FirebaseConfig.getAuth();

        if (!auth) {
            console.error('Firebase Auth 未初始化');
            return {
                success: false,
                message: 'Firebase 未正确初始化'
            };
        }

        console.log('Firebase Auth 实例获取成功');
        console.log('当前 authDomain:', window.FirebaseConfig.config.authDomain);

        console.log('当前域名:', window.location.hostname);

        // 2. 创建 GitHub Provider 实例
        console.log('创建 GitHub Provider...');
        const provider = new firebase.auth.GithubAuthProvider();

        // 3. 添加 OAuth 范围（可选）
        // 参考: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
        provider.addScope('user:email');
        provider.addScope('read:user');
        console.log('已添加 OAuth 范围: user:email, read:user');

        // 4. 设置自定义参数，强制重新授权以避免 session state 问题
        provider.setCustomParameters({
            'allow_signup': 'true',
            'prompt': 'consent'  // 强制显示授权页面，避免 session state 丢失问题
        });

        console.log('回调 URL 应该是: https://' + window.FirebaseConfig.config.authDomain + '/__/auth/handler');

        // 始终使用弹窗方式登录
        console.log('调用 signInWithPopup...');
        console.log('注意: 如果弹窗被阻止，请允许弹窗后重试');
        const result = await auth.signInWithPopup(provider);

        console.log('=== signInWithPopup 成功 ===');
        console.log('用户信息:', result.user);

        // 6. 获取 GitHub access token（可用于调用 GitHub API）
        const credential = result.credential;
        const githubToken = credential ? credential.accessToken : null;
        console.log('GitHub Token 获取:', githubToken ? '成功' : '失败');

        const user = result.user;
        console.log('GitHub 登录成功!');
        console.log('- UID:', user.uid);
        console.log('- Email:', user.email);
        console.log('- DisplayName:', user.displayName);
        console.log('- PhotoURL:', user.photoURL);
        console.log('- Provider:', user.providerData[0]?.providerId);

        // 7. 持久化认证状态
        if (window.AuthStateManager && window.AuthStateManager.persistAuthState) {
            await window.AuthStateManager.persistAuthState(user);
            console.log('认证状态已持久化');
        }

        // 8. 同步到后端
        try {
            await syncGitHubUserToBackend(user, githubToken);
        } catch (err) {
            if (err.message === 'ACCOUNT_BANNED') {
                await auth.signOut();
                return {
                    success: false,
                    message: '该账号已被注销或封禁，无法登录'
                };
            }
        }

        return {
            success: true,
            user: user,
            githubToken: githubToken,
            message: '登录成功'
        };
    } catch (error) {
        console.error('=== GitHub 登录失败 ===');
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('完整错误:', error);

        // 如果有 credential，可能是账号冲突
        if (error.credential) {
            console.error('冲突的 credential:', error.credential);
        }
        if (error.email) {
            console.error('冲突的 email:', error.email);
        }

        let message = 'GitHub 登录失败';
        switch (error.code) {
            case 'auth/account-exists-with-different-credential':
                message = '该邮箱已使用其他方式注册，请使用原方式登录';
                break;
            case 'auth/popup-blocked':
                message = '弹窗被阻止，请允许弹窗后重试';
                break;
            case 'auth/popup-closed-by-user':
                message = '登录已取消';
                break;
            case 'auth/cancelled-popup-request':
                message = '登录请求已取消';
                break;
            case 'auth/operation-not-allowed':
                message = 'GitHub 登录未启用。请在 Firebase Console 中启用 GitHub 登录方式，并配置 Client ID 和 Client Secret';
                break;
            case 'auth/unauthorized-domain':
                message = '当前域名未授权。请在 Firebase Console > Authentication > Settings > Authorized domains 中添加 localhost';
                break;
            case 'auth/invalid-credential':
                message = 'GitHub OAuth 凭证无效。请检查 Firebase Console 中的 Client ID 和 Client Secret 是否正确';
                break;
            case 'auth/user-disabled':
                message = '该用户账号已被禁用';
                break;
            default:
                message = `GitHub 登录失败: ${error.message || error.code}`;
        }

        return {
            success: false,
            error: error,
            message: message
        };
    }
}

/**
 * 使用重定向方式进行 GitHub 登录（适用于移动端）
 * @returns {Promise<void>}
 */
async function loginWithGitHubRedirect() {
    try {
        const auth = window.FirebaseConfig.getAuth();
        const provider = new firebase.auth.GithubAuthProvider();

        provider.addScope('user:email');
        provider.addScope('read:user');

        await auth.signInWithRedirect(provider);
    } catch (error) {
        console.error('GitHub 重定向登录失败:', error);
        throw error;
    }
}

/**
 * 处理重定向登录结果
 * @returns {Promise<Object|null>} 登录结果或 null
 */
async function handleGitHubRedirectResult() {
    try {
        const auth = window.FirebaseConfig.getAuth();
        const result = await auth.getRedirectResult();

        if (result.user) {
            const credential = result.credential;
            const githubToken = credential?.accessToken;

            // 同步到后端
            try {
                await syncGitHubUserToBackend(result.user, githubToken);
            } catch (err) {
                if (err.message === 'ACCOUNT_BANNED') {
                    await auth.signOut();
                    return {
                        success: false,
                        message: '该账号已被注销或封禁，无法登录'
                    };
                }
            }

            return {
                success: true,
                user: result.user,
                githubToken: githubToken,
                message: '登录成功'
            };
        }

        return null;
    } catch (error) {
        console.error('处理重定向结果失败:', error);
        return {
            success: false,
            error: error,
            message: 'GitHub 登录失败'
        };
    }
}

/**
 * 同步 GitHub 用户信息到后端
 * @param {Object} user - Firebase user object
 * @param {string} githubToken - GitHub access token
 */
async function syncGitHubUserToBackend(user, githubToken) {
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
                provider: 'github.com',
                githubToken: githubToken
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('GitHub 用户同步成功:', data);
            return data;
        } else {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 403 && errorData.error === 'ACCOUNT_BANNED') {
                throw new Error('ACCOUNT_BANNED');
            }
            throw new Error('Sync failed');
        }
    } catch (error) {
        console.error('GitHub 用户同步失败:', error);
        throw error;
    }
}

/**
 * 链接 GitHub 账号到现有账户
 * @returns {Promise<Object>} 结果
 */
async function linkGitHubAccount() {
    try {
        const auth = window.FirebaseConfig.getAuth();
        const user = auth.currentUser;

        if (!user) {
            return {
                success: false,
                message: '请先登录'
            };
        }

        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('user:email');

        const result = await user.linkWithPopup(provider);

        return {
            success: true,
            user: result.user,
            message: 'GitHub 账号已链接'
        };
    } catch (error) {
        console.error('链接 GitHub 账号失败:', error);

        let message = '链接失败';
        if (error.code === 'auth/credential-already-in-use') {
            message = '该 GitHub 账号已被其他用户使用';
        }

        return {
            success: false,
            error: error,
            message: message
        };
    }
}

/**
 * 取消链接 GitHub 账号
 * @returns {Promise<Object>} 结果
 */
async function unlinkGitHubAccount() {
    try {
        const auth = window.FirebaseConfig.getAuth();
        const user = auth.currentUser;

        if (!user) {
            return {
                success: false,
                message: '请先登录'
            };
        }

        await user.unlink('github.com');

        return {
            success: true,
            message: 'GitHub 账号已取消链接'
        };
    } catch (error) {
        console.error('取消链接 GitHub 账号失败:', error);
        return {
            success: false,
            error: error,
            message: '取消链接失败'
        };
    }
}

// 导出到全局
window.GitHubAuth = {
    loginWithGitHub,
    loginWithGitHubRedirect,
    handleGitHubRedirectResult,
    linkGitHubAccount,
    unlinkGitHubAccount
};
