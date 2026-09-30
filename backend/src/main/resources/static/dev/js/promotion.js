// 홍보 게시판 글 작성·수정과 카카오맵 위치 선택

const KAKAO_MAPS_SCRIPT_ID = 'devPortalKakaoMapsSdk';
const DEFAULT_PROMOTION_MAP_CENTER = Object.freeze({ latitude: 35.2338, longitude: 129.0826 });
const DEFAULT_PROMOTION_MAP_ZOOM = 4;
const PROMOTION_FORM_IDS = ['promotionClubId', 'promotionTitle', 'promotionLocation', 'promotionEventStartDate', 'promotionEventEndDate', 'promotionDescription', 'promotionImages'];

let promotionArticles = [];
let promotionEditorMode = 'edit';
let promotionSelectedArticleId = '';
let promotionSelectedOriginal = null;
let promotionHasLoaded = false;
let promotionIsLoading = false;
let promotionIsSaving = false;
let promotionIsUploading = false;
let promotionIsDeleting = false;
let promotionMapSdkPromise = null;
let promotionMap = null;
let promotionMapMarker = null;
let promotionMapKey = '';
let promotionLocationCandidates = [];
let promotionSelectedCandidateKey = '';
let promotionLocationResolvedAddress = '';

function formatPromotionPeriod(article) {
  const start = formatPromotionDate(article?.eventStartDate);
  const end = formatPromotionDate(article?.eventEndDate);
  if (start && end) return start + ' ~ ' + end;
  return start || end || '-';
}

function formatPromotionDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function toDatetimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function getStoredKakaoMapsKey() {
  return promotionMapKey || '';
}

function logPromotionMapDebug(message, extra) {
  if (extra === undefined) {
    console.log('[promotion-map]', message);
    return;
  }
  console.log('[promotion-map]', message, extra);
}

function normalizePromotionCoordinateValue(value) {
  if (value === null || value === undefined || value === '') return '';
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value).trim());
  if (!Number.isFinite(parsed)) return '';
  return parsed.toFixed(7).replace(/0+$/, '').replace(/\.$/, '');
}

function getPromotionCoordinatePair() {
  const latitude = Number.parseFloat(document.getElementById('promotionLatitude').value.trim());
  const longitude = Number.parseFloat(document.getElementById('promotionLongitude').value.trim());
  return {
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null
  };
}

function hasPromotionCoordinates() {
  const pair = getPromotionCoordinatePair();
  return pair.latitude !== null && pair.longitude !== null;
}

function getPromotionLocationCandidateKey(candidate) {
  return (candidate?.title || '') + '|' + (candidate?.displayAddress || '') + '|' + String(candidate?.latitude || '') + '|' + String(candidate?.longitude || '');
}

function normalizePromotionSearchCandidates(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const latitude = Number.parseFloat(item?.y ?? item?.point?.y ?? item?.latitude ?? item?.lat ?? '');
      const longitude = Number.parseFloat(item?.x ?? item?.point?.x ?? item?.longitude ?? item?.lng ?? '');
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
      const roadAddress = String(item?.roadAddress || item?.roadAddr || item?.road_address?.address_name || item?.road_address_name || '').trim();
      const jibunAddress = String(item?.jibunAddress || item?.address || item?.jibunAddr || item?.address_name || '').trim();
      const displayAddress = roadAddress || jibunAddress;
      const title = String(item?.title || item?.place_name || item?.query || displayAddress || '').trim();
      return {
        title: title || displayAddress || '선택 가능한 위치',
        displayAddress: displayAddress || title || '주소 정보 없음',
        roadAddress,
        jibunAddress,
        latitude,
        longitude
      };
    })
    .filter(Boolean);
}

function extractPromotionGeocodeCandidates(response) {
  const candidateSources = [];
  if (Array.isArray(response?.documents)) candidateSources.push(...response.documents);
  if (Array.isArray(response?.v2?.addresses)) candidateSources.push(...response.v2.addresses);
  if (Array.isArray(response?.addresses)) candidateSources.push(...response.addresses);
  if (Array.isArray(response?.result?.items)) candidateSources.push(...response.result.items);
  return normalizePromotionSearchCandidates(candidateSources);
}

function extractPromotionReverseGeocodeAddress(response) {
  const kakaoDoc = Array.isArray(response) ? response[0] : response?.documents?.[0];
  if (kakaoDoc) {
    return String(kakaoDoc?.road_address?.address_name || kakaoDoc?.address?.address_name || '').trim();
  }
  const direct = response?.v2?.address;
  if (direct) {
    return String(direct.roadAddress || direct.jibunAddress || '').trim();
  }
  const results = Array.isArray(response?.v2?.results) ? response.v2.results : [];
  for (const item of results) {
    const regionNames = Array.isArray(item?.region)
      ? item.region.map((region) => String(region?.name || '').trim()).filter(Boolean)
      : Object.values(item?.region || {}).map((region) => String(region?.name || '').trim()).filter(Boolean);
    const land = item?.land || {};
    const extra = [land?.name, land?.number1, land?.number2].map((value) => String(value || '').trim()).filter(Boolean).join(' ');
    const joined = [...regionNames, extra].filter(Boolean).join(' ');
    if (joined) return joined;
  }
  const legacy = Array.isArray(response?.result?.items) ? response.result.items[0] : null;
  return String(legacy?.address || '').trim();
}

function setPromotionMapFallback(message) {
  const fallback = document.getElementById('promotionMapFallback');
  if (promotionMap) {
    fallback.classList.add('hidden');
    return;
  }
  fallback.textContent = message;
  fallback.classList.remove('hidden');
}

function hidePromotionMapFallback() {
  const fallback = document.getElementById('promotionMapFallback');
  fallback.textContent = '';
  fallback.classList.add('hidden');
}

function renderPromotionLocationResults() {
  const list = document.getElementById('promotionLocationSearchResults');
  const empty = document.getElementById('promotionLocationResultEmpty');
  list.innerHTML = '';
  if (!promotionLocationCandidates.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  promotionLocationCandidates.forEach((candidate) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'promotion-location-result';
    const candidateKey = getPromotionLocationCandidateKey(candidate);
    if (candidateKey === promotionSelectedCandidateKey) {
      button.classList.add('is-selected');
    }
    button.innerHTML = ''
      + '<div class="promotion-location-result-title">' + escapeHtml(candidate.title) + '</div>'
      + '<div class="promotion-location-result-address">' + escapeHtml(candidate.displayAddress) + '</div>'
      + '<div class="promotion-location-result-meta">위도 ' + escapeHtml(normalizePromotionCoordinateValue(candidate.latitude))
      + ' / 경도 ' + escapeHtml(normalizePromotionCoordinateValue(candidate.longitude)) + '</div>';
    button.onclick = () => {
      applyPromotionCoordinateSelection(candidate.latitude, candidate.longitude, {
        address: candidate.displayAddress,
        searchQuery: document.getElementById('promotionLocationSearchQuery').value.trim(),
        zoom: DEFAULT_PROMOTION_MAP_ZOOM
      });
      promotionSelectedCandidateKey = candidateKey;
      renderPromotionLocationResults();
    };
    list.appendChild(button);
  });
}

