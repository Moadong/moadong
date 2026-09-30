// 로그인·로그아웃과 사이드바 해시 라우팅으로 섹션을 전환하는 포털 셸

const PORTAL_SECTION_IDS = ['api-docs', 'club', 'dict', 'promotion', 'feedback', 'letters', 'banner', 'fcm', 'statistics-backfill', 'conversion-batch', 'funnel-dashboard'];
// 운영진이 가장 자주 여는 화면을 첫 화면으로 둔다.
const DEFAULT_SECTION_ID = 'feedback';

function getActivePortalSectionId() {
  const sectionId = (window.location.hash || '#' + DEFAULT_SECTION_ID).replace('#', '');
  return PORTAL_SECTION_IDS.includes(sectionId) ? sectionId : DEFAULT_SECTION_ID;
}

function loadActivePortalSectionData(sectionId) {
  if (!getToken()) return;
  if (sectionId === 'club') loadClubsIfVisible();
  if (sectionId === 'dict') loadDictIfVisible();
  if (sectionId === 'promotion') loadPromotionIfVisible();
  if (sectionId === 'feedback') loadFeedbackIfVisible();
  if (sectionId === 'letters') loadSentLettersIfVisible();
  if (sectionId === 'banner') loadBannerIfVisible();
  if (sectionId === 'fcm') loadFcmTokensIfVisible();
  if (sectionId === 'funnel-dashboard') loadFunnelDashboardIfVisible();
}

function showActivePortalSection() {
  const activeId = getActivePortalSectionId();
  PORTAL_SECTION_IDS.forEach((sectionId) => {
    document.getElementById(sectionId).classList.toggle('hidden', sectionId !== activeId);
  });
  updateActiveNav();
  loadActivePortalSectionData(activeId);
  if (activeId === 'promotion') {
    window.requestAnimationFrame(() => initializePromotionMapIfVisible());
  }
}

function updateActiveNav() {
  const hash = '#' + getActivePortalSectionId();
  document.querySelectorAll('#sideNav a').forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === hash);
  });
}

window.addEventListener('hashchange', () => {
  if (!getToken()) return;
  showActivePortalSection();
});

function showLogin(show) {
  document.body.classList.toggle('is-authenticated', !!show);
  document.getElementById('login').classList.toggle('hidden', !!show);
  document.getElementById('loginForm').classList.toggle('hidden', !!show);
  document.getElementById('appShell').classList.toggle('hidden', !show);
  document.getElementById('tokenArea').classList.toggle('hidden', !show);
  document.getElementById('api-docs').classList.toggle('hidden', true);
  document.getElementById('navApiDocs').classList.toggle('hidden', !show);
  document.getElementById('club').classList.toggle('hidden', true);
  document.getElementById('dict').classList.toggle('hidden', true);
  document.getElementById('promotion').classList.toggle('hidden', true);
  document.getElementById('feedback').classList.toggle('hidden', true);
  document.getElementById('letters').classList.toggle('hidden', true);
  document.getElementById('banner').classList.toggle('hidden', true);
  document.getElementById('fcm').classList.toggle('hidden', true);
  document.getElementById('statistics-backfill').classList.toggle('hidden', true);
  document.getElementById('conversion-batch').classList.toggle('hidden', true);
  document.getElementById('funnel-dashboard').classList.toggle('hidden', true);
  const headerStatus = document.getElementById('headerStatus');
  const headerUserId = document.getElementById('headerUserId');
  if (show) {
    headerUserId.textContent = getUserId() || 'developer';
    headerStatus.classList.remove('hidden');
    if (!window.location.hash || window.location.hash === '#login') {
      history.replaceState(null, '', '#' + DEFAULT_SECTION_ID);
    }
    showActivePortalSection();
  } else {
    headerStatus.classList.add('hidden');
    clearUserId();
    history.replaceState(null, '', '#login');
  }
}

document.getElementById('loginFormEl').addEventListener('submit', async (e) => {
  e.preventDefault();
  const userId = document.getElementById('loginUserId').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('btnLogin');
  errEl.textContent = '';
  errEl.classList.add('hidden');
  btn.disabled = true;
  btn.textContent = '로그인 중...';
  try {
    const res = await fetch(API_BASE + '/auth/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password })
    });
    const data = await res.json();
    if (!res.ok) {
      errEl.textContent = data.message || '로그인 실패';
      errEl.classList.remove('hidden');
      return;
    }
    const token = data.data?.accessToken;
    if (token) {
      setToken(token);
      setUserId(userId);
      document.getElementById('tokenDisplay').textContent = token;
      showLogin(true);
      await loadDevPortalConfig();
      showActivePortalSection();
    } else {
      errEl.textContent = '토큰 없음';
      errEl.classList.remove('hidden');
    }
  } catch (e) {
    errEl.textContent = e.message || '요청 실패';
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = '로그인';
  }
});

document.getElementById('btnCopyToken').onclick = () => {
  const t = getToken();
  if (t) {
    navigator.clipboard.writeText(t);
    const fb = document.getElementById('copyFeedback');
    fb.classList.remove('hidden');
    setTimeout(() => fb.classList.add('hidden'), 2000);
  }
};

function clearLogoutState() {
  clearToken();
  clearUserId();
  promotionMapKey = '';
  showLogin(false);
  document.getElementById('tokenDisplay').textContent = '';
  document.getElementById('clubList').querySelector('tbody').innerHTML = '';
  document.getElementById('clubBanner').classList.add('hidden');
  document.getElementById('dictList').querySelector('tbody').innerHTML = '';
  document.getElementById('dictBanner').classList.add('hidden');
  clearPromotionState();
  clearBannerState();
  clearFcmState();
}

async function doLogout() {
  const btn = document.getElementById('headerLogout');
  btn.disabled = true;
  try {
    await fetch(API_BASE + '/auth/user/logout', {
      method: 'GET',
      credentials: 'include'
    });
  } catch (e) {
    console.warn('Logout request failed', e);
  } finally {
    btn.disabled = false;
    clearLogoutState();
  }
}

document.getElementById('headerLogout').onclick = doLogout;
