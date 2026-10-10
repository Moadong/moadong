# button-migration — 버튼 인벤토리 · 시안 대조 · before/after

공용 `Button`으로 옮길 자리를 찾고, 시안과 이미 일치하는 자리만 옮긴 뒤, 옮기기 전후 렌더 결과가 같은지 확인한다. 설계는 [`docs/superpowers/specs/2026-10-06-button-design-system-design.md`](../../../docs/superpowers/specs/2026-10-06-button-design-system-design.md).

## 순서

| 단계 | 명령                              | 하는 일                                                                                                                                          | 대장 상태                         |
| ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| ①    | `npm run button:inventory`        | `src`의 `styled.button`·`styled(Button)`·버튼 정의를 감싼 `styled(X)`와 사용처를 모아 `sites.json`·`visual-diff/button-inventory/report.md` 생성 | `inventoried`                     |
| ②    | `npm run button:figma-candidates` | 후보 묶음 자리마다 "✳️ 페이지 최종"에서 같은 라벨 노드를 찾아 `visual-diff/button-figma/candidates.md`로                                         | –                                 |
| ②    | (손으로)                          | `sites.json`에 `figma`·`route`·`figmaViewport`(·`locator.nth`)를 채운다. 시안이 없으면 `status`를 `no-design`으로                                | `no-design`                       |
| ②    | `npm run button:figma-match`      | 실제 페이지 요소를 시안 노드와 대조                                                                                                              | `figma-match` / `figma-violation` |
| ③    | (손으로)                          | `figma-match` 자리만 공용 `Button`으로 옮기고 `status`를 `migrated`로                                                                            | `migrated`                        |
| ④    | `npm run button:before-after`     | 기준 커밋(`--base`, 기본 `git merge-base HEAD origin/develop-fe`)과 작업 트리를 띄워 비교. 먼저 `git fetch`                                      | `verified`                        |

판정기가 같은 커밋끼리 PASS를 내는지는 `npm run button:before-after -- --base HEAD --targets scripts/button-migration/smoke-targets.json`으로 확인한다(관리자 라우트 타겟 2개 기준 ~3분 — 11초 요청 write-off가 러닝타임을 지배한다). 스크립트 단위 테스트는 `npm run test:scripts`(jest가 아니라 `node:test`). CI에 안 걸려 있으니 이 폴더를 고치면 손으로 돌린다.

## 전제

- `frontend/.env`: `FIGMA_TOKEN`(②), `DEV_ADMIN_ID`·`DEV_ADMIN_PASSWORD`(②·④의 관리자 화면). Conductor가 브랜치를 옮기면 `.env`가 지워질 수 있다.
- `npx playwright install chromium` 한 번.
- ④는 기준 커밋을 `.context/button-before`에 worktree로 만들고 `npm ci`를 돈다. 같은 커밋이고 `npm ci`가 성공했다는 표시(`frontend/node_modules/.button-migration-install-ok`)가 있을 때만 다시 쓴다 — `node_modules`가 있는지만 보면 중간에 끊긴 설치를 계속 다시 쓴다. 지우려면 `--clean`. 그 안에 `.env`를 복사하므로 `.context/`는 루트 `.gitignore`에 있다.
- ④의 기본 기준은 `origin/develop-fe`의 끝이 아니라 갈라진 지점(`merge-base`)이다. 끝을 쓰면 그사이 남이 머지한 변경까지 비교에 섞인다. `origin/develop-fe`가 오래됐으면 갈라진 지점도 틀리므로 `git fetch`를 먼저 한다.

## 고칠 때 알아야 할 것

