// 개발자 포털 전 화면이 공유하는 상수·토큰·요청 헤더·토스트·문자열 유틸

const API_BASE = '';
const PAGE_SIZE = 50;

function getToken() { return sessionStorage.getItem('devPortalToken') || ''; }
function setToken(t) { sessionStorage.setItem('devPortalToken', t); }
function clearToken() { sessionStorage.removeItem('devPortalToken'); }
function getUserId() { return sessionStorage.getItem('devPortalUserId') || ''; }
function setUserId(u) { sessionStorage.setItem('devPortalUserId', u); }
function clearUserId() { sessionStorage.removeItem('devPortalUserId'); }

function headers() {
  const t = getToken();
  const h = { 'Content-Type': 'application/json' };
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
}

function showToast(message, type) {
  const el = document.createElement('div');
  el.className = 'toast ' + (type || 'success');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function truncateId(id) {
  if (!id || id.length <= 8) return id;
  return id.slice(0, 8) + '…';
}

function copyTextToClipboard(text, message) {
  navigator.clipboard.writeText(text || '');
  showToast(message || '복사됨', 'success');
}

async function readJsonOrEmpty(res) {
  try {
    return await res.json();
  } catch (_) {
    return {};
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setMessageBox(elId, ok, message) {
  const el = document.getElementById(elId);
  el.textContent = message;
  el.className = 'message-box ' + (ok ? 'success' : 'error');
  el.classList.remove('hidden');
}

function truncateMiddle(value, left, right) {
  if (!value) return '';
  if (value.length <= (left + right + 1)) return value;
  return value.slice(0, left) + '…' + value.slice(value.length - right);
}
