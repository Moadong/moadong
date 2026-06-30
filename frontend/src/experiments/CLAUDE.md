# experiments — A/B 테스트 프레임워크

Mixpanel 기반 실험 관리:

- `definitions.ts` - 실험 정의 (key, variants, weights)
- `ExperimentRepository.ts` - 실험 할당 및 변형 조회 로직
- `initializeExperiments.ts` - 앱 시작 시 실험 초기화
- `useExperiment()` 훅으로 컴포넌트에서 실험 변형 사용

```typescript
const { variant } = useExperiment(mainBannerExperiment);
// variant는 'A' 또는 'B'
```
