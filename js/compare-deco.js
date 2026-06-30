/**
 * compare-deco.js
 * Decorative injector for the Compare page header.
 * ใส่ไฟล์นี้หลังจาก compare.js ใน index.html
 *
 * <script src="js/compare-deco.js"></script>
 */

(function () {

  /* ── Career icons that float in the header ── */
  const DECO_ICONS = [
    { emoji: '💻', top: '18%', left: '5%',  delay: '0s',   dur: '6s'  },
    { emoji: '🎨', top: '55%', left: '3%',  delay: '-2s',  dur: '7.5s'},
    { emoji: '🏥', top: '15%', right: '5%', delay: '-1s',  dur: '5.5s'},
    { emoji: '⚖️', top: '60%', right: '4%', delay: '-3.5s',dur: '8s'  },
    { emoji: '🔬', top: '75%', left: '14%', delay: '-4s',  dur: '6.5s'},
    { emoji: '✈️', top: '25%', left: '20%', delay: '-5s',  dur: '9s'  },
    { emoji: '📐', top: '70%', right: '14%',delay: '-1.5s',dur: '7s'  },
    { emoji: '🎓', top: '40%', right: '20%',delay: '-6s',  dur: '8.5s'},
  ];

  /* ── Stats to show inside the header ── */
  const HEADER_STATS = [
    { value: '400+', label: 'อาชีพในระบบ' },
    { value: '14',   label: 'สายงานหลัก'  },
    { value: '3',    label: 'เปรียบได้สูงสุด' },
  ];

  /* ── Bubble sizes/positions ── */
  const BUBBLES = [
    { w: 80,  h: 80,  top: '-20px', left: '8%',   dur: '8s',  delay: '0s'  },
    { w: 120, h: 120, top: '16px',  right: '6%',  dur: '11s', delay: '-3s' },
    { w: 50,  h: 50,  bottom:'10px',left: '22%',  dur: '7s',  delay: '-5s' },
    { w: 90,  h: 90,  bottom:'-15px',right:'18%', dur: '9s',  delay: '-1s' },
  ];

  /* ─────────────────────────────────────
     Main inject function
  ───────────────────────────────────── */
  function injectHeaderDeco() {
    const header = document.querySelector('#page-compare .cmp-header');
    if (!header || header.dataset.decoInjected) return;
    header.dataset.decoInjected = '1';

    /* 1. Bubbles */
    BUBBLES.forEach(b => {
      const el = document.createElement('div');
      el.className = 'cmp-header-bubble-1'; // reuse the shared class for animation
      Object.assign(el.style, {
        position: 'absolute',
        width: b.w + 'px',
        height: b.h + 'px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        pointerEvents: 'none',
        animation: `cmpFloat ${b.dur} linear infinite ${b.delay}`,
        top: b.top || 'auto',
        left: b.left || 'auto',
        right: b.right || 'auto',
        bottom: b.bottom || 'auto',
      });
      header.appendChild(el);
    });

    /* 2. Floating career emoji icons */
    DECO_ICONS.forEach(ic => {
      const el = document.createElement('div');
      el.className = 'cmp-deco-icon';
      el.textContent = ic.emoji;
      el.setAttribute('aria-hidden', 'true');
      Object.assign(el.style, {
        top:   ic.top   || 'auto',
        left:  ic.left  || 'auto',
        right: ic.right || 'auto',
        animationDuration: ic.dur,
        animationDelay:    ic.delay,
      });
      header.appendChild(el);
    });

    /* 3. Stats bar — only if not already there */
    if (!header.querySelector('.cmp-header-stats')) {
      const statsEl = document.createElement('div');
      statsEl.className = 'cmp-header-stats';
      statsEl.setAttribute('aria-hidden', 'true');

      statsEl.innerHTML = HEADER_STATS.map((s, i) => `
        ${i > 0 ? '<div class="cmp-header-stat-divider"></div>' : ''}
        <div class="cmp-header-stat">
          <strong>${s.value}</strong>
          <span>${s.label}</span>
        </div>
      `).join('');

      header.appendChild(statsEl);
    }
  }

  /* ─────────────────────────────────────
     Hook into existing initComparePage
  ───────────────────────────────────── */
  const _origInit = window.initComparePage;
  window.initComparePage = function () {
    if (_origInit) _origInit.apply(this, arguments);
    // small delay to let the page render first
    setTimeout(injectHeaderDeco, 50);
  };

  /* Also catch direct page switches via showPage */
  const _origShowPage = window.showPage;
  window.showPage = function (pageId) {
    if (_origShowPage) _origShowPage.apply(this, arguments);
    if (pageId === 'page-compare') {
      setTimeout(injectHeaderDeco, 80);
    }
  };

})();