# A/B 실험 variant를 Mixpanel super property로 등록

앱 시작 시 실험 배정 결과를 Mixpanel super property로 등록하여, 이후 발생하는 모든 이벤트에 variant 정보가 자동으로 포함되도록 한다.

## 동작 방식

`ExperimentRepository.fetchAndAssignExperiments()`가 호출될 때:

- **신규 유저**: 새로 variant가 배정되면 즉시 `mixpanel.register()` 호출
- **재방문 유저**: localStorage에 유효한 배정값이 있으면 해당 값으로 `mixpanel.register()` 호출

super property key는 실험의 `key` 필드 그대로 사용한다 (예: `main_banner_v1`).

## Mixpanel 대시보드 활용

데이터가 쌓이면 기존 Insights/Funnel 쿼리에 breakdown만 추가하면 된다.

```text
예시: ClubDetailPage Visited 이벤트
→ Breakdown: main_banner_v1
→ A그룹 vs B그룹 비교
```

## 주의사항

- `localhost`에서는 `mixpanel.disable()`이 적용되어 super property 등록이 동작하지 않음
- 스테이징/프로덕션 배포 후부터 데이터 수집 시작

## 관련 코드

- `src/experiments/ExperimentRepository.ts` — super property 등록 로직
- `src/experiments/definitions.ts` — 실험 정의 (key, variants, weights)
- `src/utils/initSDK.ts` — Mixpanel 초기화 (`initializeMixpanel`)
- `src/index.tsx` — 초기화 순서: `initializeMixpanel()` → `initializeExperiments()`
