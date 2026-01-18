
import json
from pathlib import Path

# Detailed prompt templates for different skill types
def generate_zh_prompt(skill):
    """Generate detailed Chinese prompt based on skill info."""
    name = skill['name']
    desc = skill.get('description', '')
    category = skill.get('category', 'tools')
    usage_type = skill.get('usageType', 'instruction')
    
    # Base intro
    prompt = f"你是一位 {name} 领域的专家。\n\n"
    
    # Add role based on category
    if category == 'ai-ml':
        prompt += "你的专长是 AI/ML 开发和大语言模型应用。\n\n"
    elif category == 'frontend':
        prompt += "你的专长是现代前端开发和 UI/UX 设计。\n\n"
    elif category == 'backend':
        prompt += "你的专长是后端架构和系统设计。\n\n"
    elif category == 'devops':
        prompt += "你的专长是 DevOps 实践和自动化运维。\n\n"
    elif category == 'testing':
        prompt += "你的专长是软件测试和质量保证。\n\n"
    elif category == 'mobile':
        prompt += "你的专长是移动端开发和跨平台技术。\n\n"
    elif category == 'repositories':
        prompt += "你是这个开源项目的资深用户和贡献者。\n\n"
    else:
        prompt += "你的专长是帮助用户高效完成相关任务。\n\n"
    
    prompt += "**你的核心职责：**\n"
    
    # Add responsibilities based on usage type
    if usage_type == 'tool' or usage_type == 'framework' or usage_type == 'sdk':
        prompt += f"""1. 解释 {name} 的核心功能和配置选项
2. 提供安装、配置和使用的详细指南
3. 排查常见问题并给出解决方案
4. 分享最佳实践和效率技巧
5. 给出可运行的代码示例

"""
    elif usage_type == 'repository':
        prompt += f"""1. 帮助用户理解项目结构和核心模块
2. 指导如何正确使用和集成该项目
3. 解答关于项目功能和实现的问题
4. 提供基于项目文档的最佳实践建议
5. 协助排查使用过程中遇到的问题

"""
    else:  # instruction
        prompt += f"""1. 分析用户需求，给出专业建议
2. 提供分步骤的详细指导
3. 给出可直接使用的代码示例
4. 确保所有输出符合 {name} 的核心原则
5. 在回答中体现行业最佳实践

"""
    
    prompt += f"**关于 {name}：**\n{desc}\n\n"
    prompt += "请用中文回复，保持专业且易于理解的语言风格。"
    
    return prompt

def generate_en_prompt(skill):
    """Generate detailed English prompt based on skill info."""
    name = skill['name']
    desc = skill.get('description', '')
    category = skill.get('category', 'tools')
    usage_type = skill.get('usageType', 'instruction')
    
    prompt = f"You are an expert in {name}.\n\n"
    
    if category == 'ai-ml':
        prompt += "Your expertise lies in AI/ML development and LLM applications.\n\n"
    elif category == 'frontend':
        prompt += "Your expertise lies in modern frontend development and UI/UX design.\n\n"
    elif category == 'backend':
        prompt += "Your expertise lies in backend architecture and system design.\n\n"
    elif category == 'devops':
        prompt += "Your expertise lies in DevOps practices and automation.\n\n"
    elif category == 'testing':
        prompt += "Your expertise lies in software testing and quality assurance.\n\n"
    elif category == 'mobile':
        prompt += "Your expertise lies in mobile development and cross-platform technologies.\n\n"
    elif category == 'repositories':
        prompt += "You are a senior user and contributor to this open-source project.\n\n"
    else:
        prompt += "Your expertise lies in helping users efficiently accomplish related tasks.\n\n"
    
    prompt += "**Your Core Responsibilities:**\n"
    
    if usage_type == 'tool' or usage_type == 'framework' or usage_type == 'sdk':
        prompt += f"""1. Explain the core features and configuration options of {name}
2. Provide detailed installation, configuration, and usage guides
3. Troubleshoot common issues and provide solutions
4. Share best practices and efficiency tips
5. Provide runnable code examples

"""
    elif usage_type == 'repository':
        prompt += f"""1. Help users understand the project structure and core modules
2. Guide proper usage and integration of the project
3. Answer questions about project features and implementation
4. Provide best practice recommendations based on project documentation
5. Assist in troubleshooting issues encountered during use

"""
    else:
        prompt += f"""1. Analyze user requirements and provide expert advice
2. Provide step-by-step detailed guidance
3. Give directly usable code examples
4. Ensure all outputs align with the core principles of {name}
5. Reflect industry best practices in your responses

"""
    
    prompt += f"**About {name}:**\n{desc}\n\n"
    prompt += "Please respond in English with a professional and clear communication style."
    
    return prompt

def add_bilingual_prompts():
    path = Path('skills.json')
    with open(path, 'r', encoding='utf-8') as f:
        skills = json.load(f)
    
    for skill in skills:
        skill['systemPromptZH'] = generate_zh_prompt(skill)
        skill['systemPromptEN'] = generate_en_prompt(skill)
        # Remove old field if exists
        if 'systemPrompt' in skill:
            del skill['systemPrompt']
    
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(skills, f, ensure_ascii=False, indent=2)
    
    print(f"Added bilingual prompts to {len(skills)} skills.")

if __name__ == "__main__":
    add_bilingual_prompts()
