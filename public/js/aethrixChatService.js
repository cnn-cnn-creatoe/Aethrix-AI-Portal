/**
 * AethrixChatService - AI Assistant with Memory
 * Handles chat history persistence and AI communication
 */
class AethrixChatService {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.onMessage = options.onMessage || (() => {});
        this.onError = options.onError || (() => {});
        this.onLoading = options.onLoading || (() => {});
        this.onHistoryLoaded = options.onHistoryLoaded || (() => {});
        this.messages = [];
        this.isAuthenticated = false;
        this.sessionMessages = []; // For unauthenticated users (session only)
    }

    /**
     * Get user authentication info from cookies/localStorage
     */
    getUserAuth() {
        // Check Firebase auth state
        const firebaseAuth = localStorage.getItem('firebase_auth_state');
        if (firebaseAuth) {
            try {
                const authState = JSON.parse(firebaseAuth);
                const tokenAge = Date.now() - (authState.timestamp || 0);
                if (authState.uid && tokenAge < 60 * 60 * 1000) {
                    return { uid: authState.uid, email: authState.email };
                }
            } catch (e) {}
        }

        // Check GitHub OAuth auth state
        const githubAuth = localStorage.getItem('github_auth_state');
        if (githubAuth) {
            try {
                const authState = JSON.parse(githubAuth);
                const tokenAge = Date.now() - (authState.timestamp || 0);
                if (authState.uid && tokenAge < 60 * 60 * 1000) {
                    return { uid: authState.uid, email: authState.email };
                }
            } catch (e) {}
        }

        return null;
    }

    /**
     * Check if user is authenticated
     */
    checkAuth() {
        const auth = this.getUserAuth();
        this.isAuthenticated = !!auth;
        return this.isAuthenticated;
    }

    /**
     * Load chat history from server
     */
    async loadHistory() {
        this.checkAuth();
        
        if (!this.isAuthenticated) {
            // Return session messages for unauthenticated users
            this.onHistoryLoaded(this.sessionMessages);
            return this.sessionMessages;
        }

        this.onLoading(true);
        
        try {
            const response = await fetch(`${this.baseUrl}/api/chat/history`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                // Not authenticated on server side
                this.isAuthenticated = false;
                this.onHistoryLoaded(this.sessionMessages);
                return this.sessionMessages;
            }

            if (!response.ok) {
                throw new Error('Failed to load history');
            }

            const data = await response.json();
            this.messages = data.messages || [];
            this.onHistoryLoaded(this.messages);
            return this.messages;

        } catch (error) {
            console.error('[AethrixChatService] Load history error:', error);
            this.onError('加载对话历史失败，请刷新重试');
            return [];
        } finally {
            this.onLoading(false);
        }
    }

    /**
     * Send message and get AI reply
     */
    async sendMessage(content) {
        if (!content || typeof content !== 'string' || !content.trim()) {
            return null;
        }

        this.checkAuth();
        this.onLoading(true);

        // Create user message object
        const userMessage = {
            id: this.generateId(),
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        };

        // Add to local messages immediately for UI
        if (this.isAuthenticated) {
            this.messages.push(userMessage);
        } else {
            this.sessionMessages.push(userMessage);
        }
        this.onMessage(userMessage);

        try {
            const response = await fetch(`${this.baseUrl}/api/chat/message`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: content.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            
            // Create assistant message
            const assistantMessage = data.assistantMessage || {
                id: this.generateId(),
                role: 'assistant',
                content: data.reply || '抱歉，无法获取回复',
                timestamp: Date.now()
            };

            // Add to local messages
            if (this.isAuthenticated) {
                this.messages.push(assistantMessage);
            } else {
                this.sessionMessages.push(assistantMessage);
            }
            this.onMessage(assistantMessage);

            return assistantMessage;

        } catch (error) {
            console.error('[AethrixChatService] Send message error:', error);
            
            // Create error message
            const errorMessage = {
                id: this.generateId(),
                role: 'assistant',
                content: '抱歉，发送消息失败。请检查网络连接后重试。',
                timestamp: Date.now(),
                isError: true
            };

            if (this.isAuthenticated) {
                this.messages.push(errorMessage);
            } else {
                this.sessionMessages.push(errorMessage);
            }
            this.onMessage(errorMessage);
            this.onError('发送消息失败');

            return errorMessage;
        } finally {
            this.onLoading(false);
        }
    }

    /**
     * Clear chat history
     */
    async clearHistory() {
        this.checkAuth();

        if (!this.isAuthenticated) {
            // Just clear session messages
            this.sessionMessages = [];
            this.onHistoryLoaded([]);
            return true;
        }

        this.onLoading(true);

        try {
            const response = await fetch(`${this.baseUrl}/api/chat/history`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear history');
            }

            this.messages = [];
            this.onHistoryLoaded([]);
            return true;

        } catch (error) {
            console.error('[AethrixChatService] Clear history error:', error);
            this.onError('清除对话历史失败');
            return false;
        } finally {
            this.onLoading(false);
        }
    }

    /**
     * Handle user logout - clear displayed messages
     */
    onLogout() {
        this.messages = [];
        this.sessionMessages = [];
        this.isAuthenticated = false;
        this.onHistoryLoaded([]);
    }

    /**
     * Handle user login - reload history
     */
    async onLogin() {
        this.checkAuth();
        if (this.isAuthenticated) {
            await this.loadHistory();
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Get all messages
     */
    getMessages() {
        return this.isAuthenticated ? this.messages : this.sessionMessages;
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.AethrixChatService = AethrixChatService;
}
