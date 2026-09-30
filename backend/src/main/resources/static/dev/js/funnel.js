// 퍼널 이탈율 대시보드 조회

let funnelHasLoaded = false;
let funnelIsLoading = false;

function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

// 오늘 데이터는 다음날 04:00에 수집되므로 프리셋 종료일은 어제로 잡는다.
function applyFunnelPreset(days) {
  const to = new Date();
  to.setDate(to.getDate() - 1);
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  document.getElementById('funnelFrom').value = toDateInputValue(from);
  document.getElementById('funnelTo').value = toDateInputValue(to);
}

function formatRate(rate) {
  if (rate === null || rate === undefined) return '-';
  return (rate * 100).toFixed(1) + '%';
}

function formatDropRate(rate) {
  if (rate === null || rate === undefined) return '-';
  return (Math.max(0, 1 - rate) * 100).toFixed(1) + '%';
}

function renderFunnelCard(funnel) {
  const baseUsers = funnel.steps.length ? funnel.steps[0].users : 0;
  const rows = funnel.steps.map((step, index) => {
    const conversion = index === 0 ? null : (funnel.conversions[index - 1] || {}).rate;
    const width = baseUsers > 0 ? Math.round((step.users / baseUsers) * 100) : 0;
    return '<tr>'
      + '<td>' + escapeHtml(step.name) + '</td>'
      + '<td class="num">' + step.users.toLocaleString() + '</td>'
      + '<td class="num">' + (index === 0 ? '-' : formatRate(conversion)) + '</td>'
      + '<td class="drop">' + (index === 0 ? '-' : formatDropRate(conversion)) + '</td>'
      + '<td><div class="funnel-bar"><span style="width:' + width + '%"></span></div></td>'
      + '</tr>';
  }).join('');
  return '<div class="funnel-card">'
    + '<div class="funnel-card-head"><h3>' + escapeHtml(funnel.name) + '</h3>'
    + '<span class="funnel-overall">전체 ' + formatRate(funnel.overallRate) + '</span></div>'
    + '<div class="table-wrap" style="margin-top:0;"><table><thead><tr><th>단계</th><th>고유 사용자</th><th>전환율</th><th>이탈율</th><th></th></tr></thead>'
    + '<tbody>' + rows + '</tbody></table></div>'
    + '</div>';
}

function renderScrollDepths(scrollDepths) {
  const container = document.getElementById('funnelScroll');
  if (!scrollDepths.length) {
    container.innerHTML = '<div class="funnel-card" style="margin-top:16px;"><div class="funnel-card-head"><h3>페이지별 스크롤 도달</h3></div><p class="funnel-empty">기간 내 Scroll Depth Reached 이벤트가 없습니다.</p></div>';
    return;
  }
  const rows = scrollDepths.map((item) => {
    const cells = item.depths.map((depth) => {
      const rate = depth.percent === 25 ? '' : ' (' + formatRate(depth.rateFrom25) + ')';
      return '<td class="num">' + depth.users.toLocaleString() + escapeHtml(rate) + '</td>';
    }).join('');
    return '<tr><td>' + escapeHtml(item.page) + '</td>' + cells + '</tr>';
  }).join('');
  container.innerHTML = '<div class="funnel-card" style="margin-top:16px;">'
    + '<div class="funnel-card-head"><h3>페이지별 스크롤 도달</h3><span class="funnel-overall">고유 사용자 (25% 대비)</span></div>'
    + '<div class="table-wrap"><table><thead><tr><th>페이지</th><th>25%</th><th>50%</th><th>75%</th><th>100%</th></tr></thead>'
    + '<tbody>' + rows + '</tbody></table></div></div>';
}

function renderFunnelDashboard(data) {
  const banner = document.getElementById('funnelMissingBanner');
  const missing = data.missingDates || [];
  if (missing.length) {
    banner.textContent = '수집 안 됨: 요청 ' + data.requestedDays + '일 중 ' + missing.length + '일 ('
      + missing.join(', ') + '). 이 구간은 0이 아니라 데이터가 없는 것입니다. 통계 Backfill로 메우세요.';
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
  document.getElementById('funnelCards').innerHTML = (data.funnels || []).map(renderFunnelCard).join('');
  renderScrollDepths(data.scrollDepths || []);
}

// 조회 중에 프리셋·날짜가 바뀌면 이전 기간의 응답이 바뀐 날짜 아래에 붙는다. 요청이 끝날 때까지 잠근다.
function setFunnelControlsDisabled(disabled) {
  document.getElementById('btnFunnelLoad').disabled = disabled;
  document.getElementById('funnelFrom').disabled = disabled;
  document.getElementById('funnelTo').disabled = disabled;
  document.querySelectorAll('.funnel-preset').forEach((button) => {
    button.disabled = disabled;
  });
}

async function loadFunnelDashboard() {
  const from = document.getElementById('funnelFrom').value;
  const to = document.getElementById('funnelTo').value;
  const btn = document.getElementById('btnFunnelLoad');
  const messageEl = document.getElementById('funnelMessage');
  messageEl.classList.add('hidden');
  if (!from || !to) {
    setMessageBox('funnelMessage', false, '시작일과 종료일을 모두 입력하세요.');
    return;
  }
  if (funnelIsLoading) return;
  funnelIsLoading = true;
  setFunnelControlsDisabled(true);
  btn.textContent = '조회 중...';
  try {
    const query = '?from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to);
    const res = await fetch(API_BASE + '/api/admin/statistics/funnels' + query, { headers: headers() });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('funnelMessage', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('funnelMessage', false, response.message || '조회 실패 (HTTP ' + res.status + ')');
      return;
    }
    renderFunnelDashboard(response.data || {});
    funnelHasLoaded = true;
  } catch (e) {
    setMessageBox('funnelMessage', false, e.message || '조회 요청 실패');
  } finally {
    funnelIsLoading = false;
    setFunnelControlsDisabled(false);
    btn.textContent = '조회';
  }
}

function loadFunnelDashboardIfVisible() {
  if (funnelHasLoaded || funnelIsLoading) return;
  if (!document.getElementById('funnelFrom').value) applyFunnelPreset(7);
  loadFunnelDashboard();
}

document.querySelectorAll('.funnel-preset').forEach((button) => {
  button.onclick = () => {
    applyFunnelPreset(Number(button.dataset.days));
    loadFunnelDashboard();
  };
});
document.getElementById('btnFunnelLoad').onclick = loadFunnelDashboard;
