// 받은 피드백 목록, 답장·전체 편지 작성과 임시저장, 보낸 편지 목록

const FEEDBACK_TYPE_LABELS = { BUG: '문제 신고', FEATURE: '기능 요청', QUESTION: '문의', CHEER: '응원' };
const FEEDBACK_STATUS_LABELS = { WAITING: '답장 대기', IN_PROGRESS: '확인 중', REPLIED: '답장 완료' };
const LETTER_CATEGORY_LABELS = { REPLY: '답장', UPDATE: '업데이트', STORY: '이야기' };
const FEEDBACK_TYPE_TONES = { BUG: 'pink', FEATURE: 'yellow', QUESTION: 'blue', CHEER: 'mint' };
// 답장을 기다리는 피드백이 가장 눈에 띄어야 한다.
const FEEDBACK_STATUS_TONES = { WAITING: 'primary', IN_PROGRESS: 'blue', REPLIED: 'gray' };
const LETTER_CATEGORY_TONES = { REPLY: 'yellow', UPDATE: 'sky', STORY: 'purple' };
let feedbacks = [];
let feedbackSelectedId = '';
let feedbackMode = 'reply';
let feedbackHasLoaded = false;
let feedbackIsLoading = false;
let feedbackIsPublishing = false;
let feedbackDrafts = [];
let feedbackCurrentDraftId = '';
let feedbackIsUploading = false;
// 기본은 답장이 필요한 것만 본다.
let feedbackFilter = 'WAITING';
let feedbackQuery = '';
let feedbackIsChangingStatus = false;
// 발행이 실패해 다시 시도할 때 같은 값을 보내야 편지가 두 번 만들어지지 않는다.
let feedbackPublishRequestId = '';
// 이 키로 보낸 요청 중 결과를 모르고 끝난 것이 있었는지. 있었다면 서버에 이 키의 편지가 이미 저장됐을 수 있어서,
// 뒤이은 재시도가 4xx(로그인 만료 등)로 거절돼도 키를 버리지 않는다. 버리면 새 키로 한 번 더 발행된다.
let feedbackPublishOutcomeUnknown = false;

function discardFeedbackPublishRequest() {
  feedbackPublishRequestId = '';
  feedbackPublishOutcomeUnknown = false;
}
const PUBLISH_OUTCOME_UNKNOWN_HINT = ' 발행됐는지 확인하지 못했어요. 같은 내용으로 다시 발행하면 결과를 확인할 수 있어요.'
  + ' 그동안 내용은 고칠 수 없어요. 고치려면 보낸 편지에서 발행 여부를 먼저 확인하고 선택을 해제하세요.';

function clearFeedbackBanner() {
  const banner = document.getElementById('feedbackBanner');
  banner.textContent = '';
  banner.className = 'banner hidden';
}

function setFeedbackBanner(message, type) {
  const banner = document.getElementById('feedbackBanner');
  banner.textContent = message;
  banner.className = 'banner ' + (type || 'warn');
  banner.classList.remove('hidden');
}

function formatFeedbackDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
}

function loadFeedbackIfVisible() {
  if (feedbackHasLoaded || feedbackIsLoading) return;
  reloadFeedbackList();
}

function updateFeedbackNavBadge(count) {
  const badge = document.getElementById('feedbackNavBadge');
  badge.textContent = String(count);
  badge.classList.toggle('hidden', !count);
}

async function reloadFeedbackList() {
  if (feedbackIsLoading) return;
  feedbackIsLoading = true;
  document.getElementById('feedbackListLoading').classList.remove('hidden');
  updateFeedbackEditorState();
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback', { headers: headers() });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      setFeedbackBanner(data.message || '피드백 목록 조회 실패 (HTTP ' + res.status + ')', res.status === 403 ? 'warn' : 'error');
      feedbacks = [];
      updateFeedbackNavBadge(0);
    } else {
      clearFeedbackBanner();
      feedbacks = data.data?.feedbacks || [];
      updateFeedbackNavBadge(data.data?.unansweredCount || 0);
    }
    feedbackHasLoaded = true;
  } catch (e) {
    setFeedbackBanner(e.message || '피드백 목록 조회 실패', 'error');
    feedbacks = [];
  } finally {
    feedbackIsLoading = false;
    document.getElementById('feedbackListLoading').classList.add('hidden');
    renderFeedbackList();
  }
}

