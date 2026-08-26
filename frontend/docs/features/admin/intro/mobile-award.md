# 수상 내역 모바일 섹션

`ClubIntroEditTabMobile`의 "이런 상을 받았어요" 섹션.
행을 누르면 같은 탭 안에서 `AwardEditPage` 서브페이지로 전환된다.

## 표시 동작

- 수상 이력 없음: "없음" 텍스트 + 화살표 버튼
- 수상 이력 있음: 학기별 행 목록, 최신순(연도·학기 내림차순)으로 정렬
  - 행마다 `SemesterChip`(예: "2024 1학기")과 수상 개수(`achievements.length`) 표시

## AwardSection props

| prop | 타입 | 설명 |
|---|---|---|
| `awards` | `Award[]` | 수상 내역 배열 |
| `onNavigate` | `(award?: Award) => void` (optional) | 행 클릭 핸들러. 미전달 시 클릭 무반응 |

`AwardSection`은 행을 누를 때 해당 `award`를 넘기지만,
`ClubIntroEditTabMobile`의 `handleNavigateToAward`는 인자를 쓰지 않는다.
`AwardEditPage`가 목록 전체를 편집하는 화면이라 어느 행에서 들어와도 같은 화면이 뜬다.

## 서브페이지 전환

라우트를 늘리지 않고 `activePage` 상태(`'main' | 'award'`)로 갈아 끼운다.

- 진입: 현재 `window.scrollY`를 `savedScrollY`에 저장하고 `activePage`를 `'award'`로 바꾼다
- 복귀: `AwardEditPage`의 `onBack`이 `'main'`으로 되돌리고, 이펙트가 저장해 둔 위치로 스크롤을 복원한다

## 저장 흐름

`AwardEditPage`는 두 개의 저장 콜백을 받는다.

| prop | 연결 대상 | 역할 |
|---|---|---|
| `onSave` | `setAwards` | 편집 결과를 탭 로컬 상태에 반영 |
| `onSaveToServer` | `handleUpdateClubWithAwards` | 수정된 배열로 동아리 상세 업데이트 요청 |

## 관련 코드

- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardSection/AwardSection.tsx` — 수상 섹션 컴포넌트
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardSection/AwardSection.styles.ts` — 스타일
- `src/pages/AdminPage/tabs/ClubIntroEditTab/components/mobile/AwardEditPage/AwardEditPage.tsx` — 편집 서브페이지
- `src/pages/AdminPage/tabs/ClubIntroEditTab/ClubIntroEditTabMobile.tsx` — `activePage` 분기와 저장 콜백 연결
