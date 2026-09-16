# figma-story-diff — Figma 시안 ↔ Storybook 구현 대조

컴포넌트의 Figma 노드와 Storybook 스토리를 자동으로 대조해 `visual-diff/<이름>/report.md`에 판정을 남긴다. 눈으로 비교하기 전에는 드러나지 않는 색·타이포 토큰 차이를 잡는 용도다.

## 실행

```bash
npm run storybook                                    # 먼저 6006에 띄워 둘 것
npx dotenv -- npm run visual:figma                   # 전체
npx dotenv -- npm run visual:figma PerformanceCard   # 매핑 이름 부분일치 필터
```

- `FIGMA_TOKEN`(개인 액세스 토큰)이 필요하고 `frontend/.env`에 있다. `run.mjs`는 dotenv를 부르지 않으므로 `npx dotenv --`로 감싸거나 직접 export해야 한다. 안 그러면 `FIGMA_TOKEN(개인 액세스 토큰)이 없다`로 죽는다.
- Storybook 주소는 `STORYBOOK_URL`로 바꾼다 (기본 `http://localhost:6006`).
- 종료 코드: `0` 전부 PASS · `1` 하나라도 FAIL · `2` 매핑 없음

## 매핑 추가

컴포넌트 옆에 `<Component>.figma.json`을 둔다. `src/` 아래 어디에 있든 자동 수집된다.

```json
{
  "PerformanceCard/Active": {
    "figma": "https://www.figma.com/design/<fileKey>/모아동?node-id=8790-9742",
    "story": "pages-festivalpage-components-performancecard--active",
    "args": {}
  }
}
```

- `figma` — Figma에서 노드 우클릭 → Copy link to selection. `node-id` 쿼리가 있어야 한다.
- `story` — Storybook URL의 `id=` 값.
- `args` — 원시값만 된다. 객체·배열이 필요하면 스토리 export로 고정할 것(에러로 막아 둔다).

## 판정 읽는 법

세 축이 모두 PASS여야 PASS다.

| 축 | 의미 | FAIL이 뜻하는 것 |
| --- | --- | --- |
| 토큰 | theme에 없는 색·타이포를 쓰는가 | 시안이나 구현이 토큰 밖 값을 쓴다 |
| 토큰 일치 | 시안과 구현의 사용 집합이 같은가 | 같은 자리에 서로 다른 토큰을 썼다 |
| 루트 크기 | 루트 요소 크기가 ±2px 안인가 | 패딩·갭·폰트 메트릭 차이 |

**픽셀 차이는 판정이 아니다.** 그림자 같은 이펙트가 있는 노드는 Figma 익스포트 PNG에 여백이 붙어 나와(예: 620×328 vs 588×300) 두 이미지가 통째로 어긋난 채 비교된다. 수치가 20%든 1%든 그것만으로 결론 내리지 말 것.

## Claude가 쓰는 법

1. Storybook을 `run_in_background`로 띄우고 6006이 응답할 때까지 기다린다. 대기 루프는 짧게 잡는다(보통 수 초 안에 뜬다).
2. `npx dotenv -- npm run visual:figma <필터>` 실행.
3. `visual-diff/<이름>/report.md`를 Read 한다. FAIL 축과 하단 표가 원인을 바로 가리킨다 — 어느 색이 어느 Figma 노드/DOM 요소에서 왔는지까지 찍힌다.
4. 필요하면 `figma.png` · `story.png` · `diff.png`를 Read로 직접 본다.
5. 색 하나가 어긋났을 때 **그 색이 실제로 화면에 칠해지는지 먼저 확인한다.** 글자 없는 wrapper가 상속만 받은 값일 수 있다.
6. 시안 원본이 필요하면 Figma REST를 직접 친다. `node-id`의 `-`를 `:`로 바꿔야 한다.

   ```bash
   curl -s -H "X-Figma-Token: $FIGMA_TOKEN" \
     "https://api.figma.com/v1/files/<fileKey>/nodes?ids=8790:9742" -o /tmp/fig.json
   ```

   노드 트리의 `fills`를 hex로 풀어 보면 어느 TEXT가 어떤 색인지 확정할 수 있다. 리포트의 "어느 노드에서 왔나"는 같은 hex를 쓰는 노드가 여럿이면 마지막 것만 남으므로, 단정하기 전에 이 단계로 한 겹 더 확인한다.

## 보류 토큰

시안에 있는데 theme에 없는 값은 `src/styles/theme.test/index.ts`에 누적된다. **스크립트가 생성하는 파일이라 손으로 고치지 않는다.** 여기 쌓인 목록이 "디자인 시스템에 편입할 것 vs 시안을 고칠 것"을 판단할 대상이다.

## 산출물

`visual-diff/`는 gitignore 대상이다. 리포트나 이미지를 리뷰에 남기려면 내용을 PR 본문으로 옮긴다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `run.mjs` | 매핑 수집 → 실행 → 판정 → 리포트 작성 |
| `figma.mjs` | Figma REST로 노드 트리·렌더 PNG를 받아 토큰 수집. 반투명 겹침 fill은 판정에서 빼고 따로 표시 |
| `story.mjs` | Playwright로 Storybook iframe을 열어 computed style에서 같은 축 수집 |
| `theme.mjs` | esbuild로 `theme/index.ts`를 번들해 토큰 집합 생성 |
| `diff.mjs` | pixelmatch 기반 참고용 픽셀 차이 |
