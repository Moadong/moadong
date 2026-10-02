---
name: frontend-fundamentals
description: Use before committing frontend changes (the /commit command runs it), or when asked to check a diff against Frontend Fundamentals — code quality (frontend-fundamentals.com/code-quality/code; readability, predictability, cohesion, coupling) and accessibility (frontend-fundamentals.com/a11y; structure, names, interactions, alt text).
---

# Frontend Fundamentals 점검

Frontend Fundamentals의 [코드 품질 가이드](https://frontend-fundamentals.com/code-quality/code/) 16개와 [접근성 가이드](https://frontend-fundamentals.com/a11y/)로 이번 diff를 본다. 가이드는 서로 긴장 관계라(중복 허용 ↔ 추상화) 전부 자동으로 고치지 않는다. **diff 안에서 끝나는 것만 고치고, 나머지는 지적만 한다.**

## 범위

- 대상: `git diff HEAD`(staged·unstaged 모두)와 `git ls-files --others --exclude-standard`의 새 파일. 그중 `src/**/*.{ts,tsx}`. 새 파일은 전체가 추가된 줄이다
- 제외: `*.test.*`, `*.stories.tsx`, `src/mocks/**`
- 이번 diff에서 추가·수정된 줄만 본다. 기존 코드의 냄새는 지적도 하지 않는다
- 접근성 가이드는 JSX를 보는 것이라 `*.tsx`만 본다

## 코드 품질 — 자동 수정 (diff 안에서 끝날 때만)

| 가이드                                                                                                                                                                                                                              | 고칠 때                                                                                              | 고치지 않을 때                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [로직 종류에 따라 합쳐진 함수 쪼개기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-readability.html)                                                                                                 | 새로 만든 훅·함수가 성격이 다른 일을 한데 모아 두면 종류별로 나누고 이름을 붙인다                    | 호출부가 diff 밖에 있을 때 → 리포트                                                                                                      |
| [복잡한 조건에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/condition-name.html)                                                                                                                       | `&&`·`some`·`filter`가 겹쳐 조건을 한눈에 못 읽으면 `isSameCategory`처럼 이름 붙인 변수로 뺀다       | `x => x * 2`처럼 단순하거나 한 번 쓰는 짧은 조건                                                                                         |
| [매직 넘버에 이름 붙이기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-readability.html) · [매직 넘버 없애기](https://frontend-fundamentals.com/code-quality/code/examples/magic-number-cohesion.html) | 의미 있는 숫자 리터럴을 `ANIMATION_DELAY_MS` 같은 UPPER_SNAKE_CASE 상수로 만들어 그 파일 상단에 둔다 | `0`, `1`, `-1` 같은 자명한 값, styled-components 안의 레이아웃 px. 같은 의미의 값을 다른 파일도 쓰면 → 리포트(`src/constants/`로 모을지) |
| [시점 이동 줄이기](https://frontend-fundamentals.com/code-quality/code/examples/user-policy.html)                                                                                                                                   | 조건 하나를 이해하려고 위아래 함수·상수를 오가야 하면 `switch`나 객체 한 덩어리로 모아 드러낸다      | 여러 곳에서 재사용하는 추상화일 때                                                                                                       |
| [삼항 연산자 단순하게 하기](https://frontend-fundamentals.com/code-quality/code/examples/ternary-operator.html)                                                                                                                     | 중첩 삼항은 `if` 조기 반환(필요하면 IIFE)으로 푼다                                                   | 중첩 없는 삼항 한 단                                                                                                                     |
| [왼쪽에서 오른쪽으로 읽히게 하기](https://frontend-fundamentals.com/code-quality/code/examples/comparison-order.html)                                                                                                               | 범위 조건 `a >= b && a <= c` → `b <= a && a <= c`                                                    | 범위 조건이 아닌 비교                                                                                                                    |

**diff 안에서 끝난다**는 뜻: 고치려고 바꿔야 하는 줄이 모두 이번 diff에 있고, 다른 파일의 호출부를 바꾸지 않는다. 하나라도 벗어나면 리포트로 내린다.

## 코드 품질 — 리포트만 (지적하고 사용자가 판단)

구조를 바꾸거나 diff 밖까지 번지는 가이드라서, 자동으로 고치면 이번 작업과 상관없는 리팩터링이 커밋에 섞인다.

| 가이드                                                                                                                        | 볼 것                                                                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [같이 실행되지 않는 코드 분리하기](https://frontend-fundamentals.com/code-quality/code/examples/submit-button.html)           | 한 컴포넌트 안에 권한·상태별로 배타적인 분기가 교차하는가. 분기마다 컴포넌트로 나누면 이름·위치·props를 새로 정해야 해서 자동으로 하지 않는다 |
| [구현 상세 추상화하기](https://frontend-fundamentals.com/code-quality/code/examples/login-start-page.html)                    | 인증 확인·리다이렉트 같은 부수 로직이 컴포넌트 본문을 차지하는가. Wrapper로 빼면 나은가, 과한 추상화인가                                      |
| [이름 겹치지 않게 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/http.html)                           | 라이브러리와 같은 이름(`http`, `fetch` 등)인데 인증·로깅 같은 추가 동작을 하는가                                                              |
| [같은 종류의 함수는 반환 타입 통일하기](https://frontend-fundamentals.com/code-quality/code/examples/use-user.html)           | 새 Query 훅이 다른 훅처럼 Query 객체를 반환하는가, 검증 함수가 같은 모양(`{ ok, reason }` 등)을 반환하는가                                    |
| [숨은 로직 드러내기](https://frontend-fundamentals.com/code-quality/code/examples/hidden-logic.html)                          | 이름·파라미터·반환값으로 예측할 수 없는 로깅·트래킹·저장이 함수 안에 있는가                                                                   |
| [함께 수정되는 파일을 같은 디렉토리에 두기](https://frontend-fundamentals.com/code-quality/code/examples/code-directory.html) | 한 기능 전용 파일을 `src/hooks`·`src/utils` 같은 종류별 폴더에 새로 두었는가, `../../../다른도메인` import가 생겼는가                         |
| [폼의 응집도 생각하기](https://frontend-fundamentals.com/code-quality/code/examples/form-fields.html)                         | 검증이 필드 단위·폼 단위에 섞여 흩어져 있는가. 필드 간 의존이 있으면 폼 단위, 재사용 필드면 필드 단위                                         |
| [책임을 하나씩 관리하기](https://frontend-fundamentals.com/code-quality/code/examples/use-page-state-coupling.html)           | 기존 훅·컴포넌트에 성격이 다른 책임을 덧붙였는가                                                                                              |
| [중복 코드 허용하기](https://frontend-fundamentals.com/code-quality/code/examples/use-bottom-sheet.html)                      | 페이지마다 달라질 수 있는 동작을 공통 훅으로 묶었는가(→ 중복 허용 권장). 동작·로깅·모양이 앞으로도 같다면 공통화가 맞다                       |
| [Props Drilling 지우기](https://frontend-fundamentals.com/code-quality/code/examples/item-edit-modal.html)                    | 중간 컴포넌트가 쓰지 않고 넘기기만 하는 prop이 생겼는가. 조합(`children`) 먼저, Context는 최후                                                |

## 접근성 — 자동 수정 (속성만 더할 때)

화면 모양·마우스 동작은 그대로 두고 `alt`·`aria-*` 속성만 더하거나 고치는 경우다. 넣을 문구를 이번 diff 안의 코드(핸들러 이름, 옆 텍스트, `map`의 항목 변수)에서 알 수 있을 때만 고친다. 문구를 지어내야 하면 리포트로 내린다.

| 가이드                                                                                                                   | 고칠 때                                                                                                                                                                                                                                                                                                                                        | 고치지 않을 때                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [이미지와 아이콘에 대체 텍스트 제공하기](https://frontend-fundamentals.com/a11y/alt-text/image-alt.html)                 | `<img>`에 `alt`가 없으면 붙인다. 장식용이거나 같은 뜻의 텍스트가 옆에 있으면 `<img>`는 `alt=""`, SVG 컴포넌트는 `aria-hidden`. "삭제 아이콘"처럼 옆 텍스트를 되풀이하거나 "아이콘"·"버튼"이 붙은 alt는 `alt=""`나 기능 이름("검색")으로 고친다                                                                                                 | 사진·로고처럼 내용을 설명해야 하는데 무엇인지 코드에서 알 수 없을 때, 혼자서 뜻을 전하는 SVG → 리포트                                                   |
| [인터랙티브 요소에 이름 붙이기](https://frontend-fundamentals.com/a11y/semantic/required-label.html)                     | 아이콘만 있는 버튼·링크에 `aria-label`(동작 이름: "닫기", "이전 달")을 붙이고 안의 아이콘은 `alt=""`·`aria-hidden`으로 숨긴다. `placeholder`만 있는 입력창에 `aria-label`을 붙인다                                                                                                                                                             | 화면에 보이는 `<label>`이 필요하다고 판단될 때(디자인 변경) → 리포트                                                                                    |
| [같은 이름의 요소에는 설명 추가하기](https://frontend-fundamentals.com/a11y/semantic/duplicate-interactive-element.html) | `map`으로 그린 목록에 "삭제"·"선택"처럼 같은 텍스트 버튼이 반복되면 항목 이름을 넣은 `aria-label`을 붙인다. 보이는 텍스트를 반드시 포함한다(`` `${club.name} 삭제` ``)                                                                                                                                                                         | 항목을 구분할 이름이 스코프에 없을 때                                                                                                                   |
| [상태 지정하기](https://frontend-fundamentals.com/a11y/basic-guide/state.html)                                           | 직접 만든 토글·탭·아코디언·드롭다운이 상태 변수(`isOpen`, `selected` 등)를 이미 들고 있으면 그 변수에 묶는다. `aria-expanded`·`aria-pressed`·`aria-current`는 버튼에 바로 붙이고, `aria-selected`(`tab`·`option`)·`aria-checked`(`checkbox`·`switch`·`radio`)는 그 `role`이 이미 있을 때만 붙인다. 네이티브 요소는 `checked`·`disabled`를 쓴다 | `role` 자체가 없는 `div` 위젯, 또는 `aria-selected`·`aria-checked`를 쓰려면 `role`을 새로 붙여야 할 때 → 리포트([버튼의 역할과 동작이 일치하게 만들기]) |

## 접근성 — 리포트만 (지적하고 사용자가 판단)

태그를 바꾸거나 키보드 동작을 더해야 해서, 자동으로 고치면 스타일이나 포커스 순서가 같이 바뀐다.

| 가이드                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 볼 것                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [버튼 안에 버튼 넣지 않기](https://frontend-fundamentals.com/a11y/structure/button-inside-button.html)                                                                                                                                                                                                                                                                                                                                                                                 | `<a>`·`<Link>` 안의 `<Button>`, 클릭되는 카드 안의 또 다른 버튼, 그걸 `stopPropagation()`으로 막은 구조. 바깥을 `div`로 두고 투명 버튼을 `position: absolute`로 덮는 구조, 또는 `as="a"`로 태그 자체를 바꾸기를 제안한다                                                                                                                                                            |
| [테이블 행에 클릭 이벤트 핸들러 붙이지 않기](https://frontend-fundamentals.com/a11y/structure/table-row-link.html)                                                                                                                                                                                                                                                                                                                                                                     | `<tr onClick>`. 행 안에 실제 링크를 두고 `::after`로 클릭 영역을 넓히기를 제안한다                                                                                                                                                                                                                                                                                                  |
| [버튼의 역할과 동작이 일치하게 만들기](https://frontend-fundamentals.com/a11y/predictability/fake-button.html)                                                                                                                                                                                                                                                                                                                                                                         | `styled.div`·`span`·`li`·`img`에 `onClick`만 붙였는가, 페이지 이동을 `<Link>` 대신 `onClick` + `navigate`로 했는가. `<button>`·`<a>`로 바꾸면 기본 스타일이 따라오고, 못 바꾸면 `role="button"` + `tabIndex={0}` + Enter·Space `onKeyDown`이 필요하다                                                                                                                               |
| [입력 요소는 `<form>`으로 감싸기](https://frontend-fundamentals.com/a11y/predictability/form.html)                                                                                                                                                                                                                                                                                                                                                                                     | 입력창과 제출 버튼을 새로 만들었는데 `<form onSubmit>`이 없어 Enter로 제출되지 않는가. `<form>` 안의 raw `<button>`·`styled.button`에 `type`이 없는가(기본값이 `submit`이다. 공통 `Button`은 기본 `type="button"`)                                                                                                                                                                  |
| [eslint 주요 규칙](https://frontend-fundamentals.com/a11y/eslint/rules.html)                                                                                                                                                                                                                                                                                                                                                                                                           | 상호작용하지 않는 요소에 `tabIndex`를 줬는가(`no-noninteractive-tabindex`), `tabIndex`에 1 이상을 줬는가(`tabindex-no-positive`), `main`·`li`·`img` 같은 요소에 `role="button"`을 줬는가                                                                                                                                                                                            |
| UI 컴포넌트: [모달](https://frontend-fundamentals.com/a11y/ui-foundation/modal.html) · [탭](https://frontend-fundamentals.com/a11y/ui-foundation/tab.html) · [아코디언](https://frontend-fundamentals.com/a11y/ui-foundation/accordion.html) · [스위치](https://frontend-fundamentals.com/a11y/ui-foundation/switch.html) · [체크박스](https://frontend-fundamentals.com/a11y/ui-foundation/checkbox.html) · [라디오](https://frontend-fundamentals.com/a11y/ui-foundation/radio.html) | 이 위젯을 새로 만들었으면 해당 페이지 체크리스트와 대조한다. 모달은 `role="dialog"`·`aria-modal`·열 때 포커스 저장과 닫을 때 복원·ESC 닫기·배경 `inert`, 탭은 `tablist`/`tab`/`tabpanel` 연결, 체크박스·라디오·스위치는 네이티브 `input`을 못 쓰면 `role` + `aria-checked` + Space 키. 기존 공통 컴포넌트(`Modal`, `UnderlineTabs`, `ToggleButton` 등)를 고친 것이면 그 diff만 본다 |

## 지키는 것

- 동작을 바꾸지 않는다. 가이드 적용은 리팩터링이지 기능 변경이 아니다. 접근성 자동 수정은 스크린 리더가 읽는 이름·상태만 바꾸고 화면 모양·클릭·포커스 순서는 건드리지 않는다
- `useMemo`·`useCallback`·`memo`를 새로 넣지 않는다(React Compiler 사용). 훅을 쪼갤 때도 마찬가지
- 레포 컨벤션이 가이드보다 우선이다(`CLAUDE.md` 네이밍·Import 순서, 상수 위치는 `src/constants/CLAUDE.md`)

## 검증

자동 수정을 하나라도 했으면 아래를 모두 통과해야 커밋으로 넘어간다. 실패하면 원인이 된 수정을 되돌리고 리포트로 내린다. 자동 수정 전에도 있던 실패(작성한 코드 자체의 lint 위반 등)는 되돌리지 않고 리포트 맨 위에 올려 커밋 여부를 사용자가 정하게 한다.

```bash
npm run typecheck
npx eslint <수정한 파일들>
npx jest --findRelatedTests <수정한 파일들> --passWithNoTests
```

`aria-label`을 붙이면 접근 가능한 이름이 보이는 텍스트 대신 그 값이 된다. `getByRole('button', { name: '삭제' })` 같은 테스트 쿼리도 호출부라서 위의 "diff 안에서 끝난다"를 따른다. 깨진 테스트 파일이 이번 diff에 있으면 쿼리를 새 이름에 맞추고, diff 밖이면 수정을 되돌리고 리포트로 내린다.

## 출력

```text
## Frontend Fundamentals 점검

### 자동 수정 (N건)
- `src/.../Foo.tsx:42` [복잡한 조건에 이름 붙이기] isRecruiting 변수로 추출
- `src/.../Header.tsx:18` [인터랙티브 요소에 이름 붙이기] 닫기 아이콘 버튼에 aria-label="닫기"

### 리포트 (M건, 판단 필요)
- `src/.../useBar.ts:10` [숨은 로직 드러내기] fetchBar 안에서 trackEvent 호출 — 호출부로 옮길지 결정 필요
- `src/.../ClubCard.tsx:30` [버튼의 역할과 동작이 일치하게 만들기] styled.div에 onClick만 있음 — Link로 바꿀지 결정 필요

### 검증
- typecheck ✅ / eslint ✅ / jest ✅ (관련 테스트 3개)
```

해당 없음이면 "지적 없음" 한 줄로 끝낸다.
