#!/usr/bin/env python3
"""
工作流自动分类脚本 v2
根据工作流使用的集成服务自动分类 - 使用精确匹配
"""

import json
import os
from pathlib import Path
from collections import defaultdict
import re

# 定义服务到分类的精确映射
SERVICE_TO_CATEGORY = {
    # AI & 机器学习
    'openai': 'AI',
    'openaitool': 'AI',
    'chatgpt': 'AI',
    'gpt': 'AI',
    'claude': 'AI',
    'anthropic': 'AI',
    'gemini': 'AI',
    'langchain': 'AI',
    'huggingface': 'AI',
    'deepl': 'AI',
    'awsrekognition': 'AI',
    'awstextract': 'AI',
    'humanticai': 'AI',
    'cortex': 'AI',
    'basicllm': 'AI',
    'llm': 'AI',
    
    # 社交媒体
    'twitter': 'Social Media',
    'twittertool': 'Social Media',
    'facebook': 'Social Media',
    'facebookleadads': 'Social Media',
    'instagram': 'Social Media',
    'linkedin': 'Social Media',
    'tiktok': 'Social Media',
    'pinterest': 'Social Media',
    'reddit': 'Social Media',
    'youtube': 'Social Media',
    'discord': 'Social Media',
    'discordtool': 'Social Media',
    'telegram': 'Social Media',
    'telegramtool': 'Social Media',
    'whatsapp': 'Social Media',
    'matrix': 'Social Media',
    'mattermost': 'Social Media',
    
    # 邮件营销
    'mailchimp': 'Email Marketing',
    'sendgrid': 'Email Marketing',
    'mailerlite': 'Email Marketing',
    'mailjet': 'Email Marketing',
    'convertkit': 'Email Marketing',
    'getresponse': 'Email Marketing',
    'activecampaign': 'Email Marketing',
    'emelia': 'Email Marketing',
    'lemlist': 'Email Marketing',
    'postmark': 'Email Marketing',
    'customerio': 'Email Marketing',
    'mautic': 'Email Marketing',
    
    # CRM & 销售
    'hubspot': 'CRM & Sales',
    'salesforce': 'CRM & Sales',
    'pipedrive': 'CRM & Sales',
    'zohocrm': 'CRM & Sales',
    'copper': 'CRM & Sales',
    'freshsales': 'CRM & Sales',
    'keap': 'CRM & Sales',
    'affinity': 'CRM & Sales',
    'hunter': 'CRM & Sales',
    'autopilot': 'CRM & Sales',
    
    # 项目管理
    'asana': 'Project Management',
    'trello': 'Project Management',
    'jira': 'Project Management',
    'jiratool': 'Project Management',
    'clickup': 'Project Management',
    'mondaycom': 'Project Management',
    'notion': 'Project Management',
    'todoist': 'Project Management',
    'taiga': 'Project Management',
    'baserow': 'Project Management',
    'airtable': 'Project Management',
    'airtabletool': 'Project Management',
    
    # 电子商务
    'shopify': 'E-commerce',
    'woocommerce': 'E-commerce',
    'woocommercetool': 'E-commerce',
    'stripe': 'E-commerce',
    'paypal': 'E-commerce',
    'gumroad': 'E-commerce',
    'chargebee': 'E-commerce',
    'invoiceninja': 'E-commerce',
    'quickbooks': 'E-commerce',
    'wise': 'E-commerce',
    
    # 数据库
    'postgres': 'Database',
    'postgrestool': 'Database',
    'mysql': 'Database',
    'mysqltool': 'Database',
    'mongodb': 'Database',
    'mongodbtool': 'Database',
    'redis': 'Database',
    'elasticsearch': 'Database',
    'supabase': 'Database',
    'firebase': 'Database',
    'nocodb': 'Database',
    'grist': 'Database',
    'googlebigquery': 'Database',
    
    # 云存储
    'googledrive': 'Cloud Storage',
    'googledrivetool': 'Cloud Storage',
    'dropbox': 'Cloud Storage',
    'box': 'Cloud Storage',
    'onedrive': 'Cloud Storage',
    'microsoftonedrive': 'Cloud Storage',
    'awss3': 'Cloud Storage',
    
    # 表格 & 文档
    'googlesheets': 'Spreadsheets & Docs',
    'googlesheetstool': 'Spreadsheets & Docs',
    'microsoftexcel': 'Spreadsheets & Docs',
    'googledocs': 'Spreadsheets & Docs',
    'googleslides': 'Spreadsheets & Docs',
    
    # 日历 & 日程
    'googlecalendar': 'Calendar & Scheduling',
    'googlecalendartool': 'Calendar & Scheduling',
    'calendly': 'Calendar & Scheduling',
    'acuityscheduling': 'Calendar & Scheduling',
    'googletasks': 'Calendar & Scheduling',
    'googletaskstool': 'Calendar & Scheduling',
    'microsofttodo': 'Calendar & Scheduling',
    'clockify': 'Calendar & Scheduling',
    'toggl': 'Calendar & Scheduling',
    
    # 开发工具
    'github': 'DevOps & Development',
    'gitlab': 'DevOps & Development',
    'bitbucket': 'DevOps & Development',
    'travisci': 'DevOps & Development',
    'netlify': 'DevOps & Development',
    'graphql': 'DevOps & Development',
    'executecommand': 'DevOps & Development',
    
    # 通讯
    'slack': 'Communication',
    'gmail': 'Communication',
    'gmailtool': 'Communication',
    'microsoftoutlook': 'Communication',
    'twilio': 'Communication',
    'intercom': 'Communication',
    'helpscout': 'Communication',
    'zendesk': 'Communication',
    'emailsend': 'Communication',
    'emailreadimap': 'Communication',
    
    # 表单 & 调查
    'typeform': 'Forms & Surveys',
    'jotform': 'Forms & Surveys',
    'wufoo': 'Forms & Surveys',
    'surveymonkey': 'Forms & Surveys',
    'form': 'Forms & Surveys',
    
    # 媒体 & 设计
    'figma': 'Media & Design',
    'bannerbear': 'Media & Design',
    'editimage': 'Media & Design',
    'apitemplateio': 'Media & Design',
    
    # 分析 & 监控
    'googleanalytics': 'Analytics & Monitoring',
    'posthog': 'Analytics & Monitoring',
    'uptimerobot': 'Analytics & Monitoring',
    'beeminder': 'Analytics & Monitoring',
    'signl4': 'Analytics & Monitoring',
    
    # 事件 & 会议
    'eventbrite': 'Events & Webinars',
    'gotowebinar': 'Events & Webinars',
    'zoom': 'Events & Webinars',
    'webex': 'Events & Webinars',
    
    # 内容管理
    'wordpress': 'CMS & Content',
    'webflow': 'CMS & Content',
    'strapi': 'CMS & Content',
    'ghost': 'CMS & Content',
    'contentful': 'CMS & Content',
    
    # RSS & 新闻
    'rssfeedread': 'RSS & News',
    
    # 物流 & 配送
    'onfleet': 'Logistics',
    
    # 金融 & 加密
    'coingecko': 'Finance & Crypto',
    'crypto': 'Finance & Crypto',
    
    # HTTP & Webhook - 归类为自动化工具
    'http': 'Automation & Utilities',
    'httprequest': 'Automation & Utilities',
    'webhook': 'Automation & Utilities',
    'respondtowebhook': 'Automation & Utilities',
    'cron': 'Automation & Utilities',
    'schedule': 'Automation & Utilities',
    'code': 'Automation & Utilities',
    'function': 'Automation & Utilities',
    'functionitem': 'Automation & Utilities',
    'if': 'Automation & Utilities',
    'switch': 'Automation & Utilities',
    'merge': 'Automation & Utilities',
    'split': 'Automation & Utilities',
    'splitinbatches': 'Automation & Utilities',
    'splitout': 'Automation & Utilities',
    'aggregate': 'Automation & Utilities',
    'filter': 'Automation & Utilities',
    'limit': 'Automation & Utilities',
    'wait': 'Automation & Utilities',
    'set': 'Automation & Utilities',
    'datetime': 'Automation & Utilities',
    'compression': 'Automation & Utilities',
    'xml': 'Automation & Utilities',
    'markdown': 'Automation & Utilities',
    'converttofile': 'Automation & Utilities',
    'extractfromfile': 'Automation & Utilities',
    'localfile': 'Automation & Utilities',
    'readbinaryfile': 'Automation & Utilities',
    'readbinaryfiles': 'Automation & Utilities',
    'writebinaryfile': 'Automation & Utilities',
    'removeduplicates': 'Automation & Utilities',
    'comparedatasets': 'Automation & Utilities',
    'summarize': 'Automation & Utilities',
    'error': 'Automation & Utilities',
    'stopanderror': 'Automation & Utilities',
    'noop': 'Automation & Utilities',
    'stickynote': 'Automation & Utilities',
    'manual': 'Automation & Utilities',
    'executeworkflow': 'Automation & Utilities',
    'executiondata': 'Automation & Utilities',
    'interval': 'Automation & Utilities',
    'debughelper': 'Automation & Utilities',
    'googletranslate': 'Automation & Utilities',
}

