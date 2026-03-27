# 프론트엔드 실험(A/B Test) 시스템 가이드

## 개요

`frontend/src/experiments/`는 클라이언트 사이드 A/B 실험을 위한 경량 구조다.  
외부 서비스 없이 localStorage 기반으로 배리언트를 배정하고, React 훅으로 컴포넌트에서 간편하게 사용할 수 있다.

## 파일 구성

```
frontend/src/experiments/
├── types.ts                  # 실험 관련 타입 정의
├── definitions.ts            # 실험 목록 정의 (여기만 수정하면 됨)
├── ExperimentRepository.ts   # 배리언트 배정 및 조회 로직
└── initializeExperiments.ts  # 앱 시작 시 일괄 배정

frontend/src/hooks/Experiment/
└── useExperimentVariant.ts   # 컴포넌트에서 사용하는 React 훅
```

## 동작 원리

1. **앱 시작 시** `initializeExperiments()`가 `ALL_EXPERIMENTS`를 순회하며 각 실험의 배리언트를 배정한다.
2. 이미 배정된 실험은 재배정하지 않는다. (같은 유저는 항상 같은 배리언트를 본다)
3. 배정 결과는 `localStorage`의 `moadong_experiment_assignments` 키에 JSON으로 저장된다.
4. 컴포넌트에서는 `useExperimentVariant` 훅으로 배리언트를 읽어 분기한다.

## 새 실험 추가 방법 (3단계)

### 1단계 — `definitions.ts`에 실험 정의 추가

```typescript
// frontend/src/experiments/definitions.ts

export const myNewExperiment = {
  key: 'my_new_experiment_v1',   // 전역 고유값. 중복 금지
  variants: ['A', 'B'] as const,
  defaultVariant: 'A',           // 배정 실패 또는 초기화 시 기본값
  weights: {
    A: 50,
    B: 50,
  },
} satisfies ExperimentDefinition<'A' | 'B'>;

// ALL_EXPERIMENTS 배열에도 추가
export const ALL_EXPERIMENTS = [
  mainBannerExperiment,
  applyButtonCopyExperiment,
  myNewExperiment,   // ← 여기
] as const;
```

### 2단계 — 컴포넌트에서 배리언트 분기

```typescript
import { useExperimentVariant } from '@/hooks/Experiment/useExperimentVariant';
import { myNewExperiment } from '@/experiments/definitions';

const MyComponent = () => {
  const variant = useExperimentVariant(myNewExperiment);

  return variant === 'B' ? <NewVersion /> : <DefaultVersion />;
};
```

### 3단계 — Mixpanel 이벤트에 배리언트 속성 포함 (권장)

실험 결과를 분석하려면 이벤트 전송 시 배리언트 값을 속성으로 넘겨야 한다.

```typescript
import { trackEvent } from '@/utils/mixpanel'; // 실제 트래킹 유틸 경로 참고

trackEvent('클릭 이벤트', {
  experiment_key: myNewExperiment.key,
  experiment_variant: variant,
});
```

## weights(가중치) 설정

`weights`를 생략하면 균등 배분된다.  
비율을 조정하고 싶을 때만 명시한다.

```typescript
// 10%만 B를 보는 실험
weights: {
  A: 90,
  B: 10,
},
```

## 배리언트 초기화 (개발/QA용)

브라우저 콘솔에서 실행하면 배정이 초기화된다.

```javascript
localStorage.removeItem('moadong_experiment_assignments');
location.reload();
```

또는 코드에서 직접 호출:

```typescript
import { experimentRepository } from '@/experiments/ExperimentRepository';
experimentRepository.resetAssignments();
```

## key 네이밍 규칙

- 형식: `{실험_대상}_{버전}` (소문자 snake_case)
- 예시: `main_banner_v1`, `apply_button_copy_v1`
- 실험이 종료되고 새로 시작할 때는 버전을 올린다: `main_banner_v2`
- 이미 배포된 key는 절대 재사용하지 않는다. (기존 유저 배정 오염 방지)

## 실험 종료 후 정리

1. `definitions.ts`에서 해당 실험 상수와 `ALL_EXPERIMENTS` 항목을 제거한다.
2. 채택된 배리언트 코드만 남기고 분기 로직을 제거한다.
3. 버려진 배리언트 코드를 삭제한다.

## 현재 운영 중인 실험

| key | 대상 | 배리언트 | 비율 |
|-----|------|---------|------|
| `main_banner_v1` | 메인 배너 | A / B | 50 / 50 |
| `apply_button_copy_v1` | 지원 버튼 문구 | A / B | 50 / 50 |
