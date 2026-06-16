/**
 * Career Explorer Pro — Career Comparison Tool
 * ไฟล์: compare.js  |  ตำแหน่ง: ใส่หลัง icons.js ใน index.html
 * * [คู่มือสำหรับผู้พัฒนาต่อ (Developer Guide)]
 * - ไฟล์นี้จัดการระบบ "เปรียบเทียบอาชีพ" ทั้งหมด (หน้า Desktop เป็นตาราง, หน้า Mobile เป็นการ์ด)
 * - ตัวแปรข้อมูลหลักดึงมาจาก `DATA` (ในไฟล์ data.js)
 * - มีการทำ Accessibility (a11y) รองรับ Screen Reader และ Keyboard Navigation ไว้แล้ว ระวังอย่าลบ attribute อย่าง role, tabindex หรือ aria-label ออกนะครับ
 */

(function () {
  /* ─────────────── 1. STATE (สถานะของระบบ) ─────────────── */
  // ถ้าในอนาคตอยากให้เปรียบเทียบได้มากกว่า 3 อาชีพ ให้มาแก้ตัวเลขตรงนี้ได้เลยครับ
  const MAX_SLOTS = 3; 
  
  // อาเรย์เก็บข้อมูลอาชีพที่ถูกเลือกเข้ามาเปรียบเทียบ
  let compareList = []; 

  /* ─────────────── 2. HELPERS (ฟังก์ชันผู้ช่วยประมวลผลข้อมูล) ─────────────── */
  
  // ดึงข้อมูลอาชีพทั้งหมดจากทุกหมวดหมู่มารวมเป็น Array ก้อนเดียว เพื่อให้ค้นหาง่ายขึ้น
  function getAllJobs() {
    const jobs = [];
    DATA.categories.forEach(cat => {
      cat.jobs.forEach(job => {
        // แปะข้อมูลสีและชื่อหมวดหมู่เข้าไปใน job ด้วย จะได้เอาไปจัด UI สีตามหมวดได้
        jobs.push({ ...job, catId: cat.id, catName: cat.nameT, catColor: cat.color, catIconColor: cat.iconColor });
      });
    });
    return jobs;
  }

  // แปลงข้อความเงินเดือน (เช่น "100,000+") ให้เหลือแค่ตัวเลข (100000) เพื่อเอาไปคำนวณความยาวกราฟแท่ง
  function parseSalary(str) {
    if (!str) return 0;
    const clean = str.replace(/[^0-9]/g, ''); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
    return parseInt(clean, 10) || 0;
  }

  // แปลงข้อความแนวโน้มการเติบโต ให้เป็นคะแนน (0-3) เพื่อเอาไปกำหนดสี
  function growthScore(text) {
    if (!text) return 0;
    if (text.includes('สูงมาก')) return 3;
    if (text.includes('สูง')) return 2;
    if (text.includes('ปานกลาง') || text.includes('ดี')) return 1;
    return 0;
  }

  // สร้าง Label โอกาสเติบโต (ถ้าอยากเปลี่ยนสีคำว่า 'สูง', 'ปานกลาง' ให้แก้ที่ตัวแปร colors ตรงนี้)
  function growthLabel(text) {
    const score = growthScore(text);
    const labels = ['ปานกลาง', 'ดี', 'สูง', 'สูงมาก'];
    const colors = ['#94a3b8', '#60a5fa', '#34d399', '#f472b6']; // เรียงสีตามระดับคะแนน
    return `<span style="color:${colors[score]};font-weight:600;">${labels[score]}</span>`;
  }

  /* ─────────────── 3. SALARY BAR (วาดกราฟแท่งเงินเดือน) ─────────────── */
  // ฟังก์ชันนี้จะรับข้อมูล job เข้ามา แล้ววาดกราฟแท่ง 3 ระดับ (เริ่มต้น, กลาง, สูงอายุงาน)
  function salaryBarHTML(job) {
    const vals = [
      { label: 'Entry', val: parseSalary(job.salary?.entry), raw: job.salary?.entry },
      { label: 'Mid',   val: parseSalary(job.salary?.mid),   raw: job.salary?.mid },
      { label: 'Senior',val: parseSalary(job.salary?.senior),raw: job.salary?.senior },
    ];
    // หาค่าเงินเดือนที่เยอะที่สุด เพื่อเอามาตั้งเป็น 100% ความกว้างกราฟ
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

  /* ─────────────── 4. RENDER COMPARISON TABLE (สร้างตารางเปรียบเทียบหลัก) ─────────────── */
  // *ถ้าอยากเพิ่มหัวข้อในการเปรียบเทียบ (เช่น "สภาพแวดล้อมการทำงาน") ให้มาเพิ่มโค้ด HTML ในฟังก์ชันนี้
  function renderTable() {
    const wrap = document.getElementById('cmp-table-wrap');
    if (!wrap) return;

    // กรณีที่ยังไม่ได้เลือกอาชีพเลย (Empty State)
    if (compareList.length === 0) {
      wrap.innerHTML = `
        <div class="cmp-empty">
          <div class="cmp-empty-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4"/><rect x="9" y="3" width="6" height="14" rx="2"/></svg>
          </div>
          <p>เลือกอาชีพจากช่องด้านบนเพื่อเริ่มเปรียบเทียบ</p>
          <small>เลือกได้สูงสุด ${MAX_SLOTS} อาชีพ</small>
        </div>`;
      return;
    }

    /* ── ส่วนที่ 4.1: โครงสร้างตารางสำหรับจอคอมพิวเตอร์ (Desktop) ── */
    const headerCols = compareList.map(job => `
      <th>
        <div class="cmp-th-inner">
          <span class="cmp-job-icon" aria-hidden="true">${job.icon || '💼'}</span>
          <span class="cmp-job-name">${job.nameT}</span>
          <span class="cmp-job-cat" style="background:${job.catColor};color:${job.catIconColor}">${job.catName}</span>
          <button type="button" class="cmp-remove-btn" onclick="compareRemove('${job.id}')" title="ลบ ${job.nameT} ออก" aria-label="ลบอาชีพ ${job.nameT} ออกจากรายการ">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </th>
    `).join('');

    const salaryCols = compareList.map(job => `<td><div class="cmp-salary-bars">${salaryBarHTML(job)}</div></td>`).join('');
    
    const eduCols = compareList.map(job => `
      <td>
        <div class="cmp-edu">
          <div class="cmp-edu-degree">${job.degree || '—'}</div>
          <div class="cmp-edu-years">⏱ ${job.years || '—'}</div>
          <div class="cmp-edu-field">${job.education || '—'}</div>
        </div>
      </td>
    `).join('');

    const growthCols = compareList.map(job => `<td><div class="cmp-growth">${growthLabel(job.growth)}<p>${job.growth || '—'}</p></div></td>`).join('');
    
    const skillsCols = compareList.map(job => `
      <td>
        <div class="cmp-skills">
          ${(job.skills || []).map(s => `<span class="cmp-skill-pill">${s}</span>`).join('')}
        </div>
      </td>
    `).join('');

    const prosCols = compareList.map(job => `<td><ul class="cmp-list cmp-pros">${(job.pros || []).map(p => `<li>${p}</li>`).join('')}</ul></td>`).join('');
    const consCols = compareList.map(job => `<td><ul class="cmp-list cmp-cons">${(job.cons || []).map(c => `<li>${c}</li>`).join('')}</ul></td>`).join('');
    
    const ctaCols = compareList.map(job => `
      <td>
        <button type="button" class="cmp-detail-btn" onclick="showJob('${job.id}','${job.catId}')" aria-label="ดูรายละเอียดอาชีพ ${job.nameT}">
          ดูรายละเอียด →
        </button>
      </td>
    `).join('');

    /* ── ส่วนที่ 4.2: โครงสร้างการ์ดสำหรับหน้าจอมือถือ (Mobile) ── */
    // จะถูกซ่อนใน Desktop ด้วย CSS
    const mobileCards = compareList.map(job => `
      <div class="cmp-mobile-card">
        <div class="cmp-mobile-card-header">
          <span class="cmp-mobile-card-icon" aria-hidden="true">${job.icon || '💼'}</span>
          <div class="cmp-mobile-card-title">
            <span class="cmp-mobile-card-name">${job.nameT}</span>
            <span class="cmp-mobile-card-cat">${job.catName}</span>
          </div>
          <button type="button" class="cmp-mobile-remove" onclick="compareRemove('${job.id}')" aria-label="ลบอาชีพ ${job.nameT} ออกจากรายการ">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="cmp-mobile-card-body">
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">💰 เงินเดือน</div>
            <div class="cmp-salary-bars">${salaryBarHTML(job)}</div>
          </div>
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">🎓 การศึกษา</div>
            <div class="cmp-edu">
              <div class="cmp-edu-degree">${job.degree || '—'}</div>
              <div class="cmp-edu-years">⏱ ${job.years || '—'}</div>
              <div class="cmp-edu-field">${job.education || '—'}</div>
            </div>
          </div>
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">📈 โอกาสเติบโต</div>
            <div class="cmp-growth">${growthLabel(job.growth)}<p>${job.growth || '—'}</p></div>
          </div>
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">🛠 ทักษะสำคัญ</div>
            <div class="cmp-skills">
              ${(job.skills || []).map(s => `<span class="cmp-skill-pill">${s}</span>`).join('')}
            </div>
          </div>
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">✅ ข้อดี</div>
            <ul class="cmp-list cmp-pros">
              ${(job.pros || []).map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          <div class="cmp-mobile-row">
            <div class="cmp-mobile-row-label">⚠️ ข้อพิจารณา</div>
            <ul class="cmp-list cmp-cons">
              ${(job.cons || []).map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="cmp-mobile-card-footer">
          <button type="button" class="cmp-detail-btn" onclick="showJob('${job.id}','${job.catId}')" aria-label="ดูรายละเอียดเพิ่มเติมเกี่ยวกับ ${job.nameT}">
            ดูรายละเอียดเพิ่มเติม →
          </button>
        </div>
      </div>
    `).join('');

    // ประกอบร่าง HTML ทั้งหมดลงใน Wrapper
    wrap.innerHTML = `
      <div class="cmp-table-scroll" role="region" aria-label="ตารางเปรียบเทียบอาชีพ" tabindex="0">
        <table class="cmp-table">
          <thead>
            <tr class="cmp-header-row">
              <th class="cmp-row-label"></th>
              ${headerCols}
            </tr>
          </thead>
          <tbody>
            <tr><td class="cmp-row-label"><span>💰 เงินเดือน</span></td>${salaryCols}</tr>
            <tr><td class="cmp-row-label"><span>🎓 การศึกษา</span></td>${eduCols}</tr>
            <tr><td class="cmp-row-label"><span>📈 โอกาสเติบโต</span></td>${growthCols}</tr>
            <tr><td class="cmp-row-label"><span>🛠 ทักษะสำคัญ</span></td>${skillsCols}</tr>
            <tr><td class="cmp-row-label"><span>✅ ข้อดี</span></td>${prosCols}</tr>
            <tr><td class="cmp-row-label"><span>⚠️ ข้อพิจารณา</span></td>${consCols}</tr>
            <tr><td class="cmp-row-label"></td>${ctaCols}</tr>
          </tbody>
        </table>
      </div>
      <div id="cmp-cards-mobile">
        <p class="cmp-mobile-hint">เลื่อนดูแต่ละอาชีพด้านล่าง</p>
        ${mobileCards}
      </div>`;
  }

  /* ─────────────── 5. SLOT SELECTOR PANEL (ส่วนแถบด้านบนที่แสดงอาชีพที่เลือกไว้) ─────────────── */
  function renderSlots() {
    const slotsWrap = document.getElementById('cmp-slots');
    if (!slotsWrap) return;

    let html = '';
    // วนลูปสร้าง slot ตามจำนวน MAX_SLOTS
    for (let i = 0; i < MAX_SLOTS; i++) {
      const job = compareList[i];
      if (job) {
        // กรณีมีอาชีพอยู่ใน slot แล้ว
        html += `
          <div class="cmp-slot cmp-slot-filled">
            <span class="cmp-slot-icon" aria-hidden="true">${job.icon || '💼'}</span>
            <span class="cmp-slot-name">${job.nameT}</span>
            <button type="button" class="cmp-slot-remove" onclick="compareRemove('${job.id}')" aria-label="ลบอาชีพ ${job.nameT} ออกจากช่องเปรียบเทียบ">
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>`;
      } else {
        // กรณี slot ว่าง
        html += `
          <div class="cmp-slot cmp-slot-empty" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>เลือกอาชีพ</span>
          </div>`;
      }
    }

    slotsWrap.innerHTML = html;

    // อัปเดตตัวเลขแสดงจำนวน (เช่น 1/3)
    const counter = document.getElementById('cmp-count');
    if (counter) counter.textContent = `${compareList.length}/${MAX_SLOTS}`;

    // ซ่อน/แสดง ปุ่ม "ล้างทั้งหมด"
    const clearBtn = document.getElementById('cmp-clear-btn');
    if (clearBtn) clearBtn.style.display = compareList.length > 0 ? 'flex' : 'none';
  }

  /* ─────────────── 6. SEARCH DROPDOWN (ส่วนค้นหาและแสดงผล Dropdown) ─────────────── */
  // จะถูกเรียกเมื่อผู้ใช้พิมพ์ในช่อง Search
  function renderSearchResults(query) {
    const dropdown = document.getElementById('cmp-search-dropdown');
    if (!dropdown) return;

    // ถ้าไม่ได้พิมพ์อะไร ให้ซ่อน Dropdown
    if (!query || query.length < 1) {
      dropdown.style.display = 'none';
      return;
    }

    const allJobs = getAllJobs();
    const q = query.toLowerCase();
    
    // ค้นหาจากชื่อไทย, ชื่ออังกฤษ, หมวดหมู่ และ Tags (กรองตัวที่เลือกไปแล้วออก) ดึงมาโชว์แค่ 8 อัน
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
      dropdown.innerHTML = `<div class="cmp-dd-empty" role="status">ไม่พบอาชีพที่ค้นหา</div>`;
      dropdown.style.display = 'block';
      return;
    }

    // 🛠️ ข้อควรระวัง: โครงสร้างตรงนี้ใช้ div เพื่อรักษา CSS เดิมไว้ แต่เติม role/tabindex ให้รองรับ Keyboard/Screen reader
    dropdown.innerHTML = results.map(j => `
      <div class="cmp-dd-item" role="button" tabindex="0" 
           onclick="compareAdd('${j.catId}','${j.id}')" 
           onkeydown="if(event.key === 'Enter' || event.key === ' ') { event.preventDefault(); compareAdd('${j.catId}','${j.id}'); }" 
           aria-label="เพิ่มอาชีพ ${j.nameT} ลงในรายการเปรียบเทียบ">
        <span class="cmp-dd-icon" aria-hidden="true">${j.icon || '💼'}</span>
        <div class="cmp-dd-text">
          <span class="cmp-dd-name">${j.nameT}</span>
          <span class="cmp-dd-cat">${j.catName}</span>
        </div>
        <span class="cmp-dd-salary">฿${j.salary?.entry || '—'}</span>
      </div>
    `).join('');

    dropdown.style.display = 'block';
  }

  /* ─────────────── 7. PUBLIC API (หน้าต่างติดต่อกับไฟล์ HTML อื่นๆ) ─────────────── */
  // ฟังก์ชันกลุ่มนี้ผูกกับ `window.` เพื่อให้เรียกใช้จาก `onclick` ใน HTML ได้ตรงๆ
  
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

    // หลังเพิ่มสำเร็จ ให้ปิด Dropdown และล้างช่อง Search
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
    // หน่วงเวลาเล็กน้อยก่อนปิด เพื่อให้ผู้ใช้คลิกเลือก Dropdown ได้ทัน
    setTimeout(() => {
      const dd = document.getElementById('cmp-search-dropdown');
      if (dd) dd.style.display = 'none';
    }, 200);
  };

  /* ─────────────── 8. TOAST (ระบบแจ้งเตือนป็อปอัป) ─────────────── */
  function showCompareToast(msg) {
    let toast = document.getElementById('cmp-toast');
    // ถ้ายังไม่มี div โทสต์ใน HTML ให้สร้างขึ้นมาใหม่
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cmp-toast';
      toast.setAttribute('role', 'alert'); // ให้ Screen Reader อ่านทันทีที่เด้งขึ้นมา
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('cmp-toast-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('cmp-toast-show'), 2500); // หายไปใน 2.5 วิ
  }

  /* ─────────────── 9. INTEGRATION WITH DETAIL PAGE (เชื่อมต่อกับหน้ารายละเอียดอาชีพ) ─────────────── */
  // เทคนิค: เขียนทับ (Patch) ฟังก์ชัน showJob เดิม เพื่อแทรกปุ่ม "เปรียบเทียบอาชีพนี้" เข้าไปในหน้ารายละเอียดโดยอัตโนมัติ
  const _origShowJob = window.showJob;
  window.showJob = function (jobId, catId) {
    if (_origShowJob) _origShowJob(jobId, catId); // เรียกการทำงานของ showJob ตัวเดิมก่อน

    setTimeout(() => {
      const detailPage = document.getElementById('page-detail');
      if (!detailPage) return;

      // ลบปุ่มเก่าออกก่อน (ถ้ามี) เพื่อไม่ให้ซ้ำซ้อน
      const existingBtn = detailPage.querySelector('.cmp-add-from-detail');
      if (existingBtn) {
        existingBtn.remove();
      }

      const breadcrumb = detailPage.querySelector('.breadcrumb');
      if (!breadcrumb) return;

      const alreadyAdded = () => compareList.find(j => j.id === jobId);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cmp-add-from-detail';
      btn.setAttribute('aria-label', 'นำอาชีพนี้ไปเปรียบเทียบ');
      btn.innerHTML = `
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        เปรียบเทียบอาชีพนี้
      `;
      btn.onclick = () => {
        if (alreadyAdded()) {
          showCompareToast('อาชีพนี้อยู่ในรายการเปรียบเทียบแล้ว');
          return;
        }
        compareAdd(catId, jobId);
        showPage('page-compare'); // สลับหน้าไปที่ตารางเปรียบเทียบ
      };

      breadcrumb.parentNode.insertBefore(btn, breadcrumb.nextSibling); // แทรกปุ่มต่อท้าย breadcrumb
    }, 100);
  };

  /* ─────────────── 10. INIT (เริ่มต้นการทำงาน) ─────────────── */
  window.initComparePage = function () {
    renderSlots();
    renderTable();

    // ดึง input ช่องค้นหามาเติม aria-label เพื่อให้ผ่านมาตรฐาน Accessibility
    const searchInput = document.getElementById('cmp-search-input');
    if (searchInput && !searchInput.hasAttribute('aria-label')) {
      searchInput.setAttribute('aria-label', 'ค้นหาอาชีพเพื่อเปรียบเทียบ');
    }

    // คลิกพื้นที่อื่นเพื่อปิด Dropdown ค้นหา
    document.addEventListener('click', e => {
      if (!e.target.closest('#cmp-search-wrap')) {
        const dd = document.getElementById('cmp-search-dropdown');
        if (dd) dd.style.display = 'none';
      }
    });
  };

})();