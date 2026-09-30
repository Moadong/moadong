// 보낸 편지(답장 + 전체 편지) 목록, 학생 화면 그대로의 미리보기, 제목·본문 수정

let sentLetters = [];
let sentLettersHaveLoaded = false;
let sentLettersAreLoading = false;
let sentLetterSelectedId = '';
let sentLetterIsEditing = false;
let sentLetterIsSaving = false;

function loadSentLettersIfVisible() {
  if (sentLettersHaveLoaded || sentLettersAreLoading) return;
  reloadSentLetters();
}

async function reloadSentLetters() {
  if (sentLettersAreLoading) return;
  sentLettersAreLoading = true;
  document.getElementById('sentLetterListLoading').classList.remove('hidden');
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/letters', { headers: headers() });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      sentLetters = [];
      showToast(data.message || '보낸 편지 목록 조회 실패 (HTTP ' + res.status + ')', 'error');
    } else {
      sentLetters = data.data?.letters || [];
    }
    sentLettersHaveLoaded = true;
  } catch (e) {
    sentLetters = [];
    showToast(e.message || '보낸 편지 목록 조회 실패', 'error');
  } finally {
    sentLettersAreLoading = false;
    document.getElementById('sentLetterListLoading').classList.add('hidden');
    if (!getSelectedSentLetter()) {
      sentLetterSelectedId = '';
      sentLetterIsEditing = false;
    }
    renderSentLetterList();
    renderSentLetterDetail();
  }
}

function getSelectedSentLetter() {
  return sentLetters.find((letter) => letter.id === sentLetterSelectedId) || null;
}

function renderSentLetterList() {
  const tbody = document.querySelector('#sentLetterList tbody');
  const summary = document.getElementById('sentLetterSummary');
  tbody.innerHTML = '';

  if (!sentLetters.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = sentLettersHaveLoaded ? '보낸 편지가 없어요.' : '보낸 편지 목록을 불러오세요.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    summary.textContent = sentLettersHaveLoaded ? '총 0개 편지' : '보낸 편지 목록을 불러오세요.';
    return;
  }

  summary.textContent = '총 ' + sentLetters.length + '개 편지';
  sentLetters.forEach((letter) => {
    const isSelected = letter.id === sentLetterSelectedId;
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', (letter.title || '제목 없음') + ' 편지 미리보기');
    tr.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    tr.classList.toggle('is-selected', isSelected);
    tr.appendChild(document.createElement('td')).appendChild(
      createTag(LETTER_CATEGORY_LABELS[letter.category] || letter.category || '-', LETTER_CATEGORY_TONES[letter.category]));
    const titleCell = tr.appendChild(document.createElement('td'));
    titleCell.className = 'sent-letter-title-cell';
    titleCell.textContent = letter.title || '';
    titleCell.title = letter.title || '';
    // 받는 사람이 없는 편지는 전체 사용자에게 발행한 편지다.
    tr.appendChild(document.createElement('td')).textContent = letter.recipient || '전체';
    tr.appendChild(document.createElement('td')).textContent = formatFeedbackDate(letter.createdAt);
    const selectCurrentLetter = () => selectSentLetter(letter.id);
    tr.onclick = selectCurrentLetter;
    tr.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCurrentLetter();
      }
    };
    tbody.appendChild(tr);
  });
}

function isSentLetterEditDirty() {
  const letter = getSelectedSentLetter();
  if (!sentLetterIsEditing || !letter) return false;
  return document.getElementById('sentLetterEditTitle').value !== (letter.title || '')
    || document.getElementById('sentLetterEditBody').value !== (letter.body || '');
}

async function confirmDiscardSentLetterEdit() {
  if (!isSentLetterEditDirty()) return true;
  return confirmDialog({ title: '저장하지 않은 수정 내용이 있어요', message: '넘어가면 수정한 내용이 사라져요.', confirmLabel: '버리기', danger: true });
}

async function selectSentLetter(letterId) {
  if (letterId === sentLetterSelectedId) return;
  if (!(await confirmDiscardSentLetterEdit())) return;
  sentLetterSelectedId = letterId;
  sentLetterIsEditing = false;
  renderSentLetterList();
  renderSentLetterDetail();
  revealOnNarrowScreen('sentLetterView');
}

function renderSentLetterMeta(letter) {
  const meta = document.getElementById('sentLetterMeta');
  meta.innerHTML = '';
  [
    ['받는 사람', letter.recipient || '전체 사용자'],
    ['보낸 날짜', formatLetterSentAt(letter.createdAt)],
    ['푸시', letter.pushSuccessCount ? letter.pushSuccessCount.toLocaleString() + '건 도달' : '보내지 않음'],
  ].forEach(([label, value]) => {
    const row = meta.appendChild(document.createElement('div'));
    row.appendChild(document.createElement('dt')).textContent = label;
    row.appendChild(document.createElement('dd')).textContent = value;
  });
}

