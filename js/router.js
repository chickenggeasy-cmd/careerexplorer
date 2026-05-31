let currentCategory = null;

function showPage(pageId, addToHistory = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
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

function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

window.onpopstate = function (event) {
  if (event.state && event.state.page) {
    showPage(event.state.page, false);
  } else {
    showPage('page-home', false);
  }
};

window.addEventListener('load', function () {
  const hash = window.location.hash.replace('#', '');
  const pageId = hash || 'page-home';

  if (!hash) {
    history.replaceState({ page: 'page-home' }, "", "#page-home");
  }

  showPage(pageId, false);
});
