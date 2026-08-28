# experiments — A/B 테스트 프레임워크

Mixpanel 기반 실험 관리:

- `definitions.ts` - 실험 정의 (key, variants, weights)
- `experimentAssignments.ts` - 실험 할당 및 변형 조회 로직
- `initializeExperiments.ts` - 앱 시작 시 실험 초기화
- `useExperimentVariant()` 훅(`src/hooks/Experiment/`)으로 컴포넌트에서 실험 변형 사용

```typescript
const variant = useExperimentVariant(mainBannerExperiment);
// variant는 'A' 또는 'B'
```

## 오염 계측

배정이 뒤집힌 방문을 분석에서 걸러내기 위해 `fetchAndAssignExperiments`가
매 부팅마다 super property 두 개를 register한다.

| property                     | true인 경우                      | 의미                        |
| ---------------------------- | -------------------------------- | --------------------------- |
| `experiment_storage_blocked` | localStorage 쓰기 실패           | 다음 방문에 다시 추첨된다   |
| `experiment_reassigned`      | 기존 배정이 현재 variants에 없음 | 정의 변경으로 그룹이 갈렸다 |

둘 다 방문 단위 값이라 매번 true/false로 덮어쓴다. 실험 결과를 볼 때
이 비율을 먼저 확인해야 차이가 진짜인지 오염인지 구분할 수 있다.

배정 고정이 깨지는 경로는 이 둘 외에 **Safari ITP 7일 만료, 시크릿 모드,
사용자의 사이트 데이터 삭제, 기기·브라우저 분리**가 있다. 모두 코드로
막을 수 없고, 근본 해결은 `hash(userId + key)` 기반 결정론적 버킷팅이다.
로그인 사용자 대상 실험을 설계할 때 검토한다.
