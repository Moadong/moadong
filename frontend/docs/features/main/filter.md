# Filter 칩 NotificationDot — 대동제 세션 기반 표시

`Filter` 컴포넌트의 `NotificationDot`은 두 가지 조건으로 표시된다.

- `홍보`: `usePromotionNotification` 훅이 반환하는 서버 데이터 기반
- `대동제`: 세션 기반 — 첫 방문 시 항상 표시, 칩 클릭 시 사라짐 (탭 종료 후 재표시)

`대동제` dot 상태는 `Filter` 내부에서 `sessionStorage('daedong_filter_seen')`으로 자체 관리하며, `MainPage.tsx`나 Filter props 변경 없이 동작한다.

## 관련 코드

- `src/components/common/Filter/Filter.tsx` — `daedongDotSeen` state, `handleFilterOptionClick` 내 sessionStorage 처리

---

# 웹뷰 필터칩-라우트 config 기반 통합

`Filter`의 웹뷰 옵션 목록과 `webviewRoutes`의 라우트 등록을 `WEBVIEW_FILTER_CONFIG` 단일 소스로 통합했다.

기존에는 두 파일이 독립적으로 path를 관리하여 라우트 누락 시 런타임에서야 발견할 수 있었다. config에 `label`, `path`, `component`를 함께 정의하고, `webviewRoutes`는 config를 map하여 라우트를 자동 생성, `Filter`는 config를 직접 참조한다.

탭 추가 시 `webviewFilterConfig.tsx` 한 파일만 수정하면 라우트와 필터 UI가 동시에 반영된다.

## 관련 코드

- `src/routes/webviewFilterConfig.ts` — label·path만 정의하는 단일 소스 (component 미포함으로 순환 참조 방지)
- `src/routes/webviewRoutes.tsx` — `PAGE_MAP: Record<WebviewFilterPath, ComponentType>`으로 component 매핑, config map으로 라우트 자동 생성
- `src/components/common/Filter/Filter.tsx` — `WEBVIEW_FILTER_OPTIONS` 제거, config 참조

> **주의**: config에 page component를 직접 포함하면 `Filter → config → PageComponent → Filter` 순환 참조가 발생한다. component 매핑은 반드시 `webviewRoutes.tsx`에서만 처리한다.