function getVisibleFeedbacks() {
  const query = feedbackQuery.trim().toLowerCase();
  return feedbacks.filter((feedback) => {
    if (feedbackFilter !== 'ALL' && feedback.status !== feedbackFilter) return false;
    if (!query) return true;
    return (feedback.content || '').toLowerCase().includes(query)
      || (feedback.sender || '').toLowerCase().includes(query);
  });
}

function renderFeedbackFilterCounts() {
  const counts = { ALL: feedbacks.length, WAITING: 0, IN_PROGRESS: 0, REPLIED: 0 };
  feedbacks.forEach((feedback) => { counts[feedback.status] = (counts[feedback.status] || 0) + 1; });
  document.querySelectorAll('#feedbackFilterTabs [data-count]').forEach((el) => {
    el.textContent = feedbackHasLoaded ? String(counts[el.dataset.count] || 0) : '';
  });
}

function renderFeedbackList() {
  const tbody = document.querySelector('#feedbackList tbody');
  tbody.innerHTML = '';
  renderFeedbackFilterCounts();
  const visible = getVisibleFeedbacks();
  if (!visible.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'table-empty';
    if (!feedbackHasLoaded) td.textContent = '불러오는 중...';
    else if (feedbackQuery.trim()) td.textContent = '검색 결과가 없어요.';
    else if (feedbackFilter === 'WAITING') td.textContent = '답장할 피드백이 없어요.';
    else td.textContent = '피드백이 없어요.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    updateFeedbackEditorState();
    return;
  }

  visible.forEach((feedback) => {
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', (FEEDBACK_TYPE_LABELS[feedback.type] || feedback.type) + ' 피드백 답장 선택');
    const isSelected = feedback.id === feedbackSelectedId;
    tr.classList.toggle('is-selected', isSelected);
    tr.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    tr.appendChild(document.createElement('td')).appendChild(
      createTag(FEEDBACK_TYPE_LABELS[feedback.type] || feedback.type || '-', FEEDBACK_TYPE_TONES[feedback.type]));
    // 내용이 가장 넓게 보이도록 보낸 사람은 내용 아래 작은 줄로 둔다.
    const contentCell = tr.appendChild(document.createElement('td'));
    contentCell.className = 'feedback-content-cell';
    contentCell.title = feedback.content || '';
    const contentText = contentCell.appendChild(document.createElement('span'));
    contentText.className = 'cell-main';
    contentText.textContent = feedback.content || '';
    const senderText = contentCell.appendChild(document.createElement('span'));
    senderText.className = 'cell-sub';
    senderText.textContent = feedback.sender || '-';
    const timeCell = tr.appendChild(document.createElement('td'));
    timeCell.textContent = formatRelativeTime(feedback.createdAt);
    timeCell.title = formatDateTime(feedback.createdAt);
    tr.appendChild(document.createElement('td')).appendChild(
      createTag(FEEDBACK_STATUS_LABELS[feedback.status] || feedback.status || '-', FEEDBACK_STATUS_TONES[feedback.status]));
    const selectCurrentFeedback = () => selectFeedback(feedback.id);
    tr.onclick = selectCurrentFeedback;
    tr.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCurrentFeedback();
      }
    };
    tbody.appendChild(tr);
  });
  updateFeedbackEditorState();
}

function getSelectedFeedback() {
  return feedbacks.find((feedback) => feedback.id === feedbackSelectedId) || null;
}

