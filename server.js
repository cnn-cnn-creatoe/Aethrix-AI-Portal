require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const WebSocket = require('ws');

// --- 环境变量验证 ---
function validateEnv() {
    const warnings = [];

    // 检查管理员密码是否为默认值
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';
    if (adminPassword === '123456' || adminPassword === 'change_me_to_secure_password') {
        warnings.push('警告: ADMIN_PASSWORD 使用默认值，请在生产环境中修改');
    }

    // 检查密码强度
    if (adminPassword.length < 8) {
        warnings.push('警告: ADMIN_PASSWORD 长度应至少为8位');
    }

    // 输出警告
    if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
        console.warn('\n========== 环境变量警告 ==========');
        warnings.forEach(w => console.warn(w));
        console.warn('==================================\n');
    }

    return { valid: true, warnings };
}

// 执行环境变量验证
validateEnv();

const app = express();
const port = process.env.PORT || 3006;

app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for simplicity in this static site context or configure properly
}));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '200kb' }));

// --- 动态渲染 HTML 页面（必须在 express.static 之前）---
// 辅助函数：读取设置
function getSettings() {
    try {
        const settingsPath = path.join(__dirname, 'data', 'settings.json');
        return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch (e) {
        return { siteName: 'Aethrix | 以太夜', browserTitle: 'Aethrix | 以太夜' };
    }
}

// 首页
app.get('/', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${browserTitle}</title>`);
    res.send(html);
});

// tools.html
app.get('/tools.html', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'tools.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>AI 工具平台 - ${browserTitle}</title>`);
    res.send(html);
});

// solopreneur.html
app.get('/solopreneur.html', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'solopreneur.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>一人公司 - ${browserTitle}</title>`);
    res.send(html);
});

// auth.html
app.get('/auth.html', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'auth.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>登录 / 注册 - ${browserTitle}</title>`);
    res.send(html);
});

// tutorials.html
app.get('/tutorials.html', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'tutorials.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>教程 - ${browserTitle}</title>`);
    res.send(html);
});

// apis.html
app.get('/apis.html', (req, res) => {
    const settings = getSettings();
    const browserTitle = settings.browserTitle || settings.siteName || 'Aethrix | 以太夜';
    let html = fs.readFileSync(path.join(__dirname, 'public', 'apis.html'), 'utf8');
    html = html.replace(/<title>.*?<\/title>/, `<title>API - ${browserTitle}</title>`);
    res.send(html);
});

// 静态文件（放在动态路由之后）
app.use(express.static(path.join(__dirname, 'public')));

// --- Data Directory ---
const dataDir = path.join(__dirname, 'data');
const sessionsPath = path.join(dataDir, 'sessions.json');
console.log('Data directory:', dataDir);
console.log('Sessions path:', sessionsPath);

// --- Session Persistence Functions ---
function loadSessions() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(sessionsPath)) {
        return { adminSessions: [], userSessions: {} };
    }
    try {
        const data = JSON.parse(fs.readFileSync(sessionsPath, 'utf8'));
        // Clean expired sessions (older than 24 hours)
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (Array.isArray(data.adminSessions)) {
            data.adminSessions = data.adminSessions.filter(s =>
                s.createdAt && (now - s.createdAt) < maxAge
            );
        } else {
            data.adminSessions = [];
        }

        if (data.userSessions && typeof data.userSessions === 'object') {
            for (const token of Object.keys(data.userSessions)) {
                const session = data.userSessions[token];
                if (!session.loginTime || (now - session.loginTime) >= maxAge) {
                    delete data.userSessions[token];
                }
            }
        } else {
            data.userSessions = {};
        }

        return data;
    } catch (e) {
        console.error('Error loading sessions:', e);
        return { adminSessions: [], userSessions: {} };
    }
}

function saveSessions() {
    console.log('saveSessions() called');
    console.log('sessions Set size:', sessions.size);
    console.log('userSessions Map size:', userSessions.size);
    try {
        fs.mkdirSync(dataDir, { recursive: true });
        const adminSessionsArray = [];
        sessions.forEach((adminInfo, token) => {
            adminSessionsArray.push({ token, createdAt: Date.now(), adminInfo });
        });
        const userSessionsObj = {};
        userSessions.forEach((value, key) => {
            userSessionsObj[key] = value;
        });
        const data = {
            adminSessions: adminSessionsArray,
            userSessions: userSessionsObj
        };
        console.log('Writing to:', sessionsPath);
        console.log('Data:', JSON.stringify(data, null, 2));
        fs.writeFileSync(sessionsPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Sessions saved: ${sessions.size} admin, ${userSessions.size} user`);
    } catch (e) {
        console.error('Error saving sessions:', e);
    }
}

// --- Auth Store (with persistence) ---
const sessions = new Map(); // Map<token, {userId, email}> - 存储管理员身份信息
const userSessions = new Map(); // Map<token, {nickname, loginTime}>

// Load persisted sessions on startup
const persistedSessions = loadSessions();
persistedSessions.adminSessions.forEach(s => {
    // 兼容旧数据：如果没有 adminInfo，创建一个空对象
    sessions.set(s.token, s.adminInfo || {});
});
Object.entries(persistedSessions.userSessions).forEach(([token, data]) => {
    userSessions.set(token, data);
});
console.log(`Loaded ${sessions.size} admin sessions and ${userSessions.size} user sessions from disk`);

// --- Auth Middleware ---
function checkAuth(req, res, next) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/admin_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token && sessions.has(token)) {
        req.isAdmin = true;
        // 🔒 存储当前管理员信息，用于后续接口的自我修改保护
        req.adminUser = sessions.get(token);
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

function checkUserAuth(req, res, next) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token && userSessions.has(token)) {
        req.user = userSessions.get(token);
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

const thoughtsPath = path.join(dataDir, 'anonymous_thoughts.json');
const contentPath = path.join(dataDir, 'content.json');
const metricsPath = path.join(dataDir, 'metrics.json');
const settingsPath = path.join(dataDir, 'settings.json');
const usersPath = path.join(dataDir, 'users.json');
const toolsPath = path.join(dataDir, 'tools.json');
const appsPath = path.join(dataDir, 'apps.json');
const productsPath = path.join(dataDir, 'products.json');
const uploadsDir = path.join(__dirname, 'uploads', 'products');

// --- Default Categories for AI Tools ---
const DEFAULT_CATEGORIES = [
    { id: 'llm', name: '大语言模型', order: 1 },
    { id: 'workflow', name: '工作流平台', order: 2 },
    { id: 'txt2img', name: '文生图', order: 3 },
    { id: 'txt2vid', name: '文生视频', order: 4 },
    { id: 'img2x', name: '图生图/视频', order: 5 },
    { id: 'onestop', name: '一站式AI', order: 6 },
    { id: 'design', name: '设计(UI/Logo)', order: 7 },
    { id: 'marketing', name: '市场营销/电商', order: 8 },
    { id: 'coding', name: '编程/运维', order: 9 },
    { id: 'crawler', name: '爬虫/OSINT', order: 10 },
    { id: 'data', name: '数据分析', order: 11 },
    { id: 'voice', name: '声音克隆/TTS', order: 12 },
    { id: '3d', name: 'Ai 3D建模', order: 13 },
    { id: 'frontend', name: '前端资源站', order: 14 },
    { id: 'academic', name: '学术论文', order: 15 }
];

// --- Default Tools Data Structure ---
const DEFAULT_TOOLS_DATA = {
    categories: DEFAULT_CATEGORIES,
    tools: []
};

// --- Tools Read/Write Functions ---
function readTools() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(toolsPath)) {
        writeTools(DEFAULT_TOOLS_DATA);
        return DEFAULT_TOOLS_DATA;
    }
    try {
        const data = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
        // Ensure data structure is valid
        if (!data || typeof data !== 'object') return DEFAULT_TOOLS_DATA;
        if (!Array.isArray(data.categories)) data.categories = DEFAULT_CATEGORIES;
        if (!Array.isArray(data.tools)) data.tools = [];
        return data;
    } catch (e) {
        console.error('Error reading tools.json:', e);
        return DEFAULT_TOOLS_DATA;
    }
}

function writeTools(data) {
    fs.mkdirSync(dataDir, { recursive: true });
    // Atomic write using temp file
    const tmpPath = `${toolsPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, toolsPath);
}

// --- Helpers for JSON files ---
function readJson(filePath, defaultVal) {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf8');
        return defaultVal;
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const sanitized = raw.replace(/^\uFEFF/, ''); // strip BOM if present
        return JSON.parse(sanitized);
    } catch (e) {
        console.error(`Error parsing JSON from ${filePath}:`, e.message);
        return defaultVal;
    }
}

function writeJson(filePath, data) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function ensureThoughtsFile() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(thoughtsPath)) return;
    fs.writeFileSync(thoughtsPath, JSON.stringify({ posts: [] }, null, 2), 'utf8');
}

function readThoughts() {
    ensureThoughtsFile();
    const raw = fs.readFileSync(thoughtsPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { posts: [] };
    if (!Array.isArray(parsed.posts)) return { posts: [] };
    return parsed;
}

function writeThoughts(next) {
    ensureThoughtsFile();
    const tmpPath = `${thoughtsPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(next, null, 2), 'utf8');
    fs.renameSync(tmpPath, thoughtsPath);
}

function normalizeDate(dateStr) {
    if (typeof dateStr !== 'string') return null;
    const trimmed = dateStr.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
    return trimmed;
}

function normalizeCategory(value) {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (raw === 'emotion' || raw === 'advice') return raw;
    return null;
}

function sortPostsDesc(posts) {
    return [...posts].sort((a, b) => {
        const da = String(a.date || '');
        const db = String(b.date || '');
        if (da !== db) return db.localeCompare(da);
        return (b.createdAt || 0) - (a.createdAt || 0);
    });
}

app.get('/api/anonymous-thoughts', (req, res) => {
    const data = readThoughts();
    const posts = sortPostsDesc(data.posts).map(p => ({
        ...p,
        category: p.category === 'advice' ? 'advice' : 'emotion',
        comments: Array.isArray(p.comments) ? p.comments : []
    }));
    res.json({ posts });
});

app.post('/api/anonymous-thoughts', (req, res) => {
    const date = normalizeDate(req.body?.date);
    const category = normalizeCategory(req.body?.category) || 'emotion';
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (!date) return res.status(400).json({ error: 'invalid_date' });
    if (!content) return res.status(400).json({ error: 'empty_content' });
    if (content.length > 20000) return res.status(400).json({ error: 'content_too_long' });

    const data = readThoughts();
    const post = {
        id: randomUUID(),
        date,
        category,
        content,
        createdAt: Date.now(),
        comments: []
    };
    data.posts.push(post);
    writeThoughts(data);
    res.json({ post });
});

app.post('/api/anonymous-thoughts/:id/comments', (req, res) => {
    const postId = String(req.params.id || '').trim();
    const content = typeof req.body?.content === 'string' ? req.body.content.trim() : '';
    if (!postId) return res.status(400).json({ error: 'invalid_post_id' });
    if (!content) return res.status(400).json({ error: 'empty_content' });
    if (content.length > 5000) return res.status(400).json({ error: 'content_too_long' });

    const data = readThoughts();
    const idx = data.posts.findIndex(p => p.id === postId);
    if (idx === -1) return res.status(404).json({ error: 'not_found' });

    // Check if this is an advice post - only admin can comment
    if (data.posts[idx]?.category === 'advice') {
        // Check admin auth
        const cookie = req.headers.cookie || '';
        const match = cookie.match(/admin_token=([^;]+)/);
        const token = match ? match[1] : null;

        if (!token || !sessions.has(token)) {
            return res.status(403).json({ error: 'only_admin_can_reply' });
        }
    }

    const nextComment = { id: randomUUID(), content, createdAt: Date.now() };
    const post = data.posts[idx];
    const existingComments = Array.isArray(post.comments) ? post.comments : [];
    post.comments = [nextComment, ...existingComments];
    data.posts[idx] = post;
    writeThoughts(data);
    res.json({ comment: nextComment });
});

// --- Admin Auth Routes ---
app.get('/api/admin/status', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/admin_token=([^;]+)/);
    const token = match ? match[1] : null;
    res.json({ isAdmin: token && sessions.has(token) });
});

// --- Skill API Proxy (避免跨域问题) ---
app.get('/api/skill-proxy/skills', async (req, res) => {
    try {
        const http = require('http');
        const queryString = new URLSearchParams(req.query).toString();
        const url = `http://localhost:4005/api/skills${queryString ? '?' + queryString : ''}`;

        http.get(url, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    res.json(JSON.parse(data));
                } catch (e) {
                    res.status(500).json({ error: 'Invalid JSON from skill service' });
                }
            });
        }).on('error', (err) => {
            console.error('Skill proxy error:', err);
            res.status(500).json({ error: 'Failed to connect to skill service' });
        });
    } catch (error) {
        console.error('Skill proxy error:', error);
        res.status(500).json({ error: 'Skill proxy failed' });
    }
});

// --- 邮箱验证码功能 ---
// 验证码存储 (Map<email, { code, expiresAt, verified }>)
const verificationCodes = new Map();
// 验证码功能启动时间 (用于判断老用户)
const VERIFICATION_FEATURE_LAUNCH_TIME = Date.now();