# 分类优先级（数字越小优先级越高）
CATEGORY_PRIORITY = {
    'AI': 1,
    'Social Media': 2,
    'E-commerce': 3,
    'CRM & Sales': 4,
    'Email Marketing': 5,
    'Project Management': 6,
    'Database': 7,
    'Communication': 8,
    'Cloud Storage': 9,
    'Spreadsheets & Docs': 10,
    'Calendar & Scheduling': 11,
    'Forms & Surveys': 12,
    'DevOps & Development': 13,
    'Analytics & Monitoring': 14,
    'Media & Design': 15,
    'Events & Webinars': 16,
    'CMS & Content': 17,
    'Finance & Crypto': 18,
    'RSS & News': 19,
    'Logistics': 20,
    'Automation & Utilities': 99,  # 最低优先级
    'Uncategorized': 100,
}

def normalize_name(name):
    """标准化名称用于匹配"""
    return name.lower().replace(' ', '').replace('-', '').replace('_', '').replace('.', '')

def get_category_for_service(service_name):
    """根据服务名称获取分类"""
    normalized = normalize_name(service_name)
    
    # 精确匹配
    if normalized in SERVICE_TO_CATEGORY:
        return SERVICE_TO_CATEGORY[normalized]
    
    # 移除 n8n-nodes-base. 前缀后再匹配
    if normalized.startswith('n8nnodesbase'):
        normalized = normalized[12:]
        if normalized in SERVICE_TO_CATEGORY:
            return SERVICE_TO_CATEGORY[normalized]
    
    return None

