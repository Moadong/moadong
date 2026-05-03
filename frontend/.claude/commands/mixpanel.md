---
description: Mixpanel 데이터 분석 및 리포트 생성
allowed-tools: Bash(mcp-cli *), Read, Write, Edit, Glob, Grep
---

# Mixpanel 데이터 분석

Mixpanel MCP를 사용하여 사용자 행동 데이터를 분석하고 인사이트를 도출합니다.

**⚠️ 중요**: 모든 분석 결과는 자동으로 repo 루트 기준 `docs/weekly-reports/` 디렉토리에 마크다운 파일로 저장됩니다.

---

## 필수 사전 작업 ⚠️

**CRITICAL**: MCP 툴 사용 전 반드시 스키마를 확인해야 합니다.

```bash
# 1. 항상 먼저 스키마 확인 (MANDATORY)
mcp-cli info claude_ai_mixpanel/<tool-name>

# 2. 그 다음에 호출
mcp-cli call claude_ai_mixpanel/<tool-name> '{...}'
```

---

## 프로젝트 정보

### 기본 설정

- **Project ID**: `3611536` (Moadong)
- **Workspace ID**: `4111120` (All Project Data)
- **Test Project ID**: `3974708` (moa_test)

### 주요 이벤트

**공통 사용자 플로우** (모든 동아리):

- `MainPage Visited` - 메인 페이지 방문
- `ClubCard Clicked` - 동아리 카드 클릭
- `ClubDetailPage Visited` - 상세 페이지 방문
- `ClubDetailPage Duration` - 상세 페이지 체류시간
- `Club Apply Button Clicked` - 지원하기 버튼 클릭

**케이스 A: 내부 지원서 사용 동아리** (일부):

- `Club Apply Button Clicked` 이후:
  - → `ApplicationFormPage Visited` - 지원서 페이지 방문
  - → `ApplicationFormPage Duration` - 지원서 페이지 체류시간
  - → `Application Form Submitted` - 지원서 제출

**케이스 B: 외부 폼 사용 동아리** (대부분):

- `Club Apply Button Clicked` 이후:
  - → 외부 리다이렉트 (구글폼/네이버폼)
  - → **추적 불가** - 외부 폼 제출 데이터는 Mixpanel에 기록되지 않음

**⚠️ 분석 시 주의사항**:

- 전환율 분석 시 **내부 지원서 동아리만 필터링** 필요
- `Application Form Submitted` 기반 분석은 전체 동아리를 대표하지 않음
- `Club Apply Button Clicked`가 실제 지원 의도를 나타내는 더 정확한 지표

**관리자 플로우**:

- `로그인페이지 Visited` - 관리자 로그인 페이지
- `로그인 버튼클릭` - 로그인 시도
- `사이드바 탭 클릭` - 관리자 사이드바 탭 이동
- `동아리 기본 정보 수정 버튼클릭` - 기본 정보 수정
- `동아리 모집 정보 수정 버튼클릭` - 모집 정보 수정

### 주요 프로퍼티

**이벤트 프로퍼티**:

- `clubName` - 동아리명 (string)
- `club_id` - 동아리 ID (number/string)
- `duration_seconds` - 체류시간 (number, seconds)
- `url` - 페이지 URL (string)
- `$browser`, `$os`, `$device` - 디바이스 정보
- ⚠️ **동아리 지원서 타입 구분 프로퍼티** - 확인 필요 (내부/외부 폼 구분)

**사용자 프로퍼티**:

- `$user_id` - 사용자 ID
- `$distinct_id` - 고유 식별자

**분석 팁**:

- 외부 폼 사용 동아리를 제외하려면 `ApplicationFormPage Visited` 이벤트가 있는 동아리만 필터링
- 또는 특정 동아리 리스트로 필터링 (내부 지원서 사용 동아리 화이트리스트)

---

## Step 1: 분석 유형 확인

사용자가 요청한 분석 유형을 파악합니다:

### 1. 기간별 트렌드 분석

- 주간/월간/분기별 지표 변화
- 예: "지난 2주간 상세페이지 체류시간 분석"

### 2. 코호트 분석

- 특정 행동을 한 유저 그룹 분석
- 예: "지원하기 클릭한 유저 vs 안 한 유저 비교"

### 3. TOP N 분석

- 상위/하위 항목 순위
- 예: "체류시간이 가장 긴 동아리 TOP10"

### 4. 퍼널 분석

- 전환율 및 이탈률 분석
- 예: "메인 → 상세 → 지원 전환 퍼널"

