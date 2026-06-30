/**
 * Career Explorer Pro — Floating Dock
 * floating-dock.js
 * รวม AI Chat + Colorblind ให้อยู่ใน dock เดียวกัน
 * โหลดหลัง colorblind.js และ ai-advisor script
 */

(function () {
  function initDock() {
    // ตรวจว่ามีทั้ง 2 widget แล้ว
    const aiWidget  = document.getElementById('ai-advisor-widget');
    const cbWidget  = document.getElementById('cb-widget');
    if (!aiWidget || !cbWidget) {
      // ถ้ายังไม่พร้อม รอ 100ms แล้วลองใหม่
      setTimeout(initDock, 100);
      return;
    }

    // สร้าง dock wrapper
    const dock = document.createElement('div');
    dock.id = 'floating-dock';

    // ── Colorblind button (บน) ──
    const cbWrap = document.createElement('div');
    cbWrap.className = 'dock-btn-wrap';

    const cbTooltip = document.createElement('span');
    cbTooltip.className = 'dock-tooltip';
    cbTooltip.textContent = 'ปรับโหมดสี';
    cbTooltip.setAttribute('role', 'tooltip');

    cbWrap.appendChild(cbTooltip);
    cbWrap.appendChild(cbWidget); // ย้าย cb widget เข้ามา

    // ── Divider ──
    const divider = document.createElement('div');
    divider.className = 'dock-divider';
    divider.setAttribute('aria-hidden', 'true');

    // ── AI Chat button (ล่าง) ──
    const aiWrap = document.createElement('div');
    aiWrap.className = 'dock-btn-wrap';

    const aiTooltip = document.createElement('span');
    aiTooltip.className = 'dock-tooltip';
    aiTooltip.textContent = 'AI Career Advisor';
    aiTooltip.setAttribute('role', 'tooltip');

    aiWrap.appendChild(aiTooltip);
    aiWrap.appendChild(aiWidget); // ย้าย ai widget เข้ามา

    // ── ประกอบ dock ──
    dock.appendChild(cbWrap);
    dock.appendChild(divider);
    dock.appendChild(aiWrap);

    document.body.appendChild(dock);
  }

  // รอให้ DOM + widgets พร้อม
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initDock, 300));
  } else {
    setTimeout(initDock, 300);
  }
})();