function renderPromotionMapConfigBanner() {
  const banner = document.getElementById('promotionMapConfigBanner');
  const hasKey = !!getStoredKakaoMapsKey();
  banner.classList.toggle('hidden', hasKey);
}

function updatePromotionMapStatus() {
  const status = document.getElementById('promotionMapStatus');
  const hasEditorTarget = !!promotionSelectedArticleId || isPromotionCreateMode();
  const { latitude, longitude } = getPromotionCoordinatePair();
  status.className = 'promotion-map-status';
  if (!hasEditorTarget) {
    status.classList.add('is-muted');
    status.textContent = '게시글을 고르면 위치를 선택할 수 있어요.';
    return;
  }
  if (!getStoredKakaoMapsKey()) {
    status.classList.add('is-warning');
    status.textContent = '카카오 지도 키가 없어 주소 검색과 지도를 쓸 수 없어요.';
    return;
  }
  if (latitude !== null && longitude !== null) {
    const addressText = promotionLocationResolvedAddress ? ' · ' + promotionLocationResolvedAddress : '';
    status.textContent = '좌표 ' + normalizePromotionCoordinateValue(latitude) + ', ' + normalizePromotionCoordinateValue(longitude) + addressText;
    return;
  }
  status.classList.add('is-muted');
  status.textContent = '주소를 검색하거나 지도를 눌러 좌표를 고르세요.';
}

function updatePromotionMapMarker(options) {
  if (!promotionMap || !window.kakao?.maps || !promotionMapMarker) return;
  const latitude = options?.latitude;
  const longitude = options?.longitude;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    promotionMapMarker.setMap(null);
    return;
  }
  const position = new kakao.maps.LatLng(latitude, longitude);
  promotionMapMarker.setPosition(position);
  promotionMapMarker.setMap(promotionMap);
  const shouldMove = options?.move !== false;
  if (shouldMove) {
    promotionMap.setLevel(options?.zoom || DEFAULT_PROMOTION_MAP_ZOOM);
    promotionMap.panTo(position);
  }
}

function applyPromotionCoordinateSelection(latitude, longitude, options) {
  const latValue = normalizePromotionCoordinateValue(latitude);
  const lngValue = normalizePromotionCoordinateValue(longitude);
  document.getElementById('promotionLatitude').value = latValue;
  document.getElementById('promotionLongitude').value = lngValue;
  if (options?.searchQuery) {
    document.getElementById('promotionLocationSearchQuery').value = options.searchQuery;
  }
  promotionLocationResolvedAddress = options?.address || '';
  updatePromotionMapMarker({
    latitude: Number.parseFloat(latValue),
    longitude: Number.parseFloat(lngValue),
    zoom: options?.zoom,
    move: options?.move
  });
  updatePromotionMapStatus();
  updatePromotionEditorState();
}

function clearPromotionCoordinates(options) {
  document.getElementById('promotionLatitude').value = '';
  document.getElementById('promotionLongitude').value = '';
  promotionLocationResolvedAddress = '';
  promotionSelectedCandidateKey = '';
  updatePromotionMapMarker({ latitude: null, longitude: null });
  if (options?.clearQuery) {
    document.getElementById('promotionLocationSearchQuery').value = '';
  }
  renderPromotionLocationResults();
  updatePromotionMapStatus();
  updatePromotionEditorState();
}

function syncPromotionMapFromFormState() {
  const { latitude, longitude } = getPromotionCoordinatePair();
  promotionLocationResolvedAddress = '';
  promotionSelectedCandidateKey = '';
  if (latitude !== null && longitude !== null) {
    updatePromotionMapMarker({ latitude, longitude, move: true, zoom: DEFAULT_PROMOTION_MAP_ZOOM });
  } else {
    updatePromotionMapMarker({ latitude: null, longitude: null });
  }
  updatePromotionMapStatus();
}

async function loadPromotionMapSdk() {
  if (window.kakao?.maps?.services) return window.kakao.maps;
  const key = getStoredKakaoMapsKey();
  logPromotionMapDebug('loadPromotionMapSdk:start', {
    hasKey: !!key,
    keyPreview: key ? key.slice(0, 6) + '...' : '',
    currentHost: window.location.origin
  });
  if (!key) {
    renderPromotionMapConfigBanner();
    throw new Error('카카오 지도 JavaScript 키가 필요합니다.');
  }
  if (promotionMapSdkPromise) return promotionMapSdkPromise;
  promotionMapSdkPromise = new Promise((resolve, reject) => {
    const sdkUrl = 'https://dapi.kakao.com/v2/maps/sdk.js?appkey=' + encodeURIComponent(key) + '&autoload=false&libraries=services';
    const existingScript = document.getElementById(KAKAO_MAPS_SCRIPT_ID);
    if (existingScript) {
      if (existingScript.getAttribute('src') !== sdkUrl) {
        existingScript.remove();
      } else {
        existingScript.addEventListener('load', () => {
          logPromotionMapDebug('loadPromotionMapSdk:existingScriptLoaded');
          window.kakao.maps.load(() => resolve(window.kakao.maps));
        }, { once: true });
        existingScript.addEventListener('error', () => reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.')), { once: true });
        return;
      }
    }
    const script = document.createElement('script');
    script.id = KAKAO_MAPS_SCRIPT_ID;
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => {
      logPromotionMapDebug('loadPromotionMapSdk:scriptLoaded', { sdkUrl });
      window.kakao.maps.load(() => resolve(window.kakao.maps));
    };
    script.onerror = () => {
      logPromotionMapDebug('loadPromotionMapSdk:scriptError', { sdkUrl });
      reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    promotionMapSdkPromise = null;
    logPromotionMapDebug('loadPromotionMapSdk:failed', { message: error?.message || String(error) });
    throw error;
  });
  return promotionMapSdkPromise;
}

async function ensurePromotionMapReady() {
  renderPromotionMapConfigBanner();
  if (promotionMap) {
    if (typeof promotionMap.relayout === 'function') {
      promotionMap.relayout();
    }
    updatePromotionMapStatus();
    return promotionMap;
  }
  try {
    const maps = await loadPromotionMapSdk();
    logPromotionMapDebug('ensurePromotionMapReady:mapsLoaded', {
      hasServices: !!maps?.services,
      center: DEFAULT_PROMOTION_MAP_CENTER
    });
    const mapCenter = new maps.LatLng(DEFAULT_PROMOTION_MAP_CENTER.latitude, DEFAULT_PROMOTION_MAP_CENTER.longitude);
    promotionMap = new maps.Map(document.getElementById('promotionMapCanvas'), {
      center: mapCenter,
      level: DEFAULT_PROMOTION_MAP_ZOOM
    });
    promotionMapMarker = new maps.Marker({ map: null, position: mapCenter });
    const geocoder = new maps.services.Geocoder();
    maps.event.addListener(promotionMap, 'click', async (mouseEvent) => {
      const coord = mouseEvent?.latLng;
      if (!coord) return;
      const latitude = typeof coord.getLat === 'function' ? coord.getLat() : null;
      const longitude = typeof coord.getLng === 'function' ? coord.getLng() : null;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      let address = '';
      try {
        const reverse = await new Promise((resolve, reject) => {
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status !== maps.services.Status.OK) {
              reject(new Error('주소 변환 실패'));
              return;
            }
            resolve(result);
          });
        });
        address = extractPromotionReverseGeocodeAddress(reverse);
      } catch (_) {}
      applyPromotionCoordinateSelection(latitude, longitude, {
        address,
        searchQuery: document.getElementById('promotionLocationSearchQuery').value.trim(),
        zoom: DEFAULT_PROMOTION_MAP_ZOOM
      });
    });
    hidePromotionMapFallback();
    syncPromotionMapFromFormState();
    logPromotionMapDebug('ensurePromotionMapReady:mapCreated');
    return promotionMap;
  } catch (error) {
    setPromotionMapFallback(error.message || '카카오 지도를 준비하지 못했습니다.');
    updatePromotionMapStatus();
    logPromotionMapDebug('ensurePromotionMapReady:failed', { message: error?.message || String(error) });
    throw error;
  }
}

