/**
 * Career Explorer Pro - Render Logic (Upgraded & Refactored)
 * อัปเดตล่าสุด: 14 สายงานหลัก — redesigned page-cat & page-detail
 */

// ── GLOBAL CONFIGURATION ──
// รวมศูนย์ข้อมูลเพื่อไม่ให้ประกาศซ้ำในฟังก์ชัน ช่วยลด Memory Usage และบำรุงรักษาง่าย
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

function renderCategories() {
  const catGrid = document.getElementById('catGrid');
  if (!catGrid) return;

  let html = '';
  DATA.categories.forEach((cat, index) => {
    const img = CAT_CONFIG.images[cat.id] || '';
    const grad = CAT_CONFIG.gradients[cat.id] || 'linear-gradient(135deg, #be185d, #f472b6)';
    
    html += `
      <div class="cat-card-new" onclick="showCategory('${cat.id}')" 
           style="animation: fadeInUp 0.5s ease forwards; opacity: 0; animation-delay: ${0.2 + (index * 0.1)}s;">
        <div class="cat-card-bg" style="background-image: url('${img}');"></div>
        <div class="cat-card-overlay" style="background: ${grad};"></div>
        <div class="cat-card-content">
          <div class="cat-icon-new">
            <img src="${cat.icon}" alt="${cat.nameT}">
          </div>
          <div class="cat-name-th-new">${cat.nameT}</div>
          <div class="cat-name-en-new">${cat.nameE}</div>
          <div class="cat-count-new">✦ ${cat.jobs.length} อาชีพ</div>
        </div>
      </div>
    `;
  });
  catGrid.innerHTML = html;
}

