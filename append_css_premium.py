
css_content = """

/* ============================================================================
   分组布局与高级卡片样式 (Redesign)
   ============================================================================ */
.tool-groups-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.tool-group-title, .group-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-dark);
    padding-left: 12px;
    border-left: 4px solid var(--card-purple);
}

.tool-card-premium {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
    background: #fff; /* White background */
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.tool-card-premium:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.04);
    border-color: rgba(99, 102, 241, 0.2);
}

.tool-card-premium .tool-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.tool-card-premium .tool-icon-wrapper i {
    width: 26px;
    height: 26px;
    color: white;
}

/* 多彩图标背景 */
.icon-bg-purple { background: linear-gradient(135deg, #a855f7, #6366f1); }
.icon-bg-pink { background: linear-gradient(135deg, #ec4899, #d946ef); }
.icon-bg-blue { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
.icon-bg-orange { background: linear-gradient(135deg, #f97316, #f59e0b); }
.icon-bg-green { background: linear-gradient(135deg, #10b981, #34d399); }
.icon-bg-yellow { background: linear-gradient(135deg, #eab308, #facc15); }
.icon-bg-red { background: linear-gradient(135deg, #ef4444, #f87171); }
.icon-bg-dark { background: linear-gradient(135deg, #1f2937, #4b5563); }

.tool-card-premium .tool-info h4 {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 6px 0;
    letter-spacing: -0.01em;
}

.tool-card-premium .tool-info p {
    font-size: 0.85rem;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
"""

file_path = r"d:\dokcer-software\opensource\opensource\prompt-workshop\static\style.css"
with open(file_path, "a", encoding="utf-8") as f:
    f.write(css_content)

print("Premium CSS appended successfully.")
