---
name: figma-story-diff
description: Use when a Figma frame URL and a Storybook story need to be compared for fidelity, when a designer asks "does the implementation match the design", when a PR touches a component that has a Figma spec, or when a Figma spec uses colors/typography that may not exist in the theme yet.
---

# Figma ↔ Storybook 대조

Figma REST로 시안 PNG와 노드 속성을 받고, 같은 크기·같은 args로 스토리를 Playwright 캡처해 토큰·크기·픽셀을 대조한다. 눈으로 보는 비교를 `visual-diff/<이름>/report.md` 한 장으로 고정한다.

## 전제

- `FIGMA_TOKEN`: Figma 개인 액세스 토큰(`figd_…`). `frontend/.env`에 두면 npm 스크립트가 `dotenv-cli`로 자동 로드한다. 권한은 File content 읽기만 있으면 된다. 만료되면 `Figma API 401`로 실패한다.
- Storybook이 떠 있어야 한다: `npm run storybook -- --ci --no-open` (기본 `http://localhost:6006`, 다른 주소면 `STORYBOOK_URL`).
- 처음 한 번 `npx playwright install chromium`.

## 절차

1. 매핑 파일을 스토리 옆에 만든다: `<Component>.figma.json`

   ```json
   {
     "PerformanceCard/Inactive": {
       "figma": "https://www.figma.com/design/<FILE_KEY>/<name>?node-id=12-345",
       "story": "pages-festivalpage-components-performancecard--inactive",
       "args": { "active": false }
     }
   }
   ```

   - `figma`: Figma에서 프레임(컴포넌트 variant 하나)을 선택하고 "링크 복사"한 URL. `node-id`가 있어야 하고 `&t=…` 같은 나머지 파라미터는 무시된다.
   - variant가 여러 개면 같은 파일에 키를 여러 개 둔다. 키 이름은 리포트 폴더명이 된다.
   - `story`: Storybook 주소창의 `?path=/story/` 뒤 ID. export 이름은 kebab-case가 된다(`InactiveSingleSong` → `inactive-single-song`).
   - `args`: 스토리 export에 없는 상태를 덧씌울 때만. 불리언·숫자·문자열만 가능하고 객체는 스토리 export로 고정한다.
2. 실행: `npm run visual:figma [이름필터]`. 필터는 키 이름의 부분 문자열(대소문자 구분). 모든 매핑을 돌리고, 게이트 셋 중 하나라도 FAIL인 항목이 있으면 exit 1.
3. `visual-diff/<이름>/report.md`를 읽고 판정표 순서로 본다. `figma.png`, `story.png`, `diff.png`가 같은 폴더에 있다.
4. `src/styles/theme.test/index.ts`에 새 보류 토큰이 생겼으면 `src/styles/theme/`으로 옮기고 `theme.test`에서 지운다. **Figma 시안이 SSOT라 시안에 있는 값은 그대로 토큰이 된다** — 확인을 기다리지 않는다. 이 파일은 스크립트가 덮어쓰므로 손으로 고치지 않는다.

## 판정 읽는 법

| 항목 | 게이트 | 뜻 |
|---|---|---|
| 토큰 (theme에 없는 값) | 예 | Figma 쪽 위반은 theme.test에 자동 기록. 구현 쪽 위반은 하드코딩 색·임의 폰트 크기. 글자를 그리지 않는 요소가 상속만 받은 색은 세지 않는다 |
| 토큰 일치 (사용 집합) | 예 | Figma는 gray.700인데 구현이 gray.800 같은 어긋남 |
| 루트 크기 ±2px | 예 | 패딩·행간 차이. 2px 단위로 어긋나면 테두리를 먼저 의심한다(아래 참고) |
| 레이아웃 (자식 위치·간격·여백) ±0.5px | 예 | 시안 루트가 auto-layout이면 주축 간격·앞뒤 여백에 더해 교차축 앞뒤 여백까지 본다(`gap`·`padding`·정렬 차이). auto-layout이 아니면 자식 상자의 x·y·너비·높이를 그대로 대조한다 |
| 픽셀 차이 % | 아니오 | Figma와 브라우저는 안티앨리어싱이 달라 같은 구현도 수 % 나온다. diff.png로 위치만 본다 |