/* ═══════════════════════════════════════════════════
   JOB CARD  —  page-cat grid (redesigned)
═══════════════════════════════════════════════════ */
function createJobCard(job, cat) {
  const tagsHtml = job.tags.slice(0, 3)
    .map(t => `<span class="jcn-tag">${t}</span>`).join('');

  return `
    <div class="jcn-card" onclick="showJob('${job.id}', '${cat.id}')">

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
          <div class="jcn-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
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
          <div class="jcn-sf-arrow-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════
   SHOW CATEGORY  —  page-cat (redesigned header)
═══════════════════════════════════════════════════ */
function showCategory(catId) {
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  if (!cat) return;

  document.getElementById('breadcat').innerText = cat.nameT;

  const emoji = CAT_CONFIG.emojis[cat.id] || "🚀";
  const heroImg = CAT_CONFIG.images[cat.id] || '';
  const grad = CAT_CONFIG.gradients[cat.id] || 'linear-gradient(135deg,#be185d,#f472b6)';

  /* ── build hero banner for page-cat ── */
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

  /* ── render job cards ── */
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

  /* ── preload hero bg image ── */
  const heroBg = document.querySelector('.cph-bg');
  if (heroBg && heroImg) {
    const preload = new Image();
    preload.onload  = () => heroBg.classList.add('bg-loaded');
    preload.onerror = () => heroBg.classList.add('bg-loaded');
    preload.src = heroImg;
  }
}

/* ═══════════════════════════════════════════════════
   SHOW JOB  —  page-detail (full redesign)
═══════════════════════════════════════════════════ */
function showJob(jobId, catId) {
  currentCategory = catId;
  const cat  = DATA.categories.find(c => c.id === catId);
  const job  = cat?.jobs.find(j => j.id === jobId);
  if (!cat || !job) return;

  document.getElementById('breadcat2').innerText = cat.nameT;
  document.getElementById('breadjob').innerText  = job.nameT;

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-hero-banner">
      <div class="dhb-bg" style="background-image: url('${job.img}');"></div>
      <div class="dhb-overlay"></div>
      <div class="dhb-badge-wrap">
        <div class="dhb-growth-badge">📈 แนวโน้มการเติบโต: สูง</div>
      </div>
      <div class="dhb-content">
        <div class="dhb-header">
          <div class="dhb-icon-wrap">${job.icon}</div>
          <div>
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

    <div class="detail-stat-strip">
      <div class="dss-item">
        <div class="dss-icon">🎓</div>
        <div class="dss-text">
          <div class="dss-label">วุฒิที่ต้องการ</div>
          <div class="dss-value">${job.degree}</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon">⏳</div>
        <div class="dss-text">
          <div class="dss-label">ระยะเวลาเรียน</div>
          <div class="dss-value">${job.years}</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon">💰</div>
        <div class="dss-text">
          <div class="dss-label">เงินเดือนเริ่มต้น</div>
          <div class="dss-value">${job.salary.entry} ฿</div>
        </div>
      </div>
      <div class="dss-divider"></div>
      <div class="dss-item">
        <div class="dss-icon">🏆</div>
        <div class="dss-text">
          <div class="dss-label">ระดับสูงสุด</div>
          <div class="dss-value">${job.salary.senior} ฿</div>
        </div>
      </div>
    </div>

    <div class="detail-grid-v2">
      <div class="detail-main-v2">
        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon">🎓</div>
            <div class="icv2-title">ข้อมูลการศึกษาและทักษะ</div>
          </div>
          <div class="edu-timeline">
            <div class="edu-item">
              <div class="edu-dot">📘</div>
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
              <div class="edu-dot">⏳</div>
              <div class="edu-text">
                <strong>ระยะเวลาเรียน / ฝึกฝนโดยเฉลี่ย</strong>
                <span>${job.years}</span>
              </div>
            </div>
            <div class="edu-item" style="padding-bottom:0;">
              <div class="edu-dot">⚡</div>
              <div class="edu-text" style="flex:1;">
                <strong>ทักษะสำคัญที่จำเป็น (Hard / Soft Skills)</strong>
                <div class="skills-cloud">
                  ${job.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card-v2">
          <div class="icv2-header">
            <div class="icv2-header-icon">⚖️</div>
            <div class="icv2-title">วิเคราะห์ข้อดี — ข้อจำกัด</div>
          </div>
          <div class="pro-con-v2">
            <div>
              <div class="pc-col-title pros">✓ ข้อดี (Pros)</div>
              ${job.pros.map(p => `
                <div class="pc-item pro">
                  <span class="pc-dot" style="color:#22c55e;">●</span>${p}
                </div>`).join('')}
            </div>
            <div>
              <div class="pc-col-title cons">✗ ข้อจำกัด (Cons)</div>
              ${job.cons.map(c => `
                <div class="pc-item con">
                  <span class="pc-dot" style="color:#f43f5e;">●</span>${c}
                </div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="detail-sidebar-v2">
        <div class="salary-card-v2">
          <div class="scv2-title">💰 โครงสร้างเงินเดือน (โดยประมาณ)</div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">เริ่มต้น (Entry)</span>
              <span class="scv2-amount">${job.salary.entry} ฿</span>
            </div>
            <div class="scv2-bar-track">
              <div class="scv2-bar-fill entry" id="bar2-entry"></div>
            </div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">มีประสบการณ์ (Mid)</span>
              <span class="scv2-amount">${job.salary.mid} ฿</span>
            </div>
            <div class="scv2-bar-track">
              <div class="scv2-bar-fill mid" id="bar2-mid"></div>
            </div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">ระดับสูง / ผู้เชี่ยวชาญ</span>
              <span class="scv2-amount">${job.salary.senior} ฿</span>
            </div>
            <div class="scv2-bar-track">
              <div class="scv2-bar-fill senior" id="bar2-senior"></div>
            </div>
          </div>
          <div class="scv2-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            ข้อมูลอ้างอิงจากสถิติตลาดแรงงานไทย
          </div>
        </div>

        <div class="growth-card-v2">
          <div class="growth-indicator">📈 แนวโน้มการเติบโต</div>
          <div class="gcv2-title">📝 โอกาสในอนาคต</div>
          <p class="gcv2-text">${job.growth}</p>
        </div>

        <div class="detail-related-card">
          <div class="drc-title"><span>🔗</span> ทักษะที่เกี่ยวข้อง</div>
          <div class="drc-skills">
            ${job.skills.slice(0, 5).map((s, i) => `
              <div class="drc-skill-row">
                <span class="drc-skill-name">${s}</span>
                <div class="drc-skill-bar-track">
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

  /* ── preload detail hero bg ── */
  setTimeout(() => {
    const detailBg = document.querySelector('.dhb-bg');
    if (detailBg && job.img) {
      const preload = new Image();
      preload.onload  = () => detailBg.classList.add('bg-loaded');
      preload.onerror = () => detailBg.classList.add('bg-loaded');
      preload.src = job.img;
    }
  }, 0);

  // ใช้ Optional Chaining (?.) ป้องกันการแครชหากไม่มีการระบุโครงสร้างสัดส่วนบาร์
  setTimeout(() => {
    const e = document.getElementById('bar2-entry');
    const m = document.getElementById('bar2-mid');
    const s = document.getElementById('bar2-senior');
    if (e && job.salaryBar?.entry) e.style.width = job.salaryBar.entry + '%';
    if (m && job.salaryBar?.mid) m.style.width = job.salaryBar.mid + '%';
    if (s && job.salaryBar?.senior) s.style.width = job.salaryBar.senior + '%';
  }, 140);
}

/* ═══════════════════════════════════════════════════
   WINDOW.ONLOAD
═══════════════════════════════════════════════════ */
window.onload = () => {
  renderCategories();
  if (typeof startSlider === 'function') startSlider();

  const total = DATA.categories.reduce((sum, cat) => sum + cat.jobs.length, 0);

  const totalJobsEl = document.getElementById('totalJobs');
  if (totalJobsEl) totalJobsEl.textContent = total + '+';

  const aboutTotalCatEl = document.getElementById('aboutTotalCat');
  if (aboutTotalCatEl) aboutTotalCatEl.textContent = DATA.categories.length;

  const aboutTotalJobsEl = document.getElementById('aboutTotalJobs');
  if (aboutTotalJobsEl) aboutTotalJobsEl.textContent = total + '+';

  history.replaceState({ page: 'page-home' }, "", "#page-home");
};