// FCM 토큰 조회와 단건·전체·예약 푸시 발송

const FCM_PAGE_SIZE = 20;

let fcmTokens = [];
let fcmFilteredTokens = [];
let fcmCurrentPage = 1;
let fcmSchedules = [];
let fcmScheduleIsLoading = false;
let fcmScheduleIsCreating = false;
let fcmScheduleCancelingIds = new Set();

function parseFcmDataMap(raw, fieldName) {
  const text = (raw || '').trim();
  if (!text) return {};
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_) {
    throw new Error(fieldName + '는 JSON 객체 형식이어야 합니다.');
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error(fieldName + '는 JSON 객체 형식이어야 합니다.');
  }
  const mapped = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (!String(key).trim()) {
      throw new Error(fieldName + ' key는 비어 있을 수 없어요.');
    }
    if (value !== null && typeof value === 'object') {
      throw new Error(fieldName + ' 값은 문자열/숫자/불리언만 허용됩니다.');
    }
    mapped[String(key)] = value == null ? '' : String(value);
  }
  return mapped;
}

function renderFcmTokenRows(tokens, page) {
  const tbody = document.querySelector('#fcmTokenList tbody');
  tbody.innerHTML = '';
  if (!tokens.length) {
    tbody.innerHTML = '<tr><td colspan="3">조회된 토큰이 없습니다.</td></tr>';
    return;
  }
  const start = (page - 1) * FCM_PAGE_SIZE;
  const slice = tokens.slice(start, start + FCM_PAGE_SIZE);
  slice.forEach((token, idx) => {
    const tr = document.createElement('tr');
    tr.appendChild(document.createElement('td')).textContent = String(start + idx + 1);
    const tokenCell = document.createElement('td');
    tokenCell.className = 'token-cell';
    tokenCell.title = token;
    tokenCell.textContent = truncateMiddle(token, 20, 16);
    tokenCell.onclick = () => {
      navigator.clipboard.writeText(token);
      showToast('토큰 복사됨', 'success');
    };
    tr.appendChild(tokenCell);
    const btnCell = document.createElement('td');
    btnCell.className = 'btn-cell';
    const pickBtn = document.createElement('button');
    pickBtn.type = 'button';
    pickBtn.textContent = '선택';
    pickBtn.onclick = () => {
      document.getElementById('fcmSingleToken').value = token;
      document.getElementById('fcmScheduleToken').value = token;
      showToast('단건 발송 대상 토큰으로 선택됨', 'success');
    };
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = '복사';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(token);
      showToast('토큰 복사됨', 'success');
    };
    btnCell.appendChild(pickBtn);
    btnCell.appendChild(copyBtn);
    tr.appendChild(btnCell);
    tbody.appendChild(tr);
  });
}

function renderFcmTokenPagination(total) {
  const wrap = document.getElementById('fcmTokenPagination');
  if (total <= FCM_PAGE_SIZE) {
    wrap.classList.add('hidden');
    wrap.innerHTML = '';
    return;
  }
  wrap.classList.remove('hidden');
  const totalPages = Math.ceil(total / FCM_PAGE_SIZE);
  let html = '<span>총 ' + total + '개</span>';
  if (fcmCurrentPage > 1) html += '<button type="button" id="fcmPrev">이전</button>';
  html += '<span> ' + fcmCurrentPage + ' / ' + totalPages + ' </span>';
  if (fcmCurrentPage < totalPages) html += '<button type="button" id="fcmNext">다음</button>';
  wrap.innerHTML = html;
  const prev = document.getElementById('fcmPrev');
  const next = document.getElementById('fcmNext');
  if (prev) prev.onclick = () => {
    fcmCurrentPage--;
    renderFcmTokenRows(fcmFilteredTokens, fcmCurrentPage);
    renderFcmTokenPagination(fcmFilteredTokens.length);
  };
  if (next) next.onclick = () => {
    fcmCurrentPage++;
    renderFcmTokenRows(fcmFilteredTokens, fcmCurrentPage);
    renderFcmTokenPagination(fcmFilteredTokens.length);
  };
}

