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

## 노출 이벤트는 배정 시점이 아니라 렌더 시점에 보낸다

`trackExperimentExposure(experiment)`가 Mixpanel `$experiment_started`를 보낸다.
실험당 페이지 로드 1회로 막혀 있다.

**부팅 때 한꺼번에 보내면 안 된다.**

배정은 사이트에 들어온 **모든 사람**에게 일어난다. 하지만 실험으로 화면이
갈리는 건 그중 일부다. 예를 들어 개편이 모바일에만 적용되면 데스크톱
사용자는 control이든 treatment든 **똑같은 화면**을 본다.

부팅할 때 노출 이벤트를 다 보내면 이 사람들도 실험 참가자로 집계된다. 같은
화면을 보니 두 그룹에 절반씩 똑같이 섞이고, 결과적으로 진짜 차이를 묽게
만든다. 실제로 5%p 차이가 났어도 참가자의 절반이 화면 차이를 못 본
사람이면 측정값은 2.5%p로 줄어든다.

그래서 **그 화면이 실제로 그려질 때만** 보낸다.

```typescript
useEffect(() => {
  if (isNarrow) trackExperimentExposure(someExperiment);
}, [isNarrow]);
```

super property 등록(부팅 시)과 노출 이벤트(렌더 시)는 목적이 다르다. 전자는
"이 방문의 배정이 무엇인가", 후자는 "누구를 분석 모집단에 넣을 것인가"다.

## 오염 계측

배정이 뒤집힌 방문을 분석에서 걸러내기 위해 `fetchAndAssignExperiments`가
매 부팅마다 super property 두 개를 register한다.

| property                        | true인 경우                      | 의미                        |
| ------------------------------- | -------------------------------- | --------------------------- |
| `experiment_storage_blocked`    | localStorage 쓰기 실패           | 다음 방문에 다시 추첨된다   |
| `experiment_definition_changed` | 기존 배정이 현재 variants에 없음 | 정의 변경으로 그룹이 갈렸다 |

둘 다 방문 단위 값이라 매번 true/false로 덮어쓴다. 실험 결과를 볼 때
이 비율을 먼저 확인해야 차이가 진짜인지 오염인지 구분할 수 있다.

### 이 둘로 재추첨률을 대신할 수 없다

배정이 **아예 없어서** 새로 뽑은 방문은 두 플래그가 모두 false다. 그런데
**Safari ITP 7일 만료, 시크릿 모드, 사용자의 사이트 데이터 삭제, 기기·브라우저
분리**가 전부 그 경로다. 이 경우 localStorage 쓰기 자체는 정상이라
`experiment_storage_blocked`도 false로 남는다.

결국 실제로 잡히는 건 쓰기가 throw하는 **권한 거부**뿐이고, 저장 payload가 작아
쿼터 초과도 거의 걸리지 않는다. 그러므로 **`experiment_storage_blocked` 비율이
낮게 나와도 랜덤 배정이 안전하다는 근거가 되지 않는다.** 오염의 큰 몫이 애초에
측정되지 않았기 때문이다.

ITP 몫은 클라이언트만으로 측정할 수 없다. ITP는 JS로 심은 쿠키도 7일로 자르므로
Mixpanel `distinct_id`가 배정과 함께 사라져, 재방문인지 신규 방문인지 구분할
식별자가 남지 않는다.

대응은 둘 중 하나다.

- 배정부터 결과 지표까지의 관측 창을 7일 미만으로 잡아 ITP 만료 영향을 줄인다.
- 로그인 사용자 대상이면 `hash(userId + key)` 기반 결정론적 버킷팅으로 바꾼다.
  localStorage에 의존하지 않으므로 위 경로가 전부 사라진다.
