# AI Skill 数据模型规范

## 概述

本文档定义了 AI Skill 组件库的完整数据模型，包括所有字段定义、类型约束和验证规则。

## Skill 数据模型

### 完整 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "id",
    "name",
    "slug",
    "description",
    "category",
    "platforms",
    "languages",
    "lastUpdated"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "唯一标识符",
      "pattern": "^skill-[a-z0-9-]+$",
      "example": "skill-nextjs-15-react-19"
    },
    "name": {
      "type": "string",
      "description": "Skill 名称",
      "minLength": 3,
      "maxLength": 100,
      "example": "Next.js 15 + React 19 Full Stack"
    },
    "slug": {
      "type": "string",
      "description": "URL 友好的标识符",
      "pattern": "^[a-z0-9-]+$",
      "example": "nextjs-15-react-19-fullstack"
    },
    "description": {
      "type": "string",
      "description": "简短描述（用于卡片显示）",
      "minLength": 10,
      "maxLength": 150,
      "example": "完整的 Next.js 15 开发规范，集成 React 19、Tailwind CSS、TypeScript"
    },
    "longDescription": {
      "type": "string",
      "description": "完整描述（用于详情页）",
      "minLength": 50,
      "maxLength": 2000,
      "example": "这是一个全面的 Next.js 15 开发配置，包含最佳实践、代码规范、性能优化建议..."
    },
    "category": {
      "type": "string",
      "description": "主分类",
      "enum": [
        "frontend",
        "backend",
        "fullstack",
        "mobile",
        "database",
        "ai-ml",
        "devops",
        "testing",
        "blockchain",
        "tools",
        "platform-specific"
      ]
    },
    "subCategory": {
      "type": "string",
      "description": "子分类",
      "example": "react"
    },
    "tags": {
      "type": "array",
      "description": "标签数组（用于搜索和筛选）",
      "items": {
        "type": "string",
        "minLength": 2,
        "maxLength": 30
      },
      "minItems": 1,
      "maxItems": 20,
      "example": ["nextjs", "react", "typescript", "tailwind", "fullstack"]
    },
    "platforms": {
      "type": "array",
      "description": "支持的平台数组",
      "items": {
        "type": "string",
        "enum": ["cursor", "kiro", "claude", "windsurf", "copilot"]
      },
      "minItems": 1,
      "uniqueItems": true,
      "example": ["cursor", "kiro", "windsurf"]
    },
    "languages": {
      "type": "array",
      "description": "编程语言/技术栈数组",
      "items": {
        "type": "string",
        "minLength": 2,
        "maxLength": 30
      },
      "minItems": 1,
      "maxItems": 10,
      "example": ["typescript", "javascript", "tsx", "css"]
    },
    "complexity": {
      "type": "string",
      "description": "复杂度级别",
      "enum": ["beginner", "intermediate", "advanced"],
      "default": "intermediate"
    },
    "author": {
      "type": "object",
      "description": "作者信息",
      "properties": {
        "name": {
          "type": "string",
          "description": "作者名称"
        },
        "github": {
          "type": "string",
          "description": "GitHub 用户名"
        },
        "url": {
          "type": "string",
          "format": "uri",
          "description": "作者主页 URL"
        }
      }
    },
    "source": {
      "type": "string",
      "description": "来源仓库名称",
      "example": "awesome-cursorrules"
    },
    "sourceRepo": {
      "type": "string",
      "format": "uri",
      "description": "来源仓库 URL",
      "example": "https://github.com/awesome/cursorrules"
    },
    "lastUpdated": {
      "type": "string",
      "format": "date-time",
      "description": "最后更新时间（ISO 8601 格式）",
      "example": "2025-01-10T08:00:00Z"
    },
    "usageType": {
      "type": "string",
      "description": "使用类型",
      "enum": ["prompt", "instruction", "code-template", "workflow", "config"],
      "example": "code-template"
    },
    "stats": {
      "type": "object",
      "description": "统计信息",
      "properties": {
        "stars": {
          "type": "integer",
          "minimum": 0,
          "description": "星标数"
        },
        "downloads": {
          "type": "integer",
          "minimum": 0,
          "description": "下载次数"
        },
        "views": {
          "type": "integer",
          "minimum": 0,
          "description": "浏览次数"
        }
      }
    },
    "files": {
      "type": "array",
      "description": "文件列表",
      "items": {
        "type": "object",
        "required": ["name", "type", "path"],
        "properties": {
          "name": {
            "type": "string",
            "description": "文件名"
          },
          "type": {
            "type": "string",
            "description": "文件类型",
            "enum": ["cursorrules", "steering", "skill", "readme", "config", "other"]
          },
          "size": {
            "type": "integer",
            "minimum": 0,
            "description": "文件大小（字节）"
          },
          "path": {
            "type": "string",
            "description": "文件路径"
          }
        }
      }
    },
    "readme": {
      "type": "string",
      "description": "README 文件路径",
      "example": "/skills/frontend/nextjs-15/README.md"
    },
    "featured": {
      "type": "boolean",
      "description": "是否为推荐 Skill",
      "default": false
    },
    "popular": {
      "type": "boolean",
      "description": "是否为热门 Skill",
      "default": false
    }
  }
}
```

## 字段详细说明

### 必需字段

| 字段 | 类型 | 说明 | 验证规则 |
|------|------|------|----------|
| `id` | string | 唯一标识符 | 格式: `skill-[a-z0-9-]+` |
| `name` | string | Skill 名称 | 长度: 3-100 字符 |
| `slug` | string | URL 友好标识符 | 格式: `[a-z0-9-]+` |
| `description` | string | 简短描述 | 长度: 10-150 字符 |
| `category` | string | 主分类 | 枚举值（见下方） |
| `platforms` | array | 支持的平台 | 至少 1 个，不重复 |
| `languages` | array | 技术栈 | 至少 1 个，最多 10 个 |
| `lastUpdated` | string | 最后更新时间 | ISO 8601 格式 |

### 可选字段

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `longDescription` | string | 完整描述 | - |
| `subCategory` | string | 子分类 | - |
| `tags` | array | 标签 | [] |
| `complexity` | string | 复杂度 | "intermediate" |
| `author` | object | 作者信息 | {} |
| `source` | string | 来源名称 | - |
| `sourceRepo` | string | 来源 URL | - |
| `usageType` | string | 使用类型 | - |
| `stats` | object | 统计信息 | {} |
| `files` | array | 文件列表 | [] |
| `readme` | string | README 路径 | - |
| `featured` | boolean | 是否推荐 | false |
| `popular` | boolean | 是否热门 | false |

## 枚举值定义

### category（主分类）

```javascript
const CATEGORIES = {
  frontend: '前端开发',
  backend: '后端开发',
  fullstack: '全栈开发',
  mobile: '移动开发',
  database: '数据库与API',
  'ai-ml': 'AI/ML开发',
  devops: 'DevOps与部署',
  testing: '测试与质量',
  blockchain: '区块链开发',
  tools: '工具与实用',
  'platform-specific': '特定平台'
};
```

### platforms（平台）

```javascript
const PLATFORMS = {
  cursor: 'Cursor',
  kiro: 'Kiro',
  claude: 'Claude',
  windsurf: 'Windsurf',
  copilot: 'GitHub Copilot'
};
```

### complexity（复杂度）

```javascript
const COMPLEXITY = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级'
};
```

### usageType（使用类型）

```javascript
const USAGE_TYPES = {
  prompt: '提示词',
  instruction: '指令集',
  'code-template': '代码模板',
  workflow: '工作流',
  config: '配置文件'
};
```

## 数据示例

### 完整示例

```json
{
  "id": "skill-nextjs-15-react-19",
  "name": "Next.js 15 + React 19 Full Stack",
  "slug": "nextjs-15-react-19-fullstack",
  "description": "完整的 Next.js 15 开发规范，集成 React 19、Tailwind CSS、TypeScript",
  "longDescription": "这是一个全面的 Next.js 15 开发配置，包含最佳实践、代码规范、性能优化建议。支持 React 19 新特性、Tailwind CSS 样式系统、TypeScript 类型安全。适合构建现代化的全栈 Web 应用。",
  "category": "frontend",
  "subCategory": "react",
  "tags": ["nextjs", "react", "typescript", "tailwind", "fullstack", "ssr", "app-router"],
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
    },
    {
      "name": "README.md",
      "type": "readme",
      "size": 1024,
      "path": "/skills/frontend/nextjs-15/README.md"
    }
  ],
  "readme": "/skills/frontend/nextjs-15/README.md",
  "featured": true,
  "popular": true
}
```

### 最小示例

```json
{
  "id": "skill-python-fastapi",
  "name": "FastAPI Best Practices",
  "slug": "python-fastapi-best-practices",
  "description": "FastAPI 开发最佳实践和代码规范",
  "category": "backend",
  "platforms": ["cursor", "claude"],
  "languages": ["python"],
  "lastUpdated": "2025-01-10T08:00:00Z"
}
```

## 验证规则

### ID 生成规则

```javascript
function generateSkillId(name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return `skill-${slug}`;
}
```

### Slug 生成规则

```javascript
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