### 5. 주간 리포트

- 정기 KPI 모니터링
- 예: "이번 주 주간 리포트 생성"

---

## Step 2: 필요한 데이터 확인

### 2-1. 이벤트 검색

```bash
# 키워드로 이벤트 검색
mcp-cli info claude_ai_mixpanel/Get-Events
mcp-cli call claude_ai_mixpanel/Get-Events '{"project_id": 3611536, "query": "detail"}'
```

### 2-2. 이벤트 프로퍼티 확인

```bash
# 특정 이벤트의 프로퍼티 확인
mcp-cli info claude_ai_mixpanel/Get-Property-Names
mcp-cli call claude_ai_mixpanel/Get-Property-Names '{
  "project_id": 3611536,
  "resource_type": "Event",
  "event": "ClubDetailPage Duration"
}'
```

---

## Step 3: 쿼리 스키마 확인 (MANDATORY)

분석 타입에 맞는 스키마를 확인합니다:

```bash
# Insights 쿼리 스키마 (가장 자주 사용)
mcp-cli info claude_ai_mixpanel/Get-Query-Schema
mcp-cli call claude_ai_mixpanel/Get-Query-Schema '{"report_type": "insights"}'

# Funnel 쿼리 스키마
mcp-cli call claude_ai_mixpanel/Get-Query-Schema '{"report_type": "funnels"}'

# Retention 쿼리 스키마
mcp-cli call claude_ai_mixpanel/Get-Query-Schema '{"report_type": "retention"}'
```

**주의**: 스키마가 크면 파일로 저장되므로 Read 툴로 읽어야 합니다.

---

## Step 4: 분석 실행

### 패턴 1: 체류시간 TOP N 분석