function generateFeedbackRequestId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return 'letter-' + Math.random().toString(36).slice(2) + '-' + performance.now().toString(36);
}

function renderFeedbackQuoteImages(images) {
  const wrap = document.getElementById('feedbackQuoteImages');
  wrap.innerHTML = '';
  wrap.classList.toggle('hidden', !images.length);
  images.forEach((rawUrl, index) => {
    // 학생이 올린 값이라 관리자 화면에서 링크로 쓰기 전에 스킴을 한 번 더 거른다.
    const imageUrl = toSafeHttpUrl(rawUrl);
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '첨부 사진 ' + (index + 1);
    link.appendChild(img);
    wrap.appendChild(link);
  });
}

function showFeedbackEditorTab(tab) {
  const isPreview = tab === 'preview';
  setSegmentedTab('feedbackEditorTabs', tab);
  document.getElementById('feedbackWritePane').classList.toggle('hidden', isPreview);
  document.getElementById('feedbackPreviewPane').classList.toggle('hidden', !isPreview);
  if (!isPreview) return;
  const isLetterMode = feedbackMode === 'letter';
  const selected = getSelectedFeedback();
  const pane = document.getElementById('feedbackPreviewPane');
  pane.innerHTML = '';
  pane.appendChild(buildLetterPreview({
    category: isLetterMode ? document.getElementById('feedbackLetterCategory').value : 'REPLY',
    title: document.getElementById('feedbackReplyTitle').value.trim(),
    body: document.getElementById('feedbackReplyBody').value,
    createdAt: null
  }, isLetterMode ? null : selected));
}

function isFeedbackComposeDirty() {
  return !!(document.getElementById('feedbackReplyTitle').value.trim()
    || document.getElementById('feedbackReplyBody').value.trim());
}

async function confirmDiscardFeedbackCompose() {
  if (!isFeedbackComposeDirty()) return true;
  return confirmDialog({ title: '작성 중인 내용이 있어요', message: '넘어가면 쓰던 내용이 사라져요. 전체 편지라면 먼저 임시저장하세요.', confirmLabel: '버리기', danger: true });
}

async function selectFeedback(feedbackId) {
  // 발행 중에 대상을 바꾸면 키가 비워져 입력 잠금이 풀리고, 응답이 성공하면 새로 쓰던 내용까지 지워진다.
  if (feedbackIsPublishing) return;
  if (feedbackMode === 'reply' && feedbackId === feedbackSelectedId) return;
  if (!(await confirmDiscardFeedbackCompose())) return;
  document.getElementById('feedbackReplyTitle').value = '';
  document.getElementById('feedbackReplyBody').value = '';
  document.getElementById('feedbackSendPush').checked = false;
  showFeedbackEditorTab('write');
  feedbackMode = 'reply';
  feedbackSelectedId = feedbackId;
  // 다른 피드백에 이전 키를 보내면 서버가 409(904-14)로 거절한다.
  discardFeedbackPublishRequest();
  document.getElementById('feedbackSaveResult').classList.add('hidden');
  renderFeedbackList();
  revealOnNarrowScreen('feedbackEditorTitle');
}

async function enterFeedbackLetterMode() {
  if (feedbackMode === 'letter') return;
  if (!(await confirmDiscardFeedbackCompose())) return;
  showFeedbackEditorTab('write');
  feedbackMode = 'letter';
  feedbackSelectedId = '';
  feedbackCurrentDraftId = '';
  discardFeedbackPublishRequest();
  // 초안을 불러온 뒤 새 편지로 넘어오면 이전 분류·푸시 설정이 남는다.
  document.getElementById('feedbackLetterCategory').value = 'UPDATE';
  document.getElementById('feedbackSendPush').checked = false;
  document.getElementById('feedbackReplyTitle').value = '';
  document.getElementById('feedbackReplyBody').value = '';
  document.getElementById('feedbackSaveResult').classList.add('hidden');
  renderFeedbackList();
  reloadFeedbackDrafts();
}

