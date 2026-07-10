/**
 * Career Explorer Pro - Render Logic (Upgraded & Refactored)
 * อัปเดตล่าสุด: เพิ่ม Accessibility (a11y) และคืนค่า Design ตัวหนังสือใหญ่แบบดั้งเดิม พร้อมระบบ Toggle ค่าเงิน Global
 *                + ดึงอัตราแลกเปลี่ยน USD/THB สดจาก Frankfurter API (ฟรี ไม่ต้องมี key)
 */

// ── INJECT CURRENCY TOGGLE CSS ──
const currStyle = document.createElement('style');
currStyle.textContent = `
  body[data-currency="THB"] .show-usd { display: none !important; }
  body[data-currency="USD"] .show-thb { display: none !important; }
  .currency-toggle-btn {
    background: rgba(216, 27, 122, 0.1);
    color: #D81B7A;
    border: 1px solid rgba(216, 27, 122, 0.4);
    padding: 6px 16px;
    border-radius: 50px;
    font-family: 'Prompt', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .currency-toggle-btn:hover {
    background: #D81B7A;
    color: #fff;
  }
`;
document.head.appendChild(currStyle);

// ── CURRENCY STATE & TOGGLE FUNCTION ──
let globalCurrency = 'THB'; // ค่าเริ่มต้น
document.body.setAttribute('data-currency', globalCurrency);

window.toggleCurrency = function() {
  globalCurrency = globalCurrency === 'THB' ? 'USD' : 'THB';
  document.body.setAttribute('data-currency', globalCurrency);

  // อัปเดตข้อความปุ่มทุกจุดในหน้าจอ
  document.querySelectorAll('.currency-toggle-btn').forEach(btn => {
    btn.innerHTML = globalCurrency === 'THB'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> สลับเป็น USD ($)'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 1h6M12 1v22M15 23H9M6 10h12M6 14h12"></path></svg> สลับเป็น THB (฿)';
  });
};

// ── GLOBAL CONFIGURATION ──
const CAT_CONFIG = {
  images: {
    medical: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    business: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80",
    arts: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80",
    education: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80",
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    aviation: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    construction: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
    agriculture: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=80",
    logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80",
    factory: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
    lifestyle: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80"
  },
  gradients: {
    medical: "linear-gradient(135deg, #be185d, #f472b6)",
    tech: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
    business: "linear-gradient(135deg, #b45309, #fbbf24)",
    law: "linear-gradient(135deg, #6b21a8, #c084fc)",
    arts: "linear-gradient(135deg, #15803d, #86efac)",
    education: "linear-gradient(135deg, #c2410c, #fb923c)",
    sports: "linear-gradient(135deg, #065f46, #34d399)",
    food: "linear-gradient(135deg, #92400e, #fcd34d)",
    aviation: "linear-gradient(135deg, #1e3a5f, #38bdf8)",
    construction: "linear-gradient(135deg, #475569, #94a3b8)",
    agriculture: "linear-gradient(135deg, #3f6212, #a3e635)",
    logistics: "linear-gradient(135deg, #7c2d12, #fb923c)",
    factory: "linear-gradient(135deg, #e7c40e, #578eda)",
    lifestyle: "linear-gradient(135deg, #701a75, #f0abfc)"
  },
  emojis: {
    medical: "🏥", tech: "💻", business: "💼", law: "⚖️",
    arts: "🎭", education: "🎓", sports: "🏆", food: "🍳",
    aviation: "✈️", construction: "🏗️", agriculture: "🌱",
    logistics: "📦", factory: "🏭", lifestyle: "💅"
  }
};

// ── SVG ICON LIBRARY (detail page) ──────────────────────────────────────────
const DETAIL_ICONS = {
  graduation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  wallet: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill="currentColor" stroke="none"/><path d="M2 10h20"/></svg>`,
  trophy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 5h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V5z"/></svg>`,
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  clockSm: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  university: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>`,
  bolt: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  scale: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 9l9-6 9 6"/><path d="M3 15h18"/><path d="M3 15l3 6h12l3-6"/><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"/></svg>`,
  trendUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  fileText: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  barChart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`,
  info: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  trendUpSm: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  arrowRightSm: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
};

function icon(svgKey, { color = 'currentColor', size = null, style = '' } = {}) {
  const svg = DETAIL_ICONS[svgKey];
  if (!svg) return '';
  const colorStyle = color !== 'currentColor' ? `color:${color};` : '';
  const sizeStyle  = size ? `width:${size}px;height:${size}px;` : '';
  return `<span class="svg-icon" aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;${colorStyle}${sizeStyle}${style}">${svg}</span>`;
}

