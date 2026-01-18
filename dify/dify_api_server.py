#!/usr/bin/env python3
"""
Dify 工作流库 API 服务器
端口: 4002
"""

import os
import json
import re
import yaml
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_cors import CORS

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# 工作流目录配置
WORKFLOW_DIRS = [
    'Awesome-Dify-Workflow-main/Awesome-Dify-Workflow-main/DSL',
    '闲鱼dify工作流/可参考的dify工作流模板',
    '闲鱼dify工作流/工作流/工作流',
    '闲鱼dify工作流/闲鱼dify工作流/workflow'
]

BASE_DIR = Path(__file__).parent

# 分类关键词映射
CATEGORY_KEYWORDS = {
    'translation': {
        'name': '翻译&语言',
        'keywords': ['翻译', '译', 'translate', 'translation', '英译中', '中译英', '多语言', 'language']
    },
    'content': {
        'name': '内容创作',
        'keywords': ['文章', '标题', '写作', '文案', '创作', 'seo', '仿写', '小红书', '抖音', '运营', '博客']
    },
    'ai-art': {
        'name': 'AI 绘画',
        'keywords': ['绘画', '画图', '图像', 'flux', '即梦', '插画', '绘本', '图片', 'image', 'art', 'draw']
    },
    'data-analysis': {
        'name': '数据分析',
        'keywords': ['数据', '分析', '统计', '股票', 'excel', '表格', 'chart', '图表', 'matplotlib']
    },
    'document': {
        'name': '文档处理',
        'keywords': ['文档', '发票', '合同', 'pdf', '知识库', '文件', 'file', 'document', '解析']
    },
    'chatbot': {
        'name': '聊天机器人',
        'keywords': ['聊天', '客服', '对话', '意图', '记忆', 'chat', 'bot', '问答', '机器人']
    },
    'code': {
        'name': '代码开发',
        'keywords': ['代码', 'code', 'python', 'coding', 'api', 'sql', '编程', '开发']
    },
    'research': {
        'name': '搜索&研究',
        'keywords': ['搜索', '研究', 'search', 'research', 'jina', '爬虫', '网页', 'web']
    },
    'agent': {
        'name': 'Agent&工具',
        'keywords': ['agent', 'mcp', '工具', 'tool', '智能体', 'flow']
    },
    'education': {
        'name': '教育学习',
        'keywords': ['学习', '教育', '教学', '题目', '面试', '培训', '课程', '学生']
    },
    'media': {
        'name': '媒体&视频',
        'keywords': ['视频', '音频', '语音', 'tts', '播客', 'youtube', '媒体', 'video', 'audio']
    },
    'utility': {
        'name': '实用工具',
        'keywords': ['工具', 'json', '春联', '思维导图', '邮件', '表单', 'form', '生成器']
    }
}

def get_category(filename, content=''):
    """根据文件名和内容判断分类"""
    text = (filename + ' ' + content).lower()
    
    for cat_id, cat_info in CATEGORY_KEYWORDS.items():
        for keyword in cat_info['keywords']:
            if keyword.lower() in text:
                return cat_id
    return 'utility'