function initializePromotionMapIfVisible() {
  const section = document.getElementById('promotion');
  if (!section || section.classList.contains('hidden')) return;
  if (!getStoredKakaoMapsKey()) return;
  window.requestAnimationFrame(() => {
    ensurePromotionMapReady().catch((error) => {
      logPromotionMapDebug('initializePromotionMapIfVisible:failed', { message: error?.message || String(error) });
    });
  });
}

async function searchPromotionLocations() {
  const query = document.getElementById('promotionLocationSearchQuery').value.trim();
  if (!query) {
    throw new Error('좌표를 찾을 주소나 건물명을 입력하세요.');
  }
  const maps = await loadPromotionMapSdk();
  await ensurePromotionMapReady();
  const geocoder = new maps.services.Geocoder();
  const places = new maps.services.Places();
  const [addressCandidates, placeCandidates] = await Promise.all([
    new Promise((resolve) => {
      geocoder.addressSearch(query, (result, status) => {
        if (status === maps.services.Status.OK) {
          resolve(normalizePromotionSearchCandidates(result));
          return;
        }
        resolve([]);
      });
    }),
    new Promise((resolve) => {
      places.keywordSearch(query, (result, status) => {
        if (status === maps.services.Status.OK) {
          resolve(normalizePromotionSearchCandidates(result));
          return;
        }
        resolve([]);
      });
    })
  ]);
  const candidates = [...addressCandidates, ...placeCandidates].filter((candidate, index, arr) => {
    const candidateKey = getPromotionLocationCandidateKey(candidate);
    return arr.findIndex((item) => getPromotionLocationCandidateKey(item) === candidateKey) === index;
  });
  if (!candidates.length) {
    throw new Error('검색 결과가 없습니다. 장소명을 더 구체적으로 입력해보세요.');
  }
  promotionLocationCandidates = candidates;
  promotionSelectedCandidateKey = '';
  renderPromotionLocationResults();
  const primary = candidates[0];
  applyPromotionCoordinateSelection(primary.latitude, primary.longitude, {
    address: primary.displayAddress,
    searchQuery: query,
    zoom: DEFAULT_PROMOTION_MAP_ZOOM
  });
  promotionSelectedCandidateKey = getPromotionLocationCandidateKey(primary);
  renderPromotionLocationResults();
}

function normalizePromotionImagesText(images) {
  return (Array.isArray(images) ? images : []).map((item) => String(item || '').trim()).filter(Boolean).join('\n');
}

function promotionArticleToFormState(article) {
  return {
    clubId: article?.clubId || '',
    title: article?.title || '',
    location: article?.location || '',
    latitude: normalizePromotionCoordinateValue(article?.latitude),
    longitude: normalizePromotionCoordinateValue(article?.longitude),
    eventStartDate: toDatetimeLocalValue(article?.eventStartDate),
    eventEndDate: toDatetimeLocalValue(article?.eventEndDate),
    description: article?.description || '',
    imagesText: normalizePromotionImagesText(article?.images)
  };
}

function getEmptyPromotionFormState() {
  return {
    clubId: '',
    title: '',
    location: '',
    latitude: '',
    longitude: '',
    eventStartDate: '',
    eventEndDate: '',
    description: '',
    imagesText: ''
  };
}

function isPromotionCreateMode() {
  return promotionEditorMode === 'create';
}

function confirmPromotionDiscard(kind) {
  // 새 글 작성 중 목록만 새로고침하면 작성 내용은 그대로 남는다.
  if (kind === 'reload' && isPromotionCreateMode()) {
    return confirmDialog({ title: '목록만 새로고침할까요?', message: '작성 중인 새 게시글은 그대로 남아요.', confirmLabel: '새로고침' });
  }
  return confirmDialog({
    title: '저장하지 않은 변경사항이 있어요',
    message: kind === 'reload' ? '새로고침하면 수정한 내용이 사라져요.' : '넘어가면 작성·수정한 내용이 사라져요.',
    confirmLabel: '버리기',
    danger: true
  });
}

function getPromotionCurrentFormState() {
  return {
    clubId: document.getElementById('promotionClubId').value.trim(),
    title: document.getElementById('promotionTitle').value,
    location: document.getElementById('promotionLocation').value,
    latitude: document.getElementById('promotionLatitude').value.trim(),
    longitude: document.getElementById('promotionLongitude').value.trim(),
    eventStartDate: document.getElementById('promotionEventStartDate').value,
    eventEndDate: document.getElementById('promotionEventEndDate').value,
    description: document.getElementById('promotionDescription').value,
    imagesText: document.getElementById('promotionImages').value
  };
}

function isPromotionDirty() {
  if (!promotionSelectedOriginal) return false;
  return JSON.stringify(getPromotionCurrentFormState()) !== JSON.stringify(promotionSelectedOriginal);
}

function fillPromotionForm(state) {
  document.getElementById('promotionClubId').value = state?.clubId || '';
  document.getElementById('promotionTitle').value = state?.title || '';
  document.getElementById('promotionLocation').value = state?.location || '';
  document.getElementById('promotionLatitude').value = state?.latitude || '';
  document.getElementById('promotionLongitude').value = state?.longitude || '';
  document.getElementById('promotionEventStartDate').value = state?.eventStartDate || '';
  document.getElementById('promotionEventEndDate').value = state?.eventEndDate || '';
  document.getElementById('promotionDescription').value = state?.description || '';
  document.getElementById('promotionImages').value = state?.imagesText || '';
  syncPromotionMapFromFormState();
  renderPromotionImagePreviewList();
  updatePromotionEditorState();
}