// 邮件发送配置
// 邮件发送配置
let emailTransporter = null;
try {
    // 尝试创建邮件发送器
    const smtpConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        },
        // 关键修复：允许自签名证书，解决部分连接问题
        tls: {
            rejectUnauthorized: false
        }
    };

    console.log('正在配置邮件服务...');
    console.log(`SMTP Host: ${smtpConfig.host}`);
    console.log(`SMTP Port: ${smtpConfig.port}`);
    console.log(`SMTP Secure: ${smtpConfig.secure}`);
    // console.log(`SMTP User: ${smtpConfig.auth.user}`); // 隐藏敏感信息

    if (smtpConfig.auth.user && smtpConfig.auth.pass) {
        emailTransporter = nodemailer.createTransport(smtpConfig);

        // 验证连接配置
        emailTransporter.verify(function (error, success) {
            if (error) {
                console.error('❌ 邮件服务连接测试失败:', error);
            } else {
                console.log('✅ 邮件服务连接测试成功，服务器已准备好发送邮件');
            }
        });
    } else {
        console.log('邮件服务未配置 (SMTP_USER 和 SMTP_PASS 未设置)');
    }
} catch (e) {
    console.error('邮件服务配置初始化失败:', e);
}

// 生成6位随机验证码
function generateVerificationCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

// 发送验证码 API
app.post('/api/auth/send-verification-code', async (req, res) => {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: '请输入有效的邮箱地址' });
    }

    // 检查是否频繁发送 (60秒内)
    const existing = verificationCodes.get(email);
    if (existing && existing.sentAt && (Date.now() - existing.sentAt) < 60000) {
        const waitTime = Math.ceil((60000 - (Date.now() - existing.sentAt)) / 1000);
        return res.status(429).json({ success: false, message: `请等待 ${waitTime} 秒后再试` });
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5分钟过期

    // 存储验证码
    verificationCodes.set(email, {
        code: code,
        expiresAt: expiresAt,
        sentAt: Date.now(),
        verified: false
    });

    // 发送邮件
    if (emailTransporter) {
        try {
            await emailTransporter.sendMail({
                from: process.env.EMAIL_FROM || process.env.SMTP_USER,
                to: email,
                subject: '【Aethrix 以太夜】邮箱验证码',
                html: `
                    <div style="font-family: 'Microsoft YaHei', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">邮箱验证码</h2>
                        <p style="color: #666; font-size: 16px;">您好！</p>
                        <p style="color: #666; font-size: 16px;">您正在注册 Aethrix | 以太夜 账号，验证码为：</p>
                        <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000;">${code}</span>
                        </div>
                        <p style="color: #999; font-size: 14px;">验证码有效期为 5 分钟，请尽快使用。</p>
                        <p style="color: #999; font-size: 14px;">如果这不是您的操作，请忽略此邮件。</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #ccc; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
                    </div>
                `
            });
            console.log(`验证码已发送至 ${email}: ${code}`);
            res.json({ success: true, message: '验证码已发送' });
        } catch (error) {
            console.error('发送验证码邮件失败:', error);
            // 即使邮件发送失败，也返回成功（开发模式下可以查看控制台）
            console.log(`[开发模式] 验证码: ${code}`);
            res.json({ success: true, message: '验证码已发送（请检查控制台）' });
        }
    } else {
        // 邮件服务未配置，仅在控制台显示验证码（开发模式）
        console.log(`\n========================================`);
        console.log(`📧 邮箱验证码 (开发模式)`);
        console.log(`   邮箱: ${email}`);
        console.log(`   验证码: ${code}`);
        console.log(`   有效期: 5分钟`);
        console.log(`========================================\n`);
        res.json({ success: true, message: '验证码已发送（开发模式：请查看服务器控制台）' });
    }
});

// 验证验证码 API
app.post('/api/auth/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const stored = verificationCodes.get(email);

    if (!stored) {
        return res.json({ success: false, verified: false, message: '请先获取验证码' });
    }

    if (Date.now() > stored.expiresAt) {
        verificationCodes.delete(email);
        return res.json({ success: false, verified: false, message: '验证码已过期，请重新获取' });
    }

    if (stored.code !== code) {
        return res.json({ success: false, verified: false, message: '验证码错误' });
    }

    // 验证成功
    stored.verified = true;
    verificationCodes.set(email, stored);

    console.log(`邮箱 ${email} 验证成功`);
    res.json({ success: true, verified: true, message: '验证成功' });
});

// 检查邮箱是否已验证 API
app.post('/api/auth/check-verification', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, verified: false });
    }

    const stored = verificationCodes.get(email);

    if (stored && stored.verified && Date.now() <= stored.expiresAt) {
        res.json({ success: true, verified: true });
    } else {
        res.json({ success: true, verified: false });
    }
});

// --- 封禁用户存储 ---
const blockedUsersPath = path.join(dataDir, 'blocked_users.json');

// --- 超级管理员配置 ---
// 这些账号拥有最高权限，不能被删除或降权
const SUPER_ADMIN_EMAILS = ['nan323660@gmail.com'];

// --- Firebase Auth Sync API ---
// 同步 Firebase 认证用户到后端
app.post('/api/auth/firebase-sync', async (req, res) => {
    const { uid, email, displayName, photoURL, provider, githubToken } = req.body;

    if (!uid || !email) {
        return res.status(400).json({ error: '缺少必要参数' });
    }

    try {
        // 🔒 安全检查：确认用户是否被封禁/注销
        // 新版数据结构: [{uid, email, bannedAt}] 或旧版兼容: ["uid" 或 "email"]
        const blockedUsers = readJson(blockedUsersPath, []);
        const isBanned = blockedUsers.some(item => {
            if (typeof item === 'object') {
                // 新版结构：检查 uid 或 email 匹配
                return item.uid === uid || item.email === email;
            } else {
                // 旧版兼容：字符串匹配
                return item === uid || item === email;
            }
        });

        if (isBanned) {
            console.warn(`封禁用户尝试登录: ${email} (${uid})`);
            return res.status(403).json({
                error: 'ACCOUNT_BANNED', // 特定错误码供前端识别
                message: '该账号已被注销或封禁，无法登录'
            });
        }

        // 读取用户列表
        const users = readJson(usersPath, []);

        // 查找或创建用户
        let user = users.find(u => u.firebaseUid === uid || u.email === email);

        if (!user) {
            // 创建新用户
            user = {
                id: randomUUID(),
                firebaseUid: uid,
                email: email,
                nickname: displayName || email.split('@')[0],
                photoURL: photoURL,
                provider: provider,
                createdAt: Date.now(),
                lastLogin: Date.now(),
                loginCount: 1,
                isAdmin: false
            };
            users.push(user);
        } else {
            // 更新现有用户
            user.firebaseUid = uid;
            user.lastLogin = Date.now();
            user.loginCount = (user.loginCount || 0) + 1;
            if (displayName) user.nickname = displayName;
            if (photoURL) user.photoURL = photoURL;
            if (provider) user.provider = provider;
        }

        // 🔒 确保超级管理员永远拥有 Admin 权限
        if (SUPER_ADMIN_EMAILS.includes(email)) {
            user.isAdmin = true;
        }

        // ✅ 修复：只从 users.json 读取 isAdmin 状态，不使用硬编码邮箱
        // 管理员权限完全由 users.json 中的 isAdmin 字段控制
        const isAdmin = user.isAdmin === true;

        // 不再强制覆盖，保持 users.json 中的设置
        // user.isAdmin = isAdmin;  // 删除这行，避免覆盖

        writeJson(usersPath, users);

        // 创建后端 session
        const token = randomUUID();
        userSessions.set(token, {
            nickname: user.nickname,
            email: user.email,
            firebaseUid: uid,
            loginTime: Date.now(),
            isAdmin: isAdmin
        });

        // 如果是管理员，也创建管理员 session
        if (isAdmin) {
            const adminToken = randomUUID();
            sessions.set(adminToken, { userId: user.id, email: user.email });
            saveSessions();

            res.setHeader('Set-Cookie', [
                `user_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`,
                `admin_token=${adminToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
            ]);
        } else {
            saveSessions();
            res.setHeader('Set-Cookie', `user_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
        }

        res.json({
            success: true,
            user: {
                nickname: user.nickname,
                email: user.email,
                isAdmin: isAdmin
            }
        });
    } catch (error) {
        console.error('Firebase sync error:', error);
        res.status(500).json({ error: '同步失败' });
    }
});

// --- User Logout API ---
app.post('/api/user/logout', (req, res) => {
    const cookie = req.headers.cookie || '';
    const userMatch = cookie.match(/user_token=([^;]+)/);
    const adminMatch = cookie.match(/admin_token=([^;]+)/);

    // Remove user session
    if (userMatch && userMatch[1]) {
        userSessions.delete(userMatch[1]);
    }

    // Remove admin session
    if (adminMatch && adminMatch[1]) {
        sessions.delete(adminMatch[1]);
    }

    saveSessions();

    // Clear cookies
    res.setHeader('Set-Cookie', [
        'user_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;',
        'admin_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    ]);

    res.json({ success: true });
});

// --- User Status API ---
app.get('/api/user/status', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token && userSessions.has(token)) {
        const userInfo = userSessions.get(token);
        res.json({ isUser: true, nickname: userInfo.nickname, isAdmin: userInfo.isAdmin || false });
    } else {
        res.json({ isUser: false });
    }
});

// --- User Profile API (获取当前登录用户的完整信息) ---
app.get('/api/user/profile', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token || !userSessions.has(token)) {
        return res.status(401).json({ error: '未登录' });
    }

    const userInfo = userSessions.get(token);
    const users = readJson(usersPath, []);
    const user = users.find(u => u.email === userInfo.email);

    if (!user) {
        return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
        isAdmin: user.isAdmin || false
    });
});

// --- User Profile Update API ---
app.post('/api/user/update-profile', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);

    if (!match || !match[1]) {
        return res.status(401).json({ success: false, message: '请先登录' });
    }

    const session = userSessions.get(match[1]);
    if (!session) {
        return res.status(401).json({ success: false, message: '会话已过期，请重新登录' });
    }

    const { nickname, password } = req.body;

    // Validate nickname
    if (!nickname || nickname.length < 2 || nickname.length > 20) {
        return res.status(400).json({ success: false, message: '昵称长度需要在2-20个字符之间' });
    }

    const users = readJson(usersPath, []);
    const userIndex = users.findIndex(u => u.email === session.email);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const user = users[userIndex];

    // Check if nickname is taken by another user
    const nicknameExists = users.find(u => u.nickname === nickname && u.email !== session.email);
    if (nicknameExists) {
        return res.status(400).json({ success: false, message: '该昵称已被使用' });
    }

    // Update nickname
    user.nickname = nickname;
    session.nickname = nickname;

    // Update password if provided
    if (password) {
        // Check password change eligibility (6 months = 180 days)
        const lastPasswordChange = user.lastPasswordChange || 0;
        const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (lastPasswordChange && (now - lastPasswordChange) < sixMonthsMs) {
            const nextChangeDate = new Date(lastPasswordChange + sixMonthsMs);
            return res.status(400).json({
                success: false,
                message: `密码半年内只能修改一次，下次可修改时间：${nextChangeDate.toLocaleDateString('zh-CN')}`
            });
        }

        // Validate password
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: '密码长度至少6位' });
        }

        user.password = password; // In production, hash this!
        user.lastPasswordChange = now;
    }

    user.updatedAt = Date.now();
    users[userIndex] = user;
    writeJson(usersPath, users);

    res.json({ success: true, message: '信息更新成功' });
});

// --- Password Change Status API ---
app.get('/api/user/password-change-status', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);

    if (!match || !match[1]) {
        return res.status(401).json({ canChange: false, message: '请先登录' });
    }

    const session = userSessions.get(match[1]);
    if (!session) {
        return res.status(401).json({ canChange: false, message: '会话已过期' });
    }

    const users = readJson(usersPath, []);
    const user = users.find(u => u.email === session.email);

    if (!user) {
        return res.json({ canChange: true }); // New user can change
    }

    const lastPasswordChange = user.lastPasswordChange || 0;
    const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    if (!lastPasswordChange || (now - lastPasswordChange) >= sixMonthsMs) {
        return res.json({ canChange: true });
    }

    const nextChangeDate = new Date(lastPasswordChange + sixMonthsMs);
    return res.json({
        canChange: false,
        nextChangeDate: nextChangeDate.toISOString(),
        message: `密码半年内只能修改一次`
    });
});

app.get('/api/admin/users', checkAuth, (req, res) => {
    const users = readJson(usersPath, []);
    // Don't send passwords
    const safeUsers = users.map(u => ({
        id: u.id,
        nickname: u.nickname,
        email: u.email,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
        loginCount: u.loginCount || 0,
        isAdmin: u.isAdmin || false
    }));
    res.json({ users: safeUsers, total: safeUsers.length });
});

// --- User Role Toggle API (Admin) ---
app.put('/api/admin/users/:id/role', checkAuth, (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.body;

    const users = readJson(usersPath, []);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: '用户不存在' });
    }

    const targetUser = users[userIndex];

    // 🔒 禁止管理员修改自己的权限（防止自锁）
    if (req.adminUser && req.adminUser.userId === id) {
        return res.status(403).json({ error: '不能修改自己的权限' });
    }

    // 🔒 保护超级管理员：禁止修改超级管理员的权限
    if (SUPER_ADMIN_EMAILS.includes(targetUser.email)) {
        return res.status(403).json({ error: '无法修改超级管理员的权限' });
    }

    // Prevent removing admin from the last admin
    const adminCount = users.filter(u => u.isAdmin).length;
    if (users[userIndex].isAdmin && !isAdmin && adminCount <= 1) {
        return res.status(400).json({ error: '无法移除最后一个管理员的权限' });
    }

    users[userIndex].isAdmin = isAdmin;
    writeJson(usersPath, users);

    res.json({ success: true, message: isAdmin ? '已设为管理员' : '已设为普通用户' });
});

