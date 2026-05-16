# 주요 기능

## 실험(A/B 테스트) 프레임워크

`src/experiments/`에서 Mixpanel 기반 실험 관리:

- `definitions.ts` - 실험 정의 (key, variants, weights)
- `ExperimentRepository.ts` - 실험 할당 및 변형 조회 로직
- `initializeExperiments.ts` - 앱 시작 시 실험 초기화
- `useExperiment()` 훅으로 컴포넌트에서 실험 변형 사용

```typescript
const { variant } = useExperiment(mainBannerExperiment);
// variant는 'A' 또는 'B'
```

## WebView 필터탭 라우팅

`src/routes/webviewFilterConfig.ts`의 `WEBVIEW_FILTER_CONFIG`이 필터탭 UI와 라우트 등록의 단일 진실 공급원.

**새 필터탭 추가 시 수정할 파일 2곳:**

1. `src/routes/webviewFilterConfig.ts` — `{ label, path }` 항목 추가
2. `src/routes/webviewRoutes.tsx` — `PAGE_MAP`에 해당 path의 컴포넌트 연결

`WEBVIEW_FILTER_CONFIG`을 수정하면 `Filter.tsx`의 탭 UI와 `webviewRoutes.tsx`의 라우트가 자동으로 반영됨.

## OG 태그 (소셜 미디어 공유 미리보기)

### 구조

React SPA는 클라이언트 사이드 렌더링이라 카카오톡/페이스북 크롤러가 JavaScript를 실행하지 않아 OG 태그를 읽지 못한다. 이를 해결하기 위해 `middleware.ts`(프로젝트 루트)에 Vercel Edge Middleware를 적용했다.

**요청 흐름:**

```
크롤러 요청 → middleware.ts (User-Agent 감지)
  → 백엔드 API fetch (timeout 3초)
  → OG 태그 포함 HTML 반환

일반 브라우저 → middleware.ts → 통과 → index.html (SPA)
```

**커버하는 라우트:**

- `/club/:objectId` — 클럽 상세 (ObjectId)
- `/clubDetail/:objectId`
- `/club/@:clubName` — 클럽 상세 (이름)
- `/clubDetail/@:clubName`

**감지 크롤러:** KakaoTalk, facebookexternalhit, Twitterbot, LINE, WhatsApp, Telegram, Discord, Slack 등

### 새 라우트에 OG 추가 방법

`middleware.ts`의 regex와 matcher를 수정한다.

```ts
// 라우트 추가
const match = pathname.match(/^\/club(?:Detail)?\/([a-f0-9]{24}|@[^/]+)/i);

// config matcher에도 추가
export const config = {
  matcher: ['/club/:path*', '/clubDetail/:path*', '/새라우트/:path*'],
};
```

### Next.js 대비 한계점

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

## 실시간 업데이트

지원자 상태 업데이트를 위해 SSE(Server-Sent Events) 사용, `AdminClubContext`에서 관리.

## 주요 유틸리티 함수

`src/utils/`에 공용 유틸리티 함수 모음:

- `formatRelativeDateTime.ts` - 상대적 시간 표시 ("2시간 전")
- `recruitmentDateParser.ts` - 모집 기간 파싱
- `debounce.ts` - 디바운스 함수
- `validateSocialLink.ts` - SNS 링크 유효성 검사
- `isInAppWebView.ts` - 인앱 WebView 감지
- `webviewBridge.ts` - 네이티브 앱과 통신
- `initSDK.ts` - 외부 SDK 초기화 (Mixpanel, Sentry, Channel.io, Kakao)