```bash
mcp-cli info claude_ai_mixpanel/Run-Query
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "상세페이지 체류시간 TOP10",
    "dateRange": {
      "type": "relative",
      "range": {
        "unit": "day",
        "value": 14
      }
    },
    "metrics": [
      {
        "eventName": "ClubDetailPage Duration",
        "measurement": {
          "type": "aggregate-property",
          "math": "median",
          "propertyName": "duration_seconds"
        }
      }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "property",
          "propertyName": "clubName",
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

### 패턴 2: 유저 코호트 비교

```bash
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "지원 클릭 유저 vs 비클릭 유저 체류시간",
    "dateRange": {
      "type": "relative",
      "range": {
        "unit": "day",
        "value": 14
      }
    },
    "metrics": [
      {
        "eventName": "ClubDetailPage Duration",
        "measurement": {
          "type": "aggregate-property",
          "math": "median",
          "propertyName": "duration_seconds"
        }
      }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "frequency-per-user",
          "eventName": "Club Apply Button Clicked"
        }
      }
    ],
    "chartType": "bar"
  }
}
EOF
```

### 패턴 3: 기간별 트렌드 (케이스 A: 내부 지원서만)

```bash
# ⚠️ 내부 지원서 사용 동아리만 추적 가능
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "일별 지원서 제출 추이 (내부 폼)",
    "dateRange": {
      "type": "relative",
      "range": {
        "unit": "day",
        "value": 30
      }
    },
    "metrics": [
      {
        "eventName": "Application Form Submitted",
        "measurement": {
          "type": "basic",
          "math": "total"
        }
      }
    ],
    "chartType": "line",
    "unit": "day"
  }
}
EOF
```

### 패턴 4: 전체 지원 의도 추이 (케이스 A+B 모두)

```bash
# ✅ 내부/외부 폼 모두 포함한 실제 지원 의도
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "일별 지원하기 버튼 클릭 추이 (전체)",
    "dateRange": {
      "type": "relative",
      "range": {
        "unit": "day",
        "value": 30
      }
    },
    "metrics": [
      {
        "eventName": "Club Apply Button Clicked",
        "measurement": {
          "type": "basic",
          "math": "total"
        }
      }
    ],
    "chartType": "line",
    "unit": "day"
  }
}
EOF
```

### 패턴 5: 내부 vs 외부 폼 동아리 비교

```bash
# 동아리별 ApplicationFormPage Visited 발생 여부로 내부/외부 구분
mcp-cli call claude_ai_mixpanel/Run-Query - <<'EOF'
{
  "project_id": 3611536,
  "report_type": "insights",
  "report": {
    "name": "동아리별 지원 방식 구분",
    "dateRange": {
      "type": "relative",
      "range": {
        "unit": "day",
        "value": 30
      }
    },
    "metrics": [
      {
        "eventName": "Club Apply Button Clicked",
        "measurement": {
          "type": "basic",
          "math": "total"
        }
      },
      {
        "eventName": "ApplicationFormPage Visited",
        "measurement": {
          "type": "basic",
          "math": "total"
        }
      }
    ],
    "breakdowns": [
      {
        "metric": {
          "type": "property",
          "propertyName": "clubName",
          "propertyType": "string",
          "resource": "event"
        }
      }
    ],
    "chartType": "table"
  }
}
EOF
# ApplicationFormPage Visited가 0인 동아리 = 외부 폼 사용
```

---

## Step 5: 결과 분석 및 해석

### 5-1. 데이터 해석 가이드

**중간값 vs 평균값**:

- **중간값(median)**: 이상치에 덜 민감, 일반적인 사용자 행동 파악
- **평균값(average)**: 전체 트렌드, 이상치 포함

**체류시간 해석**:

- 짧은 체류시간 ≠ 낮은 관심도
- 빠른 의사결정 = 명확한 정보 전달 성공 가능
- 긴 체류시간 = 탐색형 유저 또는 정보 부족

**클릭 횟수 패턴**:

- 0번: 탐색 중이거나 관심 없음
- 1-5번: 일반적인 탐색 및 지원
- 14번+: 파워유저 또는 비교 검토 중

**⚠️ 전환율 해석 시 주의사항 (중요!)**:

**`Application Form Submitted` 기반 전환율** (케이스 A만):

- ❌ **전체 동아리를 대표하지 않음** - 내부 지원서 동아리만 포함
- 사용 목적: 내부 폼 UX 개선 효과 측정
- 전체 서비스 성과로 해석 금지

**`Club Apply Button Clicked` 기반 전환율** (케이스 A+B) ✅:

- ✅ **추천 지표** - 실제 지원 의도를 나타냄
- 내부/외부 폼 구분 없이 전체 성과 파악 가능
- 동아리 상세페이지 효과 측정에 적합

**분석 목적에 따른 선택**:

- 전체 플랫폼 성과 파악 → `Club Apply Button Clicked` 사용
- 내부 지원서 UX 분석 → `Application Form Submitted` 사용
- 두 지표를 함께 보면서 내부/외부 폼 사용 비율 파악

### 5-2. 인사이트 도출

분석 결과를 바탕으로 다음을 도출합니다:

1. **예상과 다른 결과 강조** - 놀라운 발견 ⚠️
2. **유저 타입 분류** - 행동 패턴별 세그먼트
3. **가능한 해석 제시** - 3가지 이상의 가설
4. **비즈니스 시사점** - 긍정적 신호 + 개선 포인트
5. **다음 분석 제안** - 추가 탐색 방향

**⚠️ 인사이트 도출 후 필수 작업**:

인사이트를 도출한 후에는 **반드시 Step 6**으로 이동하여 분석 결과를 자동으로 파일에 저장해야 합니다.

---

## Step 6: 문서화

### 6-1. 리포트 파일 자동 생성

**CRITICAL**: 분석 완료 후 반드시 결과를 자동으로 파일에 저장해야 합니다.

분석 결과를 repo 루트 기준 `docs/weekly-reports/` 디렉토리에 **자동으로** 저장합니다.

**파일명 규칙**:

- 주간 리포트: `YYYY-WNN-description.md` (예: `2026-W14-club-engagement-analysis.md`)
- 기간별 리포트: `YYYY-MM-to-MM-description.md` (예: `2026-01-to-03-club-engagement-analysis.md`)
- 특정 분석: `YYYY-MM-DD-description.md` (예: `2026-04-03-club-detail-visit-analysis.md`)

**자동 저장 프로세스**:

1. 분석 쿼리 실행 및 결과 수집
2. 인사이트 도출 및 해석
3. 아래 템플릿에 맞춰 마크다운 작성
4. **Write 툴을 사용하여 repo 루트 기준 `docs/weekly-reports/[파일명].md` 경로에 저장** (절대 경로는 `git rev-parse --show-toplevel` 결과를 앞에 붙여 계산)
5. 저장 완료 후 사용자에게 파일 경로 안내

**예시**:

```bash
# 분석 완료 후 자동 저장
# Write 툴 사용하여 파일 생성
file_path: <repo-root>/docs/weekly-reports/2026-04-03-club-detail-visit-analysis.md  # repo 루트는 git rev-parse --show-toplevel 으로 확인
content: [템플릿 기반으로 작성한 마크다운 내용]
```

### 6-2. 리포트 템플릿

```markdown
# [분석 제목]