async function clearFeedbackSelection() {
  if (feedbackIsPublishing) return;
  if (!(await confirmDiscardFeedbackCompose())) return;
  showFeedbackEditorTab('write');
  feedbackMode = 'reply';
  feedbackSelectedId = '';
  feedbackCurrentDraftId = '';
  discardFeedbackPublishRequest();
  document.getElementById('feedbackSendPush').checked = false;
  document.getElementById('feedbackReplyTitle').value = '';
  document.getElementById('feedbackReplyBody').value = '';
  document.getElementById('feedbackSaveResult').classList.add('hidden');
  renderFeedbackList();
}

async function reloadFeedbackDrafts() {
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/letters/drafts', { headers: headers() });
    const data = await readJsonOrEmpty(res);
    feedbackDrafts = res.ok ? (data.data?.drafts || []) : [];
  } catch (e) {
    feedbackDrafts = [];
  }
  renderFeedbackDraftOptions();
}

function renderFeedbackDraftOptions() {
  const select = document.getElementById('feedbackDraftSelect');
  select.innerHTML = '';
  if (!feedbackDrafts.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = '임시저장한 편지 없음';
    select.appendChild(option);
  } else {
    feedbackDrafts.forEach((draft) => {
      const option = document.createElement('option');
      option.value = draft.id;
      option.textContent = (draft.title || '(제목 없음)') + ' · ' + formatFeedbackDate(draft.updatedAt);
      select.appendChild(option);
    });
  }
  if (feedbackCurrentDraftId) {
    select.value = feedbackCurrentDraftId;
  }
  updateFeedbackEditorState();
}

function loadSelectedFeedbackDraft() {
  const draftId = document.getElementById('feedbackDraftSelect').value;
  const draft = feedbackDrafts.find((it) => it.id === draftId);
  if (!draft) return;

  feedbackCurrentDraftId = draft.id;
  document.getElementById('feedbackLetterCategory').value = draft.category || 'UPDATE';
  document.getElementById('feedbackReplyTitle').value = draft.title || '';
  document.getElementById('feedbackReplyBody').value = draft.body || '';
  document.getElementById('feedbackSendPush').checked = !!draft.sendPush;
  setMessageBox('feedbackSaveResult', true, '임시저장한 편지를 불러왔습니다.');
  updateFeedbackEditorState();
}

async function saveFeedbackDraft() {
  const payload = {
    category: document.getElementById('feedbackLetterCategory').value,
    title: document.getElementById('feedbackReplyTitle').value,
    body: document.getElementById('feedbackReplyBody').value,
    sendPush: document.getElementById('feedbackSendPush').checked
  };
  const isUpdate = !!feedbackCurrentDraftId;
  const url = API_BASE + '/api/admin/feedback/letters/drafts'
    + (isUpdate ? '/' + encodeURIComponent(feedbackCurrentDraftId) : '');

  try {
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      setMessageBox('feedbackSaveResult', false, data.message || '임시저장 실패 (HTTP ' + res.status + ')');
      return;
    }
    feedbackCurrentDraftId = data.data?.id || feedbackCurrentDraftId;
    setMessageBox('feedbackSaveResult', true, getApiSuccessMessage(data, '임시저장되었습니다.'));
    await reloadFeedbackDrafts();
  } catch (e) {
    setMessageBox('feedbackSaveResult', false, e.message || '임시저장 실패');
  }
}

async function deleteSelectedFeedbackDraft() {
  const draftId = document.getElementById('feedbackDraftSelect').value;
  if (!draftId) return;

  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/letters/drafts/' + encodeURIComponent(draftId), {
      method: 'DELETE',
      headers: headers()
    });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      setMessageBox('feedbackSaveResult', false, data.message || '초안 삭제 실패 (HTTP ' + res.status + ')');
      return;
    }
    if (feedbackCurrentDraftId === draftId) {
      feedbackCurrentDraftId = '';
    }
    setMessageBox('feedbackSaveResult', true, getApiSuccessMessage(data, '초안이 삭제되었습니다.'));
    await reloadFeedbackDrafts();
  } catch (e) {
    setMessageBox('feedbackSaveResult', false, e.message || '초안 삭제 실패');
  }
}

