// 웹/앱 배너 이미지 목록 편집·업로드·순서 저장

const DEFAULT_BANNER_TYPE = 'WEB';

let bannerImages = [];
let bannerActiveType = DEFAULT_BANNER_TYPE;
let bannerDirty = false;
let bannerHasLoaded = false;
let bannerIsLoading = false;
let bannerIsSaving = false;
let bannerIsUploading = false;

function createEmptyBannerItem() {
  return { id: '', imageUrl: '', linkTo: '', alt: '' };
}

function clearBannerBanner() {
  const banner = document.getElementById('bannerBanner');
  banner.textContent = '';
  banner.className = 'banner hidden';
}

function setBannerBanner(message, tone) {
  const banner = document.getElementById('bannerBanner');
  banner.textContent = message;
  banner.className = 'banner ' + tone;
  banner.classList.remove('hidden');
}

function hideBannerSaveResult() {
  document.getElementById('bannerSaveResult').classList.add('hidden');
}

function showBannerSaveResult(ok, message) {
  setMessageBox('bannerSaveResult', ok, message);
  if (ok) setTimeout(() => document.getElementById('bannerSaveResult').classList.add('hidden'), 3000);
}

function updateBannerControls() {
  const busy = bannerIsLoading || bannerIsSaving || bannerIsUploading;
  document.getElementById('bannerType').disabled = busy;
  document.getElementById('bannerUploadFile').disabled = busy;
  document.getElementById('btnUploadBannerImage').disabled = busy;
  document.getElementById('btnLoadBanner').disabled = busy;
  document.getElementById('btnAddBannerItem').disabled = busy;
  document.getElementById('btnSaveBanner').disabled = busy || !bannerHasLoaded;
}

function updateBannerSummary() {
  const summary = document.getElementById('bannerSummary');
  let text = bannerActiveType + ' 타입';
  if (!bannerHasLoaded && !bannerImages.length) {
    text += ' 목록을 불러오거나 새 배너를 추가/업로드하세요.';
  } else {
    text += ' 총 ' + bannerImages.length + '개';
  }
  if (bannerDirty) {
    text += ' (저장되지 않은 변경사항 있음)';
  }
  summary.textContent = text;
}

function markBannerDirty() {
  bannerDirty = true;
  hideBannerSaveResult();
  updateBannerSummary();
  updateBannerControls();
}

function normalizeBannerImagesForSave() {
  return bannerImages.map((item, index) => {
    const id = String(item.id || '').trim();
    const imageUrl = String(item.imageUrl || '').trim();
    const linkTo = String(item.linkTo || '').trim();
    const alt = String(item.alt || '').trim();
    if (!id) throw new Error((index + 1) + '번째 배너의 id를 입력하세요.');
    if (!imageUrl) throw new Error((index + 1) + '번째 배너의 imageUrl을 입력하세요.');
    if (!alt) throw new Error((index + 1) + '번째 배너의 alt를 입력하세요.');
    return { id, imageUrl, linkTo: linkTo || null, alt };
  });
}

function buildBannerUploadHeaders() {
  const token = getToken();
  return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function generateBannerItemId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return 'banner-' + window.crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  }
  return 'banner-' + Math.random().toString(36).slice(2, 14);
}

function createBannerItemFromUpload(fileName, imageUrl) {
  const baseName = String(fileName || '')
    .replace(/\.[^.]+$/, '')
    .trim();
  return {
    id: generateBannerItemId(),
    imageUrl,
    linkTo: '',
    alt: baseName || '배너 이미지'
  };
}

function moveBannerItem(fromIndex, toIndex) {
  if (fromIndex == null || fromIndex < 0 || fromIndex >= bannerImages.length) return;
  if (toIndex == null || toIndex < 0 || toIndex >= bannerImages.length) return;
  if (toIndex === fromIndex) return;
  const next = bannerImages.slice();
  const moved = next.splice(fromIndex, 1)[0];
  next.splice(toIndex, 0, moved);
  bannerImages = next;
  markBannerDirty();
  renderBannerList();
}

function createBannerPreview(item) {
  const preview = document.createElement('div');
  preview.className = 'banner-preview is-empty';
  const img = document.createElement('img');
  img.alt = item.alt || '배너 미리보기';
  img.classList.add('hidden');
  const placeholder = document.createElement('span');
  placeholder.textContent = '이미지 URL을 입력하면 미리보기가 표시됩니다.';

  function updatePreview() {
    const imageUrl = String(item.imageUrl || '').trim();
    img.alt = item.alt || '배너 미리보기';
    if (!imageUrl) {
      img.removeAttribute('src');
      img.classList.add('hidden');
      placeholder.textContent = '이미지 URL을 입력하면 미리보기가 표시됩니다.';
      placeholder.classList.remove('hidden');
      preview.classList.add('is-empty');
      return;
    }
    img.classList.add('hidden');
    placeholder.textContent = '이미지를 불러오는 중...';
    placeholder.classList.remove('hidden');
    preview.classList.add('is-empty');
    img.src = imageUrl;
  }

  img.addEventListener('load', () => {
    img.classList.remove('hidden');
    placeholder.classList.add('hidden');
    preview.classList.remove('is-empty');
  });
  img.addEventListener('error', () => {
    img.classList.add('hidden');
    placeholder.textContent = '이미지를 불러올 수 없습니다.';
    placeholder.classList.remove('hidden');
    preview.classList.add('is-empty');
  });

  preview.appendChild(img);
  preview.appendChild(placeholder);
  updatePreview();

  return { preview, updatePreview };
}

