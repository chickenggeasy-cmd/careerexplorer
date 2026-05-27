/**
 * Career Explorer Pro - Render Logic
 * อัปเดตล่าสุด: 14 สายงานหลัก (รวมหมวดหมู่ก่อสร้าง, เกษตร, โลจิสติกส์, โรงงาน และไลฟ์สไตล์)
 */

function renderCategories() {
  const catGrid = document.getElementById('catGrid');
  
  // ข้อมูลรูปภาพพื้นหลังสำหรับทั้ง 14 สายงาน
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
  
  // ข้อมูลสี Gradient สำหรับทั้ง 14 สายงาน
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
    medical: "🏥",
    tech: "💻",
    business: "💼",
    law: "⚖️",
    arts: "🎭",
    education: "🎓",
    sports: "🏆",
    food: "🍳",
    aviation: "✈️",
    construction: "🏗️",
    agriculture: "🌱",
    logistics: "📦",
    factory: "🏭",
    lifestyle: "💅"
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
    <img src="${job.img}" class="detail-hero-img" alt="${job.nameT}">
    <div class="detail-header" style="background: linear-gradient(135deg, ${cat.iconColor || '#1e293b'}, #0f172a);">
      <div class="detail-header-top">
        <div class="detail-icon">${job.icon}</div>
        <div>
          <div class="detail-title-th">${job.nameT}</div>
          <div class="detail-title-en">${job.nameE}</div>
        </div>
      </div>
      <p class="detail-desc">${job.description}</p>
      <div class="detail-badges">
        ${job.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-main">
        <div class="info-card">
          <h3>🎓 ข้อมูลการศึกษาและทักษะ</h3>
          <div class="info-item"><div class="info-icon-dot">📘</div><div><strong>วุฒิการศึกษาที่ต้องการ:</strong> ${job.degree}<br><span style="color:var(--text-muted); font-size:14px;">(${job.education})</span></div></div>
          <div class="info-item"><div class="info-icon-dot">⏳</div><div><strong>ระยะเวลาเรียน/ฝึกฝนโดยเฉลี่ย:</strong> ${job.years}</div></div>
          <div class="info-item" style="display: block; border-bottom: none; padding-bottom: 0;">
            <div style="margin-bottom: 6px;"><strong style="display:flex; align-items:center; gap:8px;"><span class="info-icon-dot">⚡</span>ทักษะสำคัญที่จำเป็น (Hard/Soft Skills):</strong></div>
            <div class="skill-tags">
              ${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="info-card">
          <h3>⚖️ วิเคราะห์ข้อดี - ข้อจำกัด</h3>
          <div class="pro-con-grid">
            <div>
              <div style="font-weight:600; color:#166534; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><span class="pro-icon">✓</span> ข้อดี (Pros)</div>
              ${job.pros.map(p => `<div class="pro-item"><span class="pro-icon">•</span>${p}</div>`).join('')}
            </div>
            <div>
              <div style="font-weight:600; color:#9f1239; margin-bottom:10px; display:flex; align-items:center; gap:6px;"><span class="con-icon">✗</span> ข้อจำกัด (Cons)</div>
              ${job.cons.map(c => `<div class="con-item"><span class="con-icon">•</span>${c}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="detail-sidebar">
        <div class="salary-card">
          <h3>💰 โครงสร้างเงินเดือน (โดยประมาณ)</h3>
          <div class="salary-row">
            <div class="salary-header">
              <span class="salary-level">เริ่มต้น (Entry Level)</span>
              <span class="salary-amount">${job.salary.entry} ฿</span>
            </div>
            <div class="salary-bar"><div class="salary-bar-fill" id="bar-entry"></div></div>
          </div>
          <div class="salary-row">
            <div class="salary-header">
              <span class="salary-level">มีประสบการณ์ (Mid Level)</span>
              <span class="salary-amount">${job.salary.mid} ฿</span>
            </div>
            <div class="salary-bar"><div class="salary-bar-fill" id="bar-mid"></div></div>
          </div>
          <div class="salary-row">
            <div class="salary-header">
              <span class="salary-level">ระดับสูง/ผู้เชี่ยวชาญ (Senior)</span>
              <span class="salary-amount">${job.salary.senior} ฿</span>
            </div>
            <div class="salary-bar"><div class="salary-bar-fill" id="bar-senior"></div></div>
          </div>
        </div>

        <div class="info-card">
          <h3>📈 โอกาสเติบโตในอนาคต</h3>
          <p style="font-size:15px; color:var(--text-muted); line-height:1.7;">${job.growth}</p>
        </div>
      </div>
    </div>
  `;
  showPage('page-detail');

  setTimeout(() => {
    document.getElementById('bar-entry').style.width = job.salaryBar.entry + '%';
    document.getElementById('bar-mid').style.width = job.salaryBar.mid + '%';
    document.getElementById('bar-senior').style.width = job.salaryBar.senior + '%';
  }, 100);
}

window.onload = () => {
  renderCategories();
  if (typeof startSlider === 'function') startSlider();

  const total = DATA.categories.reduce((sum, cat) => sum + cat.jobs.length, 0);

  // ✅ แก้ไข: เพิ่ม null check ทุกตัว ป้องกัน error "Cannot set properties of null"
  const totalJobsEl = document.getElementById('totalJobs');
  if (totalJobsEl) totalJobsEl.textContent = total + '+';

  const aboutTotalCatEl = document.getElementById('aboutTotalCat');
  if (aboutTotalCatEl) aboutTotalCatEl.textContent = DATA.categories.length;

  const aboutTotalJobsEl = document.getElementById('aboutTotalJobs');
  if (aboutTotalJobsEl) aboutTotalJobsEl.textContent = total + '+';

  history.replaceState({ page: 'page-home' }, "", "#page-home");
};