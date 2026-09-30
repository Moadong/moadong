---
name: frontend-fundamentals
description: Use before committing frontend changes (the /commit command runs it), or when asked to check a diff against Frontend Fundamentals (frontend-fundamentals.com/code-quality/code) — readability, predictability, cohesion, coupling.
---

# Frontend Fundamentals 점검

[Frontend Fundamentals 코드 품질 가이드](https://frontend-fundamentals.com/code-quality/code/) 16개로 이번 diff를 본다. 가이드는 서로 긴장 관계라(중복 허용 ↔ 추상화) 전부 자동으로 고치지 않는다. **diff 안에서 끝나는 것만 고치고, 나머지는 지적만 한다.**

## 범위

- 대상: `git diff --staged`, 비어 있으면 `git diff HEAD`. 그중 `src/**/*.{ts,tsx}`
- 제외: `*.test.*`, `*.stories.tsx`, `src/mocks/**`
- 이번 diff에서 추가·수정된 줄만 본다. 기존 코드의 냄새는 지적도 하지 않는다

## 자동 수정 (diff 안에서 끝날 때만)

| 가이드                                                                                                                                                                                                                              | 고칠 때                                                                                                                                                             | 고치지 않을 때                                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [같이 실행되지 않는 코드 분리하기](https://frontend-fundamentals.com/code-quality/code/examples/submit-button.html)                                                                                                                 | 한 컴포넌트 안에 권한·상태별로 배타적인 분기가 교차하면 분기마다 컴포넌트로 나눈다                                                                                  | 분기가 한두 줄이라 나누면 파일만 늘어날 때                        |
| [로직 종류에 따라 합쳐진 함수 쪼개기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-readability.html)                                                                                                 | 새로 만든 훅·함수가 성격이 다른 일을 한데 모아 두면 종류별로 나누고 이름을 붙인다                                                                                   | 호출부가 diff 밖에 있을 때 → 리포트                               |
| [복잡한 조건에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/condition-name.html)                                                                                                                       | `&&`·`some`·`filter`가 겹쳐 조건을 한눈에 못 읽으면 `isSameCategory`처럼 이름 붙인 변수로 뺀다                                                                      | `x => x * 2`처럼 단순하거나 한 번 쓰는 짧은 조건                  |
| [매직 넘버에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html) · [매직 넘버 없애기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html) | 의미 있는 숫자 리터럴을 `ANIMATION_DELAY_MS` 같은 UPPER_SNAKE_CASE 상수로. 파일 하나에서만 쓰면 파일 상단에, 여러 파일이 같은 값을 공유하면 `src/constants/`에 둔다 | `0`, `1`, `-1` 같은 자명한 값, styled-components 안의 레이아웃 px |
| [시점 이동 줄이기](https://frontend-fundamentals.com/code-quality/code/examples/user-policy.html)                                                                                                                                   | 조건 하나를 이해하려고 위아래 함수·상수를 오가야 하면 `switch`나 객체 한 덩어리로 모아 드러낸다                                                                     | 여러 곳에서 재사용하는 추상화일 때                                |
| [삼항 연산자 단순하게 하기](https://frontend-fundamentals.com/code-quality/code/examples/ternary-operator.html)                                                                                                                     | 중첩 삼항은 `if` 조기 반환(필요하면 IIFE)으로 푼다                                                                                                                  | 중첩 없는 삼항 한 단                                              |
| [왼쪽에서 오른쪽으로 읽히게 하기](https://frontend-fundamentals.com/code-quality/code/examples/comparison-order.html)                                                                                                               | 범위 조건 `a >= b && a <= c` → `b <= a && a <= c`                                                                                                                   | 범위 조건이 아닌 비교                                             |

**diff 안에서 끝난다**는 뜻: 고치려고 바꿔야 하는 줄이 모두 이번 diff에 있고, 다른 파일의 호출부를 바꾸지 않는다. 하나라도 벗어나면 리포트로 내린다.

## 리포트만 (지적하고 사용자가 판단)

구조를 바꾸거나 diff 밖까지 번지는 가이드라서, 자동으로 고치면 이번 작업과 상관없는 리팩터링이 커밋에 섞인다.

| 가이드                                                                                                                        | 볼 것                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [구현 상세 추상화하기](https://frontend-fundamentals.com/code-quality/code/examples/login-start-page.html)                    | 인증 확인·리다이렉트 같은 부수 로직이 컴포넌트 본문을 차지하는가. Wrapper로 빼면 나은가, 과한 추상화인가                |
| [이름 겹치지 않게 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/http.html)                           | 라이브러리와 같은 이름(`http`, `fetch` 등)인데 인증·로깅 같은 추가 동작을 하는가                                        |
| [같은 종류의 함수는 반환 타입 통일하기](https://frontend-fundamentals.com/code-quality/code/examples/use-user.html)           | 새 Query 훅이 다른 훅처럼 Query 객체를 반환하는가, 검증 함수가 같은 모양(`{ ok, reason }` 등)을 반환하는가              |
| [숨은 로직 드러내기](https://frontend-fundamentals.com/code-quality/code/examples/hidden-logic.html)                          | 이름·파라미터·반환값으로 예측할 수 없는 로깅·트래킹·저장이 함수 안에 있는가                                             |
| [함께 수정되는 파일을 같은 디렉토리에 두기](https://frontend-fundamentals.com/code-quality/code/examples/code-directory.html) | 한 기능 전용 파일을 `src/hooks`·`src/utils` 같은 종류별 폴더에 새로 두었는가, `../../../다른도메인` import가 생겼는가   |
| [폼의 응집도 생각하기](https://frontend-fundamentals.com/code-quality/code/examples/form-fields.html)                         | 검증이 필드 단위·폼 단위에 섞여 흩어져 있는가. 필드 간 의존이 있으면 폼 단위, 재사용 필드면 필드 단위                   |
| [책임을 하나씩 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-coupling.html)           | 기존 훅·컴포넌트에 성격이 다른 책임을 덧붙였는가                                                                        |
| [중복 코드 허용하기](https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html)                      | 페이지마다 달라질 수 있는 동작을 공통 훅으로 묶었는가(→ 중복 허용 권장). 동작·로깅·모양이 앞으로도 같다면 공통화가 맞다 |
| [Props Drilling 지우기](https://frontend-fundamentals.com/code-quality/code/examples/item-edit-modal.html)                    | 중간 컴포넌트가 쓰지 않고 넘기기만 하는 prop이 생겼는가. 조합(`children`) 먼저, Context는 최후                          |

## 지키는 것

- 동작을 바꾸지 않는다. 가이드 적용은 리팩터링이지 기능 변경이 아니다
- `useMemo`·`useCallback`·`memo`를 새로 넣지 않는다(React Compiler 사용). 훅을 쪼갤 때도 마찬가지
- 레포 컨벤션이 가이드보다 우선이다(`CLAUDE.md` 네이밍·상수 위치·Import 순서)

## 검증

자동 수정을 하나라도 했으면 아래를 모두 통과해야 커밋으로 넘어간다. 실패하면 원인이 된 수정을 되돌리고 리포트로 내린다. 자동 수정 전에도 있던 실패(작성한 코드 자체의 lint 위반 등)는 되돌리지 않고 리포트 맨 위에 올려 커밋 여부를 사용자가 정하게 한다.

```bash
npm run typecheck
npx eslint <수정한 파일들>
npx jest --findRelatedTests <수정한 파일들> --passWithNoTests
```

## 출력

```text
## Frontend Fundamentals 점검

### 자동 수정 (N건)
- `src/.../Foo.tsx:42` [복잡한 조건에 이름 붙이기] isRecruiting 변수로 추출

### 리포트 (M건, 판단 필요)
- `src/.../useBar.ts:10` [숨은 로직 드러내기] fetchBar 안에서 trackEvent 호출 — 호출부로 옮길지 결정 필요

### 검증
- typecheck ✅ / eslint ✅ / jest ✅ (관련 테스트 3개)
```

해당 없음이면 "지적 없음" 한 줄로 끝낸다.
