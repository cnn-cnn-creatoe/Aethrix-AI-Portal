
css_content = """
/* Mini Tool Card Styles for Bento Grid */
.tool-card-mini {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1.25rem;
    text-decoration: none;
    color: #1e293b; /* Fallback text color */
    transition: all 0.3s ease;
    border: 1px solid #e2e8f0;
}

.tool-card-mini:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.card-icon-small {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
}

.card-icon-small i {
    width: 18px;
    height: 18px;
    color: white;
}

.card-content-mini h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #1e293b;
}

.card-content-mini p {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Specific Card Colors Override */
.card-yellow { background: linear-gradient(135deg, #fffbeb, #ffffff); }
.card-purple { background: linear-gradient(135deg, #f3e8ff, #ffffff); }
.card-pink { background: linear-gradient(135deg, #fce7f3, #ffffff); }

.card-yellow:hover { border-color: #f59e0b; }
.card-purple:hover { border-color: #9333ea; }
/* .card-pink:hover { border-color: #ec4899; } - Krea uses pink */

.bento-more-replace {
    /* Special styling if needed */
}
"""

with open('prompt-workshop/static/style.css', 'a', encoding='utf-8') as f:
    f.write(css_content)
print("Mini card CSS appended successfully.")
