
import json
import re
from pathlib import Path
from datetime import datetime, timezone

# Correct GitHub repo base URL
GITHUB_BASE = "https://github.com/ComposioHQ/awesome-claude-skills"

def read_skill_md(folder_path):
    """Read and return the full SKILL.md content."""
    skill_file = folder_path / 'SKILL.md'
    if not skill_file.exists():
        return None
    return skill_file.read_text(encoding='utf-8')

def fix_awesome_skills():
    skills_path = Path('skills.json')
    awesome_path = Path('skills/awesome-claude-skills-master')
    
    with open(skills_path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    
    existing_ids = {s['id'] for s in skills}
    now = datetime.now(timezone.utc).isoformat()
    
    # 1. Add main repository entry if not exists
    repo_id = "repo-awesome-claude-skills"
    if repo_id not in existing_ids:
        repo_entry = {
            "id": repo_id,
            "name": "Awesome Claude Skills 整合仓库",
            "slug": "awesome-claude-skills-repo",
            "description": "社区维护的 Claude Skills 精选列表，涵盖开发工具、数据分析、内容创作等多个领域。",
            "longDescription": "由 ComposioHQ 维护的 Claude Skills 资源大全。\n**包含分类：**\n- 文档处理\n- 开发工具\n- 数据分析\n- 营销商务\n- 创意媒体\n- 效率工具\n\n若单个 Skill 链接失效，请直接在此仓库中搜索。",
            "category": "repositories",
            "subCategory": "整合仓库",
            "tags": ["awesome", "skills", "curated"],
            "platforms": ["cursor", "claude", "kiro", "windsurf", "trae", "copilot", "antigravity", "codex"],
            "languages": ["general"],
            "complexity": "beginner",
            "author": {"name": "ComposioHQ", "url": "https://github.com/ComposioHQ"},
            "sourceRepo": GITHUB_BASE,
            "lastUpdated": now,
            "usageType": "repository",
            "featured": True,
            "popular": True,
            "icon": "📚",
            "systemPrompt": "You are an expert on Claude Skills. Help users discover and use skills from the awesome-claude-skills collection."
        }
        skills.insert(2, repo_entry)  # Insert near top
        print(f"Added: {repo_entry['name']}")
    
    # 2. Fix existing awesome-* skills
    fixed_count = 0
    for skill in skills:
        if not skill['id'].startswith('awesome-'):
            continue
        
        # Extract folder name from id
        folder_name = skill['id'].replace('awesome-', '')
        folder_path = awesome_path / folder_name
        
        if not folder_path.exists():
            print(f"Folder not found: {folder_name}")
            continue
        
        # Fix sourceRepo URL
        skill['sourceRepo'] = f"{GITHUB_BASE}/tree/main/{folder_name}"
        
        # Read actual SKILL.md content for systemPrompt
        skill_content = read_skill_md(folder_path)
        if skill_content:
            skill['systemPrompt'] = skill_content
            fixed_count += 1
            print(f"Fixed: {skill['name']}")
        else:
            print(f"No SKILL.md: {folder_name}")
    
    with open(skills_path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    
    print(f"\nFixed {fixed_count} skills. Total: {len(skills)}")

if __name__ == "__main__":
    fix_awesome_skills()