function updateFcmTokenSummary() {
  const summary = document.getElementById('fcmTokenSummary');
  const keyword = document.getElementById('fcmTokenSearch').value.trim();
  if (!fcmTokens.length) {
    summary.textContent = '조회된 토큰이 없어요.';
    return;
  }
  if (!keyword) {
    summary.textContent = '총 ' + fcmTokens.length + '개 토큰';
    return;
  }
  summary.textContent = '총 ' + fcmTokens.length + '개 중 ' + fcmFilteredTokens.length + '개 검색 결과';
}

function applyFcmTokenFilter(resetPage) {
  if (resetPage) fcmCurrentPage = 1;
  const keyword = document.getElementById('fcmTokenSearch').value.trim().toLowerCase();
  fcmFilteredTokens = !keyword
          ? fcmTokens.slice()
          : fcmTokens.filter(token => String(token).toLowerCase().includes(keyword));
  updateFcmTokenSummary();
  renderFcmTokenRows(fcmFilteredTokens, fcmCurrentPage);
  renderFcmTokenPagination(fcmFilteredTokens.length);
}

function clearFcmState() {
  fcmTokens = [];
  fcmFilteredTokens = [];
  fcmCurrentPage = 1;
  document.getElementById('fcmTokenSearch').value = '';
  document.getElementById('fcmSingleToken').value = '';
  document.getElementById('fcmSingleTitle').value = '';
  document.getElementById('fcmSingleBody').value = '';
  document.getElementById('fcmSingleData').value = '';
  document.getElementById('fcmBatchTitle').value = '';
  document.getElementById('fcmBatchBody').value = '';
  document.getElementById('fcmBatchData').value = '';
  fcmSchedules = [];
  fcmScheduleCancelingIds = new Set();
  resetFcmScheduleForm();
  document.getElementById('fcmSingleResult').classList.add('hidden');
  document.getElementById('fcmBatchResult').classList.add('hidden');
  const banner = document.getElementById('fcmBanner');
  banner.textContent = '';
  banner.className = 'banner hidden';
  document.getElementById('fcmTokenSummary').textContent = '토큰 조회를 실행하세요.';
  document.getElementById('fcmTokenPagination').classList.add('hidden');
  document.getElementById('fcmTokenPagination').innerHTML = '';
  document.querySelector('#fcmTokenList tbody').innerHTML = '<tr><td colspan="3">토큰 조회를 실행하세요.</td></tr>';
  document.querySelector('#fcmScheduleList tbody').innerHTML = '<tr><td colspan="7">예약 목록을 조회하세요.</td></tr>';
}

function loadFcmTokensIfVisible() {
  const section = document.getElementById('fcm');
  if (section && !section.classList.contains('hidden') && !fcmTokens.length) {
    document.getElementById('btnLoadFcmTokens').click();
  }
  if (section && !section.classList.contains('hidden') && !fcmSchedules.length && !fcmScheduleIsLoading) {
    loadFcmSchedules();
  }
}

document.getElementById('btnClearFcmSelection').onclick = () => {
  document.getElementById('fcmSingleToken').value = '';
  document.getElementById('fcmSingleResult').classList.add('hidden');
  showToast('단건 발송 대상 토큰이 초기화되었습니다', 'success');
};

document.getElementById('fcmTokenSearch').addEventListener('input', () => {
  applyFcmTokenFilter(true);
});