**짝 없는 색이 떴을 때 "반투명" 절을 먼저 본다.** 반투명은 양쪽 다 판정에서 빠지므로, 한쪽만 반투명이면 반대쪽 집합에 짝 없는 색으로 남는다. 예: 시안이 불투명 `#F2F2F2`이고 구현이 `rgba(237,237,237,0.8)`이면 "Figma에만 `#F2F2F2`"만 뜨고 구현 쪽은 비어 보인다. 그 원인이 "반투명" 절의 구현 표에 있다. 양쪽 다 반투명이면 값이 달라도 PASS이므로 이 절을 눈으로 대조해야 한다.

픽셀 %를 합격 기준으로 쓰지 않는다. 토큰·크기 게이트가 PASS인데 픽셀이 크면 폰트 로딩이나 이미지 에셋을 먼저 의심한다.

## 자주 틀리는 것

- 시안 프레임이 컴포넌트보다 크다. 예: 공연시간표의 행 프레임(335px)은 시간 라벨+세로선+카드인데 스토리는 카드(294px)뿐이다. 이때는 카드에 해당하는 안쪽 프레임 노드를 잡는다. `files/:key/nodes?ids=<노드>&depth=3`으로 자식 크기를 보면 찾기 쉽다.
- Figma 텍스트에 검정 20% 같은 반투명 fill이 겹쳐 있으면 토큰이 아니다. 리포트의 "반투명" 절에 따로 나오고 theme.test에는 안 들어간다. **Figma 파일은 고치지 않는다** — 시안이 SSOT라 구현 쪽 사정으로 건드리면 기준 자체가 오염된다. 정리가 필요해 보이면 디자이너에게 전달만 하고, 구현은 이 표와 무관하게 진행한다.
- Figma PNG는 그림자·이펙트 영역까지 포함해 bbox보다 크게 나온다. 픽셀 %가 그만큼 오르는 건 정상이다.

- 매핑의 `figma` URL이 페이지 링크(node-id 없음)라 실패한다. 프레임을 선택한 상태에서 복사한다.
- Figma variant 하나에 스토리 하나. "Active 시안"을 `Inactive` 스토리 + `args`로 맞추는 대신, 스토리 export가 있으면 그 ID를 쓴다.
- **내부 간격 차이는 루트 크기로는 안 보인다.** 자식이 늘어나 흡수하면 바깥 크기가 그대로라 크기 축은 PASS다. 레이아웃 축이 그걸 잡는다. 반대로 레이아웃 축은 **직계 자식까지만** 본다 — 더 안쪽의 간격 차이는 여전히 안 보인다. 자식이 아예 없는 시안 프레임에서만 이 축이 `–`로 비고, 그 밖에는 프레임 종류와 무관하게 판정한다.
- **간격은 시안의 `itemSpacing`을 믿지 않고 자식 위치에서 잰다.** `primaryAxisAlignItems=SPACE_BETWEEN`인 프레임은 `itemSpacing`에 실제와 무관한 값이 남아 있다(이 파일에도 `gap=147` 같은 게 여럿 있다).
- **테두리가 2px을 만든다.** Figma stroke는 `strokeAlign=INSIDE`면 프레임 크기에 더해지지 않는데, CSS `border`는 `height: auto`일 때 박스 바깥으로 더해진다. 시안의 auto-layout은 카드가 제 높이만 차지한다는 전제로 짜여 있어서, 목록에서는 행마다 누적된다. 레이아웃에 영향을 주지 않으려면 `box-shadow: inset 0 0 0 <두께> <색>`으로 그린다(`PerformanceCard` 참고). 비활성 상태에 크기 튐 방지용 투명 border를 두고 있다면 그것도 같은 증상이다.
- 스토리 데코레이터가 고정 폭을 주면 Figma 프레임 폭과 같아야 한다. 다르면 루트 크기 게이트가 항상 FAIL이다.

구현은 `scripts/figma-story-diff/` (figma · story · diff · theme · run). Figma REST는 `files/:key/nodes`와 `images/:key`만 쓴다.
