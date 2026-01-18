// GitHub OAuth Direct - 不通过 Firebase，直接使用 GitHub OAuth
// 这种方式更简单，回调 URL 直接指向你的服务器

/**
 * GitHub OAuth 配置
 * 需要在 GitHub Developer Settings 创建 OAuth App:
 * https://github.com/settings/developers
 * 
 * 回调 URL 设置为: https://aijuhe.cdproveai.com/api/auth/github/callback
 * 或本地: http://localhost:3006/api/auth/github/callback
 */
const GITHUB_CONFIG = {
    clientId: 'Ov23li3I0536JOe1jMpT',  // 你的 GitHub OAuth App Client ID
    // 根据当前域名自动选择回调 URL
    get redirectUri() {
        const host = window.location.host;
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            return `http://${host}/api/auth/github/callback`;
        }
        return `https://${host}/api/auth/github/callback`;
    },
    scope: 'user:email read:user'
};

/**
 * 生成随机 state 用于防止 CSRF 攻击
 * state 格式: randomString_base64EncodedReturnUrl
 */
function generateState(returnUrl) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const randomPart = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    // 将返回 URL 编码到 state 中
    const encodedReturnUrl = btoa(encodeURIComponent(returnUrl));
    return `${randomPart}_${encodedReturnUrl}`;
}

/**
 * 从 state 中解析返回 URL
 */
function parseReturnUrlFromState(state) {
    try {
        const parts = state.split('_');
        if (parts.length >= 2) {
            const encodedReturnUrl = parts.slice(1).join('_');
            return decodeURIComponent(atob(encodedReturnUrl));
        }
    } catch (e) {
        console.log('解析 state 中的返回 URL 失败:', e);
    }
    return '/tools.html';
}

/**
 * 开始 GitHub OAuth 登录流程
 * 使用弹窗模式，授权完成后自动关闭弹窗并在原页面显示选择界面
 */
function startGitHubLogin() {
    // 获取返回 URL
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/tools.html';
    const state = generateState(returnUrl);
    
    // 保存 state 到 sessionStorage，用于回调时验证
    sessionStorage.setItem('github_oauth_state', state);
    sessionStorage.setItem('github_oauth_return_url', returnUrl);
    
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', GITHUB_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', GITHUB_CONFIG.redirectUri);
    authUrl.searchParams.set('scope', GITHUB_CONFIG.scope);
    authUrl.searchParams.set('state', state);
    // 强制重新选择账号（清除 GitHub 的 session）
    authUrl.searchParams.set('prompt', 'select_account');
    
    console.log('GitHub OAuth 登录开始（弹窗模式）');
    console.log('Client ID:', GITHUB_CONFIG.clientId);
    console.log('Redirect URI:', GITHUB_CONFIG.redirectUri);
    console.log('Return URL:', returnUrl);
    console.log('授权 URL:', authUrl.toString());
    
    // 清除之前的 OAuth 结果（避免读取旧数据）
    localStorage.removeItem('github_oauth_result');
    
    // 启动 localStorage 轮询（如果 auth.html 有这个函数）
    if (typeof window.startGitHubOAuthPolling === 'function') {
        window.startGitHubOAuthPolling();
        console.log('已启动 localStorage 轮询');
    }
    
    // 计算弹窗位置（居中显示）
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // 打开弹窗
    const popup = window.open(
        authUrl.toString(),
        'github_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
    
    if (!popup) {
        alert('弹窗被浏览器阻止，请允许弹窗后重试');
        return;
    }
    
    // 监听弹窗关闭
    const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
            clearInterval(checkPopupClosed);
            console.log('GitHub OAuth 弹窗已关闭');
            
            // 🔥 弹窗关闭后，给一点时间让 window.opener 调用完成
            // 如果 window.opener 调用成功，不需要检查 localStorage
            // 如果失败，localStorage 作为备用
            setTimeout(() => {
                const oauthResult = localStorage.getItem('github_oauth_result');
                if (oauthResult) {
                    console.log('🔄 [弹窗关闭] 检测到 localStorage 中有 OAuth 结果（备用机制）');
                    
                    // 启动轮询处理 localStorage 结果
                    if (typeof window.startGitHubOAuthPolling === 'function') {
                        console.log('🔄 [弹窗关闭] 启动轮询处理结果');
                        window.startGitHubOAuthPolling();
                    } else {
                        console.error('🔄 [弹窗关闭] startGitHubOAuthPolling 函数不存在');
                    }
                } else {
                    console.log('🔄 [弹窗关闭] 没有 localStorage 结果，window.opener 调用应该已完成');
                }
            }, 200); // 减少延迟到 200ms，因为 window.opener 调用是同步的
        }
    }, 500);
    
    // 监听来自弹窗的消息（作为备用机制）
    window.addEventListener('message', function handleOAuthMessage(event) {
        // 安全检查：确保消息来自同源
        if (event.origin !== window.location.origin) {
            return;
        }
        
        if (event.data && event.data.type === 'github_oauth_success') {
            console.log('收到 GitHub 登录成功消息（postMessage）:', event.data);
            
            // 清理
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', handleOAuthMessage);
            
            // 停止 localStorage 轮询（因为已经通过 postMessage 收到结果）
            if (typeof window.stopGitHubOAuthPolling === 'function') {
                window.stopGitHubOAuthPolling();
            }
            
            // 关闭弹窗
            if (popup && !popup.closed) {
                popup.close();
            }
            
            // 保存认证状态
            if (event.data.userData) {
                localStorage.setItem('github_auth_state', JSON.stringify(event.data.userData));
            }
            
            // 检查是否是管理员
            if (event.data.isAdmin) {
                console.log('检测到管理员，显示选择界面');
                // 设置标志防止其他地方自动跳转
                window.isShowingAdminChoice = true;
                // 显示管理员选择模态框（在原页面）
                if (typeof showAdminChoiceModal === 'function') {
                    showAdminChoiceModal();
                } else if (typeof window.showGitHubAdminChoiceModal === 'function') {
                    window.showGitHubAdminChoiceModal();
                } else {
                    // 如果没有 showAdminChoiceModal 函数，手动创建模态框
                    console.error('找不到 showAdminChoiceModal 函数');
                    // 作为后备，跳转到 auth.html 并显示选择界面
                    window.location.href = '/auth.html?showAdminChoice=true';
                }
            } else {
                // 普通用户，显示成功消息后跳转
                console.log('普通用户，跳转到:', returnUrl);
                showLoginSuccessModal();
                setTimeout(() => {
                    window.location.href = returnUrl;
                }, 1500);
            }
        } else if (event.data && event.data.type === 'github_oauth_error') {
            console.error('GitHub 登录失败（postMessage）:', event.data.error);
            
            // 清理
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', handleOAuthMessage);
            
            // 停止 localStorage 轮询
            if (typeof window.stopGitHubOAuthPolling === 'function') {
                window.stopGitHubOAuthPolling();
            }
            
            // 关闭弹窗
            if (popup && !popup.closed) {
                popup.close();
            }
            
            // 显示错误模态框
            showLoginErrorModal(event.data.message || '未知错误');
        }
    });
}

