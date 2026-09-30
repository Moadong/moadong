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
  let stack = document.getElementById('toastStack');
  if (!stack) {
    stack = document.createElement('div');
    stack.id = 'toastStack';
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const tone = type === 'error' ? 'error' : 'success';
  const el = document.createElement('div');
  el.className = 'toast ' + tone;
  el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  const icon = el.appendChild(document.createElement('span'));
  icon.className = 'toast-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = tone === 'error' ? '!' : '✓';
  el.appendChild(document.createElement('span')).textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function truncateId(id) {
  if (!id || id.length <= 8) return id;
  return id.slice(0, 8) + '…';
}

function copyTextToClipboard(text, message) {
  navigator.clipboard.writeText(text || '')
    .then(() => showToast(message || '복사됨', 'success'))
    .catch(() => showToast('복사하지 못했어요. 직접 선택해 복사하세요.', 'error'));
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

// 웹 FEEDBACK_TYPE_META · LETTER_CATEGORY_META와 같은 색 조합을 쓰는 태그. tone은 css/portal.css의 .tag-* 이름이다.
function createTag(label, tone) {
  const el = document.createElement('span');
  el.className = 'tag tag-' + (tone || 'gray');
  el.textContent = label;
  return el;
}

/**
 * 브라우저 기본 confirm 대신 쓰는 확인 모달. 확인이면 true, 취소·Esc·바깥 클릭이면 false.
 * options: { title, message, details: [[라벨, 값]], confirmLabel, cancelLabel, danger }
 */
function confirmDialog(options) {
  const opts = typeof options === 'string' ? { title: options } : options;
  return new Promise((resolve) => {
    const previousFocus = document.activeElement;
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    const dialog = backdrop.appendChild(document.createElement('div'));
    dialog.className = 'modal';
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');

    const title = dialog.appendChild(document.createElement('h3'));
    title.className = 'modal-title';
    title.textContent = opts.title || '계속할까요?';
    title.id = 'modalTitle';
    dialog.setAttribute('aria-labelledby', title.id);
    if (opts.message) {
      const message = dialog.appendChild(document.createElement('p'));
      message.className = 'modal-message';
      message.textContent = opts.message;
    }
    if (opts.details && opts.details.length) {
      const list = dialog.appendChild(document.createElement('dl'));
      list.className = 'modal-details';
      opts.details.forEach(([label, value]) => {
        const row = list.appendChild(document.createElement('div'));
        row.appendChild(document.createElement('dt')).textContent = label;
        row.appendChild(document.createElement('dd')).textContent = value;
      });
    }
    const actions = dialog.appendChild(document.createElement('div'));
    actions.className = 'modal-actions';
    const cancel = actions.appendChild(document.createElement('button'));
    cancel.type = 'button';
    cancel.textContent = opts.cancelLabel || '취소';
    const ok = actions.appendChild(document.createElement('button'));
    ok.type = 'button';
    ok.className = opts.danger ? 'btn-danger-solid' : 'btn-primary';
    ok.textContent = opts.confirmLabel || '확인';

    const close = (result) => {
      document.removeEventListener('keydown', onKey, true);
      backdrop.remove();
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
      resolve(result);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); close(false); }
      if (event.key === 'Tab') {
        // 모달 안에서만 포커스가 돌게 한다.
        event.preventDefault();
        (document.activeElement === ok ? cancel : ok).focus();
      }
    };
    cancel.onclick = () => close(false);
    ok.onclick = () => close(true);
    backdrop.onclick = (event) => { if (event.target === backdrop) close(false); };
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(backdrop);
    // 위험한 동작은 Enter 한 번에 실행되지 않게 취소에 포커스를 둔다.
    (opts.danger ? cancel : ok).focus();
  });
}

/** 목록용 상대 시간. 일주일이 지나면 날짜로 보여준다. */
function formatRelativeTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return '방금';
  if (minutes < 60) return minutes + '분 전';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + '시간 전';
  const days = Math.floor(hours / 24);
  if (days === 1) return '어제';
  if (days < 7) return days + '일 전';
  return (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
}

function formatDateTime(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
}

// 목록과 편집 영역이 세로로 쌓이는 폭에서는 고른 항목의 편집 영역으로 내려준다.
function revealOnNarrowScreen(elementId) {
  if (!window.matchMedia('(max-width: 1180px)').matches) return;
  const el = document.getElementById(elementId);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 외부 입력을 href/src에 넣기 전에 http(s)만 남긴다. javascript: 같은 스킴은 빈 문자열이 된다.
function toSafeHttpUrl(rawUrl) {
  const value = String(rawUrl || '').trim();
  if (!value) return '';
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
    return parsed.href;
  } catch (_) {
    return '';
  }
}
