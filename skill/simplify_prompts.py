
import json
from pathlib import Path

TEMPLATE = """You are an expert in {name}.
Your goal is to help the user apply {name} best practices to their work.
1. Analyze the user's request in the context of {name}.
2. Provide step-by-step guidance or code examples.
3. Ensure all output aligns with the core principles of {name}."""

def simplify_prompts():
    path = Path('skills.json')
    with open(path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    
    count = 0
    for skill in skills:
        name = skill['name']
        skill['systemPrompt'] = TEMPLATE.format(name=name)
        count += 1
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    
    print(f"Simplified {count} system prompts.")

if __name__ == "__main__":
    simplify_prompts()
