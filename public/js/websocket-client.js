/**
 * WebSocket 客户端模块
 * 用于接收服务器推送的实时事件（如强制登出）
 */
(function () {
    'use strict';

    let ws = null;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 5;
    const RECONNECT_DELAY = 3000; // 3秒

    /**
     * 初始化 WebSocket 连接
     * @param {string} userEmail - 当前登录用户的邮箱
     */
    function initWebSocket(userEmail) {
        if (!userEmail) {
            console.log('[WebSocketClient] 未提供用户邮箱，跳过连接');
            return;
        }

        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            console.log('[WebSocketClient] 已有活跃连接，跳过');
            return;
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}`;

        try {
            ws = new WebSocket(wsUrl);

            ws.onopen = function () {
                console.log('[WebSocketClient] 连接成功');
                reconnectAttempts = 0;

                // 发送身份验证
                ws.send(JSON.stringify({
                    type: 'AUTH',
                    email: userEmail
                }));
            };

            ws.onmessage = function (event) {
                try {
                    const data = JSON.parse(event.data);
                    handleServerMessage(data);
                } catch (e) {
                    console.error('[WebSocketClient] 解析消息失败:', e);
                }
            };

            ws.onclose = function (event) {
                console.log('[WebSocketClient] 连接关闭');

                // 尝试重连
                if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                    reconnectAttempts++;
                    console.log(`[WebSocketClient] ${RECONNECT_DELAY}ms 后尝试重连 (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
                    setTimeout(() => initWebSocket(userEmail), RECONNECT_DELAY);
                }
            };

            ws.onerror = function (error) {
                console.error('[WebSocketClient] 连接错误');
            };
        } catch (error) {
            console.error('[WebSocketClient] 创建连接失败:', error);
        }
    }

    /**
     * 处理服务器推送的消息
     */
    function handleServerMessage(data) {
        switch (data.type) {
            case 'FORCE_LOGOUT':
                handleForceLogout(data.reason);
                break;
            default:
                console.log('[WebSocketClient] 收到未知消息类型:', data.type);
        }
    }

    /**
     * 处理强制登出
     */
    function handleForceLogout(reason) {
        console.log('[WebSocketClient] 收到强制登出通知:', reason);

        // 显示提示
        alert(reason || '您的账号已被管理员删除，即将退出登录');

        // 清除所有本地存储
        localStorage.removeItem('firebase_auth_state');
        localStorage.removeItem('github_auth_state');

        // 清除 cookies
        document.cookie = 'user_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Firebase 登出 (如果可用)
        if (window.FirebaseConfig && window.FirebaseConfig.getAuth) {
            try {
                const auth = window.FirebaseConfig.getAuth();
                if (auth && auth.currentUser) {
                    auth.signOut().catch(e => console.log('Firebase signout error:', e));
                }
            } catch (e) {
                // 忽略
            }
        }

        // 跳转到首页
        window.location.href = '/';
    }

    /**
     * 关闭 WebSocket 连接
     */
    function closeWebSocket() {
        if (ws) {
            ws.close();
            ws = null;
        }
    }

    // 导出到全局
    window.WebSocketClient = {
        init: initWebSocket,
        close: closeWebSocket
    };

    // 页面卸载时关闭连接
    window.addEventListener('beforeunload', closeWebSocket);

    /**
     * 验证后端 Session 是否有效
     * 如果前端有登录状态但后端没有，则强制登出
     */
    async function validateSession() {
        let hasLocalAuth = false;
        let userEmail = null;

        // 检查是否有本地认证状态
        try {
            const firebaseState = localStorage.getItem('firebase_auth_state');
            if (firebaseState) {
                const parsed = JSON.parse(firebaseState);
                if (parsed.email && parsed.uid) {
                    hasLocalAuth = true;
                    userEmail = parsed.email;
                }
            }
        } catch (e) { }

        try {
            const githubState = localStorage.getItem('github_auth_state');
            if (githubState) {
                const parsed = JSON.parse(githubState);
                if (parsed.email && parsed.uid) {
                    hasLocalAuth = true;
                    userEmail = parsed.email;
                }
            }
        } catch (e) { }

        // 如果没有本地认证状态，不需要验证
        if (!hasLocalAuth) {
            console.log('[SessionValidator] 无本地认证状态，跳过验证');
            return;
        }

        console.log('[SessionValidator] 检测到本地认证状态，验证后端 Session...');

        try {
            const response = await fetch('/api/user/status', { credentials: 'include' });
            const data = await response.json();

            if (!data.isUser) {
                console.warn('[SessionValidator] 后端 Session 无效，强制登出');
                // 清除所有本地存储
                localStorage.removeItem('firebase_auth_state');
                localStorage.removeItem('github_auth_state');
                localStorage.removeItem('isAdmin');

                // 清除 cookies
                document.cookie = 'user_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                // Firebase 登出
                if (window.FirebaseConfig && window.FirebaseConfig.getAuth) {
                    try {
                        const auth = window.FirebaseConfig.getAuth();
                        if (auth && auth.currentUser) {
                            await auth.signOut();
                        }
                    } catch (e) { }
                }

                // 刷新页面以反映登出状态
                console.log('[SessionValidator] 刷新页面以反映登出状态');
                window.location.reload();
            } else {
                console.log('[SessionValidator] 后端 Session 有效');
                // 初始化 WebSocket
                if (userEmail) {
                    initWebSocket(userEmail);
                }
            }
        } catch (error) {
            console.error('[SessionValidator] 验证失败:', error);
            // 网络错误时不强制登出，允许离线使用
        }
    }

    // 自动初始化：先验证 Session，再连接 WebSocket
    document.addEventListener('DOMContentLoaded', function () {
        // 延迟执行，等待其他认证模块加载完成
        setTimeout(validateSession, 1500);
    });
})();
