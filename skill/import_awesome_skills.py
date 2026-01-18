
import json
import os
import re
from pathlib import Path
from datetime import datetime, timezone

# Category mapping based on README.md classification
CATEGORY_MAP = {
    # Document Processing
    'docx': ('tools', '文档处理'),
    'pdf': ('tools', '文档处理'),
    'pptx': ('tools', '文档处理'),
    'xlsx': ('tools', '文档处理'),
    'document-skills': ('tools', '文档处理'),
    
    # Development & Code Tools
    'artifacts-builder': ('frontend', '开发工具'),
    'mcp-builder': ('devops', 'MCP 开发'),
    'skill-creator': ('tools', 'Skill 创作'),
    'webapp-testing': ('testing', 'Web 测试'),
    'changelog-generator': ('devops', 'Git 工具'),
    
    # Business & Marketing
    'brand-guidelines': ('frontend', '品牌设计'),
    'competitive-ads-extractor': ('tools', '营销分析'),
    'domain-name-brainstormer': ('tools', '域名工具'),
    'internal-comms': ('tools', '内部沟通'),
    'lead-research-assistant': ('tools', '销售研究'),
    
    # Communication & Writing
    'content-research-writer': ('tools', '内容写作'),
    'meeting-insights-analyzer': ('tools', '会议分析'),
    
    # Creative & Media
    'canvas-design': ('frontend', '视觉设计'),
    'image-enhancer': ('tools', '图像处理'),
    'slack-gif-creator': ('tools', 'GIF 创作'),
    'theme-factory': ('frontend', '主题工厂'),
    'video-downloader': ('tools', '视频下载'),
    
    # Productivity & Organization
    'file-organizer': ('tools', '文件整理'),
    'invoice-organizer': ('tools', '发票整理'),
    'raffle-winner-picker': ('tools', '抽奖工具'),
    
    # Collaboration
    'skill-share': ('tools', '技能分享'),
    
    # Default
    'default': ('tools', '通用工具'),
}

# Chinese name translations
NAME_TRANSLATIONS = {
    'mcp-builder': 'MCP 服务器构建器',
    'skill-creator': 'Skill 创作助手',
    'webapp-testing': 'Web 应用测试 (Playwright)',
    'brand-guidelines': '品牌规范助手',
    'canvas-design': 'Canvas 视觉设计',
    'internal-comms': '内部沟通模板',
    'slack-gif-creator': 'Slack GIF 创作器',
    'theme-factory': '主题工厂',
    'artifacts-builder': 'Artifacts 构建器',
    'changelog-generator': 'Changelog 生成器',
    'competitive-ads-extractor': '竞品广告分析器',
    'content-research-writer': '内容研究写手',
    'domain-name-brainstormer': '域名头脑风暴',
    'file-organizer': '文件智能整理',
    'image-enhancer': '图像增强器',
    'invoice-organizer': '发票自动整理',
    'lead-research-assistant': '潜客研究助手',
    'meeting-insights-analyzer': '会议洞察分析',
    'raffle-winner-picker': '抽奖摇号器',
    'video-downloader': '视频下载器',
    'skill-share': 'Skill 分享中心',
    'document-skills': '文档处理套件',
    'developer-growth-analysis': '开发者成长分析',
}

# System prompt template
SYSTEM_PROMPT_TEMPLATE = """You are an expert in {name}.
Your goal is to help the user apply {name} best practices to their work.
1. Analyze the user's request in the context of {name}.
2. Provide step-by-step guidance or code examples.
3. Ensure all output aligns with the core principles of {name}."""

def parse_skill_md(skill_path):
    """Parse SKILL.md file and extract metadata."""
    skill_file = skill_path / 'SKILL.md'
    if not skill_file.exists():
        return None
    
    content = skill_file.read_text(encoding='utf-8')
    
    # Extract YAML frontmatter
    match = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not match:
        return None
    
    frontmatter = match.group(1)
    
    # Parse name and description
    name_match = re.search(r'^name:\s*(.+)$', frontmatter, re.MULTILINE)
    desc_match = re.search(r'^description:\s*(.+)$', frontmatter, re.MULTILINE)
    
    if not name_match:
        return None
    
    name = name_match.group(1).strip()
    description = desc_match.group(1).strip() if desc_match else ''
    
    return {
        'name': name,
        'description': description,
        'content': content
    }

def create_skill_entry(folder_name, metadata):
    """Create a skill entry for skills.json."""
    original_name = metadata['name']
    description = metadata['description']
    
    # Get category
    cat_info = CATEGORY_MAP.get(folder_name, CATEGORY_MAP['default'])
    category = cat_info[0]
    sub_category = cat_info[1]
    
    # Get Chinese name
    chinese_name = NAME_TRANSLATIONS.get(folder_name, original_name)
    
    # Generate ID
    skill_id = f"awesome-{folder_name}"
    
    # Generate long description (translate common patterns)
    long_desc = description
    if len(long_desc) > 100:
        long_desc = long_desc[:200] + '...'
    
    # Determine complexity
    complexity = 'intermediate'
    if 'MCP' in description or 'API' in description or 'SDK' in description:
        complexity = 'advanced'
    elif 'simple' in description.lower() or 'basic' in description.lower():
        complexity = 'beginner'
    
    return {
        "id": skill_id,
        "name": chinese_name,
        "slug": folder_name,
        "description": description[:150] + '...' if len(description) > 150 else description,
        "longDescription": long_desc,
        "category": category,
        "subCategory": sub_category,
        "tags": [folder_name.replace('-', ' '), sub_category],
        "platforms": ["cursor", "claude", "kiro", "windsurf", "trae", "copilot", "antigravity", "codex"],
        "languages": ["general"],
        "complexity": complexity,
        "author": {"name": "Awesome Claude Skills", "url": "https://github.com/composiohq/awesome-claude-skills"},
        "sourceRepo": f"https://github.com/composiohq/awesome-claude-skills/tree/main/{folder_name}",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "usageType": "instruction",
        "featured": False,
        "popular": False,
        "icon": "🧩",
        "systemPrompt": SYSTEM_PROMPT_TEMPLATE.format(name=chinese_name)
    }

def import_skills():
    """Import all skills from awesome-claude-skills-master."""
    awesome_path = Path('skills/awesome-claude-skills-master')
    skills_json_path = Path('skills.json')
    
    # Load existing skills
    with open(skills_json_path, 'r', encoding='utf-8') as f:
        existing_skills = json.load(f)
    
    existing_ids = {s['id'] for s in existing_skills}
    
    # Skip these folders (not actual skills)
    skip_folders = {'.claude-plugin', 'template-skill', '.git'}
    
    added = 0
    for item in awesome_path.iterdir():
        if not item.is_dir():
            continue
        if item.name in skip_folders:
            continue
        if item.name.startswith('.'):
            continue
            
        metadata = parse_skill_md(item)
        if not metadata:
            print(f"Skipped (no SKILL.md): {item.name}")
            continue
        
        skill_entry = create_skill_entry(item.name, metadata)
        
        if skill_entry['id'] in existing_ids:
            print(f"Skipped (exists): {skill_entry['id']}")
            continue
        
        existing_skills.append(skill_entry)
        added += 1
        print(f"Added: {skill_entry['name']}")
    
    # Save updated skills
    with open(skills_json_path, 'w', encoding='utf-8') as f:
        json.dump(existing_skills, f, ensure_ascii=False, indent=2)
    
    print(f"\nImported {added} new skills. Total: {len(existing_skills)}")

if __name__ == "__main__":
    import_skills()