document.getElementById('btnLoadFcmTokens').onclick = async () => {
  const btn = document.getElementById('btnLoadFcmTokens');
  const banner = document.getElementById('fcmBanner');
  const summary = document.getElementById('fcmTokenSummary');
  const loading = document.getElementById('fcmTokenLoading');
  banner.className = 'banner hidden';
  banner.textContent = '';
  summary.textContent = '토큰 불러오는 중...';
  loading.classList.remove('hidden');
  btn.disabled = true;
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/admin/tokens', { headers: headers() });
    if (res.status === 403) {
      banner.textContent = '개발자 계정으로 로그인하세요.';
      banner.className = 'banner warn';
      banner.classList.remove('hidden');
      fcmTokens = [];
      applyFcmTokenFilter(true);
      summary.textContent = '권한이 없어요.';
      return;
    }
    const data = await readJsonOrEmpty(res);
    if (!res.ok) {
      banner.textContent = data.message || '토큰 조회 실패 (HTTP ' + res.status + ')';
      banner.className = 'banner error';
      banner.classList.remove('hidden');
      fcmTokens = [];
      applyFcmTokenFilter(true);
      summary.textContent = '토큰 조회에 실패했어요.';
      return;
    }
    fcmTokens = data.data?.tokens || [];
    applyFcmTokenFilter(true);
    if (!fcmTokens.length) {
      banner.textContent = '저장된 토큰이 없어요.';
      banner.className = 'banner warn';
      banner.classList.remove('hidden');
      return;
    }
    showToast('토큰 ' + fcmTokens.length + '개를 조회했습니다', 'success');
  } catch (e) {
    banner.textContent = '요청 실패: ' + (e.message || '');
    banner.className = 'banner error';
    banner.classList.remove('hidden');
    fcmTokens = [];
    applyFcmTokenFilter(true);
    summary.textContent = '토큰 조회에 실패했어요.';
  } finally {
    loading.classList.add('hidden');
    btn.disabled = false;
    btn.textContent = '토큰 조회';
  }
};

document.getElementById('btnFcmSendSingle').onclick = async () => {
  const token = document.getElementById('fcmSingleToken').value.trim();
  const title = document.getElementById('fcmSingleTitle').value.trim();
  const body = document.getElementById('fcmSingleBody').value.trim();
  let data;
  try {
    data = parseFcmDataMap(document.getElementById('fcmSingleData').value, '단건 data');
  } catch (e) {
    setMessageBox('fcmSingleResult', false, e.message || 'data 형식이 올바르지 않아요.');
    return;
  }
  if (!token) {
    setMessageBox('fcmSingleResult', false, '대상 토큰을 입력하거나 목록에서 선택하세요.');
    return;
  }
  if (!title || !body) {
    setMessageBox('fcmSingleResult', false, '제목과 본문을 모두 입력하세요.');
    return;
  }

  const btn = document.getElementById('btnFcmSendSingle');
  document.getElementById('fcmSingleResult').classList.add('hidden');
  btn.disabled = true;
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/admin/fcm/send', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ token, title, body, data })
    });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('fcmSingleResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('fcmSingleResult', false, response.message || 'FCM 단건 발송 실패 (HTTP ' + res.status + ')');
      return;
    }
    const messageId = response.data?.messageId || '-';
    setMessageBox('fcmSingleResult', true, (response.message || 'FCM 단건 발송 완료') + ' (messageId: ' + messageId + ')');
    showToast('개별 메시지 전송 완료', 'success');
  } catch (e) {
    setMessageBox('fcmSingleResult', false, e.message || '요청 실패');
  } finally {
    btn.disabled = false;
    btn.textContent = '이 기기로 보내기';
  }
};

