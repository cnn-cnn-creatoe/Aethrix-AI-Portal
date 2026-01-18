# AI Skill API 规范文档

## 概述

本文档定义了 AI Skill 组件库的完整 API 接口规范，包括所有端点、请求/响应格式、错误处理和缓存策略。

## 基础信息

- **Base URL**: `http://localhost:4005` (开发环境)
- **Base URL**: `https://skill.cdproveai.com` (生产环境)
- **API 版本**: v1
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用规范

### 请求头

```http
Content-Type: application/json
Accept: application/json
```

### 响应格式

#### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

#### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 错误代码

| 错误代码 | HTTP 状态码 | 说明 |
|---------|------------|------|
| `INVALID_REQUEST` | 400 | 请求参数无效 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `SERVER_ERROR` | 500 | 服务器内部错误 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `FILE_NOT_FOUND` | 404 | 文件不存在 |
| `INVALID_CATEGORY` | 400 | 无效的分类 |
| `INVALID_PLATFORM` | 400 | 无效的平台 |

## API 端点

### 1. 获取 Skills 列表

获取 Skills 列表，支持分页、筛选、搜索和排序。

**端点**: `GET /api/skills`

**查询参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `page` | integer | 否 | 1 | 页码（从 1 开始） |
| `per_page` | integer | 否 | 20 | 每页数量（1-100） |
| `category` | string | 否 | - | 分类筛选 |
| `platform` | string | 否 | - | 平台筛选（可多选，逗号分隔） |
| `languages` | string | 否 | - | 技术栈筛选（可多选，逗号分隔） |
| `complexity` | string | 否 | - | 复杂度筛选 |
| `sort` | string | 否 | latest | 排序方式（latest/popular/random） |
| `q` | string | 否 | - | 搜索关键词 |

**请求示例**:

```http
GET /api/skills?category=frontend&platform=cursor&page=1&per_page=20
GET /api/skills?platform=cursor,kiro&languages=typescript&sort=popular
GET /api/skills?q=nextjs&sort=latest
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "skill-nextjs-15-react-19",
        "name": "Next.js 15 + React 19 Full Stack",
        "slug": "nextjs-15-react-19-fullstack",
        "description": "完整的 Next.js 15 开发规范，集成 React 19、Tailwind CSS、TypeScript",
        "category": "frontend",
        "subCategory": "react",
        "tags": ["nextjs", "react", "typescript"],
        "platforms": ["cursor", "kiro", "windsurf"],
        "languages": ["typescript", "javascript"],
        "complexity": "intermediate",
        "stats": {
          "stars": 1234,
          "downloads": 5678
        },
        "featured": true,
        "popular": true,
        "lastUpdated": "2025-01-10T08:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "category": "frontend",
      "platform": ["cursor"],
      "languages": [],
      "complexity": null,
      "sort": "latest",
      "q": null
    }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 2. 获取 Skill 详情

获取单个 Skill 的完整信息。

**端点**: `GET /api/skills/:id`

**路径参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | string | 是 | Skill ID 或 slug |

**请求示例**:

```http
GET /api/skills/skill-nextjs-15-react-19
GET /api/skills/nextjs-15-react-19-fullstack
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "id": "skill-nextjs-15-react-19",
    "name": "Next.js 15 + React 19 Full Stack",
    "slug": "nextjs-15-react-19-fullstack",
    "description": "完整的 Next.js 15 开发规范，集成 React 19、Tailwind CSS、TypeScript",
    "longDescription": "这是一个全面的 Next.js 15 开发配置，包含最佳实践、代码规范、性能优化建议...",
    "category": "frontend",
    "subCategory": "react",
    "tags": ["nextjs", "react", "typescript", "tailwind", "fullstack"],
    "platforms": ["cursor", "kiro", "windsurf"],
    "languages": ["typescript", "javascript", "tsx", "css"],
    "complexity": "intermediate",
    "author": {
      "name": "John Doe",
      "github": "johndoe",
      "url": "https://github.com/johndoe"
    },
    "source": "awesome-cursorrules",
    "sourceRepo": "https://github.com/awesome/cursorrules",
    "lastUpdated": "2025-01-10T08:00:00Z",
    "usageType": "code-template",
    "stats": {
      "stars": 1234,
      "downloads": 5678,
      "views": 12345
    },
    "files": [
      {
        "name": ".cursorrules",
        "type": "cursorrules",
        "size": 4096,
        "path": "/skills/frontend/nextjs-15/.cursorrules"
      },
      {
        "name": "steering.md",
        "type": "steering",
        "size": 2048,
        "path": "/skills/frontend/nextjs-15/steering.md"
      }
    ],
    "readme": "/skills/frontend/nextjs-15/README.md",
    "featured": true,
    "popular": true
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 3. 搜索 Skills

搜索 Skills（支持名称、描述、标签、语言）。

**端点**: `GET /api/skills/search`

**查询参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `q` | string | 是 | - | 搜索关键词 |
| `page` | integer | 否 | 1 | 页码 |
| `per_page` | integer | 否 | 20 | 每页数量 |
| `category` | string | 否 | - | 分类筛选 |
| `platform` | string | 否 | - | 平台筛选 |

**请求示例**:

