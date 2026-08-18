# 수상 내역 모바일 섹션

`ClubIntroEditTabMobile`의 "이런 상을 받았어요" 섹션.
수상 내역 목록을 표시하며 행 클릭 시 편집 서브페이지로 이동하는 구조이나,
현재 `ClubIntroEditTabMobile`에서는 `onNavigate`를 전달하지 않아 편집 기능이 미구현 상태다.

## 표시 동작

- 수상 이력 없음: "없음" 텍스트 + 화살표 버튼 (클릭해도 onNavigate 미연결)
- 수상 이력 있음: 학기별 행 목록, 최신순(연도·학기 내림차순)으로 정렬
  - 행마다 `SemesterChip`(예: "2024 1학기")과 수상 개수(`achievements.length`) 표시

## AwardSection props

| prop | 타입 | 설명 |
|---|---|---|
| `awards` | `Award[]` | 수상 내역 배열 |
| `onNavigate` | `(award?: Award) => void` (optional) | 행 클릭 핸들러. 미전달 시 클릭 무반응 |

`onNavigate`에 `award`를 전달하면 특정 학기 편집, 생략하면 새 학기 추가로 구분하는 설계.

## 미구현 사항

모바일 수상 편집 서브페이지(`AwardEditPage`)가 없음.
`AwardSection`을 `ClubIntroEditTabMobile`에 연결할 때 `onNavigate`와 함께
`activePage` 분기 또는 별도 라우트 추가가 필요하다.

## 관련 코드

- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardSection/AwardSection.tsx` — 수상 섹션 컴포넌트
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardSection/AwardSection.styles.ts` — 스타일
- `src/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTabMobile.tsx` — 현재 onNavigate 미연결