### 数据完整性检查

```javascript
function validateSkill(skill) {
  const errors = [];
  
  // 必需字段检查
  const required = ['id', 'name', 'slug', 'description', 'category', 'platforms', 'languages', 'lastUpdated'];
  for (const field of required) {
    if (!skill[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // ID 格式检查
  if (skill.id && !/^skill-[a-z0-9-]+$/.test(skill.id)) {
    errors.push('Invalid ID format');
  }
  
  // Slug 格式检查
  if (skill.slug && !/^[a-z0-9-]+$/.test(skill.slug)) {
    errors.push('Invalid slug format');
  }
  
  // 描述长度检查
  if (skill.description && (skill.description.length < 10 || skill.description.length > 150)) {
    errors.push('Description must be 10-150 characters');
  }
  
  // 分类检查
  const validCategories = ['frontend', 'backend', 'fullstack', 'mobile', 'database', 'ai-ml', 'devops', 'testing', 'blockchain', 'tools', 'platform-specific'];
  if (skill.category && !validCategories.includes(skill.category)) {
    errors.push('Invalid category');
  }
  
  // 平台检查
  const validPlatforms = ['cursor', 'kiro', 'claude', 'windsurf', 'copilot'];
  if (skill.platforms) {
    if (!Array.isArray(skill.platforms) || skill.platforms.length === 0) {
      errors.push('Platforms must be a non-empty array');
    }
    for (const platform of skill.platforms) {
      if (!validPlatforms.includes(platform)) {
        errors.push(`Invalid platform: ${platform}`);
      }
    }
  }
  
  // 语言检查
  if (skill.languages) {
    if (!Array.isArray(skill.languages) || skill.languages.length === 0) {
      errors.push('Languages must be a non-empty array');
    }
  }
  
  // 日期格式检查
  if (skill.lastUpdated && isNaN(Date.parse(skill.lastUpdated))) {
    errors.push('Invalid lastUpdated date format');
  }
  
  return errors;
}
```

## 数据迁移指南

### 从旧格式迁移

如果现有数据缺少新字段，使用以下默认值：

```javascript
function migrateSkill(oldSkill) {
  return {
    ...oldSkill,
    longDescription: oldSkill.longDescription || oldSkill.description,
    languages: oldSkill.languages || [],
    complexity: oldSkill.complexity || 'intermediate',
    sourceRepo: oldSkill.sourceRepo || '',
    lastUpdated: oldSkill.lastUpdated || new Date().toISOString(),
    usageType: oldSkill.usageType || 'code-template',
    stats: oldSkill.stats || { stars: 0, downloads: 0, views: 0 },
    files: oldSkill.files || [],
    featured: oldSkill.featured || false,
    popular: oldSkill.popular || false
  };
}
```

## 性能优化建议

1. **索引字段**: `id`, `slug`, `category`, `platforms`, `languages`
2. **缓存策略**: 缓存完整 skills.json 30 分钟
3. **分页加载**: 每页 20 条记录
4. **搜索优化**: 对 `name`, `description`, `tags`, `languages` 建立全文索引

## 版本历史

- **v1.0** (2025-01-11): 初始版本，包含所有核心字段
