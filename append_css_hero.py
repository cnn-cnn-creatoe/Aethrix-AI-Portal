
css_content = """
/* Creative Hero Styles */
.hero-creative {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); /* Indigo tint */
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2.5rem !important;
    border: none !important;
}

.hero-visual-abstract {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}

.abstract-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: floatAnimation 15s infinite alternate ease-in-out;
}

.shape-1 {
    width: 300px;
    height: 300px;
    background: #a855f7; /* Purple */
    top: -100px;
    right: -50px;
}

.shape-2 {
    width: 250px;
    height: 250px;
    background: #3b82f6; /* Blue */
    bottom: -50px;
    left: -50px;
    animation-delay: -5s;
}

.shape-3 {
    width: 150px;
    height: 150px;
    background: #f43f5e; /* Rose */
    top: 20%;
    right: 30%;
    animation-delay: -10s;
    opacity: 0.3;
}

@keyframes floatAnimation {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.1); }
}

.hero-content.relative {
    position: relative;
    z-index: 10;
}

.hero-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title-creative {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1;
    margin-bottom: 1.5rem;
    letter-spacing: -0.05em;
    font-family: system-ui, -apple-system, sans-serif;
}

.text-gradient-creative {
    background: linear-gradient(to right, #facc15, #f472b6); /* Yellow to Pink */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
}

.hero-subtitle-creative {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 2.5rem;
    font-weight: 400;
    max-width: 80%;
}

.hero-stats-row {
    display: flex;
    gap: 1.5rem;
}

.stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
}

/* Red Card Support */
.card-red { background: linear-gradient(135deg, #ffe4e6, #ffffff); }
.card-red:hover { border-color: #f43f5e; box-shadow: 0 4px 6px -1px rgba(244, 63, 94, 0.1); }
.icon-bg-red { background: linear-gradient(135deg, #f43f5e, #fb7185); color: white; }
"""

with open('prompt-workshop/static/style.css', 'a', encoding='utf-8') as f:
    f.write(css_content)
print("Hero CSS appended successfully.")