```http
GET /api/skills/search?q=nextjs
GET /api/skills/search?q=typescript&category=frontend
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "query": "nextjs",
    "results": [
      {
        "id": "skill-nextjs-15-react-19",
        "name": "Next.js 15 + React 19 Full Stack",
        "description": "完整的 Next.js 15 开发规范...",
        "category": "frontend",
        "platforms": ["cursor", "kiro"],
        "languages": ["typescript"],
        "relevance": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 15,
      "total_pages": 1
    }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 4. 下载 Skill 文件

下载 Skill 的特定文件。

**端点**: `GET /api/skills/:id/download`

**路径参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | string | 是 | Skill ID 或 slug |

**查询参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `file` | string | 是 | 文件名（如 .cursorrules） |

**请求示例**:

```http
GET /api/skills/skill-nextjs-15-react-19/download?file=.cursorrules
GET /api/skills/nextjs-15-react-19-fullstack/download?file=steering.md
```

**响应**:

- **成功**: 返回文件内容（Content-Type: text/plain 或 application/octet-stream）
- **失败**: 返回 JSON 错误响应

**响应头**:

```http
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename=".cursorrules"
Content-Length: 4096
Cache-Control: public, max-age=3600
```

### 5. 下载所有文件（ZIP）

下载 Skill 的所有文件打包为 ZIP。

**端点**: `GET /api/skills/:id/download-all`

**路径参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `id` | string | 是 | Skill ID 或 slug |

**请求示例**:

```http
GET /api/skills/skill-nextjs-15-react-19/download-all
```

**响应头**:

```http
Content-Type: application/zip
Content-Disposition: attachment; filename="nextjs-15-react-19-fullstack.zip"
Content-Length: 8192
```

### 6. 获取分类统计

获取所有分类的统计信息。

**端点**: `GET /api/categories`

**请求示例**:

```http
GET /api/categories
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "frontend",
        "name": "前端开发",
        "count": 45,
        "icon": "💻"
      },
      {
        "id": "backend",
        "name": "后端开发",
        "count": 38,
        "icon": "⚙️"
      },
      {
        "id": "fullstack",
        "name": "全栈开发",
        "count": 25,
        "icon": "🚀"
      }
    ],
    "total": 150
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 7. 获取平台统计

获取所有平台的统计信息。

**端点**: `GET /api/platforms`

**请求示例**:

```http
GET /api/platforms
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "id": "cursor",
        "name": "Cursor",
        "count": 120,
        "icon": "💻"
      },
      {
        "id": "kiro",
        "name": "Kiro",
        "count": 85,
        "icon": "🤖"
      }
    ],
    "total": 150
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 8. 获取技术栈列表

获取所有可用的技术栈/语言列表。

**端点**: `GET /api/languages`

**请求示例**:

```http
GET /api/languages
```

**响应示例**:

```json
{
  "success": true,
  "data": {
    "languages": [
      {
        "name": "typescript",
        "count": 95,
        "category": "frontend"
      },
      {
        "name": "python",
        "count": 78,
        "category": "backend"
      }
    ],
    "total": 45
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

## 筛选逻辑

### 组合筛选规则

当多个筛选条件同时存在时，使用 **AND** 逻辑：

```
结果 = Skills WHERE 
  (category = 'frontend') AND 
  (platform IN ['cursor', 'kiro']) AND 
  (languages CONTAINS 'typescript')
```

**示例**:

```http
GET /api/skills?category=frontend&platform=cursor,kiro&languages=typescript
```

返回：同时满足以下条件的 Skills
- 分类是 frontend
- 平台包含 cursor 或 kiro
- 技术栈包含 typescript

### 排序规则

| 排序方式 | 说明 | 排序字段 |
|---------|------|---------|
| `latest` | 最新更新 | `lastUpdated DESC` |
| `popular` | 最受欢迎 | `stats.downloads DESC, stats.stars DESC` |
| `random` | 随机探索 | `RANDOM()` |

## 缓存策略

### 客户端缓存（sessionStorage）

```javascript
const CACHE_CONFIG = {
  // 缓存键前缀
  prefix: 'skill_cache_',
  
  // 缓存时间（毫秒）
  ttl: 30 * 60 * 1000, // 30 分钟
  
  // 缓存的端点
  endpoints: [
    '/api/skills',
    '/api/skills/:id',
    '/api/categories',
    '/api/platforms',
    '/api/languages'
  ]
};
```

### 服务器端缓存头

```http
Cache-Control: public, max-age=1800
ETag: "abc123"
Last-Modified: Wed, 10 Jan 2025 08:00:00 GMT
```

## 性能优化

### 分页建议

- 默认每页 20 条
- 最大每页 100 条
- 使用 `page` 和 `per_page` 参数

### 请求频率限制

- 每个 IP 每分钟最多 60 次请求
- 超限返回 429 状态码
- 响应头包含限制信息：

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1641902400
```

### 响应压缩

服务器支持 gzip 压缩：

```http
Accept-Encoding: gzip, deflate
```

## CORS 配置

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
Access-Control-Max-Age: 86400
```

## 错误处理示例

### 404 - 资源不存在

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Skill 不存在",
    "details": {
      "id": "skill-invalid-id"
    }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 400 - 无效参数

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "无效的分类参数",
    "details": {
      "parameter": "category",
      "value": "invalid-category",
      "valid_values": ["frontend", "backend", "fullstack", ...]
    }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

### 500 - 服务器错误

```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "服务器内部错误",
    "details": {
      "request_id": "req_abc123"
    }
  },
  "meta": {
    "timestamp": "2025-01-11T10:00:00Z",
    "version": "1.0"
  }
}
```

## 测试端点

### Health Check

**端点**: `GET /api/health`

**响应**:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0",
    "uptime": 3600,
    "skills_count": 150
  }
}
```

## 版本历史

- **v1.0** (2025-01-11): 初始版本，包含所有核心端点