function clearPromotionBanner() {
  const banner = document.getElementById('promotionBanner');
  banner.textContent = '';
  banner.className = 'banner hidden';
}

function setPromotionBanner(message, type) {
  const banner = document.getElementById('promotionBanner');
  banner.textContent = message;
  banner.className = 'banner ' + (type || 'warn');
  banner.classList.remove('hidden');
}

function hidePromotionSaveResult() {
  document.getElementById('promotionSaveResult').classList.add('hidden');
}

function showPromotionSaveResult(ok, message) {
  setMessageBox('promotionSaveResult', ok, message);
}

function getApiSuccessMessage(data, fallback) {
  if (typeof data?.data === 'string' && data.data.trim()) return data.data;
  if (typeof data?.message === 'string' && data.message.trim() && data.message !== 'ok') return data.message;
  return fallback;
}

function updatePromotionEditorState() {
  const hasSelection = !!promotionSelectedArticleId;
  const isCreateMode = isPromotionCreateMode();
  const hasEditorTarget = hasSelection || isCreateMode;
  const busy = promotionIsLoading || promotionIsSaving || promotionIsUploading || promotionIsDeleting;
  const dirty = isPromotionDirty();
  renderPromotionMapConfigBanner();
  updatePromotionMapStatus();
  const badge = document.getElementById('promotionEditingBadge');
  const summary = document.getElementById('promotionSelectionSummary');
  const help = document.getElementById('promotionHelpText');
  const selected = promotionArticles.find((article) => article.id === promotionSelectedArticleId);
  const clubIdInput = document.getElementById('promotionClubId');
  const imageUploadFile = document.getElementById('promotionImageUploadFile');
  const locationSearchQuery = document.getElementById('promotionLocationSearchQuery');
  const btnUpload = document.getElementById('btnUploadPromotionImage');
  const btnLoad = document.getElementById('btnLoadPromotion');
  const btnCreate = document.getElementById('btnCreatePromotion');
  const btnSave = document.getElementById('btnSavePromotion');
  const btnReset = document.getElementById('btnResetPromotion');
  const btnDelete = document.getElementById('btnDeletePromotion');
  const btnClear = document.getElementById('btnClearPromotionSelection');
  const btnSearchLocation = document.getElementById('btnPromotionSearchLocation');
  const btnLocationSearch = document.getElementById('btnPromotionLocationSearch');
  const btnClearCoordinates = document.getElementById('btnPromotionClearCoordinates');

  PROMOTION_FORM_IDS.forEach((id) => {
    const el = document.getElementById(id);
    el.disabled = busy || !hasEditorTarget;
  });
  clubIdInput.disabled = busy || !hasEditorTarget;
  clubIdInput.readOnly = !isCreateMode;
  document.getElementById('promotionLatitude').disabled = true;
  document.getElementById('promotionLongitude').disabled = true;
  locationSearchQuery.disabled = busy || !hasEditorTarget || !getStoredKakaoMapsKey();
  imageUploadFile.disabled = busy || !hasEditorTarget;
  btnUpload.disabled = busy || !hasEditorTarget;
  btnLoad.disabled = busy;
  btnCreate.disabled = busy;
  btnSave.disabled = busy || !hasEditorTarget;
  btnReset.disabled = busy || !hasEditorTarget || !dirty;
  btnDelete.disabled = busy || !hasSelection || isCreateMode;
  btnClear.disabled = busy || !hasEditorTarget;
  btnSearchLocation.disabled = busy || !hasEditorTarget;
  btnLocationSearch.disabled = busy || !hasEditorTarget || !getStoredKakaoMapsKey();
  btnClearCoordinates.disabled = busy || !hasEditorTarget || !hasPromotionCoordinates();
  btnSave.textContent = promotionIsSaving
    ? (isCreateMode ? '생성 중...' : '저장 중...')
    : (isCreateMode ? '생성' : '저장');
  btnDelete.textContent = promotionIsDeleting ? '삭제 중...' : '삭제';

  // 편집 대상이 없으면 비활성 폼 대신 안내만 보여준다. 숨겨져 있다 다시 보이면 지도 크기를 다시 잡는다.
  const editorBody = document.getElementById('promotionEditorBody');
  const wasEditorHidden = editorBody.classList.contains('hidden');
  editorBody.classList.toggle('hidden', !hasEditorTarget);
  document.getElementById('promotionEditorEmpty').classList.toggle('hidden', hasEditorTarget);
  if (wasEditorHidden && hasEditorTarget) initializePromotionMapIfVisible();

  if (isCreateMode) {
    badge.textContent = dirty ? '새 게시글 · 저장 안 됨' : '새 게시글 작성 중';
    badge.classList.remove('hidden');
    summary.textContent = 'clubId를 입력하고 저장하세요.';
    help.textContent = '이미지를 먼저 올리면 게시글이 먼저 만들어져요.';
    return;
  }

  help.textContent = '';

  if (!hasSelection) {
    badge.classList.add('hidden');
    badge.textContent = '';
    summary.textContent = '';
    return;
  }

  badge.textContent = (dirty ? '저장 안 됨' : '편집 중') + ' · ' + (selected?.title || '제목 없음');
  badge.classList.remove('hidden');
  summary.textContent = (selected?.clubName || '-') + ' / ' + formatPromotionPeriod(selected) + '';
}

function renderPromotionList() {
  const tbody = document.querySelector('#promotionList tbody');
  const summary = document.getElementById('promotionSummary');
  tbody.innerHTML = '';
  if (!promotionArticles.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.textContent = promotionHasLoaded ? '등록된 홍보 게시글이 없어요.' : '홍보 게시글 목록을 불러오세요.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    summary.textContent = promotionHasLoaded ? '총 0개 게시글' : '홍보 게시글 목록을 불러오세요.';
    updatePromotionEditorState();
    return;
  }

  summary.textContent = '총 ' + promotionArticles.length + '개 게시글';
  promotionArticles.forEach((article) => {
    const tr = document.createElement('tr');
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', (article.title || '홍보 게시글') + ' 편집 선택');
    if (article.id === promotionSelectedArticleId) {
      tr.classList.add('is-selected');
      tr.setAttribute('aria-selected', 'true');
    } else {
      tr.setAttribute('aria-selected', 'false');
    }
    tr.appendChild(document.createElement('td')).textContent = article.title || '';
    tr.appendChild(document.createElement('td')).textContent = article.clubName || '-';
    tr.appendChild(document.createElement('td')).textContent = article.location || '-';
    tr.appendChild(document.createElement('td')).textContent = formatPromotionPeriod(article);
    tr.appendChild(document.createElement('td')).textContent = String((article.images || []).length);
    const selectCurrentArticle = async () => {
      const previousId = promotionSelectedArticleId;
      await selectPromotionArticle(article.id);
      // 편집기는 항상 목록 아래에 있어서, 실제로 선택이 바뀌었을 때만 내려준다.
      if (promotionSelectedArticleId !== previousId) {
        document.getElementById('promotionEditorBody').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    tr.onclick = selectCurrentArticle;
    tr.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCurrentArticle();
      }
    };
    tbody.appendChild(tr);
  });
  updatePromotionEditorState();
}

