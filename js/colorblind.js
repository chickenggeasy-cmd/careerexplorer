/**
 * Career Explorer Pro — Colorblind Mode
 * colorblind.js  |  วางหลัง compare.js ใน index.html
 *
 * รองรับ 4 โหมด:
 *  - protanopia    (ตาบอดสีแดง)
 *  - deuteranopia  (ตาบอดสีเขียว)
 *  - tritanopia    (ตาบอดสีน้ำเงิน)
 *  - achromatopsia (ตาบอดสีทั้งหมด)
 */

(function () {
  'use strict';

  /* ─── Config ─── */
  const STORAGE_KEY = 'ce_colorblind_mode';
  const MODES = {
    none: {
      label: 'ปกติ',
      icon: '👁️',
      desc: 'สีปกติ',
      filter: 'none',
    },
    protanopia: {
      label: 'ตาบอดสีแดง',
      icon: '🔴',
      desc: 'Protanopia — ไม่รับรู้สีแดง',
      filter: 'url(#cb-protanopia)',
    },
    deuteranopia: {
      label: 'ตาบอดสีเขียว',
      icon: '🟢',
      desc: 'Deuteranopia — ไม่รับรู้สีเขียว',
      filter: 'url(#cb-deuteranopia)',
    },
    tritanopia: {
      label: 'ตาบอดสีน้ำเงิน',
      icon: '🔵',
      desc: 'Tritanopia — ไม่รับรู้สีน้ำเงิน',
      filter: 'url(#cb-tritanopia)',
    },
    achromatopsia: {
      label: 'ตาบอดสีทั้งหมด',
      icon: '⬜',
      desc: 'Achromatopsia — เห็นเฉพาะสีเทา',
      filter: 'url(#cb-achromatopsia)',
    },
  };

  let currentMode = localStorage.getItem(STORAGE_KEY) || 'none';
  let panelOpen = false;

  /* ─── SVG Filters (Color Matrices) ─── */
  function injectFilters() {
    if (document.getElementById('cb-svg-filters')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'cb-svg-filters';
    svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `
      <defs>
        <!-- Protanopia: no red cone -->
        <filter id="cb-protanopia" x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB">
          <feColorMatrix type="matrix" values="
            0.567, 0.433, 0,     0, 0
            0.558, 0.442, 0,     0, 0
            0,     0.242, 0.758, 0, 0
            0,     0,     0,     1, 0"/>
        </filter>
        <!-- Deuteranopia: no green cone -->
        <filter id="cb-deuteranopia" x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB">
          <feColorMatrix type="matrix" values="
            0.625, 0.375, 0,   0, 0
            0.7,   0.3,   0,   0, 0
            0,     0.3,   0.7, 0, 0
            0,     0,     0,   1, 0"/>
        </filter>
        <!-- Tritanopia: no blue cone -->
        <filter id="cb-tritanopia" x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB">
          <feColorMatrix type="matrix" values="
            0.95, 0.05,  0,     0, 0
            0,    0.433, 0.567, 0, 0
            0,    0.475, 0.525, 0, 0
            0,    0,     0,     1, 0"/>
        </filter>
        <!-- Achromatopsia: grayscale -->
        <filter id="cb-achromatopsia" x="0" y="0" width="100%" height="100%" color-interpolation-filters="linearRGB">
          <feColorMatrix type="matrix" values="
            0.299, 0.587, 0.114, 0, 0
            0.299, 0.587, 0.114, 0, 0
            0.299, 0.587, 0.114, 0, 0
            0,     0,     0,     1, 0"/>
        </filter>
      </defs>
    `;
    document.body.prepend(svg);
  }

  /* ─── Apply Mode ─── */
  function applyMode(mode) {
    currentMode = mode;
    localStorage.setItem(STORAGE_KEY, mode);

    const filter = MODES[mode]?.filter || 'none';
    document.documentElement.style.filter = filter;
    document.documentElement.setAttribute('data-cb-mode', mode);

    updateButtonState();
    updatePanelOptions();
  }

  /* ─── Widget HTML ─── */
  function buildWidget() {
    const wrap = document.createElement('div');
    wrap.id = 'cb-widget';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'ตั้งค่าการมองเห็นสี');

    wrap.innerHTML = `
      <!-- Trigger Button -->
      <button id="cb-trigger" class="cb-trigger" onclick="window.cbTogglePanel()" aria-haspopup="true" aria-expanded="false" title="ตั้งค่าโหมดตาบอดสี">
        <svg id="cb-eye-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        <span id="cb-mode-badge" class="cb-mode-badge cb-badge-hidden"></span>
      </button>

      <!-- Panel -->
      <div id="cb-panel" class="cb-panel cb-panel-hidden" role="dialog" aria-modal="false" aria-label="เลือกโหมดการมองเห็น">
        <div class="cb-panel-header">
          <div class="cb-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            โหมดการมองเห็น
          </div>
          <button class="cb-panel-close" onclick="window.cbTogglePanel()" aria-label="ปิดเมนู">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="cb-panel-desc">เลือกโหมดที่เหมาะกับการมองเห็นของคุณ การตั้งค่าจะถูกบันทึกไว้</p>
        <div class="cb-options" id="cb-options" role="radiogroup" aria-label="เลือกโหมดสี">
          ${Object.entries(MODES).map(([key, m]) => `
            <button
              class="cb-option ${key === currentMode ? 'cb-option-active' : ''}"
              data-mode="${key}"
              onclick="window.cbSetMode('${key}')"
              role="radio"
              aria-checked="${key === currentMode}"
              title="${m.desc}"
            >
              <span class="cb-opt-icon" aria-hidden="true">${m.icon}</span>
              <span class="cb-opt-text">
                <span class="cb-opt-label">${m.label}</span>
                <span class="cb-opt-desc">${m.desc}</span>
              </span>
              <span class="cb-opt-check" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
            </button>
          `).join('')}
        </div>
        <div class="cb-panel-footer">
          <span>ตั้งค่านี้จะถูกจำไว้อัตโนมัติ</span>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);
  }

  /* ─── CSS ─── */
  function injectCSS() {
    if (document.getElementById('cb-styles')) return;
    const style = document.createElement('style');
    style.id = 'cb-styles';
    style.textContent = `
      /* ── Widget wrapper ── */
      #cb-widget {
        font-family: 'Prompt', sans-serif;
        position: relative;
      }

      /* ── Trigger button ── */
      .cb-trigger {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: white;
        border: 2px solid #fce7f3;
        color: #be185d;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(190,24,93,0.15), 0 1px 4px rgba(0,0,0,0.08);
        transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        position: relative;
      }

      .cb-trigger:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 28px rgba(190,24,93,0.25);
        border-color: #f9a8d4;
      }

      .cb-trigger:focus-visible {
        outline: 3px solid #be185d;
        outline-offset: 2px;
      }

      /* Active mode: ไฮไลต์ trigger */
      [data-cb-mode]:not([data-cb-mode="none"]) .cb-trigger,
      .cb-trigger.cb-active {
        background: linear-gradient(135deg, #be185d, #db2777);
        border-color: #be185d;
        color: white;
      }

      /* Badge */
      .cb-mode-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 18px;
        height: 18px;
        background: #be185d;
        border-radius: 50%;
        border: 2px solid white;
        font-size: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
      }

      .cb-badge-hidden { display: none; }

      /* ── Panel ── */
      .cb-panel {
        position: absolute;
        bottom: 64px;
        right: 0;
        width: 300px;
        background: white;
        border-radius: 20px;
        box-shadow:
          0 20px 60px rgba(0,0,0,0.14),
          0 0 0 1px rgba(190,24,93,0.08);
        overflow: hidden;
        transform-origin: bottom right;
        transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
      }

      .cb-panel-hidden {
        transform: scale(0.8) translateY(12px);
        opacity: 0;
        pointer-events: none;
      }

      /* Panel header */
      .cb-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 18px 12px;
        border-bottom: 1px solid #fce7f3;
      }

      .cb-panel-title {
        font-size: 13px;
        font-weight: 700;
        color: #831843;
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .cb-panel-close {
        background: #fdf2f8;
        border: none;
        cursor: pointer;
        color: #9d4a70;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }

      .cb-panel-close:hover { background: #fce7f3; color: #be185d; }

      /* Desc */
      .cb-panel-desc {
        font-size: 11.5px;
        color: #9d4a70;
        padding: 10px 18px 8px;
        line-height: 1.5;
      }

      /* Options list */
      .cb-options {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px 10px 10px;
      }

      .cb-option {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1.5px solid transparent;
        background: none;
        cursor: pointer;
        font-family: 'Prompt', sans-serif;
        text-align: left;
        transition: all 0.15s;
        width: 100%;
      }

      .cb-option:hover {
        background: #fdf2f8;
        border-color: #fbcfe8;
      }

      .cb-option-active {
        background: linear-gradient(135deg, #fff0f6, #fdf2f8);
        border-color: #f9a8d4;
      }

      .cb-opt-icon {
        font-size: 20px;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(190,24,93,0.06);
        border-radius: 9px;
        flex-shrink: 0;
      }

      .cb-option-active .cb-opt-icon {
        background: rgba(190,24,93,0.1);
      }

      .cb-opt-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .cb-opt-label {
        font-size: 13px;
        font-weight: 700;
        color: #1e1b4b;
      }

      .cb-option-active .cb-opt-label {
        color: #be185d;
      }

      .cb-opt-desc {
        font-size: 11px;
        color: #9d4a70;
        font-weight: 400;
      }

      .cb-opt-check {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1.5px solid #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: transparent;
        transition: all 0.15s;
      }

      .cb-option-active .cb-opt-check {
        background: #be185d;
        border-color: #be185d;
        color: white;
      }

      /* Footer */
      .cb-panel-footer {
        padding: 10px 18px;
        background: #fafafa;
        border-top: 1px solid #fce7f3;
        font-size: 10.5px;
        color: #b07090;
        text-align: center;
      }

      /* ── Responsive ── */
      @media (max-width: 640px) {
        .cb-panel {
          width: calc(100vw - 32px);
          max-width: 300px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── Update UI state ─── */
  function updateButtonState() {
    const trigger = document.getElementById('cb-trigger');
    const badge = document.getElementById('cb-mode-badge');
    if (!trigger || !badge) return;

    if (currentMode !== 'none') {
      trigger.classList.add('cb-active');
      badge.classList.remove('cb-badge-hidden');
      badge.textContent = '✓';
      trigger.setAttribute('aria-label', `โหมดการมองเห็น: ${MODES[currentMode]?.label} — คลิกเพื่อเปลี่ยน`);
    } else {
      trigger.classList.remove('cb-active');
      badge.classList.add('cb-badge-hidden');
      trigger.setAttribute('aria-label', 'ตั้งค่าโหมดตาบอดสี');
    }

    trigger.setAttribute('aria-expanded', String(panelOpen));
  }

  function updatePanelOptions() {
    document.querySelectorAll('.cb-option').forEach(btn => {
      const mode = btn.dataset.mode;
      const isActive = mode === currentMode;
      btn.classList.toggle('cb-option-active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
  }

  /* ─── Public API ─── */
  window.cbSetMode = function (mode) {
    if (!MODES[mode]) return;
    applyMode(mode);
  };

  window.cbTogglePanel = function () {
    panelOpen = !panelOpen;
    const panel = document.getElementById('cb-panel');
    const trigger = document.getElementById('cb-trigger');
    if (!panel || !trigger) return;

    if (panelOpen) {
      panel.classList.remove('cb-panel-hidden');
      trigger.setAttribute('aria-expanded', 'true');
    } else {
      panel.classList.add('cb-panel-hidden');
      trigger.setAttribute('aria-expanded', 'false');
    }
  };

  /* ─── Close on outside click ─── */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#cb-widget') && panelOpen) {
      panelOpen = false;
      const panel = document.getElementById('cb-panel');
      const trigger = document.getElementById('cb-trigger');
      panel?.classList.add('cb-panel-hidden');
      trigger?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ─── Keyboard: Escape closes panel ─── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panelOpen) {
      panelOpen = false;
      const panel = document.getElementById('cb-panel');
      const trigger = document.getElementById('cb-trigger');
      panel?.classList.add('cb-panel-hidden');
      trigger?.setAttribute('aria-expanded', 'false');
      trigger?.focus();
    }
  });

  /* ─── Init ─── */
  function init() {
    injectFilters();
    injectCSS();
    buildWidget();
    applyMode(currentMode); // restore saved mode
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();