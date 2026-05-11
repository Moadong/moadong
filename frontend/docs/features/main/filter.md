# Filter 칩 NotificationDot — 대동제 세션 기반 표시

`Filter` 컴포넌트의 `NotificationDot`은 두 가지 조건으로 표시된다.

- `홍보`: `usePromotionNotification` 훅이 반환하는 서버 데이터 기반
- `대동제`: 세션 기반 — 첫 방문 시 항상 표시, 칩 클릭 시 사라짐 (탭 종료 후 재표시)

`대동제` dot 상태는 `Filter` 내부에서 `sessionStorage('daedong_filter_seen')`으로 자체 관리하며, `MainPage.tsx`나 Filter props 변경 없이 동작한다.

## 관련 코드

- `src/components/common/Filter/Filter.tsx` — `daedongDotSeen` state, `handleFilterOptionClick` 내 sessionStorage 처리