function createBannerField(config) {
  const row = document.createElement('div');
  row.className = 'form-row';
  const label = document.createElement('label');
  label.htmlFor = config.id;
  label.textContent = config.label;
  const input = document.createElement('input');
  input.type = 'text';
  input.id = config.id;
  input.value = config.value;
  input.placeholder = config.placeholder;
  input.addEventListener('input', config.onInput);
  row.appendChild(label);
  row.appendChild(input);
  return row;
}

function createBannerItemElement(item, index) {
  const article = document.createElement('article');
  article.className = 'banner-item';

  const head = document.createElement('div');
  head.className = 'banner-item-head';

  const meta = document.createElement('div');
  meta.className = 'banner-item-meta';
  const order = document.createElement('span');
  order.className = 'banner-order';
  order.textContent = '#' + (index + 1);
  meta.appendChild(order);

  const actions = document.createElement('div');
  actions.className = 'banner-item-actions';
  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.textContent = '위로';
  upBtn.disabled = index === 0;
  upBtn.addEventListener('click', () => moveBannerItem(index, index - 1));
  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.textContent = '아래로';
  downBtn.disabled = index === bannerImages.length - 1;
  downBtn.addEventListener('click', () => moveBannerItem(index, index + 1));
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '제거';
  removeBtn.addEventListener('click', () => {
    bannerImages.splice(index, 1);
    markBannerDirty();
    renderBannerList();
  });
  actions.appendChild(upBtn);
  actions.appendChild(downBtn);
  actions.appendChild(removeBtn);

  head.appendChild(meta);
  head.appendChild(actions);

  const body = document.createElement('div');
  body.className = 'banner-item-body';
  const previewState = createBannerPreview(item);
  const grid = document.createElement('div');
  grid.className = 'form-grid banner-item-grid';

  grid.appendChild(createBannerField({
    label: '배너 ID',
    id: 'bannerItemId' + index,
    value: item.id || '',
    placeholder: 'main-banner-1',
    onInput: (e) => {
      item.id = e.target.value;
      markBannerDirty();
    }
  }));
  grid.appendChild(createBannerField({
    label: '이미지 URL',
    id: 'bannerItemImageUrl' + index,
    value: item.imageUrl || '',
    placeholder: 'https://...',
    onInput: (e) => {
      item.imageUrl = e.target.value;
      previewState.updatePreview();
      markBannerDirty();
    }
  }));
  grid.appendChild(createBannerField({
    label: '클릭 링크 (선택)',
    id: 'bannerItemLinkTo' + index,
    value: item.linkTo || '',
    placeholder: 'https://...',
    onInput: (e) => {
      item.linkTo = e.target.value;
      markBannerDirty();
    }
  }));
  grid.appendChild(createBannerField({
    label: '대체 텍스트',
    id: 'bannerItemAlt' + index,
    value: item.alt || '',
    placeholder: '배너 설명',
    onInput: (e) => {
      item.alt = e.target.value;
      previewState.updatePreview();
      markBannerDirty();
    }
  }));

  body.appendChild(previewState.preview);
  body.appendChild(grid);
  article.appendChild(head);
  article.appendChild(body);
  return article;
}

function renderBannerList() {
  const list = document.getElementById('bannerList');
  const empty = document.getElementById('bannerEmpty');
  list.innerHTML = '';
  if (!bannerImages.length) {
    empty.classList.toggle('hidden', !bannerHasLoaded);
  } else {
    empty.classList.add('hidden');
    bannerImages.forEach((item, index) => {
      list.appendChild(createBannerItemElement(item, index));
    });
  }
  updateBannerSummary();
  updateBannerControls();
}

function clearBannerState() {
  bannerActiveType = DEFAULT_BANNER_TYPE;
  bannerImages = [];
  bannerDirty = false;
  bannerHasLoaded = false;
  bannerIsLoading = false;
  bannerIsSaving = false;
  bannerIsUploading = false;
  document.getElementById('bannerType').value = DEFAULT_BANNER_TYPE;
  document.getElementById('bannerUploadFile').value = '';
  document.getElementById('bannerListLoading').classList.add('hidden');
  clearBannerBanner();
  hideBannerSaveResult();
  renderBannerList();
}

function loadBannerIfVisible() {
  const section = document.getElementById('banner');
  if (section && !section.classList.contains('hidden') && !bannerHasLoaded) {
    document.getElementById('btnLoadBanner').click();
  }
}

