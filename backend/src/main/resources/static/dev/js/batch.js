// 통계 Backfill과 이미지 변환 배치 실행

document.getElementById('btnStatisticsBackfill').onclick = async () => {
  const from = document.getElementById('statisticsBackfillFrom').value;
  const to = document.getElementById('statisticsBackfillTo').value;
  const btn = document.getElementById('btnStatisticsBackfill');
  if (!from || !to) {
    setMessageBox('statisticsBackfillResult', false, '시작일과 종료일을 모두 입력하세요.');
    return;
  }
  btn.disabled = true;
  btn.textContent = '처리 중...';
  try {
    const query = '?from=' + encodeURIComponent(from) + '&to=' + encodeURIComponent(to);
    const res = await fetch(API_BASE + '/api/admin/statistics/mixpanel/backfill' + query, {
      method: 'POST',
      headers: headers()
    });
    const response = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setMessageBox('statisticsBackfillResult', false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      setMessageBox('statisticsBackfillResult', false, response.message || 'Backfill 실패 (HTTP ' + res.status + ')');
      return;
    }
    const data = response.data || {};
    const detail = '조회 ' + (data.fetchedEvents ?? 0)
      + '건, 처리 ' + (data.processedEvents ?? 0)
      + '건, 중복 ' + (data.duplicatedEvents ?? 0)
      + '건, 스킵 ' + (data.skippedEvents ?? 0) + '건';
    setMessageBox('statisticsBackfillResult', true, detail);
    showToast('통계 Backfill 완료', 'success');
  } catch (e) {
    setMessageBox('statisticsBackfillResult', false, e.message || 'Backfill 요청 실패');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Backfill 실행';
  }
};

document.getElementById('btnConversionBatch').onclick = async () => {
  const text = document.getElementById('conversionImagesJson').value.trim();
  const banner = document.getElementById('conversionBanner');
  banner.classList.add('hidden');
  banner.className = 'banner hidden';
  let images;
  try {
    images = text ? JSON.parse(text) : [];
  } catch (e) {
    banner.textContent = 'JSON 형식이 올바르지 않습니다.';
    banner.className = 'banner error';
    banner.classList.remove('hidden');
    return;
  }
  if (!Array.isArray(images) || !images.length) {
    banner.textContent = 'images 배열을 최소 1개 이상 입력하세요.';
    banner.className = 'banner warn';
    banner.classList.remove('hidden');
    return;
  }
  if (!(await confirmDialog({ title: '이미지 변환 배치를 실행할까요?', message: '모든 동아리의 로고·커버·피드 이미지 URL이 바뀌어요. 되돌리려면 반대 방향으로 다시 실행해야 해요.', details: [['변환 개수', images.length + '개']], confirmLabel: '실행', danger: true }))) return;
  const btn = document.getElementById('btnConversionBatch');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/api/admin/conversion-batch', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ event: 'batch.completed', images })
    });
    const data = await res.json();
    if (res.status === 403) {
      banner.textContent = '개발자 계정으로 로그인하세요.';
      banner.className = 'banner warn';
      banner.classList.remove('hidden');
      return;
    }
    if (res.ok) {
      showToast(data.message || '배치 처리 완료', 'success');
      banner.classList.add('hidden');
    } else {
      banner.textContent = data.message || '배치 처리 실패';
      banner.className = 'banner error';
      banner.classList.remove('hidden');
    }
  } catch (e) {
    banner.textContent = '요청 실패: ' + (e.message || '');
    banner.className = 'banner error';
    banner.classList.remove('hidden');
    showToast(e.message || '요청 실패', 'error');
  } finally {
    btn.disabled = false;
  }
};

document.getElementById('btnWebpMigrate').onclick = async () => {
  if (!(await confirmDialog({ title: 'WebP 마이그레이션을 실행할까요?', message: '전체 동아리 이미지가 대상이에요.', confirmLabel: '실행', danger: true }))) return;
  const btn = document.getElementById('btnWebpMigrate');
  btn.disabled = true;
  try {
    const res = await fetch(API_BASE + '/api/admin/conversion-batch/webp-migrate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (res.status === 403) {
      showToast('개발자 계정으로 로그인하세요.', 'error');
      return;
    }
    if (res.ok) {
      showToast(data.message || 'WebP 마이그레이션 완료', 'success');
    } else {
      showToast(data.message || 'WebP 마이그레이션 실패', 'error');
    }
  } catch (e) {
    showToast(e.message || '요청 실패', 'error');
  } finally {
    btn.disabled = false;
  }
};