async function uploadFeedbackLetterImage(file) {
  feedbackIsUploading = true;
  updateFeedbackEditorState();
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(API_BASE + '/api/admin/feedback/letters/images', {
      method: 'POST',
      headers: buildBannerUploadHeaders(),
      body: formData
    });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      setMessageBox('feedbackSaveResult', false, data.message || '이미지 업로드 실패 (HTTP ' + res.status + ')');
      return;
    }
    const bodyInput = document.getElementById('feedbackReplyBody');
    const markdown = '![' + (file.name || '이미지') + '](' + data.data.imageUrl + ')';
    bodyInput.value = bodyInput.value.replace(/\s*$/, '') + '\n\n' + markdown + '\n';
    setMessageBox('feedbackSaveResult', true, '이미지를 본문에 삽입했습니다.');
  } catch (e) {
    setMessageBox('feedbackSaveResult', false, e.message || '이미지 업로드 실패');
  } finally {
    feedbackIsUploading = false;
    updateFeedbackEditorState();
  }
}

function updateFeedbackEditorState() {
  const isLetterMode = feedbackMode === 'letter';
  const selected = getSelectedFeedback();
  const busy = feedbackIsLoading || feedbackIsPublishing || feedbackIsUploading;
  const alreadyReplied = !!selected && selected.status === 'REPLIED';

  document.getElementById('feedbackEditorTitle').textContent = isLetterMode ? '새 편지 발행' : '답장 작성';
  document.getElementById('feedbackLetterCategoryRow').classList.toggle('hidden', !isLetterMode);
  document.getElementById('feedbackDraftRow').classList.toggle('hidden', !isLetterMode);
  document.getElementById('feedbackImageUploadRow').classList.toggle('hidden', !isLetterMode);
  document.getElementById('btnSaveFeedbackDraft').classList.toggle('hidden', !isLetterMode);
  document.getElementById('feedbackSendPushLabel').textContent = isLetterMode
    ? '발행 시 전체 유저에게 푸시 알림 보내기'
    : '발행하면 이 유저에게 푸시 알림 보내기';

  const quote = document.getElementById('feedbackQuote');
  if (isLetterMode || !selected) {
    quote.classList.add('hidden');
    quote.textContent = '';
  } else {
    quote.classList.remove('hidden');
    quote.textContent = [
      FEEDBACK_TYPE_LABELS[selected.type] || selected.type,
      selected.sender,
      formatFeedbackDate(selected.createdAt)
    ].join(' · ') + '\n\n' + (selected.content || '');
  }
  renderFeedbackQuoteImages(isLetterMode ? [] : (selected?.images || []));

  const quoteActions = document.getElementById('feedbackQuoteActions');
  quoteActions.classList.toggle('hidden', isLetterMode || !selected);
  if (!isLetterMode && selected) {
    const btnStatus = document.getElementById('btnToggleFeedbackStatus');
    btnStatus.classList.toggle('hidden', alreadyReplied);
    btnStatus.disabled = busy || feedbackIsChangingStatus;
    btnStatus.textContent = selected.status === 'IN_PROGRESS' ? '답장 대기로 되돌리기' : '확인 중으로 표시';
    document.getElementById('btnViewFeedbackReply').classList.toggle('hidden', !alreadyReplied);
  }

  const summary = document.getElementById('feedbackSelectionSummary');
  if (isLetterMode) {
    summary.textContent = feedbackCurrentDraftId
      ? '임시저장한 편지를 이어서 작성 중입니다. 발행하면 초안은 삭제됩니다.'
      : 'UPDATE / STORY 편지를 전체 사용자에게 발행합니다.';
  } else if (!selected) {
    summary.textContent = '목록에서 피드백을 고르세요.';
  } else if (alreadyReplied) {
    summary.textContent = '이미 답장한 피드백이에요. 발행하면 답장이 한 통 더 가요.';
  } else {
    summary.textContent = selected.sender + '에게 답장';
  }

  const btnPublish = document.getElementById('btnPublishFeedbackReply');
  btnPublish.textContent = isLetterMode ? '편지 발행' : '답장 발행';
  btnPublish.disabled = busy || (!isLetterMode && !selected);
  document.getElementById('btnLoadFeedback').disabled = busy;
  document.getElementById('btnNewFeedbackLetter').disabled = busy;
  document.getElementById('btnClearFeedbackSelection').disabled = busy;
  document.getElementById('btnSaveFeedbackDraft').disabled = busy;
  // 발행 키가 남아 있으면 그 요청의 결과를 아직 모른다. 같은 키로 다시 보내면 서버는 처음 요청의 편지를
  // 돌려주므로, 그 사이 고친 내용은 발행되지 않은 채 성공 처리로 지워진다. 결과가 정해질 때까지 입력을 잠근다.
  const publishPending = !!feedbackPublishRequestId;
  document.getElementById('feedbackReplyTitle').readOnly = publishPending;
  document.getElementById('feedbackReplyBody').readOnly = publishPending;
  document.getElementById('feedbackSendPush').disabled = publishPending;
  document.getElementById('feedbackLetterCategory').disabled = publishPending;
  document.getElementById('btnUploadFeedbackImage').disabled = busy || publishPending;

  const hasDrafts = feedbackDrafts.length > 0;
  document.getElementById('feedbackDraftSelect').disabled = busy || !hasDrafts || publishPending;
  document.getElementById('btnLoadFeedbackDraft').disabled = busy || !hasDrafts || publishPending;
  document.getElementById('btnDeleteFeedbackDraft').disabled = busy || !hasDrafts;
}