document.getElementById('btnFcmSendAll').onclick = async () => {
  const title = document.getElementById('fcmBatchTitle').value.trim();
  const body = document.getElementById('fcmBatchBody').value.trim();
  let data;
  try {
    data = parseFcmDataMap(document.getElementById('fcmBatchData').value, '전체 data');
  } catch (e) {
    setMessageBox('fcmBatchResult', false, e.message || 'data 형식이 올바르지 않아요.');
    return;
  }
  if (!title || !body) {
    setMessageBox('fcmBatchResult', false, '제목과 본문을 모두 입력하세요.');
    return;
  }
  if (!(await confirmDialog({ title: '모든 사용자에게 푸시를 보낼까요?', message: '보내면 취소할 수 없어요.', details: [['제목', title], ['본문', body]], confirmLabel: '전체 발송', danger: true }))) return;

  const btn = document.getElementById('btnFcmSendAll');
  document.getElementById('fcmBatchResult').classList.add('hidden');
  btn.disabled = true;
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/admin/fcm/send-all', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ title, body, data })
    });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('fcmBatchResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('fcmBatchResult', false, response.message || 'FCM 전체 배치 발송 실패 (HTTP ' + res.status + ')');
      return;
    }
    const result = response.data || {};
    const total = result.totalTokenCount ?? 0;
    const success = result.successCount ?? 0;
    const failure = result.failureCount ?? 0;
    let detail = '총 ' + total + '건, 성공 ' + success + ', 실패 ' + failure;
    if (Array.isArray(result.failedTokens) && result.failedTokens.length) {
      const sample = result.failedTokens.slice(0, 2).map(t => truncateMiddle(t, 10, 6)).join(', ');
      detail += ', 실패 토큰 샘플: ' + sample;
    }
    setMessageBox('fcmBatchResult', true, (response.message || 'FCM 전체 배치 발송 완료') + ' - ' + detail);
    showToast('전체 메시지 전송 완료', 'success');
  } catch (e) {
    setMessageBox('fcmBatchResult', false, e.message || '요청 실패');
  } finally {
    btn.disabled = false;
    btn.textContent = '전체 발송';
  }
};

function fcmScheduleStatusLabel(status) {
  const labels = {
    SCHEDULED: '대기',
    SENDING: '발송 중',
    SENT: '발송 완료',
    CANCELED: '취소됨',
    FAILED: '실패'
  };
  return labels[status] || status || '-';
}

function fcmScheduleTargetLabel(targetType) {
  return targetType === 'ALL_TOKENS' ? '전체 토큰' : '단건 토큰';
}

function formatFcmScheduleDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
}

function updateFcmScheduleTargetState() {
  const targetType = document.getElementById('fcmScheduleTargetType').value;
  const token = document.getElementById('fcmScheduleToken');
  token.disabled = targetType === 'ALL_TOKENS';
  if (targetType === 'ALL_TOKENS') token.value = '';
}

function buildFcmSchedulePayload() {
  const targetType = document.getElementById('fcmScheduleTargetType').value;
  const token = document.getElementById('fcmScheduleToken').value.trim();
  const title = document.getElementById('fcmScheduleTitle').value.trim();
  const body = document.getElementById('fcmScheduleBody').value.trim();
  const date = document.getElementById('fcmScheduleDate').value;
  const time = document.getElementById('fcmScheduleTime').value;
  const data = parseFcmDataMap(document.getElementById('fcmScheduleData').value, '예약 data');

  if (!title || !body) throw new Error('제목과 본문을 모두 입력하세요.');
  if (targetType === 'SINGLE_TOKEN' && !token) throw new Error('단건 예약 대상 토큰을 입력하세요.');
  if (!date || !time) throw new Error('예약 날짜와 시간을 모두 입력하세요.');

  const scheduledDate = new Date(date + 'T' + time + ':00+09:00');
  if (Number.isNaN(scheduledDate.getTime())) throw new Error('예약 시각 형식이 올바르지 않아요.');
  if (scheduledDate.getTime() <= Date.now()) throw new Error('예약 시각은 현재보다 이후여야 합니다.');

  const payload = {
    targetType,
    title,
    body,
    data,
    scheduledAt: date + 'T' + time + ':00+09:00'
  };
  if (targetType === 'SINGLE_TOKEN') payload.token = token;
  return payload;
}

