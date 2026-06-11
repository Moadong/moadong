# PrivateRoute — 어드민 인증 가드 및 store 동기화

인증 상태를 확인하고, Zustand store의 `clubId`가 현재 인증된 값과 일치할 때까지 자식 라우트 렌더를 보류하는 컴포넌트.

## store 동기화 타이밍 문제

`setClubId`는 `useEffect`에서 실행되므로, 인증 완료 첫 렌더 시점에 자식 트리(AdminPage, AdminProfile)가 stale한 store 값을 읽는 타이밍 차이가 존재한다.

| 진입 경로 | 증상 | 실질 영향 |
|-----------|------|-----------|
| 콜드 스타트 (새로고침 후 첫 로그인) | store 초기값 `null` | `enabled: !!clubParam` 가드로 쿼리 비활성 → 무해 |
| 동일 세션 계정 전환 (SPA 로그아웃 후 재로그인) | 이전 관리자 clubId가 store에 잔존 | 다른 동아리 detail 1회 fetch + 이름/로고 깜빡임 |

**해결**: `clubId && storeClubId !== clubId`일 때 `<Spinner />`로 children 렌더를 보류. store 동기화 후 자식 트리가 그려진다.

## 관련 코드

- `src/pages/AdminPage/auth/PrivateRoute/PrivateRoute.tsx` — 인증 가드 + store 동기화 가드
- `src/hooks/useAuth.ts` — 토큰 기반 인증 확인 및 clubId 조회
- `src/store/useAdminClubStore.ts` — clubId Zustand store
