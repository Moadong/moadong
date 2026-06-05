# 웹 바텀 네비게이션 (BottomNavigation)

앱 네이티브 바텀탭(React Navigation)을 웹으로 이식한 하단 고정 네비게이션. 웹/웹뷰 통합 마이그레이션의 일부로, RN `app/(tabs)/_layout.tsx` 스펙을 그대로 재현했다.

## 탭 구성

| 탭   | 경로             | 아이콘                                        |
| ---- | ---------------- | --------------------------------------------- |
| 홈   | `/`              | home.svg (mask 틴팅)                          |
| 구독 | `/subscriptions` | subscribe_selected / _unselected.png (2-state) |
| 메뉴 | `/menu`          | menu.svg (mask 틴팅)                          |

active 판정: `/`는 정확히 일치, 나머지는 `startsWith`.

## 스타일 (RN 스펙 1:1)

- 컨테이너: 배경 `#FFFFFF`, 상단 border `1px #F0F0F0`, `position: fixed; bottom: 0`
- 패딩: top `6px`, bottom `calc(6px + env(safe-area-inset-bottom))`
- 아이콘 28×28, active `#FF5414`(primary[900]) / inactive `#C5C5C5`(gray[500])
- 라벨 10px / weight 500 / 아이콘↔라벨 간격 4px
- z-index: `Z_INDEX.bottomNav`

## 아이콘 틴팅

프로젝트가 svgr를 쓰지 않아 SVG를 `<img>` URL로만 사용 → CSS `color` 틴팅이 불가하다. 단색 아이콘(홈/메뉴)은 CSS `mask` + `background-color`로 active/inactive 색을 적용한다. 이를 위해 RN에서 가져온 SVG의 배경 `<rect fill="white"/>`를 제거했다(아이콘 패스는 원본 유지). 구독 아이콘은 PNG 2-state라 선택/비선택 이미지를 교체한다.

## 트래킹

탭 클릭 시 `USER_EVENT.BOTTOM_TAB_CLICKED`(`'BottomTab Clicked'`, 앱과 동일 문자열)를 전송한다 — payload `{ tab, path }`.

## 관련 코드

- `src/components/common/BottomNavigation/BottomNavigation.tsx` — 컴포넌트
- `src/components/common/BottomNavigation/BottomNavigation.styles.ts` — 스타일
- `src/components/common/BottomNavigation/BottomNavigation.stories.tsx` — Storybook 미리보기
- `src/assets/images/icons/bottomNav/` — 아이콘 에셋 (RN에서 이식)
- `src/styles/zIndex.ts` — `bottomNav` z-index 토큰
- `src/constants/eventName.ts` — `BOTTOM_TAB_CLICKED`

## 참고

아직 레이아웃에 마운트되지 않은 독립 컴포넌트다. 실제 화면 부착은 공용 레이아웃(AppLayout) 도입 단계에서 진행한다.