/**
 * 处理 GitHub OAuth 回调
 * 在回调页面调用此函数
 */
async function handleGitHubCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    // 检查错误
    if (error) {
        console.error('GitHub OAuth 错误:', error, errorDescription);
        return {
            success: false,
            error: error,
            message: errorDescription || 'GitHub 授权失败'
        };
    }
    
    // 验证 state
    const savedState = sessionStorage.getItem('github_oauth_state');
    if (!state || state !== savedState) {
        console.error('State 验证失败');
        return {
            success: false,
            error: 'invalid_state',
            message: '安全验证失败，请重试'
        };
    }
    
    // 清除 state
    sessionStorage.removeItem('github_oauth_state');
    
    if (!code) {
        return {
            success: false,
            error: 'no_code',
            message: '未收到授权码'
        };
    }
    
    try {
        // 将 code 发送到后端换取 access token 和用户信息
        const response = await fetch('/api/auth/github/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'GitHub 登录失败');
        }
        
        console.log('GitHub 登录成功:', data);
        
        // 保存认证状态到 localStorage
        if (data.user) {
            localStorage.setItem('github_auth_state', JSON.stringify({
                uid: data.user.id,
                email: data.user.email,
                displayName: data.user.nickname || data.user.login,
                photoURL: data.user.avatar_url,
                provider: 'github',
                timestamp: Date.now()
            }));
        }
        
        return {
            success: true,
            user: data.user,
            message: '登录成功'
        };
    } catch (error) {
        console.error('GitHub 登录失败:', error);
        return {
            success: false,
            error: error.message,
            message: error.message || 'GitHub 登录失败'
        };
    }
}

/**
 * 获取保存的返回 URL
 */
function getReturnUrl() {
    return sessionStorage.getItem('github_oauth_return_url') || '/tools.html';
}

/**
 * 清除返回 URL
 */
function clearReturnUrl() {
    sessionStorage.removeItem('github_oauth_return_url');
}

/**
 * 显示登录成功模态框（极简黑白风格）
 */
function showLoginSuccessModal() {
    // 创建模态框容器
    const modal = document.createElement('div');
    modal.id = 'github-login-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #fff;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        min-width: 300px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
    `;
    
    // 成功图标（对勾）
    const icon = document.createElement('div');
    icon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 20px;">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    // 成功文本
    const text = document.createElement('h2');
    text.textContent = '登录成功';
    text.style.cssText = `
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 600;
        color: #000;
    `;
    
    // 提示文本
    const subtext = document.createElement('p');
    subtext.textContent = '正在跳转...';
    subtext.style.cssText = `
        margin: 0;
        font-size: 14px;
        color: #666;
    `;
    
    // 组装模态框
    modalContent.appendChild(icon);
    modalContent.appendChild(text);
    modalContent.appendChild(subtext);
    modal.appendChild(modalContent);
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // 添加到页面
    document.body.appendChild(modal);
}

/**
 * 显示登录失败模态框（极简黑白风格）
 */
function showLoginErrorModal(message) {
    // 创建模态框容器
    const modal = document.createElement('div');
    modal.id = 'github-login-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: #fff;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
    `;
    
    // 错误图标（X）
    const icon = document.createElement('div');
    icon.innerHTML = `
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 20px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
    `;
    
    // 错误文本
    const text = document.createElement('h2');
    text.textContent = '登录失败';
    text.style.cssText = `
        margin: 0 0 12px;
        font-size: 20px;
        font-weight: 600;
        color: #000;
    `;
    
    // 错误详情
    const subtext = document.createElement('p');
    subtext.textContent = message;
    subtext.style.cssText = `
        margin: 0 0 24px;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
    `;
    
    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = `
        padding: 10px 24px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: #000;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#333';
    closeBtn.onmouseout = () => closeBtn.style.background = '#000';
    closeBtn.onclick = () => {
        document.body.removeChild(modal);
    };
    
    // 组装模态框
    modalContent.appendChild(icon);
    modalContent.appendChild(text);
    modalContent.appendChild(subtext);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    
    // 添加动画样式（如果还没有）
    if (!document.getElementById('github-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'github-modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(20px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(modal);
}

// 导出到全局
window.GitHubOAuthDirect = {
    startGitHubLogin,
    handleGitHubCallback,
    getReturnUrl,
    clearReturnUrl,
    config: GITHUB_CONFIG
};
