#!/usr/bin/env python3
"""
Prompt Workshop API Server

Flask 后端服务器，提供提示词工具和模板数据的 RESTful API
端口: 4006
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
from pathlib import Path
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # 启用 CORS

# 配置
app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False

# ============================================================================
# 工具数据 (Tools)
# ============================================================================

TOOLS_DATA = [
    {
        "id": "prompt-optimizer",
        "name": "Prompt Optimizer",
        "nameZh": "提示词优化器",
        "description": "AI 智能优化提示词，支持 Web/桌面/Chrome 插件，多模型集成",
        "url": "https://github.com/linshenkx/prompt-optimizer",
        "icon": "settings",
        "color": "green",
        "tags": ["开源", "免费", "多模型"],
        "category": "generator",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "langgpt",
        "name": "LangGPT",
        "nameZh": "结构化提示词",
        "description": "让人人都能写出专业提示词的框架，提供结构化模板",
        "url": "https://github.com/langgptai/LangGPT",
        "icon": "file-text",
        "color": "blue",
        "tags": ["开源", "框架", "教程"],
        "category": "generator",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "clip-interrogator",
        "name": "CLIP Interrogator",
        "nameZh": "图片反推提示词",
        "description": "上传图片自动生成 AI 绘画提示词，完全免费无限制",
        "url": "https://huggingface.co/spaces/pharmapsychotic/CLIP-Interrogator",
        "icon": "image",
        "color": "pink",
        "tags": ["免费", "图片", "SD"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "flowgpt",
        "name": "FlowGPT",
        "nameZh": "提示词社区",
        "description": "全球最大的 ChatGPT 提示词分享社区，海量优质内容",
        "url": "https://flowgpt.com/",
        "icon": "globe",
        "color": "purple",
        "tags": ["社区", "免费", "海量"],
        "category": "community",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "prompthero",
        "name": "PromptHero",
        "nameZh": "AI 艺术提示词库",
        "description": "高质量 AI 艺术作品及提示词搜索，分类清晰",
        "url": "https://prompthero.com/",
        "icon": "palette",
        "color": "orange",
        "tags": ["艺术", "搜索", "灵感"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "lexica",
        "name": "Lexica",
        "nameZh": "SD 图库搜索",
        "description": "Stable Diffusion 图片和提示词搜索引擎，海量图库",
        "url": "https://lexica.art/",
        "icon": "search",
        "color": "green",
        "tags": ["搜索", "SD", "免费"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "clickprompt",
        "name": "ClickPrompt",
        "nameZh": "一键提示词",
        "description": "一键查看、分享和运行提示词的开源工具",
        "url": "https://github.com/prompt-engineering/click-prompt",
        "icon": "mouse-pointer-click",
        "color": "blue",
        "tags": ["开源", "可视化", "分享"],
        "category": "generator",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "sd-prompt-reader",
        "name": "SD Prompt Reader",
        "nameZh": "提示词读取器",
        "description": "读取 AI 图片内嵌的提示词元数据，支持本地运行",
        "url": "https://github.com/receyuki/stable-diffusion-prompt-reader",
        "icon": "eye",
        "color": "orange",
        "tags": ["开源", "本地", "元数据"],
        "category": "image",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "openprompt",
        "name": "OpenPrompt",
        "nameZh": "开源提示词库",
        "description": "开源提示词分享平台，社区贡献",
        "url": "https://github.com/timqian/openprompt.co",
        "icon": "book-open",
        "color": "purple",
        "tags": ["开源", "社区", "免费"],
        "category": "community",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "civitai",
        "name": "Civitai",
        "nameZh": "AI 模型社区",
        "description": "Stable Diffusion 模型和提示词社区，资源丰富",
        "url": "https://civitai.com/",
        "icon": "box",
        "color": "pink",
        "tags": ["模型", "社区", "SD"],
        "category": "community",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "midlibrary",
        "name": "Midlibrary",
        "nameZh": "Midjourney 风格库",
        "description": "最全的 Midjourney 艺术家风格参考库",
        "url": "https://www.midlibrary.io/",
        "icon": "library",
        "color": "blue",
        "tags": ["MJ", "风格", "参考"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "runway",
        "name": "Runway",
        "nameZh": "AI 视频创作",
        "description": "专业的 AI 视频生成和编辑工具",
        "url": "https://runwayml.com/",
        "icon": "video",
        "color": "purple",
        "tags": ["视频", "生成", "编辑"],
        "category": "video",
        "isFree": False,
        "isOpenSource": False
    },
    {
        "id": "suno",
        "name": "Suno AI",
        "nameZh": "AI 音乐生成",
        "description": "输入文字即可生成专业级歌曲和音乐",
        "url": "https://suno.com/",
        "icon": "music",
        "color": "orange",
        "tags": ["音乐", "音频", "生成"],
        "category": "audio",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "krea",
        "name": "Krea",
        "nameZh": "Krea AI",
        "description": "高质量 AI 实时增强与图案生成工具",
        "url": "https://www.krea.ai/",
        "icon": "wand-2",
        "color": "pink",
        "tags": ["AI增强", "实时", "图案"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "flowgpt",
        "name": "FlowGPT",
        "nameZh": "FlowGPT",
        "description": "全球最大的 ChatGPT 提示词分享社区",
        "url": "https://flowgpt.com/",
        "icon": "globe",
        "color": "green",
        "tags": ["ChatGPT", "社区", "热门"],
        "category": "text",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "learnprompting",
        "name": "Learn Prompting",
        "nameZh": "Learn Prompting",
        "description": "最权威的免费开源提示词工程教程",
        "url": "https://learnprompting.org/",
        "icon": "book-open",
        "color": "red",
        "tags": ["教程", "开源", "学习"],
        "category": "text",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "imagetoprompt",
        "name": "Image to Prompt",
        "nameZh": "图片转提示词",
        "description": "上传图片自动反推 AI 提示词",
        "url": "https://imagetoprompt.com/",
        "icon": "image-plus",
        "color": "pink",
        "tags": ["反推", "图片", "工具"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "huggingface",
        "name": "Hugging Face",
        "nameZh": "Hugging Face",
        "description": "全球最大的 AI 模型与数据集社区",
        "url": "https://huggingface.co/",
        "icon": "smile",
        "color": "yellow",
        "tags": ["模型", "开源", "社区"],
        "category": "dev",
        "isFree": True,
        "isOpenSource": True
    },
    {
        "id": "aishort",
        "name": "AI Short",
        "nameZh": "AI Short",
        "description": "ChatGPT Shortcut -简单好用的提示词库",
        "url": "https://www.aishort.top/",
        "icon": "zap",
        "color": "green",
        "tags": ["快捷", "提示词", "热门"],
        "category": "text",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "aiprompt",
        "name": "AI Prompt",
        "nameZh": "AIPRM",
        "description": "AIPRM for ChatGPT - 专业的提示词管理工具",
        "url": "https://www.aiprm.com/",
        "icon": "message-circle",
        "color": "dark",
        "tags": ["ChatGPT", "插件", "管理"],
        "category": "text",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "aiart",
        "name": "AIArt",
        "nameZh": "SeaArt AI",
        "description": "强大的国产 AI 绘画工具与社区",
        "url": "https://www.seaart.ai/",
        "icon": "palette",
        "color": "blue",
        "tags": ["绘画", "国产", "社区"],
        "category": "image",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "youmind",
        "name": "You Mind",
        "nameZh": "YouMind",
        "description": "AI 思维助手与创作代理",
        "url": "https://youmind.com/",
        "icon": "brain-circuit",
        "color": "purple",
        "tags": ["助手", "思维", "创作"],
        "category": "text",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "aisociety",
        "name": "AISociety",
        "nameZh": "AI Society",
        "description": "AI 社区与资源聚合平台",
        "url": "https://aisociety.io/",
        "icon": "users",
        "color": "orange",
        "tags": ["社区", "资源", "聚合"],
        "category": "text",
        "isFree": True,
        "isOpenSource": False
    },
    {
        "id": "localbanana",
        "name": "Local Banana",
        "nameZh": "Banana.dev",
        "description": "无服务器 GPU 推理平台 (Local Banana?)",
        "url": "https://www.banana.dev/",
        "icon": "banana",
        "color": "yellow",
        "tags": ["GPU", "推理", "Dev"],
        "category": "dev",
        "isFree": True,
        "isOpenSource": False
    }
]

# ============================================================================
# 模板数据 (Templates)
# ============================================================================

TEMPLATES_DATA = [
    # 教育培训
    {
        "id": "edu-001",
        "title": "学术论文摘要生成",
        "content": "我希望你能担任学术编辑的角色。请重写下面这篇论文摘要，使其更加清晰、简洁，并符合学术规范。请确保保留原文的核心观点和研究成果。摘要内容如下：\n[在此粘贴摘要]",
        "description": "快速生成符合学术规范的论文摘要",
        "category": "education",
        "tags": ["学术", "写作", "润色"]
    },
    {
        "id": "edu-002",
        "title": "雅思口语模拟考官",
        "content": "请你扮演一位严厉但公正的雅思口语考官。我们将进行 Part 2 的模拟考试。请给我一个话题卡，并给我 1 分钟准备时间，然后我会开始陈述。陈述结束后，请根据流畅度、词汇、语法和发音给出详细的反馈和 0-9 分的评分。",
        "description": "模拟雅思口语考试环境并提供反馈",
        "category": "education",
        "tags": ["雅思", "口语", "模拟"]
    },
    {
        "id": "edu-003",
        "title": "复杂概念通俗解释",
        "content": "请用通俗易懂的语言，像给 10 岁小学生讲故事一样，解释[复杂概念，例如：量子纠缠]。请使用生活中的类比，避免使用过于专业的术语。",
        "description": "将复杂的学术概念转化为通俗易懂的解释",
        "category": "education",
        "tags": ["解释", "教学", "科普"]
    },

    # 职场办公
    {
        "id": "work-001",
        "title": "职业邮件写作助手",
        "content": "请帮我写一封[邮件类型，例如：请假/汇报/催款]邮件给[收件人角色]。\n主要内容包括：[具体事项]。\n语气要求：[语气，例如：专业、委婉、坚定]。",
        "description": "一键生成专业得体的商务邮件",
        "category": "work",
        "tags": ["邮件", "商务", "效率"]
    },
    {
        "id": "work-002",
        "title": "求职面试模拟",
        "content": "我正在准备[职位名称]的面试。请你扮演面试官，依次向我提出 5 个该职位常见的面试问题。每次只提一个问题，等我回答后，请对我的回答给出具体的改进建议，然后再提下一个问题。",
        "description": "模拟真实求职面试场景并提供指导",
        "category": "work",
        "tags": ["面试", "求职", "模拟"]
    },
    {
        "id": "work-003",
        "title": "会议纪要生成",
        "content": "以下是一段会议记录的草稿。请帮我将其整理成一份结构清晰的会议纪要，包括：会议主题、时间地点、参会人员、主要议题、决议事项和后续行动计划（Action Items）。\n草稿内容：\n[在此粘贴草稿]",
        "description": "快速将会议记录整理为结构化纪要",
        "category": "work",
        "tags": ["会议", "文档", "整理"]
    },

    # 内容创作
    {
        "id": "content-001",
        "title": "小红书爆款文案",
        "content": "请帮我写一篇关于[主题]的小红书文案。\n目标用户是[目标人群]。\n要求：\n1. 标题要吸引眼球，多使用 Emoji。\n2. 正文采用“痛点+解决方案+情感共鸣”的结构。\n3. 文末添加相关的热门话题标签。",
        "description": "打造吸睛的小红书笔记标题和内容",
        "category": "content",
        "tags": ["小红书", "营销", "文案"]
    },
    {
        "id": "content-002",
        "title": "短视频脚本文案",
        "content": "请为一个 30 秒的短视频撰写脚本，主题是[主题]。\n格式要求：分镜脚本，包含画面描述、台词/旁白、配乐建议和时长预估。\n风格：[风格，例如：幽默、悬疑、感人]。",
        "description": "生成适用于 TikTok/抖音的短视频分镜脚本",
        "category": "content",
        "tags": ["短视频", "脚本", "抖音"]
    },
    {
        "id": "content-003",
        "title": "SEO 优化博客文章",
        "content": "请写一篇关于[关键词]的博客文章。\n要求：\n1. 标题包含关键词。\n2. 结构清晰，包含 H1, H2, H3 标题。\n3. 内容具有信息增量，字数在 1000 字左右。\n4. 符合 SEO 最佳实践。",
        "description": "撰写对搜索引擎友好的高质量博客文章",
        "category": "content",
        "tags": ["SEO", "博客", "文章"]
    },

    # 编程开发
    {
        "id": "code-001",
        "title": "Python 代码解释器",
        "content": "请解释下面这段 Python 代码的功能、逻辑和潜在的性能问题。\n[在此粘贴代码]",
        "description": "解释复杂 Python 代码段的功能和逻辑",
        "category": "code",
        "tags": ["Python", "代码", "解释"]
    },
    {
        "id": "code-002",
        "title": "SQL 查询优化",
        "content": "我有以下 SQL 查询语句，运行速度较慢。请帮我分析原因并提供优化后的 SQL 语句。请解释优化的原理（例如索引使用、连接方式等）。\n[在此粘贴 SQL]",
        "description": "快速生成高性能的 SQL 查询优化方案",
        "category": "code",
        "tags": ["SQL", "数据库", "优化"]
    },
    {
        "id": "code-003",
        "title": "正则表达式生成",
        "content": "请帮我生成一个正则表达式，用于匹配[匹配规则，例如：中国大陆手机号码/电子邮箱/特定格式的日期]。请给出正则表达式，并解释每个部分的含义。",
        "description": "根据需求生成复杂的正则表达式",
        "category": "code",
        "tags": ["正则", "工具", "开发"]
    },

    # 营销运营
    {
        "id": "mkt-001",
        "title": "产品发布会演讲稿",
        "content": "我们即将发布一款新产品：[产品名称]，它的核心卖点是[卖点 1]、[卖点 2]。请帮我撰写一份 5 分钟的产品发布会开场演讲稿，风格要[风格，例如：乔布斯式、幽默亲切]。",
        "description": "撰写极具感染力的产品发布演讲",
        "category": "marketing",
        "tags": ["演讲", "发布会", "营销"]
    },
    {
        "id": "mkt-002",
        "title": "SWOT 分析助手",
        "content": "请对[公司/产品]进行详细的 SWOT 分析（优势、劣势、机会、威胁）。\n背景信息：[提供相关背景信息]。\n请以表格形式输出分析结果，并针对每一项提出简要的战略建议。",
        "description": "快速生成专业的商业 SWOT 分析报告",
        "category": "marketing",
        "tags": ["分析", "商业", "策略"]
    },

    # AI 绘画
    {
        "id": "art-001",
        "title": "Midjourney 摄影级人像",
        "content": "/imagine prompt: a cinematic portrait of a [subject], highly detailed, 8k resolution, shot on 35mm lens, f/1.8, realistic lighting, bokeh background --ar 9:16 --v 6.0",
        "description": "生成高质量、逼真的摄影级人像提示词",
        "category": "art",
        "tags": ["MJ", "人像", "摄影"]
    },
    {
        "id": "art-002",
        "title": "吉卜力风格场景",
        "content": "/imagine prompt: [scene description], Studio Ghibli style, anime art, Miyazaki Hayao style, vibrant colors, lush greenery, summer vibes, peaceful atmosphere, high quality --ar 16:9 --niji 6",
        "description": "生成宫崎骏吉卜力风格的动漫场景",
        "category": "art",
        "tags": ["动漫", "吉卜力", "场景"]
    }
]

# ============================================================================
# 行业模板分类 (Categories)
# ============================================================================

CATEGORIES_DATA = [
    {"id": "education", "name": "教育培训", "icon": "graduation-cap", "color": "green", "count": 3},
    {"id": "work", "name": "职场办公", "icon": "briefcase", "color": "blue", "count": 3},
    {"id": "content", "name": "内容创作", "icon": "pen-tool", "color": "pink", "count": 3},
    {"id": "code", "name": "编程开发", "icon": "code", "color": "orange", "count": 3},
    {"id": "marketing", "name": "营销运营", "icon": "trending-up", "color": "purple", "count": 2},
    {"id": "art", "name": "AI 绘画", "icon": "palette", "color": "coral", "count": 2},
    {"id": "video", "name": "视频创作", "icon": "video", "color": "blue", "count": 1},
    {"id": "research", "name": "学习研究", "icon": "microscope", "color": "orange", "count": 0}
]

# 更新分类的 count
for cat in CATEGORIES_DATA:
    count = len([t for t in TEMPLATES_DATA if t['category'] == cat['id']])
    cat['count'] = count

# ============================================================================
# 路由
# ============================================================================

@app.route('/')
def index():
    """返回首页"""
    return send_from_directory('static', 'index.html')

@app.route('/api/health')
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'service': 'Prompt Workshop API',
        'version': '1.2.0',
        'timestamp': datetime.now().isoformat() + 'Z'
    })

@app.route('/api/tools')
def get_tools():
    """获取所有工具"""
    category = request.args.get('category')
    q = request.args.get('q', '').lower()
    
    tools = TOOLS_DATA
    
    if category:
        tools = [t for t in tools if t.get('category') == category]
    
    if q:
        tools = [t for t in tools if 
                 q in t.get('name', '').lower() or 
                 q in t.get('nameZh', '').lower() or
                 q in t.get('description', '').lower() or
                 any(q in tag.lower() for tag in t.get('tags', []))]
    
    return jsonify({
        'success': True,
        'data': {
            'tools': tools,
            'total': len(tools)
        }
    })

@app.route('/api/templates')
def get_templates():
    """获取提示词模板"""
    category = request.args.get('category')
    q = request.args.get('q', '').lower()
    
    templates = TEMPLATES_DATA
    
    if category:
        templates = [t for t in templates if t.get('category') == category]
    
    if q:
        templates = [t for t in templates if 
                     q in t.get('title', '').lower() or 
                     q in t.get('description', '').lower() or
                     any(q in tag.lower() for tag in t.get('tags', []))]
    
    return jsonify({
        'success': True,
        'data': {
            'templates': templates,
            'total': len(templates)
        }
    })

@app.route('/api/categories')
def get_categories():
    """获取所有分类"""
    # 动态计算 count
    for cat in CATEGORIES_DATA:
        count = len([t for t in TEMPLATES_DATA if t['category'] == cat['id']])
        cat['count'] = count

    return jsonify({
        'success': True,
        'data': {
            'categories': CATEGORIES_DATA,
            'total': len(CATEGORIES_DATA)
        }
    })

@app.route('/api/stats')
def get_stats():
    """获取统计数据"""
    return jsonify({
        'success': True,
        'data': {
            'toolsCount': len(TOOLS_DATA),
            'categoriesCount': len(CATEGORIES_DATA),
            'templatesCount': len(TEMPLATES_DATA),
            'openSourceCount': len([t for t in TOOLS_DATA if t.get('isOpenSource')])
        }
    })

# ============================================================================
# 启动服务器
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Prompt Workshop API Server v1.2")
    print("=" * 60)
    print(f"📊 工具数量: {len(TOOLS_DATA)}")
    print(f"📝 模板数量: {len(TEMPLATES_DATA)}")
    print(f"📁 分类数量: {len(CATEGORIES_DATA)}")
    print(f"🌐 服务地址: http://localhost:4006")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=4006, debug=False)
