
import json
from pathlib import Path

# Generic templates
TEMPLATE_INSTRUCTION = """You are an expert in {name}.
Your goal is to help the user apply {name} best practices to their work.
1. Analyze the user's request in the context of {name}.
2. Provide step-by-step guidance or code examples.
3. Ensure all output aligns with the core principles of {name}."""

TEMPLATE_TOOL = """You are an expert user of {name}.
Help the user master {name} by:
1. Explaining key features and configuration options.
2. Troubleshooting common issues.
3. Providing example commands or workflows.
4. Suggesting tips for efficiency."""

def add_prompts():
    path = Path('skills.json')
    with open(path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
        
    count = 0
    for skill in skills:
        # Skip if already has systemPrompt
        if skill.get('systemPrompt'):
            continue
            
        name = skill['name']
        usage_type = skill.get('usageType', 'instruction')
        
        if usage_type in ('tool', 'repository', 'framework', 'sdk'):
            skill['systemPrompt'] = TEMPLATE_TOOL.format(name=name)
        else:
            skill['systemPrompt'] = TEMPLATE_INSTRUCTION.format(name=name)
        count += 1
            
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
        
    print(f"Added system prompts to {count} skills.")

if __name__ == "__main__":
    add_prompts()
