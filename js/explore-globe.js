/**
 * Career Explorer Pro - Global Explore Module
 * ────────────────────────────────────────────
 * - Stage 1: 3D wireframe globe (Three.js) + continent legend
 * - Stage 2: 3 featured countries per continent
 * - Stage 3: Career listing per country with dual-currency salary (USD / THB)
 *
 * Note: This module ONLY touches page-explore. All other pages remain intact.
 */
(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DATA — 6 inhabited continents, 3 featured countries each
  // ──────────────────────────────────────────────────────────────────────────
  const CONTINENTS = [
    {
      id: 'asia',
      nameT: 'เอเชีย',
      nameE: 'Asia',
      short: 'AS',
      // approx center (lon, lat) used by the 3D globe to focus
      center: { lon: 100, lat: 25 },
      countries: ['TH', 'JP', 'SG']
    },
    {
      id: 'europe',
      nameT: 'ยุโรป',
      nameE: 'Europe',
      short: 'EU',
      center: { lon: 15, lat: 54 },
      countries: ['DE', 'GB', 'FR']
    },
    {
      id: 'namerica',
      nameT: 'อเมริกาเหนือ',
      nameE: 'North America',
      short: 'NA',
      center: { lon: -100, lat: 45 },
      countries: ['US', 'CA', 'MX']
    },
    {
      id: 'samerica',
      nameT: 'อเมริกาใต้',
      nameE: 'South America',
      short: 'SA',
      center: { lon: -60, lat: -15 },
      countries: ['BR', 'AR', 'CL']
    },
    {
      id: 'africa',
      nameT: 'แอฟริกา',
      nameE: 'Africa',
      short: 'AF',
      center: { lon: 20, lat: 5 },
      countries: ['ZA', 'EG', 'NG']
    },
    {
      id: 'oceania',
      nameT: 'โอเชียเนีย',
      nameE: 'Oceania',
      short: 'OC',
      center: { lon: 140, lat: -25 },
      countries: ['AU', 'NZ', 'FJ']
    }
  ];

  // Country definitions:
  //   mult     = local-purchasing salary multiplier vs. Thai baseline
  //   currency = local currency CODE (informational)
  //   ppp      = informative cost-of-living index (THB = 100)
  //   flag     = inline SVG (simple, no external dependencies)
  const COUNTRIES = {
    // ── ASIA
    TH: { nameT: 'ประเทศไทย',          nameE: 'Thailand',      currency: 'THB', capital: 'กรุงเทพฯ',       cost: 100, mult: 1.00,
          flag: flagBands(['#ED1C24', '#FFFFFF', '#241D4F', '#FFFFFF', '#ED1C24'], [1,1,2,1,1]) },
    JP: { nameT: 'ประเทศญี่ปุ่น',        nameE: 'Japan',         currency: 'JPY', capital: 'โตเกียว',         cost: 165, mult: 2.40,
          flag: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg"><rect width="90" height="60" fill="#fff"/><circle cx="45" cy="30" r="18" fill="#BC002D"/></svg>` },
    SG: { nameT: 'สิงคโปร์',            nameE: 'Singapore',     currency: 'SGD', capital: 'สิงคโปร์',          cost: 195, mult: 3.10,
          flag: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg"><rect width="90" height="30" fill="#EF3340"/><rect y="30" width="90" height="30" fill="#fff"/><circle cx="22" cy="15" r="8" fill="#fff"/><circle cx="25" cy="15" r="8" fill="#EF3340"/><g fill="#fff" transform="translate(30,9) scale(0.45)"><polygon points="6,0 7.5,4.5 12,4.5 8.3,7.5 9.8,12 6,9.2 2.2,12 3.7,7.5 0,4.5 4.5,4.5"/></g></svg>` },

    // ── EUROPE
    DE: { nameT: 'ประเทศเยอรมนี',     nameE: 'Germany',       currency: 'EUR', capital: 'เบอร์ลิน',          cost: 180, mult: 3.00,
          flag: flagBands(['#000000', '#DD0000', '#FFCE00'], [1,1,1]) },
    GB: { nameT: 'สหราชอาณาจักร',     nameE: 'United Kingdom', currency: 'GBP', capital: 'ลอนดอน',         cost: 200, mult: 3.30,
          flag: ukFlag() },
    FR: { nameT: 'ประเทศฝรั่งเศส',      nameE: 'France',        currency: 'EUR', capital: 'ปารีส',            cost: 185, mult: 2.95,
          flag: vertical(['#0055A4','#FFFFFF','#EF4135']) },

    // ── NORTH AMERICA
    US: { nameT: 'สหรัฐอเมริกา',        nameE: 'United States', currency: 'USD', capital: 'วอชิงตัน ดี.ซี.',     cost: 220, mult: 3.60,
          flag: usaFlag() },
    CA: { nameT: 'ประเทศแคนาดา',     nameE: 'Canada',        currency: 'CAD', capital: 'ออตตาวา',         cost: 195, mult: 3.05,
          flag: canadaFlag() },
    MX: { nameT: 'ประเทศเม็กซิโก',     nameE: 'Mexico',        currency: 'MXN', capital: 'เม็กซิโกซิตี',       cost: 95,  mult: 0.85,
          flag: vertical(['#006847','#FFFFFF','#CE1126']) },

    // ── SOUTH AMERICA
    BR: { nameT: 'ประเทศบราซิล',      nameE: 'Brazil',        currency: 'BRL', capital: 'บราซิเลีย',          cost: 110, mult: 1.10,
          flag: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg"><rect width="90" height="60" fill="#009C3B"/><polygon points="45,8 82,30 45,52 8,30" fill="#FFDF00"/><circle cx="45" cy="30" r="11" fill="#002776"/></svg>` },
    AR: { nameT: 'ประเทศอาร์เจนตินา',  nameE: 'Argentina',     currency: 'ARS', capital: 'บัวโนสไอเรส',     cost: 90,  mult: 0.75,
          flag: flagBands(['#74ACDF','#FFFFFF','#74ACDF'], [1,1,1]) },
    CL: { nameT: 'ประเทศชิลี',         nameE: 'Chile',         currency: 'CLP', capital: 'ซานติอาโก',        cost: 115, mult: 1.30,
          flag: chileFlag() },

    // ── AFRICA
    ZA: { nameT: 'แอฟริกาใต้',         nameE: 'South Africa',  currency: 'ZAR', capital: 'พริทอเรีย',          cost: 95,  mult: 1.10,
          flag: zaFlag() },
    EG: { nameT: 'ประเทศอียิปต์',       nameE: 'Egypt',         currency: 'EGP', capital: 'ไคโร',             cost: 70,  mult: 0.55,
          flag: flagBands(['#CE1126','#FFFFFF','#000000'], [1,1,1]) },
    NG: { nameT: 'ประเทศไนจีเรีย',     nameE: 'Nigeria',       currency: 'NGN', capital: 'อาบูจา',            cost: 75,  mult: 0.50,
          flag: vertical(['#008751','#FFFFFF','#008751']) },

    // ── OCEANIA
    AU: { nameT: 'ประเทศออสเตรเลีย', nameE: 'Australia',     currency: 'AUD', capital: 'แคนเบอร์รา',        cost: 200, mult: 3.20,
          flag: ausFlag() },
    NZ: { nameT: 'ประเทศนิวซีแลนด์',   nameE: 'New Zealand',   currency: 'NZD', capital: 'เวลลิงตัน',         cost: 190, mult: 2.80,
          flag: nzFlag() },
    FJ: { nameT: 'ประเทศฟิจิ',         nameE: 'Fiji',          currency: 'FJD', capital: 'ซูวา',             cost: 105, mult: 1.05,
          flag: `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg"><rect width="90" height="60" fill="#68BFE5"/><rect width="45" height="30" fill="#012169"/><path d="M0,0 L45,30 M45,0 L0,30" stroke="#fff" stroke-width="4"/><path d="M0,0 L45,30 M45,0 L0,30" stroke="#C8102E" stroke-width="2"/><path d="M22.5,0 V30 M0,15 H45" stroke="#fff" stroke-width="6"/><path d="M22.5,0 V30 M0,15 H45" stroke="#C8102E" stroke-width="3"/></svg>` }
  };

  // Constant FX (1 USD ≈ 35.5 THB used for display)
  const USD_THB = 35.5;

  // ──────────────────────────────────────────────────────────────────────────
  // 2. FLAG HELPERS (compact SVG flags so we have zero external deps)
  // ──────────────────────────────────────────────────────────────────────────
  function flagBands(colors, weights) {
    const W = 90, H = 60;
    const total = weights.reduce((a, b) => a + b, 0);
    let y = 0;
    const bands = colors.map((c, i) => {
      const h = (weights[i] / total) * H;
      const rect = `<rect x="0" y="${y}" width="${W}" height="${h}" fill="${c}"/>`;
      y += h;
      return rect;
    }).join('');
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${bands}</svg>`;
  }
  function vertical(colors) {
    const W = 90, H = 60, bw = W / colors.length;
    const bands = colors.map((c, i) => `<rect x="${i*bw}" y="0" width="${bw}" height="${H}" fill="${c}"/>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${bands}</svg>`;
  }
  function ukFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="60" fill="#012169"/>
      <path d="M0,0 L90,60 M90,0 L0,60" stroke="#fff" stroke-width="9"/>
      <path d="M0,0 L90,60 M90,0 L0,60" stroke="#C8102E" stroke-width="5"/>
      <path d="M45,0 V60 M0,30 H90" stroke="#fff" stroke-width="14"/>
      <path d="M45,0 V60 M0,30 H90" stroke="#C8102E" stroke-width="7"/>
    </svg>`;
  }
  function usaFlag() {
    const stripes = [];
    for (let i = 0; i < 13; i++) {
      stripes.push(`<rect x="0" y="${i*(60/13)}" width="90" height="${60/13}" fill="${i%2===0?'#B22234':'#FFFFFF'}"/>`);
    }
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      ${stripes.join('')}
      <rect x="0" y="0" width="36" height="${60*7/13}" fill="#3C3B6E"/>
    </svg>`;
  }
  function canadaFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="22.5" height="60" fill="#D52B1E"/>
      <rect x="22.5" y="0" width="45" height="60" fill="#fff"/>
      <rect x="67.5" y="0" width="22.5" height="60" fill="#D52B1E"/>
      <path d="M45,16 L48,24 L56,20 L52,28 L60,30 L52,32 L56,40 L48,36 L45,46 L42,36 L34,40 L38,32 L30,30 L38,28 L34,20 L42,24 Z" fill="#D52B1E"/>
    </svg>`;
  }
  function chileFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="30" fill="#fff"/>
      <rect y="30" width="90" height="30" fill="#D52B1E"/>
      <rect width="30" height="30" fill="#0039A6"/>
      <polygon points="15,8 17,14 23,14 18,18 20,24 15,20 10,24 12,18 7,14 13,14" fill="#fff"/>
    </svg>`;
  }
  function zaFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="60" fill="#fff"/>
      <polygon points="0,0 90,0 90,20 30,30 90,40 90,60 0,60" fill="#007749"/>
      <polygon points="0,0 90,0 35,30 90,60 0,60" fill="#001489" opacity="0"/>
      <polygon points="0,0 35,30 0,60" fill="#000"/>
      <polygon points="0,6 28,30 0,54" fill="#FFB81C"/>
      <polygon points="0,12 20,30 0,48" fill="#000"/>
      <rect y="0" width="90" height="14" fill="#DE3831"/>
      <rect y="46" width="90" height="14" fill="#002395"/>
      <polygon points="0,14 26,30 0,46" fill="#000"/>
      <polygon points="0,20 12,30 0,40" fill="#FFB81C"/>
    </svg>`;
  }
  function ausFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="60" fill="#012169"/>
      <rect width="45" height="30" fill="#012169"/>
      <path d="M0,0 L45,30 M45,0 L0,30" stroke="#fff" stroke-width="4"/>
      <path d="M0,0 L45,30 M45,0 L0,30" stroke="#C8102E" stroke-width="2"/>
      <path d="M22.5,0 V30 M0,15 H45" stroke="#fff" stroke-width="6"/>
      <path d="M22.5,0 V30 M0,15 H45" stroke="#C8102E" stroke-width="3"/>
      <g fill="#fff">
        <circle cx="68" cy="20" r="3"/><circle cx="78" cy="32" r="2.5"/><circle cx="64" cy="42" r="2.5"/>
        <circle cx="75" cy="48" r="2"/><circle cx="84" cy="42" r="2"/>
      </g>
    </svg>`;
  }
  function nzFlag() {
    return `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="60" fill="#012169"/>
      <rect width="45" height="30" fill="#012169"/>
      <path d="M0,0 L45,30 M45,0 L0,30" stroke="#fff" stroke-width="4"/>
      <path d="M0,0 L45,30 M45,0 L0,30" stroke="#C8102E" stroke-width="2"/>
      <path d="M22.5,0 V30 M0,15 H45" stroke="#fff" stroke-width="6"/>
      <path d="M22.5,0 V30 M0,15 H45" stroke="#C8102E" stroke-width="3"/>
      <g fill="#C8102E" stroke="#fff" stroke-width="0.6">
        <circle cx="68" cy="20" r="3"/><circle cx="78" cy="32" r="2.5"/><circle cx="64" cy="42" r="2.5"/><circle cx="80" cy="46" r="2.5"/>
      </g>
    </svg>`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. STATE
  // ──────────────────────────────────────────────────────────────────────────
  const STATE = {
    // 1 = globe, 2 = country list, 3 = category grid (within country),
    // 4 = job grid (within country + category), 5 = job detail
    stage: 1,
    continentId: null,
    countryCode: null,
    categoryId: null,
    jobId: null,
    fx: 'THB',         // active currency: 'THB' or 'USD'
    initialized: false,
    globe: null
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 4. STAGE 1 — Globe view rendering
  // ──────────────────────────────────────────────────────────────────────────
  function renderStage1() {
    const root = document.getElementById('page-explore');
    if (!root) return;

    const continentItems = CONTINENTS.map(c => `
      <button type="button" class="gx-continent-pill"
              data-continent="${c.id}"
              aria-label="ดูประเทศใน${c.nameT}">
        <span class="gx-cp-dot">${c.short}</span>
        <span class="gx-cp-text">
          <span class="gx-cp-th">${c.nameT}</span>
          <span class="gx-cp-en">${c.nameE}</span>
        </span>
        <span class="gx-cp-count">${c.countries.length} ประเทศ</span>
      </button>
    `).join('');

    root.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
        ${renderBreadtrail()}

        <div class="gx-stage active" id="gxStage1">
          <div class="gx-globe-wrap">
            <div>
              <div class="gx-globe-stage">
                <div id="globeCanvasHost" aria-label="ลูกโลกแบบหมุนได้ คลิกที่ทวีปเพื่อสำรวจ"></div>
                <div class="gx-globe-tip" id="globeTip"></div>
                <div class="gx-globe-hint" id="globeHint">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-6 0v7"/><path d="M5 12l2-2 3 4 4-3 5 5v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/>
                  </svg>
                  ลากเพื่อหมุน · คลิกทวีปเพื่อสำรวจ
                </div>
              </div>
            </div>
            <div class="gx-globe-aside">
              <div class="gx-eyebrow"><span class="gx-dot"></span> GLOBAL CAREER EXPLORER</div>
              <h1 class="gx-hero-title">สำรวจอาชีพทั่ว<span class="pink-accent">โลก</span><br>ในมุมมอง 3 มิติ</h1>
              <p class="gx-hero-sub">เลือกทวีปและประเทศที่สนใจ เพื่อดูเงินเดือนของอาชีพต่าง ๆ ในประเทศนั้น พร้อมเปรียบเทียบทั้งในรูปแบบเงินบาท (THB) และดอลลาร์สหรัฐ (USD)</p>
              <div class="gx-continent-list">${continentItems}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // continent click handlers
    root.querySelectorAll('.gx-continent-pill').forEach(btn => {
      btn.addEventListener('click', () => openContinent(btn.dataset.continent));
    });

    // boot the 3D globe
    initGlobe();
  }

  // Breadtrail used across all stages
  function renderBreadtrail() {
    const cont    = CONTINENTS.find(c => c.id === STATE.continentId);
    const country = STATE.countryCode ? COUNTRIES[STATE.countryCode] : null;
    const cat     = (window.DATA && STATE.categoryId)
      ? DATA.categories.find(c => c.id === STATE.categoryId) : null;
    const job     = (cat && STATE.jobId)
      ? cat.jobs.find(j => j.id === STATE.jobId) : null;

    const step = (label, active, done, onClick) => `
      <span class="gx-step ${active ? 'active' : done ? 'done' : ''}"
            ${done && onClick ? `onclick="${onClick}"` : ''}>${label}</span>
    `;

    let html = `<div class="gx-breadtrail">`;
    html += step('ทวีป', STATE.stage === 1, STATE.stage > 1, 'window.__gx.goStage1()');
    html += `<span class="gx-sep">›</span>`;
    html += step(cont ? cont.nameT : 'ประเทศ',
                 STATE.stage === 2,
                 STATE.stage > 2 && !!cont,
                 cont ? `window.__gx.goStage2('${cont.id}')` : '');

    if (STATE.stage >= 3) {
      html += `<span class="gx-sep">›</span>`;
      html += step(country ? country.nameT : 'สำรวจ',
                   STATE.stage === 3,
                   STATE.stage > 3 && !!country,
                   country ? `window.__gx.goStage3()` : '');
    }
    if (STATE.stage >= 4) {
      html += `<span class="gx-sep">›</span>`;
      html += step(cat ? cat.nameT : 'สายงาน',
                   STATE.stage === 4,
                   STATE.stage > 4 && !!cat,
                   cat ? `window.__gx.goStage4('${cat.id}')` : '');
    }
    if (STATE.stage >= 5) {
      html += `<span class="gx-sep">›</span>`;
      html += step(job ? job.nameT : 'อาชีพ', true, false, '');
    }
    html += `</div>`;
    return html;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. STAGE 2 — Country selection
  // ──────────────────────────────────────────────────────────────────────────
  function renderStage2() {
    const root = document.getElementById('page-explore');
    const cont = CONTINENTS.find(c => c.id === STATE.continentId);
    if (!root || !cont) return;

    const cards = cont.countries.map(code => {
      const c = COUNTRIES[code];
      if (!c) return '';
      return `
        <button type="button" class="gx-country-card" data-country="${code}"
                aria-label="ดูอาชีพในประเทศ${c.nameT}">
          <div class="gx-cc-top">
            <div class="gx-country-flag">${c.flag}</div>
            <div>
              <div class="gx-country-name">${c.nameT}</div>
              <div class="gx-country-name-en">${c.nameE}</div>
            </div>
          </div>
          <div class="gx-cc-meta">
            <div class="gx-cc-meta-item">
              <div class="gx-cc-meta-label">เมืองหลวง</div>
              <div class="gx-cc-meta-value">${c.capital}</div>
            </div>
            <div class="gx-cc-meta-item">
              <div class="gx-cc-meta-label">สกุลเงิน</div>
              <div class="gx-cc-meta-value">${c.currency}</div>
            </div>
            <div class="gx-cc-meta-item">
              <div class="gx-cc-meta-label">ค่าครองชีพ</div>
              <div class="gx-cc-meta-value">${c.cost} <span style="font-size:11px;color:#c63a78;">/100 (TH=100)</span></div>
            </div>
            <div class="gx-cc-meta-item">
              <div class="gx-cc-meta-label">เงินเดือนเฉลี่ย</div>
              <div class="gx-cc-meta-value">×${c.mult.toFixed(2)} <span style="font-size:11px;color:#c63a78;">vs TH</span></div>
            </div>
          </div>
          <div class="gx-cc-foot">
            <span>สำรวจสายงานและเงินเดือน</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </div>
        </button>
      `;
    }).join('');

    root.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
        ${renderBreadtrail()}
        <button class="gx-back-pill" onclick="window.__gx.goStage1()" style="margin-bottom: 22px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6"/>
          </svg>
          กลับไปเลือกทวีป
        </button>

        <div class="gx-section-head">
          <div>
            <div class="gx-eyebrow"><span class="gx-dot"></span> ${cont.nameE.toUpperCase()}</div>
            <h2 class="gx-sh-title" style="margin-top:10px;">3 ประเทศเด่นใน${cont.nameT}</h2>
            <div class="gx-sh-sub">คลิกประเทศที่สนใจเพื่อดูอาชีพและเงินเดือนในประเทศนั้น</div>
          </div>
        </div>

        <div class="gx-country-grid">${cards}</div>
      </div>
    `;

    root.querySelectorAll('.gx-country-card').forEach(card => {
      card.addEventListener('click', () => openCountry(card.dataset.country));
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. STAGE 3 — Category grid for the chosen country
  // ──────────────────────────────────────────────────────────────────────────
  function renderStage3() {
    const root = document.getElementById('page-explore');
    const cont = CONTINENTS.find(c => c.id === STATE.continentId);
    const country = COUNTRIES[STATE.countryCode];
    if (!root || !cont || !country) return;

    root.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
        ${renderBreadtrail()}
        <button class="gx-back-pill" onclick="window.__gx.goStage2('${cont.id}')" style="margin-bottom: 18px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6"/>
          </svg>
          กลับไปเลือกประเทศใน${cont.nameT}
        </button>

        ${countryBannerHtml(cont, country)}

        <div class="section-header" style="text-align:center; margin: 28px 0 22px;">
          <div class="section-tag-v3" style="margin: 0 auto 12px auto;">ALL CATEGORIES</div>
          <h2 class="section-title-v3">สำรวจสายงานในประเทศ${country.nameT}</h2>
          <p class="section-desc-v3">คลิกที่หมวดหมู่เพื่อดูอาชีพทั้งหมดในสายงานนั้น (เงินเดือนปรับตามประเทศ)</p>
        </div>

        <div class="cat-grid" id="gxCatGrid"></div>
      </div>
    `;

    wireFxToggle(root);

    (async () => {
      if (typeof loadAllCategories === 'function' && !window.DATA) {
        try { await loadAllCategories(); } catch (e) { /* fallback handled */ }
      }
      renderCategoryGrid();
    })();
  }

  function renderCategoryGrid() {
    const grid = document.getElementById('gxCatGrid');
    if (!grid) return;
    if (!window.DATA || !DATA.categories) {
      grid.innerHTML = `<div class="gx-empty">ยังไม่มีข้อมูลสายงาน</div>`;
      return;
    }

    const CAT = (typeof CAT_CONFIG !== 'undefined') ? CAT_CONFIG : { images: {}, gradients: {}, emojis: {} };
    let html = '';
    DATA.categories.forEach((cat, index) => {
      const img  = CAT.images[cat.id]    || '';
      const grad = CAT.gradients[cat.id] || 'linear-gradient(135deg, #be185d, #f472b6)';
      html += `
        <div class="cat-card-new"
             role="button" tabindex="0"
             data-cat="${cat.id}"
             aria-label="ดูอาชีพในสายงาน${cat.nameT} (${COUNTRIES[STATE.countryCode].nameT})"
             style="animation: fadeInUp 0.5s ease forwards; opacity: 0; animation-delay: ${0.05 + index * 0.05}s;">
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
    grid.innerHTML = html;

    grid.querySelectorAll('.cat-card-new').forEach(card => {
      const open = () => openCategory(card.dataset.cat);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. STAGE 4 — Job grid for chosen country + category
  // ──────────────────────────────────────────────────────────────────────────
  function renderStage4() {
    const root = document.getElementById('page-explore');
    const cont = CONTINENTS.find(c => c.id === STATE.continentId);
    const country = COUNTRIES[STATE.countryCode];
    if (!root || !cont || !country) return;

    (async () => {
      if (typeof loadCategory === 'function') {
        try { await loadCategory(STATE.categoryId); } catch (e) {}
      }
      const cat = window.DATA && DATA.categories.find(c => c.id === STATE.categoryId);
      if (!cat) {
        root.innerHTML = `<div class="container" style="padding:60px 0;"><div class="gx-empty">ไม่พบสายงาน</div></div>`;
        return;
      }

      const CAT = (typeof CAT_CONFIG !== 'undefined') ? CAT_CONFIG : { images: {}, gradients: {}, emojis: {} };
      const emoji   = CAT.emojis[cat.id] || '';
      const heroImg = CAT.images[cat.id] || '';
      const grad    = CAT.gradients[cat.id] || 'linear-gradient(135deg,#be185d,#f472b6)';

      root.innerHTML = `
        <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
          ${renderBreadtrail()}
          <button class="gx-back-pill" onclick="window.__gx.goStage3()" style="margin-bottom: 18px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6"/>
            </svg>
            กลับไปเลือกสายงาน
          </button>

          ${countryBannerHtml(cont, country)}

          <div class="cat-page-hero" style="--cat-grad: ${grad}; margin-top: 26px;">
            <div class="cph-bg" style="background-image: url('${heroImg}');"></div>
            <div class="cph-overlay" style="background: ${grad};"></div>
            <div class="cph-content">
              <div class="cph-eyebrow"><span class="cph-dot"></span> สายงานในประเทศ ${country.nameT}</div>
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

          <div class="job-grid" id="gxJobGrid"></div>
        </div>
      `;

      wireFxToggle(root);

      // job cards
      const jobGrid = document.getElementById('gxJobGrid');
      let html = '';
      cat.jobs.forEach((job, index) => {
        html += `<div style="animation: fadeInUp 0.45s ease forwards; opacity: 0; animation-delay: ${0.05 + index * 0.04}s;">
          ${buildJobCardClassic(job, cat, country)}
        </div>`;
      });
      jobGrid.innerHTML = html;

      jobGrid.querySelectorAll('[data-job]').forEach(el => {
        const id = el.getAttribute('data-job');
        el.addEventListener('click', () => openJob(id));
        el.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openJob(id); }
        });
      });

      // hero preload reveal
      const heroBg = root.querySelector('.cph-bg');
      if (heroBg && heroImg) {
        const preload = new Image();
        preload.onload  = () => heroBg.classList.add('bg-loaded');
        preload.onerror = () => heroBg.classList.add('bg-loaded');
        preload.src = heroImg;
      }
    })();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. STAGE 5 — Job detail (country-aware, dual currency)
  // ──────────────────────────────────────────────────────────────────────────
  function renderStage5() {
    const root = document.getElementById('page-explore');
    const cont = CONTINENTS.find(c => c.id === STATE.continentId);
    const country = COUNTRIES[STATE.countryCode];
    const cat = window.DATA && DATA.categories.find(c => c.id === STATE.categoryId);
    const job = cat && cat.jobs.find(j => j.id === STATE.jobId);
    if (!root || !cont || !country || !cat || !job) return;

    const entry  = parseRangeTHB(job.salary?.entry);
    const mid    = parseRangeTHB(job.salary?.mid);
    const senior = parseRangeTHB(job.salary?.senior);
    const ccy    = STATE.fx;
    const mult   = country.mult;

    let uniHtml = '';
    if (job.universities && job.universities.length > 0) {
      uniHtml = `
        <div class="edu-item">
          <div class="edu-dot" style="color:#be185d;" aria-hidden="true">●</div>
          <div class="edu-text" style="flex:1;">
            <strong>มหาวิทยาลัย / คณะที่แนะนำ</strong>
            <ul style="margin: 8px 0 0 20px; padding: 0; font-size: 0.9em; opacity: 0.85; line-height: 1.6;">
              ${job.universities.map(u => `<li style="margin-bottom: 4px;">${u}</li>`).join('')}
            </ul>
          </div>
        </div>`;
    }

    root.innerHTML = `
      <div class="container" style="padding-top: 40px; padding-bottom: 80px;">
        ${renderBreadtrail()}
        <button class="gx-back-pill" onclick="window.__gx.goStage4('${cat.id}')" style="margin-bottom: 18px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6"/>
          </svg>
          กลับไปดูอาชีพทั้งหมดในสายงาน
        </button>

        ${countryBannerHtml(cont, country)}

        <div class="detail-hero-banner" style="margin-top:26px;">
          <div class="dhb-bg" style="background-image: url('${job.img}');" aria-hidden="true"></div>
          <div class="dhb-overlay"></div>
          <div class="dhb-badge-wrap">
            <div class="dhb-growth-badge">แนวโน้มการเติบโต: สูง</div>
          </div>
          <div class="dhb-content">
            <div class="dhb-header">
              <div class="dhb-icon-wrap" aria-hidden="true">${job.icon || ''}</div>
              <div class="dhb-title-group">
                <h1 class="dhb-title-th" style="margin:0;">${job.nameT}</h1>
                <div class="dhb-title-en">${job.nameE}</div>
              </div>
            </div>
            <p class="dhb-desc">${job.description || ''}</p>
            <div class="dhb-tags">
              ${(job.tags || []).map(tag => `<span class="dhb-tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="detail-stat-strip">
          <div class="dss-item">
            <div class="dss-icon" aria-hidden="true">●</div>
            <div class="dss-text">
              <div class="dss-label">วุฒิที่ต้องการ</div>
              <div class="dss-value">${job.degree || '-'}</div>
            </div>
          </div>
          <div class="dss-divider"></div>
          <div class="dss-item">
            <div class="dss-icon" aria-hidden="true">●</div>
            <div class="dss-text">
              <div class="dss-label">ระยะเวลาเรียน</div>
              <div class="dss-value">${job.years || '-'}</div>
            </div>
          </div>
          <div class="dss-divider"></div>
          <div class="dss-item">
            <div class="dss-icon" aria-hidden="true">●</div>
            <div class="dss-text">
              <div class="dss-label">เงินเดือนเริ่มต้น</div>
              <div class="dss-value">${salaryLineTHB(entry, mult, ccy)}</div>
            </div>
          </div>
          <div class="dss-divider"></div>
          <div class="dss-item">
            <div class="dss-icon" aria-hidden="true">●</div>
            <div class="dss-text">
              <div class="dss-label">ระดับสูงสุด</div>
              <div class="dss-value">${salaryLineTHB(senior, mult, ccy)}</div>
            </div>
          </div>
        </div>

        <div class="detail-grid-v2">
          <div class="detail-main-v2">

            <div class="info-card-v2">
              <div class="icv2-header">
                <div class="icv2-header-icon" aria-hidden="true">●</div>
                <h2 class="icv2-title" style="margin:0;">ข้อมูลการศึกษาและทักษะ</h2>
              </div>
              <div class="edu-timeline">
                <div class="edu-item">
                  <div class="edu-dot" style="color:#6d28d9;" aria-hidden="true">●</div>
                  <div class="edu-text">
                    <strong>วุฒิการศึกษาที่ต้องการ</strong>
                    <span>${job.degree || '-'}<br><em style="color:#c084fc;font-size:12px;font-style:normal;font-weight:600;">${job.education || ''}</em></span>
                  </div>
                </div>
                <div class="edu-item">
                  <div class="edu-dot" style="color:#0891b2;" aria-hidden="true">●</div>
                  <div class="edu-text">
                    <strong>ระยะเวลาเรียน / ฝึกฝนโดยเฉลี่ย</strong>
                    <span>${job.years || '-'}</span>
                  </div>
                </div>
                ${uniHtml}
                <div class="edu-item" style="padding-bottom:0;">
                  <div class="edu-dot" style="color:#d97706;" aria-hidden="true">●</div>
                  <div class="edu-text" style="flex:1;">
                    <strong>ทักษะสำคัญที่จำเป็น</strong>
                    <div class="skills-cloud">${(job.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-card-v2">
              <div class="icv2-header">
                <div class="icv2-header-icon" aria-hidden="true">●</div>
                <h2 class="icv2-title" style="margin:0;">วิเคราะห์ข้อดี — ข้อจำกัด</h2>
              </div>
              <div class="pro-con-v2">
                <div>
                  <div class="pc-col-title pros">✓ ข้อดี (Pros)</div>
                  ${(job.pros || []).map(p => `<div class="pc-item pro"><span class="pc-dot" style="color:#22c55e;">●</span>${p}</div>`).join('')}
                </div>
                <div>
                  <div class="pc-col-title cons">✗ ข้อจำกัด (Cons)</div>
                  ${(job.cons || []).map(c => `<div class="pc-item con"><span class="pc-dot" style="color:#f43f5e;">●</span>${c}</div>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="detail-sidebar-v2">
            <div class="salary-card-v2">
              <h2 class="scv2-title" style="margin:0;">โครงสร้างเงินเดือน · ${country.nameT}</h2>
              <div class="scv2-row">
                <div class="scv2-header"><span class="scv2-level">เริ่มต้น (Entry)</span><span class="scv2-amount">${salaryLineTHB(entry, mult, ccy)}</span></div>
                <div style="font-size:12px;color:#9d1454;margin-top:2px;">${salarySub(entry, mult, ccy)}</div>
                <div class="scv2-bar-track"><div class="scv2-bar-fill entry" style="width:${job.salaryBar?.entry || 35}%;"></div></div>
              </div>
              <div class="scv2-row">
                <div class="scv2-header"><span class="scv2-level">มีประสบการณ์ (Mid)</span><span class="scv2-amount">${salaryLineTHB(mid, mult, ccy)}</span></div>
                <div style="font-size:12px;color:#9d1454;margin-top:2px;">${salarySub(mid, mult, ccy)}</div>
                <div class="scv2-bar-track"><div class="scv2-bar-fill mid" style="width:${job.salaryBar?.mid || 60}%;"></div></div>
              </div>
              <div class="scv2-row">
                <div class="scv2-header"><span class="scv2-level">ระดับสูง / ผู้เชี่ยวชาญ</span><span class="scv2-amount">${salaryLineTHB(senior, mult, ccy)}</span></div>
                <div style="font-size:12px;color:#9d1454;margin-top:2px;">${salarySub(senior, mult, ccy)}</div>
                <div class="scv2-bar-track"><div class="scv2-bar-fill senior" style="width:${job.salaryBar?.senior || 90}%;"></div></div>
              </div>
              <div class="scv2-note">ปรับตามค่าครองชีพและเงินเดือนเฉลี่ยของ ${country.nameT} (×${mult.toFixed(2)} เทียบไทย) · 1 USD ≈ ${USD_THB} THB</div>
            </div>

            <div class="growth-card-v2">
              <div class="growth-indicator">แนวโน้มการเติบโต</div>
              <h2 class="gcv2-title" style="margin:0;">โอกาสในอนาคต</h2>
              <p class="gcv2-text">${job.growth || ''}</p>
            </div>

            <div class="detail-related-card">
              <h2 class="drc-title" style="margin:0;">ทักษะที่เกี่ยวข้อง</h2>
              <div class="drc-skills">
                ${(job.skills || []).slice(0, 5).map((s, i) => `
                  <div class="drc-skill-row">
                    <span class="drc-skill-name">${s}</span>
                    <div class="drc-skill-bar-track">
                      <div class="drc-skill-bar-fill" style="width:${85 - i * 10}%;"></div>
                    </div>
                  </div>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    wireFxToggle(root);

    setTimeout(() => {
      const bg = root.querySelector('.dhb-bg');
      if (bg && job.img) {
        const preload = new Image();
        preload.onload  = () => bg.classList.add('bg-loaded');
        preload.onerror = () => bg.classList.add('bg-loaded');
        preload.src = job.img;
      }
    }, 0);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Shared building blocks
  // ──────────────────────────────────────────────────────────────────────────
  function countryBannerHtml(cont, country) {
    return `
      <div class="gx-country-banner">
        <div class="gx-country-flag">${country.flag}</div>
        <div class="gx-cb-text">
          <div class="gx-cb-eyebrow">${cont.nameE} · ${country.currency}</div>
          <div class="gx-cb-name">${country.nameT}</div>
          <div class="gx-cb-meta">
            <span>เมืองหลวง <strong>${country.capital}</strong></span>
            <span>ค่าครองชีพ <strong>${country.cost}</strong> (TH=100)</span>
            <span>เงินเดือนเทียบไทย <strong>×${country.mult.toFixed(2)}</strong></span>
          </div>
        </div>
        <div class="gx-fx-toggle" role="tablist" aria-label="เลือกสกุลเงิน">
          <button type="button" data-fx="THB" class="${STATE.fx === 'THB' ? 'active' : ''}">฿ THB</button>
          <button type="button" data-fx="USD" class="${STATE.fx === 'USD' ? 'active' : ''}">$ USD</button>
        </div>
      </div>
    `;
  }
  function wireFxToggle(root) {
    root.querySelectorAll('.gx-fx-toggle button').forEach(b => {
      b.addEventListener('click', () => {
        STATE.fx = b.dataset.fx;
        // re-render the active stage so all numbers flip
        rerenderActiveStage();
      });
    });
  }
  function rerenderActiveStage() {
    if (STATE.stage === 3) renderStage3();
    else if (STATE.stage === 4) renderStage4();
    else if (STATE.stage === 5) renderStage5();
  }

  // Classic job card (reuses .jcn-card from category.css) — country-aware dual currency
  function buildJobCardClassic(job, cat, country) {
    const entry  = parseRangeTHB(job.salary?.entry);
    const senior = parseRangeTHB(job.salary?.senior);
    const ccy    = STATE.fx;
    const mult   = country.mult;
    const tagsHtml = (job.tags || []).slice(0, 3).map(t => `<span class="jcn-tag">${t}</span>`).join('');
    const fallback = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23fce7f3'/%3E%3Ctext x='50' y='55' font-size='30' text-anchor='middle' fill='%23be185d'%3E${encodeURIComponent(job.icon || '')}%3C/text%3E%3C/svg%3E`;

    return `
      <div class="jcn-card" role="button" tabindex="0" data-job="${job.id}"
           aria-label="${job.nameT} — เงินเดือนเริ่มต้น ${salaryLineTHB(entry, mult, ccy)}">
        <div class="jcn-thumb">
          <img src="${job.img || ''}" alt="" loading="lazy"
               onload="this.closest('.jcn-thumb').classList.add('img-loaded')"
               onerror="this.closest('.jcn-thumb').classList.add('img-loaded'); this.src='${fallback}'">
          <div class="jcn-thumb-overlay"></div>
          <div class="jcn-color-strip" style="background: ${cat.color || 'var(--primary)'};"></div>
        </div>
        <div class="jcn-body">
          <div class="jcn-header">
            <div class="jcn-icon" aria-hidden="true" style="background: ${cat.color}; color: ${cat.iconColor};">${job.icon || ''}</div>
            <div class="jcn-title-wrap">
              <div class="jcn-title-th">${job.nameT}</div>
              <div class="jcn-title-en">${job.nameE}</div>
            </div>
            <div class="jcn-arrow" aria-hidden="true">›</div>
          </div>
          <div class="jcn-tags">${tagsHtml}</div>
          <div class="jcn-salary-footer">
            <div class="jcn-sf-item">
              <div class="jcn-sf-label">เริ่มต้น</div>
              <div class="jcn-sf-value">${salaryLineTHB(entry, mult, ccy)}</div>
            </div>
            <div class="jcn-sf-divider"></div>
            <div class="jcn-sf-item">
              <div class="jcn-sf-label">ระดับสูง</div>
              <div class="jcn-sf-value">${salaryLineTHB(senior, mult, ccy)}</div>
            </div>
            <div class="jcn-sf-arrow-wrap" aria-hidden="true">›</div>
          </div>
        </div>
      </div>
    `;
  }

  // Helpers — parse THB strings like "25,000 - 35,000" and reformat per currency
  function parseRangeTHB(str) {
    if (!str) return null;
    const m = String(str).replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
    if (m) return { lo: parseFloat(m[1]), hi: parseFloat(m[2]) };
    const n = String(str).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    if (n) return { lo: parseFloat(n[1]), hi: parseFloat(n[1]) };
    return null;
  }
  function formatMoney(value, ccy) {
    if (ccy === 'USD') {
      return '$' + Math.round(value).toLocaleString('en-US');
    }
    return Math.round(value).toLocaleString('en-US') + ' ฿';
  }
  function salaryLineTHB(range, mult, ccy) {
    if (!range) return '—';
    const lo = range.lo * mult;
    const hi = range.hi * mult;
    if (ccy === 'USD') {
      const lo$ = lo / USD_THB;
      const hi$ = hi / USD_THB;
      if (lo === hi) return `${formatMoney(lo$, 'USD')}`;
      return `${formatMoney(lo$, 'USD')} – ${formatMoney(hi$, 'USD')}`;
    }
    if (lo === hi) return `${formatMoney(lo, 'THB')}`;
    return `${formatMoney(lo, 'THB')} – ${formatMoney(hi, 'THB')}`;
  }
  function salarySub(range, mult, ccy) {
    if (!range) return '';
    const lo = range.lo * mult;
    const hi = range.hi * mult;
    if (ccy === 'USD') {
      return '(' + formatMoney(lo, 'THB') + (lo === hi ? '' : ' – ' + formatMoney(hi, 'THB')) + ')';
    }
    return '(' + formatMoney(lo / USD_THB, 'USD') + (lo === hi ? '' : ' – ' + formatMoney(hi / USD_THB, 'USD')) + ')';
  }

  function buildJobCard(job, cat, country) {
    const entry = parseRangeTHB(job.salary?.entry);
    const senior = parseRangeTHB(job.salary?.senior);
    const ccy = STATE.fx;
    const tag = job.tags && job.tags.length ? job.tags[0] : cat.nameT;

    return `
      <article class="gx-job-card">
        <div class="gx-jc-cat">${cat.nameT}</div>
        <div class="gx-jc-title">${job.nameT}</div>
        <div class="gx-jc-title-en">${job.nameE}</div>
        <div class="gx-jc-salary-block">
          <div class="gx-jc-sal-row">
            <span class="gx-jc-sal-label">เริ่มต้น</span>
            <span class="gx-jc-sal-value">${salaryLineTHB(entry, country.mult, ccy)}
              <span class="gx-fx-sub">${salarySub(entry, country.mult, ccy)}</span>
            </span>
          </div>
          <div class="gx-jc-sal-row">
            <span class="gx-jc-sal-label">ระดับสูง</span>
            <span class="gx-jc-sal-value">${salaryLineTHB(senior, country.mult, ccy)}
              <span class="gx-fx-sub">${salarySub(senior, country.mult, ccy)}</span>
            </span>
          </div>
        </div>
        <div class="gx-jc-foot">
          <span>ประเทศ ${country.nameT}</span>
          <span class="gx-jc-tag">${tag}</span>
        </div>
      </article>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. STAGE TRANSITIONS
  // ──────────────────────────────────────────────────────────────────────────
  function openContinent(id) {
    STATE.continentId = id;
    STATE.stage = 2;
    STATE.countryCode = null;
    STATE.categoryId = null;
    STATE.jobId = null;
    renderStage2();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openCountry(code) {
    STATE.countryCode = code;
    STATE.categoryId = null;
    STATE.jobId = null;
    STATE.stage = 3;
    renderStage3();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openCategory(catId) {
    STATE.categoryId = catId;
    STATE.jobId = null;
    STATE.stage = 4;
    renderStage4();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function openJob(jobId) {
    STATE.jobId = jobId;
    STATE.stage = 5;
    renderStage5();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goStage1() {
    STATE.stage = 1;
    STATE.continentId = null;
    STATE.countryCode = null;
    STATE.categoryId = null;
    STATE.jobId = null;
    renderStage1();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goStage2(contId) {
    if (contId) STATE.continentId = contId;
    STATE.stage = 2;
    STATE.countryCode = null;
    STATE.categoryId = null;
    STATE.jobId = null;
    renderStage2();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goStage3() {
    STATE.stage = 3;
    STATE.categoryId = null;
    STATE.jobId = null;
    renderStage3();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function goStage4(catId) {
    if (catId) STATE.categoryId = catId;
    STATE.stage = 4;
    STATE.jobId = null;
    renderStage4();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Expose tiny API for inline onclick in breadcrumbs
  window.__gx = { goStage1, goStage2, goStage3, goStage4 };

  // ──────────────────────────────────────────────────────────────────────────
  // 8. THREE.JS GLOBE
  // ──────────────────────────────────────────────────────────────────────────
  function initGlobe() {
    const host = document.getElementById('globeCanvasHost');
    if (!host) return;

    // Ensure THREE is available; otherwise skip silently
    if (typeof THREE === 'undefined') {
      host.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#be185d;font-weight:600;text-align:center;padding:30px;">ไม่สามารถโหลด 3D Globe ได้ (ต้องเปิดออนไลน์)</div>`;
      return;
    }

    const rect = host.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height) || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size, false);
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Soft pink-tinted sphere
    const baseGeom = new THREE.SphereGeometry(1, 64, 64);
    const baseMat = new THREE.MeshBasicMaterial({
      color: 0xffe4ee,
      transparent: true,
      opacity: 0.55
    });
    const baseSphere = new THREE.Mesh(baseGeom, baseMat);
    root.add(baseSphere);

    // Wireframe shell — main aesthetic
    const wireGeom = new THREE.SphereGeometry(1.001, 36, 24);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.55
    });
    const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeom), wireMat);
    root.add(wireframe);

    // Outer glow halo
    const haloGeom = new THREE.SphereGeometry(1.18, 48, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf472b6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    root.add(new THREE.Mesh(haloGeom, haloMat));

    // Continent dot markers (interactive)
    const markerGroup = new THREE.Group();
    root.add(markerGroup);

    const markers = [];
    CONTINENTS.forEach(cont => {
      const pos = lonLatToVec3(cont.center.lon, cont.center.lat, 1.04);

      const dotGeom = new THREE.SphereGeometry(0.045, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xbe185d });
      const dot = new THREE.Mesh(dotGeom, dotMat);
      dot.position.copy(pos);
      dot.userData = { continentId: cont.id, name: cont.nameT };
      markerGroup.add(dot);

      // Pulsing ring around marker
      const ringGeom = new THREE.RingGeometry(0.06, 0.085, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf472b6,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      ring.userData.isRing = true;
      markerGroup.add(ring);

      markers.push({ dot, ring, cont, basePos: pos.clone() });
    });

    // Lat/Lon helper
    function lonLatToVec3(lon, lat, radius = 1) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
         radius * Math.cos(phi),
         radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    // Auto-rotate + drag
    let autoRotate = true;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let rotation = { x: 0.18, y: 0 };
    let velocity = { x: 0, y: 0 };

    function onPointerDown(e) {
      isDragging = true;
      autoRotate = false;
      host.classList.add('dragging');
      const p = e.touches ? e.touches[0] : e;
      dragStart.x = p.clientX;
      dragStart.y = p.clientY;
    }
    function onPointerMove(e) {
      const p = e.touches ? e.touches[0] : e;
      // Tooltip on hover
      updateTip(p);
      if (!isDragging) return;
      const dx = p.clientX - dragStart.x;
      const dy = p.clientY - dragStart.y;
      rotation.y += dx * 0.005;
      rotation.x += dy * 0.005;
      rotation.x = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, rotation.x));
      velocity.y = dx * 0.005;
      velocity.x = dy * 0.005;
      dragStart.x = p.clientX;
      dragStart.y = p.clientY;
    }
    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      host.classList.remove('dragging');
      // resume auto-rotate after short delay
      setTimeout(() => { autoRotate = true; }, 1800);
    }
    host.addEventListener('mousedown', onPointerDown);
    host.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // Click on continent marker
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    function pickContinent(clientX, clientY) {
      const r = renderer.domElement.getBoundingClientRect();
      mouseVec.x = ((clientX - r.left) / r.width) * 2 - 1;
      mouseVec.y = -((clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      const meshes = markers.map(m => m.dot);
      const hits = raycaster.intersectObjects(meshes, false);
      return hits[0] ? hits[0].object.userData.continentId : null;
    }
    let mouseDownPos = null;
    host.addEventListener('mousedown', e => { mouseDownPos = { x: e.clientX, y: e.clientY }; });
    host.addEventListener('click', e => {
      if (!mouseDownPos) return;
      const moved = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (moved > 6) return; // it was a drag
      const id = pickContinent(e.clientX, e.clientY);
      if (id) openContinent(id);
    });
    host.addEventListener('touchend', e => {
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const id = pickContinent(t.clientX, t.clientY);
      if (id) openContinent(id);
    });

    // Tooltip overlay over the canvas
    const tip = document.getElementById('globeTip');
    function updateTip(p) {
      if (!tip) return;
      const id = pickContinent(p.clientX, p.clientY);
      if (id) {
        const cont = CONTINENTS.find(c => c.id === id);
        tip.textContent = cont.nameT + ' · ' + cont.nameE;
        const stageRect = host.parentElement.getBoundingClientRect();
        tip.style.left = (p.clientX - stageRect.left) + 'px';
        tip.style.top  = (p.clientY - stageRect.top)  + 'px';
        tip.classList.add('show');
        host.style.cursor = 'pointer';
      } else {
        tip.classList.remove('show');
        host.style.cursor = isDragging ? 'grabbing' : 'grab';
      }
    }

    // Resize handler
    function onResize() {
      const r = host.getBoundingClientRect();
      const s = Math.min(r.width, r.height) || 480;
      renderer.setSize(s, s, false);
    }
    window.addEventListener('resize', onResize);

    // Animation loop
    let clock = 0;
    function animate() {
      clock += 1;
      if (autoRotate && !isDragging) {
        rotation.y += 0.002;
      } else if (!isDragging) {
        // gentle inertia
        rotation.y += velocity.y * 0.92;
        rotation.x += velocity.x * 0.92;
        velocity.y *= 0.92;
        velocity.x *= 0.92;
      }
      root.rotation.y = rotation.y;
      root.rotation.x = rotation.x;

      // Pulse marker rings
      markers.forEach((m, i) => {
        const s = 1 + Math.sin((clock + i * 12) * 0.06) * 0.18;
        m.ring.scale.set(s, s, s);
        m.ring.material.opacity = 0.55 - (s - 1) * 1.2;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    STATE.globe = { dispose() {
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }};
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 9. BOOT — render initial stage when page-explore becomes visible
  // ──────────────────────────────────────────────────────────────────────────
  function ensureRendered() {
    if (STATE.initialized) return;
    const explore = document.getElementById('page-explore');
    if (!explore) return;
    STATE.initialized = true;
    renderStage1();
  }

  // Hook into existing showPage so the globe only inits when needed
  function hookShowPage() {
    if (typeof window.showPage !== 'function') {
      // Loader script not ready yet; try again on DOM ready / load
      window.addEventListener('load', hookShowPage, { once: true });
      return;
    }
    const orig = window.showPage;
    window.showPage = function (pageId, addToHistory) {
      orig(pageId, addToHistory);
      if (pageId === 'page-explore') ensureRendered();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      hookShowPage();
      // Also init if user lands directly on #page-explore
      if ((location.hash || '').replace('#', '') === 'page-explore') {
        ensureRendered();
      }
    });
  } else {
    hookShowPage();
    if ((location.hash || '').replace('#', '') === 'page-explore') {
      ensureRendered();
    }
  }
})();
