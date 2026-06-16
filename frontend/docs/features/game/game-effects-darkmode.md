# GamePage 폭죽 이펙트 및 다크모드 토글

## 반응형 레이아웃 수정

순위표(`RankingBoard`)는 데스크탑에서 `position: absolute`로 우측 상단에 떠 있다.
전환 기준이 `media.tablet`(≤700px)이던 탓에 700~1280px 구간에서 중앙 정렬된 타이틀과 겹쳤다.

- `DesktopOnly`/`MobileOnly` 전환 기준을 `media.laptop`(≤1280px)로 변경 → 태블릿·랩탑 폭에서는 순위표가 하단으로 내려감
- `RankingBoard.Wrapper`에 `margin: 0 auto`를 추가해 좁은 폭에서 중앙 정렬
- 배경 blob 그라데이션(`BLOBS`, `Blob`)은 제거해 배경을 단순화

## 클릭 폭죽 이펙트

클릭 버튼을 누를 때마다 버튼 중심에서 파티클이 방사형으로 터진다.

- 매 클릭마다 `bursts` state에 id를 추가하고 일정 시간 후 자동 제거
- 파티클은 원형 빛 입자 + 회전하는 색종이(confetti) 혼합, `box-shadow`로 글로우
- 포물선 궤적(중력) + `rotate`로 떨어지는 느낌

## 100회 단위 배경 폭죽

랭킹의 **어떤 동아리든** 누적 클릭수가 100단위를 넘기면 화면 전체에 대형 폭죽을 발사한다.

- 2초 폴링마다 직전 카운트와 비교: `floor(cur/100) > floor(prev/100)`이면 트리거
- 첫 로드 시에는 베이스라인만 기록(기존 누적값으로 오발 방지)
- `BackgroundFirework`는 `position: fixed`로 화면 전체를 덮고 `zIndex: 0`으로 콘텐츠 뒤에 깔림
- 폴링 간격 사이의 다중/동시 돌파는 1회 발사로 합쳐짐(의도된 단순화)

## 다크모드 토글

GamePage 한정 다크모드. 전역 테마 오버라이드 대신 `$dark` prop을 내려 색을 반전한다.

- 토글 상태는 `sessionStorage`(`game_dark_mode`)에 영속화
- 배경 위에 직접 올라가는 요소만 반전: 배경, 타이틀, 설명, dot(`dotColor` prop), 랭킹 제목/EmptyMessage, 클럽 라벨/카운트 라벨
- 랭킹 카드는 자체 밝은 카드라 다크 배경에서도 가독성이 유지되어 미변경
- 토글 UI는 인라인 SVG 해/달 아이콘 + 슬라이딩 knob 스위치(`translateX`)

## 관련 코드

- `src/pages/GamePage/GamePage.tsx` — 다크모드 state·토글, SVG 아이콘, 100회 배경 폭죽 트리거, blob 제거
- `src/pages/GamePage/GamePage.styles.ts` — `$dark` 스타일, 토글 스위치, 반응형 기준 변경, blob 제거
- `src/pages/GamePage/components/BackgroundFirework/BackgroundFirework.tsx` — 화면 전체 대형 폭죽 (신규)
- `src/pages/GamePage/components/ClickButton/` — 클릭 폭죽 파티클, `isDark` prop
- `src/pages/GamePage/components/DotTextEffect/DotTextEffect.tsx` — `dotColor` prop화
- `src/pages/GamePage/components/RankingBoard/` — `margin: 0 auto`, `$dark` prop
