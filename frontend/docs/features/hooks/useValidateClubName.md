# useValidateClubName — 제출 검증 React Query 캐시 통합

`ClubNameInput`의 submit 경로에서 동아리 이름 존재 여부를 검증하는 훅. `useClubSuggestions`와 동일한 캐시 키를 공유해 캐시 히트 시 네트워크 요청 없이 검증한다.

## 배경

기존 `handleSubmit`은 `getClubList(trimmed)`를 직접 호출했다. 자동완성 경로(`useClubSuggestions`)가 `queryKeys.club.suggestions(keyword)` 캐시를 사용하는 반면, 제출 검증 경로는 동일 키워드에 대해 별도 요청을 발생시키고 있었다.

## 해결 방식

`queryClient.ensureQueryData`로 동일한 캐시 키를 사용한다. 캐시가 유효하면 재요청 없이 반환하고, 없으면 fetch 후 캐시에 저장한다.

```typescript
export const useValidateClubName = () => {
  const queryClient = useQueryClient();
  return async (name: string) => {
    const { clubs } = await queryClient.ensureQueryData({
      queryKey: queryKeys.club.suggestions(name),
      queryFn: () => getClubList(name),
      staleTime: 30 * 1000,
    });
    return clubs.some((c) => c.name === name);
  };
};
```

## 관련 코드

- `src/hooks/Queries/useClub.ts` — `useValidateClubName` 훅 정의
- `src/pages/GamePage/components/ClubNameInput/ClubNameInput.tsx` — `handleSubmit`에서 `useValidateClubName` 사용
