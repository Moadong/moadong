# 메뉴(더보기) 페이지 (MenuPage)

바텀 네비게이션 "메뉴" 탭의 페이지(`/menu`). 앱 네이티브 더보기 화면(RN `app/(tabs)/more.tsx`)을 웹으로 이식했다. 통합 후 헤더가 로고+검색만 남으므로, 기존 헤더 메뉴 성격의 항목을 이 페이지로 모은다.

## 항목 (RN 더보기 그대로)

| 항목 | 이동 |
| --- | --- |
| 서비스 소개 | `/introduce` |
| 총 동아리 연합회 | `/club-union` |
| 개인정보 처리방침 | 외부 노션 링크 (새 탭) |

RN의 "앱 버전" 항목은 웹에 해당 없어 제외. introduce/club-union은 기존 `useHeaderNavigation` 핸들러를 재사용해 네비게이션·Mixpanel 트래킹을 유지한다. 개인정보 처리방침은 Footer와 동일한 외부 링크를 사용한다.

## 스타일 (RN 레이아웃 재현)

- "더보기" 타이틀 헤더 + 항목 리스트(행마다 border-bottom)
- 각 행: 원형 아이콘 컨테이너(`#FFECE5` 배경 + `#FF5414` 아이콘) + 제목 + chevron(`#C5C5C5`)
- 앞쪽 아이콘은 RN의 Ionicons가 웹에 없어 웹용 단순 SVG로 재현(`src/assets/images/icons/menu/`). 디자인 시안 확보 시 교체.

## 관련 코드

- `src/pages/MenuPage/MenuPage.tsx` — 페이지
- `src/pages/MenuPage/MenuPage.styles.ts`
- `src/assets/images/icons/menu/` — info/people/document/chevron SVG (`?react`, currentColor 틴팅)
- `src/hooks/Header/useHeaderNavigation.ts` — 소개/연합회 네비 핸들러 (재사용)
- `src/routes/AppRoutes.tsx` — `/menu` 라우트

## 참고

`/menu`는 `AppLayout`의 하위 라우트로 공용 헤더/바텀네비를 사용한다.
