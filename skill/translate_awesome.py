
import json
from pathlib import Path

# Chinese translations for awesome skills
TRANSLATIONS = {
    "awesome-artifacts-builder": {
        "description": "使用 React、Tailwind CSS、shadcn/ui 等现代前端技术，创建精美的 claude.ai HTML 制品。",
        "longDescription": "一套完整的工具集，用于构建复杂的多组件 claude.ai HTML 制品。\n**核心能力：**\n- 使用 React 构建交互式组件\n- 集成 Tailwind CSS 样式\n- 支持 shadcn/ui 组件库"
    },
    "awesome-brand-guidelines": {
        "description": "将 Anthropic 官方品牌颜色和排版应用于任何制品，确保视觉一致性。",
        "longDescription": "确保您的制品始终符合品牌视觉规范。\n**核心能力：**\n- 应用官方品牌色彩\n- 统一排版样式\n- 保持专业设计标准"
    },
    "awesome-canvas-design": {
        "description": "创建精美的 PNG 和 PDF 视觉作品，包括海报、插画和静态设计。",
        "longDescription": "使用设计哲学和美学原则创建令人惊艳的视觉作品。\n**核心能力：**\n- 海报和插画设计\n- 支持 PNG/PDF 导出\n- 遵循专业设计原则"
    },
    "awesome-changelog-generator": {
        "description": "从 Git 提交记录自动生成面向用户的 Changelog，将技术提交转化为易读的发布说明。",
        "longDescription": "自动化 Changelog 生成流程。\n**核心能力：**\n- 分析 Git 历史记录\n- 将技术提交转化为用户友好的说明\n- 生成专业的发布日志"
    },
    "awesome-competitive-ads-extractor": {
        "description": "从广告库中提取和分析竞品广告，了解其营销策略和创意方向。",
        "longDescription": "深入分析竞争对手的广告策略。\n**核心能力：**\n- 提取竞品广告内容\n- 分析营销策略\n- 识别有效的创意模式"
    },
    "awesome-content-research-writer": {
        "description": "协助撰写高质量内容：进行调研、添加引用、改进开头、提供逐节反馈。",
        "longDescription": "全流程内容写作助手。\n**核心能力：**\n- 深度内容调研\n- 自动添加引用\n- 优化文章结构和开头"
    },
    "awesome-developer-growth-analysis": {
        "description": "分析开发者成长轨迹，提供技能提升建议和职业发展洞察。",
        "longDescription": "开发者职业成长分析工具。\n**核心能力：**\n- 技能评估\n- 成长建议\n- 职业规划"
    },
    "awesome-domain-name-brainstormer": {
        "description": "生成创意域名建议，并检查 .com、.io、.dev、.ai 等多个后缀的可用性。",
        "longDescription": "域名创意生成与可用性检查。\n**核心能力：**\n- 生成创意域名\n- 多后缀可用性检查\n- 品牌命名建议"
    },
    "awesome-file-organizer": {
        "description": "智能整理文件和文件夹：理解上下文、查找重复、建议更好的组织结构。",
        "longDescription": "AI 驱动的文件整理助手。\n**核心能力：**\n- 智能分类\n- 重复文件检测\n- 自动命名和归档"
    },
    "awesome-image-enhancer": {
        "description": "提升图片和截图质量：增强分辨率、锐度和清晰度。",
        "longDescription": "专业级图像增强工具。\n**核心能力：**\n- 提升分辨率\n- 增强锐度\n- 适用于演示和文档"
    },
    "awesome-internal-comms": {
        "description": "撰写内部沟通文档：3P 更新、公司通讯、FAQ、状态报告和项目更新。",
        "longDescription": "企业内部沟通模板库。\n**核心能力：**\n- 3P 更新模板\n- 公司通讯\n- 项目状态报告"
    },
    "awesome-invoice-organizer": {
        "description": "自动整理发票和收据：读取文件、提取信息、统一重命名，便于报税。",
        "longDescription": "发票自动化整理系统。\n**核心能力：**\n- 自动读取发票\n- 提取关键信息\n- 统一命名归档"
    },
    "awesome-lead-research-assistant": {
        "description": "识别和筛选高质量潜在客户：分析产品、搜索目标公司、提供可执行的外联策略。",
        "longDescription": "销售潜客挖掘助手。\n**核心能力：**\n- 目标客户识别\n- 公司信息分析\n- 外联策略建议"
    },
    "awesome-mcp-builder": {
        "description": "指导创建高质量的 MCP 服务器，用于将外部 API 和服务集成到 LLM 中。",
        "longDescription": "MCP 服务器开发完整指南。\n**核心能力：**\n- Python (FastMCP) 开发\n- TypeScript (MCP SDK) 开发\n- API 集成最佳实践"
    },
    "awesome-meeting-insights-analyzer": {
        "description": "分析会议记录，发现行为模式：冲突回避、发言比例、口头禅、领导风格。",
        "longDescription": "深度会议洞察分析。\n**核心能力：**\n- 发言比例统计\n- 行为模式识别\n- 领导风格分析"
    },
    "awesome-raffle-winner-picker": {
        "description": "从列表、表格或 Google Sheets 中随机抽取获奖者，使用加密安全随机数。",
        "longDescription": "公平透明的抽奖工具。\n**核心能力：**\n- 加密安全随机\n- 支持多种数据源\n- 可审计的抽奖记录"
    },
    "awesome-skill-creator": {
        "description": "指导创建高效的 Claude Skills：扩展 AI 能力的专业知识、工作流和工具集成。",
        "longDescription": "Skill 开发最佳实践指南。\n**核心能力：**\n- Skill 结构设计\n- 工作流定义\n- 工具集成方法"
    },
    "awesome-skill-share": {
        "description": "分享和发现社区贡献的 Claude Skills，扩展 AI 能力。",
        "longDescription": "Skills 社区分享平台。\n**核心能力：**\n- 发现社区 Skills\n- 分享自己的 Skills\n- 协作改进"
    },
    "awesome-slack-gif-creator": {
        "description": "创建针对 Slack 优化的 GIF 动画：尺寸约束验证、可组合动画原语。",
        "longDescription": "Slack 专用 GIF 制作工具。\n**核心能力：**\n- 尺寸优化\n- 动画组合\n- Slack 格式适配"
    },
    "awesome-theme-factory": {
        "description": "为幻灯片、文档、报告和 HTML 页面应用专业的字体和颜色主题，内置 10 套预设。",
        "longDescription": "一键应用专业主题。\n**核心能力：**\n- 10 套预设主题\n- 支持多种文档格式\n- 品牌色彩定制"
    },
    "awesome-video-downloader": {
        "description": "从 YouTube 等平台下载视频：支持多种格式和质量选项，便于离线观看或编辑。",
        "longDescription": "多平台视频下载工具。\n**核心能力：**\n- 支持 YouTube 等平台\n- 多格式选择\n- 质量可选"
    },
    "awesome-webapp-testing": {
        "description": "使用 Playwright 测试本地 Web 应用：验证前端功能、调试 UI 行为、截图。",
        "longDescription": "Playwright 自动化测试助手。\n**核心能力：**\n- 前端功能验证\n- UI 行为调试\n- 自动截图对比"
    }
}

def translate_skills():
    path = Path('skills.json')
    with open(path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    
    count = 0
    for skill in skills:
        sid = skill['id']
        if sid in TRANSLATIONS:
            skill['description'] = TRANSLATIONS[sid]['description']
            skill['longDescription'] = TRANSLATIONS[sid]['longDescription']
            count += 1
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    
    print(f"Translated {count} skill descriptions to Chinese.")

if __name__ == "__main__":
    translate_skills()