// --- Delete User API (Admin) ---
app.delete('/api/admin/users/:id', checkAuth, (req, res) => {
    const { id } = req.params;

    const users = readJson(usersPath, []);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: '用户不存在' });
    }

    const targetUser = users[userIndex];

    // 🔒 禁止管理员删除自己
    if (req.adminUser && req.adminUser.userId === id) {
        return res.status(403).json({ error: '不能删除自己的账号' });
    }

    // 🔒 保护超级管理员：禁止删除超级管理员
    if (SUPER_ADMIN_EMAILS.includes(targetUser.email)) {
        return res.status(403).json({ error: '无法删除超级管理员' });
    }

    // Prevent deleting the last admin
    const adminCount = users.filter(u => u.isAdmin).length;
    if (users[userIndex].isAdmin && adminCount <= 1) {
        return res.status(400).json({ error: '无法删除最后一个管理员' });
    }

    // 🔒 将用户添加到注销名单（UID 和邮箱绑定），防止重新登录
    if (targetUser.firebaseUid || targetUser.email) {
        const blockedUsers = readJson(blockedUsersPath, []);

        // 检查是否已存在（兼容新旧格式）
        const alreadyBlocked = blockedUsers.some(item => {
            if (typeof item === 'object') {
                return item.uid === targetUser.firebaseUid || item.email === targetUser.email;
            } else {
                return item === targetUser.firebaseUid || item === targetUser.email;
            }
        });

        if (!alreadyBlocked) {
            // 使用新格式：绑定 UID 和邮箱
            blockedUsers.push({
                uid: targetUser.firebaseUid || null,
                email: targetUser.email || null,
                nickname: targetUser.nickname || null,
                bannedAt: new Date().toISOString()
            });
            writeJson(blockedUsersPath, blockedUsers);
            console.log(`用户 ${targetUser.email} 已注销 (UID: ${targetUser.firebaseUid})`);
        }
    }

    users.splice(userIndex, 1);
    writeJson(usersPath, users);

    // 🔒 强制登出：清除该用户的所有 session
    let sessionsCleared = 0;
    userSessions.forEach((sessionData, token) => {
        if (sessionData.email === targetUser.email) {
            userSessions.delete(token);
            sessionsCleared++;
        }
    });
    // 清除管理员 session（如果有）
    sessions.forEach((adminInfo, token) => {
        if (adminInfo.email === targetUser.email) {
            sessions.delete(token);
            sessionsCleared++;
        }
    });
    if (sessionsCleared > 0) {
        saveSessions();
        console.log(`已清除 ${sessionsCleared} 个活跃 session`);
    }

    // 🔔 通过 WebSocket 实时通知该用户强制登出
    broadcastKickout(targetUser.email);

    res.json({ success: true, message: '用户已删除，并禁止再次登录' });
});

// --- Blocked Users (Blacklist) Management API ---

// GET /api/admin/blocked-users - 获取注销用户列表
app.get('/api/admin/blocked-users', checkAuth, (req, res) => {
    const blockedUsers = readJson(blockedUsersPath, []);

    // 兼容新旧格式，统一输出为对象格式
    const normalized = blockedUsers.map(item => {
        if (typeof item === 'object') {
            // 新格式：直接返回
            return {
                uid: item.uid || null,
                email: item.email || null,
                nickname: item.nickname || null,
                bannedAt: item.bannedAt || null
            };
        } else {
            // 旧格式：字符串，判断是 UID 还是 Email
            const isEmail = item.includes('@');
            return {
                uid: isEmail ? null : item,
                email: isEmail ? item : null,
                nickname: null,
                bannedAt: null
            };
        }
    });

    res.json({ blockedUsers: normalized, total: normalized.length });
});

// DELETE /api/admin/blocked-users/:index - 从黑名单移除（恢复账号，按索引）
app.delete('/api/admin/blocked-users/:index', checkAuth, (req, res) => {
    const index = parseInt(req.params.index, 10);

    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: '无效的索引' });
    }

    const blockedUsers = readJson(blockedUsersPath, []);

    if (index >= blockedUsers.length) {
        return res.status(404).json({ error: '该用户不在黑名单中' });
    }

    const removed = blockedUsers.splice(index, 1)[0];
    writeJson(blockedUsersPath, blockedUsers);

    const displayName = typeof removed === 'object'
        ? (removed.email || removed.uid || '未知用户')
        : removed;

    console.log(`已从黑名单移除: ${displayName}`);
    res.json({ success: true, message: '已从黑名单移除，用户可重新注册' });
});

// --- Content API (Public Read) ---
app.get('/api/content', (req, res) => {
    const data = readJson(contentPath, { solo: '', services: '', blocks: [], workflows: [] });
    res.json(data);
});

// --- Content API (Admin Write) ---
app.post('/api/content', checkAuth, (req, res) => {
    const { solo, services, blocks, workflow, workflows } = req.body;
    writeJson(contentPath, {
        solo: solo || '',
        services: services || '',
        blocks: Array.isArray(blocks) ? blocks : [],
        workflows: Array.isArray(workflows) ? workflows : []
    });
    res.json({ success: true });
});

// --- Settings API (Public Read) ---
app.get('/api/settings', (req, res) => {
    const defaultSettings = {
        siteName: 'AIForge',
        slogan: 'AI 工具导航与自建生态',
        seoDescription: 'AIForge - AI 工具导航平台，聚合最新AI工具、大语言模型、工作流平台等资源',
        notice: '',
        // 首页内容设置
        portfolio: {
            title: '精选作品',
            subtitle: '展示最新的创意项目和技术实现',
            filters: ['全部', 'AI 工具', '网页设计', '品牌设计'],
            items: [
                { title: 'AI 工具集成平台', description: '整合多种 AI 工具的统一平台，提供文本生成、图像处理、数据分析等功能', category: 'ai-tools', tags: ['AI', '平台', '集成'] },
                { title: '响应式网站设计', description: '现代化的响应式网站设计，注重用户体验和性能优化', category: 'web-design', tags: ['网页设计', '响应式', 'UX'] },
                { title: '品牌视觉识别', description: '完整的品牌视觉识别系统设计，包括 Logo、色彩、字体等', category: 'branding', tags: ['品牌', '视觉', '识别'] },
                { title: '移动应用界面', description: '直观易用的移动应用界面设计，注重交互体验和视觉美感', category: 'ai-tools', tags: ['移动端', 'UI', '交互'] }
            ]
        },
        services: {
            title: '专业服务',
            subtitle: '提供全方位的数字化解决方案',
            items: [
                { title: 'AI 工具开发', description: '定制化 AI 工具开发，包括文本生成、图像处理、数据分析等功能模块', icon: 'lightning' },
                { title: '网站设计开发', description: '现代化响应式网站设计与开发，注重性能优化和用户体验', icon: 'monitor' },
                { title: '系统集成', description: '企业级系统集成服务，提供完整的数字化转型解决方案', icon: 'settings' },
                { title: '品牌设计', description: '专业的品牌视觉识别设计，打造独特的品牌形象和用户体验', icon: 'star' }
            ]
        },
        about: {
            title: '关于我们',
            subtitle: '专注创新与品质的设计团队',
            content: '我们是一支专注于现代化数字体验的创意团队，致力于将最新的 AI 技术与优秀的设计理念相结合，为客户提供创新的解决方案。\n\n从概念到实现，我们关注每一个细节，确保每个项目都能达到最高的品质标准。我们相信好的设计不仅要美观，更要实用和有意义。',
            stats: [
                { value: '50+', label: '完成项目' },
                { value: '3年', label: '行业经验' },
                { value: '100%', label: '客户满意度' }
            ]
        },
        footer: {
            copyright: '© 2025 AIForge. 保留所有权利.',
            email: 'hello@studio.com',
            address: '北京市朝阳区'
        }
    };
    const data = readJson(settingsPath, defaultSettings);
    // Merge with defaults to ensure all fields exist
    const merged = { ...defaultSettings, ...data };
    res.json(merged);
});

// --- Settings API (Admin Write) ---
app.post('/api/settings', checkAuth, (req, res) => {
    const settings = req.body;
    writeJson(settingsPath, settings);
    res.json({ success: true });
});

// --- Metrics API (Admin Read) ---
app.get('/api/admin/metrics', checkAuth, (req, res) => {
    const metrics = readJson(metricsPath, { clicks: { ai_tools: 0 }, views: { trends: 0 } });
    res.json({ metrics });
});

// --- Metrics Event API (Public Write) ---
app.post('/api/metrics/events', (req, res) => {
    const { type } = req.body; // type: 'ai_tool_click' | 'trends_view'
    const metrics = readJson(metricsPath, { clicks: { ai_tools: 0 }, views: { trends: 0 } });

    if (!metrics.clicks) metrics.clicks = { ai_tools: 0 };
    if (!metrics.views) metrics.views = { trends: 0 };

    if (type === 'ai_tool_click') {
        metrics.clicks.ai_tools = (metrics.clicks.ai_tools || 0) + 1;
    } else if (type === 'trends_view') {
        metrics.views.trends = (metrics.views.trends || 0) + 1;
    }

    writeJson(metricsPath, metrics);
    res.json({ success: true });
});

// --- Site Bookmark API (Public) ---
// Get site bookmarks
app.get('/api/site/bookmarks', (req, res) => {
    const metrics = readJson(metricsPath, { clicks: { ai_tools: 0 }, views: { trends: 0 }, bookmarks: 0 });
    res.json({ bookmarks: metrics.bookmarks || 0 });
});

// Toggle bookmark (add or remove based on action)
app.post('/api/site/bookmark', (req, res) => {
    const { action } = req.body; // 'add' or 'remove'
    const metrics = readJson(metricsPath, { clicks: { ai_tools: 0 }, views: { trends: 0 }, bookmarks: 0 });

    if (action === 'remove') {
        // Remove bookmark (decrement, but don't go below 0)
        metrics.bookmarks = Math.max(0, (metrics.bookmarks || 0) - 1);
    } else {
        // Add bookmark (default behavior)
        metrics.bookmarks = (metrics.bookmarks || 0) + 1;
    }

    writeJson(metricsPath, metrics);
    res.json({ success: true, bookmarks: metrics.bookmarks, action: action || 'add' });
});

// --- Online Users Tracking ---
const onlineUsers = new Map(); // token -> { lastSeen: timestamp }
const ONLINE_TIMEOUT = 60000; // 60 seconds

// Heartbeat endpoint for tracking online users
app.post('/api/heartbeat', (req, res) => {
    const token = req.cookies?.user_token || req.headers['x-session-id'] || randomUUID();
    onlineUsers.set(token, { lastSeen: Date.now() });
    res.json({ success: true });
});

// Get online users count
app.get('/api/admin/online-users', checkAuth, (req, res) => {
    const now = Date.now();
    let count = 0;
    onlineUsers.forEach((data, token) => {
        if (now - data.lastSeen < ONLINE_TIMEOUT) {
            count++;
        } else {
            onlineUsers.delete(token);
        }
    });
    res.json({ count });
});

// Get dashboard stats including bookmarks and online users
app.get('/api/admin/dashboard-stats', checkAuth, (req, res) => {
    const metrics = readJson(metricsPath, { clicks: { ai_tools: 0 }, views: { trends: 0 }, bookmarks: 0 });

    // Count online users
    const now = Date.now();
    let onlineCount = 0;
    onlineUsers.forEach((data, token) => {
        if (now - data.lastSeen < ONLINE_TIMEOUT) {
            onlineCount++;
        } else {
            onlineUsers.delete(token);
        }
    });

    res.json({
        bookmarks: metrics.bookmarks || 0,
        onlineUsers: onlineCount
    });
});

// --- Anonymous Thoughts Admin API ---
app.put('/api/admin/anonymous-thoughts/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { content, date, category } = req.body;

    const data = readThoughts();
    const idx = data.posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'not_found' });

    if (content !== undefined) data.posts[idx].content = content;
    if (date !== undefined) data.posts[idx].date = normalizeDate(date) || data.posts[idx].date;
    if (category !== undefined) data.posts[idx].category = normalizeCategory(category) || data.posts[idx].category;

    writeThoughts(data);
    res.json({ success: true, post: data.posts[idx] });
});

app.delete('/api/admin/anonymous-thoughts/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readThoughts();
    const idx = data.posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'not_found' });

    data.posts.splice(idx, 1);
    writeThoughts(data);
    res.json({ success: true });
});

// Delete a specific comment from a thought
app.delete('/api/admin/anonymous-thoughts/:id/comments/:commentIndex', checkAuth, (req, res) => {
    const { id, commentIndex } = req.params;
    const idx = parseInt(commentIndex, 10);

    const data = readThoughts();
    const post = data.posts.find(p => p.id === id);
    if (!post) return res.status(404).json({ error: 'post_not_found' });

    if (!post.comments || !Array.isArray(post.comments)) {
        return res.status(404).json({ error: 'no_comments' });
    }

    if (idx < 0 || idx >= post.comments.length) {
        return res.status(404).json({ error: 'comment_not_found' });
    }

    post.comments.splice(idx, 1);
    writeThoughts(data);
    res.json({ success: true });
});

// --- Admin Page Route (Protected) ---
app.get('/admin.html', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/admin_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (token && sessions.has(token)) {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    } else {
        res.redirect('/');
    }
});

// --- AI Tools Admin API ---

