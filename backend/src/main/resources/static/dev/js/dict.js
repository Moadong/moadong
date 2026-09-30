// 검색 단어사전 조회·등록·CSV 업로드·삭제

let allDicts = [];
let dictCurrentPage = 1;

function openDictEditWindow(d) {
  window.open('/dev/dict-edit.html?id=' + encodeURIComponent(d.id), 'dictEdit', 'width=520,height=420,scrollbars=yes');
}

function inputWordsSummary(words) {
  if (!words || !words.length) return '';
  const s = words.join(', ');
  return s.length > 60 ? s.slice(0, 60) + '…' : s;
}

function renderDictTableRows(dicts, page) {
  const start = (page - 1) * PAGE_SIZE;
  const slice = dicts.slice(start, start + PAGE_SIZE);
  const tbody = document.querySelector('#dictList tbody');
  tbody.innerHTML = '';
  slice.forEach(d => {
    const tr = document.createElement('tr');
    const idCell = document.createElement('td');
    idCell.className = 'id-cell copy-id-cell';
    idCell.title = d.id || '';
    const idWrap = document.createElement('span');
    idWrap.className = 'copy-id-wrap';
    const idText = document.createElement('span');
    idText.className = 'copy-id-text';
    idText.textContent = truncateId(d.id || '');
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-icon-btn';
    copyBtn.textContent = '⧉';
    copyBtn.title = 'ID 복사';
    copyBtn.setAttribute('aria-label', '단어사전 ID 복사');
    copyBtn.onclick = (e) => { e.stopPropagation(); copyTextToClipboard(d.id || '', 'ID 복사됨'); };
    idWrap.appendChild(idText);
    idWrap.appendChild(copyBtn);
    idCell.appendChild(idWrap);
    tr.appendChild(idCell);
    tr.appendChild(document.createElement('td')).textContent = d.standardWord || '';
    tr.appendChild(document.createElement('td')).textContent = inputWordsSummary(d.inputWords);
    const btnCell = document.createElement('td');
    btnCell.className = 'btn-cell';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = '수정';
    editBtn.onclick = (e) => { e.stopPropagation(); openDictEditWindow(d); };
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn-danger';
    delBtn.textContent = '삭제';
    delBtn.onclick = (e) => { e.stopPropagation(); deleteDict(d.id); };
    btnCell.appendChild(editBtn);
    btnCell.appendChild(delBtn);
    tr.appendChild(btnCell);
    tbody.appendChild(tr);
  });
}

function renderDictPagination(total) {
  const wrap = document.getElementById('dictPagination');
  if (total <= PAGE_SIZE) {
    wrap.classList.add('hidden');
    wrap.innerHTML = '';
    return;
  }
  wrap.classList.remove('hidden');
  const totalPages = Math.ceil(total / PAGE_SIZE);
  let html = '<span>총 ' + total + '개</span>';
  if (dictCurrentPage > 1) html += '<button type="button" id="dictPrev">이전</button>';
  html += '<span> ' + dictCurrentPage + ' / ' + totalPages + ' </span>';
  if (dictCurrentPage < totalPages) html += '<button type="button" id="dictNext">다음</button>';
  wrap.innerHTML = html;
  const prev = document.getElementById('dictPrev');
  const next = document.getElementById('dictNext');
  if (prev) prev.onclick = () => { dictCurrentPage--; renderDictTableRows(allDicts, dictCurrentPage); renderDictPagination(allDicts.length); };
  if (next) next.onclick = () => { dictCurrentPage++; renderDictTableRows(allDicts, dictCurrentPage); renderDictPagination(allDicts.length); };
}

function loadDictIfVisible() {
  const section = document.getElementById('dict');
  if (section && !section.classList.contains('hidden')) {
    document.getElementById('btnLoadDict').click();
  }
}

