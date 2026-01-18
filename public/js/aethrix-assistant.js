(function ensureAethrixAssistant() {
  const setImportant = (el, prop, value) => {
    if (!el) return;
    el.style.setProperty(prop, value, 'important');
  };

  const createAssistantIfMissing = () => {
    if (document.getElementById('aethrix-assistant')) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="aethrix-assistant" id="aethrix-assistant" aria-label="Aethrix 助手" style="position: fixed !important; bottom: 28px !important; right: 28px !important; z-index: 2147483000 !important; display: flex !important; align-items: center !important; gap: 12px !important; visibility: visible !important; opacity: 1 !important; pointer-events: auto !important; min-width: 72px !important; min-height: 72px !important;">
        <div class="aethrix-icon" id="aethrix-icon" role="button" tabindex="0" aria-label="打开AI助手" aria-expanded="false" style="position: relative; width: 60px; height: 60px; min-width: 60px; min-height: 60px; cursor: pointer; display: block !important; visibility: visible !important; opacity: 1 !important; flex-shrink: 0;">
          <div class="aethrix-icon-inner" style="width: 100%; height: 100%; min-width: 60px; min-height: 60px; display: flex !important; align-items: center; justify-content: center; visibility: visible !important;">
            <span class="aethrix-logo" style="display: block !important;">A</span>
          </div>
          <div class="aethrix-pulse"></div>
        </div>
        <div class="aethrix-speech" id="aethrix-speech">
          <span>有任何可以帮你的吗？</span>
        </div>
      </div>
      <div class="aethrix-chat-modal" id="aethrix-chat-modal" role="dialog" aria-labelledby="aethrix-chat-title" aria-hidden="true">
        <div class="aethrix-chat-container">
          <div class="aethrix-chat-header">
            <div class="aethrix-chat-header-left">
              <div class="aethrix-chat-avatar">A</div>
              <div class="aethrix-chat-title">
                <h3 id="aethrix-chat-title">Aethrix 助手</h3>
                <div class="aethrix-chat-status">在线</div>
              </div>
            </div>
            <button class="aethrix-chat-close" id="aethrix-chat-close" aria-label="关闭聊天">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="aethrix-chat-messages" id="aethrix-chat-messages">
            <div class="aethrix-message aethrix-message--bot">
              <div class="aethrix-message-avatar">A</div>
              <div class="aethrix-message-content">
                <p>你好！我是 Aethrix 助手 👋</p>
                <p>有什么可以帮你的么？</p>
              </div>
            </div>
          </div>
          <div class="aethrix-chat-input-container">
            <input type="text" class="aethrix-chat-input" id="aethrix-chat-input" placeholder="输入消息..." aria-label="输入消息">
            <button class="aethrix-chat-send" id="aethrix-chat-send" aria-label="发送消息">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper.firstElementChild);
    document.body.appendChild(wrapper.lastElementChild);
  };

  const applyVisibility = () => {
    createAssistantIfMissing();

    const assistant = document.getElementById('aethrix-assistant');
    const icon = document.getElementById('aethrix-icon');
    const iconInner = assistant ? assistant.querySelector('.aethrix-icon-inner') : null;

    if (assistant) {
      setImportant(assistant, 'position', 'fixed');
      setImportant(assistant, 'bottom', '28px');
      setImportant(assistant, 'right', '28px');
      setImportant(assistant, 'z-index', '2147483000');
      setImportant(assistant, 'display', 'flex');
      setImportant(assistant, 'align-items', 'center');
      setImportant(assistant, 'gap', '12px');
      setImportant(assistant, 'visibility', 'visible');
      setImportant(assistant, 'opacity', '1');
      setImportant(assistant, 'pointer-events', 'auto');
      setImportant(assistant, 'min-width', '72px');
      setImportant(assistant, 'min-height', '72px');
      setImportant(assistant, 'transform', 'none');
    }

    if (icon) {
      setImportant(icon, 'position', 'relative');
      setImportant(icon, 'width', '60px');
      setImportant(icon, 'height', '60px');
      setImportant(icon, 'min-width', '60px');
      setImportant(icon, 'min-height', '60px');
      setImportant(icon, 'flex-shrink', '0');
      setImportant(icon, 'cursor', 'pointer');
      setImportant(icon, 'display', 'block');
      setImportant(icon, 'visibility', 'visible');
      setImportant(icon, 'opacity', '1');
      setImportant(icon, 'pointer-events', 'auto');
      setImportant(icon, 'transform', 'none');
    }

    if (iconInner) {
      setImportant(iconInner, 'width', '100%');
      setImportant(iconInner, 'height', '100%');
      setImportant(iconInner, 'min-width', '60px');
      setImportant(iconInner, 'min-height', '60px');
      setImportant(iconInner, 'display', 'flex');
      setImportant(iconInner, 'align-items', 'center');
      setImportant(iconInner, 'justify-content', 'center');
      setImportant(iconInner, 'pointer-events', 'auto');
    }

    if (assistant) {
      const rect = assistant.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        setImportant(assistant, 'width', '84px');
        setImportant(assistant, 'height', '84px');
      }
    }

    if (icon) {
      const rect = icon.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        setImportant(icon, 'width', '60px');
        setImportant(icon, 'height', '60px');
      }
    }

    bindInteractions();
  };

  const bindInteractions = () => {
    if (typeof window.toggleAethrixChat !== 'function') {
      window.toggleAethrixChat = function toggleAethrixChat() {
        const modal = document.getElementById('aethrix-chat-modal');
        const icon = document.getElementById('aethrix-icon');
        if (!modal || !icon) return;
        if (modal.classList.contains('active')) {
          closeAethrixChat();
        } else {
          modal.classList.add('active');
          icon.classList.add('active');
          icon.setAttribute('aria-expanded', 'true');
          modal.setAttribute('aria-hidden', 'false');
          const input = document.getElementById('aethrix-chat-input');
          if (input) input.focus();
        }
      };
    }

    if (typeof window.closeAethrixChat !== 'function') {
      window.closeAethrixChat = function closeAethrixChat() {
        const modal = document.getElementById('aethrix-chat-modal');
        const icon = document.getElementById('aethrix-icon');
        if (!modal || !icon) return;
        modal.classList.remove('active');
        icon.classList.remove('active');
        icon.setAttribute('aria-expanded', 'false');
        modal.setAttribute('aria-hidden', 'true');
      };
    }

    if (typeof window.sendAethrixMessage !== 'function') {
      window.sendAethrixMessage = function sendAethrixMessage() {
        const input = document.getElementById('aethrix-chat-input');
        const messages = document.getElementById('aethrix-chat-messages');
        if (!input || !messages) return;
        const text = input.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'aethrix-message aethrix-message--user';
        userMsg.innerHTML = `<div class="aethrix-message-content"><p>${escapeHtml(text)}</p></div>`;
        messages.appendChild(userMsg);
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
          const botMsg = document.createElement('div');
          botMsg.className = 'aethrix-message aethrix-message--bot';
          botMsg.innerHTML = `
            <div class="aethrix-message-avatar">A</div>
            <div class="aethrix-message-content"><p>感谢你的消息！AI 助手功能正在开发中，敬请期待 🚀</p></div>
          `;
          messages.appendChild(botMsg);
          messages.scrollTop = messages.scrollHeight;
        }, 800);
      };
    }

    const icon = document.getElementById('aethrix-icon');
    const modal = document.getElementById('aethrix-chat-modal');
    const closeBtn = document.getElementById('aethrix-chat-close');
    const sendBtn = document.getElementById('aethrix-chat-send');
    const input = document.getElementById('aethrix-chat-input');

    if (icon && !icon.dataset.bound) {
      icon.dataset.bound = 'true';
      icon.addEventListener('click', () => window.toggleAethrixChat());
      icon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.toggleAethrixChat();
        }
      });
    }

    if (closeBtn && !closeBtn.dataset.bound) {
      closeBtn.dataset.bound = 'true';
      closeBtn.addEventListener('click', () => window.closeAethrixChat());
    }

    if (sendBtn && !sendBtn.dataset.bound) {
      sendBtn.dataset.bound = 'true';
      sendBtn.addEventListener('click', () => window.sendAethrixMessage());
    }

    if (input && !input.dataset.bound) {
      input.dataset.bound = 'true';
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') window.sendAethrixMessage();
      });
    }

    if (!modal?.dataset.bound) {
      modal.dataset.bound = 'true';
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          window.closeAethrixChat();
        }
      });
    }
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const run = () => {
    requestAnimationFrame(applyVisibility);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.addEventListener('load', () => setTimeout(run, 120));
  window.addEventListener('pageshow', run);
  window.addEventListener('visibilitychange', () => {
    if (!document.hidden) run();
  });
  window.addEventListener('resize', () => setTimeout(run, 50));
  setTimeout(run, 400);
  setTimeout(run, 1000);
  setTimeout(run, 2000);
})();
