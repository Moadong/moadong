# 디자인 시스템 1단계: 공용 Button 이전 설계

작성일: 2026-10-06
대상 레포: `Moadong/moadong` (frontend)

## 1. 목표

화면마다 따로 만든 버튼을 공용 `Button`으로 모으고, 그 과정을 숫자로 남긴다. 목적은 두 가지다. 구현 일관성(같은 버튼이 화면마다 조금씩 다른 문제)과, 문제 발굴부터 검증까지를 보여 주는 포트폴리오·팀 문서.

이 문서는 디자인 시스템 작업의 첫 서브 프로젝트다. 나머지는 각자 스펙을 따로 쓴다.

1. **Button** (이 문서): 인벤토리 → 시안 대조 → variant 정의 → 일치하는 자리만 이전 → before/after 검증
2. 재발 방지 린트: 새 `styled.button`, 하드코딩 radius·색을 래칫으로 막는다
3. 토큰 보강: 시안 스타일 가이드의 spacing 스케일(8~72), radius
4. 문서·지표 정리: Storybook 문서와 전후 지표

Figma와 구현을 맞추는 일은 기존 `figma-story-diff` 스킬로 따로 계속한다. RN 앱(`moadong-react-native`)은 범위 밖이다.

## 2. 현재 상태 (2026-10-06 측정)

| 항목 | 값 |
|---|---|
| `styled.button` 정의 | 153개 (파일 108개). 그중 `pages/AdminPage` 83개, `components/common` 22개, `ClubDetailPage` 14개 |
| 공용 `Button` 사용처 | 17곳. 그중 5곳이 `styled(Button)`으로 겉모습을 덮어씀 (Filter, ApplicationForm 제출, Peace 다시하기·공유, CalendarLink) |
| `border-radius` 값 종류 | 12가지 (4·6·8·10·12·14·16·20·50·80·100·999px) |
| 하드코딩 hex / `font-size` 숫자 | 348곳 / 333곳 (`colors.*` 998곳, `setTypography` 278곳) |
| Figma 게시 컴포넌트·스타일 | 0개 |
| Figma "Component" 페이지 | 카테고리 탭·태그·모집 상태·관리자 체크·modal 세트. Button 세트 없음 |
| Figma "UI 스타일 가이드 → 버튼" | 상세 지원하기(517×60 / 287×44, `#3A3A3A` r10), 공유 아이콘 버튼, 지원서 목록 "새 양식 만들기"(150×38, r20). 범용 스펙이 아님 |

## 3. 결정 사항 요약

| 항목 | 결정 | 근거 |
|---|---|---|
| 기준의 두 층 | 화면 시안은 Figma가 SSOT. 공용 컴포넌트는 시안이 없고 코드가 기준 | 사용자 확인. Figma에 Button 컴포넌트 세트가 없음 |
| 이전 대상 | **지금 모습 = 그 화면 시안 = 기존 variant 하나**인 자리만 | 리팩터와 시각 수정을 한 PR에 섞지 않는다. 시안에서 벗어난 값을 variant에 넣지 않는다 |
| 시안 위반 자리 | 코드를 건드리지 않고 위반 목록에 남긴다 | 시각 수정은 다음 단계의 입력 |
| variant 기준 | **서로 다른 도메인 2곳 이상**에서 같은 시그니처가 나오면 공용 variant로 삼는다. 한 도메인 안에서만 반복되면 도메인 버튼으로 남긴다. 한 곳뿐이면 그대로 둔다 | 생김새만으로 묶으면 같은 기능 버튼(예: 지원하기)끼리 묶여 도메인 버튼이 공용으로 새어 들어간다 |
| 인벤토리 방식 | 정적 파싱으로 후보를 고르고, 통과 판정은 렌더 결과로만 한다 | 153개 분포를 싸게 얻고, 비싼 렌더 검증은 실제로 이전할 자리에만 쓴다 |
| 관리자 화면 렌더 | dev API + 테스트 관리자 계정 (`frontend/.env`의 `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD`, 커밋하지 않음) | msw는 설치돼 있지만 핸들러가 없음 |
| 결과물 위치 | `frontend/visual-diff/` (gitignore) | `figma-story-diff`와 같다. 리뷰에 남길 내용은 PR 본문으로 옮긴다 |

용어:
- **variant**: 공용 `Button` 하나가 가진 겉모습 선택지. 생김새·위계로 이름 짓는다(primary, outline 같은 것).
- **도메인 버튼**: 특정 기능의 의미를 가진 별도 컴포넌트(예: D-day를 같이 보여 주는 지원하기 버튼). 해당 페이지·기능 폴더에 둔다.
- **도메인**: `pages/<Page>` 단위. `pages/AdminPage`만 `tabs/<Tab>`(또는 `auth`, `components` 같은 바로 아래 폴더) 단위로 나눈다. `components/common` 아래 컴포넌트는 각자 하나의 도메인이다.

