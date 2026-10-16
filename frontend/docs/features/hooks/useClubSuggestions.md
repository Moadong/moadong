# useClubSuggestions — 자동완성 race condition 방지

자동완성 입력에서 debounce 후 클럽 목록을 조회하는 훅. React Query의 쿼리 키 단위 상태 관리를 활용해 이전 요청 응답이 늦게 돌아와도 현재 입력 기준 결과만 렌더링에 반영된다.

## 배경

기존 `ClubNameInput`은 `debounceRef` + `getClubList` 직접 호출 방식으로, 응답 순서 검증 없이 `setSuggestions`를 수행했다. 네트워크 지연 시 이전 요청 결과가 최신 입력을 덮어쓰는 race condition이 발생할 수 있었다.

## 해결 방식

컴포넌트에서 `debouncedKeyword` state를 별도로 관리하고, `useClubSuggestions(debouncedKeyword)`에 전달한다. React Query는 쿼리 키가 바뀌는 순간 이전 쿼리 결과를 무시하므로 race condition이 원천 차단된다.

```typescript
// useEffect로 300ms debounce
useEffect(() => {
  const timer = setTimeout(() => setDebouncedKeyword(value.trim()), 300);
  return () => clearTimeout(timer);
}, [value]);

const { data: suggestions = [] } = useClubSuggestions(debouncedKeyword);
```

## 관련 코드

- `src/hooks/Queries/useClub.ts` — `useClubSuggestions` 훅 정의 (enabled: !!keyword.trim(), staleTime: 30s)
- `src/constants/queryKeys.ts` — `queryKeys.club.suggestions(keyword)` 키 추가
- `src/pages/GamePage/components/ClubNameInput/ClubNameInput.tsx` — debounceRef 제거, useClubSuggestions 적용