async function reloadPromotionList(options) {
  const selectedArticleId = options?.selectedArticleId ?? promotionSelectedArticleId;
  const keepMessage = !!options?.keepMessage;
  const preserveEditorOnError = !!options?.preserveEditorOnError;
  const res = await fetch(API_BASE + '/api/promotion', { headers: headers() });
  const data = await readJsonOrEmpty(res);

  if (!res.ok) {
    setPromotionBanner(data.message || '홍보 게시글 목록 조회 실패 (HTTP ' + res.status + ')', res.status === 403 ? 'warn' : 'error');
    promotionArticles = [];
    promotionHasLoaded = true;
    if (preserveEditorOnError) {
      renderPromotionList();
      updatePromotionEditorState();
    } else {
      clearPromotionSelection({ keepMessage: true });
    }
    return { ok: false, data, status: res.status };
  }

  promotionArticles = data.data?.articles || data.articles || [];
  promotionHasLoaded = true;

  if (selectedArticleId) {
    const selected = promotionArticles.find((article) => article.id === selectedArticleId);
    if (selected) {
      promotionEditorMode = 'edit';
      promotionSelectedArticleId = selected.id || '';
      promotionSelectedOriginal = promotionArticleToFormState(selected);
      fillPromotionForm(promotionSelectedOriginal);
      renderPromotionList();
    } else {
      clearPromotionSelection({ keepMessage: true });
    }
  } else if (!isPromotionCreateMode()) {
    renderPromotionList();
    updatePromotionEditorState();
  } else {
    renderPromotionList();
    updatePromotionEditorState();
  }

  if (!keepMessage) hidePromotionSaveResult();
  if (!promotionArticles.length) {
    setPromotionBanner('등록된 홍보 게시글이 없어요.', 'warn');
  }
  return { ok: true, data, status: res.status };
}

function parsePromotionImageUrls() {
  return document.getElementById('promotionImages').value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function writePromotionImageUrls(urls) {
  const normalizedUrls = Array.from(new Set((Array.isArray(urls) ? urls : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean)));
  document.getElementById('promotionImages').value = normalizedUrls.join('\n');
  renderPromotionImagePreviewList();
  updatePromotionEditorState();
}

function removePromotionImageAt(index) {
  const urls = parsePromotionImageUrls();
  if (index < 0 || index >= urls.length) return;
  urls.splice(index, 1);
  writePromotionImageUrls(urls);
}

function createPromotionPreviewCard(url, index) {
  const card = document.createElement('div');
  card.className = 'promotion-preview-card';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'promotion-preview-image';
  const safeUrl = toSafeHttpUrl(url);

  const placeholder = document.createElement('div');
  placeholder.className = 'promotion-preview-placeholder';
  placeholder.textContent = safeUrl ? '이미지를 불러올 수 없어요.' : 'http/https 이미지 URL만 미리보기할 수 있습니다.';

  if (safeUrl) {
    const img = document.createElement('img');
    img.alt = '홍보 이미지 ' + (index + 1);
    img.src = safeUrl;

    img.addEventListener('error', () => {
      img.classList.add('hidden');
      placeholder.classList.remove('hidden');
    });
    img.addEventListener('load', () => {
      img.classList.remove('hidden');
      placeholder.classList.add('hidden');
    });

    imageWrap.appendChild(img);
  }
  imageWrap.appendChild(placeholder);

  const body = document.createElement('div');
  body.className = 'promotion-preview-body';

  const link = safeUrl ? document.createElement('a') : document.createElement('span');
  if (safeUrl) {
    link.href = safeUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  }
  link.className = 'promotion-preview-url';
  link.textContent = url;

  const actions = document.createElement('div');
  actions.className = 'promotion-preview-actions';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.textContent = '복사';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(url);
    showToast('이미지 URL 복사됨', 'success');
  };

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = '제거';
  removeBtn.disabled = promotionIsLoading || promotionIsSaving || promotionIsUploading || promotionIsDeleting || (!promotionSelectedArticleId && !isPromotionCreateMode());
  removeBtn.onclick = () => {
    removePromotionImageAt(index);
  };

  actions.appendChild(copyBtn);
  actions.appendChild(removeBtn);
  body.appendChild(link);
  body.appendChild(actions);
  card.appendChild(imageWrap);
  card.appendChild(body);
  return card;
}

function renderPromotionImagePreviewList() {
  const list = document.getElementById('promotionImagePreviewList');
  const empty = document.getElementById('promotionImagePreviewEmpty');
  const urls = parsePromotionImageUrls();
  list.innerHTML = '';
  if (!urls.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  urls.forEach((url, index) => {
    list.appendChild(createPromotionPreviewCard(url, index));
  });
}

function clearPromotionSelection(options) {
  const keepMessage = !!options?.keepMessage;
  promotionEditorMode = 'edit';
  promotionSelectedArticleId = '';
  promotionSelectedOriginal = null;
  fillPromotionForm(null);
  if (!keepMessage) hidePromotionSaveResult();
  renderPromotionList();
}

async function enterPromotionCreateMode() {
  if (isPromotionDirty() && !(await confirmPromotionDiscard('clear'))) return;
  promotionEditorMode = 'create';
  promotionSelectedArticleId = '';
  promotionSelectedOriginal = getEmptyPromotionFormState();
  fillPromotionForm(promotionSelectedOriginal);
  clearPromotionBanner();
  hidePromotionSaveResult();
  renderPromotionList();
}

async function selectPromotionArticle(articleId, options) {
  const next = promotionArticles.find((article) => article.id === articleId);
  if (!next) return;
  const shouldConfirm = isPromotionDirty()
    && !options?.skipConfirm
    && (isPromotionCreateMode() || promotionSelectedArticleId !== articleId);
  if (shouldConfirm) {
    if (!(await confirmPromotionDiscard('clear'))) {
      return;
    }
  }
  promotionEditorMode = 'edit';
  promotionSelectedArticleId = next.id || '';
  promotionSelectedOriginal = promotionArticleToFormState(next);
  fillPromotionForm(promotionSelectedOriginal);
  hidePromotionSaveResult();
  renderPromotionList();
}

function normalizePromotionPayload(options) {
  const requireImages = options?.requireImages !== false;
  const form = getPromotionCurrentFormState();
  const clubId = form.clubId.trim();
  const title = form.title.trim();
  const location = form.location.trim();
  const latitude = Number.parseFloat(form.latitude);
  const longitude = Number.parseFloat(form.longitude);
  const eventStartDate = form.eventStartDate.trim();
  const eventEndDate = form.eventEndDate.trim();
  const description = form.description.trim();
  const images = form.imagesText.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);

  if (!clubId || !title || !location || !eventStartDate || !eventEndDate || !description) {
    throw new Error('필수 입력값을 모두 채우세요.');
  }
  if (requireImages && !images.length) throw new Error('이미지 URL을 1개 이상 입력하세요.');

  const startDate = new Date(eventStartDate);
  const endDate = new Date(eventEndDate);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new Error('행사 시작/종료 일시를 확인하세요.');
  }
  if (startDate.getTime() > endDate.getTime()) {
    throw new Error('행사 시작일은 종료일보다 늦을 수 없어요.');
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('지도에서 위치를 선택해 위도/경도를 확정하세요.');
  }
  return {
    clubId,
    title,
    location,
    latitude,
    longitude,
    eventStartDate: startDate.toISOString(),
    eventEndDate: endDate.toISOString(),
    description,
    images
  };
}

