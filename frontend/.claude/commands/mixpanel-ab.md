---
description: Mixpanel A/B 테스트 유의성 검정 가이드
allowed-tools: Bash(mcp-cli *), Read, Write, Edit, Glob, Grep
---

# A/B 테스트 유의성 검정 가이드

A/B 테스트 결과를 분석할 때 통계적 오류를 피하기 위한 체크리스트입니다.

**프로젝트 ID**: `3611536` (Moadong) / `3974708` (moa_test)

---

## 모아동 실험 프레임워크 구조

Mixpanel의 자체 Experiments 기능을 **사용하지 않는다**. 자체 `ExperimentRepository`로 variant를 할당하고, `mixpanel.register()`로 Super Property에 등록한다.

```ts
// ExperimentRepository.ts
mixpanel.register({ [experiment.key]: variant });
// 예: { festival_timetable_nav_v1: 'tabs' }
```

Super Property로 등록되므로 이후 발생하는 **모든 이벤트에 자동으로 variant가 포함**된다.

**Mixpanel 쿼리 시 주의:**

- `$experiment_started` 이벤트는 존재하지 않음
- variant 구분은 `[experiment.key]` 프로퍼티로 breakdown
- 예: `festival_timetable_nav_v1 = 'tabs'` vs `'arrows'`

**실험 정의 위치:** `src/experiments/definitions.ts`  
**할당 저장 위치:** `localStorage('moadong_experiments')`

---

## 실험 시작 전 체크리스트

**1. 샘플 크기 사전 계산 (필수)**

실험 시작 전 반드시 필요 샘플 수를 계산합니다. 계산 없이 시작하면 무의미한 결과가 나올 가능성이 높습니다.

```
⚠️ Mixpanel은 신뢰구간 90% / 99% 두 가지만 제공 (95%는 없음)

선택 기준:
- 90% CI (α = 0.10): 탐색적 실험, 저위험 의사결정, 빠른 결론이 필요할 때
- 99% CI (α = 0.01): 핵심 지표 변경, 고위험 의사결정, 오판 비용이 클 때

샘플 크기 계산 시 Mixpanel 기준에 맞게 α 설정:
- 계산 도구: https://www.evanmiller.org/ab-testing/sample-size.html
- 검정력 (Power) = 0.80
- MDE (최소 감지 효과): 탐지하려는 최소 상대적 개선율

예시 (전환율 10% 기준, 상대적 +20% 감지 목표):
- 90% CI 기준 (α=0.10): 약 1,400명/그룹
- 99% CI 기준 (α=0.01): 약 2,700명/그룹
```

**모아동 규모에서의 현실적 계산 (DAU 500명, 50:50 split):**

```
그룹당 유입 = 500 / 2 = 250명/일

1,400명/그룹 필요 → 약 6일
2,700명/그룹 필요 → 약 11일

+ 최소 실험 기간 2주 권장 (요일 패턴 2사이클)
→ 사실상 2주가 기본 단위
```

**2. Primary Metric 하나만 사전 지정**

```
❌ 잘못된 방법: 전환율, 클릭률, 체류시간 등 동시 분석 후 유의한 것만 선택
✅ 올바른 방법: 실험 시작 전 Primary Metric 하나를 의사결정 기준으로 선언
               나머지는 Secondary (참고용)로만 사용
```

**현재 수집 중인 트래킹 데이터로 가능한 Primary Metric 예시:**

| Primary Metric | 이벤트 조합                                            | 측정 방법           |
| -------------- | ------------------------------------------------------ | ------------------- |
| 카드 CTR       | `ClubCard Viewed` → `ClubCard Clicked`                 | `club_id` 기준 비율 |
| 스크롤 도달률  | `Scroll Depth Reached` (depth=50%)                     | unique users 비율   |
| 상세 전환율    | `ClubCard Clicked` → `ClubDetailPage Visited`          | 퍼널 전환율         |
| 지원 클릭률    | `ClubDetailPage Visited` → `Club Apply Button Clicked` | 퍼널 전환율         |

**3. SRM (Sample Ratio Mismatch) 확인**

실험 그룹 간 실제 트래픽 비율이 설계(50:50)와 크게 다르면 실험 설계 버그 신호입니다.

모아동은 Super Property 기반이므로 **실험 키 프로퍼티로 breakdown**해서 확인합니다.

```bash
mcp-cli info claude_ai_mixpanel/Run-Query
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "SRM 확인 - variant 별 유저 수",
    "dateRange": { "type": "relative", "range": { "unit": "day", "value": 14 } },
    "metrics": [
      { "eventName": "MainPage Visited", "measurement": { "type": "basic", "math": "unique" } }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "property",
          "propertyName": "festival_timetable_nav_v1",
          "propertyType": "string",
          "resource": "event"
        }
      }
    ],
    "chartType": "table"
  }
}
EOF
# A군 vs B군 유저 수 차이가 10% 이상 → 원인 파악 후 실험 재설계
# 프로퍼티명은 experiment.key 값으로 교체
```

---

## 실험 진행 중 체크리스트

**4. 피킹(Peeking) 금지 — 가장 흔한 오류**

