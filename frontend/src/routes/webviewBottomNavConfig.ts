// 웹뷰 바텀 네비게이션 탭 정의
// 상단 필터칩(WEBVIEW_FILTER_CONFIG: 동아리/홍보)과는 별개의 리스트다.
export const WEBVIEW_BOTTOM_NAV = [
  { label: '홈', path: '/webview/main' },
  { label: '구독', path: '/webview/subscribed' },
  { label: '메뉴', path: '/webview/menu' },
] as const;

export type WebviewBottomNavPath = (typeof WEBVIEW_BOTTOM_NAV)[number]['path'];