function resetFcmScheduleForm(clearMessage = true) {
  document.getElementById('fcmScheduleTargetType').value = 'SINGLE_TOKEN';
  document.getElementById('fcmScheduleToken').value = '';
  document.getElementById('fcmScheduleTitle').value = '';
  document.getElementById('fcmScheduleBody').value = '';
  document.getElementById('fcmScheduleData').value = '';
  document.getElementById('fcmScheduleDate').value = '';
  document.getElementById('fcmScheduleTime').value = '';
  if (clearMessage) document.getElementById('fcmScheduleResult').classList.add('hidden');
  updateFcmScheduleTargetState();
}

function renderFcmScheduleRows() {
  const tbody = document.querySelector('#fcmScheduleList tbody');
  tbody.innerHTML = '';
  if (!fcmSchedules.length) {
    tbody.innerHTML = '<tr><td colspan="7">조회된 예약 알림이 없습니다.</td></tr>';
    return;
  }

  fcmSchedules.forEach(schedule => {
    const tr = document.createElement('tr');
    const result = '총 ' + (schedule.totalCount ?? 0)
            + ' / 성공 ' + (schedule.successCount ?? 0)
            + ' / 실패 ' + (schedule.failureCount ?? 0);
    const canCancel = schedule.status === 'SCHEDULED';
    const isCanceling = fcmScheduleCancelingIds.has(schedule.id);
    tr.innerHTML =
            '<td>' + escapeHtml(formatFcmScheduleDateTime(schedule.scheduledAt)) + '</td>' +
            '<td>' + escapeHtml(fcmScheduleTargetLabel(schedule.targetType)) + '</td>' +
            '<td title="' + escapeHtml(schedule.title || '') + '">' + escapeHtml(truncateMiddle(schedule.title || '-', 18, 8)) + '</td>' +
            '<td>' + escapeHtml(fcmScheduleStatusLabel(schedule.status)) + '</td>' +
            '<td>' + escapeHtml(result) + '</td>' +
            '<td>' + escapeHtml(formatFcmScheduleDateTime(schedule.createdAt)) + '</td>' +
            '<td class="btn-cell"></td>';
    const btnCell = tr.querySelector('.btn-cell');
    const detailBtn = document.createElement('button');
    detailBtn.type = 'button';
    detailBtn.textContent = '상세';
    detailBtn.onclick = () => loadFcmScheduleDetail(schedule.id);
    btnCell.appendChild(detailBtn);
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn-danger';
    cancelBtn.textContent = isCanceling ? '취소 중...' : '취소';
    cancelBtn.disabled = !canCancel || isCanceling;
    cancelBtn.onclick = () => cancelFcmSchedule(schedule.id);
    btnCell.appendChild(cancelBtn);
    tbody.appendChild(tr);
  });
}

async function loadFcmSchedules() {
  const btn = document.getElementById('btnLoadFcmSchedules');
  const loading = document.getElementById('fcmScheduleLoading');
  const status = document.getElementById('fcmScheduleStatusFilter').value;
  fcmScheduleIsLoading = true;
  btn.disabled = true;
  btn.textContent = '처리 중...';
  loading.classList.remove('hidden');
  try {
    const query = status ? '?status=' + encodeURIComponent(status) : '';
    const res = await fetch(API_BASE + '/api/admin/fcm/schedules' + query, { headers: headers() });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('fcmScheduleResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('fcmScheduleResult', false, response.message || '예약 목록 조회 실패 (HTTP ' + res.status + ')');
      return;
    }
    fcmSchedules = Array.isArray(response.data) ? response.data : [];
    renderFcmScheduleRows();
  } catch (e) {
    setMessageBox('fcmScheduleResult', false, e.message || '예약 목록 조회 실패');
  } finally {
    fcmScheduleIsLoading = false;
    loading.classList.add('hidden');
    btn.disabled = false;
    btn.textContent = '예약 목록 조회';
  }
}

