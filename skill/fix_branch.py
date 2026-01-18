
import json
from pathlib import Path

def fix_branch():
    path = Path('skills.json')
    with open(path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    
    count = 0
    for skill in skills:
        if 'sourceRepo' in skill and 'ComposioHQ/awesome-claude-skills' in skill['sourceRepo']:
            old_url = skill['sourceRepo']
            # Fix branch from main to master
            new_url = old_url.replace('/tree/main/', '/tree/master/')
            if old_url != new_url:
                skill['sourceRepo'] = new_url
                count += 1
                print(f"Fixed: {skill['name']}")
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    
    print(f"\nFixed {count} URLs (main -> master).")

if __name__ == "__main__":
    fix_branch()
