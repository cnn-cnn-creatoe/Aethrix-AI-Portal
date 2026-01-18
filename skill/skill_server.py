#!/usr/bin/env python3
"""
AI Skill API Server

Flask 后端服务器，提供 Skills 数据的 RESTful API
端口: 4004
"""

from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
from pathlib import Path
from datetime import datetime
import random
import io
import zipfile

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)  # 启用 CORS

# 配置
app.config['JSON_AS_ASCII'] = False
app.config['JSON_SORT_KEYS'] = False

# 加载 Skills 数据
SKILLS_FILE = Path(__file__).parent / 'skills.json'
skills_data = []

def load_skills():
    """加载 Skills 数据"""
    global skills_data
    try:
        with open(SKILLS_FILE, 'r', encoding='utf-8') as f:
            skills_data = json.load(f)
        print(f"✅ 加载了 {len(skills_data)} 个 Skills")
    except Exception as e:
        print(f"❌ 加载 Skills 失败: {e}")
        skills_data = []

# 启动时加载数据
load_skills()

# ============================================================================
# 辅助函数
# ============================================================================

def success_response(data, meta=None):
    """成功响应"""
    response = {
        'success': True,
        'data': data,
        'meta': meta or {
            'timestamp': datetime.now().isoformat() + 'Z',
            'version': '1.0'
        }
    }
    return jsonify(response)

def error_response(code, message, details=None, status_code=400):
    """错误响应"""
    response = {
        'success': False,
        'error': {
            'code': code,
            'message': message,
            'details': details or {}
        },
        'meta': {
            'timestamp': datetime.now().isoformat() + 'Z',
            'version': '1.0'
        }
    }
    return jsonify(response), status_code

def filter_skills(skills, category=None, platform=None, languages=None, complexity=None, q=None):
    """筛选 Skills"""
    filtered = skills
    
    # 分类筛选
    if category:
        filtered = [s for s in filtered if s.get('category') == category]
    
    # 平台筛选（支持多选）
    if platform:
        platforms = [p.strip() for p in platform.split(',')]
        filtered = [s for s in filtered if any(p in s.get('platforms', []) for p in platforms)]
    
    # 语言筛选（支持多选）
    if languages:
        langs = [l.strip() for l in languages.split(',')]
        filtered = [s for s in filtered if any(l in s.get('languages', []) for l in langs)]
    
    # 复杂度筛选
    if complexity:
        filtered = [s for s in filtered if s.get('complexity') == complexity]
    
    # 搜索（name, description, tags, languages）
    if q:
        q_lower = q.lower()
        filtered = [
            s for s in filtered
            if q_lower in s.get('name', '').lower()
            or q_lower in s.get('description', '').lower()
            or any(q_lower in tag.lower() for tag in s.get('tags', []))
            or any(q_lower in lang.lower() for lang in s.get('languages', []))
        ]
    
    return filtered

def sort_skills(skills, sort_by='latest'):
    """排序 Skills"""
    if sort_by == 'latest':
        return sorted(skills, key=lambda s: s.get('lastUpdated', ''), reverse=True)
    elif sort_by == 'popular':
        return sorted(skills, key=lambda s: s.get('stats', {}).get('downloads', 0), reverse=True)
    elif sort_by == 'random':
        shuffled = skills.copy()
        random.shuffle(shuffled)
        return shuffled
    return skills

def paginate(items, page=1, per_page=20):
    """分页"""
    total = len(items)
    total_pages = (total + per_page - 1) // per_page
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        'items': items[start:end],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }

# ============================================================================
# API 端点
# ============================================================================

