# layouts — 웹/웹뷰 통합 라우팅

웹과 인앱 웹뷰는 **동일한 웹 라우트**를 사용한다. 웹뷰 여부는 경로가 아니라 `isInAppWebView()`(UA의 `MoadongApp`, `src/utils/`)로 판단하며 헤더(로고+검색)·바텀네비·필터를 공유한다.

- **레이아웃**: `AppLayout.tsx`(중첩 라우트 레이아웃)가 헤더+바텀네비를 묶어 핵심 네비 페이지(`/`, `/promotions`, `/subscriptions`, `/menu`, `/introduce`, `/club-union`)에 적용.
- **필터탭(동아리/홍보)**: `src/components/common/Filter/Filter.tsx`의 `WEB_FILTER_OPTIONS`. 모바일·웹뷰에서 노출되며, fixed 헤더(56px)를 비우기 위해 `margin-top: 56px`.
- **바텀네비**: `src/components/common/BottomNavigation/` (홈/구독/메뉴). 상세·폼·관리자 등 AppLayout 밖 페이지에는 미노출.
- **웹뷰 전용 동작**: `isInAppWebView()`로 분기 (예: 메인 카드 구독 버튼, `WebviewGlobalStyles`). 상세/홍보상세는 자체 TopBar가 있어 `Header`를 `hideOn={['webview']}`로 숨긴다.
- **구버전 앱 호환**: `src/routes/webviewRoutes.tsx`는 `/webview/* → 웹 경로` 리다이렉트만 담당(`/webview/main`→`/`, `/webview/club/:id`→`/clubDetail/:id` 등). 구버전 앱 진입 URL 보호용이라 제거 금지.