async function publishFeedbackLetter() {
  const isLetterMode = feedbackMode === 'letter';
  const title = document.getElementById('feedbackReplyTitle').value.trim();
  const body = document.getElementById('feedbackReplyBody').value.trim();
  if (!title || !body) {
    setMessageBox('feedbackSaveResult', false, '제목과 본문을 모두 입력하세요.');
    return;
  }

  const url = isLetterMode
    ? API_BASE + '/api/admin/feedback/letters'
    : API_BASE + '/api/admin/feedback/' + encodeURIComponent(feedbackSelectedId) + '/reply';
  const sendPush = document.getElementById('feedbackSendPush').checked;
  const selected = getSelectedFeedback();
  const target = isLetterMode ? '모든 사용자' : (selected?.sender || '이 사용자');
  const replyTitle = selected?.status === 'REPLIED' ? '답장을 한 통 더 보낼까요?' : '답장을 보낼까요?';
  const confirmed = await confirmDialog({
    title: isLetterMode ? '모든 사용자에게 편지를 보낼까요?' : replyTitle,
    message: '보낸 뒤에는 보낸 편지에서 제목·본문만 고칠 수 있어요.',
    details: [['받는 사람', target], ['제목', title], ['푸시', sendPush ? '보냄' : '안 보냄']],
    confirmLabel: '보내기',
    danger: isLetterMode && sendPush
  });
  if (!confirmed) return;
  if (!feedbackPublishRequestId) {
    feedbackPublishRequestId = generateFeedbackRequestId();
  }
  const payload = isLetterMode
    ? {
        category: document.getElementById('feedbackLetterCategory').value,
        title,
        body,
        sendPush,
        requestId: feedbackPublishRequestId
      }
    : {
        title,
        body,
        sendPush,
        requestId: feedbackPublishRequestId,
        lastReplyLetterId: selected?.replyLetterId || null
      };

  let nextFeedbackIdToOpen = '';
  feedbackIsPublishing = true;
  updateFeedbackEditorState();
  try {
    const res = await fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      const message = data.message || '발행 실패 (HTTP ' + res.status + ')';
      // 5xx와 정체를 모르는 409(동시 요청 충돌)는 서버에서 편지가 저장됐을 수도 있다. 키를 남겨 같은
      // 내용으로 다시 보내게 한다. 나머지 4xx는 서버가 확실히 거절한 요청이라 키를 버리고 잠금을 푼다.
      const outcomeUnknown = res.status >= 500
        || (res.status === 409 && data.statuscode !== '904-14' && data.statuscode !== '904-15');
      if (outcomeUnknown) feedbackPublishOutcomeUnknown = true;
      // 그 사이 다른 답장이 나갔다. 목록을 다시 받아 최신 답장을 보고 다시 판단하게 한다.
      if (data.statuscode === '904-15') {
        await reloadFeedbackList();
      }
      if (feedbackPublishOutcomeUnknown) {
        setMessageBox('feedbackSaveResult', false, message + PUBLISH_OUTCOME_UNKNOWN_HINT);
        return;
      }
      setMessageBox('feedbackSaveResult', false, message);
      discardFeedbackPublishRequest();
      return;
    }
    setMessageBox('feedbackSaveResult', true, getApiSuccessMessage(data, isLetterMode ? '편지가 발행되었습니다.' : '답장이 발행되었습니다.'));
    if (sendPush && data.data && data.data.pushSent === false) {
      showToast((isLetterMode ? '편지는' : '답장은') + ' 발행됐지만 푸시는 전송되지 않았습니다.', 'error');
    } else if (isLetterMode && sendPush && data.data) {
      showToast('푸시 ' + (data.data.pushSuccessCount || 0) + '건 발송됨');
    }
    if (isLetterMode && feedbackCurrentDraftId) {
      await discardFeedbackDraftAfterPublish(feedbackCurrentDraftId);
    }
    document.getElementById('feedbackReplyTitle').value = '';
    document.getElementById('feedbackReplyBody').value = '';
    feedbackSelectedId = '';
    feedbackCurrentDraftId = '';
    discardFeedbackPublishRequest();
    feedbackMode = 'reply';
    showFeedbackEditorTab('write');
    await reloadFeedbackList();
    // 답장을 보냈으면 다음 대기 피드백을 바로 연다. selectFeedback은 발행 중에 막히므로 발행 상태를 끈 뒤에 연다.
    if (!isLetterMode) {
      const next = getVisibleFeedbacks().find((feedback) => feedback.status === 'WAITING');
      if (next) nextFeedbackIdToOpen = next.id;
    }
    // 보낸 편지 화면을 한 번이라도 열었다면 방금 발행한 편지가 보이게 다시 불러온다.
    if (sentLettersHaveLoaded) await reloadSentLetters();
  } catch (e) {
    // 응답을 받지 못했으니 서버에서 저장됐는지 알 수 없다. 키를 남긴다.
    feedbackPublishOutcomeUnknown = true;
    setMessageBox('feedbackSaveResult', false, (e.message || '발행 실패') + PUBLISH_OUTCOME_UNKNOWN_HINT);
  } finally {
    feedbackIsPublishing = false;
    updateFeedbackEditorState();
  }
  if (nextFeedbackIdToOpen) await selectFeedback(nextFeedbackIdToOpen);
}