- **판정은 렌더 결과로만 한다.** 정적 시그니처는 묶음 후보를 고르는 데만 쓴다. props 분기·부모 셀렉터·미디어쿼리는 정적으로 다 못 읽는다.
- **픽셀 diff는 참고가 아니라 FAIL 게이트이고, 정확 일치로 본다.** style·DOM 비교는 루트 엘리먼트의 computed style/속성만 본다 — 중첩 아이콘·span·가상요소(`::before`/`::after`)만 바뀌는 변경은 그 두 게이트로는 못 잡고 픽셀로만 잡힌다. 같은 브라우저·같은 데이터로 두 번 찍으면 0이 기대값이고, 0이 아니면 FAIL이다. 그래서 `compare.mjs`의 `exactPixelDiff`가 RGBA를 바이트 단위로 비교한다(크기가 다르면 `pixel-size`도 FAIL). `figma-story-diff/diff.mjs`의 `diffPng`는 threshold 0.1이라 `#333333`↔`#3A3A3A`, `#FF7543`↔`#FF6A33`를 0%로 본다 — 실측. 시안 대조용 참고값이라 거기 기본값은 건드리지 않고 여기서 쓰지도 않는다.
- **자리 이동도 게이트다(스펙 실패 모드 ②).** 스크린샷은 요소 상자만 잘라서, 이전 뒤 부모 셀렉터(`Wrapper > button`)가 안 걸려 버튼이 옮겨 가도 픽셀과 버튼 자신의 크기는 같다. 그래서 상태마다 문서 기준 상자(`box.x`·`box.y`·`box.width`·`box.height`, 스크롤과 무관)를 비교하고, computed style에 `margin-*`·`position`·`top/right/bottom/left`·`z-index`·`flex-grow/shrink/basis`·`align-self`·`order`도 넣는다.
- **`type`은 실효값(`el.type`)으로 비교한다.** 속성값으로 비교하면 이전 때 `type='submit'`을 명시한 정상 자리가 FAIL이 되고, 폼 안에서 submit이 button으로 바뀐 진짜 회귀는 놓친다.
- **트랜지션·애니메이션을 CSS 주입으로 끈다.** 안 끄면 hover 직후 전환 중간값이 잡혀 같은 코드끼리도 FAIL이 난다.
- **양쪽 다 못 찾으면 FAIL이다.** "차이 없음"으로 넘기면 locator 오타가 PASS로 숨는다. 한쪽에만 있는 폭도 FAIL이다(`width-missing`) — before/after의 폭 집합이 어긋나면 그 폭은 비교 자체가 안 된 것이라 "차이 없음"과 다르다. 일부 폭에서만 양쪽 다 안 보이면 실패가 아니다(그 브레이크포인트에서 원래 숨는 버튼이 있다). 대신 그 행은 상태가 `양쪽 안 보임`(`bothHidden: true`)이고 잰 폭으로 세지 않는다 — `report.md`에 "비교한 폭 N/5 (양쪽 안 보임: …)", 콘솔 줄 끝에 `(비교 폭 N/5)`가 붙어 "5폭 다 같다"와 "1폭만 쟀다"가 같은 PASS로 안 보인다.
- **before·after 서버는 같은 포트로 차례로 띄운다.** 동시에 띄우면 `node_modules/.vite` 캐시를 서로 덮어쓴다.
- **`startVite`는 남의 서버를 절대 쓰지 않는다.** 예전엔 포트에 `fetch`가 응답하면 준비로 봤다. 그러면 고아 vite나 다른 서버가 3101에 떠 있을 때 `--strictPort`인 새 vite는 조용히 죽고, before·after가 같은 남의 서버를 재서 모든 자리가 PASS → verified가 된다. 지금은 띄우기 전에 포트(IPv4·IPv6)를 찔러 뭔가 응답하면 바로 실패하고, 이 자식이 살아 있고 자기 stdout에 `Local: http://…:<port>` 준비 줄을 냈을 때만 준비로 본다. `stop()`은 프로세스가 끝나고 포트가 풀릴 때까지 기다린다(안 기다리면 after 쪽이 아직 살아 있는 before 서버와 부딪힌다). `detached` 자식은 터미널 Ctrl-C를 못 받으므로 부모의 SIGINT·SIGTERM·exit에서 프로세스 그룹째 죽인다. `figma-match`(3102)도 같은 함수를 쓴다.
- **`/admin/login`은 비로그인 세션으로 연다.** 로그인한 세션이면 `/admin`으로 튕긴다.
- **네비게이션은 `waitUntil: 'load'` + `waitForQuiet`를 쓴다. `networkidle`은 못 쓴다.** Vite의 HMR WebSocket이 페이지 로드와 동시에 열려 계속 "네트워크 활동 중"으로 잡히기 때문에 `networkidle`은 Vite dev 서버 위에서 절대 끝나지 않는다(타임아웃을 늘려도 소용없다). `waitForQuiet`는 websocket·eventsource는 무시하고, in-flight 요청이 0인 채로 500ms가 지나면 끝난다. dev 프록시가 일부 `/auth/*` 호출의 종료 신호를 끝까지 안 보내는 문제가 있어, 11초 넘은 요청은 "write off"로 강제 제외하고 계속 진행한다. 앱이 이 요청을 대신 포기해 주지는 않는다 — `fetchWithTimeout`은 `await fetch()`가 풀리는(헤더 도착) 순간 10초 타이머를 지우고, 본문 읽기(`handleResponse` → `response.json/text`)에는 시한이 없다. 그래서 본문이 멈춘 요청에 기대는 화면은 로딩 상태로 남고, before·after가 같은 요청을 포기했다면 양쪽 로딩 화면끼리 비교한 PASS일 수 있다. 마감 시각은 새 요청이 시작될 때마다 그 요청 기준으로 늘어나고, 절대 상한은 60초다. write-off된 경로는 `report.md`와 콘솔의 `NOTE` 줄에 남고, write-off가 있는 PASS는 `verified`로 올리지 않는다(아래 승격 규칙). 잔존 위험: 11초를 넘겨 계속 스트리밍하다가 그 응답으로 버튼이 바뀌는 경우는 이 장치로도 놓칠 수 있다. 네비게이션은 `withQuiet(page, action)`으로 감싼다 — 대기를 먼저 걸고, action이 던지면 대기를 거둔 뒤 그 오류를 던진다. `waitForQuiet`를 직접 걸고 `goto`가 던지면 남은 대기가 60초 상한에서 핸들러 없이 reject되어 프로세스가 죽는다.
- **시안 대조에서 theme에 없는 값은 판정에 넣지 않는다.** "시안과 같은가"와 "토큰이 있는가"는 다른 질문이다. 리포트에만 남기고 이전 PR에서 theme에 추가한다.
- **묶음 키는 hover·미디어쿼리까지 포함한다.** 최상위가 같아도 hover가 다르면 같은 variant가 아니다.
- **버튼 정의를 감싼 `styled(X)`도 버튼이다.** `styled(BaseButton)`·`styled(AddButton)`·`styled(ShareButton)`처럼 X가 버튼 정의(같은 파일·named·namespace·default import, 연쇄 포함)로 풀리면 `kind: 'styled(button-def)'`인 정의가 된다. 모든 파일을 본 뒤 `resolveDerived`가 더 풀리는 게 없을 때까지 돈다. 바탕 스타일은 X에서 오고 자기 템플릿은 일부뿐이라 `dynamic`에 `inherits`를 넣어 묶음 후보에서 빼고, 묶음 키에 X를 섞어 같은 템플릿의 일반 정의와 한 묶음이 되지 않게 한다. 공용 `Button`에서 내려온 파생이 겉모습을 덮어쓰면(`StudentToggle`) `overrides`에 센다. `styled(motion.button)`은 `styled.button`과 같다. 이 연결이 없을 때 7곳이 조용히 빠져 있었다. X를 못 풀었는데 X의 파일이 `<button>`이나 버튼 정의를 그리면 `report.md`의 "못 푼 styled(X)" 절에 올라간다 — 손으로 확인할 목록이다.
- **default import된 `styled.button`도 인벤토리에 잡힌다.** `import X from './X'`로 가져와 쓰는 자리는 사용처 파일에서의 로컬 이름이 아니라 `./X`의 `export default`를 정의로 잇는다. 이 연결이 없으면 사용처가 조용히 버려진다(실제로 7곳이 그렇게 빠졌었다).
- `sites.json`은 커밋한다. 인벤토리를 다시 돌려도 `route`·`locator`·`figma`·`figmaViewport`·`status`는 보존되고, 시그니처가 바뀐 자리만 `status`가 `inventoried`로 돌아간다. 자리 id 끝의 `::n`은 같은 파일 안에서 몇 번째 사용처인지일 뿐이라, 사용처가 끼어들거나 하나를 옮기면 다른 버튼을 가리키게 된다. 그래서:
  - **라벨이 바뀌면 아무것도 이어 받지 않는다**(`locator`뿐 아니라 `route`·`figma`·`figmaViewport`·`status`도). 다른 버튼의 시안 판정을 들고 있는 게 빈칸보다 위험하다. 라벨까지 같은 두 버튼이 자리를 바꾸는 경우는 못 가린다.
  - **`migrated`·`verified`는 살아 있는 사용처에 절대 물려주지 않는다.** 살아 있는 styled 정의의 사용처는 정의상 아직 안 옮긴 자리다. 이전 끝난 기록은 `<id>#migrated`(겹치면 `#migrated-2`…)로 따로 남긴다. 두 사용처 중 하나만 옮긴 뒤 다시 인벤토리를 돌리면 남은 쪽이 `::0`이 되는데, 예전엔 이게 `migrated`를 물려받고 진짜 이전 기록은 사라졌다.
