/**
 * theme-manager.js
 * Handles theme state management and toggling for the entire application.
 * Shared between index.html and tools.html.
 */

(function () {
    // 1. Initial State Setup (Run immediately)
    const savedTheme = localStorage.getItem('hero-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body && document.body.setAttribute('data-theme', savedTheme);

    // 2. Global Toggle Function
    window.toggleTheme = function () {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        setTheme(newTheme);
    };

    // 3. Set Theme Internal Function
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('hero-theme', theme);

        // Update UI Icons (for both Tools and Index page structures)
        updateThemeIcons(theme);

        // Sync with any animation managers
        if (window.heroAnimationManager && window.heroAnimationManager.themeManager) {
            window.heroAnimationManager.themeManager.setTheme(theme);
        }
    }

    // 4. Update Icons
    function updateThemeIcons(theme) {
        // IDs used in the project
        const buttons = [
            document.getElementById('nav-theme-toggle'),   // Index Page
            document.getElementById('tools-theme-toggle')  // Tools Page
        ];

        buttons.forEach(btn => {
            if (!btn) return;

            // Selectors for sun/moon icons
            // Tools page uses .theme-icon--*, Index page uses .nav-control-icon--*
            const sunIcon = btn.querySelector('.theme-icon--sun, .nav-control-icon--sun');
            const moonIcon = btn.querySelector('.theme-icon--moon, .nav-control-icon--moon');

            if (theme === 'dark') {
                // In Dark Mode: Show Sun (switch to light)
                if (sunIcon) {
                    sunIcon.style.display = 'block';
                    // Override any inline styles possibly set by legacy code
                    sunIcon.style.setProperty('display', 'block', 'important');
                }
                if (moonIcon) {
                    moonIcon.style.display = 'none';
                    moonIcon.style.setProperty('display', 'none', 'important');
                }
                btn.setAttribute('aria-label', 'Switch to light mode');
            } else {
                // In Light Mode: Show Moon (switch to dark)
                if (sunIcon) {
                    sunIcon.style.display = 'none';
                    sunIcon.style.setProperty('display', 'none', 'important');
                }
                if (moonIcon) {
                    moonIcon.style.display = 'block';
                    moonIcon.style.setProperty('display', 'block', 'important');
                }
                btn.setAttribute('aria-label', 'Switch to dark mode');
            }
        });
    }

    // 5. Initialize on Load
    function init() {
        const currentTheme = localStorage.getItem('hero-theme') || 'dark';
        setTheme(currentTheme);

        // Bind clicks for any buttons found
        bindThemeButtons();
    }

    // Bind theme toggle buttons
    function bindThemeButtons() {
        const buttonIds = ['nav-theme-toggle', 'tools-theme-toggle'];

        buttonIds.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                // Use addEventListener for more reliable binding
                // Remove any existing listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                newBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.toggleTheme();
                });
                console.log(`✅ Theme toggle bound to #${id}`);
            }
        });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle bfcache (Back/Forward Cache) restores
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            init();
        }
    });

})();

// Define checkLoginAndGo globally if not exists
if (typeof window.checkLoginAndGo === 'undefined') {
    window.checkLoginAndGo = function (event) {
        if (event) event.preventDefault();
        // Simple navigation for now, can be enhanced with auth check
        window.location.href = 'tools.html';
    };
}
