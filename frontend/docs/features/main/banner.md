# Banner — 스켈레톤 UI

배너 데이터 로딩 중 `null` 대신 shimmer 애니메이션이 적용된 스켈레톤 UI를 표시한다.
모바일/데스크탑/랩탑 전 해상도에서 동일하게 동작하며 웹뷰 여부와 무관하게 적용된다.

## 동작 방식

- `useGetBanners`의 `isPending`이 `true`인 동안 `SkeletonBannerWrapper`를 렌더링
- 데이터 로드 완료(`isPending === false`) 후 실제 Swiper 배너로 교체
- TanStack Query 캐시 hit 시에는 `isPending`이 false이므로 스켈레톤이 노출되지 않음

## 반응형

| 환경          | aspect-ratio | border-radius |
| ------------- | ------------ | ------------- |
| 데스크탑/랩탑 | `1180 / 316` | `26px`        |
| 모바일        | `1.8`        | `0`           |

## 관련 코드

- `src/pages/MainPage/components/Banner/Banner.tsx` — `isPending` 분기 처리
- `src/pages/MainPage/components/Banner/Banner.styles.ts` — `SkeletonBannerWrapper`, `shimmer` keyframes