async function createPromotionArticleRequest(payload) {
  const res = await fetch(API_BASE + '/api/promotion', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload)
  });
  const data = await readJsonOrEmpty(res);
  return { res, data };
}

async function updatePromotionArticleRequest(articleId, payload) {
  const res = await fetch(API_BASE + '/api/promotion/' + encodeURIComponent(articleId), {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(payload)
  });
  const data = await readJsonOrEmpty(res);
  return { res, data };
}

async function uploadPromotionImageRequest(articleId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(API_BASE + '/api/promotion/' + encodeURIComponent(articleId) + '/upload', {
    method: 'POST',
    headers: buildBannerUploadHeaders(),
    body: formData
  });
  const data = await readJsonOrEmpty(res);
  return { res, data };
}

async function deletePromotionArticleRequest(articleId) {
  const res = await fetch(API_BASE + '/api/promotion/' + encodeURIComponent(articleId), {
    method: 'DELETE',
    headers: headers()
  });
  const data = await readJsonOrEmpty(res);
  return { res, data };
}

function clearPromotionState() {
  promotionArticles = [];
  promotionEditorMode = 'edit';
  promotionSelectedArticleId = '';
  promotionSelectedOriginal = null;
  promotionHasLoaded = false;
  promotionIsLoading = false;
  promotionIsSaving = false;
  promotionIsUploading = false;
  promotionIsDeleting = false;
  promotionLocationCandidates = [];
  promotionSelectedCandidateKey = '';
  promotionLocationResolvedAddress = '';
  document.getElementById('promotionListLoading').classList.add('hidden');
  document.getElementById('promotionImageUploadFile').value = '';
  document.getElementById('promotionLocationSearchQuery').value = '';
  clearPromotionBanner();
  hidePromotionSaveResult();
  renderPromotionMapConfigBanner();
  renderPromotionLocationResults();
  setPromotionMapFallback(getStoredKakaoMapsKey()
    ? '지도 준비 중입니다. 위치 검색을 실행하면 실제 지도가 표시됩니다.'
    : '카카오 지도 JavaScript 키를 저장하면 실제 지도가 이 영역에 표시됩니다.');
  fillPromotionForm(null);
  renderPromotionImagePreviewList();
  renderPromotionList();
  initializePromotionMapIfVisible();
}

function loadPromotionIfVisible() {
  const section = document.getElementById('promotion');
  if (section && !section.classList.contains('hidden') && !promotionHasLoaded) {
    document.getElementById('btnLoadPromotion').click();
  }
  initializePromotionMapIfVisible();
}

document.getElementById('btnLoadPromotion').onclick = async () => {
  if (isPromotionDirty() && !(await confirmPromotionDiscard('reload'))) return;
  const btn = document.getElementById('btnLoadPromotion');
  const loading = document.getElementById('promotionListLoading');
  promotionIsLoading = true;
  updatePromotionEditorState();
  clearPromotionBanner();
  hidePromotionSaveResult();
  loading.classList.remove('hidden');
  btn.textContent = '처리 중...';
  try {
    await reloadPromotionList({
      selectedArticleId: promotionSelectedArticleId,
      keepMessage: true,
      preserveEditorOnError: isPromotionCreateMode()
    });
  } catch (e) {
    setPromotionBanner('요청 실패: ' + (e.message || ''), 'error');
    promotionArticles = [];
    promotionHasLoaded = false;
    if (isPromotionCreateMode()) {
      renderPromotionList();
      updatePromotionEditorState();
    } else {
      clearPromotionSelection({ keepMessage: true });
    }
  } finally {
    promotionIsLoading = false;
    loading.classList.add('hidden');
    btn.textContent = '새로고침';
    renderPromotionList();
  }
};

document.getElementById('btnCreatePromotion').onclick = () => {
  enterPromotionCreateMode();
};

document.getElementById('btnResetPromotion').onclick = () => {
  if (!promotionSelectedOriginal) return;
  fillPromotionForm(promotionSelectedOriginal);
  hidePromotionSaveResult();
};

document.getElementById('btnClearPromotionSelection').onclick = async () => {
  if (isPromotionDirty() && !(await confirmPromotionDiscard('clear'))) return;
  clearPromotionSelection();
};