document.getElementById('btnLoadDict').onclick = async () => {
  const tbody = document.querySelector('#dictList tbody');
  const banner = document.getElementById('dictBanner');
  const loading = document.getElementById('dictListLoading');
  banner.classList.add('hidden');
  banner.className = 'banner hidden';
  loading.classList.remove('hidden');
  tbody.innerHTML = '';
  try {
    const res = await fetch(API_BASE + '/api/admin/word-dictionary', { headers: headers() });
    if (res.status === 403) {
      banner.textContent = '개발자 계정으로 로그인하세요.';
      banner.className = 'banner warn';
      banner.classList.remove('hidden');
      tbody.innerHTML = '<tr><td colspan="4">목록을 불러올 수 없습니다.</td></tr>';
      return;
    }
    const data = await res.json();
    const list = data.data;
    const dicts = list?.wordDictionaries || [];
    const total = list?.total ?? dicts.length;
    allDicts = dicts;
    dictCurrentPage = 1;
    renderDictTableRows(dicts, 1);
    renderDictPagination(dicts.length);
  } catch (e) {
    banner.textContent = '요청 실패: ' + (e.message || '');
    banner.className = 'banner error';
    banner.classList.remove('hidden');
    tbody.innerHTML = '<tr><td colspan="4">' + (e.message || '오류') + '</td></tr>';
  } finally {
    loading.classList.add('hidden');
  }
};

document.getElementById('btnRefreshDictCache').onclick = async () => {
  const btn = document.getElementById('btnRefreshDictCache');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/api/admin/word-dictionary/refresh', { method: 'POST', headers: headers() });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || '캐시가 새로고침되었습니다', 'success');
    } else {
      showToast(data.message || '캐시 새로고침 실패', 'error');
    }
  } catch (e) {
    showToast(e.message || '요청 실패', 'error');
  } finally {
    btn.disabled = false;
  }
};

function parseInputWordsStr(str) {
  if (!str || !str.trim()) return [];
  return str.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
}

document.getElementById('btnDictCreate').onclick = async () => {
  const standardWord = document.getElementById('dictNewStandardWord').value.trim();
  const inputWordsStr = document.getElementById('dictNewInputWords').value.trim();
  const inputWords = parseInputWordsStr(inputWordsStr);
  if (!standardWord) {
    showToast('표준단어를 입력하세요', 'error');
    return;
  }
  if (!inputWords.length) {
    showToast('입력단어를 하나 이상 입력하세요', 'error');
    return;
  }
  const btn = document.getElementById('btnDictCreate');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/api/admin/word-dictionary', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ standardWord, inputWords })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || '추가되었습니다', 'success');
      document.getElementById('dictNewStandardWord').value = '';
      document.getElementById('dictNewInputWords').value = '';
      document.getElementById('btnLoadDict').click();
    } else {
      showToast(data.message || '추가 실패', 'error');
    }
  } catch (e) {
    showToast(e.message || '요청 실패', 'error');
  } finally {
    btn.disabled = false;
  }
};

document.getElementById('btnDictCsvUpload').onclick = async () => {
  const fileInput = document.getElementById('dictCsvFile');
  if (!fileInput.files || !fileInput.files.length) {
    showToast('CSV 파일을 선택하세요', 'error');
    return;
  }
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  const btn = document.getElementById('btnDictCsvUpload');
  btn.disabled = true;
  try {
    const h = { 'Authorization': 'Bearer ' + getToken() };
    const res = await fetch(API_BASE + '/api/admin/word-dictionary/csv', {
      method: 'POST',
      headers: h,
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || 'CSV 업로드 완료', 'success');
      fileInput.value = '';
      document.getElementById('btnLoadDict').click();
    } else {
      showToast(data.message || 'CSV 업로드 실패', 'error');
    }
  } catch (e) {
    showToast(e.message || '요청 실패', 'error');
  } finally {
    btn.disabled = false;
  }
};

async function deleteDict(id) {
  if (!id || !(await confirmDialog({ title: '이 단어를 삭제할까요?', confirmLabel: '삭제', danger: true }))) return;
  try {
    const res = await fetch(API_BASE + '/api/admin/word-dictionary/' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: headers()
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || '삭제되었습니다', 'success');
      document.getElementById('btnLoadDict').click();
    } else {
      showToast(data.message || '삭제 실패', 'error');
    }
  } catch (e) {
    showToast(e.message || '요청 실패', 'error');
  }
}