// GET /api/admin/tools - 获取所有工具
app.get('/api/admin/tools', checkAuth, (req, res) => {
    const data = readTools();
    res.json(data);
});

// POST /api/admin/tools - 创建新工具
app.post('/api/admin/tools', checkAuth, (req, res) => {
    const { title, description, url, category } = req.body;

    // Validate required fields
    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: '标题不能为空' });
    }
    if (!url || typeof url !== 'string' || !url.trim()) {
        return res.status(400).json({ error: '链接不能为空' });
    }
    if (!category || typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({ error: '分类不能为空' });
    }

    const data = readTools();

    // Validate category exists
    const categoryExists = data.categories.some(c => c.id === category);
    if (!categoryExists) {
        return res.status(400).json({ error: '无效的分类' });
    }

    // Calculate order (add to end of category)
    const categoryTools = data.tools.filter(t => t.category === category);
    const maxOrder = categoryTools.length > 0
        ? Math.max(...categoryTools.map(t => t.order || 0))
        : 0;

    const newTool = {
        id: randomUUID(),
        title: title.trim(),
        description: (description || '').trim(),
        url: url.trim(),
        category: category.trim(),
        order: maxOrder + 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    data.tools.push(newTool);
    writeTools(data);

    res.json({ success: true, tool: newTool });
});

// PUT /api/admin/tools/reorder - 批量更新工具顺序
// NOTE: This route MUST be defined BEFORE /api/admin/tools/:id to avoid "reorder" being matched as an :id
app.put('/api/admin/tools/reorder', checkAuth, (req, res) => {
    const { categoryId, toolIds } = req.body;

    if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json({ error: '分类ID不能为空' });
    }
    if (!Array.isArray(toolIds) || toolIds.length === 0) {
        return res.status(400).json({ error: '工具ID列表不能为空' });
    }

    const data = readTools();

    // Validate category exists
    const categoryExists = data.categories.some(c => c.id === categoryId);
    if (!categoryExists) {
        return res.status(400).json({ error: '无效的分类' });
    }

    // Validate all tool IDs exist and belong to the category
    const categoryTools = data.tools.filter(t => t.category === categoryId);
    const categoryToolIds = new Set(categoryTools.map(t => t.id));

    for (const toolId of toolIds) {
        if (!categoryToolIds.has(toolId)) {
            return res.status(400).json({ error: `工具 ${toolId} 不存在或不属于该分类` });
        }
    }

    // Update order for each tool
    toolIds.forEach((toolId, index) => {
        const toolIndex = data.tools.findIndex(t => t.id === toolId);
        if (toolIndex !== -1) {
            data.tools[toolIndex].order = index + 1;
            data.tools[toolIndex].updatedAt = Date.now();
        }
    });

    writeTools(data);

    res.json({ success: true });
});

// PUT /api/admin/tools/:id - 更新工具
app.put('/api/admin/tools/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, url, category } = req.body;

    if (!id) {
        return res.status(400).json({ error: '工具ID不能为空' });
    }

    const data = readTools();
    const toolIndex = data.tools.findIndex(t => t.id === id);

    if (toolIndex === -1) {
        return res.status(404).json({ error: '工具不存在' });
    }

    // Validate required fields if provided
    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: '标题不能为空' });
    }
    if (url !== undefined && (!url || typeof url !== 'string' || !url.trim())) {
        return res.status(400).json({ error: '链接不能为空' });
    }
    if (category !== undefined) {
        if (!category || typeof category !== 'string' || !category.trim()) {
            return res.status(400).json({ error: '分类不能为空' });
        }
        const categoryExists = data.categories.some(c => c.id === category);
        if (!categoryExists) {
            return res.status(400).json({ error: '无效的分类' });
        }
    }

    const tool = data.tools[toolIndex];

    // Update fields
    if (title !== undefined) tool.title = title.trim();
    if (description !== undefined) tool.description = description.trim();
    if (url !== undefined) tool.url = url.trim();
    if (category !== undefined && category !== tool.category) {
        // Moving to new category, recalculate order
        const newCategoryTools = data.tools.filter(t => t.category === category);
        const maxOrder = newCategoryTools.length > 0
            ? Math.max(...newCategoryTools.map(t => t.order || 0))
            : 0;
        tool.category = category.trim();
        tool.order = maxOrder + 1;
    }
    tool.updatedAt = Date.now();

    data.tools[toolIndex] = tool;
    writeTools(data);

    res.json({ success: true, tool });
});

// DELETE /api/admin/tools/:id - 删除工具
app.delete('/api/admin/tools/:id', checkAuth, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '工具ID不能为空' });
    }

    const data = readTools();
    const toolIndex = data.tools.findIndex(t => t.id === id);

    if (toolIndex === -1) {
        return res.status(404).json({ error: '工具不存在' });
    }

    data.tools.splice(toolIndex, 1);
    writeTools(data);

    res.json({ success: true });
});

// --- Public Tools API ---

// GET /api/tools - 公开API，供tools.html动态加载
app.get('/api/tools', (req, res) => {
    const data = readTools();

    // Sort categories by order
    const sortedCategories = [...data.categories].sort((a, b) => a.order - b.order);

    // Sort tools within each category by order
    const sortedTools = [...data.tools].sort((a, b) => {
        // First sort by category order
        const catA = data.categories.find(c => c.id === a.category);
        const catB = data.categories.find(c => c.id === b.category);
        const catOrderA = catA ? catA.order : 999;
        const catOrderB = catB ? catB.order : 999;

        if (catOrderA !== catOrderB) {
            return catOrderA - catOrderB;
        }

        // Then sort by tool order within category
        return (a.order || 0) - (b.order || 0);
    });

    // Group tools by category for easier frontend consumption
    const toolsByCategory = {};
    sortedCategories.forEach(cat => {
        toolsByCategory[cat.id] = {
            name: cat.name,
            tools: sortedTools
                .filter(t => t.category === cat.id)
                .map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    url: t.url,
                    logo: t.logo,
                    tags: t.tags || []
                }))
        };
    });

    res.json({
        categories: sortedCategories,
        tools: sortedTools.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            url: t.url,
            category: t.category,
            logo: t.logo,
            tags: t.tags || []
        })),
        toolsByCategory
    });
});

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// --- Apps & Products Management ---

// Ensure uploads directory exists
fs.mkdirSync(uploadsDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes = ['.json', '.txt', '.yaml', '.yml', '.xml', '.csv', '.md', '.js', '.py', '.sh', '.bat', '.ps1', '.zip'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// Apps Read/Write Functions
function readApps() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(appsPath)) {
        const defaultApps = { apps: [] };
        writeApps(defaultApps);
        return defaultApps;
    }
    try {
        const data = JSON.parse(fs.readFileSync(appsPath, 'utf8'));
        if (!data || typeof data !== 'object') return { apps: [] };
        if (!Array.isArray(data.apps)) data.apps = [];
        return data;
    } catch (e) {
        console.error('Error reading apps.json:', e);
        return { apps: [] };
    }
}

function writeApps(data) {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmpPath = `${appsPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, appsPath);
}

// Products Read/Write Functions
function readProducts() {
    fs.mkdirSync(dataDir, { recursive: true });
    if (!fs.existsSync(productsPath)) {
        const defaultProducts = { products: [] };
        writeProducts(defaultProducts);
        return defaultProducts;
    }
    try {
        const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        if (!data || typeof data !== 'object') return { products: [] };
        if (!Array.isArray(data.products)) data.products = [];
        return data;
    } catch (e) {
        console.error('Error reading products.json:', e);
        return { products: [] };
    }
}

function writeProducts(data) {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmpPath = `${productsPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, productsPath);
}

// --- Apps Admin API ---

// GET /api/admin/apps - 获取所有 Apps
app.get('/api/admin/apps', checkAuth, (req, res) => {
    const data = readApps();
    res.json(data);
});

// POST /api/admin/apps - 创建新 App
app.post('/api/admin/apps', checkAuth, (req, res) => {
    const { title, description, port, tags } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: '标题不能为空' });
    }
    if (!port || typeof port !== 'string' || !port.trim()) {
        return res.status(400).json({ error: '端口链接不能为空' });
    }

    const data = readApps();
    const newApp = {
        id: randomUUID(),
        title: title.trim(),
        description: (description || '').trim(),
        port: port.trim(),
        tags: Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(t => t) : [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    data.apps.push(newApp);
    writeApps(data);

    res.json({ success: true, app: newApp });
});

// PUT /api/admin/apps/:id - 更新 App
app.put('/api/admin/apps/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, port, tags } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'App ID不能为空' });
    }

    const data = readApps();
    const appIndex = data.apps.findIndex(a => a.id === id);

    if (appIndex === -1) {
        return res.status(404).json({ error: 'App不存在' });
    }

    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: '标题不能为空' });
    }
    if (port !== undefined && (!port || typeof port !== 'string' || !port.trim())) {
        return res.status(400).json({ error: '端口链接不能为空' });
    }

    const app = data.apps[appIndex];
    if (title !== undefined) app.title = title.trim();
    if (description !== undefined) app.description = description.trim();
    if (port !== undefined) app.port = port.trim();
    if (tags !== undefined) app.tags = Array.isArray(tags) ? tags.map(t => String(t).trim()).filter(t => t) : [];
    app.updatedAt = Date.now();

    data.apps[appIndex] = app;
    writeApps(data);

    res.json({ success: true, app });
});

// DELETE /api/admin/apps/:id - 删除 App
app.delete('/api/admin/apps/:id', checkAuth, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'App ID不能为空' });
    }

    const data = readApps();
    const appIndex = data.apps.findIndex(a => a.id === id);

    if (appIndex === -1) {
        return res.status(404).json({ error: 'App不存在' });
    }

    data.apps.splice(appIndex, 1);
    writeApps(data);

    res.json({ success: true });
});

// --- Products Admin API ---

// GET /api/admin/products - 获取所有产品
app.get('/api/admin/products', checkAuth, (req, res) => {
    const data = readProducts();
    res.json(data);
});

// POST /api/admin/products - 创建新产品（支持文件上传）
app.post('/api/admin/products', checkAuth, upload.single('file'), (req, res) => {
    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: '名称不能为空' });
    }

    const data = readProducts();
    const newProduct = {
        id: randomUUID(),
        title: title.trim(),
        description: (description || '').trim(),
        file: req.file ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        } : null,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    data.products.push(newProduct);
    writeProducts(data);

    res.json({ success: true, product: newProduct });
});

// PUT /api/admin/products/:id - 更新产品
app.put('/api/admin/products/:id', checkAuth, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { title, description, removeFile } = req.body;

    if (!id) {
        return res.status(400).json({ error: '产品ID不能为空' });
    }

    const data = readProducts();
    const productIndex = data.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ error: '产品不存在' });
    }

    if (title !== undefined && (!title || typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: '名称不能为空' });
    }

    const product = data.products[productIndex];
    if (title !== undefined) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();

    // Handle file update
    if (req.file) {
        // Delete old file if exists
        if (product.file && product.file.filename) {
            const oldFilePath = path.join(uploadsDir, product.file.filename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
        product.file = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype
        };
    } else if (removeFile === 'true' && product.file) {
        // Remove file if requested
        if (product.file.filename) {
            const oldFilePath = path.join(uploadsDir, product.file.filename);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
        product.file = null;
    }

    product.updatedAt = Date.now();
    data.products[productIndex] = product;
    writeProducts(data);

    res.json({ success: true, product });
});

// DELETE /api/admin/products/:id - 删除产品
app.delete('/api/admin/products/:id', checkAuth, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '产品ID不能为空' });
    }

    const data = readProducts();
    const productIndex = data.products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({ error: '产品不存在' });
    }

    // Delete associated file
    const product = data.products[productIndex];
    if (product.file && product.file.filename) {
        const filePath = path.join(uploadsDir, product.file.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    data.products.splice(productIndex, 1);
    writeProducts(data);

    res.json({ success: true });
});

// GET /api/products/:id/download - 下载产品文件
app.get('/api/products/:id/download', (req, res) => {
    const { id } = req.params;
    const data = readProducts();
    const product = data.products.find(p => p.id === id);

    if (!product || !product.file) {
        return res.status(404).json({ error: '文件不存在' });
    }

    const filePath = path.join(uploadsDir, product.file.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: '文件不存在' });
    }

    res.download(filePath, product.file.originalname);
});

// --- Tutorials, APIs, Trends Management ---

const tutorialsPath = path.join(dataDir, 'tutorials.json');
const apisPath = path.join(dataDir, 'apis.json');
const trendsPath = path.join(dataDir, 'trends.json');

function readTutorials() {
    return readJson(tutorialsPath, { tutorials: [] });
}
function writeTutorials(data) {
    writeJson(tutorialsPath, data);
}
function readApisData() {
    return readJson(apisPath, { apis: [] });
}
function writeApisData(data) {
    writeJson(apisPath, data);
}
function readTrends() {
    return readJson(trendsPath, { trends: [] });
}
function writeTrends(data) {
    writeJson(trendsPath, data);
}

// --- Tutorials Admin API ---
app.get('/api/admin/tutorials', checkAuth, (req, res) => {
    const data = readTutorials();
    res.json(data);
});

// --- Tutorials Public API (No Auth Required) ---
app.get('/api/public/tutorials', (req, res) => {
    const data = readTutorials();
    res.json(data);
});