def categorize_workflow(workflow_data, folder_name):
    """根据工作流数据和文件夹名称确定分类"""
    categories_found = {}
    
    # 1. 从节点类型推断（最重要）
    nodes = workflow_data.get('nodes', [])
    for node in nodes:
        node_type = node.get('type', '')
        # 移除前缀
        if 'n8n-nodes-base.' in node_type:
            node_type = node_type.replace('n8n-nodes-base.', '')
        
        category = get_category_for_service(node_type)
        if category:
            if category not in categories_found:
                categories_found[category] = 0
            categories_found[category] += 1
    
    # 2. 从文件夹名称推断
    folder_category = get_category_for_service(folder_name)
    if folder_category:
        if folder_category not in categories_found:
            categories_found[folder_category] = 0
        categories_found[folder_category] += 2  # 文件夹权重更高
    
    # 如果没有找到任何分类
    if not categories_found:
        return 'Uncategorized'
    
    # 移除 Automation & Utilities 如果有其他更具体的分类
    if len(categories_found) > 1 and 'Automation & Utilities' in categories_found:
        del categories_found['Automation & Utilities']
    
    # 按优先级和出现次数排序，返回最佳分类
    best_category = min(categories_found.keys(), 
                       key=lambda x: (CATEGORY_PRIORITY.get(x, 50), -categories_found[x]))
    
    return best_category

def main():
    workflows_dir = Path('workflows')
    context_dir = Path('context')
    context_dir.mkdir(exist_ok=True)
    
    # 存储分类结果
    category_mappings = []
    category_counts = defaultdict(int)
    
    # 遍历所有工作流文件
    json_files = list(workflows_dir.rglob('*.json'))
    print(f"找到 {len(json_files)} 个工作流文件")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            folder_name = json_file.parent.name
            category = categorize_workflow(data, folder_name)
            
            category_mappings.append({
                'filename': json_file.name,
                'folder': folder_name,
                'category': category,
                'name': data.get('name', json_file.stem)
            })
            
            category_counts[category] += 1
            
        except Exception as e:
            print(f"处理 {json_file} 时出错: {e}")
            category_mappings.append({
                'filename': json_file.name,
                'folder': json_file.parent.name,
                'category': 'Uncategorized',
                'name': json_file.stem
            })
            category_counts['Uncategorized'] += 1
    
    # 保存分类映射
    with open(context_dir / 'search_categories.json', 'w', encoding='utf-8') as f:
        json.dump(category_mappings, f, ensure_ascii=False, indent=2)
    
    # 保存唯一分类列表（只保存有内容的分类）
    unique_categories = sorted([cat for cat in category_counts.keys() if category_counts[cat] > 0])
    with open(context_dir / 'unique_categories.json', 'w', encoding='utf-8') as f:
        json.dump(unique_categories, f, ensure_ascii=False, indent=2)
    
    # 打印统计信息
    print("\n分类统计:")
    print("-" * 50)
    for category in sorted(category_counts.keys(), key=lambda x: category_counts[x], reverse=True):
        print(f"{category}: {category_counts[category]}")
    print("-" * 50)
    print(f"总计: {sum(category_counts.values())} 个工作流")
    print(f"\n分类结果已保存到 context/search_categories.json")
    print(f"唯一分类列表已保存到 context/unique_categories.json")

if __name__ == '__main__':
    main()
