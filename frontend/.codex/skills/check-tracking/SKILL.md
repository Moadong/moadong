---
name: "check-tracking"
description: "모아동 프론트엔드의 Mixpanel 이벤트 트래킹을 감사할 때 사용한다. 트래킹 점검, 누락된 trackEvent 탐지, USER_EVENT 정의와 사용처 비교, 이벤트 계측 확인 요청에 사용한다."
---

# 모아동 이벤트 트래킹 감사

## Codex 적용 규칙

- Claude slash command의 인자 참조는 사용자의 현재 요청으로 해석한다.
- Claude 전용 `allowed-tools` 메타데이터는 무시하고, 현재 Codex 세션에서 제공되는 도구를 사용한다.
- 원본이 Claude 서브에이전트 호출을 지시하면, Codex에서 명시적인 서브에이전트 도구가 있고 적절한 경우를 제외하고 해당 에이전트 지침을 직접 따라 작업한다.
- 모든 작업은 저장소의 `AGENTS.md` 지침을 우선해서 따른다.

## Source: `.claude/commands/check-tracking.md`

# 이벤트 트래킹 감사 (Event Tracking Audit)

`src/constants/eventName.ts`의 정의와 실제 코드베이스 사용 현황을 비교해 Mixpanel 트래킹 누락을 점검합니다.

> **실행 위치**: 아래 모든 명령은 **`frontend/` 디렉터리**에서 실행해야 합니다.
> 모노레포 루트에서 실행하면 `src/` 경로를 찾지 못해 결과가 0건으로 나옵니다.

## 분석 순서

아래 bash 명령을 순서대로 실행하고 결과를 수집하세요.

### Step 1: 정의된 이벤트 목록 추출

```bash
grep -E "^\s+[A-Z_]+:" src/constants/eventName.ts
```

`USER_EVENT` 안의 키만 수집합니다 (`ADMIN_EVENT`, `PAGE_VIEW`는 제외).

### Step 2: 실제 trackEvent 호출 현황

```bash
grep -rn "trackEvent(USER_EVENT\." src/ --include="*.tsx" --include="*.ts"
```

어떤 파일의 몇 번째 줄에서 어떤 이벤트를 호출하는지 수집합니다.

### Step 3: 트래킹 미적용 인터랙션 탐지

```bash
grep -rn "onClick\|onSubmit" src/pages/ src/components/ --include="*.tsx" -l
```

위 파일 목록 중 `trackEvent`를 import하는 파일:

```bash
grep -rln "trackEvent\|useMixpanelTrack" src/pages/ src/components/ --include="*.tsx"
```

두 목록의 **교집합 파일** — 즉, onClick/onSubmit이 있고 trackEvent도 쓰는 파일 — 에서 trackEvent 없이 onClick만 있는 핸들러를 탐지합니다:

```bash
grep -n "onClick\|onSubmit" <파일경로>
```

각 핸들러 주변 5줄을 읽어 trackEvent 호출이 없으면 누락 의심으로 분류합니다.

### Step 4: 미사용 이벤트 탐지

Step 1에서 수집한 USER_EVENT 키 각각에 대해 Step 2 결과에서 사용 여부를 확인합니다.
한 번도 등장하지 않는 키는 미사용 이벤트입니다.

---

## 출력 형식

분석 결과를 아래 3개 표로 요약합니다.

### ✅ 트래킹 중인 이벤트

| 이벤트명           | 사용 파일            |
| ------------------ | -------------------- |
| `CLUB_MAP_CLICKED` | `ClubDetailPage.tsx` |
| …                  | …                    |

### ⚠️ 트래킹 누락 의심 인터랙션

onClick/onSubmit이 있으나 trackEvent 호출이 없는 핸들러. **사용자 의도가 담긴 주요 액션**(버튼 클릭, 폼 제출 등)에 한해 나열하고, 단순 상태 토글이나 내부 UI 제어는 제외합니다.

| 파일                     | 핸들러       | 비고           |
| ------------------------ | ------------ | -------------- |
| `ClubDetailPage.tsx:157` | `onMapClick` | 지도 모달 열기 |
| …                        | …            | …              |

### 🗑️ 정의만 되고 미사용 이벤트 (USER_EVENT 기준)

코드 어디서도 `trackEvent`로 호출되지 않는 이벤트.

| 키           | 이벤트명       |
| ------------ | -------------- |
| `SOME_EVENT` | `'Some Event'` |
| …            | …              |

---

## 주의사항

- `ADMIN_EVENT`와 `PAGE_VIEW`는 별도 트래킹 체계(useTrackPageView 등)를 사용하므로 이번 감사 대상에서 제외합니다.
- 누락 의심은 **사용자 행동 추적 가치가 있는** 인터랙션에 집중합니다. 드롭다운 토글, 입력 포커스 등 세부 UI 이벤트는 판단이 필요한 경우 별도로 언급합니다.
- 결과 출력 후 실제 추가가 필요한 항목이 있으면 이어서 작업할지 물어봅니다.