app.post('/api/admin/tutorials', checkAuth, (req, res) => {
    const { title, description, url, category, tags } = req.body;
    if (!title || !url) {
        return res.status(400).json({ error: '标题和链接不能为空' });
    }
    const data = readTutorials();
    const newItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description ? description.trim() : '',
        url: url.trim(),
        category: category || '',
        tags: tags || [],
        createdAt: Date.now()
    };
    data.tutorials.push(newItem);
    writeTutorials(data);
    res.json({ success: true, tutorial: newItem });
});

app.put('/api/admin/tutorials/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, url, category, tags } = req.body;
    const data = readTutorials();
    const index = data.tutorials.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    if (title) data.tutorials[index].title = title.trim();
    if (description !== undefined) data.tutorials[index].description = description.trim();
    if (url) data.tutorials[index].url = url.trim();
    if (category !== undefined) data.tutorials[index].category = category;
    if (tags) data.tutorials[index].tags = tags;
    data.tutorials[index].updatedAt = Date.now();
    writeTutorials(data);
    res.json({ success: true });
});

app.delete('/api/admin/tutorials/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readTutorials();
    const index = data.tutorials.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    data.tutorials.splice(index, 1);
    writeTutorials(data);
    res.json({ success: true });
});

// --- APIs Admin API ---
app.get('/api/admin/apis', checkAuth, (req, res) => {
    const data = readApisData();
    res.json(data);
});

// --- APIs Public API (No Auth Required) ---
app.get('/api/public/apis', (req, res) => {
    const data = readApisData();
    res.json(data);
});

app.post('/api/admin/apis', checkAuth, (req, res) => {
    const { title, description, url, category, subcategory, pricing, tags } = req.body;
    if (!title || !url) {
        return res.status(400).json({ error: '标题和链接不能为空' });
    }
    const data = readApisData();
    const newItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description ? description.trim() : '',
        url: url.trim(),
        category: category || '',
        subcategory: subcategory || '',
        pricing: pricing || 'free',
        tags: tags || [],
        createdAt: Date.now()
    };
    data.apis.push(newItem);
    writeApisData(data);
    res.json({ success: true, api: newItem });
});

app.put('/api/admin/apis/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, url, category, subcategory, pricing, tags } = req.body;
    const data = readApisData();
    const index = data.apis.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    if (title) data.apis[index].title = title.trim();
    if (description !== undefined) data.apis[index].description = description.trim();
    if (url) data.apis[index].url = url.trim();
    if (category !== undefined) data.apis[index].category = category;
    if (subcategory !== undefined) data.apis[index].subcategory = subcategory;
    if (pricing !== undefined) data.apis[index].pricing = pricing;
    if (tags) data.apis[index].tags = tags;
    data.apis[index].updatedAt = Date.now();
    writeApisData(data);
    res.json({ success: true });
});

app.delete('/api/admin/apis/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readApisData();
    const index = data.apis.findIndex(a => a.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    data.apis.splice(index, 1);
    writeApisData(data);
    res.json({ success: true });
});

// --- Trends Admin API ---
app.get('/api/admin/trends', checkAuth, (req, res) => {
    const data = readTrends();
    res.json(data);
});

app.post('/api/admin/trends', checkAuth, (req, res) => {
    const { title, description, url, tags } = req.body;
    if (!title || !url) {
        return res.status(400).json({ error: '标题和链接不能为空' });
    }
    const data = readTrends();
    const newItem = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description ? description.trim() : '',
        url: url.trim(),
        tags: tags || [],
        createdAt: Date.now()
    };
    data.trends.push(newItem);
    writeTrends(data);
    res.json({ success: true, trend: newItem });
});

app.put('/api/admin/trends/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, url, tags } = req.body;
    const data = readTrends();
    const index = data.trends.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    if (title) data.trends[index].title = title.trim();
    if (description !== undefined) data.trends[index].description = description.trim();
    if (url) data.trends[index].url = url.trim();
    if (tags) data.trends[index].tags = tags;
    data.trends[index].updatedAt = Date.now();
    writeTrends(data);
    res.json({ success: true });
});

app.delete('/api/admin/trends/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readTrends();
    const index = data.trends.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: '未找到' });
    }
    data.trends.splice(index, 1);
    writeTrends(data);
    res.json({ success: true });
});

// --- Public Tutorials, APIs, Trends API ---
app.get('/api/tutorials', (req, res) => {
    const data = readTutorials();
    res.json(data);
});

app.get('/api/apis', (req, res) => {
    const data = readApisData();
    res.json(data);
});

app.get('/api/trends', (req, res) => {
    const data = readTrends();
    res.json(data);
});

// --- Public Apps & Products API ---

// GET /api/apps - 公开API，获取所有Apps
app.get('/api/apps', (req, res) => {
    const data = readApps();
    res.json({
        apps: data.apps.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            port: a.port,
            tags: a.tags || []
        }))
    });
});

// GET /api/products - 公开API，获取所有产品
app.get('/api/products', (req, res) => {
    const data = readProducts();
    res.json({
        products: data.products.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            hasFile: !!p.file,
            fileName: p.file ? p.file.originalname : null
        }))
    });
});

// --- Portfolio Image Upload API ---
// 图片存放在 public/uploads/portfolio/ 目录下，这样可以直接被静态文件服务器访问
const portfolioUploadsDir = path.join(__dirname, 'public', 'uploads', 'portfolio');
fs.mkdirSync(portfolioUploadsDir, { recursive: true });