const GLOBAL_EXPLORER = {
  usdThbRate: 35, // ค่าสำรอง จะถูก override ด้วยค่าจริงจาก fetchUsdThbRate()
  continents: [
    {
      id: 'asia', nameT: 'เอเชีย', nameE: 'Asia', pinX: '74%', pinY: '33%',
      countries: [
        { id: 'th', code: 'TH', flag: '🇹🇭', nameT: 'ไทย', nameE: 'Thailand', market: 1.00, note: 'ฐานข้อมูลตั้งต้น' },
        { id: 'jp', code: 'JP', flag: '🇯🇵', nameT: 'ญี่ปุ่น', nameE: 'Japan', market: 1.75, note: 'ตลาดเทคโนโลยีและอุตสาหกรรมสูง' },
        { id: 'sg', code: 'SG', flag: '🇸🇬', nameT: 'สิงคโปร์', nameE: 'Singapore', market: 2.65, note: 'ศูนย์กลางธุรกิจของภูมิภาค' },
      ],
    },
    {
      id: 'europe', nameT: 'ยุโรป', nameE: 'Europe', pinX: '52%', pinY: '24%',
      countries: [
        { id: 'de', code: 'DE', flag: '🇩🇪', nameT: 'เยอรมนี', nameE: 'Germany', market: 2.30, note: 'เด่นด้านวิศวกรรมและอุตสาหกรรม' },
        { id: 'uk', code: 'UK', flag: '🇬🇧', nameT: 'สหราชอาณาจักร', nameE: 'United Kingdom', market: 2.20, note: 'ตลาดการเงิน การแพทย์ และดิจิทัล' },
        { id: 'fr', code: 'FR', flag: '🇫🇷', nameT: 'ฝรั่งเศส', nameE: 'France', market: 2.00, note: 'เด่นด้านศิลปะ แฟชั่น และเทคโนโลยี' },
      ],
    },
    {
      id: 'north_america', nameT: 'อเมริกาเหนือ', nameE: 'North America', pinX: '22%', pinY: '32%',
      countries: [
        { id: 'us', code: 'US', flag: '🇺🇸', nameT: 'สหรัฐอเมริกา', nameE: 'United States', market: 3.60, note: 'ตลาดแรงงานขนาดใหญ่และค่าตอบแทนสูง' },
        { id: 'ca', code: 'CA', flag: '🇨🇦', nameT: 'แคนาดา', nameE: 'Canada', market: 2.70, note: 'เด่นด้านสุขภาพ เทคโนโลยี และทรัพยากร' },
        { id: 'mx', code: 'MX', flag: '🇲🇽', nameT: 'เม็กซิโก', nameE: 'Mexico', market: 1.15, note: 'ฐานการผลิตและโลจิสติกส์สำคัญ' },
      ],
    },
    {
      id: 'south_america', nameT: 'อเมริกาใต้', nameE: 'South America', pinX: '32%', pinY: '70%',
      countries: [
        { id: 'br', code: 'BR', flag: '🇧🇷', nameT: 'บราซิล', nameE: 'Brazil', market: 0.95, note: 'ตลาดใหญ่ด้านธุรกิจ เกษตร และพลังงาน' },
        { id: 'cl', code: 'CL', flag: '🇨🇱', nameT: 'ชิลี', nameE: 'Chile', market: 1.05, note: 'เศรษฐกิจเปิดและเหมืองแร่เด่น' },
        { id: 'ar', code: 'AR', flag: '🇦🇷', nameT: 'อาร์เจนตินา', nameE: 'Argentina', market: 0.70, note: 'เด่นด้านสร้างสรรค์และซอฟต์แวร์เอาต์ซอร์ส' },
      ],
    },
    {
      id: 'africa', nameT: 'แอฟริกา', nameE: 'Africa', pinX: '55%', pinY: '58%',
      countries: [
        { id: 'za', code: 'ZA', flag: '🇿🇦', nameT: 'แอฟริกาใต้', nameE: 'South Africa', market: 0.85, note: 'ศูนย์กลางธุรกิจและการเงินของภูมิภาค' },
        { id: 'eg', code: 'EG', flag: '🇪🇬', nameT: 'อียิปต์', nameE: 'Egypt', market: 0.55, note: 'ตลาดการท่องเที่ยว วิศวกรรม และบริการ' },
        { id: 'ng', code: 'NG', flag: '🇳🇬', nameT: 'ไนจีเรีย', nameE: 'Nigeria', market: 0.65, note: 'เศรษฐกิจดิจิทัลและพลังงานเติบโต' },
      ],
    },
    {
      id: 'oceania', nameT: 'โอเชียเนีย', nameE: 'Oceania', pinX: '86%', pinY: '76%',
      countries: [
        { id: 'au', code: 'AU', flag: '🇦🇺', nameT: 'ออสเตรเลีย', nameE: 'Australia', market: 2.50, note: 'เด่นด้านสุขภาพ วิศวกรรม และบริการ' },
        { id: 'nz', code: 'NZ', flag: '🇳🇿', nameT: 'นิวซีแลนด์', nameE: 'New Zealand', market: 2.15, note: 'ตลาดคุณภาพชีวิตสูงและงานบริการ' },
        { id: 'fj', code: 'FJ', flag: '🇫🇯', nameT: 'ฟิจิ', nameE: 'Fiji', market: 0.75, note: 'เด่นด้านท่องเที่ยวและบริการภูมิภาคแปซิฟิก' },
      ],
    },
  ],
};

// ─── LIVE USD/THB EXCHANGE RATE (Frankfurter API — ฟรี ไม่ต้องมี key) ───
// ใช้ค่านี้กับทุกประเทศทั้ง 18 ประเทศ เพื่อแปลง THB ↔ USD
// ถ้า API ล่ม จะ fallback ใช้ค่า 35 ที่ตั้งไว้ใน GLOBAL_EXPLORER.usdThbRate
async function fetchUsdThbRate() {
  try {
    const res = await fetch('https://api.frankfurter.dev/v1/latest?from=USD&to=THB');
    if (!res.ok) throw new Error('API status ' + res.status);
    const data = await res.json();
    const rate = data && data.rates && data.rates.THB;
    if (typeof rate === 'number' && rate > 0) {
      GLOBAL_EXPLORER.usdThbRate = rate;
      console.log('[FX] Live USD/THB rate =', rate);
      // รีเฟรช UI ถ้าหน้า explore เปิดอยู่ (ไม่ error ถ้ายังไม่พร้อม)
      try { if (typeof renderGlobalExplorerUI === 'function') renderGlobalExplorerUI(); } catch (e) {}
      try {
        if (typeof renderCategories === 'function' && document.getElementById('catGrid') && window.DATA?.categories?.length) {
          renderCategories();
        }
      } catch (e) {}
      return rate;
    }
  } catch (err) {
    console.warn('[FX] ใช้ค่าสำรอง 35 THB (ดึง API ไม่สำเร็จ):', err && err.message ? err.message : err);
  }
  return GLOBAL_EXPLORER.usdThbRate;
}
window.fetchUsdThbRate = fetchUsdThbRate;

