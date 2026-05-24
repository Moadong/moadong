# ClubUnionPage — 총동아리연합회 소개

총동아리연합회(총동연) 임원진 및 분과장을 소개하는 페이지.

## 레이아웃

4열 staggered flex grid 구조. 홀수 컬럼(1, 3번째)은 `padding-top: 125px`로 엇갈린 배치.
tablet 이하에서는 2열 CSS grid, mobile에서는 1열로 전환.

컬럼별 멤버 수는 `COLUMN_SIZES = [3, 3, 4, 3]`로 명시적 지정.
멤버 배치 순서는 `CLUB_UNION_MEMBERS` 배열 순서 그대로 각 컬럼에 순차 할당.
좌우 여백은 `PageContainer`에 위임 (ProfileGrid에 별도 좌우 padding 없음).

## 모바일 순서

mobile(≤500px)에서는 `CLUB_UNION_MEMBERS_MOBILE`을 단일 컬럼으로 flat 렌더링.
`window.matchMedia('(max-width: 500px)')` + `useState`/`useEffect`로 모바일 감지.

노출 순서: 회장 → 부회장 → 임원진(기획·사무·홍보) → 봉사 → 종교 → 취미 → 학술 → 운동1·2 → 공연1·2

순서 변경 시 `clubUnionInfo.ts`의 `MOBILE_ORDER` 배열(id 기준)을 수정.

## 카드 구성

각 멤버 카드(`ProfileCard`)는 다음 요소로 구성:

- `CardContent`: 이름 + 직책 배지(가로 정렬, gap 8px) + 설명 문구
- `CardIllustrationWrap`: 카드 우상단 기준(`top: 20px`) 절대 위치로 분과 아이콘 배치
- `::before`: `linear-gradient(136.44deg, rgba(255,255,255,0.70) 50.77%, rgba(255,255,255,0.30) 87.48%)` 반투명 오버레이

피그마 Mask group의 `9733:3612`(흰색 Frame)는 `isMask: true`인 마스크 레이어로 렌더링되지 않음 — 추가 그라디언트 레이어 아님.

## 배경색

`ClubUnionMember.bgColor` 필드에 테마 상수를 직접 지정.

| 타입                                                               | 색상 상수                 |
| ------------------------------------------------------------------ | ------------------------- |
| 임원진 (PRESIDENT, VICE_PRESIDENT, PLANNING, SECRETARY, PROMOTION) | `colors.accent[1][700]`   |
| VOLUNTEER                                                          | `colors.secondary[1].tag` |
| RELIGION                                                           | `colors.secondary[2].tag` |
| HOBBY                                                              | `colors.secondary[3].tag` |
| STUDY                                                              | `colors.secondary[4].tag` |
| SPORT                                                              | `colors.secondary[5].tag` |
| PERFORMANCE                                                        | `colors.secondary[6].tag` |

## 아이콘

임원진은 `inactiveCategoryIcons.representative` 공용 아이콘 사용.
분과 아이콘은 배경 `<rect>` 제거한 별도 SVG 사용 → 기존 카테고리 버튼 아이콘 영향 없음.

## 관련 코드

- `src/constants/clubUnionInfo.ts` — 멤버 데이터, 배경색, 아이콘 매핑
- `src/pages/ClubUnionPage/ClubUnionPage.tsx` — 4열 컬럼 분배 로직
- `src/pages/ClubUnionPage/ClubUnionPage.styles.ts` — 카드 스타일 및 반응형
- `src/assets/images/icons/category_button/club_union/` — 배경 없는 분과 아이콘 SVG
