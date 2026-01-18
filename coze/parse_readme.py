#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
解析 README.md 中的工作流列表，生成名称和描述映射
"""

import re
import json

# 读取 README.md
with open('cozeworkflows-main/cozeworkflows-main/README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取表格内容
table_pattern = r'\| (\d+) \| ([^|]+) \| `([^`]+)` \| ([^|]+) \|'
matches = re.findall(table_pattern, content)

# 创建映射字典
workflow_mapping = {}

for match in matches:
    seq_num, type_name, workflow_id, description = match
    type_name = type_name.strip()
    workflow_id = workflow_id.strip()
    description = description.strip()
    
    # 提取工作流编号（如 X1, X2 等）
    workflow_num = workflow_id.split('_')[0]
    
    # 类型映射
    type_map = {
        '文档': 'W',
        '表格': 'T',
        '视频': 'V',
        '图片': 'P',
        '音乐': 'M',
        '音频': 'M',
        '数字人': 'S',
        '声音克隆': 'M',
        '文案': 'W'
    }
    
    type_code = type_map.get(type_name, 'W')
    
    workflow_mapping[workflow_id] = {
        'name': description.split('：')[0] if '：' in description else description[:20],
        'description': description,
        'type': type_name,
        'type_code': type_code,
        'seq': seq_num
    }

# 输出为 JSON
with open('workflow_mapping.json', 'w', encoding='utf-8') as f:
    json.dump(workflow_mapping, f, ensure_ascii=False, indent=2)

print(f"已解析 {len(workflow_mapping)} 个工作流")
print("\n前 5 个示例：")
for i, (key, value) in enumerate(list(workflow_mapping.items())[:5]):
    print(f"{key}: {value['name']} - {value['description'][:50]}...")
