# layouts — 웹/웹뷰 통합 라우팅

웹과 인앱 웹뷰는 **동일한 웹 라우트**를 사용한다. 웹뷰 여부는 경로가 아니라 `isInAppWebView()`(UA의 `MoadongApp`, `src/utils/`)로 판단하며 헤더(로고+검색)·바텀네비·필터를 공유한다.

- **레이아웃**: `AppLayout.tsx`(중첩 라우트 레이아웃)가 바텀네비를 묶어 핵심 네비 페이지(`/`, `/promotions`, `/subscriptions`, `/menu`, `/introduce`, `/club-union`)에 적용.
- **바텀네비**: `src/components/common/BottomNavigation/` (홈/구독/홍보/메뉴). 상세·폼·관리자 등 AppLayout 밖 페이지에는 미노출.
  - 노출 여부는 CSS가 아니라 `AppLayout`이 정한다: `isInAppWebView() || isMobile`. **앱 웹뷰는 화면 폭과 무관하게 항상** 보여야 하는데 미디어쿼리로는 그걸 표현할 수 없다. 콘텐츠 하단 여백(`56px + safe-area`)도 같은 조건을 따라간다.
  - '홍보' 탭의 알림 점은 `AppLayout`이 `usePromotionNotification()`을 호출해 prop으로 내려준다. 바텀네비가 직접 훅을 부르면 (a)바텀네비가 없는 화면에서도 홍보 목록 쿼리가 돌고 (b)QueryClient 없는 Storybook 스토리가 깨진다. 그래서 훅은 바텀네비가 실제로 렌더될 때만 마운트되는 작은 컴포넌트 안에 둔다.
- **필터탭(동아리/홍보)**: `Filter.tsx`는 남아 있지만 **현재 렌더되는 곳이 없다.** 바텀네비 탭과 목적지가 겹쳐 메인·홍보 목록 양쪽에서 뺐다. 되살릴 땐 `margin-top: 56px`으로 fixed 헤더를 비우던 역할을 지금은 각 페이지가 직접 처리한다는 점에 주의(`HeaderSpacer`, `padding-top`).
- **웹뷰 전용 동작**: `isInAppWebView()`로 분기 (예: 메인 카드 구독 버튼, `WebviewGlobalStyles`). 상세/홍보상세는 자체 TopBar가 있어 `Header`를 `hideOn={['webview']}`로 숨긴다.
- **메인(`/`)은 폭과 무관하게 하나다**: 전부 `MainContent`(홈이 곧 동아리 전체 목록). 2026-09 `main_redesign` 실험에서 홈을 허브로 바꾸고 목록을 `/clubs`로 빼는 안을 검증했으나, 목적이던 홍보 노출이 늘지 않아(홍보 상세 도달 하루 1~4명, 목록→상세 전환 11%) 기존 홈으로 확정하고 개편 홈·`/clubs`를 제거했다. `/clubs`는 공유된 링크 보호용으로 `/` 리다이렉트만 남아 있다.
  - 구독 진입점은 홈 헤더의 벨(`Header`의 `showSubscriptionBell`)과 바텀네비 구독 탭 둘이다. 벨은 `MainContent`가 `isMobile || isInAppWebView()`일 때 켠다(제거한 `HomeHeader`와 같은 범위). 구독은 앱 브리지(`useWebviewSubscribe`) 기능이라 웹 브라우저에서는 목록이 비는데, 이건 결함이 아니라 `SubscriptionsPage`가 '앱 다운로드' CTA를 띄우는 **설치 퍼널**이라 의도된 동작이다. 조건을 웹뷰로 좁히지 말 것.
  - 종료된 실험의 mixpanel super property는 코드를 지워도 남는다. `src/utils/cleanupMainRedesignExperiment.ts`가 `unregister`로 털어내며, 기존 방문자가 한 번씩 재방문하면 삭제해도 된다.
- **구버전 앱 호환**: `src/routes/webviewRoutes.tsx`는 `/webview/* → 웹 경로` 리다이렉트만 담당(`/webview/main`→`/`, `/webview/club/:id`→`/clubDetail/:id` 등). 구버전 앱 진입 URL 보호용이라 제거 금지.
