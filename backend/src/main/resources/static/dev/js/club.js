// 동아리 목록 조회와 수정 팝업 열기

function openEditWindow(clubId) {
  window.open('/dev/edit.html?clubId=' + encodeURIComponent(clubId), 'clubEdit', 'width=620,height=700,scrollbars=yes');
}

let allClubs = [];
let currentPage = 1;

function renderClubTableRows(clubs, page) {
  const start = (page - 1) * PAGE_SIZE;
  const slice = clubs.slice(start, start + PAGE_SIZE);
  const tbody = document.querySelector('#clubList tbody');
  tbody.innerHTML = '';
  slice.forEach(c => {
    const tr = document.createElement('tr');
    const idCell = document.createElement('td');
    idCell.className = 'id-cell copy-id-cell';
    idCell.title = c.id || '';
    const idWrap = document.createElement('span');
    idWrap.className = 'copy-id-wrap';
    const idText = document.createElement('span');
    idText.className = 'copy-id-text';
    idText.textContent = truncateId(c.id || '');
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-icon-btn';
    copyBtn.textContent = '⧉';
    copyBtn.title = 'ID 복사';
    copyBtn.setAttribute('aria-label', '동아리 ID 복사');
    copyBtn.onclick = (e) => { e.stopPropagation(); copyTextToClipboard(c.id || '', 'ID 복사됨'); };
    idWrap.appendChild(idText);
    idWrap.appendChild(copyBtn);
    idCell.appendChild(idWrap);
    tr.appendChild(idCell);
    tr.appendChild(document.createElement('td')).textContent = c.name || '';
    tr.appendChild(document.createElement('td')).textContent = c.userId || '';
    tr.onclick = () => openEditWindow(c.id);
    tbody.appendChild(tr);
  });
}

function renderPagination(total) {
  const wrap = document.getElementById('clubPagination');
  if (total <= PAGE_SIZE) {
    wrap.classList.add('hidden');
    wrap.innerHTML = '';
    return;
  }
  wrap.classList.remove('hidden');
  const totalPages = Math.ceil(total / PAGE_SIZE);
  let html = '<span>총 ' + total + '개</span>';
  if (currentPage > 1) html += '<button type="button" id="clubPrev">이전</button>';
  html += '<span> ' + currentPage + ' / ' + totalPages + ' </span>';
  if (currentPage < totalPages) html += '<button type="button" id="clubNext">다음</button>';
  wrap.innerHTML = html;
  const prev = document.getElementById('clubPrev');
  const next = document.getElementById('clubNext');
  if (prev) prev.onclick = () => { currentPage--; renderClubTableRows(allClubs, currentPage); renderPagination(allClubs.length); };
  if (next) next.onclick = () => { currentPage++; renderClubTableRows(allClubs, currentPage); renderPagination(allClubs.length); };
}

function loadClubsIfVisible() {
  const section = document.getElementById('club');
  if (section && !section.classList.contains('hidden')) {
    document.getElementById('btnLoadClubs').click();
  }
}

document.getElementById('btnLoadClubs').onclick = async () => {
  const tbody = document.querySelector('#clubList tbody');
  const banner = document.getElementById('clubBanner');
  const loading = document.getElementById('clubListLoading');
  banner.classList.add('hidden');
  banner.className = 'banner hidden';
  loading.classList.remove('hidden');
  tbody.innerHTML = '';
  try {
    const res = await fetch(API_BASE + '/api/admin/clubs', { headers: headers() });
    if (res.status === 403) {
      banner.textContent = '개발자 계정으로 로그인하세요.';
      banner.className = 'banner warn';
      banner.classList.remove('hidden');
      tbody.innerHTML = '<tr><td colspan="3">목록을 불러올 수 없습니다.</td></tr>';
      return;
    }
    const data = await res.json();
    const clubs = data.data?.clubs || [];
    allClubs = clubs;
    currentPage = 1;
    renderClubTableRows(clubs, 1);
    renderPagination(clubs.length);
  } catch (e) {
    banner.textContent = '요청 실패: ' + (e.message || '');
    banner.className = 'banner error';
    banner.classList.remove('hidden');
    tbody.innerHTML = '<tr><td colspan="3">' + (e.message || '오류') + '</td></tr>';
  } finally {
    loading.classList.add('hidden');
  }
};
