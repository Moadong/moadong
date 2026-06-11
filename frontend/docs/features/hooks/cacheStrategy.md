# React Query 캐싱 전략

각 훅의 staleTime/gcTime 설정 근거와 패턴 정리.

## 설정 기준

| 데이터 성격           | staleTime                      | gcTime | 사용 예              |
| --------------------- | ------------------------------ | ------ | -------------------- |
| 정적 데이터 (배너 등) | 1시간                          | 1시간  | `useBanner`          |
| 일반 비동기 데이터    | 5분                            | 기본값 | `useGoogleCalendar`  |
| 목록/상세 데이터      | 1분                            | 기본값 | 클럽 목록, 클럽 상세 |
| 폴링 병행 데이터      | 1분 (refetchInterval보다 짧게) | 기본값 | `usePromotion`       |
| 사용자 입력 반응      | 30초                           | 기본값 | 클럽 검색, 자동완성  |
| 실시간 데이터         | 0                              | 기본값 | `useGame`            |

## 규칙

- `gcTime`은 정적 데이터처럼 메모리에 오래 유지해야 하는 경우에만 `staleTime`과 함께 명시. 나머지는 기본값(5분) 유지.
- `refetchInterval`을 함께 쓸 때는 `staleTime < refetchInterval`이어야 한다. 그렇지 않으면 폴링 후 refetch된 데이터가 여전히 stale로 판단되지 않아 `staleTime`이 의미를 잃는다.
- mutation 후 관련 쿼리는 `invalidateQueries`로 즉시 무효화.

## 관련 코드

- `src/hooks/Queries/useBanner.ts` — staleTime/gcTime 1h (정적 배너)
- `src/hooks/Queries/usePromotion.ts` — staleTime 1min + refetchInterval 3min/5min
- `src/hooks/Queries/useGame.ts` — staleTime 0 + refetchInterval 2s (실시간 랭킹)
- `src/hooks/Queries/useClub.ts` — 클럽 목록/상세 1min, 검색 30s
- `src/hooks/Queries/useGoogleCalendar.ts` — 5min