@app.route('/')
def index():
    """主页"""
    return app.send_static_file('index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查"""
    return success_response({
        'status': 'healthy',
        'version': '1.0',
        'skills_count': len(skills_data)
    })

@app.route('/api/reload', methods=['GET', 'POST'])
def reload_data():
    """重新加载 Skills 数据"""
    load_skills()
    return success_response({
        'status': 'reloaded',
        'skills_count': len(skills_data)
    })

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """获取 Skills 列表"""
    try:
        # 获取查询参数
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        category = request.args.get('category')
        platform = request.args.get('platform')
        languages = request.args.get('languages')
        complexity = request.args.get('complexity')
        sort_by = request.args.get('sort', 'latest')
        q = request.args.get('q')
        
        # 筛选
        filtered = filter_skills(
            skills_data,
            category=category,
            platform=platform,
            languages=languages,
            complexity=complexity,
            q=q
        )
        
        # 排序
        sorted_skills = sort_skills(filtered, sort_by)
        
        # 分页
        result = paginate(sorted_skills, page, per_page)
        
        # 构建响应
        data = {
            'skills': result['items'],
            'pagination': result['pagination'],
            'filters': {
                'category': category,
                'platform': platform.split(',') if platform else [],
                'languages': languages.split(',') if languages else [],
                'complexity': complexity,
                'sort': sort_by,
                'q': q
            }
        }
        
        return success_response(data)
        
    except ValueError as e:
        return error_response('INVALID_REQUEST', f'无效的参数: {str(e)}')
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/skills/<skill_id>', methods=['GET'])
def get_skill(skill_id):
    """获取单个 Skill 详情"""
    try:
        # 支持 ID 或 slug
        skill = next(
            (s for s in skills_data if s.get('id') == skill_id or s.get('slug') == skill_id),
            None
        )
        
        if not skill:
            return error_response('NOT_FOUND', 'Skill 不存在', {'id': skill_id}, 404)
        
        return success_response(skill)
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/skills/search', methods=['GET'])
def search_skills():
    """搜索 Skills"""
    try:
        q = request.args.get('q')
        if not q:
            return error_response('INVALID_REQUEST', '缺少搜索关键词 q')
        
        page = int(request.args.get('page', 1))
        per_page = min(int(request.args.get('per_page', 20)), 100)
        category = request.args.get('category')
        platform = request.args.get('platform')
        
        # 搜索
        filtered = filter_skills(
            skills_data,
            category=category,
            platform=platform,
            q=q
        )
        
        # 计算相关度（简单实现）
        for skill in filtered:
            relevance = 0
            q_lower = q.lower()
            if q_lower in skill.get('name', '').lower():
                relevance += 0.5
            if q_lower in skill.get('description', '').lower():
                relevance += 0.3
            if any(q_lower in tag.lower() for tag in skill.get('tags', [])):
                relevance += 0.2
            skill['relevance'] = min(relevance, 1.0)
        
        # 按相关度排序
        sorted_skills = sorted(filtered, key=lambda s: s.get('relevance', 0), reverse=True)
        
        # 分页
        result = paginate(sorted_skills, page, per_page)
        
        data = {
            'query': q,
            'results': result['items'],
            'pagination': result['pagination']
        }
        
        return success_response(data)
        
    except ValueError as e:
        return error_response('INVALID_REQUEST', f'无效的参数: {str(e)}')
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/skills/<skill_id>/download', methods=['GET'])
def download_file(skill_id):
    """下载 Skill 文件"""
    try:
        # 查找 Skill
        skill = next(
            (s for s in skills_data if s.get('id') == skill_id or s.get('slug') == skill_id),
            None
        )
        
        if not skill:
            return error_response('NOT_FOUND', 'Skill 不存在', {'id': skill_id}, 404)
        
        # 获取文件名
        filename = request.args.get('file')
        if not filename:
            return error_response('INVALID_REQUEST', '缺少文件名参数 file')
        
        # 查找文件
        file_info = next(
            (f for f in skill.get('files', []) if f.get('name') == filename),
            None
        )
        
        if not file_info:
            return error_response('FILE_NOT_FOUND', '文件不存在', {'file': filename}, 404)
        
        # 生成示例文件内容
        content = f"""# {skill.get('name')}

{skill.get('longDescription', skill.get('description', ''))}

## Category
{skill.get('category')}

## Platforms
{', '.join(skill.get('platforms', []))}

## Languages
{', '.join(skill.get('languages', []))}

## Tags
{', '.join(skill.get('tags', []))}

## Usage
This is a sample {filename} file for {skill.get('name')}.

---
Generated by AI Skill API
"""
        
        # 返回文件
        return send_file(
            io.BytesIO(content.encode('utf-8')),
            mimetype='text/plain',
            as_attachment=True,
            download_name=filename
        )
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/skills/<skill_id>/download-all', methods=['GET'])
def download_all_files(skill_id):
    """下载 Skill 所有文件（ZIP）"""
    try:
        # 查找 Skill
        skill = next(
            (s for s in skills_data if s.get('id') == skill_id or s.get('slug') == skill_id),
            None
        )
        
        if not skill:
            return error_response('NOT_FOUND', 'Skill 不存在', {'id': skill_id}, 404)
        
        # 创建 ZIP 文件
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file_info in skill.get('files', []):
                filename = file_info.get('name')
                content = f"""# {skill.get('name')} - {filename}

{skill.get('longDescription', skill.get('description', ''))}

This is a sample file for {skill.get('name')}.
"""
                zip_file.writestr(filename, content)
        
        zip_buffer.seek(0)
        
        # 返回 ZIP 文件
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"{skill.get('slug')}.zip"
        )
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """获取分类统计"""
    try:
        # 统计分类
        category_map = {
            'frontend': {'name': '前端开发', 'icon': '💻'},
            'backend': {'name': '后端开发', 'icon': '⚙️'},
            'mobile': {'name': '移动开发', 'icon': '📱'},
            'ai-ml': {'name': 'AI/ML开发', 'icon': '🤖'},
            'devops': {'name': 'DevOps与部署', 'icon': '🔧'},
            'testing': {'name': '测试与质量', 'icon': '✅'},
            'tools': {'name': '工具与实用', 'icon': '🛠️'},
            'platform-specific': {'name': '特定平台', 'icon': '🎯'},
            'repositories': {'name': '官方仓库', 'icon': '🏛️'}
        }
        
        category_counts = {}
        for skill in skills_data:
            cat = skill.get('category')
            category_counts[cat] = category_counts.get(cat, 0) + 1
        
        categories = [
            {
                'id': cat_id,
                'name': cat_info['name'],
                'icon': cat_info['icon'],
                'count': category_counts.get(cat_id, 0)
            }
            for cat_id, cat_info in category_map.items()
        ]
        
        data = {
            'categories': categories,
            'total': len(skills_data)
        }
        
        return success_response(data)
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/platforms', methods=['GET'])
def get_platforms():
    """获取平台统计"""
    try:
        platform_map = {
            'cursor': {'name': 'Cursor', 'icon': '💻'},
            'kiro': {'name': 'Kiro', 'icon': '🤖'},
            'claude': {'name': 'Claude', 'icon': '🎭'},
            'windsurf': {'name': 'Windsurf', 'icon': '🏄'},
            'copilot': {'name': 'GitHub Copilot', 'icon': '🚁'},
            'trae': {'name': 'Trae', 'icon': '🚀'},
            'antigravity': {'name': 'Google Antigravity', 'icon': '🌌'},
            'codex': {'name': 'GPT Codex', 'icon': '🧠'}
        }
        
        platform_counts = {}
        for skill in skills_data:
            for platform in skill.get('platforms', []):
                platform_counts[platform] = platform_counts.get(platform, 0) + 1
        
        platforms = [
            {
                'id': plat_id,
                'name': plat_info['name'],
                'icon': plat_info['icon'],
                'count': platform_counts.get(plat_id, 0)
            }
            for plat_id, plat_info in platform_map.items()
        ]
        
        data = {
            'platforms': platforms,
            'total': len(skills_data)
        }
        
        return success_response(data)
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