/**
 * 발행된 편지의 초안이 남으면 운영자가 같은 편지를 또 발행할 수 있다.
 * 삭제 실패는 발행 자체를 되돌리지 않으므로 안내만 한다.
 */
async function discardFeedbackDraftAfterPublish(draftId) {
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/letters/drafts/' + encodeURIComponent(draftId), {
      method: 'DELETE',
      headers: headers()
    });
    if (!res.ok) {
      showToast('편지는 발행됐지만 초안이 남아 있습니다. 목록에서 삭제해주세요.', 'error');
    }
  } catch (e) {
    showToast('편지는 발행됐지만 초안이 남아 있습니다. 목록에서 삭제해주세요.', 'error');
  }
  await reloadFeedbackDrafts();
}

document.getElementById('btnLoadFeedback').onclick = () => reloadFeedbackList();
bindSegmentedTabs('feedbackEditorTabs', showFeedbackEditorTab);
document.getElementById('btnNewFeedbackLetter').onclick = () => enterFeedbackLetterMode();
document.getElementById('btnClearFeedbackSelection').onclick = () => clearFeedbackSelection();
document.getElementById('btnPublishFeedbackReply').onclick = () => publishFeedbackLetter();
document.getElementById('btnSaveFeedbackDraft').onclick = () => saveFeedbackDraft();
document.getElementById('btnLoadFeedbackDraft').onclick = () => loadSelectedFeedbackDraft();
document.getElementById('btnDeleteFeedbackDraft').onclick = () => deleteSelectedFeedbackDraft();
document.getElementById('btnUploadFeedbackImage').onclick = () => document.getElementById('feedbackImageFile').click();
document.getElementById('feedbackImageFile').onchange = (event) => {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (file) uploadFeedbackLetterImage(file);
};

