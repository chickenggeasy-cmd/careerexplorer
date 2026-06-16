// Career Explorer Pro - SPA Router
// คุมการเปลี่ยนหน้าทั้งหมดด้วย History API + URL hash

// category ที่กำลังดูอยู่ ใช้ตอนกด "ย้อนกลับ"
let currentCategory = null;

// เปลี่ยนหน้า: ซ่อนหน้าเดิม โชว์หน้าใหม่ + อัปเดต URL
// addToHistory = false ใช้ตอนกด back/forward (ไม่ต้อง push history ซ้ำ)
function showPage(pageId, addToHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');

  if (addToHistory) {
    history.pushState({ page: pageId }, "", "#" + pageId);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// กลับหน้าแรก + เคลียร์ช่องค้นหา
function goHome() {
  currentCategory = null;
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  showPage('page-home');
}

// ปุ่มย้อนกลับ: ถ้ามาจาก category ให้กลับไป category เดิม ไม่ใช่หน้าแรก
function goBack() {
  if (currentCategory) {
    showCategory(currentCategory);
  } else {
    goHome();
  }
}

// เปิด/ปิดเมนูมือถือ
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.toggle('active');
}

function closeMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.remove('active');
}

// ดักปุ่ม back/forward ของ browser ให้แสดงหน้าตาม history ที่เคยบันทึกไว้
window.onpopstate = function (event) {
  if (event.state && event.state.page) {
    showPage(event.state.page, false);
  } else {
    showPage('page-home', false);
  }
};

// ตอนโหลดหน้าเว็บครั้งแรก: เช็ค URL hash ว่าควรเปิดหน้าไหน
window.addEventListener('load', function () {
  const hash = window.location.hash.replace('#', '');
  const pageId = hash || 'page-home';

  if (!hash) {
    history.replaceState({ page: 'page-home' }, "", "#page-home");
  }

  showPage(pageId, false);
});