## 4. 설계 5줄

- **입력**: `src/**`의 `styled.button` 정의와 겉모습을 덮어쓰는 `styled(Button)`, 각 자리가 나오는 화면의 Figma 노드, dev API와 테스트 관리자 계정.
- **출력**: 인벤토리(`sites.json`, 묶음 분포 `report.md`), 자리별 시안 대조 결과, variant를 갖춘 공용 `Button`과 Storybook 문서, 일치한 자리만 이전한 코드, 자리별 before/after 판정 리포트.
- **불변식**: 이전한 자리의 렌더 결과(다섯 폭 × 기본·hover의 computed style, DOM 속성, 픽셀)가 이전 전과 같다. 공용 `Button`의 모든 variant는 시안과 일치하는 기존 구현에서 나왔다. 시안과 다른 자리의 코드는 바뀌지 않는다. variant를 주지 않은 `Button`의 모습은 지금과 같다.
- **실패 모드**: ① 정적 파싱이 놓친 동적 스타일 때문에 이전 후 화면이 바뀐다. ② 부모 셀렉터(`Wrapper > button`)가 이전 후 안 걸린다. ③ `type` 기본값 차이(`styled.button`은 submit, `Button`은 button)로 보기엔 같은데 폼이 제출되지 않는다. ④ variant가 자리 수만큼 늘어난다.
- **자료구조·경계**: 자리 대장 `sites.json` 하나에 모든 단계가 상태를 쌓는다. 정적 시그니처는 후보 선정에만 쓰고 판정은 렌더 기반 비교로만 한다(①②를 막는다). DOM 속성 비교 게이트가 ③을, 도메인 2곳 이상 기준이 ④를 막는다.

## 5. 도구와 파이프라인

위치: `frontend/scripts/button-migration/`. `figma-story-diff`의 `theme.mjs`(테마 번들), `figma.mjs`(Figma 노드 수집), `diff.mjs`(pixelmatch)를 가져다 쓴다. 복사하지 않고 import한다.

### 5.1 자리 대장 `sites.json`

레코드 하나가 버튼이 쓰이는 자리 하나다. 정의 하나가 여러 곳에서 쓰이면 레코드가 여러 개다.

주요 필드만 추렸다. 전체 필드는 `sites.json`을 본다.

```jsonc
{
  "id": "src/pages/ClubDetailPage/...styles.ts::ShareButton::src/pages/ClubDetailPage/...tsx::0",
  "defFile": "src/pages/ClubDetailPage/...styles.ts",
  "name": "ShareButton",
  "usageFile": "src/pages/ClubDetailPage/...tsx",
  "line": 42,
  "domain": "pages/ClubDetailPage",
  "signatureKey": "b3f1…",
  "route": "/clubDetail/@...",
  "locator": { "role": "button", "name": "공유하기" },
  "figma": "https://www.figma.com/design/LB4VudDhuIGjFayrm1kge1/...?node-id=...",
  "status": "inventoried"
}
```

`status` 값: `inventoried` → `figma-match` | `figma-violation` | `no-design` → `migrated` → `verified`. 열린 PR과 파일이 겹쳐 미룬 자리는 `deferred`.

`sites.json`은 커밋한다. 지표를 다시 계산할 수 있어야 하고, PR마다 상태 변화가 diff로 보여야 한다. 스크린샷·리포트는 `visual-diff/`에 두고 커밋하지 않는다.

### 5.2 단계 ① 인벤토리 (정적, 자동)

- TypeScript 컴파일러 API로 `styled.button`, `styled.button.attrs(...)`, `styled(Button)` 태그드 템플릿을 찾는다.
- 보간식 해석: `colors.*`, `theme.colors.*`, `theme.typography.*`, `setTypography(typography.*)`, `transitions.*`는 테마 번들에서 값으로 바꾼다. 나머지(props 함수, 지역 변수)는 `dynamic`으로 표시한다.
- 시그니처: 최상위 블록의 `height`, `min-height`, `padding`, `border-radius`, `background(-color)`, `color`, `font-size`, `font-weight`, `line-height`, `border`. 값은 정규화한다(`0px`→`0`, 색은 대문자 hex, 축약 padding은 4값). `&:hover`, `&:active`, `&:disabled`, 미디어쿼리 블록은 하위 시그니처로 따로 기록한다. 묶음 키는 최상위와 하위 시그니처를 모두 포함한 해시다. hover나 반응형 값이 다르면 같은 variant가 될 수 없기 때문이다.
- 사용처: JSX에서 `Styled.X`/`X`를 쓰는 자리를 찾아 레코드로 만든다. 사용처가 없는 정의는 리포트에 따로 적는다.
- 출력: `sites.json` 갱신, `visual-diff/button-inventory/report.md`. 묶음마다 자리 수, 도메인 수, `dynamic` 여부, 대표 파일을 적는다.