- **`--ids`에 대장에 없는 id가 있으면 exit 2로 멈춘다**(`before-after`·`figma-match`·`figma-candidates` 모두). 조용히 빼면 일부만 잰 결과가 전부 잰 것처럼 보인다.
- **`figma-match`는 `migrated`·`verified` 자리를 `--ids`로 골라도 덮어쓰지 않는다**(`SKIP` 줄). 덮어쓰면 이전 기록이 시안 판정으로 되돌아간다.
- **`before-after` 대장 모드의 경고·승격 규칙.** 기준 대비 바뀐 src 파일(추적 안 되는 새 파일 포함)에 있는데 `status`가 `migrated`가 아닌 자리는 `WARN`으로 알린다 — 옮겨 놓고 상태를 안 바꾸면 그 자리는 아예 안 잰다. src가 기준과 같으면 같은 코드끼리 비교라 PASS여도 `verified`로 올리지 않고 `WARN`만 낸다. src의 다른 곳만 바뀌고 그 자리의 `defFile`·`usageFile`이 기준과 같아도 마찬가지라, 그 자리는 `migrated`로 두고 `WARN  <id>  기준과 같은 코드라 verified로 올리지 않음`을 낸다. before·after 어느 쪽이든(모든 폭 합쳐) 포기한 요청이 하나라도 있는 PASS도 `migrated`로 두고 `WARN  <id>  요청 포기가 있어 verified로 올리지 않음 (리포트 참고)`을 낸다 — 양쪽 로딩 화면끼리의 PASS일 수 있다. 판정은 `sites.mjs`의 `promoteVerified`(바뀐 파일 집합을 받는 순수 함수)가 하고, 올리지 않은 자리는 `held`로 돌려준다. `--targets`(스모크)는 대장을 건드리지 않으니 이 규칙과 무관하다.
- 스토리·테스트 파일과 `Button.tsx` 내부의 `StyledButton`은 인벤토리에서 뺀다.
- 기록: `AddItemButton`(`ApplicantsTabMobile`) 자리로 `figma-match`를 한 번 점검했다(route `/admin/applicants-list/__figma-match-test__`, 375폭, 결과 `figma-violation`, Δw 2.05). 존재하지 않는 `applicationFormId`로 "항상 빈 목록"을 재현한 도구 점검이라 기준선에 위반으로 세지 않도록 그 레코드는 `inventoried`로 되돌리고 `figma`·`route`·`figmaViewport`를 비웠다. 실제 판정은 실제 라우트로 다시 한다.

## 자주 틀리는 것

- `locator가 N개에 걸린다`: 같은 라벨 버튼이 화면에 여럿이다. `locator.nth`를 넣는다.
- 라벨이 `null`인 자리: 자식에 표현식이 섞여 있다. `locator`를 `{ "css": "..." }`나 다른 `role`·`name`으로 직접 채운다.
