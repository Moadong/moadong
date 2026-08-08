# OG 태그 · AEO (소셜 공유 미리보기 + AI 답변엔진)

> `middleware.ts`(프로젝트 루트)를 수정할 때 참고. 이 문서는 [frontend/CLAUDE.md](../../CLAUDE.md) 인덱스에서 연결된다.

## 구조

React SPA는 클라이언트 사이드 렌더링이라 카카오톡/페이스북 크롤러가 JavaScript를 실행하지 않아 OG 태그를 읽지 못한다. 이를 해결하기 위해 `middleware.ts`(프로젝트 루트)에 Vercel Edge Middleware를 적용했다.

**요청 흐름:**

```
크롤러 요청 → middleware.ts (User-Agent 감지)
  → 백엔드 API fetch (timeout 3초)
  → OG 태그 + JSON-LD + 본문 HTML 반환

일반 브라우저 → middleware.ts → 통과 → index.html (SPA)
```

## AEO (답변엔진 최적화)

크롤러 응답 HTML에는 OG 태그뿐 아니라 **AI가 인용할 사실**이 함께 실린다.

**동아리 상세** (`buildOgHtml`)

- `<script type="application/ld+json">` — `@graph`에 `Organization`(동아리, `parentOrganization`은 국립부경대학교)과 FAQ가 있으면 `FAQPage`
- `<body>` — `h1`(동아리명), 한 줄 소개, 핵심 사실 `dl`(소속·분과·카테고리·모집 상태·모집 기간·모집 대상), `활동 소개` / `이런 분을 찾아요` / `혜택` 섹션, `자주 묻는 질문` `dl`

**홈 `/`** (`buildHomeHtml`) — 동아리 검색 API를 호출해 전체 목록을 렌더링한다. 답변엔진에 "부경대에 무슨 동아리가 있나" 자체를 답해주고, 동시에 모든 상세 페이지로 가는 크롤 경로가 된다.

- `@graph`에 `WebSite` + 전체 동아리 `ItemList`
- `<body>` — `h1`, 서비스 설명, `등록된 동아리 N개` 헤딩, 동아리별 `<li>`(상세 링크 · 카테고리 · 분과 · 모집 상태 · 한 줄 소개)

정적 텍스트 페이지(`/introduce`, `/club-union`)는 커버하지 않는다. 문구가 React 컴포넌트·상수에 있어 middleware로 옮기면 복제본이 생기고 드리프트하는데, 답변엔진 관점의 이득은 작다.

값이 비어 있으면 해당 항목·섹션은 통째로 생략된다(`nonEmpty` / `buildSection`). JSON-LD는 `</script>` 조기 종료를 막기 위해 모든 `<`를 `<`로 이스케이프한다(`toJsonLdScript`).

`중동`/`과동`, `OPEN`/`CLOSED`/`UPCOMING`/`ALWAYS` 같은 API 코드값은 `DIVISION_LABELS`·`RECRUITMENT_STATUS_LABELS`로 사람이 읽는 한글로 변환해 노출한다. 백엔드에 값이 추가되면 이 맵도 함께 갱신할 것 (미등록 값은 원본 코드가 그대로 노출된다).

**커버하는 라우트:**

- `/` — 홈 (동아리 목록)
- `/club/:objectId` — 클럽 상세 (ObjectId)
- `/clubDetail/:objectId`
- `/club/@:clubName` — 클럽 상세 (이름)
- `/clubDetail/@:clubName`

**감지 크롤러:** 카카오톡 스크랩 봇(`kakaotalk-scrap`), facebookexternalhit, Twitterbot, LINE 봇(`line-poker`·`linespider`), WhatsApp, Telegram, Discord, Slack 등

**감지 AI 답변엔진:** GPTBot·OAI-SearchBot·ClaudeBot·PerplexityBot·bingbot·Applebot은 기존 `bot` 토큰으로 매칭된다. `bot`이 없는 실시간 브라우징 에이전트(`ChatGPT-User`, `Claude-User`, `Perplexity-User`, `Google-Extended`)는 개별 토큰으로 추가했다. 새 에이전트를 넣을 때는 UA에 `bot`/`crawl`이 이미 들어있는지 먼저 확인할 것.

> 카카오는 인앱 브라우저(`KAKAOTALK <버전>`)와 스크랩 봇(`kakaotalk-scrap`)이 UA가 다르다. 봇만 감지해야 실제 사용자가 SPA를 받는다. ([인앱 브라우저 오탐 위험](#현재-구조의-실질적-위험) 참고)

## 새 라우트에 OG 추가 방법

`middleware.ts`의 regex와 matcher를 수정한다.

```ts
// 라우트 추가
const match = pathname.match(/^\/club(?:Detail)?\/([a-f0-9]{24}|@[^/]+)$/i);

// config matcher에도 추가
export const config = {
  matcher: ['/club/:path*', '/clubDetail/:path*', '/새라우트/:path*'],
};
```

## Next.js 대비 한계점

| 항목                | Vercel Edge Middleware (현재)        | Next.js                            |
| ------------------- | ------------------------------------ | ---------------------------------- |
| **OG 생성 방식**    | 크롤러 감지 후 API fetch             | `generateMetadata()`로 서버 렌더링 |
| **일반 사용자**     | 영향 없음 (SPA 그대로)               | SSR로 항상 메타태그 포함           |
| **실행 제한**       | 5초, 메모리 128MiB                   | 제한 없음 (서버 함수)              |
| **API 의존성**      | API 실패 시 OG 없이 fallback         | 서버에서 직접 DB 조회 가능         |
| **User-Agent 오탐** | 새 크롤러 추가 시 수동 업데이트 필요 | 해당 없음                          |
| **캐싱**            | Edge에서 별도 캐시 없음              | ISR로 캐싱 가능                    |
| **커버 범위**       | 명시적으로 등록한 라우트만           | 모든 페이지 자동                   |

**현재 구조의 실질적 위험:**

1. **API 3초 초과 시 OG 미노출** — 백엔드가 느리면 크롤러에게 빈 HTML 반환
2. **새 크롤러 미감지** — `CRAWLER_PATTERN` regex에 없는 봇은 SPA를 받아 OG 미노출
3. **라우트 수동 관리** — 새 페이지에 OG가 필요하면 middleware를 직접 수정해야 함
4. **인앱 브라우저 오탐 위험** — `CRAWLER_PATTERN` 토큰이 메신저 인앱 브라우저 UA까지 잡으면 실제 사용자가 SPA 대신 크롤러용 텍스트 HTML을 받아 빈 화면처럼 보인다. 과거 `kakao` 토큰이 카카오톡 인앱 브라우저(`KAKAOTALK <버전>`)를 오탐해 공유 링크가 빈 화면+텍스트로 떴고, 봇 전용 식별자 `kakaotalk-scrap`로 좁혀 해결했다. `line` 토큰도 LINE 인앱 브라우저(`Line/<버전>`)를 잡던 동일 문제가 있어 `line-poker`·`linespider`로 좁혔다. **홈 `/`까지 커버 범위가 넓어졌으므로 토큰을 추가할 때는 반드시 인앱 브라우저 UA와 겹치지 않는지 확인할 것** — 오탐이 나면 홈 화면이 통째로 깨져 보인다.
