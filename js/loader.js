/**
 * Career Explorer Pro — App Loader
 * ใส่ไว้ที่ js/loader.js
 * เรียกใช้งาน: script tag ก่อน </body> ใน index.html
 */

(function () {

  /* ── 1. inject loader HTML ก่อนทุกอย่าง ── */
  const loaderHTML = `
    <div id="app-loader">

      <!-- particles -->
      <div class="loader-particles">
        <div class="lp-dot"></div>
        <div class="lp-dot"></div>
        <div class="lp-dot"></div>
        <div class="lp-dot"></div>
        <div class="lp-dot"></div>
      </div>

      <!-- grain -->
      <div class="loader-grain"></div>

      <!-- center -->
      <div class="loader-center">

        <!-- logo ring -->
        <div class="loader-logo-ring">
          <div class="loader-logo-glow"></div>

          <!-- spinning SVG ring -->
          <svg class="loader-ring-svg" viewBox="0 0 110 110"
               fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55" cy="55" r="50"
              stroke="rgba(255,255,255,0.12)" stroke-width="3"/>
            <circle cx="55" cy="55" r="50"
              stroke="url(#ring-grad)" stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="80 235"/>
            <defs>
              <linearGradient id="ring-grad" x1="0" y1="0" x2="110" y2="110"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#fce7f3"/>
                <stop offset="1" stop-color="#f472b6"/>
              </linearGradient>
            </defs>
          </svg>

          <!-- logo -->
          <div class="loader-logo-img">
            <img src="https://www.otep.go.th/assets/images/otep_logo.png"
                 alt="logo" />
          </div>
        </div>

        <!-- brand -->
        <div class="loader-brand">
          <div class="loader-brand-name">SUKSAPANPANIT</div>
          <div class="loader-brand-sub">Career Explorer Pro</div>
        </div>

        <!-- progress -->
        <div class="loader-progress-wrap">
          <div class="loader-progress-track">
            <div class="loader-progress-fill" id="loaderBar"></div>
          </div>
        </div>

        <!-- status -->
        <div class="loader-status" id="loaderStatus">กำลังโหลดข้อมูล...</div>

        <!-- dots -->
        <div class="loader-dots">
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
          <div class="loader-dot"></div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', loaderHTML);

  /* ── 2. progress steps ── */
  const steps = [
    { pct: 20,  msg: "กำลังโหลดข้อมูลอาชีพ..." },
    { pct: 45,  msg: "โหลดรูปภาพ..." },
    { pct: 70,  msg: "เตรียมหน้าแสดงผล..." },
    { pct: 90,  msg: "เกือบเสร็จแล้ว..." },
    { pct: 100, msg: "พร้อมใช้งาน ✓" },
  ];

  const bar    = document.getElementById('loaderBar');
  const status = document.getElementById('loaderStatus');
  let stepIdx  = 0;

  function nextStep() {
    if (stepIdx >= steps.length) return;
    const s = steps[stepIdx++];
    if (bar)    bar.style.width  = s.pct + '%';
    if (status) status.textContent = s.msg;
  }

  /* kick off progress */
  nextStep(); /* 20% immediately */

  const iv = setInterval(() => {
    if (stepIdx < steps.length - 1) {
      nextStep();
    } else {
      clearInterval(iv);
    }
  }, 380);

  /* ── 3. hide loader ── */
  function hideLoader() {
    /* jump to 100% */
    if (bar)    bar.style.width     = '100%';
    if (status) status.textContent  = 'พร้อมใช้งาน ✓';
    clearInterval(iv);

    setTimeout(() => {
      const el = document.getElementById('app-loader');
      if (!el) return;
      el.classList.add('loader-hide');
      /* remove from DOM after transition */
      setTimeout(() => el.remove(), 600);
    }, 350);
  }

  /* ── 4. trigger: window load + minimum display time ── */
  const MIN_SHOW = 1600; /* ms — ให้ผู้ใช้เห็น loader ไม่น้อยกว่านี้ */
  const startTime = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const wait    = Math.max(0, MIN_SHOW - elapsed);
    setTimeout(hideLoader, wait);
  });

  /* fallback: ถ้า window load ไม่ยิงใน 5 วินาที ก็ซ่อนเองเลย */
  setTimeout(hideLoader, 5000);

})();