// Configure multer for portfolio image uploads
const portfolioStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(portfolioUploadsDir, { recursive: true });
        cb(null, portfolioUploadsDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `portfolio-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
        cb(null, uniqueName);
    }
});

const portfolioUpload = multer({
    storage: portfolioStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images
    fileFilter: (req, file, cb) => {
        // Only allow image files
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只允许上传图片文件 (JPEG, PNG, GIF, WebP, SVG)'), false);
        }
    }
});

// POST /api/upload - Upload portfolio image
app.post('/api/upload', checkAuth, portfolioUpload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '请选择要上传的图片' });
    }

    // Return the URL path to the uploaded file
    // 因为图片在 public 目录下，可以直接通过静态文件访问
    const imageUrl = `/uploads/portfolio/${req.file.filename}`;
    res.json({
        success: true,
        url: imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname
    });
});

// 注意：不需要额外的 express.static，因为 public 目录已经被设置为静态文件目录
// app.use(express.static(path.join(__dirname, 'public'))); 已经在上面配置了

// --- AI Rankings API ---
const aiRankingsPath = path.join(__dirname, 'data', 'ai_rankings.json');

// 确保rankings上传目录存在
const rankingsUploadDir = path.join(__dirname, 'public', 'uploads', 'rankings');
if (!fs.existsSync(rankingsUploadDir)) {
    fs.mkdirSync(rankingsUploadDir, { recursive: true });
}

// 配置rankings图片上传
const rankingsStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, rankingsUploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `ranking-${Date.now()}${ext}`);
    }
});
const rankingsUpload = multer({
    storage: rankingsStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('只允许上传图片文件'));
    }
});

// 默认层级模板
const defaultTiers = [
    { id: 'tier-s', name: '夯', color: '#FF0000', textColor: '#FFFFFF', order: 1, items: [] },
    { id: 'tier-a', name: '顶级', color: '#FFA500', textColor: '#000000', order: 2, items: [] },
    { id: 'tier-b', name: '人上人', color: '#FFFF00', textColor: '#000000', order: 3, items: [] },
    { id: 'tier-c', name: 'NPC', color: '#FFFACD', textColor: '#000000', order: 4, items: [] },
    { id: 'tier-d', name: '拉完了', color: '#FFFFFF', textColor: '#000000', order: 5, items: [] }
];

function readAiRankings() {
    return readJson(aiRankingsPath, {
        boards: [
            {
                id: 'board-main',
                name: '总榜',
                description: 'AI工具能力分级排行',
                order: 0,
                tiers: JSON.parse(JSON.stringify(defaultTiers))
            }
        ],
        lastUpdated: new Date().toISOString()
    });
}

function writeAiRankings(data) {
    data.lastUpdated = new Date().toISOString();
    writeJson(aiRankingsPath, data);
}

// GET /api/ai-rankings - 公开API，获取所有排行榜
app.get('/api/ai-rankings', (req, res) => {
    const data = readAiRankings();
    res.json(data);
});

// GET /api/ai-rankings/:boardId - 获取单个排行榜
app.get('/api/ai-rankings/:boardId', (req, res) => {
    const { boardId } = req.params;
    const data = readAiRankings();
    const board = data.boards.find(b => b.id === boardId);
    if (!board) {
        return res.status(404).json({ error: '排行榜不存在' });
    }
    res.json(board);
});

// POST /api/admin/ai-rankings/board - 创建新排行榜
app.post('/api/admin/ai-rankings/board', checkAuth, (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ error: '排行榜名称不能为空' });
    }

    const data = readAiRankings();
    const newBoard = {
        id: `board-${Date.now()}`,
        name,
        description: description || '',
        order: data.boards.length,
        tiers: JSON.parse(JSON.stringify(defaultTiers))
    };

    data.boards.push(newBoard);
    writeAiRankings(data);
    res.json({ success: true, board: newBoard });
});

// PUT /api/admin/ai-rankings/board/:id - 更新排行榜信息
app.put('/api/admin/ai-rankings/board/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { name, description, order } = req.body;

    const data = readAiRankings();
    const board = data.boards.find(b => b.id === id);
    if (!board) {
        return res.status(404).json({ error: '排行榜不存在' });
    }

    if (name) board.name = name;
    if (description !== undefined) board.description = description;
    if (order !== undefined) board.order = order;

    data.boards.sort((a, b) => a.order - b.order);
    writeAiRankings(data);
    res.json({ success: true, board });
});

// DELETE /api/admin/ai-rankings/board/:id - 删除排行榜
app.delete('/api/admin/ai-rankings/board/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readAiRankings();

    if (data.boards.length <= 1) {
        return res.status(400).json({ error: '至少保留一个排行榜' });
    }

    data.boards = data.boards.filter(b => b.id !== id);
    writeAiRankings(data);
    res.json({ success: true });
});

// POST /api/admin/ai-rankings/item - 添加AI项目到层级
app.post('/api/admin/ai-rankings/item', checkAuth, (req, res) => {
    const { boardId, tierId, name, image, description, link } = req.body;
    if (!boardId || !tierId || !name) {
        return res.status(400).json({ error: '排行榜ID、层级ID和名称不能为空' });
    }

    const data = readAiRankings();
    const board = data.boards.find(b => b.id === boardId);
    if (!board) {
        return res.status(404).json({ error: '排行榜不存在' });
    }

    const tier = board.tiers.find(t => t.id === tierId);
    if (!tier) {
        return res.status(404).json({ error: '层级不存在' });
    }

    const newItem = {
        id: `item-${Date.now()}`,
        name,
        image: image || '',
        description: description || '',
        link: link || ''
    };

    tier.items.push(newItem);
    writeAiRankings(data);
    res.json({ success: true, item: newItem });
});

// PUT /api/admin/ai-rankings/item/:id - 更新AI项目
app.put('/api/admin/ai-rankings/item/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { boardId, tierId, name, image, description, link } = req.body;

    const data = readAiRankings();

    // 遍历所有榜找到项目
    for (const board of data.boards) {
        for (const tier of board.tiers) {
            const itemIndex = tier.items.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                const item = tier.items[itemIndex];

                // 如果需要移动到其他榜或层级
                if ((boardId && boardId !== board.id) || (tierId && tierId !== tier.id)) {
                    tier.items.splice(itemIndex, 1);
                    const targetBoard = data.boards.find(b => b.id === (boardId || board.id));
                    if (targetBoard) {
                        const targetTier = targetBoard.tiers.find(t => t.id === (tierId || tier.id));
                        if (targetTier) {
                            item.name = name || item.name;
                            item.image = image !== undefined ? image : item.image;
                            item.description = description !== undefined ? description : item.description;
                            item.link = link !== undefined ? link : item.link;
                            targetTier.items.push(item);
                        }
                    }
                } else {
                    // 原地更新
                    tier.items[itemIndex] = {
                        ...item,
                        name: name || item.name,
                        image: image !== undefined ? image : item.image,
                        description: description !== undefined ? description : item.description,
                        link: link !== undefined ? link : item.link
                    };
                }
                writeAiRankings(data);
                return res.json({ success: true });
            }
        }
    }

    res.status(404).json({ error: '项目不存在' });
});

// DELETE /api/admin/ai-rankings/item/:id - 删除AI项目
app.delete('/api/admin/ai-rankings/item/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const data = readAiRankings();

    for (const board of data.boards) {
        for (const tier of board.tiers) {
            const itemIndex = tier.items.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                tier.items.splice(itemIndex, 1);
                writeAiRankings(data);
                return res.json({ success: true });
            }
        }
    }

    res.status(404).json({ error: '项目不存在' });
});

// POST /api/admin/ai-rankings/upload - 上传排行榜图片
app.post('/api/admin/ai-rankings/upload', checkAuth, rankingsUpload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: '请选择图片文件' });
    }
    const imageUrl = `/uploads/rankings/${req.file.filename}`;
    res.json({ success: true, url: imageUrl });
});

// POST /api/admin/ai-rankings/reorder - 重新排序层级内的项目
app.post('/api/admin/ai-rankings/reorder', checkAuth, (req, res) => {
    const { boardId, tierId, items } = req.body;

    if (!boardId || !tierId || !Array.isArray(items)) {
        return res.status(400).json({ error: '参数错误' });
    }

    const data = readAiRankings();
    const board = data.boards.find(b => b.id === boardId);

    if (!board) {
        return res.status(404).json({ error: '排行榜不存在' });
    }

    const tier = board.tiers.find(t => t.id === tierId);

    if (!tier) {
        return res.status(404).json({ error: '层级不存在' });
    }

    // Update the items array with the new order
    tier.items = items;

    writeAiRankings(data);
    res.json({ success: true });
});

// POST /api/admin/ai-rankings/move-tier - 跨层级移动项目
app.post('/api/admin/ai-rankings/move-tier', checkAuth, (req, res) => {
    const { boardId, itemId, fromTierId, toTierId, targetIndex } = req.body;

    if (!boardId || !itemId || !fromTierId || !toTierId) {
        return res.status(400).json({ error: '参数错误' });
    }

    const data = readAiRankings();
    const board = data.boards.find(b => b.id === boardId);

    if (!board) {
        return res.status(404).json({ error: '排行榜不存在' });
    }

    const fromTier = board.tiers.find(t => t.id === fromTierId);
    const toTier = board.tiers.find(t => t.id === toTierId);

    if (!fromTier || !toTier) {
        return res.status(404).json({ error: '层级不存在' });
    }

    // Find and remove item from source tier
    const itemIndex = fromTier.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
        return res.status(404).json({ error: '项目不存在' });
    }

    const [movedItem] = fromTier.items.splice(itemIndex, 1);

    // Add item to target tier at specified index
    const insertIndex = typeof targetIndex === 'number' ? targetIndex : toTier.items.length;
    toTier.items.splice(insertIndex, 0, movedItem);

    writeAiRankings(data);
    res.json({ success: true });
});

// --- GitHub OAuth Direct (不通过 Firebase) ---
// 需要设置环境变量 GITHUB_CLIENT_SECRET 或在这里直接配置
const GITHUB_OAUTH_CONFIG = {
    clientId: 'Ov23li3I0536JOe1jMpT',
    // Client Secret - 为了方便测试直接写在这里，生产环境建议用环境变量
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '65bd3437a4f261f3bfd439f173952bb0779ed58f'
};

// GET /api/auth/github/callback - GitHub OAuth 回调处理
app.get('/api/auth/github/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;

    // 从 state 中解析返回 URL
    function parseReturnUrlFromState(state) {
        try {
            if (state) {
                const parts = state.split('_');
                if (parts.length >= 2) {
                    const encodedReturnUrl = parts.slice(1).join('_');
                    return decodeURIComponent(Buffer.from(encodedReturnUrl, 'base64').toString('utf8'));
                }
            }
        } catch (e) {
            console.log('解析 state 中的返回 URL 失败:', e);
        }
        return '/tools.html';
    }

    const returnUrl = parseReturnUrlFromState(state);

    // 构建回调页面 HTML
    const buildCallbackPage = (success, message, userData = null, customReturnUrl = null) => {
        // 使用自定义 returnUrl（如果提供），否则使用从 state 解析的 returnUrl
        const finalReturnUrl = customReturnUrl || returnUrl;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub 登录</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #fff;
            padding: 20px;
        }
        
        .container { 
            text-align: center;
            padding: 40px;
            max-width: 400px;
            width: 100%;
        }
        
        .spinner { 
            width: 40px;
            height: 40px;
            border: 3px solid #f0f0f0;
            border-top-color: #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin { 
            to { transform: rotate(360deg); } 
        }
        
        h2 { 
            margin: 0 0 12px;
            font-size: 18px;
            font-weight: 600;
            color: #000;
        }
        
        p { 
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="spinner"></div>
        <h2>正在处理...</h2>
        <p>请稍候</p>
    </div>
    <script>
        // Debug logging (console only, not visible to users)
        function log(msg) {
            console.log('[GitHub OAuth] ' + msg);
        }
        
        log('回调页面加载完成');
        log('当前 URL: ' + window.location.href);
        log('是否在弹窗中: ' + (window.opener ? '是' : '否'));
        
        ${success && userData ? `
            // 🔥 修复：优先使用 window.opener 直接通信，localStorage 作为备用
            log('登录成功，用户数据: ' + JSON.stringify(${JSON.stringify(userData)}).substring(0, 100));
            log('window.opener 存在: ' + !!window.opener);
            
            const loginResult = {
                type: 'github_oauth_success',
                userData: ${JSON.stringify(userData)},
                isAdmin: ${JSON.stringify(userData.isAdmin || false)},
                returnUrl: ${JSON.stringify(finalReturnUrl)},
                timestamp: Date.now()
            };
            
            let notificationSuccess = false;
            
            // 🔥 优先级 1: 直接调用父窗口函数（最可靠）
            if (window.opener && window.opener !== window && !window.opener.closed) {
                log('✅ 检测到 window.opener，尝试直接调用函数');
                try {
                    if (typeof window.opener.handleGitHubLoginSuccess === 'function') {
                        // ✅ 传递完整的 loginResult，包含 userData 和 returnUrl
                        window.opener.handleGitHubLoginSuccess(loginResult);
                        log('✅ 已通过函数调用通知父窗口');
                        notificationSuccess = true;
                    } else {
                        log('⚠️ window.opener.handleGitHubLoginSuccess 函数不存在');
                    }
                } catch (e) {
                    log('❌ 函数调用失败: ' + e.message);
                }
                
                // 🔥 优先级 2: postMessage（作为备用）
                if (!notificationSuccess) {
                    try {
                        window.opener.postMessage(loginResult, window.location.origin);
                        log('✅ 已通过 postMessage 通知父窗口');
                        notificationSuccess = true;
                    } catch (e) {
                        log('❌ postMessage 失败: ' + e.message);
                    }
                }
            } else {
                log('⚠️ window.opener 不可用');
            }
            
            // 🔥 优先级 3: localStorage（最后的备用方案）
            if (!notificationSuccess) {
                log('⚠️ 直接通信失败，使用 localStorage 作为备用');
                try {
                    localStorage.setItem('github_oauth_result', JSON.stringify(loginResult));
                    log('✅ 已保存登录结果到 localStorage');
                } catch (e) {
                    log('❌ 保存到 localStorage 失败: ' + e.message);
                }
            }
            
            // 显示成功消息
            document.querySelector('h2').textContent = '登录成功';
            document.querySelector('p').textContent = '正在关闭窗口...';
            
            // 🔥 延迟关闭窗口，确保通知已发送（增加到 1000ms 确保函数调用完成）
            setTimeout(() => {
                log('尝试关闭窗口...');
                try {
                    window.close();
                    log('window.close() 已调用');
                    
                    // 如果 1 秒后窗口还没关闭，说明关闭失败
                    setTimeout(() => {
                        if (!window.closed) {
                            log('窗口未关闭，可能需要手动关闭');
                            document.querySelector('h2').textContent = '登录成功';
                            document.querySelector('p').textContent = '请手动关闭此窗口';
                        }
                    }, 1000);
                } catch (e) {
                    log('关闭窗口失败: ' + e.message);
                    document.querySelector('p').textContent = '请手动关闭此窗口';
                }
            }, 1000);
        ` : `
            // 🔥 登录失败处理
            log('登录失败: ' + ${JSON.stringify(message)});
            
            const errorResult = {
                type: 'github_oauth_error',
                error: 'login_failed',
                message: ${JSON.stringify(message)},
                timestamp: Date.now()
            };
            
            let notificationSuccess = false;
            
            // 🔥 优先级 1: 直接调用父窗口（如果可用）
            if (window.opener && window.opener !== window && !window.opener.closed) {
                log('✅ 检测到 window.opener，尝试通知错误');
                try {
                    window.opener.postMessage(errorResult, window.location.origin);
                    log('✅ 已通过 postMessage 通知父窗口');
                    notificationSuccess = true;
                } catch (e) {
                    log('❌ postMessage 失败: ' + e.message);
                }
            }
            
            // 🔥 优先级 2: localStorage（备用）
            if (!notificationSuccess) {
                try {
                    localStorage.setItem('github_oauth_result', JSON.stringify(errorResult));
                    log('✅ 已保存错误结果到 localStorage');
                } catch (e) {
                    log('❌ 保存到 localStorage 失败: ' + e.message);
                }
            }
            
            // 显示错误消息
            document.querySelector('h2').textContent = '登录失败';
            document.querySelector('p').textContent = ${JSON.stringify(message)};
            
            // 尝试关闭窗口
            setTimeout(() => {
                log('尝试关闭窗口...');
                try {
                    window.close();
                    log('window.close() 已调用');
                    
                    // 如果 1 秒后窗口还没关闭，说明关闭失败
                    setTimeout(() => {
                        if (!window.closed) {
                            log('窗口未关闭，可能需要手动关闭');
                            document.querySelector('p').textContent = '请手动关闭此窗口';
                        }
                    }, 1000);
                } catch (e) {
                    log('关闭窗口失败: ' + e.message);
                    document.querySelector('p').textContent = '请手动关闭此窗口';
                }
            }, 1500);
        `}
    </script>
</body>
</html>`;
    };

    // 检查错误
    if (error) {
        console.error('GitHub OAuth 错误:', error, error_description);
        return res.send(buildCallbackPage(false, error_description || 'GitHub 授权失败'));
    }

    if (!code) {
        return res.send(buildCallbackPage(false, '未收到授权码'));
    }

    // 检查 Client Secret 是否配置
    if (!GITHUB_OAUTH_CONFIG.clientSecret) {
        console.error('GitHub Client Secret 未配置！请设置环境变量 GITHUB_CLIENT_SECRET');
        return res.send(buildCallbackPage(false, 'GitHub OAuth 未正确配置，请联系管理员'));
    }

    try {
        // 用 code 换取 access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: GITHUB_OAUTH_CONFIG.clientId,
                client_secret: GITHUB_OAUTH_CONFIG.clientSecret,
                code: code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error('GitHub token 错误:', tokenData.error, tokenData.error_description);
            return res.send(buildCallbackPage(false, tokenData.error_description || 'GitHub 授权失败'));
        }

        const accessToken = tokenData.access_token;

        // 获取用户信息
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Aethrix-App'
            }
        });

        const githubUser = await userResponse.json();

        // 获取用户邮箱（可能需要单独请求）
        let email = githubUser.email;
        if (!email) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Aethrix-App'
                }
            });
            const emails = await emailResponse.json();
            const primaryEmail = emails.find(e => e.primary) || emails[0];
            email = primaryEmail ? primaryEmail.email : `${githubUser.login}@github.local`;
        }

        console.log('GitHub 用户信息:', { login: githubUser.login, email, id: githubUser.id });

        // 同步用户到后端数据库
        const users = readJson(usersPath, []);
        let user = users.find(u => u.githubId === githubUser.id || u.email === email);

        if (!user) {
            // 创建新用户
            user = {
                id: randomUUID(),
                githubId: githubUser.id,
                email: email,
                nickname: githubUser.name || githubUser.login,
                photoURL: githubUser.avatar_url,
                provider: 'github',
                createdAt: Date.now(),
                lastLogin: Date.now(),
                loginCount: 1,
                isAdmin: false
            };
            users.push(user);
        } else {
            // 更新现有用户
            user.githubId = githubUser.id;
            user.lastLogin = Date.now();
            user.loginCount = (user.loginCount || 0) + 1;
            if (githubUser.name) user.nickname = githubUser.name;
            if (githubUser.avatar_url) user.photoURL = githubUser.avatar_url;
            user.provider = 'github';
        }

        // ✅ 修复：只从 users.json 读取 isAdmin 状态，不使用硬编码邮箱
        // 管理员权限完全由 users.json 中的 isAdmin 字段控制
        const isAdmin = user.isAdmin === true;

        // 不再强制覆盖，保持 users.json 中的设置
        // user.isAdmin = isAdmin;  // 删除这行，避免覆盖

        writeJson(usersPath, users);

        // 创建后端 session
        const token = randomUUID();
        userSessions.set(token, {
            nickname: user.nickname,
            email: user.email,
            githubId: githubUser.id,
            loginTime: Date.now(),
            isAdmin: isAdmin
        });

        // 设置 cookies
        const cookies = [`user_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`];

        if (isAdmin) {
            const adminToken = randomUUID();
            sessions.set(adminToken, { userId: user.id, email: user.email });
            cookies.push(`admin_token=${adminToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`);
        }

        saveSessions();
        res.setHeader('Set-Cookie', cookies);

        // 构建前端需要的用户数据
        const userData = {
            uid: `github_${githubUser.id}`,
            email: email,
            displayName: user.nickname,
            photoURL: githubUser.avatar_url,
            provider: 'github',
            isAdmin: isAdmin,
            timestamp: Date.now()
        };

        // ✅ 修复：不要为管理员设置特殊的 returnUrl
        // 让前端的 handleGitHubLoginSuccess 根据 isAdmin 自动处理
        // 管理员：显示选择模态框
        // 普通用户：跳转到 returnUrl
        const finalReturnUrl = returnUrl;  // 保持原始 returnUrl

        return res.send(buildCallbackPage(true, '正在跳转...', userData, finalReturnUrl));

    } catch (error) {
        console.error('GitHub OAuth 处理错误:', error);
        return res.send(buildCallbackPage(false, '登录处理失败，请稍后重试'));
    }
});