async function loadFcmScheduleDetail(scheduleId) {
  try {
    const res = await fetch(API_BASE + '/api/admin/fcm/schedules/' + encodeURIComponent(scheduleId), { headers: headers() });
    const response = await readJsonOrEmpty(res);
    if (!res.ok) {
      setMessageBox('fcmScheduleResult', false, response.message || '예약 상세 조회 실패 (HTTP ' + res.status + ')');
      return;
    }
    const schedule = response.data || {};
    const failed = Array.isArray(schedule.failedTokens) && schedule.failedTokens.length
            ? '\n실패 토큰: ' + schedule.failedTokens.map(t => truncateMiddle(t, 12, 8)).join(', ')
            : '';
    setMessageBox(
            'fcmScheduleResult',
            true,
            '상태: ' + fcmScheduleStatusLabel(schedule.status)
            + ' / 예약: ' + formatFcmScheduleDateTime(schedule.scheduledAt)
            + ' / 결과: 총 ' + (schedule.totalCount ?? 0)
            + ', 성공 ' + (schedule.successCount ?? 0)
            + ', 실패 ' + (schedule.failureCount ?? 0)
            + failed
    );
  } catch (e) {
    setMessageBox('fcmScheduleResult', false, e.message || '예약 상세 조회 실패');
  }
}

async function createFcmSchedule() {
  let payload;
  try {
    payload = buildFcmSchedulePayload();
  } catch (e) {
    setMessageBox('fcmScheduleResult', false, e.message || '예약 입력값이 올바르지 않아요.');
    return;
  }

  const btn = document.getElementById('btnFcmScheduleCreate');
  fcmScheduleIsCreating = true;
  btn.disabled = true;
  btn.textContent = '예약 중...';
  try {
    const res = await fetch(API_BASE + '/api/admin/fcm/schedules', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('fcmScheduleResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('fcmScheduleResult', false, response.message || '예약 생성 실패 (HTTP ' + res.status + ')');
      return;
    }
    setMessageBox('fcmScheduleResult', true, response.message || 'FCM 예약 알림이 생성되었습니다.');
    showToast('예약 알림 생성 완료', 'success');
    resetFcmScheduleForm(false);
    await loadFcmSchedules();
  } catch (e) {
    setMessageBox('fcmScheduleResult', false, e.message || '예약 생성 실패');
  } finally {
    fcmScheduleIsCreating = false;
    btn.disabled = false;
    btn.textContent = '예약하기';
  }
}

async function cancelFcmSchedule(scheduleId) {
  if (!(await confirmDialog({ title: '이 예약을 취소할까요?', confirmLabel: '예약 취소', cancelLabel: '닫기', danger: true }))) return;
  fcmScheduleCancelingIds.add(scheduleId);
  renderFcmScheduleRows();
  try {
    const res = await fetch(API_BASE + '/api/admin/fcm/schedules/' + encodeURIComponent(scheduleId), {
      method: 'DELETE',
      headers: headers()
    });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('fcmScheduleResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('fcmScheduleResult', false, response.message || '예약 취소 실패 (HTTP ' + res.status + ')');
      return;
    }
    setMessageBox('fcmScheduleResult', true, response.message || 'FCM 예약 알림이 취소되었습니다.');
    showToast('예약 알림 취소 완료', 'success');
    await loadFcmSchedules();
  } catch (e) {
    setMessageBox('fcmScheduleResult', false, e.message || '예약 취소 실패');
  } finally {
    fcmScheduleCancelingIds.delete(scheduleId);
    renderFcmScheduleRows();
  }
}

document.getElementById('fcmScheduleTargetType').addEventListener('change', updateFcmScheduleTargetState);
document.getElementById('btnFcmScheduleReset').onclick = resetFcmScheduleForm;
document.getElementById('btnFcmScheduleCreate').onclick = createFcmSchedule;
document.getElementById('btnLoadFcmSchedules').onclick = loadFcmSchedules;
document.getElementById('fcmScheduleStatusFilter').addEventListener('change', loadFcmSchedules);
updateFcmScheduleTargetState();
