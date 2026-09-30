// 편지를 웹 받은 편지 상세(frontend LetterDetailPage)와 같은 모양으로 그리는 미리보기와 작성/미리보기 탭

// react-markdown은 본문의 raw HTML을 그리지 않는다. 같은 결과를 내도록 HTML 토큰은 글자 그대로 보여준다.
function renderLetterMarkdown(markdown) {
  const container = document.createElement('div');
  if (!window.marked || !window.DOMPurify) {
    // CDN을 못 받았을 때도 내용은 확인할 수 있게 원문을 보여준다.
    container.className = 'letter-body-fallback';
    container.textContent = markdown || '';
    return container;
  }
  const renderer = new marked.Renderer();
  renderer.html = (html) => escapeHtml(typeof html === 'string' ? html : (html?.text || ''));
  const html = marked.parse(markdown || '', { gfm: false, breaks: false, renderer });
  container.innerHTML = DOMPurify.sanitize(html);
  container.querySelectorAll('a').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  return container;
}

/** 시안 표기: 2026년 05월 27일 */
function formatLetterSentAt(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '년 ' + month + '월 ' + day + '일';
}

/**
 * letter: { category, title, body, createdAt }
 * quote: 답장이 인용하는 원본 피드백 { type, content } (없으면 생략)
 */
function buildLetterPreview(letter, quote) {
  const root = document.createElement('div');
  root.className = 'letter-preview';

  const device = root.appendChild(document.createElement('div'));
  device.className = 'letter-preview-device';
  const topbar = device.appendChild(document.createElement('div'));
  topbar.className = 'letter-preview-topbar';
  topbar.textContent = '받은 편지';

  const content = device.appendChild(document.createElement('div'));
  content.className = 'letter-preview-content';

  const header = content.appendChild(document.createElement('div'));
  header.className = 'letter-preview-header';
  header.appendChild(createTag(
    LETTER_CATEGORY_LABELS[letter.category] || letter.category || '편지',
    LETTER_CATEGORY_TONES[letter.category]));
  const title = header.appendChild(document.createElement('h1'));
  title.className = 'letter-preview-title';
  title.textContent = letter.title || '제목을 입력하세요';
  title.classList.toggle('is-placeholder', !letter.title);
  const sentAt = header.appendChild(document.createElement('p'));
  sentAt.className = 'letter-preview-date';
  sentAt.textContent = formatLetterSentAt(letter.createdAt);

  if (quote) {
    const card = content.appendChild(document.createElement('div'));
    card.className = 'letter-preview-quote';
    card.appendChild(document.createElement('span')).textContent = '내가 보낸 편지';
    const text = card.appendChild(document.createElement('p'));
    text.textContent = quote.content || '';
    card.appendChild(createTag(FEEDBACK_TYPE_LABELS[quote.type] || quote.type || '', FEEDBACK_TYPE_TONES[quote.type]));
  }

  const body = content.appendChild(document.createElement('div'));
  body.className = 'letter-body';
  if (letter.body && letter.body.trim()) {
    body.appendChild(renderLetterMarkdown(letter.body));
  } else {
    body.classList.add('is-placeholder');
    body.textContent = '본문을 입력하면 여기에 보여요.';
  }
  return root;
}

/** .segmented 안의 [data-tab] 버튼을 탭으로 묶는다. onChange(tab)로 현재 탭을 알린다. */
function bindSegmentedTabs(containerId, onChange) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('[data-tab]').forEach((button) => {
    button.onclick = () => {
      setSegmentedTab(containerId, button.dataset.tab);
      onChange(button.dataset.tab);
    };
  });
}

function setSegmentedTab(containerId, tab) {
  document.getElementById(containerId).querySelectorAll('[data-tab]').forEach((button) => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}
