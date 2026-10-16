# GamePage 트래킹 추가

릴리즈 전 점검 결과 GamePage에는 페이지뷰를 포함해 트래킹이 전혀 없었다. 다른 페이지와 동일한 패턴으로 최소한의 트래킹을 추가했다.

## 페이지뷰

다른 페이지들(`PromotionListPage`, `BuskingPage` 등)과 동일하게 `useTrackPageView`로 진입·체류시간을 추적한다.

- `PAGE_VIEW.GAME_PAGE` 추가
- `GamePage.tsx`에서 `useTrackPageView(PAGE_VIEW.GAME_PAGE)` 호출

## 게임 시작 버튼

`ClubNameInput`에서 동아리명 검증(`validateClubName`)이 **성공한 경우에만** 이벤트를 보낸다. 존재하지 않는 동아리를 입력한 실패 케이스는 노이즈라 제외했다.

- `USER_EVENT.GAME_START_BUTTON_CLICKED` 추가, `clubName`을 함께 전송해 어떤 동아리로 유입됐는지 추적

## 제외한 항목

- 클릭 버튼(`ClickButton`)과 추천 동아리 목록 선택(`handleSelect`)은 의도적으로 트래킹하지 않음 (클릭 버튼은 과도한 이벤트 발생 우려로 제외 요청)

## 관련 코드

- `src/constants/eventName.ts` — `PAGE_VIEW.GAME_PAGE`, `USER_EVENT.GAME_START_BUTTON_CLICKED`
- `src/pages/GamePage/GamePage.tsx` — 페이지뷰 트래킹
- `src/pages/GamePage/components/ClubNameInput/ClubNameInput.tsx` — 게임 시작 버튼 트래킹