// รีเฟรชค่าเงินทุก 1 ชั่วโมง เผื่อผู้ใช้เปิดค้างไว้นาน
setInterval(fetchUsdThbRate, 60 * 60 * 1000);

let globalSelectedContinentId = 'asia';
let globalSelectedCountryId = 'th';
let globalExploreMode = 'world';
let globalGlobeReady = false;
let globalPanX = 0;
let globalPanY = 0;

function getGlobalContinent(id = globalSelectedContinentId) {
  return GLOBAL_EXPLORER.continents.find(c => c.id === id) || GLOBAL_EXPLORER.continents[0];
}

function flagCodeFor(code) {
  const cc = String(code || '').toLowerCase();
  if (cc === 'uk') return 'gb';
  return cc;
}
function flagImg(code, nameT = '') {
  const cc = flagCodeFor(code);
  const alt = nameT ? `ธงชาติ${nameT}` : `ธงชาติ${(code || '').toUpperCase()}`;
  return `<img src="https://flagcdn.com/w160/${cc}.png" srcset="https://flagcdn.com/w320/${cc}.png 2x" alt="${alt}" class="gx-flag-img" loading="lazy" onerror="this.onerror=null;this.style.display='none';">`;
}
function flagImgInline(code, nameT = '') {
  const cc = flagCodeFor(code);
  const alt = nameT ? `ธงชาติ${nameT}` : `ธงชาติ${(code || '').toUpperCase()}`;
  return `<img src="https://flagcdn.com/w80/${cc}.png" srcset="https://flagcdn.com/w160/${cc}.png 2x" alt="${alt}" class="gx-flag-img-inline" loading="lazy" onerror="this.onerror=null;this.style.display='none';">`;
}
window.flagImg = flagImg;
window.flagImgInline = flagImgInline;

function getGlobalSelectedCountry() {
  const continent = getGlobalContinent();
  return continent.countries.find(c => c.id === globalSelectedCountryId) || continent.countries[0];
}

function parseSalaryValue(value) {
  const cleaned = String(value ?? '').replace(/[^\d.]/g, '');
  return Number(cleaned) || 0;
}

function formatMoneyNumber(value) {
  return Math.round(value).toLocaleString('en-US');
}

function getGlobalSalary(job, level) {
  const country = getGlobalSelectedCountry();
  const base = parseSalaryValue(job?.salary?.[level]);
  const thb = base * country.market;
  return {
    thb,
    usd: thb / GLOBAL_EXPLORER.usdThbRate,
    thbText: `฿${formatMoneyNumber(thb)}`,
    usdText: `$${formatMoneyNumber(thb / GLOBAL_EXPLORER.usdThbRate)}`,
  };
}

function getAverageGlobalSalary(level) {
  if (!window.DATA?.categories) return { thbText: 'รอข้อมูล', usdText: 'รอข้อมูล' };
  const values = DATA.categories
    .flatMap(cat => cat.jobs || [])
    .map(job => parseSalaryValue(job.salary?.[level]))
    .filter(Boolean);
  const avgBase = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  const country = getGlobalSelectedCountry();
  const thb = avgBase * country.market;
  return {
    thbText: `฿${formatMoneyNumber(thb)}`,
    usdText: `$${formatMoneyNumber(thb / GLOBAL_EXPLORER.usdThbRate)}`,
  };
}

