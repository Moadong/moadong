# 웹 바텀 네비게이션 (BottomNavigation)

앱 네이티브 바텀탭(React Navigation)을 웹으로 이식한 하단 고정 네비게이션. 웹/웹뷰 통합 마이그레이션의 일부로, RN `app/(tabs)/_layout.tsx` 스펙을 그대로 재현했다.

## 탭 구성

| 탭   | 경로             | 아이콘                                        |
| ---- | ---------------- | --------------------------------------------- |
| 홈   | `/`              | home.svg (mask 틴팅)                          |
| 구독 | `/subscriptions` | `subscribe_selected`/`subscribe_unselected.png` (2-state) |
| 메뉴 | `/menu`          | menu.svg (mask 틴팅)                          |

active 판정: `/`는 정확히 일치, 나머지는 `startsWith`.

## 스타일 (RN 스펙 1:1)

- 컨테이너: 배경 `#FFFFFF`, 상단 border `1px #F0F0F0`, `position: fixed; bottom: 0`
- 패딩: top `6px`, bottom `calc(6px + env(safe-area-inset-bottom))`
- 아이콘 28×28, active `#FF5414`(primary[900]) / inactive `#C5C5C5`(gray[500])
- 라벨 10px / weight 500 / 아이콘↔라벨 간격 4px
- z-index: `Z_INDEX.bottomNav`

## 아이콘 틴팅

단색 아이콘(홈/메뉴)은 `svg?react`(vite-plugin-svgr)로 컴포넌트 import하고, RN 원본이 `currentColor`를 쓰므로 부모 `Tab`의 `color`(active `#FF5414` / inactive `#C5C5C5`)를 상속받아 틴팅된다. 라벨도 `color: inherit`로 같은 색을 따른다. RN에서 가져온 SVG의 배경 `<rect fill="white"/>`는 제거했다(아이콘 패스는 원본 유지). 구독 아이콘은 PNG 2-state라 선택/비선택 이미지를 교체한다.

## 트래킹

탭 클릭 시 `USER_EVENT.BOTTOM_TAB_CLICKED`(`'BottomTab Clicked'`, 앱과 동일 문자열)를 전송한다 — payload `{ tab, path }`.

## 관련 코드

- `src/components/common/BottomNavigation/BottomNavigation.tsx` — 컴포넌트
- `src/components/common/BottomNavigation/BottomNavigation.styles.ts` — 스타일
- `src/components/common/BottomNavigation/BottomNavigation.stories.tsx` — Storybook 미리보기
- `src/assets/images/icons/bottomNav/` — 아이콘 에셋 (RN에서 이식)
- `src/styles/zIndex.ts` — `bottomNav` z-index 토큰
- `src/constants/eventName.ts` — `BOTTOM_TAB_CLICKED`

## 마운트

`src/layouts/AppLayout.tsx`(중첩 라우트 레이아웃)에서 렌더되며, `/`·`/introduce`·`/club-union`·`/promotions`·`/subscriptions`·`/menu` 6개 라우트에 노출된다. 상세·지원폼·관리자·게임·웹뷰 등은 그룹 밖이라 미노출. AppLayout이 `Outlet` 래퍼에 하단 여백(`calc(56px + env(safe-area-inset-bottom))`)을 주어 fixed 바에 콘텐츠가 가리지 않게 한다.