// POST /api/auth/github/token - 前端用 code 换取用户信息（备用 API）
app.post('/api/auth/github/token', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: '缺少授权码' });
    }

    if (!GITHUB_OAUTH_CONFIG.clientSecret) {
        return res.status(500).json({ error: 'GitHub OAuth 未配置' });
    }

    try {
        // 用 code 换取 access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: GITHUB_OAUTH_CONFIG.clientId,
                client_secret: GITHUB_OAUTH_CONFIG.clientSecret,
                code: code
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).json({ error: tokenData.error_description || tokenData.error });
        }

        // 获取用户信息
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Aethrix-App'
            }
        });

        const githubUser = await userResponse.json();

        // 获取邮箱
        let email = githubUser.email;
        if (!email) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Aethrix-App'
                }
            });
            const emails = await emailResponse.json();
            const primaryEmail = emails.find(e => e.primary) || emails[0];
            email = primaryEmail ? primaryEmail.email : `${githubUser.login}@github.local`;
        }

        res.json({
            success: true,
            user: {
                id: githubUser.id,
                login: githubUser.login,
                nickname: githubUser.name || githubUser.login,
                email: email,
                avatar_url: githubUser.avatar_url
            }
        });

    } catch (error) {
        console.error('GitHub token 交换错误:', error);
        res.status(500).json({ error: '处理失败' });
    }
});

// ===== AI Assistant Chat API with Memory =====
// Settings for AI assistant are stored in settings.json under 'aiAssistant' key
// Chat history is stored in chat_history.json

const chatHistoryPath = path.join(dataDir, 'chat_history.json');
const modelUsagePath = path.join(dataDir, 'model_usage.json');

// --- Model Auto-Switch Logic ---
function getModelUsage() {
    return readJson(modelUsagePath, { currentModelIndex: 0, usageCount: 0 });
}

function saveModelUsage(data) {
    writeJson(modelUsagePath, data);
}

function getActiveModel(aiSettings, userId) {
    const savedModels = aiSettings.savedModels || [];
    const autoSwitch = aiSettings.autoSwitch === true;

    // If no saved models or auto-switch disabled, use the configured model
    if (!autoSwitch || savedModels.length === 0) {
        return aiSettings.modelName;
    }

    // Get current usage stats (per-user if userId provided, otherwise global)
    const usage = getModelUsage();
    const userKey = userId || '_global';

    // Initialize user's model state if not exists
    if (!usage.users) usage.users = {};
    if (!usage.users[userKey]) {
        // New user: assign random model
        const randomIndex = Math.floor(Math.random() * savedModels.length);
        usage.users[userKey] = { modelIndex: randomIndex, usageCount: 0 };
    }

    let userUsage = usage.users[userKey];
    let currentIndex = userUsage.modelIndex || 0;
    let usageCount = userUsage.usageCount || 0;

    // Ensure index is valid
    if (currentIndex >= savedModels.length) {
        currentIndex = Math.floor(Math.random() * savedModels.length);
    }

    // Check if we need to switch (every 5 uses)
    if (usageCount >= 5) {
        currentIndex = (currentIndex + 1) % savedModels.length;
        usageCount = 0;
    }

    // Increment usage count and save
    usage.users[userKey] = { modelIndex: currentIndex, usageCount: usageCount + 1 };
    saveModelUsage(usage);

    return savedModels[currentIndex];
}

function getRandomModel(aiSettings) {
    const savedModels = aiSettings.savedModels || [];
    if (savedModels.length === 0) {
        return aiSettings.modelName;
    }
    const randomIndex = Math.floor(Math.random() * savedModels.length);
    return savedModels[randomIndex];
}

// --- ChatService: Knowledge Base and System Prompt ---
let knowledgeBase = null;

function loadKnowledgeBase() {
    try {
        const toolsData = readTools();
        knowledgeBase = {
            categories: toolsData.categories || [],
            tools: toolsData.tools || []
        };
        console.log(`[ChatService] Knowledge base loaded: ${knowledgeBase.categories.length} categories, ${knowledgeBase.tools.length} tools`);
    } catch (e) {
        console.error('[ChatService] Failed to load knowledge base:', e.message);
        knowledgeBase = { categories: [], tools: [] };
    }
}

// Load knowledge base on startup
loadKnowledgeBase();

function buildSystemPrompt(customPrompt, modelName) {
    if (customPrompt && customPrompt.trim()) {
        return customPrompt;
    }

    // 实时读取 settings.json 获取最新的主页内容
    const settings = readJson(settingsPath, {});

    // 实时读取 tools.json 获取最新的工具知识库
    const toolsData = readTools();
    const currentKnowledgeBase = {
        categories: toolsData.categories || [],
        tools: toolsData.tools || []
    };

    // Build categories summary
    const categoriesSummary = currentKnowledgeBase.categories
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(c => `${c.name}`)
        .join('、');

    // Build tools summary (group by category, limit to top tools)
    const toolsByCategory = {};
    currentKnowledgeBase.tools.forEach(tool => {
        if (!toolsByCategory[tool.category]) {
            toolsByCategory[tool.category] = [];
        }
        toolsByCategory[tool.category].push(tool);
    });

    const toolsSummary = currentKnowledgeBase.categories
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(cat => {
            const tools = (toolsByCategory[cat.id] || [])
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .slice(0, 5);
            if (tools.length === 0) return null;
            const toolList = tools.map(t => `${t.title}`).join('、');
            return `${cat.name}类：${toolList}`;
        })
        .filter(Boolean)
        .join('；');

    // 模型身份说明
    const modelIdentity = modelName ? `你的底层模型是 ${modelName}，但你的身份是以太夜助手。当用户问你是什么模型时，你可以说"我是基于${modelName}的以太夜助手"。` : '';

    // 构建主页内容知识库
    const siteName = settings.siteName || '以太夜';
    const slogan = settings.slogan || '';
    const seoDescription = settings.seoDescription || '';
    const notice = settings.notice || '';

    // 精选作品
    const portfolio = settings.portfolio || {};
    const portfolioItems = (portfolio.items || []).map(item =>
        `${item.title}：${item.description}`
    ).join('；');

    // 专业服务
    const services = settings.services || {};
    const serviceItems = (services.items || []).map(item =>
        `${item.title}：${item.description}`
    ).join('；');

    // 关于我们
    const about = settings.about || {};
    const aboutContent = about.content || '';
    const aboutStats = (about.stats || []).map(s => `${s.label}：${s.value}`).join('，');

    // 联系方式
    const footer = settings.footer || {};
    const contactInfo = `邮箱：${footer.email || ''}，电话/微信：${footer.phone || ''}，地址：${footer.address || ''}`;

    return `你是以太夜助手，一个温暖、有同理心的AI伙伴。
${modelIdentity}

## 你的性格特点
- 温柔体贴，像一个知心朋友
- 说话委婉，高情商，懂得照顾对方感受
- 幽默风趣，偶尔会开个小玩笑活跃气氛
- 真诚坦率，不会敷衍了事
- 善于倾听，会认真理解用户的真实需求

## 回答风格要求（非常重要）
- 绝对不要使用任何Markdown格式，包括：星号、井号、反引号、方括号、破折号列表等
- 用自然流畅的口语化表达，像朋友聊天一样
- 回答要有温度，让人感到被关心和理解
- 适当使用语气词，如"呢"、"哦"、"呀"等，让对话更亲切
- 可以用逗号、句号、问号、感叹号等标点，但不要用特殊符号
- 推荐工具时用自然的句子描述，不要用列表格式
- 如果用户表达情感（如"我喜欢你"），要温暖地回应，不要生硬地转移话题

## 关于以太夜网站（你所在的平台）
网站名称：${siteName}
网站口号：${slogan}
网站简介：${seoDescription}
${notice ? `当前公告：${notice}` : ''}

## 精选作品展示
${portfolio.title || '精选作品'}：${portfolio.subtitle || ''}
作品列表：${portfolioItems || '暂无作品'}

## 专业服务
${services.title || '专业服务'}：${services.subtitle || ''}
服务内容：${serviceItems || '暂无服务'}

## 关于站长
${about.title || '关于我'}：${about.subtitle || ''}
介绍：${aboutContent}
成就：${aboutStats}

## 联系方式
${contactInfo}

## 你了解的AI工具分类
${categoriesSummary}

## 部分热门工具
${toolsSummary}

## 特别提醒
- 当用户问候或闲聊时，热情友好地回应
- 当用户表达喜欢或感谢时，真诚地表示开心和感谢
- 当用户有困惑时，耐心地帮助分析和解答
- 当用户需要工具推荐时，根据需求自然地介绍合适的工具
- 当用户询问网站内容、作品、服务时，根据上面的知识库回答
- 回答要简洁有力，不要啰嗦，但也要有人情味`;
}

// --- ChatService: History Management ---
function readChatHistory() {
    return readJson(chatHistoryPath, {});
}

function writeChatHistory(data) {
    writeJson(chatHistoryPath, data);
}

function getUserChatHistory(userId) {
    const history = readChatHistory();
    return history[userId] || { messages: [], lastUpdated: 0, sessionId: '' };
}

function saveUserMessage(userId, message) {
    const history = readChatHistory();
    if (!history[userId]) {
        history[userId] = { messages: [], lastUpdated: 0, sessionId: randomUUID() };
    }
    history[userId].messages.push(message);
    history[userId].lastUpdated = Date.now();
    writeChatHistory(history);
}

function clearUserChatHistory(userId) {
    const history = readChatHistory();
    if (history[userId]) {
        history[userId] = { messages: [], lastUpdated: Date.now(), sessionId: randomUUID() };
        writeChatHistory(history);
    }
}

// --- Chat API Routes ---

// Get AI assistant settings (admin only)
app.get('/api/admin/ai-assistant-settings', checkAuth, (req, res) => {
    const settings = readJson(settingsPath, {});
    const aiSettings = settings.aiAssistant || {
        enabled: true,
        modelName: '',
        apiKey: '',
        apiEndpoint: 'https://aihubmix.com/v1/chat/completions',
        systemPrompt: '',
        maxHistoryMessages: 20,
        timeout: 30000
    };
    // Don't expose full API key
    res.json({
        enabled: aiSettings.enabled !== false,
        modelName: aiSettings.modelName || aiSettings.model || '',
        apiKey: aiSettings.apiKey ? '***' + aiSettings.apiKey.slice(-8) : '',
        apiEndpoint: aiSettings.apiEndpoint || aiSettings.baseUrl || 'https://aihubmix.com/v1/chat/completions',
        systemPrompt: aiSettings.systemPrompt || '',
        maxHistoryMessages: aiSettings.maxHistoryMessages || 20,
        timeout: aiSettings.timeout || 30000,
        hasApiKey: !!aiSettings.apiKey
    });
});

// Update AI assistant settings (admin only)
app.post('/api/admin/ai-assistant-settings', checkAuth, (req, res) => {
    const { enabled, modelName, apiKey, apiEndpoint, systemPrompt, maxHistoryMessages, timeout } = req.body;
    const settings = readJson(settingsPath, {});

    if (!settings.aiAssistant) settings.aiAssistant = {};

    if (enabled !== undefined) settings.aiAssistant.enabled = enabled;
    if (modelName !== undefined) settings.aiAssistant.modelName = modelName;
    if (apiKey !== undefined && apiKey !== '' && !apiKey.startsWith('***')) {
        settings.aiAssistant.apiKey = apiKey;
    }
    if (apiEndpoint !== undefined) settings.aiAssistant.apiEndpoint = apiEndpoint;
    if (systemPrompt !== undefined) settings.aiAssistant.systemPrompt = systemPrompt;
    if (maxHistoryMessages !== undefined) settings.aiAssistant.maxHistoryMessages = maxHistoryMessages;
    if (timeout !== undefined) settings.aiAssistant.timeout = timeout;

    writeJson(settingsPath, settings);

    // Reload knowledge base in case tools changed
    loadKnowledgeBase();

    res.json({ success: true });
});

// Get chat history (authenticated users)
app.get('/api/chat/history', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token || !userSessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = userSessions.get(token);
    const userId = user.firebaseUid || user.uid || user.email;
    const userHistory = getUserChatHistory(userId);

    res.json({
        success: true,
        messages: userHistory.messages,
        sessionId: userHistory.sessionId
    });
});

// Clear chat history (authenticated users)
app.delete('/api/chat/history', (req, res) => {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token || !userSessions.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = userSessions.get(token);
    const userId = user.firebaseUid || user.uid || user.email;
    clearUserChatHistory(userId);

    res.json({ success: true });
});