function setExploreMode(mode = 'world') {
  globalExploreMode = mode === 'careers' ? 'careers' : 'world';
  const worldView = document.getElementById('gxWorldView');
  const careerView = document.getElementById('gxCareerView');
  const worldTab = document.getElementById('gxWorldTab');
  const careerTab = document.getElementById('gxCareerTab');

  worldView?.classList.toggle('is-active', globalExploreMode === 'world');
  careerView?.classList.toggle('is-active', globalExploreMode === 'careers');
  worldTab?.classList.toggle('is-active', globalExploreMode === 'world');
  careerTab?.classList.toggle('is-active', globalExploreMode === 'careers');
  worldTab?.setAttribute('aria-selected', String(globalExploreMode === 'world'));
  careerTab?.setAttribute('aria-selected', String(globalExploreMode === 'careers'));

  if (globalExploreMode === 'careers') renderCategories();
  renderGlobalExplorerUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.setExploreMode = setExploreMode;

const WORLD_MAP_VIEW = { w: 1000, h: 560 };

const WORLD_MAP_PIN_XY = {
  asia:          { x: 740, y: 185 },
  europe:        { x: 520, y: 135 },
  north_america: { x: 220, y: 180 },
  south_america: { x: 320, y: 395 },
  africa:        { x: 550, y: 325 },
  oceania:       { x: 860, y: 425 },
};

function renderWorldMapLands() {
  const group = document.getElementById('gxLandsGroup');
  if (!group || group.dataset.ready === '1') return;
  if (typeof WORLD_MAP_PATHS === 'undefined') return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const frag = document.createDocumentFragment();
  GLOBAL_EXPLORER.continents.forEach(cont => {
    const d = WORLD_MAP_PATHS[cont.id];
    if (!d) return;
    const p = document.createElementNS(svgNS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', `gx-land gx-land-${cont.id}`);
    p.setAttribute('data-continent', cont.id);
    p.addEventListener('click', () => window.selectGlobalContinent(cont.id));
    frag.appendChild(p);
  });
  group.appendChild(frag);
  group.dataset.ready = '1';
}

function renderWorldMapFlightPaths() {
  const g = document.getElementById('gxFlightPaths');
  if (!g || g.dataset.ready === '1') return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const routes = [
    ['north_america', 'europe'],
    ['europe', 'asia'],
    ['asia', 'oceania'],
    ['south_america', 'africa'],
  ];
  routes.forEach(([a, b]) => {
    const p1 = WORLD_MAP_PIN_XY[a];
    const p2 = WORLD_MAP_PIN_XY[b];
    if (!p1 || !p2) return;
    const mx = (p1.x + p2.x) / 2;
    const my = Math.min(p1.y, p2.y) - Math.abs(p2.x - p1.x) * 0.18;
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M${p1.x},${p1.y} Q${mx.toFixed(1)},${my.toFixed(1)} ${p2.x},${p2.y}`);
    path.setAttribute('class', 'gx-flightpath');
    g.appendChild(path);
  });
  g.dataset.ready = '1';
}

function renderWorldMapSparkles(count = 14) {
  const g = document.getElementById('gxSparkles');
  if (!g || g.dataset.ready === '1') return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const seeded = (i) => {
    const s = Math.sin(i * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  };
  for (let i = 0; i < count; i++) {
    const angle = (seeded(i) * Math.PI * 2);
    const r = 220 + seeded(i + 99) * 60;
    const x = 500 + Math.cos(angle) * r * 1.6;
    const y = 280 + Math.sin(angle) * r * 0.85;
    if (x < 20 || x > 980 || y < 20 || y > 540) continue;
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', x.toFixed(1));
    c.setAttribute('cy', y.toFixed(1));
    c.setAttribute('r', (1.2 + seeded(i + 7) * 1.8).toFixed(2));
    c.setAttribute('class', 'gx-sparkle');
    c.style.animationDelay = `${(seeded(i + 3) * 4).toFixed(2)}s`;
    g.appendChild(c);
  }
  g.dataset.ready = '1';
}

function applyGlobalMapTransform() {
  const inner = document.getElementById('gxWorldmapInner');
  if (!inner) return;
  inner.style.setProperty('--gx-tx', `${globalPanX}%`);
  inner.style.setProperty('--gx-ty', `${globalPanY}%`);
}

function setGlobalGlobeForContinent(continent) {
  if (!continent) return;
  document.querySelectorAll('.gx-land').forEach(el => {
    el.classList.toggle('is-active', el.dataset.continent === continent.id);
  });
}

function renderGlobalExplorerUI() {
  const continent = getGlobalContinent();
  const country = getGlobalSelectedCountry();
  const pins = document.getElementById('globalContinentPins');
  const continentPanel = document.getElementById('continentPanel');
  const countryPanel = document.getElementById('countryPanel');
  const salaryPreview = document.getElementById('globalSalaryPreview');
  const countrySummary = document.getElementById('globalCountrySummary');

  if (pins) {
    pins.innerHTML = GLOBAL_EXPLORER.continents.map(item => `
      <button class="gx-continent-pin ${item.id === globalSelectedContinentId ? 'is-active' : ''}"
        type="button"
        style="--x:${item.pinX};--y:${item.pinY};"
        aria-label="เลือกทวีป${item.nameT} เพื่อดูค่าเงินเดือนเทียบ"
        aria-pressed="${item.id === globalSelectedContinentId ? 'true' : 'false'}"
        onclick="selectGlobalContinent('${item.id}')"><span class="gx-pin-dot" aria-hidden="true"></span><span class="gx-pin-label">${item.nameT}</span></button>
    `).join('');
  }

  if (continentPanel) {
    continentPanel.innerHTML = GLOBAL_EXPLORER.continents.map(item => `
      <div class="gx-continent-card ${item.id === globalSelectedContinentId ? 'is-active' : ''}"
        role="button" tabindex="0"
        onclick="selectGlobalContinent('${item.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectGlobalContinent('${item.id}');}">
        <div class="gx-continent-name">${item.nameT}</div>
        <div class="gx-continent-sub">${item.nameE} · ${item.countries.length} ประเทศ</div>
      </div>
    `).join('');
  }

  if (countryPanel) {
    countryPanel.innerHTML = continent.countries.map(item => `
      <div class="gx-country-card ${item.id === globalSelectedCountryId ? 'is-active' : ''}"
        role="button" tabindex="0"
        onclick="selectGlobalCountry('${item.id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectGlobalCountry('${item.id}');}">
        <div class="gx-country-flag" aria-hidden="true">${flagImg(item.code, item.nameT)}</div>
        <div class="gx-country-code">${item.code}</div>
        <div class="gx-country-name">${item.nameT}</div>
        <div class="gx-country-en">${item.nameE}</div>
        <div class="gx-country-rate">ตัวคูณ ${item.market.toFixed(2)}x</div>
      </div>
    `).join('');
  }

  if (salaryPreview) {
    const entry = getAverageGlobalSalary('entry');
    const mid = getAverageGlobalSalary('mid');
    const senior = getAverageGlobalSalary('senior');

    // Toggle Button SVG icon logic based on state
    const toggleIcon = globalCurrency === 'THB'
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> สลับเป็น USD ($)'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 1h6M12 1v22M15 23H9M6 10h12M6 14h12"></path></svg> สลับเป็น THB (฿)';

    salaryPreview.innerHTML = `
      <div class="gx-salary-context">
        <div class="gx-salary-eyebrow">SALARY CONVERTER</div>
        <h3><span class="gx-flag-chip" aria-hidden="true">${flagImgInline(country.code, country.nameT)}</span> ${country.nameT} · ${country.nameE}</h3>
        <p>${country.note} ใช้ฐานเงินเดือนอาชีพเดิมในระบบ และแปลงเป็นค่าเงินแบบประมาณการ</p>

        <button type="button" class="currency-toggle-btn" onclick="toggleCurrency()">
          ${toggleIcon}
        </button>

        <div style="margin-top: 16px;">
          <button type="button" class="gx-next-btn" onclick="setExploreMode('careers')">ไปสำรวจสายงานในประเทศนี้</button>
        </div>
      </div>
      <div class="gx-salary-stat">
        <div class="gx-stat-label">Entry เฉลี่ย</div>
        <div class="gx-stat-value"><span class="show-thb">${entry.thbText}</span><span class="show-usd">${entry.usdText}</span></div>
      </div>
      <div class="gx-salary-stat">
        <div class="gx-stat-label">Mid เฉลี่ย</div>
        <div class="gx-stat-value"><span class="show-thb">${mid.thbText}</span><span class="show-usd">${mid.usdText}</span></div>
      </div>
      <div class="gx-salary-stat">
        <div class="gx-stat-label">Senior เฉลี่ย</div>
        <div class="gx-stat-value"><span class="show-thb">${senior.thbText}</span><span class="show-usd">${senior.usdText}</span></div>
      </div>
    `;
  }

  if (countrySummary) {
    countrySummary.innerHTML = `
      <div class="gx-summary-flag" aria-hidden="true">${flagImg(country.code, country.nameT)}</div>
      <div class="gx-summary-copy">
        <div class="gx-summary-label">ประเทศที่เลือกตอนนี้</div>
        <h3>${country.nameT} · ${country.nameE}</h3>
        <p>${country.note}</p>
      </div>
      <button type="button" class="gx-summary-btn" onclick="setExploreMode('world')">เปลี่ยนประเทศ</button>
    `;
  }
}

function initGlobalGlobeInteractions() {
  const map = document.getElementById('globalGlobe');
  if (!map || globalGlobeReady) return;
  globalGlobeReady = true;

  renderWorldMapLands();
  renderWorldMapFlightPaths();
  renderWorldMapSparkles();
  renderWorldMapPlane();

  setGlobalGlobeForContinent(getGlobalContinent());
  map.style.cursor = 'default';
}

function spawnContinentRipple(continentId) {
  const g = document.getElementById('gxFlightPaths')?.parentNode;
  const overlay = document.getElementById('gxRippleLayer');
  if (!overlay) return;
  const xy = WORLD_MAP_PIN_XY[continentId];
  if (!xy) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  [1, 2].forEach((n) => {
    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', xy.x);
    c.setAttribute('cy', xy.y);
    c.setAttribute('r', 4);
    c.setAttribute('class', `gx-ripple gx-ripple-${n}`);
    overlay.appendChild(c);
    setTimeout(() => c.remove(), 1600);
  });
}

function renderWorldMapPlane() {
  const svg = document.querySelector('.gx-worldmap-svg');
  const paths = document.querySelectorAll('#gxFlightPaths .gx-flightpath');
  if (!svg || !paths.length) return;
  const svgNS = 'http://www.w3.org/2000/svg';
  const plane = document.createElementNS(svgNS, 'g');
  plane.setAttribute('class', 'gx-plane');
  plane.innerHTML = `
    <circle r="6" fill="rgba(255,255,255,0.9)"/>
    <path d="M-4,-1 L4,-1 L6,0 L4,1 L-4,1 L-6,3 L-4,0 L-6,-3 Z"
          fill="#be185d" stroke="#fff" stroke-width="0.6" stroke-linejoin="round"/>
  `;
  svg.appendChild(plane);
  paths.forEach((p, i) => { p.id = `gxFlight${i}`; });
  const anim = document.createElementNS(svgNS, 'animateMotion');
  anim.setAttribute('dur', '9s');
  anim.setAttribute('repeatCount', 'indefinite');
  anim.setAttribute('rotate', 'auto');
  const mpath = document.createElementNS(svgNS, 'mpath');
  mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#gxFlight0`);
  anim.appendChild(mpath);
  plane.appendChild(anim);

  let idx = 0;
  anim.addEventListener('endEvent', () => {
    idx = (idx + 1) % paths.length;
    mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#gxFlight${idx}`);
    anim.beginElement?.();
  });
}

window.selectGlobalContinent = function (continentId) {
  const continent = getGlobalContinent(continentId);
  globalSelectedContinentId = continent.id;
  globalSelectedCountryId = continent.countries[0].id;
  spawnContinentRipple(continent.id);
  setGlobalGlobeForContinent(continent);
  renderGlobalExplorerUI();
  renderCategories();
};

window.selectGlobalCountry = function (countryId) {
  const continent = getGlobalContinent();
  if (!continent.countries.some(country => country.id === countryId)) return;
  globalSelectedCountryId = countryId;
  renderGlobalExplorerUI();
  renderCategories();
};

function renderCategories() {
  const catGrid = document.getElementById('catGrid');
  if (!catGrid) return;

  initGlobalGlobeInteractions();
  renderGlobalExplorerUI();
  catGrid.innerHTML = Array(14).fill(0).map(() => `<div class="cat-skeleton"></div>`).join('');

  loadAllCategories().then(() => {
    renderGlobalExplorerUI();
    let html = '';
    const country = getGlobalSelectedCountry();
    DATA.categories.forEach((cat, index) => {
      const img  = CAT_CONFIG.images[cat.id]    || '';
      const grad = CAT_CONFIG.gradients[cat.id] || 'linear-gradient(135deg, #be185d, #f472b6)';
      html += `
        <div class="cat-card-new"
             role="button"
             tabindex="0"
             aria-label="ดูอาชีพในสายงาน${cat.nameT}"
             onclick="showCategory('${cat.id}')"
             onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showCategory('${cat.id}');}"
             style="animation: fadeInUp 0.5s ease forwards; opacity: 0; animation-delay: ${0.2 + (index * 0.1)}s;">
          <div class="cat-market-chip"><span aria-hidden="true">${flagImgInline(country.code, country.nameT)}</span>${country.nameT}</div>
          <div class="cat-card-bg" style="background-image: url('${img}');"></div>
          <div class="cat-card-overlay" style="background: ${grad};"></div>
          <div class="cat-card-content">
            <div class="cat-icon-new">
              <img src="${cat.icon}" alt="" aria-hidden="true">
            </div>
            <div class="cat-name-th-new">${cat.nameT}</div>
            <div class="cat-name-en-new">${cat.nameE}</div>
            <div class="cat-count-new">✦ ${cat.jobs.length} อาชีพ</div>
          </div>
        </div>
      `;
    });
    catGrid.innerHTML = html;
  });
}

function createJobCard(job, cat) {
  const tagsHtml = job.tags.slice(0, 3).map(t => `<span class="jcn-tag">${t}</span>`).join('');
  const country = getGlobalSelectedCountry();
  const salaryEntry = getGlobalSalary(job, 'entry');
  const salarySenior = getGlobalSalary(job, 'senior');
  return `
    <div class="jcn-card"
         role="button"
         tabindex="0"
         aria-label="${job.nameT} — เงินเดือนเริ่มต้นใน${country.nameT} ${salaryEntry.thbText} หรือ ${salaryEntry.usdText}"
         onclick="showJob('${job.id}', '${cat.id}')"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showJob('${job.id}','${cat.id}');}">
      <div class="jcn-thumb">
        <img src="${job.img}" alt="" role="presentation" loading="lazy"
          onload="this.closest('.jcn-thumb').classList.add('img-loaded')"
          onerror="this.closest('.jcn-thumb').classList.add('img-loaded'); this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23fce7f3\'/%3E%3Ctext x=\'50\' y=\'55\' font-size=\'30\' text-anchor=\'middle\' fill=\'%23be185d\'%3E${job.icon}%3C/text%3E%3C/svg%3E'">
        <div class="jcn-thumb-overlay"></div>
        <div class="jcn-color-strip" style="background: ${cat.color || 'var(--primary)'};"></div>
      </div>
      <div class="jcn-body">
        <div class="jcn-header">
          <div class="jcn-icon" aria-hidden="true" style="background: ${cat.color}; color: ${cat.iconColor};">${job.icon}</div>
          <div class="jcn-title-wrap">
            <div class="jcn-title-th">${job.nameT}</div>
            <div class="jcn-title-en">${job.nameE}</div>
          </div>
          <div class="jcn-arrow" aria-hidden="true">${DETAIL_ICONS.arrowRight}</div>
        </div>
        <div class="jcn-tags">${tagsHtml}</div>

        <div class="jcn-global-salary">
          <div class="jcn-gs-country">เงินเดือนใน${country.nameT} / เดือน</div>
          <div class="jcn-gs-values">
            <span class="show-thb">${salaryEntry.thbText}</span>
            <span class="show-usd">${salaryEntry.usdText}</span>
          </div>
        </div>

        <div class="jcn-salary-footer">
          <div class="jcn-sf-item">
            <div class="jcn-sf-label">เริ่มต้น</div>
            <div class="jcn-sf-value">
              <span class="show-thb">${salaryEntry.thbText}</span>
              <span class="show-usd">${salaryEntry.usdText}</span>
            </div>
          </div>
          <div class="jcn-sf-divider"></div>
          <div class="jcn-sf-item">
            <div class="jcn-sf-label">ระดับสูง</div>
            <div class="jcn-sf-value">
              <span class="show-thb">${salarySenior.thbText}</span>
              <span class="show-usd">${salarySenior.usdText}</span>
            </div>
          </div>
          <div class="jcn-sf-arrow-wrap" aria-hidden="true">${DETAIL_ICONS.arrowRightSm}</div>
        </div>
      </div>
    </div>
  `;
}

async function showCategory(catId) {
  await loadCategory(catId);
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  if (!cat) return;

  document.getElementById('breadcat').innerText = cat.nameT;

  const emoji   = CAT_CONFIG.emojis[cat.id] || '🚀';
  const heroImg = CAT_CONFIG.images[cat.id]  || '';
  const grad    = CAT_CONFIG.gradients[cat.id] || 'linear-gradient(135deg,#be185d,#f472b6)';

  const catHero = document.getElementById('catHero');
  if (catHero) {
    catHero.innerHTML = `
      <div class="cat-page-hero" style="--cat-grad: ${grad};">
        <div class="cph-bg" style="background-image: url('${heroImg}');"></div>
        <div class="cph-overlay" style="background: ${grad};"></div>
        <div class="cph-content">
          <div class="cph-eyebrow"><span class="cph-dot"></span> สายงาน</div>
          <h1 class="cph-title" style="margin:0;">${emoji} ${cat.nameT}</h1>
          <p class="cph-sub">${cat.nameE}</p>
          <div class="cph-meta">
            <div class="cph-meta-pill">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              ${cat.jobs.length} อาชีพในสายงานนี้
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const titleEl = document.getElementById('catPageTitle');
  if (titleEl) titleEl.innerHTML = '';

  let html = '';
  cat.jobs.forEach((job, index) => {
    html += `<div style="animation: fadeInUp 0.45s ease forwards; opacity: 0; animation-delay: ${0.08 + (index * 0.05)}s;">${createJobCard(job, cat)}</div>`;
  });
  document.getElementById('jobGrid').innerHTML = html;
  showPage('page-cat');

  const heroBg = document.querySelector('.cph-bg');
  if (heroBg && heroImg) {
    const preload = new Image();
    preload.onload  = () => heroBg.classList.add('bg-loaded');
    preload.onerror = () => heroBg.classList.add('bg-loaded');
    preload.src = heroImg;
  }
}

function showJob(jobId, catId) {
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  const job = cat?.jobs.find(j => j.id === jobId);
  if (!cat || !job) return;
  const country = getGlobalSelectedCountry();
  const salaryEntry = getGlobalSalary(job, 'entry');
  const salaryMid = getGlobalSalary(job, 'mid');
  const salarySenior = getGlobalSalary(job, 'senior');

  document.getElementById('breadcat2').innerText = cat.nameT;
  document.getElementById('breadjob').innerText  = job.nameT;

  let uniHtml = '';
  if (job.universities && job.universities.length > 0) {
    uniHtml = `
      <div class="edu-item">
        <div class="edu-dot edu-dot--svg" style="color:#be185d;" aria-hidden="true">${DETAIL_ICONS.university}</div>
        <div class="edu-text" style="flex:1;">
          <strong>มหาวิทยาลัย / คณะที่แนะนำ</strong>
          <ul style="margin: 8px 0 0 20px; padding: 0; font-size: 0.9em; opacity: 0.85; line-height: 1.6;">
            ${job.universities.map(u => `<li style="margin-bottom: 4px;">${u}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  const toggleIcon = globalCurrency === 'THB'
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> สลับเป็น USD ($)'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 1h6M12 1v22M15 23H9M6 10h12M6 14h12"></path></svg> สลับเป็น THB (฿)';

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero-banner">
      <div class="dhb-bg" style="background-image: url('${job.img}');" aria-hidden="true"></div>
      <div class="dhb-overlay"></div>
      <div class="dhb-badge-wrap">
        <div class="dhb-growth-badge">
          ${icon('trendUpSm', { style: 'margin-right:5px;' })}
          แนวโน้มการเติบโต: สูง
        </div>
      </div>
      <div class="dhb-content">
        <div class="dhb-header">
          <div class="dhb-icon-wrap" aria-hidden="true">${job.icon}</div>
          <div class="dhb-title-group">
            <h1 class="dhb-title-th" style="margin:0;">${job.nameT}</h1>
            <div class="dhb-title-en">${job.nameE}</div>
          </div>
        </div>
        <p class="dhb-desc">${job.description}</p>
        <div class="dhb-tags">
          ${job.tags.map(tag => `<span class="dhb-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="detail-stat-strip">
      <div class="dss-item">
        <div class="dss-icon" aria-hidden="true">${icon('graduation', { color: '#be185d' })}</div>
        <div class="dss-text">
          <div class="dss-label">วุฒิที่ต้องการ</div>
          <div class="dss-value">${job.degree}</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon" aria-hidden="true">${icon('clock', { color: '#0891b2' })}</div>
        <div class="dss-text">
          <div class="dss-label">ระยะเวลาเรียน</div>
          <div class="dss-value">${job.years}</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon" aria-hidden="true">${icon('wallet', { color: '#16a34a' })}</div>
          <div class="dss-text">
            <div class="dss-label">เงินเดือนเริ่มต้น</div>
          <div class="dss-value">
            <span class="show-thb">${salaryEntry.thbText}</span>
            <span class="show-usd">${salaryEntry.usdText}</span>
          </div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon" aria-hidden="true">${icon('trophy', { color: '#b45309' })}</div>
        <div class="dss-text">
          <div class="dss-label">ระดับสูงสุด</div>
          <div class="dss-value">
            <span class="show-thb">${salarySenior.thbText}</span>
            <span class="show-usd">${salarySenior.usdText}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-grid-v2">
      <div class="detail-main-v2">

        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon" aria-hidden="true">${icon('graduation', { color: '#f4e9ed', size: 22 })}</div>
            <h2 class="icv2-title" style="margin:0;">ข้อมูลการศึกษาและทักษะ</h2>
          </div>
          <div class="edu-timeline">
            <div class="edu-item">
              <div class="edu-dot edu-dot--svg" style="color:#6d28d9;" aria-hidden="true">${DETAIL_ICONS.book}</div>
              <div class="edu-text">
                <strong>วุฒิการศึกษาที่ต้องการ</strong>
                <span>${job.degree}<br><em style="color:#c084fc;font-size:12px;font-style:normal;font-weight:600;">${job.education}</em></span>
              </div>
            </div>
            <div class="edu-item">
              <div class="edu-dot edu-dot--svg" style="color:#0891b2;" aria-hidden="true">${DETAIL_ICONS.clockSm}</div>
              <div class="edu-text">
                <strong>ระยะเวลาเรียน / ฝึกฝนโดยเฉลี่ย</strong>
                <span>${job.years}</span>
              </div>
            </div>
            ${uniHtml}
            <div class="edu-item" style="padding-bottom:0;">
              <div class="edu-dot edu-dot--svg" style="color:#d97706;" aria-hidden="true">${DETAIL_ICONS.bolt}</div>
              <div class="edu-text" style="flex:1;">
                <strong>ทักษะสำคัญที่จำเป็น (Hard / Soft Skills)</strong>
                <div class="skills-cloud">${job.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon" aria-hidden="true">${icon('scale', { color: '#f8f0f3', size: 22 })}</div>
            <h2 class="icv2-title" style="margin:0;">วิเคราะห์ข้อดี — ข้อจำกัด</h2>
          </div>
          <div class="pro-con-v2">
            <div>
              <div class="pc-col-title pros">✓ ข้อดี (Pros)</div>
              ${job.pros.map(p => `<div class="pc-item pro"><span class="pc-dot" style="color:#22c55e;" aria-hidden="true">●</span>${p}</div>`).join('')}
            </div>
            <div>
              <div class="pc-col-title cons">✗ ข้อจำกัด (Cons)</div>
              ${job.cons.map(c => `<div class="pc-item con"><span class="pc-dot" style="color:#f43f5e;" aria-hidden="true">●</span>${c}</div>`).join('')}
            </div>
          </div>
        </div>

      </div>

      <div class="detail-sidebar-v2">

        <div class="salary-card-v2">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 12px; flex-wrap:wrap; gap:10px;">
            <h2 class="scv2-title" style="margin:0;">
              <span aria-hidden="true">${icon('barChart', { color: '#be185d', style: 'margin-right:6px;' })}</span> โครงสร้างเงินเดือนใน${country.nameT}
            </h2>
            <button type="button" class="currency-toggle-btn" onclick="toggleCurrency()" style="margin-top:0;">
              ${toggleIcon}
            </button>
          </div>

          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">เริ่มต้น (Entry)</span>
              <span class="scv2-amount">
                <span class="show-thb">${salaryEntry.thbText}</span>
                <span class="show-usd">${salaryEntry.usdText}</span>
              </span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนเริ่มต้น"><div class="scv2-bar-fill entry" id="bar2-entry"></div></div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">มีประสบการณ์ (Mid)</span>
              <span class="scv2-amount">
                <span class="show-thb">${salaryMid.thbText}</span>
                <span class="show-usd">${salaryMid.usdText}</span>
              </span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนระดับกลาง"><div class="scv2-bar-fill mid" id="bar2-mid"></div></div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">ระดับสูง / ผู้เชี่ยวชาญ</span>
              <span class="scv2-amount">
                <span class="show-thb">${salarySenior.thbText}</span>
                <span class="show-usd">${salarySenior.usdText}</span>
              </span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนระดับสูง"><div class="scv2-bar-fill senior" id="bar2-senior"></div></div>
          </div>
          <div class="scv2-note"><span aria-hidden="true">${DETAIL_ICONS.info}</span> แปลงจากฐานข้อมูลเดิมด้วยตัวคูณตลาดแรงงาน${country.nameT} และอัตรา 1 USD ≈ ${GLOBAL_EXPLORER.usdThbRate.toFixed(2)} THB (สดจาก Frankfurter)</div>
        </div>

        <div class="growth-card-v2">
          <div class="growth-indicator"><span aria-hidden="true">${icon('trendUp', { style: 'margin-right:6px;' })}</span> แนวโน้มการเติบโต</div>
          <h2 class="gcv2-title" style="margin:0;">
            <span aria-hidden="true">${icon('fileText', { style: 'margin-right:6px;flex-shrink:0;' })}</span> โอกาสในอนาคต
          </h2>
          <p class="gcv2-text">${job.growth}</p>
        </div>

        <div class="detail-related-card">
          <h2 class="drc-title" style="margin:0;">
            <span aria-hidden="true">${icon('link', { color: '#be185d', style: 'margin-right:6px;' })}</span> ทักษะที่เกี่ยวข้อง
          </h2>
          <div class="drc-skills">
            ${job.skills.slice(0, 5).map((s, i) => `
              <div class="drc-skill-row">
                <span class="drc-skill-name">${s}</span>
                <div class="drc-skill-bar-track" role="img" aria-label="${s}">
                  <div class="drc-skill-bar-fill" style="width:${85 - i * 10}%; animation-delay:${0.2 + i * 0.1}s;"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  showPage('page-detail');

  setTimeout(() => {
    const detailBg = document.querySelector('.dhb-bg');
    if (detailBg && job.img) {
      const preload = new Image();
      preload.onload  = () => detailBg.classList.add('bg-loaded');
      preload.onerror = () => detailBg.classList.add('bg-loaded');
      preload.src = job.img;
    }
  }, 0);

  setTimeout(() => {
    const e = document.getElementById('bar2-entry');
    const m = document.getElementById('bar2-mid');
    const s = document.getElementById('bar2-senior');
    if (e && job.salaryBar?.entry)  e.style.width = job.salaryBar.entry  + '%';
    if (m && job.salaryBar?.mid)    m.style.width = job.salaryBar.mid    + '%';
    if (s && job.salaryBar?.senior) s.style.width = job.salaryBar.senior + '%';
  }, 140);
}

window.onload = async () => {
  // ดึงค่าเงิน USD/THB สดก่อน (มี fallback = 35 ถ้า API ล่ม จึงไม่ block ระบบ)
  await fetchUsdThbRate();

  await loadAllCategories();
  renderCategories();
  if (typeof startSlider === 'function') startSlider();

  const total = DATA.categories.reduce((sum, cat) => sum + cat.jobs.length, 0);
  const totalJobsEl = document.getElementById('totalJobs');
  if (totalJobsEl) totalJobsEl.textContent = total + '+';

  const aboutTotalCatEl = document.getElementById('aboutTotalCat');
  if (aboutTotalCatEl) aboutTotalCatEl.textContent = DATA.categories.length;

  const aboutTotalJobsEl = document.getElementById('aboutTotalJobs');
  if (aboutTotalJobsEl) aboutTotalJobsEl.textContent = total + '+';
};