document.getElementById('bannerType').addEventListener('change', (e) => {
  const nextType = e.target.value;
  if (nextType === bannerActiveType) return;
  if (bannerDirty && !confirm('저장하지 않은 배너 변경사항이 사라집니다. 계속할까요?')) {
    e.target.value = bannerActiveType;
    return;
  }
  bannerActiveType = nextType;
  bannerImages = [];
  bannerDirty = false;
  bannerHasLoaded = false;
  bannerIsUploading = false;
  document.getElementById('bannerUploadFile').value = '';
  clearBannerBanner();
  hideBannerSaveResult();
  renderBannerList();
});

document.getElementById('btnAddBannerItem').onclick = () => {
  bannerImages.push(createEmptyBannerItem());
  bannerHasLoaded = true;
  markBannerDirty();
  renderBannerList();
};

document.getElementById('btnUploadBannerImage').onclick = async () => {
  const fileInput = document.getElementById('bannerUploadFile');
  if (!fileInput.files || !fileInput.files.length) {
    showToast('업로드할 이미지를 선택하세요.', 'error');
    return;
  }

  const file = fileInput.files[0];
  const btn = document.getElementById('btnUploadBannerImage');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', bannerActiveType);

  bannerIsUploading = true;
  updateBannerControls();
  clearBannerBanner();
  hideBannerSaveResult();
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/banner/upload', {
      method: 'POST',
      headers: buildBannerUploadHeaders(),
      body: formData
    });
    const data = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setBannerBanner('개발자 계정으로 로그인하세요.', 'warn');
      return;
    }
    if (!res.ok) {
      setBannerBanner(data.message || '배너 이미지 업로드 실패 (HTTP ' + res.status + ')', 'error');
      return;
    }

    const imageUrl = data.data?.imageUrl;
    if (!imageUrl) {
      setBannerBanner('업로드 결과 URL을 확인할 수 없습니다.', 'error');
      return;
    }

    bannerImages.push(createBannerItemFromUpload(file.name, imageUrl));
    bannerHasLoaded = true;
    markBannerDirty();
    renderBannerList();
    fileInput.value = '';
    showToast('이미지를 업로드하고 배열에 추가했습니다.', 'success');
  } catch (e) {
    setBannerBanner('요청 실패: ' + (e.message || ''), 'error');
  } finally {
    bannerIsUploading = false;
    btn.textContent = '업로드 후 배열에 추가';
    updateBannerControls();
  }
};

document.getElementById('btnLoadBanner').onclick = async () => {
  if (bannerDirty && !confirm('현재 수정 중인 배너 내용이 덮어써집니다. 계속할까요?')) return;
  const btn = document.getElementById('btnLoadBanner');
  const loading = document.getElementById('bannerListLoading');
  bannerIsLoading = true;
  updateBannerControls();
  clearBannerBanner();
  hideBannerSaveResult();
  loading.classList.remove('hidden');
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/banner?type=' + encodeURIComponent(bannerActiveType), { headers: headers() });
    const data = await readJsonOrEmpty(res);
    if (res.status === 403) {
      setBannerBanner('개발자 계정으로 로그인하세요.', 'warn');
      return;
    }
    if (!res.ok) {
      setBannerBanner(data.message || '배너 목록 조회 실패 (HTTP ' + res.status + ')', 'error');
      return;
    }
    bannerImages = (data.data?.images || data.images || []).map((item) => ({
      id: item.id || '',
      imageUrl: item.imageUrl || '',
      linkTo: item.linkTo || '',
      alt: item.alt || ''
    }));
    bannerDirty = false;
    bannerHasLoaded = true;
    renderBannerList();
    showToast('배너 ' + bannerImages.length + '개를 불러왔습니다', 'success');
  } catch (e) {
    setBannerBanner('요청 실패: ' + (e.message || ''), 'error');
  } finally {
    bannerIsLoading = false;
    loading.classList.add('hidden');
    btn.textContent = '불러오기';
    updateBannerControls();
  }
};

document.getElementById('btnSaveBanner').onclick = async () => {
  let images;
  try {
    images = normalizeBannerImagesForSave();
  } catch (e) {
    showBannerSaveResult(false, e.message || '배너 입력값을 확인하세요.');
    return;
  }
  const btn = document.getElementById('btnSaveBanner');
  bannerIsSaving = true;
  updateBannerControls();
  clearBannerBanner();
  hideBannerSaveResult();
  btn.textContent = '처리 중...';
  try {
    const res = await fetch(API_BASE + '/api/banner', {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ type: bannerActiveType, images })
    });
    const data = await readJsonOrEmpty(res);
    if (res.status === 403) {
      showBannerSaveResult(false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (!res.ok) {
      showBannerSaveResult(false, data.message || '배너 저장 실패 (HTTP ' + res.status + ')');
      return;
    }
    bannerImages = images.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      linkTo: item.linkTo || '',
      alt: item.alt
    }));
    bannerDirty = false;
    bannerHasLoaded = true;
    renderBannerList();
    showBannerSaveResult(true, data.message || '배너 이미지가 저장되었습니다.');
    showToast('배너 이미지 저장 완료', 'success');
  } catch (e) {
    showBannerSaveResult(false, e.message || '요청 실패');
  } finally {
    bannerIsSaving = false;
    btn.textContent = '변경사항 저장';
    updateBannerControls();
  }
};

clearBannerState();
if (getToken()) loadBannerIfVisible();
