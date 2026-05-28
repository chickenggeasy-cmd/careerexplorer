/**
 * Career Explorer Pro - Render Logic
 * อัปเดตล่าสุด: 14 สายงานหลัก (รวมหมวดหมู่ก่อสร้าง, เกษตร, โลจิสติกส์, โรงงาน และไลฟ์สไตล์)
 */

function renderCategories() {
  const catGrid = document.getElementById('catGrid');
  
  const catImages = {
    medical: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    business: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
    arts: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    education: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
    sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
    food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    aviation: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    construction: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
    agriculture: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80",
    logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    factory: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
    lifestyle: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80"
  };
  
  const catGradients = {
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
    factory: "linear-gradient(135deg, #f7e30e, #578eda)",
    lifestyle: "linear-gradient(135deg, #701a75, #f0abfc)"
  };

  let html = '';
  DATA.categories.forEach((cat, index) => {
    const img = catImages[cat.id] || '';
    const grad = catGradients[cat.id] || 'linear-gradient(135deg, #be185d, #f472b6)';
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

function createJobCard(job, cat) {
  return `
    <div class="job-card" onclick="showJob('${job.id}', '${cat.id}')">
      <div class="job-img-wrapper">
        <img src="${job.img}" class="job-img" alt="${job.nameT}">
      </div>
      <div class="job-card-inner">
        <div class="job-header">
          <div class="job-icon" style="background: ${cat.color}; color: ${cat.iconColor}">${job.icon}</div>
          <div>
            <div class="job-title-th">${job.nameT}</div>
            <div class="job-title-en">${job.nameE}</div>
          </div>
        </div>
        <div class="job-tags" style="margin-bottom: 15px;">
          ${job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="job-salary">
          <span>💰</span> <strong>${job.salary.entry} - ${job.salary.senior}</strong> ฿
        </div>
      </div>
    </div>
  `;
}

function showCategory(catId) {
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  document.getElementById('breadcat').innerText = cat.nameT;

  const catEmoji = {
    medical: "🏥", tech: "💻", business: "💼", law: "⚖️",
    arts: "🎭", education: "🎓", sports: "🏆", food: "🍳",
    aviation: "✈️", construction: "🏗️", agriculture: "🌱",
    logistics: "📦", factory: "🏭", lifestyle: "💅"
  };
  const emoji = catEmoji[cat.id] || "🚀";
  document.getElementById('catPageTitle').innerHTML = `${emoji} สายงาน: ${cat.nameT}`;

  let html = '';
  cat.jobs.forEach((job, index) => {
    html += `<div style="animation: fadeInUp 0.5s ease forwards; opacity: 0; animation-delay: ${0.1 + (index * 0.05)}s;">${createJobCard(job, cat)}</div>`;
  });
  document.getElementById('jobGrid').innerHTML = html;
  showPage('page-cat');
}

function showJob(jobId, catId) {
  currentCategory = catId;
  const cat = DATA.categories.find(c => c.id === catId);
  const job = cat.jobs.find(j => j.id === jobId);

  document.getElementById('breadcat2').innerText = cat.nameT;
  document.getElementById('breadjob').innerText = job.nameT;

  document.getElementById('detailContent').innerHTML = `

    <!-- ═══════ HERO BANNER ═══════ -->
    <div class="detail-hero-banner">
      <div class="dhb-bg" style="background-image: url('${job.img}');"></div>
      <div class="dhb-overlay"></div>
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

    <!-- ═══════ CONTENT GRID ═══════ -->
    <div class="detail-grid-v2">

      <!-- ── LEFT COLUMN ── -->
      <div class="detail-main-v2">

        <!-- Education & Skills Card -->
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
                  <em style="color:#c084fc; font-size:12px; font-style:normal; font-weight:600;">${job.education}</em>
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

        <!-- Pros / Cons Card -->
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

      </div><!-- end detail-main-v2 -->

      <!-- ── RIGHT SIDEBAR ── -->
      <div class="detail-sidebar-v2">

        <!-- Salary Card V2 -->
        <div class="salary-card-v2">
          <div class="scv2-title">💰 โครงสร้างเงินเดือน (โดยประมาณ)</div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">เริ่มต้น (Entry Level)</span>
              <span class="scv2-amount">${job.salary.entry} ฿</span>
            </div>
            <div class="scv2-bar-track">
              <div class="scv2-bar-fill entry" id="bar2-entry"></div>
            </div>
          </div>
          <div class="scv2-row">
            <div class="scv2-header">
              <span class="scv2-level">มีประสบการณ์ (Mid Level)</span>
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
        </div>

        <!-- Growth Card V2 -->
        <div class="growth-card-v2">
          <div class="growth-indicator">📈 แนวโน้มการเติบโต</div>
          <div class="gcv2-title">📝 โอกาสในอนาคต</div>
          <p class="gcv2-text">${job.growth}</p>
        </div>

      </div><!-- end detail-sidebar-v2 -->

    </div><!-- end detail-grid-v2 -->
  `;

  showPage('page-detail');

  setTimeout(() => {
    const e = document.getElementById('bar2-entry');
    const m = document.getElementById('bar2-mid');
    const s = document.getElementById('bar2-senior');
    if (e) e.style.width = job.salaryBar.entry + '%';
    if (m) m.style.width = job.salaryBar.mid + '%';
    if (s) s.style.width = job.salaryBar.senior + '%';
  }, 120);
}

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