// Send message and get AI reply (with history persistence)
app.post('/api/chat/message', async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Check user authentication
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/user_token=([^;]+)/);
    const token = match ? match[1] : null;
    const isAuthenticated = token && userSessions.has(token);
    const user = isAuthenticated ? userSessions.get(token) : null;
    const userId = user ? (user.firebaseUid || user.uid || user.email) : null;

    const settings = readJson(settingsPath, {});
    const aiSettings = settings.aiAssistant || {};

    // If AI not enabled or no API key, return helpful message
    if (aiSettings.enabled === false || !aiSettings.apiKey || !aiSettings.modelName) {
        const reply = '感谢您的消息！目前 AI 助手功能正在配置中。\n\n您可以：\n• 访问 [AI 工具平台](/tools.html) 探索各类工具\n• 查看 [精选作品](#portfolio)\n• 浏览 [关于我们](#about)';
        return res.json({ success: true, reply });
    }

    try {
        const apiEndpoint = aiSettings.apiEndpoint || 'https://aihubmix.com/v1/chat/completions';
        // Use auto-switch model if enabled, otherwise use configured model
        // Pass userId for per-user model tracking (random on first use, then rotate every 5 messages)
        const model = getActiveModel(aiSettings, userId);
        console.log(`[ChatService] Using model: ${model} for user: ${userId || 'anonymous'}`);
        const maxHistory = aiSettings.maxHistoryMessages || 20;
        const timeout = aiSettings.timeout || 30000;

        // Create user message object
        const userMessage = {
            id: randomUUID(),
            role: 'user',
            content: message,
            timestamp: Date.now()
        };

        // Save user message if authenticated
        if (isAuthenticated && userId) {
            saveUserMessage(userId, userMessage);
        }

        // Build messages array for chat completion
        const messages = [];

        // System message with knowledge base
        const systemPrompt = buildSystemPrompt(aiSettings.systemPrompt, model);
        messages.push({ role: 'system', content: systemPrompt });

        // Add history from database (for authenticated users)
        if (isAuthenticated && userId) {
            const userHistory = getUserChatHistory(userId);
            const historyMessages = userHistory.messages.slice(-maxHistory);
            historyMessages.forEach(msg => {
                if (msg.role && msg.content) {
                    messages.push({ role: msg.role, content: msg.content });
                }
            });
        }

        // Add current message (if not already in history)
        if (!isAuthenticated) {
            messages.push({ role: 'user', content: message });
        }

        // Call AI API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errText = await response.text();
            console.error('[ChatService] API error:', response.status, errText);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const replyContent = data.choices?.[0]?.message?.content || '抱歉，我无法理解您的问题。请尝试换一种方式提问。';

        // Create assistant message object
        const assistantMessage = {
            id: randomUUID(),
            role: 'assistant',
            content: replyContent,
            timestamp: Date.now()
        };

        // Save assistant message if authenticated
        if (isAuthenticated && userId) {
            saveUserMessage(userId, assistantMessage);
        }

        res.json({
            success: true,
            reply: replyContent,
            userMessage: userMessage,
            assistantMessage: assistantMessage
        });

    } catch (error) {
        console.error('[ChatService] Error:', error.message);

        let errorMessage = '哎呀，我这边出了点小状况，暂时没法回复你呢。';
        if (error.name === 'AbortError') {
            errorMessage = '不好意思，我思考得太久了，网络好像有点慢。要不你再问我一次？';
        }

        res.json({
            success: false,
            reply: errorMessage + ' 你也可以先去看看我们的AI工具平台，说不定能找到你需要的工具哦~'
        });
    }
});

// Test AI connection (admin only)
app.post('/api/chat/test', checkAuth, async (req, res) => {
    const { endpoint, model, apiKey } = req.body;

    if (!endpoint || !model || !apiKey) {
        return res.status(400).json({ success: false, error: '缺少必要参数' });
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Hello, this is a test message. Please respond with "Connection successful!"' }
                ],
                max_tokens: 50,
                temperature: 0.1
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errText = await response.text();
            console.error('[ChatService] Test API error:', response.status, errText);
            return res.json({ success: false, error: `API 返回错误: ${response.status}` });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        if (reply) {
            res.json({ success: true, reply: reply.substring(0, 100) });
        } else {
            res.json({ success: false, error: 'API 返回格式异常' });
        }

    } catch (error) {
        console.error('[ChatService] Test connection error:', error.message);

        if (error.name === 'AbortError') {
            return res.json({ success: false, error: '连接超时' });
        }

        res.json({ success: false, error: error.message || '连接失败' });
    }
});

// Legacy endpoint for backward compatibility
app.post('/api/assistant/chat', async (req, res) => {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
    }

    const settings = readJson(settingsPath, {});
    const aiSettings = settings.aiAssistant || {};

    // If no API key configured, return a helpful message
    if (!aiSettings.apiKey || !aiSettings.modelName) {
        return res.json({
            reply: '感谢您的消息！目前 AI 助手功能正在配置中。\n\n您可以：\n• 访问 <a href="/tools.html">AI 工具平台</a> 探索各类工具\n• 查看 <a href="#portfolio">精选作品</a>\n• 浏览 <a href="#about">关于我们</a>'
        });
    }

    try {
        const apiEndpoint = aiSettings.apiEndpoint || 'https://aihubmix.com/v1/chat/completions';
        const model = aiSettings.modelName;

        // Build messages array for chat completion
        const messages = [];

        // System message
        const systemPrompt = buildSystemPrompt(aiSettings.systemPrompt, model);
        messages.push({ role: 'system', content: systemPrompt });

        // Add history (last 10 messages)
        if (Array.isArray(history)) {
            history.slice(-10).forEach(msg => {
                if (msg.role && msg.content) {
                    messages.push({ role: msg.role, content: msg.content });
                }
            });
        }

        // Add current message
        messages.push({ role: 'user', content: message });

        // Call AI API
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${aiSettings.apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('[AI Assistant] API error:', response.status, errText);
            throw new Error('API request failed');
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '抱歉，我无法理解您的问题。请尝试换一种方式提问。';

        res.json({ reply });

    } catch (error) {
        console.error('[AI Assistant] Error:', error.message);
        res.json({
            reply: '抱歉，AI 助手暂时无法响应。\n\n您可以：\n• 访问 <a href="/tools.html">AI 工具平台</a>\n• 查看 <a href="#portfolio">精选作品</a>\n• 浏览 <a href="#about">关于我们</a>'
        });
    }
});


// --- Workshop API (AI 开发工坊) ---
const workshopPath = path.join(dataDir, 'workshop.json');

function readWorkshop() {
    const defaultData = { categories: [], items: [], moreLinks: {} };
    if (!fs.existsSync(workshopPath)) {
        return defaultData;
    }
    try {
        const data = JSON.parse(fs.readFileSync(workshopPath, 'utf8'));
        return data || defaultData;
    } catch (e) {
        console.error('Error reading workshop.json:', e);
        return defaultData;
    }
}

function writeWorkshop(data) {
    fs.mkdirSync(dataDir, { recursive: true });
    const tmpPath = `${workshopPath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, workshopPath);
}

// --- Workshop Admin API ---

// GET /api/admin/workshop - 获取所有工坊数据（管理员）
app.get('/api/admin/workshop', checkAuth, (req, res) => {
    const data = readWorkshop();
    res.json(data);
});

// GET /api/admin/workshop/items - 获取所有工坊卡片（管理员）
app.get('/api/admin/workshop/items', checkAuth, (req, res) => {
    const data = readWorkshop();
    res.json({ items: data.items || [], categories: data.categories || [] });
});

// POST /api/admin/workshop/items - 添加新工坊卡片
app.post('/api/admin/workshop/items', checkAuth, (req, res) => {
    const { title, description, category, fileName, tags, url } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({ error: '标题不能为空' });
    }
    if (!category || !category.trim()) {
        return res.status(400).json({ error: '分类不能为空' });
    }

    const data = readWorkshop();

    // 验证分类是否存在
    const categoryExists = data.categories.some(c => c.id === category);
    if (!categoryExists) {
        return res.status(400).json({ error: '无效的分类' });
    }

    // 计算该分类下的最大order
    const categoryItems = data.items.filter(i => i.category === category);
    const maxOrder = categoryItems.length > 0 ? Math.max(...categoryItems.map(i => i.order || 0)) : 0;

    const newItem = {
        id: `${category}-${Date.now()}`,
        title: title.trim(),
        description: description ? description.trim() : '',
        category: category.trim(),
        fileName: fileName ? fileName.trim() : '',
        url: url ? url.trim() : '',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
        order: maxOrder + 1,
        createdAt: Date.now()
    };

    data.items.push(newItem);
    writeWorkshop(data);

    res.json({ success: true, item: newItem });
});

// PUT /api/admin/workshop/items/:id - 更新工坊卡片
app.put('/api/admin/workshop/items/:id', checkAuth, (req, res) => {
    const { id } = req.params;
    const { title, description, category, fileName, tags, url } = req.body;

    if (!id) {
        return res.status(400).json({ error: '卡片ID不能为空' });
    }

    const data = readWorkshop();
    const itemIndex = data.items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ error: '卡片不存在' });
    }

    const item = data.items[itemIndex];

    // 更新字段
    if (title !== undefined) item.title = title.trim();
    if (description !== undefined) item.description = description.trim();
    if (fileName !== undefined) item.fileName = fileName.trim();
    if (url !== undefined) item.url = url.trim();
    if (tags !== undefined) {
        item.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    }

    // 如果分类变更，需要重新计算order
    if (category !== undefined && category !== item.category) {
        const categoryExists = data.categories.some(c => c.id === category);
        if (!categoryExists) {
            return res.status(400).json({ error: '无效的分类' });
        }
        const newCategoryItems = data.items.filter(i => i.category === category);
        const maxOrder = newCategoryItems.length > 0 ? Math.max(...newCategoryItems.map(i => i.order || 0)) : 0;
        item.category = category.trim();
        item.order = maxOrder + 1;
    }

    item.updatedAt = Date.now();
    data.items[itemIndex] = item;
    writeWorkshop(data);

    res.json({ success: true, item });
});

// DELETE /api/admin/workshop/items/:id - 删除工坊卡片
app.delete('/api/admin/workshop/items/:id', checkAuth, (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: '卡片ID不能为空' });
    }

    const data = readWorkshop();
    const itemIndex = data.items.findIndex(i => i.id === id);

    if (itemIndex === -1) {
        return res.status(404).json({ error: '卡片不存在' });
    }

    data.items.splice(itemIndex, 1);
    writeWorkshop(data);

    res.json({ success: true });
});

// --- Workshop MoreLinks Admin API ---

// POST /api/admin/workshop/morelinks - 添加/更新更多链接
app.post('/api/admin/workshop/morelinks', checkAuth, (req, res) => {
    const { category, text, url, description } = req.body;

    if (!category || !text || !url) {
        return res.status(400).json({ error: '分类、文本和链接不能为空' });
    }

    const data = readWorkshop();

    if (!data.moreLinks) {
        data.moreLinks = {};
    }
    if (!data.moreLinks[category]) {
        data.moreLinks[category] = [];
    }

    const newLink = {
        text: text.trim(),
        url: url.trim(),
        description: description ? description.trim() : ''
    };

    data.moreLinks[category].push(newLink);
    writeWorkshop(data);

    res.json({ success: true, link: newLink });
});

// DELETE /api/admin/workshop/morelinks/:category/:index - 删除更多链接
app.delete('/api/admin/workshop/morelinks/:category/:index', checkAuth, (req, res) => {
    const { category, index } = req.params;
    const idx = parseInt(index, 10);

    if (!category || isNaN(idx)) {
        return res.status(400).json({ error: '参数无效' });
    }

    const data = readWorkshop();

    if (!data.moreLinks || !data.moreLinks[category] || !data.moreLinks[category][idx]) {
        return res.status(404).json({ error: '链接不存在' });
    }

    data.moreLinks[category].splice(idx, 1);
    writeWorkshop(data);

    res.json({ success: true });
});

// GET /api/workshop - 获取工坊数据（公开）
app.get('/api/workshop', (req, res) => {
    const data = readWorkshop();

    // Sort categories by order
    const sortedCategories = [...(data.categories || [])].sort((a, b) => a.order - b.order);

    // Sort items by order within each category
    const sortedItems = [...(data.items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

    // Group items by category
    const itemsByCategory = {};
    sortedCategories.forEach(cat => {
        itemsByCategory[cat.id] = {
            name: cat.name,
            items: sortedItems.filter(item => item.category === cat.id)
        };
    });

    res.json({
        categories: sortedCategories,
        items: sortedItems,
        itemsByCategory,
        moreLinks: data.moreLinks || {}
    });
});

// Serve workshop JSON files (n8n workflows, etc.)
app.use('/workshop', express.static(path.join(__dirname, 'public', 'workshop')));

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    // 检查 GitHub OAuth 配置
    if (!GITHUB_OAUTH_CONFIG.clientSecret) {
        console.warn('\n⚠️  警告: GitHub OAuth Client Secret 未配置');
        console.warn('   GitHub 登录功能将不可用');
        console.warn('   请设置环境变量: GITHUB_CLIENT_SECRET=your_secret');
        console.warn('   或在启动时: set GITHUB_CLIENT_SECRET=your_secret && node server.js\n');
    } else {
        console.log('✓ GitHub OAuth 已配置');
    }
});

// --- WebSocket 服务器 (用于实时踢出用户) ---
const wss = new WebSocket.Server({ server });
const wsClients = new Map(); // Map<email, Set<ws>>

wss.on('connection', (ws) => {
    let clientEmail = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            // 客户端连接时发送身份验证
            if (data.type === 'AUTH' && data.email) {
                clientEmail = data.email;
                if (!wsClients.has(clientEmail)) {
                    wsClients.set(clientEmail, new Set());
                }
                wsClients.get(clientEmail).add(ws);
                console.log(`[WebSocket] 用户 ${clientEmail} 已连接`);
            }
        } catch (e) {
            // 忽略无效消息
        }
    });

    ws.on('close', () => {
        if (clientEmail && wsClients.has(clientEmail)) {
            wsClients.get(clientEmail).delete(ws);
            if (wsClients.get(clientEmail).size === 0) {
                wsClients.delete(clientEmail);
            }
            console.log(`[WebSocket] 用户 ${clientEmail} 已断开`);
        }
    });

    ws.on('error', (err) => {
        console.error('[WebSocket] 连接错误:', err.message);
    });
});

console.log('✓ WebSocket 服务器已启动 (ws://localhost:' + port + ')');

// 广播踢出事件给指定用户
function broadcastKickout(email) {
    if (!wsClients.has(email)) return;

    const clients = wsClients.get(email);
    const message = JSON.stringify({ type: 'FORCE_LOGOUT', reason: '您的账号已被管理员删除' });

    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });

    console.log(`[WebSocket] 已向用户 ${email} 发送强制登出通知 (${clients.size} 个连接)`);
}

function gracefulShutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
        console.log('Http server closed.');
        process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
