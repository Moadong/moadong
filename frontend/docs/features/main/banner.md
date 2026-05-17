# Banner — 스켈레톤 UI

배너 데이터 로딩 중 `null` 대신 shimmer 애니메이션이 적용된 스켈레톤 UI를 표시한다.
모바일/데스크탑/랩탑 전 해상도에서 동일하게 동작하며 웹뷰 여부와 무관하게 적용된다.

## 동작 방식

스켈레톤은 두 단계로 나뉘어 노출된다.

| 단계 | 조건                                | 렌더링                               |
| ---- | ----------------------------------- | ------------------------------------ |
| 1    | `isPending`                         | `SkeletonBannerWrapper` (단독)       |
| 2    | 데이터 로드 완료 + `!isImageLoaded` | `SkeletonOverlay` (BannerWrapper 위) |
| 3    | 첫 이미지 `onLoad` 발화             | 스켈레톤 제거, 배너 노출             |

- TanStack Query 캐시 hit 시 `isPending`이 false이므로 1단계 스켈레톤은 노출되지 않음
- `SkeletonOverlay`는 `BannerWrapper` 내부에 `position: absolute; inset: 0`으로 위치 — Swiper가 뒤에서 정상 초기화되고 이미지를 로드할 수 있음
- `onLoad`는 `index === 0`인 첫 슬라이드에만 부착 — Swiper `loop` 모드의 슬라이드 복제로 인한 중복 발화 방지

## 반응형

| 환경          | aspect-ratio | border-radius |
| ------------- | ------------ | ------------- |
| 데스크탑/랩탑 | `1180 / 316` | `26px`        |
| 모바일        | `1.8`        | `0`           |

## 관련 코드

- `src/pages/MainPage/components/Banner/Banner.tsx` — `isPending`, `isImageLoaded` 분기 처리
- `src/pages/MainPage/components/Banner/Banner.styles.ts` — `SkeletonBannerWrapper`, `SkeletonOverlay`, `shimmer` keyframes
