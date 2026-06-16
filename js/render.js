/**
 * Career Explorer Pro - Render Logic (Upgraded & Refactored)
 * อัปเดตล่าสุด: 14 สายงานหลัก — redesigned page-cat & page-detail
 */

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

  // Stat strip
  graduation: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>`,

  clock: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  wallet: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill="currentColor" stroke="none"/>
    <path d="M2 10h20"/>
  </svg>`,

  trophy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H4a2 2 0 0 1-2-2V5h4"/>
    <path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/>
    <path d="M12 17v4"/>
    <path d="M8 21h8"/>
    <path d="M6 5h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6V5z"/>
  </svg>`,

  // Education timeline
  book: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>`,

  clockSm: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>`,

  university: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 21h18"/>
    <path d="M3 10h18"/>
    <path d="M5 6l7-3 7 3"/>
    <path d="M4 10v11"/>
    <path d="M20 10v11"/>
    <path d="M8 14v3"/>
    <path d="M12 14v3"/>
    <path d="M16 14v3"/>
  </svg>`,

  bolt: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>`,

  // Pro/con section header
  scale: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3v18"/>
    <path d="M3 9l9-6 9 6"/>
    <path d="M3 15h18"/>
    <path d="M3 15l3 6h12l3-6"/>
    <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none"/>
  </svg>`,

  // Growth card
  trendUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>`,

  fileText: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>`,

  // Related skills card
  link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>`,

  // Salary card
  barChart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>`,

  info: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>`,

  // Growth badge
  trendUpSm: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>`,

  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>`,

  arrowRightSm: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>`,
};

// helper — wrap SVG in a styled span สำหรับ inline use
function icon(svgKey, { color = 'currentColor', size = null, style = '' } = {}) {
  const svg = DETAIL_ICONS[svgKey];
  if (!svg) return '';
  const colorStyle = color !== 'currentColor' ? `color:${color};` : '';
  const sizeStyle  = size ? `width:${size}px;height:${size}px;` : '';
  return `<span class="svg-icon" style="display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;${colorStyle}${sizeStyle}${style}">${svg}</span>`;
}

