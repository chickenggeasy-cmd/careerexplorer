/**
 * Career Explorer Pro — Career Comparison Tool
 * compare.js  |  ใส่หลัง icons.js ใน index.html
 */

(function () {
  /* ─────────────── STATE ─────────────── */
  const MAX_SLOTS = 3;
  let compareList = []; // array ของ job object

  /* ─────────────── HELPERS ─────────────── */
  function getAllJobs() {
    const jobs = [];
    DATA.categories.forEach(cat => {
      cat.jobs.forEach(job => {
        jobs.push({ ...job, catId: cat.id, catName: cat.nameT, catColor: cat.color, catIconColor: cat.iconColor });
      });
    });
    return jobs;
  }

  function parseSalary(str) {
    if (!str) return 0;
    const clean = str.replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  }

  function growthScore(text) {
    if (!text) return 0;
    if (text.includes('สูงมาก')) return 3;
    if (text.includes('สูง')) return 2;
    if (text.includes('ปานกลาง') || text.includes('ดี')) return 1;
    return 0;
  }

  function growthLabel(text) {
    const score = growthScore(text);
    const labels = ['ปานกลาง', 'ดี', 'สูง', 'สูงมาก'];
    const colors = ['#94a3b8', '#60a5fa', '#34d399', '#f472b6'];
    return `<span style="color:${colors[score]};font-weight:600;">${labels[score]}</span>`;
  }

  /* ─────────────── SALARY BAR ─────────────── */
  function salaryBarHTML(job) {
    const vals = [
      { label: 'Entry', val: parseSalary(job.salary?.entry), raw: job.salary?.entry },
      { label: 'Mid',   val: parseSalary(job.salary?.mid),   raw: job.salary?.mid },
      { label: 'Senior',val: parseSalary(job.salary?.senior),raw: job.salary?.senior },
    ];
    const max = Math.max(...vals.map(v => v.val), 1);
    return vals.map(v => `
      <div class="cmp-bar-row">
        <span class="cmp-bar-label">${v.label}</span>
        <div class="cmp-bar-track">
          <div class="cmp-bar-fill" style="width:${Math.round((v.val/max)*100)}%"></div>
        </div>
        <span class="cmp-bar-num">฿${v.raw || '—'}</span>
      </div>
    `).join('');
  }

  /* ─────────────── RENDER COMPARISON TABLE ─────────────── */
  function renderTable() {
    const wrap = document.getElementById('cmp-table-wrap');
    if (!wrap) return;

    if (compareList.length === 0) {
      wrap.innerHTML = `
        <div class="cmp-empty">
          <div class="cmp-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4"/><rect x="9" y="3" width="6" height="14" rx="2"/></svg>
          </div>
          <p>เลือกอาชีพจากช่องด้านบนเพื่อเริ่มเปรียบเทียบ</p>
          <small>เลือกได้สูงสุด ${MAX_SLOTS} อาชีพ</small>
        </div>`;
      return;
    }

    // Header row
    const headerCols = compareList.map(job => `
      <th>
        <div class="cmp-th-inner">
          <span class="cmp-job-icon">${job.icon || '💼'}</span>
          <span class="cmp-job-name">${job.nameT}</span>
          <span class="cmp-job-cat" style="background:${job.catColor};color:${job.catIconColor}">${job.catName}</span>
          <button class="cmp-remove-btn" onclick="compareRemove('${job.id}')" title="ลบออก">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </th>
    `).join('');

    // Salary row
    const salaryCols = compareList.map(job => `
      <td><div class="cmp-salary-bars">${salaryBarHTML(job)}</div></td>
    `).join('');

    // Education row
    const eduCols = compareList.map(job => `
      <td>
        <div class="cmp-edu">
          <div class="cmp-edu-degree">${job.degree || '—'}</div>
          <div class="cmp-edu-years">⏱ ${job.years || '—'}</div>
          <div class="cmp-edu-field">${job.education || '—'}</div>
        </div>
      </td>
    `).join('');

    // Growth row
    const growthCols = compareList.map(job => `
      <td><div class="cmp-growth">${growthLabel(job.growth)}<p>${job.growth || '—'}</p></div></td>
    `).join('');

    // Skills row
    const skillsCols = compareList.map(job => `
      <td>
        <div class="cmp-skills">
          ${(job.skills || []).map(s => `<span class="cmp-skill-pill">${s}</span>`).join('')}
        </div>
      </td>
    `).join('');

    // Pros row
    const prosCols = compareList.map(job => `
      <td>
        <ul class="cmp-list cmp-pros">
          ${(job.pros || []).map(p => `<li>${p}</li>`).join('')}
        </ul>
      </td>
    `).join('');

    // Cons row
    const consCols = compareList.map(job => `
      <td>
        <ul class="cmp-list cmp-cons">
          ${(job.cons || []).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </td>
    `).join('');

    // CTA row
    const ctaCols = compareList.map(job => `
      <td>
        <button class="cmp-detail-btn" onclick="showJob('${job.catId}','${job.id}')">
          ดูรายละเอียด →
        </button>
      </td>
    `).join('');

    wrap.innerHTML = `
      <div class="cmp-table-scroll">
        <table class="cmp-table">
          <thead>
            <tr class="cmp-header-row">
              <th class="cmp-row-label"></th>
              ${headerCols}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="cmp-row-label"><span>💰 เงินเดือน</span></td>
              ${salaryCols}
            </tr>
            <tr>
              <td class="cmp-row-label"><span>🎓 การศึกษา</span></td>
              ${eduCols}
            </tr>
            <tr>
              <td class="cmp-row-label"><span>📈 โอกาสเติบโต</span></td>
              ${growthCols}
            </tr>
            <tr>
              <td class="cmp-row-label"><span>🛠 ทักษะสำคัญ</span></td>
              ${skillsCols}
            </tr>
            <tr>
              <td class="cmp-row-label"><span>✅ ข้อดี</span></td>
              ${prosCols}
            </tr>
            <tr>
              <td class="cmp-row-label"><span>⚠️ ข้อพิจารณา</span></td>
              ${consCols}
            </tr>
            <tr>
              <td class="cmp-row-label"></td>
              ${ctaCols}
            </tr>
          </tbody>
        </table>
      </div>`;
  }

  /* ─────────────── SLOT SELECTOR PANEL ─────────────── */
  function renderSlots() {
    const slotsWrap = document.getElementById('cmp-slots');
    if (!slotsWrap) return;

    let html = '';
    for (let i = 0; i < MAX_SLOTS; i++) {
      const job = compareList[i];
      if (job) {
        html += `
          <div class="cmp-slot cmp-slot-filled">
            <span class="cmp-slot-icon">${job.icon || '💼'}</span>
            <span class="cmp-slot-name">${job.nameT}</span>
            <button class="cmp-slot-remove" onclick="compareRemove('${job.id}')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>`;
      } else {
        html += `
          <div class="cmp-slot cmp-slot-empty">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>เลือกอาชีพ</span>
          </div>`;
      }
    }

    slotsWrap.innerHTML = html;

    // update counter
    const counter = document.getElementById('cmp-count');
    if (counter) counter.textContent = `${compareList.length}/${MAX_SLOTS}`;

    // update clear btn
    const clearBtn = document.getElementById('cmp-clear-btn');
    if (clearBtn) clearBtn.style.display = compareList.length > 0 ? 'flex' : 'none';
  }

  /* ─────────────── SEARCH DROPDOWN ─────────────── */
  function renderSearchResults(query) {
    const dropdown = document.getElementById('cmp-search-dropdown');
    if (!dropdown) return;

    if (!query || query.length < 1) {
      dropdown.style.display = 'none';
      return;
    }

    const allJobs = getAllJobs();
    const q = query.toLowerCase();
    const results = allJobs
      .filter(j =>
        j.nameT.toLowerCase().includes(q) ||
        j.nameE.toLowerCase().includes(q) ||
        j.catName.toLowerCase().includes(q) ||
        (j.tags || []).some(t => t.toLowerCase().includes(q))
      )
      .filter(j => !compareList.find(c => c.id === j.id))
      .slice(0, 8);

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="cmp-dd-empty">ไม่พบอาชีพที่ค้นหา</div>`;
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = results.map(j => `
      <div class="cmp-dd-item" onclick="compareAdd('${j.catId}','${j.id}')">
        <span class="cmp-dd-icon">${j.icon || '💼'}</span>
        <div class="cmp-dd-text">
          <span class="cmp-dd-name">${j.nameT}</span>
          <span class="cmp-dd-cat">${j.catName}</span>
        </div>
        <span class="cmp-dd-salary">฿${j.salary?.entry || '—'}</span>
      </div>
    `).join('');

    dropdown.style.display = 'block';
  }

  /* ─────────────── PUBLIC API ─────────────── */
  window.compareAdd = function (catId, jobId) {
    if (compareList.length >= MAX_SLOTS) {
      showCompareToast(`เลือกได้สูงสุด ${MAX_SLOTS} อาชีพครับ`);
      return;
    }

    const cat = DATA.categories.find(c => c.id === catId);
    if (!cat) return;
    const job = cat.jobs.find(j => j.id === jobId);
    if (!job) return;
    if (compareList.find(j => j.id === jobId)) {
      showCompareToast('อาชีพนี้อยู่ในรายการแล้ว');
      return;
    }

    compareList.push({ ...job, catId: cat.id, catName: cat.nameT, catColor: cat.color, catIconColor: cat.iconColor });

    // close dropdown & clear search
    const dd = document.getElementById('cmp-search-dropdown');
    const inp = document.getElementById('cmp-search-input');
    if (dd) dd.style.display = 'none';
    if (inp) inp.value = '';

    renderSlots();
    renderTable();
    showCompareToast(`เพิ่ม "${job.nameT}" แล้ว ✓`);
  };

  window.compareRemove = function (jobId) {
    compareList = compareList.filter(j => j.id !== jobId);
    renderSlots();
    renderTable();
  };

  window.compareClear = function () {
    compareList = [];
    renderSlots();
    renderTable();
  };

  window.compareSearchInput = function (val) {
    renderSearchResults(val.trim());
  };

  window.compareSearchBlur = function () {
    setTimeout(() => {
      const dd = document.getElementById('cmp-search-dropdown');
      if (dd) dd.style.display = 'none';
    }, 200);
  };

  /* ─────────────── TOAST ─────────────── */
  function showCompareToast(msg) {
    let toast = document.getElementById('cmp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cmp-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('cmp-toast-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('cmp-toast-show'), 2500);
  }

  /* ─────────────── ADD BUTTON ON DETAIL PAGE ─────────────── */
  // Patch showJob to inject "เพิ่มเพื่อเปรียบเทียบ" button
  const _origShowJob = window.showJob;
  window.showJob = function (catId, jobId) {
    if (_origShowJob) _origShowJob(catId, jobId);

    setTimeout(() => {
      const detailPage = document.getElementById('page-detail');
      if (!detailPage) return;

      // avoid duplicate
      if (detailPage.querySelector('.cmp-add-from-detail')) return;

      const breadcrumb = detailPage.querySelector('.breadcrumb');
      if (!breadcrumb) return;

      const alreadyAdded = () => compareList.find(j => j.id === jobId);

      const btn = document.createElement('button');
      btn.className = 'cmp-add-from-detail';
      btn.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        เปรียบเทียบอาชีพนี้
      `;
      btn.onclick = () => {
        if (alreadyAdded()) {
          showCompareToast('อาชีพนี้อยู่ในรายการเปรียบเทียบแล้ว');
          return;
        }
        compareAdd(catId, jobId);
        showPage('page-compare');
      };

      breadcrumb.parentNode.insertBefore(btn, breadcrumb.nextSibling);
    }, 100);
  };

  /* ─────────────── INIT ─────────────── */
  window.initComparePage = function () {
    renderSlots();
    renderTable();

    // close dropdown on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('#cmp-search-wrap')) {
        const dd = document.getElementById('cmp-search-dropdown');
        if (dd) dd.style.display = 'none';
      }
    });
  };

})();