@app.route('/api/languages', methods=['GET'])
def get_languages():
    """获取技术栈列表"""
    try:
        language_counts = {}
        language_categories = {}
        
        for skill in skills_data:
            category = skill.get('category')
            for lang in skill.get('languages', []):
                language_counts[lang] = language_counts.get(lang, 0) + 1
                if lang not in language_categories:
                    language_categories[lang] = category
        
        languages = [
            {
                'name': lang,
                'count': count,
                'category': language_categories.get(lang, 'tools')
            }
            for lang, count in sorted(language_counts.items(), key=lambda x: x[1], reverse=True)
        ]
        
        data = {
            'languages': languages,
            'total': len(languages)
        }
        
        return success_response(data)
        
    except Exception as e:
        return error_response('SERVER_ERROR', '服务器内部错误', {'error': str(e)}, 500)

# ============================================================================
# 错误处理
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return error_response('NOT_FOUND', '资源不存在', status_code=404)

@app.errorhandler(500)
def internal_error(error):
    return error_response('SERVER_ERROR', '服务器内部错误', status_code=500)

# ============================================================================
# 启动服务器
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 AI Skill API Server")
    print("=" * 60)
    print(f"📊 Skills 数量: {len(skills_data)}")
    print(f"🌐 服务地址: http://localhost:4005")
    print(f"📖 API 文档: http://localhost:4005/api/health")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=4005,
        debug=True
    )
