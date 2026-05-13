---
description: Mixpanel A/B 테스트 유의성 검정 가이드
allowed-tools: Bash(mcp-cli *), Read, Write, Edit, Glob, Grep
---

# A/B 테스트 유의성 검정 가이드

A/B 테스트 결과를 분석할 때 통계적 오류를 피하기 위한 체크리스트입니다.

**프로젝트 ID**: `3611536` (Moadong) / `3974708` (moa_test)

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

⚠️ 소규모 서비스 주의: 일 방문자가 수백 명 수준이면 의미 있는 실험은 수 주~수 개월 소요
```

**2. Primary Metric 하나만 사전 지정**

```
❌ 잘못된 방법: 전환율, 클릭률, 체류시간 등 동시 분석 후 유의한 것만 선택
✅ 올바른 방법: 실험 시작 전 Primary Metric 하나를 의사결정 기준으로 선언
               나머지는 Secondary (참고용)로만 사용
```

**3. SRM (Sample Ratio Mismatch) 확인**

실험 그룹 간 실제 트래픽 비율이 설계(50:50)와 크게 다르면 실험 설계 버그 신호입니다. 결과 해석 전에 먼저 확인합니다.

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
      { "eventName": "$experiment_started", "measurement": { "type": "basic", "math": "unique" } }
    ],
    "breakdowns": [
      { "metric": { "type": "property", "propertyName": "Experiment variant", "propertyType": "string", "resource": "event" } }
    ],
    "chartType": "table"
  }
}
EOF
# A군 vs B군 유저 수 차이가 10% 이상 → 원인 파악 후 실험 재설계
```

---

## 실험 진행 중 체크리스트

**4. 피킹(Peeking) 금지 — 가장 흔한 오류**

```
❌ 잘못된 방법: 매일 결과를 확인하다가 유의해지는 순간 실험 중단
   → 실제 1종 오류율이 최대 26%까지 상승

✅ 올바른 방법: 사전에 정한 기간 또는 샘플 크기에 도달한 후에만 결론
   중간 모니터링이 필요하면: Mixpanel의 "Sequential" 유의성 옵션 사용
```

**5. 최소 실험 기간 준수**

```
권장: 최소 2주 이상 (요일별 패턴이 2사이클 포함되어야 함)
이유: 주중/주말 행동 패턴 차이가 결과를 왜곡할 수 있음

노벨티 효과 (Novelty Effect):
- 실험 초기 1~3일은 새로운 UI에 대한 일시적 반응일 수 있음
- 초기 데이터를 제외하고 분석하는 것을 권장
```

---

## 결과 해석 체크리스트

**6. 다중 비교 보정 (Multiple Comparisons)**

```
여러 지표를 동시에 검정할 경우 Bonferroni 보정 적용:
보정된 유의 수준 = α / 검정 지표 수

예 (90% CI 기준, α=0.10):
- 지표 5개 동시 검정 → α = 0.02 사용
- 지표 10개 동시 검정 → α = 0.01 사용

Secondary Metric은 참고용이며, 단독으로 성공 선언 금지
```

**7. 통계적 유의성 ≠ 실용적 유의성**

```
예시:
- 통계적으로 유의한 결과
- 전환율 변화: 10.0% → 10.1% (+0.1%p 절대 개선)
- 일 방문자 1,000명 기준 → 하루 고작 1명 추가

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

## Mixpanel A/B 테스트 결과 조회 패턴

```bash
# variant 별 전환율 비교 (퍼널)
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "funnels",
  "report": {
    "name": "A/B 실험 - variant 별 전환 퍼널",
    "dateRange": { "type": "relative", "range": { "unit": "day", "value": 14 } },
    "steps": [
      { "eventName": "ClubDetailPage Visited" },
      { "eventName": "Club Apply Button Clicked" }
    ],
    "breakdowns": [
      { "metric": { "type": "property", "propertyName": "Experiment variant", "propertyType": "string", "resource": "event" } }
    ]
  }
}
EOF
```

---

## 🚫 금지 행동 요약

| 행동                           | 왜 문제인가                | 대안                          |
| ------------------------------ | -------------------------- | ----------------------------- |
| 유의해지는 순간 중단 (피킹)    | 1종 오류율 최대 26%로 폭발 | 사전 계획한 기간/샘플 수 준수 |
| 유의한 지표만 선택적 보고      | p-hacking, 결과 왜곡       | Primary Metric 사전 지정      |
| 작은 샘플로 트렌드 해석        | 노이즈를 신호로 오인       | 샘플 크기 충족 후 결론        |
| 서브그룹만 유의할 때 성공 선언 | 다중 비교 오류             | 전체 모집단 기준으로 판단     |
| 이전 실험과 데이터 합산        | 독립성 가정 위반           | 실험 기간 분리하여 분석       |
| SRM 확인 생략                  | 버그를 효과로 착각         | 결론 전 반드시 SRM 체크       |

---

## 참고

- 실험 프레임워크: `src/experiments/`
- 실험 정의: `src/experiments/definitions.ts`
- 이벤트명: `src/constants/eventName.ts`
- 일반 Mixpanel 분석: `/mixpanel`
