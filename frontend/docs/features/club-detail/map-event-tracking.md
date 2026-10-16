# 동아리방 지도 클릭 이벤트 트래킹

동아리 상세 페이지에서 동아리방 위치 지도를 여는 두 가지 진입점에 Mixpanel 이벤트를 적용.

## 진입점

1. **지도 카드** (`Styled.MapCard`) — 상세 페이지 좌측 섹션에 표시되는 네이버 맵 미리보기 클릭
2. **프로필 카드 내 지도 버튼** (`ClubProfileCard`의 `onMapClick`) — 프로필 카드에서 위치 버튼 클릭

두 진입점 모두 `CLUB_MAP_CLICKED` 단일 이벤트로 트래킹. "지도 열람" 행동 자체의 빈도 파악이 목적이므로 진입점을 구분하지 않음.

## 관련 코드

- `src/constants/eventName.ts` — `CLUB_MAP_CLICKED: 'Club Map Clicked'` 이벤트명 정의
- `src/pages/ClubDetailPage/ClubDetailPage.tsx` — 두 진입점의 클릭 핸들러에 `trackEvent(USER_EVENT.CLUB_MAP_CLICKED)` 추가