document.getElementById('btnDeletePromotion').onclick = async () => {
  const selectedId = promotionSelectedArticleId;
  const selectedArticle = promotionArticles.find((article) => article.id === selectedId);
  if (!selectedId || !selectedArticle) {
    showPromotionSaveResult(false, '삭제할 홍보 게시글을 먼저 선택하세요.');
    return;
  }

  const confirmed = await confirmDialog({
    title: '이 게시글을 삭제할까요?',
    message: '삭제하면 되돌릴 수 없어요.' + (isPromotionDirty() ? ' 저장하지 않은 수정 내용도 함께 사라져요.' : ''),
    details: [['제목', selectedArticle.title || '(제목 없음)']],
    confirmLabel: '삭제',
    danger: true
  });
  if (!confirmed) return;

  promotionIsDeleting = true;
  updatePromotionEditorState();
  clearPromotionBanner();
  hidePromotionSaveResult();

  try {
    const { res, data } = await deletePromotionArticleRequest(selectedId);
    if (res.status === 403) {
      showPromotionSaveResult(false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (res.status === 404) {
      if (data.statuscode === '902-1') {
        promotionArticles = promotionArticles.filter((article) => article.id !== selectedId);
        clearPromotionSelection({ keepMessage: true });
        showPromotionSaveResult(false, data.message || '선택한 홍보 게시글을 찾을 수 없습니다. 목록을 새로고침하세요.');
      } else {
        showPromotionSaveResult(false, data.message || '홍보 게시글 삭제 실패 (HTTP ' + res.status + ')');
      }
      return;
    }
    if (!res.ok) {
      showPromotionSaveResult(false, data.message || '홍보 게시글 삭제 실패 (HTTP ' + res.status + ')');
      return;
    }

    const deleteSuccessMessage = getApiSuccessMessage(data, '홍보 게시글이 삭제되었습니다.');
    const syncResult = await reloadPromotionList({ keepMessage: true });
    if (!syncResult.ok) {
      clearPromotionSelection({ keepMessage: true });
      showPromotionSaveResult(true, deleteSuccessMessage);
      setPromotionBanner('삭제는 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
      return;
    }

    clearPromotionSelection({ keepMessage: true });
    clearPromotionBanner();
    showPromotionSaveResult(true, deleteSuccessMessage);
    showToast('홍보 게시글 삭제 완료', 'success');
  } catch (e) {
    showPromotionSaveResult(false, e.message || '요청 실패');
  } finally {
    promotionIsDeleting = false;
    updatePromotionEditorState();
  }
};

function extractCreatedPromotionId(data) {
  return data?.data?.articleId || data?.data?.id || data?.articleId || data?.id || '';
}

function findCreatedPromotionId(payload, articles) {
  const matched = (Array.isArray(articles) ? articles : []).filter((article) => {
    return article?.clubId === payload.clubId
      && article?.title === payload.title
      && article?.location === payload.location
      && Number(article?.latitude) === Number(payload.latitude)
      && Number(article?.longitude) === Number(payload.longitude)
      && article?.eventStartDate === payload.eventStartDate
      && article?.eventEndDate === payload.eventEndDate
      && article?.description === payload.description
      && JSON.stringify(article?.images || []) === JSON.stringify(payload.images || []);
  });
  if (!matched.length) return '';
  const matchedWithCreatedAt = matched.filter((article) => article?.createdAt);
  if (matchedWithCreatedAt.length) {
    matchedWithCreatedAt.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return matchedWithCreatedAt[0]?.id || '';
  }
  // API 목록은 createdAt desc로 내려오므로 createdAt이 없으면 현재 순서의 첫 항목을 최신으로 간주한다.
  return matched[0]?.id || '';
}

document.getElementById('btnSavePromotion').onclick = async () => {
  let payload;
  try {
    payload = normalizePromotionPayload();
  } catch (e) {
    showPromotionSaveResult(false, e.message || '입력값을 확인하세요.');
    return;
  }

  promotionIsSaving = true;
  updatePromotionEditorState();
  clearPromotionBanner();
  hidePromotionSaveResult();
  try {
    if (isPromotionCreateMode()) {
      const createResult = await createPromotionArticleRequest(payload);
      const createRes = createResult.res;
      const createData = createResult.data;
      if (createRes.status === 403) {
        showPromotionSaveResult(false, '개발자 계정으로 로그인하세요.');
        return;
      }
      if (!createRes.ok) {
        showPromotionSaveResult(false, createData.message || '홍보 게시글 생성 실패 (HTTP ' + createRes.status + ')');
        return;
      }
      const createSuccessMessage = getApiSuccessMessage(createData, '홍보 게시글이 생성되었습니다.');

      const syncResult = await reloadPromotionList({ keepMessage: true });
      if (!syncResult.ok) {
        showPromotionSaveResult(true, createSuccessMessage);
        setPromotionBanner('생성은 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
        return;
      }

      const createdId = extractCreatedPromotionId(createData) || findCreatedPromotionId(payload, promotionArticles);
      if (createdId) {
        selectPromotionArticle(createdId, { skipConfirm: true });
      } else {
        promotionEditorMode = 'edit';
        clearPromotionSelection({ keepMessage: true });
        setPromotionBanner('홍보 게시글은 생성되었지만 자동 선택에 실패했습니다. 목록에서 직접 선택하세요.', 'warn');
      }

      showPromotionSaveResult(true, createSuccessMessage);
      showToast('홍보 게시글 생성 완료', 'success');
      return;
    }

    if (!promotionSelectedArticleId) {
      showPromotionSaveResult(false, '수정할 홍보 게시글을 먼저 선택하세요.');
      return;
    }

    const res = await fetch(API_BASE + '/api/promotion/' + encodeURIComponent(promotionSelectedArticleId), {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(payload)
    });
    const data = await readJsonOrEmpty(res);
    if (res.status === 403) {
      showPromotionSaveResult(false, '개발자 계정으로 로그인하세요.');
      return;
    }
    if (res.status === 404) {
      if (data.statuscode === '902-1') {
        promotionArticles = promotionArticles.filter((article) => article.id !== promotionSelectedArticleId);
        clearPromotionSelection({ keepMessage: true });
        showPromotionSaveResult(false, data.message || '선택한 홍보 게시글을 찾을 수 없습니다. 목록을 새로고침하세요.');
      } else {
        showPromotionSaveResult(false, data.message || '홍보 게시글 저장 실패 (HTTP ' + res.status + ')');
      }
      return;
    }
    if (!res.ok) {
      showPromotionSaveResult(false, data.message || '홍보 게시글 저장 실패 (HTTP ' + res.status + ')');
      return;
    }
    const updateSuccessMessage = getApiSuccessMessage(data, '홍보 게시글이 저장되었습니다.');

    const selectedId = promotionSelectedArticleId;
    const syncResult = await reloadPromotionList({ selectedArticleId: selectedId, keepMessage: true });
    if (!syncResult.ok) {
      showPromotionSaveResult(true, updateSuccessMessage);
      setPromotionBanner('저장은 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
      return;
    }

    showPromotionSaveResult(true, updateSuccessMessage);
    showToast('홍보 게시글 저장 완료', 'success');
  } catch (e) {
    showPromotionSaveResult(false, e.message || '요청 실패');
  } finally {
    promotionIsSaving = false;
    updatePromotionEditorState();
  }
};

PROMOTION_FORM_IDS.forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    if (id === 'promotionImages') renderPromotionImagePreviewList();
    updatePromotionEditorState();
  });
});

document.getElementById('btnPromotionSearchLocation').onclick = async () => {
  if (!getStoredKakaoMapsKey()) {
    renderPromotionMapConfigBanner();
    setPromotionBanner('서버에 카카오 지도 JavaScript 키를 먼저 설정하세요.', 'warn');
    return;
  }
  try {
    await ensurePromotionMapReady();
    document.getElementById('promotionLocationSearchQuery').focus();
  } catch (e) {
    setPromotionBanner(e.message || '카카오 지도 초기화 실패', 'error');
  }
};

document.getElementById('btnPromotionLocationSearch').onclick = async () => {
  try {
    await searchPromotionLocations();
  } catch (e) {
    setPromotionBanner(e.message || '장소 검색 실패', 'error');
  }
};

document.getElementById('promotionLocationSearchQuery').addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  try {
    await searchPromotionLocations();
  } catch (e) {
    setPromotionBanner(e.message || '장소 검색 실패', 'error');
  }
});

document.getElementById('btnPromotionClearCoordinates').onclick = () => {
  clearPromotionCoordinates();
};

renderPromotionMapConfigBanner();
renderPromotionLocationResults();
updatePromotionMapStatus();