function renderCategories() {
  const catGrid = document.getElementById('catGrid');
  if (!catGrid) return;

  // แสดง skeleton ก่อน 14 ช่อง
  catGrid.innerHTML = Array(14).fill(0)
    .map(() => `<div class="cat-skeleton"></div>`)
    .join('');

  // โหลด data เสร็จแล้วค่อย render จริง
  loadAllCategories().then(() => {
    let html = '';
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
          <div class="cat-card-bg" style="background-image: url('${img}');"></div>
          <div class="cat-card-overlay" style="background: ${grad};"></div>
          <div class="cat-card-content">
            <div class="cat-icon-new">
              <img src="${cat.icon}" alt="">
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

/* ═══════════════════════════════════════════════════
   JOB CARD  —  page-cat grid
═══════════════════════════════════════════════════ */
function createJobCard(job, cat) {
  const tagsHtml = job.tags.slice(0, 3)
    .map(t => `<span class="jcn-tag">${t}</span>`).join('');

  return `
    <div class="jcn-card"
         role="button"
         tabindex="0"
         aria-label="${job.nameT} — เงินเดือนเริ่มต้น ${job.salary.entry} บาท"
         onclick="showJob('${job.id}', '${cat.id}')"
         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showJob('${job.id}','${cat.id}');}">
      <div class="jcn-thumb">
        <img src="${job.img}" alt="${job.nameT}" loading="lazy"
          onload="this.closest('.jcn-thumb').classList.add('img-loaded')"
          onerror="this.closest('.jcn-thumb').classList.add('img-loaded'); this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' fill=\'%23fce7f3\'/%3E%3Ctext x=\'50\' y=\'55\' font-size=\'30\' text-anchor=\'middle\' fill=\'%23be185d\'%3E${job.icon}%3C/text%3E%3C/svg%3E'">
        <div class="jcn-thumb-overlay"></div>
        <div class="jcn-color-strip" style="background: ${cat.color || 'var(--primary)'};"></div>
      </div>
      <div class="jcn-body">
        <div class="jcn-header">
          <div class="jcn-icon" style="background: ${cat.color}; color: ${cat.iconColor};">
            ${job.icon}
          </div>
          <div class="jcn-title-wrap">
            <div class="jcn-title-th">${job.nameT}</div>
            <div class="jcn-title-en">${job.nameE}</div>
          </div>
          <div class="jcn-arrow" aria-hidden="true">${DETAIL_ICONS.arrowRight}</div>
        </div>
        <div class="jcn-tags">${tagsHtml}</div>
        <div class="jcn-salary-footer">
          <div class="jcn-sf-item">
            <div class="jcn-sf-label">เริ่มต้น</div>
            <div class="jcn-sf-value">${job.salary.entry} ฿</div>
          </div>
          <div class="jcn-sf-divider"></div>
          <div class="jcn-sf-item">
            <div class="jcn-sf-label">ระดับสูง</div>
            <div class="jcn-sf-value">${job.salary.senior} ฿</div>
          </div>
          <div class="jcn-sf-arrow-wrap" aria-hidden="true">${DETAIL_ICONS.arrowRightSm}</div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════
   SHOW CATEGORY  —  page-cat
═══════════════════════════════════════════════════ */
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
          <div class="cph-eyebrow">
            <span class="cph-dot"></span> สายงาน
          </div>
          <h1 class="cph-title">${emoji} ${cat.nameT}</h1>
          <p class="cph-sub">${cat.nameE}</p>
          <div class="cph-meta">
            <div class="cph-meta-pill">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round">
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
    html += `
      <div style="animation: fadeInUp 0.45s ease forwards; opacity: 0;
                  animation-delay: ${0.08 + (index * 0.05)}s;">
        ${createJobCard(job, cat)}
      </div>`;
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

/* ═══════════════════════════════════════════════════
   SHOW JOB  —  page-detail (SVG icons, no emoji)
═══════════════════════════════════════════════════ */
function showJob(jobId, catId) {
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  const job = cat?.jobs.find(j => j.id === jobId);
  if (!cat || !job) return;

  document.getElementById('breadcat2').innerText = cat.nameT;
  document.getElementById('breadjob').innerText  = job.nameT;

  // Universities block
  let uniHtml = '';
  if (job.universities && job.universities.length > 0) {
    uniHtml = `
      <div class="edu-item">
        <div class="edu-dot edu-dot--svg" style="color:#be185d;">${DETAIL_ICONS.university}</div>
        <div class="edu-text" style="flex:1;">
          <strong>มหาวิทยาลัย / คณะที่แนะนำ</strong>
          <ul style="margin: 8px 0 0 20px; padding: 0; font-size: 0.9em; opacity: 0.85; line-height: 1.6;">
            ${job.universities.map(u => `<li style="margin-bottom: 4px;">${u}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero-banner">
      <div class="dhb-bg" style="background-image: url('${job.img}');"></div>
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
            <div class="dhb-title-th">${job.nameT}</div>
            <div class="dhb-title-en">${job.nameE}</div>
          </div>
        </div>
        <p class="dhb-desc">${job.description}</p>
        <div class="dhb-tags">
          ${job.tags.map(tag => `<span class="dhb-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>

    <!-- ── Stat Strip ── -->
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
          <div class="dss-value">${job.salary.entry} ฿</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon" aria-hidden="true">${icon('trophy', { color: '#b45309' })}</div>
        <div class="dss-text">
          <div class="dss-label">ระดับสูงสุด</div>
          <div class="dss-value">${job.salary.senior} ฿</div>
        </div>
      </div>
    </div>

    <div class="detail-grid-v2">
      <div class="detail-main-v2">

        <!-- ── Education & Skills Card ── -->
        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon" aria-hidden="true">${icon('graduation', { color: '#f4e9ed', size: 22 })}</div>
            <div class="icv2-title">ข้อมูลการศึกษาและทักษะ</div>
          </div>
          <div class="edu-timeline">

            <div class="edu-item">
              <div class="edu-dot edu-dot--svg" style="color:#6d28d9;" aria-hidden="true">${DETAIL_ICONS.book}</div>
              <div class="edu-text">
                <strong>วุฒิการศึกษาที่ต้องการ</strong>
                <span>${job.degree}<br>
                  <em style="color:#c084fc;font-size:12px;font-style:normal;font-weight:600;">
                    ${job.education}
                  </em>
                </span>
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
                <div class="skills-cloud">
                  ${job.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Pros / Cons Card ── -->
        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon" aria-hidden="true">${icon('scale', { color: '#f8f0f3', size: 22 })}</div>
            <div class="icv2-title">วิเคราะห์ข้อดี — ข้อจำกัด</div>
          </div>
          <div class="pro-con-v2">
            <div>
              <div class="pc-col-title pros">✓ ข้อดี (Pros)</div>
              ${job.pros.map(p => `
                <div class="pc-item pro">
                  <span class="pc-dot" style="color:#22c55e;" aria-hidden="true">●</span>${p}
                </div>`).join('')}
            </div>
            <div>
              <div class="pc-col-title cons">✗ ข้อจำกัด (Cons)</div>
              ${job.cons.map(c => `
                <div class="pc-item con">
                  <span class="pc-dot" style="color:#f43f5e;" aria-hidden="true">●</span>${c}
                </div>`).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- ── Sidebar ── -->
      <div class="detail-sidebar-v2">

        <!-- Salary Card -->
        <div class="salary-card-v2">
          <div class="scv2-title">
            <span aria-hidden="true">${icon('barChart', { color: '#be185d', style: 'margin-right:6px;' })}</span>
            โครงสร้างเงินเดือน (โดยประมาณ)
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">เริ่มต้น (Entry)</span>
              <span class="scv2-amount">${job.salary.entry} ฿</span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนเริ่มต้น ${job.salary.entry} บาท">
              <div class="scv2-bar-fill entry" id="bar2-entry"></div>
            </div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">มีประสบการณ์ (Mid)</span>
              <span class="scv2-amount">${job.salary.mid} ฿</span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนระดับกลาง ${job.salary.mid} บาท">
              <div class="scv2-bar-fill mid" id="bar2-mid"></div>
            </div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">ระดับสูง / ผู้เชี่ยวชาญ</span>
              <span class="scv2-amount">${job.salary.senior} ฿</span>
            </div>
            <div class="scv2-bar-track" role="img" aria-label="เงินเดือนระดับสูง ${job.salary.senior} บาท">
              <div class="scv2-bar-fill senior" id="bar2-senior"></div>
            </div>
          </div>
          <div class="scv2-note">
            <span aria-hidden="true">${DETAIL_ICONS.info}</span>
            ข้อมูลอ้างอิงจากสถิติตลาดแรงงานไทย
          </div>
        </div>

        <!-- Growth Card -->
        <div class="growth-card-v2">
          <div class="growth-indicator">
            <span aria-hidden="true">${icon('trendUp', { style: 'margin-right:6px;' })}</span>
            แนวโน้มการเติบโต
          </div>
          <div class="gcv2-title">
            <span aria-hidden="true">${icon('fileText', { style: 'margin-right:6px;flex-shrink:0;' })}</span>
            โอกาสในอนาคต
          </div>
          <p class="gcv2-text">${job.growth}</p>
        </div>

        <!-- Related Skills Card -->
        <div class="detail-related-card">
          <div class="drc-title">
            <span aria-hidden="true">${icon('link', { color: '#be185d', style: 'margin-right:6px;' })}</span>
            ทักษะที่เกี่ยวข้อง
          </div>
          <div class="drc-skills">
            ${job.skills.slice(0, 5).map((s, i) => `
              <div class="drc-skill-row">
                <span class="drc-skill-name">${s}</span>
                <div class="drc-skill-bar-track" role="img" aria-label="${s}">
                  <div class="drc-skill-bar-fill"
                    style="width:${85 - i * 10}%; animation-delay:${0.2 + i * 0.1}s;"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  showPage('page-detail');

  // Preload hero bg
  setTimeout(() => {
    const detailBg = document.querySelector('.dhb-bg');
    if (detailBg && job.img) {
      const preload = new Image();
      preload.onload  = () => detailBg.classList.add('bg-loaded');
      preload.onerror = () => detailBg.classList.add('bg-loaded');
      preload.src = job.img;
    }
  }, 0);

  // Animate salary bars
  setTimeout(() => {
    const e = document.getElementById('bar2-entry');
    const m = document.getElementById('bar2-mid');
    const s = document.getElementById('bar2-senior');
    if (e && job.salaryBar?.entry)  e.style.width = job.salaryBar.entry  + '%';
    if (m && job.salaryBar?.mid)    m.style.width = job.salaryBar.mid    + '%';
    if (s && job.salaryBar?.senior) s.style.width = job.salaryBar.senior + '%';
  }, 140);
}

/* ═══════════════════════════════════════════════════
   WINDOW.ONLOAD
═══════════════════════════════════════════════════ */
window.onload = async () => {
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