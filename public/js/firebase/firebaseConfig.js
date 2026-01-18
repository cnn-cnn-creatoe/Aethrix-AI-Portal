// Firebase Configuration Module
// Firebase 项目配置

const firebaseConfig = {
    apiKey: "AIzaSyBa-6ZxaBVdL2rRMn8KGVmTQfayXJruk1E",
    // 使用 Firebase 默认域名（与 GitHub OAuth 回调 URL 匹配）
    authDomain: "test-de088.firebaseapp.com",
    projectId: "test-de088",
    storageBucket: "test-de088.firebasestorage.app",
    messagingSenderId: "645370344680",
    appId: "1:645370344680:web:e199394d2c4983e5ab855d",
    measurementId: "G-02Y3CZMC59"
};

// 注意：GitHub OAuth 需要 Firebase Hosting 部署才能正常工作
// 如果遇到 "missing initial state" 错误，请运行：
// firebase login
// firebase init hosting (选择 public 目录)
// firebase deploy --only hosting

// Firebase 初始化状态
let firebaseInitialized = false;
let firebaseApp = null;
let firebaseAuth = null;

/**
 * 初始化 Firebase
 * @returns {Object} Firebase app instance
 */
function initializeFirebase() {
    if (firebaseInitialized) {
        return firebaseApp;
    }
    
    try {
        // 检查配置是否已设置
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn('Firebase 配置未设置，请在 firebaseConfig.js 中填入你的配置');
            return null;
        }
        
        // 初始化 Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        firebaseInitialized = true;
        
        console.log('Firebase 初始化成功');
        return firebaseApp;
    } catch (error) {
        console.error('Firebase 初始化失败:', error);
        return null;
    }
}

/**
 * 获取 Firebase Auth 实例
 * @returns {Object} Firebase Auth instance
 */
function getAuth() {
    if (!firebaseInitialized) {
        initializeFirebase();
    }
    return firebaseAuth || firebase.auth();
}

/**
 * 获取 Firebase App 实例
 * @returns {Object} Firebase App instance
 */
function getApp() {
    if (!firebaseInitialized) {
        initializeFirebase();
    }
    return firebaseApp;
}

/**
 * 检查 Firebase 是否已初始化
 * @returns {boolean}
 */
function isInitialized() {
    return firebaseInitialized;
}

/**
 * 获取当前配置状态
 * @returns {boolean} true if configured, false if using placeholder
 */
function isConfigured() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

// 导出到全局
window.FirebaseConfig = {
    initializeFirebase,
    getAuth,
    getApp,
    isInitialized,
    isConfigured,
    config: firebaseConfig
};