// 보낸 편지 목록에는 원본 피드백 본문이 없어서, 받은 피드백 목록을 불러왔다면 그걸로 인용 카드를 채운다.
function findQuotedFeedback(letter) {
  if (!letter.feedbackId) return null;
  return feedbacks.find((feedback) => feedback.id === letter.feedbackId) || null;
}

function renderSentLetterPreview(targetId, letter) {
  const target = document.getElementById(targetId);
  target.innerHTML = '';
  target.appendChild(buildLetterPreview(letter, findQuotedFeedback(letter)));
}

function renderSentLetterDetail() {
  const letter = getSelectedSentLetter();
  document.getElementById('sentLetterEmpty').classList.toggle('hidden', !!letter);
  document.getElementById('sentLetterView').classList.toggle('hidden', !letter || sentLetterIsEditing);
  document.getElementById('sentLetterEdit').classList.toggle('hidden', !letter || !sentLetterIsEditing);
  if (!letter) return;

  if (!sentLetterIsEditing) {
    renderSentLetterMeta(letter);
    renderSentLetterPreview('sentLetterPreview', letter);
    return;
  }

  const btnSave = document.getElementById('btnSaveSentLetter');
  btnSave.disabled = sentLetterIsSaving;
  btnSave.textContent = sentLetterIsSaving ? '저장 중...' : '저장';
  document.getElementById('btnCancelSentLetter').disabled = sentLetterIsSaving;
}

function showSentLetterEditTab(tab) {
  const isPreview = tab === 'preview';
  setSegmentedTab('sentLetterEditTabs', tab);
  document.getElementById('sentLetterEditWrite').classList.toggle('hidden', isPreview);
  document.getElementById('sentLetterEditPreview').classList.toggle('hidden', !isPreview);
  if (isPreview) {
    const letter = getSelectedSentLetter();
    renderSentLetterPreview('sentLetterEditPreview', {
      ...letter,
      title: document.getElementById('sentLetterEditTitle').value.trim(),
      body: document.getElementById('sentLetterEditBody').value,
    });
  }
}

function startSentLetterEdit() {
  const letter = getSelectedSentLetter();
  if (!letter) return;
  sentLetterIsEditing = true;
  document.getElementById('sentLetterEditTitle').value = letter.title || '';
  document.getElementById('sentLetterEditBody').value = letter.body || '';
  showSentLetterEditTab('write');
  renderSentLetterDetail();
  document.getElementById('sentLetterEditTitle').focus();
}

async function cancelSentLetterEdit() {
  if (!(await confirmDiscardSentLetterEdit())) return;
  sentLetterIsEditing = false;
  renderSentLetterDetail();
}

async function saveSentLetter() {
  const letter = getSelectedSentLetter();
  if (!letter) return;
  const title = document.getElementById('sentLetterEditTitle').value.trim();
  const body = document.getElementById('sentLetterEditBody').value.trim();
  if (!title || !body) {
    showToast('제목과 본문을 모두 입력하세요.', 'error');
    return;
  }
  if (!isSentLetterEditDirty()) {
    sentLetterIsEditing = false;
    renderSentLetterDetail();
    return;
  }

  sentLetterIsSaving = true;
  renderSentLetterDetail();
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/letters/' + encodeURIComponent(letter.id), {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ title, body })
    });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      showToast(data.message || '편지 수정 실패 (HTTP ' + res.status + ')', 'error');
      return;
    }
    const updated = data.data || { ...letter, title, body };
    sentLetters = sentLetters.map((it) => (it.id === letter.id ? { ...it, ...updated } : it));
    sentLetterIsEditing = false;
    showToast(getApiSuccessMessage(data, '편지를 수정했어요.'));
    renderSentLetterList();
  } catch (e) {
    showToast(e.message || '편지 수정 실패', 'error');
  } finally {
    sentLetterIsSaving = false;
    renderSentLetterDetail();
  }
}

bindSegmentedTabs('sentLetterEditTabs', showSentLetterEditTab);
document.getElementById('btnLoadSentLetters').onclick = async () => {
  if (!(await confirmDiscardSentLetterEdit())) return;
  sentLetterIsEditing = false;
  reloadSentLetters();
};
document.getElementById('btnEditSentLetter').onclick = startSentLetterEdit;
document.getElementById('btnCancelSentLetter').onclick = cancelSentLetterEdit;
document.getElementById('btnSaveSentLetter').onclick = saveSentLetter;