```
❌ 잘못된 방법: 매일 결과를 확인하다가 유의해지는 순간 실험 중단
   → 실제 1종 오류율이 최대 26%까지 상승

✅ 올바른 방법: 사전에 정한 기간 또는 샘플 크기에 도달한 후에만 결론
```

**5. 최소 실험 기간 준수**

```
권장: 최소 2주 이상 (요일별 패턴이 2사이클 포함되어야 함)
이유: 주중/주말 행동 패턴 차이가 결과를 왜곡할 수 있음

노벨티 효과 (Novelty Effect):
- 실험 초기 1~3일은 새로운 UI에 대한 일시적 반응일 수 있음
- 방법: Mixpanel Insights에서 날짜 범위를 실험 시작 4일 이후부터 설정
```

---

## 결과 해석 체크리스트

**6. 다중 비교 보정 (Multiple Comparisons)**

```
여러 지표를 동시에 검정할 경우 Bonferroni 보정 적용:
보정된 유의 수준 = α / 검정 지표 수

예 (90% CI 기준, α=0.10):
- 지표 5개 동시 검정 → 보정 α = 0.02
- 지표 10개 동시 검정 → 보정 α = 0.01
```

**Mixpanel에서 Bonferroni 보정 적용 방법:**

Mixpanel UI는 90%/99%만 선택 가능하므로 보정된 α를 직접 설정할 수 없습니다.
외부 도구로 p-value를 계산한 뒤 보정된 기준으로 판단합니다.

```
1. Mixpanel에서 각 지표의 유저 수와 전환율 추출
2. https://www.evanmiller.org/ab-testing/chi-squared.html 에서 p-value 계산
3. 보정된 α(예: 0.02)와 비교해서 유의 여부 판단

Secondary Metric은 참고용이며, 단독으로 성공 선언 금지
```

**7. 통계적 유의성 ≠ 실용적 유의성**

```
예시:
- 통계적으로 유의한 결과
- 카드 CTR 변화: 10.0% → 10.1% (+0.1%p 절대 개선)
- DAU 500명 기준 → 하루 고작 0.5명 추가 클릭

→ p-value만 보지 말고 효과 크기(Effect Size)와 신뢰구간을 함께 확인
```

**8. 신뢰구간 기반 해석**

```
Mixpanel 제공 CI 기준으로 결과 방향성 확인:

✅ 명확한 개선: CI [+2%, +8%]  → 0을 포함하지 않음, 개선 방향 확실
⚠️ 불확실:     CI [-1%, +11%] → 0을 포함, 방향 불명확
❌ 효과 없음:   CI [-3%, +2%]  → 0 중심, 유의미한 효과 없음
```

---

## Mixpanel 쿼리 패턴

### 카드 CTR 비교 (variant별)

```bash
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "funnels",
  "report": {
    "name": "A/B - 카드 노출 → 클릭 CTR",
    "dateRange": { "type": "relative", "range": { "unit": "day", "value": 14 } },
    "steps": [
      { "eventName": "ClubCard Viewed" },
      { "eventName": "ClubCard Clicked" }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "property",
          "propertyName": "festival_timetable_nav_v1",
          "propertyType": "string",
          "resource": "event"
        }
      }
    ]
  }
}
EOF
```

### 스크롤 도달률 비교 (variant별)

```bash
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "A/B - 스크롤 50% 도달 유저 비율",
    "dateRange": { "type": "relative", "range": { "unit": "day", "value": 14 } },
    "metrics": [
      {
        "eventName": "Scroll Depth Reached",
        "measurement": { "type": "basic", "math": "unique" },
        "filters": [
          { "propertyName": "depth_percent", "propertyType": "number", "value": 50, "operator": "equals" }
        ]
      }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "property",
          "propertyName": "festival_timetable_nav_v1",
          "propertyType": "string",
          "resource": "event"
        }
      }
    ],
    "chartType": "table"
  }
}
EOF
```

---

## 🚫 금지 행동 요약

| 행동                           | 왜 문제인가                | 대안                                      |
| ------------------------------ | -------------------------- | ----------------------------------------- |
| 유의해지는 순간 중단 (피킹)    | 1종 오류율 최대 26%로 폭발 | 사전 계획한 기간/샘플 수 준수             |
| 유의한 지표만 선택적 보고      | p-hacking, 결과 왜곡       | Primary Metric 사전 지정                  |
| 작은 샘플로 트렌드 해석        | 노이즈를 신호로 오인       | 샘플 크기 충족 후 결론                    |
| 서브그룹만 유의할 때 성공 선언 | 다중 비교 오류             | 전체 모집단 기준으로 판단                 |
| 이전 실험과 데이터 합산        | 독립성 가정 위반           | 실험 기간 분리하여 분석                   |
| SRM 확인 생략                  | 버그를 효과로 착각         | 결론 전 반드시 SRM 체크                   |
| `$experiment_started`로 쿼리   | 모아동은 해당 이벤트 없음  | experiment.key Super Property로 breakdown |

---

## 참고

- 실험 프레임워크: `src/experiments/`
- 실험 정의: `src/experiments/definitions.ts`
- 이벤트명: `src/constants/eventName.ts`
- 일반 Mixpanel 분석: `/mixpanel`
