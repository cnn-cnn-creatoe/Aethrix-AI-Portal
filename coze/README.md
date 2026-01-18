# 🤖 Coze 工作流库 - Neubrutalism 风格

一个大胆、有个性的 Coze 工作流展示平台，采用 Neubrutalism 设计风格。

## ✨ 特性

- 🎨 **Neubrutalism 设计**: 大胆的配色、粗黑边框、4px 阴影
- 🔍 **智能搜索**: 实时搜索工作流名称、描述、标签
- 🏷️ **分类筛选**: 按分类快速筛选工作流
- 🎲 **随机发现**: 随机展示工作流，发现新内容
- 📱 **响应式设计**: 完美适配桌面和移动设备
- ⚡ **高性能**: 快速加载，流畅交互

## 🚀 快速开始

### 1. 安装依赖

```bash
pip install flask flask-cors
```

### 2. 启动服务器

**Windows:**
```bash
start-coze.bat
```

**Linux/Mac:**
```bash
python coze_server.py
```

### 3. 访问网站

打开浏览器访问: http://localhost:4004

## 📁 项目结构

```
coze/
├── static/
│   ├── index.html          # 主页面
│   └── app.js              # 前端逻辑
├── cozeworkflows-main/     # 工作流数据
│   └── cozeworkflows-main/
│       └── 工作流200+合集分享/
├── coze_server.py          # 后端服务器
├── start-coze.bat          # Windows 启动脚本
└── README.md               # 说明文档
```

## 🎨 设计风格

### Neubrutalism 特点

- **配色方案**:
  - 主色: `#FFEB3B` (黄色)
  - 次色: `#FF5252` (红色)
  - 强调: `#2196F3` (蓝色)
  - 边框: `#000000` (黑色)

- **视觉元素**:
  - 4px 黑色边框
  - 4px 黑色阴影
  - 扁平色块
  - 大字体标题
  - 不对称布局

- **字体**:
  - 标题: Space Grotesk (900 weight)
  - 正文: Inter

## 🔌 API 端点

### 获取工作流列表
```
GET /api/workflows?q=搜索词&category=分类&page=1&per_page=20
```

### 获取统计信息
```
GET /api/stats
```

### 获取分类列表
```
GET /api/categories
```

### 获取分类计数
```
GET /api/category-counts
```

### 下载工作流
```
GET /api/download/<filename>
```

### 刷新缓存
```
GET /api/refresh
```

## 📊 数据源

### 社区工作流
- 来源: `工作流200+合集分享` 目录
- 格式: ZIP 文件
- 命名规则: `Workflow-X{id}_{type}{name}_{desc}-draft-{num}.zip`

### 官方工作流（待集成）
- 来源: https://www.coze.cn/template
- 状态: 计划中

## 🛠️ 自定义

### 修改配色

编辑 `static/index.html` 中的 CSS 变量:

```css
:root {
  --yellow: #FFEB3B;
  --red: #FF5252;
  --blue: #2196F3;
  /* ... */
}
```

### 添加新分类

编辑 `coze_server.py` 中的 `CATEGORY_MAP`:

```python
CATEGORY_MAP = {
    'V': '视频',
    'P': '图片',
    'W': '文档',
    # 添加新分类...
}
```

## 🐛 故障排除

### 端口被占用
如果 4004 端口被占用，修改 `coze_server.py` 最后一行:
```python
app.run(host='0.0.0.0', port=4005, debug=True)  # 改为其他端口
```

### 工作流目录未找到
确保 `cozeworkflows-main/cozeworkflows-main/工作流200+合集分享/` 目录存在且包含 ZIP 文件。

### 样式显示异常
清除浏览器缓存后重新加载页面 (Ctrl+Shift+R)。

## 📝 待办事项

- [ ] 集成 Coze 官方模板 API
- [ ] 添加工作流详情预览
- [ ] 支持工作流收藏功能
- [ ] 添加用户评分系统
- [ ] 实现工作流标签云
- [ ] 支持多语言切换

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**Made with ❤️ using Neubrutalism Design**