document.getElementById('btnUploadPromotionImage').onclick = async () => {
  const fileInput = document.getElementById('promotionImageUploadFile');
  if (!promotionSelectedArticleId && !isPromotionCreateMode()) {
    showToast('수정할 홍보 게시글을 먼저 선택하세요.', 'error');
    return;
  }
  if (!fileInput.files || !fileInput.files.length) {
    showToast('업로드할 이미지를 선택하세요.', 'error');
    return;
  }

  const files = Array.from(fileInput.files);
  const btn = document.getElementById('btnUploadPromotionImage');

  promotionIsUploading = true;
  updatePromotionEditorState();
  clearPromotionBanner();
  btn.textContent = isPromotionCreateMode() ? '생성 후 업로드 중... (0/' + files.length + ')' : '업로드 중... (0/' + files.length + ')';
  try {
    let targetArticleId = promotionSelectedArticleId;

    if (isPromotionCreateMode()) {
      let createPayload;
      try {
        createPayload = normalizePromotionPayload({ requireImages: false });
      } catch (e) {
        setPromotionBanner(e.message || '이미지 업로드 전 게시글 정보를 확인하세요.', 'error');
        return;
      }

      const createResult = await createPromotionArticleRequest(createPayload);
      const createRes = createResult.res;
      const createData = createResult.data;
      if (createRes.status === 403) {
        setPromotionBanner('개발자 계정으로 로그인하세요.', 'warn');
        return;
      }
      if (!createRes.ok) {
        setPromotionBanner(createData.message || '홍보 게시글 생성 실패 (HTTP ' + createRes.status + ')', 'error');
        return;
      }

      targetArticleId = extractCreatedPromotionId(createData);
      if (!targetArticleId) {
        const syncAfterCreate = await reloadPromotionList({ keepMessage: true });
        if (!syncAfterCreate.ok) {
          setPromotionBanner('게시글 생성 후 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
          return;
        }
        targetArticleId = findCreatedPromotionId(createPayload, promotionArticles);
      }
      if (!targetArticleId) {
        setPromotionBanner('게시글은 생성되었지만 articleId를 확인하지 못했습니다. 목록에서 직접 선택한 뒤 다시 업로드하세요.', 'warn');
        return;
      }

      const syncCreated = await reloadPromotionList({ selectedArticleId: targetArticleId, keepMessage: true });
      if (!syncCreated.ok) {
        setPromotionBanner('게시글은 생성되었지만 편집 상태 동기화에 실패했습니다. 목록에서 직접 선택한 뒤 다시 시도하세요.', 'warn');
        return;
      }
    }

    const uploadedUrls = [];
    const handlePartialUploadFailure = async (message, tone) => {
      if (!uploadedUrls.length) {
        setPromotionBanner(message, tone || 'error');
        return false;
      }
      const urls = parsePromotionImageUrls();
      urls.push(...uploadedUrls);
      writePromotionImageUrls(urls);
      fileInput.value = '';
      const syncResult = await reloadPromotionList({ selectedArticleId: targetArticleId, keepMessage: true });
      const syncMessage = syncResult.ok ? '' : ' 목록 동기화에도 실패했으니 새로고침해 확인하세요.';
      setPromotionBanner('이미지 ' + uploadedUrls.length + '개는 업로드되었습니다. ' + message + syncMessage, tone || 'warn');
      return true;
    };
    for (const [index, file] of files.entries()) {
      btn.textContent = '업로드 중... (' + (index + 1) + '/' + files.length + ')';
      const uploadResult = await uploadPromotionImageRequest(targetArticleId, file);
      const res = uploadResult.res;
      const data = uploadResult.data;
      if (res.status === 404) {
        if (data.statuscode === '902-1') {
          const hasPartialUpload = await handlePartialUploadFailure('선택한 홍보 게시글을 찾을 수 없습니다. 목록을 새로고침한 뒤 다시 시도하세요.', 'error');
          if (!hasPartialUpload) {
            promotionArticles = promotionArticles.filter((article) => article.id !== targetArticleId);
            clearPromotionSelection({ keepMessage: true });
          }
        } else {
          await handlePartialUploadFailure(data.message || '홍보 이미지 업로드 실패 (HTTP ' + res.status + ')', 'error');
        }
        return;
      }
      if (res.status === 403) {
        await handlePartialUploadFailure('개발자 계정으로 로그인하세요.', 'warn');
        return;
      }
      if (!res.ok) {
        await handlePartialUploadFailure(data.message || file.name + ' 업로드 실패 (HTTP ' + res.status + ')', 'error');
        return;
      }

      const imageUrl = data.data?.imageUrl;
      if (!imageUrl) {
        await handlePartialUploadFailure(file.name + ' 업로드 결과 URL을 확인할 수 없어요.', 'error');
        return;
      }
      uploadedUrls.push(imageUrl);
    }

    const urls = parsePromotionImageUrls();
    urls.push(...uploadedUrls);
    writePromotionImageUrls(urls);
    fileInput.value = '';

    if (targetArticleId) {
      const syncResult = await reloadPromotionList({ selectedArticleId: targetArticleId, keepMessage: true });
      if (!syncResult.ok) {
        setPromotionBanner('이미지 업로드와 게시글 반영은 완료되었지만 목록 동기화에 실패했습니다. 목록을 새로고침해 확인하세요.', 'warn');
        return;
      }
    }

    showToast('홍보 이미지 ' + uploadedUrls.length + '개 업로드와 게시글 반영이 완료되었습니다.', 'success');
  } catch (e) {
    setPromotionBanner('요청 실패: ' + (e.message || ''), 'error');
  } finally {
    promotionIsUploading = false;
    btn.textContent = '선택 이미지 업로드';
    updatePromotionEditorState();
  }
};

async function loadDevPortalConfig() {
  if (!getToken()) {
    promotionMapKey = '';
    renderPromotionMapConfigBanner();
    updatePromotionMapStatus();
    return;
  }
  const res = await fetch(API_BASE + '/api/dev/config', { headers: headers() });
  const data = await readJsonOrEmpty(res);
  if (!res.ok) {
    promotionMapKey = '';
    renderPromotionMapConfigBanner();
    updatePromotionMapStatus();
    logPromotionMapDebug('loadDevPortalConfig:notOk', { status: res.status });
    return;
  }
  const nextKey = String(data.data?.kakaoJavascriptKey || '').trim();
  logPromotionMapDebug('loadDevPortalConfig:received', {
    hasKey: !!nextKey,
    keyPreview: nextKey ? nextKey.slice(0, 6) + '...' : ''
  });
  if (promotionMapKey && promotionMapKey !== nextKey) {
    promotionMapSdkPromise = null;
    const existingScript = document.getElementById(KAKAO_MAPS_SCRIPT_ID);
    if (existingScript) existingScript.remove();
    promotionMap = null;
    promotionMapMarker = null;
    setPromotionMapFallback(nextKey
      ? '지도 준비 중입니다. 위치 검색을 실행하면 실제 지도가 표시됩니다.'
      : '서버에 카카오 지도 JavaScript 키가 설정되면 실제 지도가 이 영역에 표시됩니다.');
  }
  promotionMapKey = nextKey;
  renderPromotionMapConfigBanner();
  updatePromotionMapStatus();
  initializePromotionMapIfVisible();
}
