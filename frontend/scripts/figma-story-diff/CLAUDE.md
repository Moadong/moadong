# figma-story-diff — Figma 시안 ↔ Storybook 구현 대조

컴포넌트의 Figma 노드와 Storybook 스토리를 대조해 `visual-diff/<이름>/report.md`에 판정을 남긴다.

**쓰는 법·매핑 작성·판정 해석·자주 틀리는 것은 [`.claude/skills/figma-story-diff/SKILL.md`](../../.claude/skills/figma-story-diff/SKILL.md)에 있다.** 이 문서는 스크립트 자체를 고칠 때 필요한 내용만 둔다. 절차를 두 군데 적지 않는다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `run.mjs` | 매핑 수집 → 실행 → 판정 → 리포트 작성. 보류 토큰 파일도 여기서 생성한다 |
| `figma.mjs` | Figma REST로 노드 트리·렌더 PNG를 받아 토큰 수집. 노드 opacity를 자식까지 곱해 내린다 |
| `story.mjs` | Playwright로 Storybook iframe을 열어 computed style에서 같은 축을 수집 |
| `theme.mjs` | esbuild로 `theme/index.ts`·`theme.test/index.ts`를 번들해 토큰 집합 생성 |
| `diff.mjs` | pixelmatch 기반 참고용 픽셀 차이 |

## 고칠 때 알아야 할 것

- **색 수집은 "실제로 칠해지는 것"만 센다.** 글자를 그리지 않는 요소의 상속된 `color`, paint를 그리지 않는 `svg`·`g`의 `fill`은 제외한다. 이 규칙이 깨지면 body 색을 상속받는 모든 컴포넌트가 영구 FAIL이 된다.
- **반투명은 양쪽 기준이 같아야 한다.** Figma는 노드·paint opacity를 곱한 유효값, 구현은 CSS alpha. 1 미만이면 토큰으로 세지 않는다.
- **테두리 색은 `border-color`에만 있지 않다.** 시안의 INSIDE stroke를 `box-shadow: inset`으로 구현하는 경우가 있어 box-shadow 색도 걷는다.
- **레이아웃 축은 선언값이 아니라 위치에서 잰다.** Figma `itemSpacing`은 `SPACE_BETWEEN`이면 실제 간격과 무관한 값이 남는다. 자식 bbox로 앞 여백·간격·뒤 여백을 계산해 비교한다.
- **구현 쪽 레이아웃 루트는 측정 루트가 아니다.** 스토리 데코레이터 래퍼는 자식과 박스가 같아서, 박스가 일치하는 동안 한 겹씩 내려가 시안 프레임에 대응하는 요소를 찾는다. 이걸 안 하면 래퍼의 `gap`·`padding`(둘 다 0)과 시안을 비교하게 돼 전부 오탐이다.
- **크기 판정에 반올림을 넣지 않는다.** 표시할 때만 자른다. 판정에 섞으면 허용치가 실제보다 0.5px 넓어지고, 그 틈에 진짜 차이가 숨는다.
- **`theme.test/index.ts`는 생성 파일이다.** `JSON.stringify`로 이스케이프해서 쓴다 — Figma 노드 이름에 따옴표가 하나라도 들어가면 다음 실행의 `loadPending()`이 esbuild에서 죽는다. 포맷 검사에서 빼려고 `.prettierignore`에 등록해 두었다.
- `visual-diff/`는 gitignore 대상이다. 리뷰에 남기려면 내용을 PR 본문으로 옮긴다.