### 5.3 단계 ② 시안 대조 (반자동)

- 대상: 도메인 2곳 이상이고 `dynamic`이 없는 묶음의 자리.
- 노드 후보 찾기: "✳️ 페이지 최종" 페이지에서 버튼 라벨과 글자가 같은 TEXT 노드를 검색해 부모 프레임을 후보로 낸다. 확정은 사람이 하고 `figma` 필드에 적는다.
- 판정: `figma-story-diff`와 같은 게이트(토큰 일치, 루트 크기 ±2px). 구현 쪽은 Storybook이 아니라 dev 서버에서 `route`로 렌더한 실제 요소를 `locator`로 찾아 잰다.
- 결과를 `figma-match` / `figma-violation` / `no-design`으로 기록한다. 위반이면 어긋난 항목을 리포트에 남긴다.

### 5.4 단계 ③ 이전 (수동)

- `figma-match`인 자리만 공용 `Button`으로 바꾼다.
- 원래의 실효 `type`을 명시한다. `<form>` 안에서 `type` 없이 쓰이던 버튼은 `type='submit'`을 붙인다.
- 쓰이지 않게 된 `styled.button` 정의와 import는 지운다.

### 5.5 단계 ④ before/after (자동)

- 기준 커밋을 `git worktree`로 `.context/` 아래에 체크아웃(`npm ci`로 따로 설치)하고, 기준 커밋과 현재 작업 트리를 같은 포트에서 차례로 띄운다. 동시에 띄우면 `node_modules/.vite` 캐시를 서로 덮어쓴다. 둘 다 dev API를 보고 같은 테스트 관리자 계정으로 로그인한다. 두 쪽을 연달아 캡처해 데이터 변동을 피한다.
- 페이지 이동은 `waitUntil: 'networkidle'`을 쓰지 않는다. Vite의 HMR WebSocket이 로드와 동시에 열려 계속 네트워크 활동 중으로 잡혀 끝나지 않기 때문이다. 대신 `waitUntil: 'load'` 뒤에 `waitForQuiet`(websocket·eventsource는 무시, in-flight 0이 500ms 지속되면 종료, 11초 넘은 요청은 write-off, 절대 상한 60초)로 안정화를 기다린다.
- 자리마다 `route`로 들어가 `locator`로 요소를 찾고, 1440·1280·700·500·375 다섯 폭 × 기본·hover에서 수집한다. `mediaQuery.ts`가 max-width 기준이라 1280은 laptop 구간이다. 데스크탑(1281 이상)과 mobile(≤500)까지 구간마다 한 폭씩 잰다.
- 트랜지션·애니메이션은 양쪽 모두 CSS 주입으로 끈다. hover 직후 값이 전환 중간값으로 잡히는 걸 막는다.
- 게이트 (하나라도 다르면 FAIL):
  1. computed style: 5.2의 시그니처 속성 + `width`, `box-shadow`, `opacity`, `cursor`
  2. DOM 속성: 태그, 실효 `type`(속성값이 아니라 `el.type`. 이전 때 `type='submit'`을 명시해도 동작이 같으면 통과해야 한다), `role`, `aria-*`, `disabled`, 접근성 트리 스냅샷(역할·이름)
  3. 보임 여부: 한쪽 폭에서만 숨으면 FAIL. 양쪽 다 어느 폭에서도 못 찾으면 locator 오류로 FAIL
  4. 요소 스크린샷 픽셀 diff: 같은 브라우저·같은 데이터라 0이 정상이고, 0이 아니면 FAIL이다. 1·2는 루트 요소만 보므로 안쪽 아이콘·span·가상요소 변화는 픽셀로만 잡힌다. `diff.png`로 위치를 본다. (구현 중 결정: 처음엔 참고 항목이었으나 거짓 PASS 경로라 게이트로 올렸다. 렌더 잡음으로 같은 커밋끼리 FAIL이 나면 11절 조건 2로 처리한다)
- disabled 상태는 실제 화면에서 띄우기 어려워 이 단계에서 뺀다. 대신 Storybook에서 기존 정의와 variant의 disabled 스타일을 같은 방식으로 비교한다.
- 통과하면 `verified`로 바꾼다. 리포트: `visual-diff/button-migration/<id>/report.md`.

## 6. 공용 Button API

바꾸지 않는 것:
- 기존 props(`width`, `animated`, `type='button'` 기본값, 나머지 HTML 속성 전달)
- variant를 주지 않았을 때의 모습(회색 900 배경, 42px, r10, p2). 기존 17곳의 화면이 바뀌면 불변식 위반이다.

