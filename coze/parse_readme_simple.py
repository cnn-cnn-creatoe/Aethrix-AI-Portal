#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化版：只根据 X 编号匹配工作流
"""

import re
import json

# 读取 README.md
with open('cozeworkflows-main/cozeworkflows-main/README.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取表格内容
table_pattern = r'\| (\d+) \| ([^|]+) \| `([^`]+)` \| ([^|]+) \|'
matches = re.findall(table_pattern, content)

# 创建基于 X 编号的映射字典
workflow_mapping = {}

for match in matches:
    seq_num, type_name, workflow_id, description = match
    type_name = type_name.strip()
    workflow_id = workflow_id.strip()
    description = description.strip()
    
    # 提取 X 编号（如 X1, X178, X_201）
    x_match = re.match(r'(X_?\d+)', workflow_id)
    if x_match:
        x_num_raw = x_match.group(1)
        # 标准化：移除下划线（X_201 -> X201）
        x_num = x_num_raw.replace('_', '')
        
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
        
        # 使用标准化的 X 编号作为 key
        workflow_mapping[x_num] = {
            'name': description,  # 直接使用简介作为名称
            'description': description,  # 描述也是简介
            'type': type_name,
            'type_code': type_code,
            'seq': seq_num,
            'original_id': workflow_id
        }

# 输出为 JSON
with open('workflow_mapping_simple.json', 'w', encoding='utf-8') as f:
    json.dump(workflow_mapping, f, ensure_ascii=False, indent=2)

print(f"已解析 {len(workflow_mapping)} 个工作流")
print("\n前 10 个示例：")
for i, (key, value) in enumerate(list(workflow_mapping.items())[:10]):
    print(f"{key}: {value['name']}")