def parse_workflow_file(filepath):
    """解析工作流文件"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            data = yaml.safe_load(content)
            
        if not data:
            return None
            
        # 提取基本信息
        app_info = data.get('app', {})
        name = app_info.get('name', '') or data.get('name', '') or filepath.stem
        description = app_info.get('description', '') or data.get('description', '') or ''
        icon = app_info.get('icon', '🤖')
        mode = app_info.get('mode', 'workflow')  # workflow, chatflow, agent-chat, completion
        
        # 标准化模式显示
        mode_display = {
            'workflow': 'Workflow',
            'chatflow': 'Chatflow', 
            'agent-chat': 'Agent',
            'advanced-chat': 'Agent',
            'completion': 'Completion'
        }.get(mode, mode)
        
        # 获取工作流图
        workflow = data.get('workflow', {})
        graph = workflow.get('graph', {})
        
        # 统计节点
        nodes = graph.get('nodes', [])
        node_count = len(nodes) if isinstance(nodes, list) else 0
        
        # 统计连接数
        edges = graph.get('edges', [])
        edge_count = len(edges) if isinstance(edges, list) else 0
        
        # 提取节点类型和使用的模型
        node_types = {}
        models_used = set()
        llm_count = 0
        code_count = 0
        
        if isinstance(nodes, list):
            for node in nodes:
                node_data = node.get('data', {})
                node_type = node_data.get('type', '') or node.get('type', '')
                
                if node_type:
                    # 统计节点类型
                    if node_type not in ['custom', 'custom-note', 'custom-iteration-start']:
                        node_types[node_type] = node_types.get(node_type, 0) + 1
                    
                    # 统计 LLM 节点
                    if node_type == 'llm':
                        llm_count += 1
                        # 提取模型信息
                        model_info = node_data.get('model', {})
                        model_name = model_info.get('name', '')
                        provider = model_info.get('provider', '')
                        if model_name:
                            models_used.add(f"{provider}/{model_name}" if provider else model_name)
                    
                    # 统计代码节点
                    if node_type == 'code':
                        code_count += 1
        
        # 格式化节点类型显示
        node_type_list = []
        type_display = {
            'llm': 'LLM',
            'code': '代码',
            'start': '开始',
            'end': '结束',
            'iteration': '迭代',
            'if-else': '条件',
            'variable-assigner': '变量',
            'template-transform': '模板',
            'http-request': 'HTTP',
            'tool': '工具',
            'knowledge-retrieval': '知识库'
        }
        for t, count in node_types.items():
            display = type_display.get(t, t)
            node_type_list.append(f"{display}×{count}")
        
        return {
            'name': name,
            'description': description,
            'icon': icon,
            'mode': mode,
            'mode_display': mode_display,
            'node_count': node_count,
            'edge_count': edge_count,
            'llm_count': llm_count,
            'code_count': code_count,
            'node_types': node_type_list[:6],
            'models_used': list(models_used)[:3],
            'raw_content': content
        }
    except Exception as e:
        return None

def scan_workflows():
    """扫描所有工作流文件"""
    workflows = {}
    
    for dir_path in WORKFLOW_DIRS:
        full_path = BASE_DIR / dir_path
        if not full_path.exists():
            continue
            
        for filepath in full_path.rglob('*.yml'):
            # 跳过已处理的同名文件
            filename = filepath.name
            if filename in workflows:
                continue
                
            parsed = parse_workflow_file(filepath)
            if parsed:
                category = get_category(filename, parsed.get('description', ''))
                workflows[filename] = {
                    'filename': filename,
                    'name': parsed['name'] or filename.replace('.yml', ''),
                    'description': parsed['description'] or '暂无描述',
                    'icon': parsed.get('icon', '🤖'),
                    'mode': parsed.get('mode', 'workflow'),
                    'category': category,
                    'node_count': parsed['node_count'],
                    'edge_count': parsed.get('edge_count', 0),
                    'llm_count': parsed.get('llm_count', 0),
                    'code_count': parsed.get('code_count', 0),
                    'node_types': parsed.get('node_types', []),
                    'models_used': parsed.get('models_used', []),
                    'source_dir': dir_path,
                    'full_path': str(filepath)
                }
    
    return workflows

# 缓存工作流数据
WORKFLOWS_CACHE = None

def get_workflows():
    global WORKFLOWS_CACHE
    if WORKFLOWS_CACHE is None:
        WORKFLOWS_CACHE = scan_workflows()
    return WORKFLOWS_CACHE

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/stats')
def get_stats():
    workflows = get_workflows()
    total_nodes = sum(w['node_count'] for w in workflows.values())
    total_llm = sum(w['llm_count'] for w in workflows.values())
    total_edges = sum(w['edge_count'] for w in workflows.values())
    
    # 统计所有使用的模型
    all_models = set()
    for w in workflows.values():
        all_models.update(w.get('models_used', []))
    
    return jsonify({
        'total': len(workflows),
        'total_nodes': total_nodes,
        'total_llm': total_llm,
        'total_edges': total_edges,
        'unique_models': len(all_models),
        'categories': len(CATEGORY_KEYWORDS)
    })

@app.route('/api/categories')
def get_categories():
    return jsonify({
        'categories': [{'id': k, 'name': v['name']} for k, v in CATEGORY_KEYWORDS.items()]
    })

@app.route('/api/workflows')
def list_workflows():
    workflows = get_workflows()
    
    # 筛选参数
    q = request.args.get('q', '').lower()
    category = request.args.get('category', 'all')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    # 过滤
    filtered = []
    for w in workflows.values():
        if category != 'all' and w['category'] != category:
            continue
        if q and q not in w['name'].lower() and q not in w['description'].lower():
            continue
        filtered.append(w)
    
    # 排序
    filtered.sort(key=lambda x: x['node_count'], reverse=True)
    
    # 分页
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = filtered[start:end]
    
    return jsonify({
        'workflows': paginated,
        'total': total,
        'page': page,
        'pages': (total + per_page - 1) // per_page
    })

@app.route('/api/workflows/<filename>')
def get_workflow(filename):
    workflows = get_workflows()
    if filename not in workflows:
        return jsonify({'error': 'Not found'}), 404
    
    w = workflows[filename]
    filepath = Path(w['full_path'])
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        raw_yaml = yaml.safe_load(content)
    except:
        raw_yaml = {}
    
    return jsonify({
        **w,
        'raw_yaml': raw_yaml
    })

@app.route('/api/workflows/<filename>/download')
def download_workflow(filename):
    workflows = get_workflows()
    if filename not in workflows:
        return jsonify({'error': 'Not found'}), 404
    
    filepath = Path(workflows[filename]['full_path'])
    return send_file(filepath, as_attachment=True, download_name=filename)

@app.route('/api/category-counts')
def get_category_counts():
    workflows = get_workflows()
    counts = {}
    for cat_id in CATEGORY_KEYWORDS:
        counts[cat_id] = 0
    
    for w in workflows.values():
        cat = w.get('category', 'utility')
        if cat in counts:
            counts[cat] += 1
    
    return jsonify({'counts': counts})

if __name__ == '__main__':
    print("正在扫描 Dify 工作流...")
    workflows = get_workflows()
    print(f"找到 {len(workflows)} 个工作流")
    print("启动服务器: http://localhost:4003")
    app.run(host='0.0.0.0', port=4003, debug=True)
