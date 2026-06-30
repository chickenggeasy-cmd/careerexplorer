function handleSearch(query) {
  if (!query.trim()) {
    goHome();
    return;
  }

  const q = query.toLowerCase();
  let results = [];

  DATA.categories.forEach(cat => {
    cat.jobs.forEach(job => {
      if (
        job.nameT.toLowerCase().includes(q) ||
        job.nameE.toLowerCase().includes(q) ||
        job.tags.some(t => t.toLowerCase().includes(q)) ||
        job.skills.some(s => s.toLowerCase().includes(q))
      ) {
        results.push({ job, cat });
      }
    });
  });

  const resultsContainer = document.getElementById('searchResults');
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-result">
        <div class="big">😕</div>
        <h3 style="font-family:'Prompt'; font-size:20px; color:var(--text);">ไม่พบข้อมูลที่คุณค้นหา</h3>
        <p style="margin-top:10px;">ลองพิมพ์คำค้นหาอื่น เช่น "ออนไลน์", "แพทย์" หรือชื่อทักษะ</p>
      </div>
    `;
  } else {
    let html = '<div class="job-grid">';
    results.forEach((r, index) => {
      html += `<div style="animation: fadeInUp 0.5s ease forwards; opacity: 0; animation-delay: ${0.1 + (index * 0.05)}s;">${createJobCard(r.job, r.cat)}</div>`;
    });
    html += '</div>';
    resultsContainer.innerHTML = html;
  }
  showPage('page-search');
}