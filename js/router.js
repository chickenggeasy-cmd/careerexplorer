let currentCategory = null;

function showPage(pageId, addToHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // ใช้ ?. เผื่อกรณีใส่ชื่อ pageId ผิด หรือหาหน้าไม่เจอ จะได้ไม่ Error
  document.getElementById(pageId)?.classList.add('active');

  if (addToHistory) {
    history.pushState({ page: pageId }, "", "#" + pageId);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
  currentCategory = null;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }
  showPage('page-home');
}

function goBack() {
  if (currentCategory) {
    showCategory(currentCategory);
  } else {
    goHome();
  }
}

// ฟังก์ชันสำหรับเปิด/ปิด Hamburger Menu ในโหมดมือถือ
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// ใช้งาน window.onpopstate แค่ตัวเดียว (เอาเวอร์ชันที่มี else มาใช้เพราะครอบคลุมกว่า)
window.onpopstate = function (event) {
  if (event.state && event.state.page) {
    showPage(event.state.page, false);
  } else {
    // เผื่อกรณีกดย้อนกลับจนถึงจุดเริ่มต้นที่ไม่มี state จะได้เด้งกลับหน้าหลักอย่างถูกต้อง
    showPage('page-home', false);
  }
};