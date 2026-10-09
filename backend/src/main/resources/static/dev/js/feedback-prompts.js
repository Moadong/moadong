// 행동 직후 피드백 문항을 관리하는 개발자 포털 화면

let feedbackPrompts = [];
let feedbackPromptSelectedId = '';
let feedbackPromptsHasLoaded = false;
let feedbackPromptsIsLoading = false;

function renderFeedbackPromptList() {
  const tbody = document.querySelector('#feedbackPromptList tbody');
  tbody.replaceChildren();
  if (!feedbackPrompts.length) {
    const row = tbody.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 5;
    cell.textContent = '등록된 프롬프트가 없습니다.';
    return;
  }
  feedbackPrompts.forEach((prompt) => {
    const row = tbody.insertRow();
    row.classList.toggle('is-selected', prompt.id === feedbackPromptSelectedId);
    row.style.cursor = 'pointer';
    row.onclick = () => selectFeedbackPrompt(prompt.id);
    [prompt.triggerType, prompt.audience, prompt.title, String(prompt.displayOrder ?? 0), prompt.active ? '활성' : '비활성']
      .forEach((value) => { row.insertCell().textContent = value || ''; });
  });
}

function editablePrompt(prompt) {
  return {
    triggerType: prompt.triggerType,
    audience: prompt.audience,
    title: prompt.title,
    description: prompt.description,
    ratingOptions: prompt.ratingOptions || [],
    followUp: prompt.followUp,
    exposurePolicy: prompt.exposurePolicy,
    displayOrder: prompt.displayOrder || 1,
    active: Boolean(prompt.active),
  };
}

async function loadFeedbackPrompts() {
  const button = document.getElementById('btnLoadFeedbackPrompts');
  feedbackPromptsIsLoading = true;
  button.disabled = true;
  try {
    const response = await fetch(API_BASE + '/api/admin/feedback-prompts', { headers: headers() });
    const body = await readJsonOrEmpty(response);
    if (!response.ok) throw new Error(body.message || '프롬프트 목록을 불러오지 못했습니다.');
    feedbackPrompts = body.data?.prompts || [];
    feedbackPromptsHasLoaded = true;
    renderFeedbackPromptList();
  } catch (error) {
    setMessageBox('feedbackPromptResult', false, error.message || '프롬프트 목록 조회 실패');
  } finally {
    feedbackPromptsIsLoading = false;
    button.disabled = false;
  }
}

function loadFeedbackPromptsIfVisible() {
  if (!feedbackPromptsHasLoaded && !feedbackPromptsIsLoading) void loadFeedbackPrompts();
}

async function selectFeedbackPrompt(id) {
  try {
    const response = await fetch(API_BASE + '/api/admin/feedback-prompts/' + encodeURIComponent(id), { headers: headers() });
    const body = await readJsonOrEmpty(response);
    if (!response.ok) throw new Error(body.message || '프롬프트를 불러오지 못했습니다.');
    feedbackPromptSelectedId = id;
    document.getElementById('feedbackPromptJson').value = JSON.stringify(editablePrompt(body.data?.prompt || body.data), null, 2);
    renderFeedbackPromptList();
  } catch (error) {
    setMessageBox('feedbackPromptResult', false, error.message || '프롬프트 조회 실패');
  }
}

function newFeedbackPrompt() {
  feedbackPromptSelectedId = '';
  document.getElementById('feedbackPromptJson').value = JSON.stringify({
    triggerType: 'ADMIN_CLUB_INFO_UPDATED', audience: 'ADMIN', title: '', description: '',
    ratingOptions: [{ rating: 'POSITIVE', label: '좋아요', displayOrder: 1, requiresFollowUp: false }],
    followUp: null,
    exposurePolicy: { answeredCooldownDays: 30, dismissedCooldownDays: 7, shownCooldownHours: 24, oncePerClub: false, dailyExposureLimit: 0 },
    displayOrder: 1, active: false,
  }, null, 2);
  renderFeedbackPromptList();
}

function parseFeedbackPrompt() {
  const value = document.getElementById('feedbackPromptJson').value.trim();
  if (!value) throw new Error('프롬프트 JSON을 입력하세요.');
  return JSON.parse(value);
}

async function saveFeedbackPrompt() {
  const button = document.getElementById('btnSaveFeedbackPrompt');
  let payload;
  try { payload = parseFeedbackPrompt(); } catch (error) { setMessageBox('feedbackPromptResult', false, error.message || 'JSON 형식이 올바르지 않습니다.'); return; }
  button.disabled = true;
  try {
    const url = feedbackPromptSelectedId
      ? API_BASE + '/api/admin/feedback-prompts/' + encodeURIComponent(feedbackPromptSelectedId)
      : API_BASE + '/api/admin/feedback-prompts';
    const response = await fetch(url, { method: feedbackPromptSelectedId ? 'PUT' : 'POST', headers: headers(), body: JSON.stringify(payload) });
    const body = await readJsonOrEmpty(response);
    if (!response.ok) throw new Error(body.message || '프롬프트를 저장하지 못했습니다.');
    feedbackPromptSelectedId = body.data?.id || feedbackPromptSelectedId;
    feedbackPromptsHasLoaded = false;
    setMessageBox('feedbackPromptResult', true, body.message || '프롬프트가 저장되었습니다.');
    await loadFeedbackPrompts();
  } catch (error) {
    setMessageBox('feedbackPromptResult', false, error.message || '프롬프트 저장 실패');
  } finally { button.disabled = false; }
}

document.getElementById('btnLoadFeedbackPrompts').onclick = () => { feedbackPromptsHasLoaded = false; void loadFeedbackPrompts(); };
document.getElementById('btnNewFeedbackPrompt').onclick = newFeedbackPrompt;
document.getElementById('btnSaveFeedbackPrompt').onclick = () => void saveFeedbackPrompt();
document.getElementById('btnFormatFeedbackPromptJson').onclick = () => {
  try { document.getElementById('feedbackPromptJson').value = JSON.stringify(parseFeedbackPrompt(), null, 2); }
  catch (error) { setMessageBox('feedbackPromptResult', false, error.message || 'JSON 형식이 올바르지 않습니다.'); }
};
document.getElementById('btnClearFeedbackPromptSelection').onclick = () => {
  feedbackPromptSelectedId = '';
  document.getElementById('feedbackPromptJson').value = '';
  renderFeedbackPromptList();
};
