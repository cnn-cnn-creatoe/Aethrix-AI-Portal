#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Coze 工作流展示服务器 - Neubrutalism 风格
端口: 4004
"""

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
import json
import zipfile
import re
from pathlib import Path

app = Flask(__name__, static_folder='static')
CORS(app)

# 配置路径
BASE_DIR = Path(__file__).parent
WORKFLOWS_DIR = BASE_DIR / 'cozeworkflows-main' / 'cozeworkflows-main' / '工作流200+合集分享'
MAPPING_FILE = BASE_DIR / 'workflow_mapping_simple.json'

# 加载工作流映射（基于 X 编号）
WORKFLOW_MAPPING = {}
if MAPPING_FILE.exists():
    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        WORKFLOW_MAPPING = json.load(f)

# 分类映射
CATEGORY_MAP = {
    'V': '视频',
    'P': '图片',
    'W': '文档',
    'T': '表格',
    'M': '音频',
    'S': '搜索',
    'A': 'AI',
}

def extract_workflow_info(filename):
    """从文件名提取工作流信息"""
    try:
        # 文件名格式: Workflow-X178_S_search_2_buy_407_1-draft-4281.zip
        # 或者: Workflow-X201_xhs_get_user_note_excel_1-draft-5169.zip
        # 或者多步骤: Workflow-X100_Vyuerhuibenpro_step2video_1-draft-6353.zip
        
        # 提取 X 编号（支持 X 后面直接跟数字，或者 X_数字）
        x_match = re.match(r'Workflow-(X_?\d+)_(.+?)_\d+-draft', filename)
        if not x_match:
            x_match = re.match(r'Workflow-(X_?\d+)', filename)
            if not x_match:
                return None
        
        x_num_raw = x_match.group(1)  # 如 X178 或 X_201 或 X100
        # 标准化：移除下划线（X_201 -> X201）
        x_num = x_num_raw.replace('_', '')  # 如 X178 或 X201 或 X100
        
        # 检查是否是多步骤工作流
        # 通过文件名中的关键词匹配到正确的 X 编号
        filename_lower = filename.lower()
        
        # 检测步骤编号
        step_num = None
        if 'step1' in filename_lower or 'step_1' in filename_lower:
            step_num = 1
        elif 'step2' in filename_lower or 'step_2' in filename_lower:
            step_num = 2
        elif 'step3' in filename_lower or 'step_3' in filename_lower:
            step_num = 3
        
        # 特殊处理：检测 draft_01, draft_02 等模式（仅用于剪映系列 jy_draft）
        # 只有当文件名包含 jy_draft 或 Vjy_draft 且后面跟着 01/02 时才应用
        if 'jy_draft' in filename_lower or 'vjy_draft' in filename_lower:
            draft_pattern_match = re.search(r'(?:jy|vjy)_draft[_]?0(\d)', filename_lower)
            if draft_pattern_match:
                draft_step = int(draft_pattern_match.group(1))
                # 如果文件名是 X140_jy_draft_02，应该匹配到 X141
                if draft_step > 1:
                    x_num_int = int(x_num.replace('X', ''))
                    x_num = f'X{x_num_int + draft_step - 1}'
        
        # 尝试在映射中查找所有可能的匹配
        best_match = None
        best_score = 0
        
        for mapped_x_num, workflow_info in WORKFLOW_MAPPING.items():
            original_id = workflow_info['original_id'].lower()
            
            # 提取原始 ID 中的关键部分（去掉 X 编号）
            id_parts = original_id.split('_')[1:]  # 跳过 X 编号部分
            id_key = '_'.join(id_parts)
            
            # 计算匹配分数
            score = 0
            if id_key in filename_lower:
                score = len(id_key)  # 匹配的字符越多，分数越高
                
                # 如果完全匹配，给予更高分数
                if id_key == '_'.join(filename_lower.split('_')[1:-2]):  # 去掉 Workflow-X 和 draft 部分
                    score += 1000
                
                if score > best_score:
                    best_score = score
                    best_match = mapped_x_num
        
        # 如果找到更好的匹配，使用它
        if best_match and best_score > 10:  # 至少匹配10个字符
            x_num = best_match
        
        workflow_id = x_num.replace('X', '')  # 如 178 或 201
        
        # 查找映射
        if x_num in WORKFLOW_MAPPING:
            workflow_info = WORKFLOW_MAPPING[x_num]
            name = workflow_info['description']  # 使用简介作为名称
            description = workflow_info['description']  # 描述也是简介
            category = workflow_info['type']
            workflow_type = workflow_info['type_code']
            
            # 如果有步骤编号，且名称中没有"第X步"，则添加步骤信息
            if step_num and f'第{["一", "二", "三"][step_num-1]}步' not in name:
                name = f"{name} - 第{step_num}步"
                description = f"{description} - 第{step_num}步"
        else:
            # 如果没有映射，使用默认值
            workflow_type = 'W'
            category = '其他'
            name = f'工作流 #{workflow_id}'
            description = f'Coze 工作流模板 #{workflow_id}'
            if step_num:
                name += f' - 第{step_num}步'
                description += f' - 第{step_num}步'
        
        # 对于不同 X 编号但功能相同的情况，添加版本标识
        # 检查文件名中是否有版本号标识
        version_indicators = {
            'V54': 'V54版',
            'v2': 'V2版',
            'v3': 'V3版',
            'pro': '专业版',
            'new': '新版',
            'max': '增强版',
            '_mul': '多页版',
            'by_file': '文件版',
            'by_url': '链接版',
        }
        
        for indicator, label in version_indicators.items():
            if indicator.lower() in filename_lower and label not in name:
                name = f"{name} ({label})"
                description = f"{description} ({label})"
                break
        
        # 特殊处理：根据文件名中的特征添加更多区分信息
        special_cases = {
            # X7 vs X21 - 小红书笔记（根据文件名中的 W_ 和 T 区分）
            ('X7', 'W_red_word'): '(文档版)',
            ('X21', 'Tredbook_table'): '(表格版)',
            
            # X147 vs X183 - URL转换（根据版本号）
            ('X147', '_32_'): '(V32)',
            ('X183', '_589_'): '(V589)',
            
            # X91 vs X125 - 儿童哄睡（根据文件名特征）
            ('X91', 'ertonghongshui'): '(V1)',
            ('X125', 'children_to_leep'): '(V2)',
            
            # X66 vs X233 - 书单视频（根据序号）
            ('X66', 'shudananhei'): '(V1)',
            ('X233', 'V_shudan_anhei'): '(V2)',
            
            # X241 vs X242 - 电商宣传（根据文件名）
            ('X241', 'Vflux_dianshang'): '(Flux版)',
            ('X242', 'flux_video'): '(视频版)',
        }
        
        for (target_x, keyword), label in special_cases.items():
            if x_num == target_x and keyword.lower() in filename_lower and label not in name:
                name = f"{name} {label}"
                description = f"{description} {label}"
                break
        
        # 特殊处理：如果文件名中的 X 编号与匹配到的 X 编号不同，添加原始编号标识
        original_x_match = re.match(r'Workflow-(X_?\d+)', filename)
        if original_x_match:
            original_x = original_x_match.group(1).replace('_', '')
            if original_x != x_num:
                # 文件名 X 编号与匹配到的不同，添加原始编号
                name = f"{name} [原始:X{original_x.replace('X', '')}]"
                description = f"{description} [原始:X{original_x.replace('X', '')}]"
        
        return {
            'id': workflow_id,
            'filename': filename,
            'name': name,
            'category': category,
            'type': workflow_type,
            'source': 'community',
            'description': description,
            'tags': [category, 'Coze', 'AI'],
            'url': f'/api/download/{filename}'
        }
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return None

def pinyin_to_chinese(pinyin):
    """拼音转中文（简化映射）"""
    mapping = {
        'shipintiqu': '视频提取',
        'yuerhuiben': '月儿绘本',
        'xiangsufeng': '像素风',
        'laohuangli': '老黄历',
        'daojiaoxuanxue': '道教玄学',
        'wordstudy': '单词学习',
        'xioarenguo': '小人国',
        'children': '儿童',
        'gangqing': '感情',
        'jybgm': '教育背景音乐',
        'xingzuo': '星座',
        'gushici': '古诗词',
        'doubao': '豆包',
        'taobao': '淘宝',
        'expression': '表情',
        'konggu': '空谷',
        'nutrition': '营养',
        'gaixie': '改写',
        'caipin': '菜品',
        'zhishi': '知识',
        'removebg': '去背景',
        'nainai': '奶奶',
        'mingyan': '名言',
        'Sinology': '国学',
        'jianli': '简历',
        'guoming': '国名',
        'qinggan': '情感',
        'video2mp3': '视频转音频',
        'xhs': '小红书',
        'super': '超级',
        'table': '表格',
        'song': '歌曲',
        'down': '下载',
        'donghua': '动画',
        'danci': '单词',
        'captions': '字幕',
        'cure': '治愈',
        'grandpa': '爷爷',
        'YS': '语速',
        'stick': '贴纸',
        'psy': '心理',
        'book': '书籍',
        'legen': '传说',
        'img': '图片',
        'Historical': '历史',
        'story': '故事',
        'ztc': '职场',
        'guzhu': '古筝',
        'Mythical': '神话',
        'ifbook': '如果书',
        'canspeak': '会说话',
        'shudan': '书单',
        'zhiyu': '治愈',
        'girl': '女孩',
        'anhei': '暗黑',
        'english': '英语',
        'meinv': '美女',
        'tiaowu': '跳舞',
        'chengshi': '城市',
        'juex': '觉醒',
        'oumei': '欧美',
        'katong': '卡通',
        'flux': '流动',
        'dianshang': '电商',
        'zhexue': '哲学',
        'xiangyan': '香烟',
        'hecheng': '合成',
        'luoyan': '落雁',
        '3D': '3D',
        'new': '新',
        'dongwu': '动物',
        'yundong': '运动',
        'shangpin': '商品',
        'xuanchuan': '宣传',
        'lishi': '历史',
        'renwu': '人物',
        'gufeng': '古风',
        'yuer': '育儿',
        'jinri': '今日',
        'yulu': '语录',
        'jumao': '巨猫',
        'litiv': '励志',
        'guan': '观',
        'tianyuan': '田园',
        'hongshui': '洪水',
        'lizhi': '励志',
        'diyirencheng': '第一人称',
        'mn': '美女',
    }
    
    # 尝试匹配
    for key, value in mapping.items():
        if key.lower() in pinyin.lower():
            return value
    
    # 如果没有匹配，返回原始拼音（首字母大写）
    return pinyin.capitalize()

# 已移除 get_icon_by_category 函数，不再使用图标

def scan_workflows():
    """扫描工作流文件"""
    workflows_dict = {}  # 用于存储每个唯一键的最新版本
    
    if not WORKFLOWS_DIR.exists():
        print(f"Warning: Workflows directory not found: {WORKFLOWS_DIR}")
        return []
    
    for file in WORKFLOWS_DIR.glob('*.zip'):
        info = extract_workflow_info(file.name)
        if info:
            # 提取 draft 编号
            draft_match = re.search(r'-draft-(\d+)\.zip$', file.name)
            draft_num = int(draft_match.group(1)) if draft_match else 0
            
            # 创建唯一键：使用文件名中的原始 X 编号（不是匹配后的）
            # 这样可以避免不同的文件被错误地去重
            # 例如: X137_Vjy_draft_08 和 X144_Vdraft_03_01 会被视为不同的工作流
            
            # 提取文件名中的原始 X 编号
            original_x_match = re.match(r'Workflow-(X_?\d+)', file.name)
            if original_x_match:
                original_x = original_x_match.group(1).replace('_', '')
            else:
                original_x = info['id']
            
            # 使用原始 X 编号 + 文件名的前几个关键部分作为唯一键
            filename_parts = file.name.replace('Workflow-', '').split('_')
            
            # 取前3-4个部分作为唯一键（包含原始 X 编号）
            if len(filename_parts) >= 3:
                unique_key = f"{original_x}_{filename_parts[1]}_{filename_parts[2]}"
            else:
                unique_key = original_x
            
            # 如果这个键已经存在，比较 draft 编号，保留较新的
            if unique_key in workflows_dict:
                existing_draft = workflows_dict[unique_key]['draft_num']
                if draft_num > existing_draft:
                    # 新版本更新，替换
                    workflows_dict[unique_key] = {
                        'info': info,
                        'draft_num': draft_num,
                        'filename': file.name
                    }
            else:
                # 第一次遇到这个键
                workflows_dict[unique_key] = {
                    'info': info,
                    'draft_num': draft_num,
                    'filename': file.name
                }
    
    # 只返回工作流信息，不包含 draft_num
    return [item['info'] for item in workflows_dict.values()]

# 缓存工作流数据
WORKFLOWS_CACHE = None

def get_workflows():
    """获取工作流列表（带缓存）"""
    global WORKFLOWS_CACHE
    if WORKFLOWS_CACHE is None:
        WORKFLOWS_CACHE = scan_workflows()
    return WORKFLOWS_CACHE

@app.route('/')
def index():
    """首页"""
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """静态文件"""
    return send_from_directory('static', path)

@app.route('/api/workflows')
def api_workflows():
    """获取工作流列表"""
    try:
        workflows = get_workflows()
        
        # 获取查询参数
        query = request.args.get('q', '').lower()
        category = request.args.get('category', 'all')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # 筛选
        filtered = workflows
        
        if category != 'all':
            filtered = [w for w in filtered if w['category'] == category]
        
        if query:
            filtered = [w for w in filtered if 
                query in w['name'].lower() or 
                query in w['description'].lower() or
                any(query in tag.lower() for tag in w['tags'])]
        
        # 分页
        total = len(filtered)
        start = (page - 1) * per_page
        end = start + per_page
        paginated = filtered[start:end]
        
        return jsonify({
            'workflows': paginated,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats')
def api_stats():
    """获取统计信息"""
    try:
        workflows = get_workflows()
        categories = set(w['category'] for w in workflows)
        
        return jsonify({
            'total': len(workflows),
            'categories': len(categories),
            'official': 0,  # 社区版本没有官方数据
            'community': len(workflows)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories')
def api_categories():
    """获取分类列表"""
    try:
        workflows = get_workflows()
        categories = sorted(set(w['category'] for w in workflows))
        
        return jsonify({
            'categories': [{'id': cat, 'name': cat} for cat in categories]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/category-counts')
def api_category_counts():
    """获取各分类的工作流数量"""
    try:
        workflows = get_workflows()
        counts = {}
        
        for w in workflows:
            cat = w['category']
            counts[cat] = counts.get(cat, 0) + 1
        
        return jsonify({'counts': counts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>')
def api_download(filename):
    """下载工作流文件"""
    try:
        file_path = WORKFLOWS_DIR / filename
        if file_path.exists():
            return send_from_directory(WORKFLOWS_DIR, filename, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/refresh')
def api_refresh():
    """刷新缓存"""
    global WORKFLOWS_CACHE
    WORKFLOWS_CACHE = None
    workflows = get_workflows()
    return jsonify({
        'message': 'Cache refreshed',
        'total': len(workflows)
    })

if __name__ == '__main__':
    print("=" * 60)
    print("🤖 Coze 工作流展示服务器 - Neubrutalism 风格")
    print("=" * 60)
    print(f"📁 工作流目录: {WORKFLOWS_DIR}")
    print(f"🌐 访问地址: http://localhost:4004")
    print(f"🔄 API 端点: http://localhost:4004/api/workflows")
    print("=" * 60)
    
    # 预加载工作流
    workflows = get_workflows()
    print(f"✅ 已加载 {len(workflows)} 个工作流")
    
    # 显示分类统计
    categories = {}
    for w in workflows:
        cat = w['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n📊 分类统计:")
    for cat, count in sorted(categories.items()):
        print(f"  {cat}: {count}")
    
    print("\n🚀 服务器启动中...\n")
    
    app.run(host='0.0.0.0', port=4004, debug=True)