더하는 것:
- 겉모습 prop. 이름과 축은 인벤토리 결과를 보고 정한다. 결정 규칙:
  - 묶음들이 색·위계와 크기 두 축으로 깔끔하게 나뉘면 `variant` × `size`
  - 크기와 굵기 등이 함께 움직여 조합이 성립하지 않으면 `variant` 하나의 enum
  - 이름은 생김새·위계 기준. 도메인 이름 금지
- 스타일을 `Button.styles.ts`로 분리하고(`components/CLAUDE.md` 규칙), variant별 `css` 블록을 객체로 둔다.
- variant 값은 전부 토큰. hover·active·disabled는 원래 묶음의 하위 시그니처를 따른다.
- Storybook: variant마다 스토리 하나, disabled 스토리 포함.

이전한 자리의 규칙:
- 허용: `<Button variant=…>`, `width`, 레이아웃 속성(`margin`, `flex`, `align-self`, `width`, `order`)만 담은 `styled(Button)`
- 금지: 색·크기·radius·폰트를 덮어쓰는 `styled(Button)`. 덮어써야 맞는 자리는 그 variant와 일치하지 않는다는 뜻이므로 이전 대상이 아니다.
- 넣지 않음: `as` prop, 링크 버튼

## 7. 검증

도구 자체:
- 인벤토리 파서 단위 테스트(`node:test`, `npm run test:scripts`. jest는 이 폴더를 돌리지 않는다). 작은 `styled.button` 예제로 테마 해석, `dynamic` 표시, hover·미디어쿼리 하위 시그니처, padding 정규화를 확인한다.
- before/after 판정기 변이 테스트. 같은 커밋끼리 비교하면 PASS, 아래 세 변이는 각각 FAIL이어야 한다: 패딩 1px 변경, `type` submit→button, hover 배경색 변경. 이게 통과하기 전에는 판정 결과를 믿지 않는다.

제품 코드:
- `npm run typecheck`, `npm run lint`, 기존 테스트
- Button API 변경 PR: 기존 공용 `Button` 사용처 17곳 전부 before/after 통과
- 이전 PR: 이전한 모든 자리 before/after 통과

## 8. 롤아웃

| PR | 내용 | 제품 코드 | 통과 조건 |
|---|---|---|---|
| 1 | 도구 4단계, `sites.json`, 기준선 리포트 | 변경 없음 | 7절 도구 테스트 |
| 2 | `Button.styles.ts` 분리, 겉모습 prop 골격 | 변경 | 기존 17곳 before/after |
| 3~ | 묶음 하나당 PR 하나로 이전 | 변경 | 이전한 자리 전부 before/after |

- 이전 PR 직전마다 열린 PR의 변경 파일과 대조한다. 겹치는 자리는 `deferred`로 두고 다음 묶음에서 다룬다(현재 해당: #2054 만족도 모달).
- PR마다 이슈·Jira를 먼저 만들고 `feature/#번호-slug-MOA-키` 브랜치에서 작업한다. base는 `develop-fe`.
- PR 본문에는 리포트 요약(자리 수, 판정, 픽셀 diff가 0이 아닌 자리)을 산문으로 옮긴다.

## 9. 지표

전부 `sites.json`에서 계산한다. 기준선은 PR 1에서 고정한다.

- 버튼 자리의 단계별 수: 인벤토리 → 시안 일치·위반·시안 없음 → 이전 → 검증
- 서로 다른 버튼 시그니처 수 (전/후)
- 공용 `Button` 사용처 수: import하는 파일 수와 JSX 사용 수. 스토리·테스트 파일은 뺀다 (2절의 17은 스토리 2개를 포함한 값이라 기준선은 PR 1에서 다시 잰다)
- 겉모습을 덮어쓰는 `styled(Button)` 수 (전 5)
- 시안 위반 목록: 다음 단계(시각 수정)의 입력

## 10. 범위 밖

- 시안 위반 자리의 시각 수정
- 새 코드를 막는 린트 (서브 프로젝트 2)
- spacing·radius 토큰 (서브 프로젝트 3)
- 도메인 버튼 정리, 도메인 버튼이 공용 `Button`을 감싸게 하는 리팩터
- Figma 파일 수정, RN 앱

## 11. 되돌릴 조건

- 인벤토리 결과 도메인 2곳 이상에서 반복되는 시안 일치 묶음이 하나도 없으면, 공용 variant 추가를 멈추고 서브 프로젝트 2(린트)와 3(토큰)을 먼저 한다. 이 경우 PR 1의 분포표와 위반 목록이 이 단계의 결과물이다.
- before/after 판정기가 같은 커밋끼리 비교해서 PASS를 안정적으로 내지 못하면(폰트 로딩, 애니메이션, dev 데이터 변동) 이전 PR을 열지 않고 판정기부터 고친다.
