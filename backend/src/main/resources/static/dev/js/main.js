// 모든 스크립트 로드 후 이탈 경고를 걸고 저장된 토큰으로 세션을 복원한다

window.addEventListener('beforeunload', (event) => {
  if (!isPromotionDirty() && !bannerDirty) return;
  event.preventDefault();
  event.returnValue = '';
});

if (getToken()) {
  document.getElementById('tokenDisplay').textContent = getToken();
  showLogin(true);
  loadDevPortalConfig().finally(() => {
    showActivePortalSection();
  });
}