**분석 기간**: YYYY-MM-DD ~ YYYY-MM-DD
**분석 일자**: YYYY-MM-DD
**데이터 소스**: Mixpanel

---

## 📊 분석 1: [분석명]

### 주요 지표

- **측정 이벤트**: `Event Name`
- **측정 지표**: 중간값/평균값
- **분석 방법**: 설명

### 결과 테이블

| 순위/구분 | 항목 | 값  |
| --------- | ---- | --- |
| ...       | ...  | ... |

### 인사이트

- 핵심 발견 1
- 핵심 발견 2
- 핵심 발견 3

### 리포트 링크

[Mixpanel 리포트 보기](URL)

---

## 🎯 분석 2: [분석명]

(동일 구조 반복)

---

## 📊 기간별 비교 (선택사항)

이전 기간과의 비교 분석

---

## 📌 다음 분석 제안

1. **제안 1** - 설명
2. **제안 2** - 설명
3. **제안 3** - 설명
```

---

## 자주 사용하는 분석 시나리오

### 시나리오 1: 주간 리포트 생성

```text
사용자: /mixpanel 지난주 주간 리포트 생성해줘
```

→ `docs/mixpanel-weekly-report-prompts.md`의 프롬프트 1-8 실행

### 시나리오 2: TOP N 동아리 분석

```text
사용자: /mixpanel 2주간 체류시간 TOP10 동아리
```

→ 체류시간 중간값 기준 상위 10개 동아리 분석 (모든 동아리 대상)

### 시나리오 3: 유저 코호트 비교

```text
사용자: /mixpanel 지원하기 클릭한 유저 vs 안 한 유저 체류시간 비교
```

→ 클릭 횟수별 체류시간 분석 (중간값 + 평균값)

### 시나리오 4: 급상승 동아리 원인 분석

```text
사용자: /mixpanel 백경 유스호스텔 체류시간 급증 원인 분석
```

→ 시계열 분석 + 프로퍼티 비교

### 시나리오 5: 내부 지원서 전환율 분석 (케이스 A만)

```text
사용자: /mixpanel 내부 지원서 사용 동아리의 지원 완료율
```

→ `ApplicationFormPage Visited` → `Application Form Submitted` 전환율
→ ⚠️ 외부 폼 동아리는 제외됨

### 시나리오 6: 전체 지원 의도 분석 (케이스 A+B)

```text
사용자: /mixpanel 지원하기 버튼 클릭률 분석
```

→ `ClubDetailPage Visited` → `Club Apply Button Clicked` 전환율
→ ✅ 내부/외부 폼 모두 포함하는 실제 지원 의도 지표

---

## 주의사항

### ⚠️ 필수 규칙

1. **스키마 확인 우선**: `mcp-cli info` 없이 `mcp-cli call` 금지
2. **프로젝트 ID 확인**: 3611536(운영) vs 3974708(테스트)
3. **이벤트명 정확히**: 대소문자, 띄어쓰기 정확히 일치
4. **날짜 범위 합리적**: 너무 긴 기간은 타임아웃 가능
5. **리포트 링크 포함**: 모든 쿼리 결과에 Mixpanel URL 포함
6. **⚠️ 지원서 타입 구분 필수**: 내부 폼 vs 외부 폼 동아리 구분 주의
   - `Application Form Submitted`는 일부 동아리만 해당
   - 전체 성과는 `Club Apply Button Clicked` 사용

### 🚫 하지 말아야 할 것

- 스키마 확인 없이 파라미터 추측
- 존재하지 않는 이벤트/프로퍼티 사용
- 너무 많은 breakdown (성능 저하)
- 분석 결과 없이 추측으로 인사이트 작성
- **`Application Form Submitted`를 전체 동아리 성과로 해석** ❌
  - 내부 지원서 동아리만 포함됨을 명시해야 함

---

## 참고 문서

### 프로젝트 내 문서

- 주간 리포트 프롬프트: `docs/mixpanel-weekly-report-prompts.md`
- 관리자 리포트 프롬프트: `docs/mixpanel-admin-weekly-report-prompts.md`
- 리포팅 가이드: `docs/mixpanel-reporting.md`

### 이벤트 정의

- 프론트엔드 이벤트: `src/constants/eventName.ts`
- Mixpanel 초기화: `src/utils/initSDK.ts`

### 기존 리포트

- `docs/weekly-reports/` - 과거 분석 리포트 참고