async function toggleSelectedFeedbackStatus() {
  const selected = getSelectedFeedback();
  if (!selected || selected.status === 'REPLIED') return;
  const nextStatus = selected.status === 'IN_PROGRESS' ? 'WAITING' : 'IN_PROGRESS';
  feedbackIsChangingStatus = true;
  updateFeedbackEditorState();
  try {
    const res = await fetch(API_BASE + '/api/admin/feedback/' + encodeURIComponent(selected.id) + '/status', {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status: nextStatus })
    });
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      showToast(data.message || '상태 변경 실패 (HTTP ' + res.status + ')', 'error');
      return;
    }
    selected.status = nextStatus;
    showToast(nextStatus === 'IN_PROGRESS' ? '확인 중으로 표시했어요' : '답장 대기로 되돌렸어요');
    renderFeedbackList();
  } catch (e) {
    showToast(e.message || '상태 변경 실패', 'error');
  } finally {
    feedbackIsChangingStatus = false;
    updateFeedbackEditorState();
  }
}

// 답장이 여러 통이어도 피드백 응답의 replyLetterId가 가장 최근 답장을 가리킨다.
async function openFeedbackReplyLetter() {
  const selected = getSelectedFeedback();
  if (!selected || !selected.replyLetterId) return;
  const findReply = () => sentLetters.find((it) => it.id === selected.replyLetterId);
  if (!sentLettersHaveLoaded) await reloadSentLetters();
  // 보낸 편지 목록을 연 뒤에 다른 운영자가 답장했으면 목록에 아직 없다.
  let letter = findReply();
  if (!letter) {
    await reloadSentLetters();
    letter = findReply();
  }
  if (!letter) {
    showToast('보낸 편지에서 이 답장을 찾지 못했어요.', 'error');
    return;
  }
  window.location.hash = '#letters';
  selectSentLetter(letter.id);
}

bindSegmentedTabs('feedbackFilterTabs', (tab) => {
  feedbackFilter = tab;
  renderFeedbackList();
});
document.getElementById('feedbackSearch').addEventListener('input', (event) => {
  feedbackQuery = event.target.value;
  renderFeedbackList();
});
document.getElementById('btnToggleFeedbackStatus').onclick = toggleSelectedFeedbackStatus;
document.getElementById('btnViewFeedbackReply').onclick = openFeedbackReplyLetter;
// 본문에서 Ctrl/⌘ + Enter로 바로 보내기(확인 모달은 그대로 뜬다)
document.getElementById('feedbackReplyBody').addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    const btn = document.getElementById('btnPublishFeedbackReply');
    if (!btn.disabled) publishFeedbackLetter();
  }
});
