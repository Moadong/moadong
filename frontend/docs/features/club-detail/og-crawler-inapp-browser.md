# 공유 링크 OG 크롤러 분기 — 인앱 브라우저 오탐 수정

앱 상세페이지 "공유하기"로 받은 링크를 카카오톡에서 열면 빈 화면에 텍스트만 보이던 문제를 수정했다.

## 원인

`middleware.ts`(Vercel Edge Middleware)는 `CRAWLER_PATTERN`으로 크롤러를 감지해 OG 정적 HTML(`<h1>제목</h1><p>설명</p>`)을 반환하고, 일반 요청은 SPA로 통과시킨다. 기존 패턴의 `kakao` 토큰이 카카오톡 **스크랩 봇**뿐 아니라 **인앱 브라우저** UA(`KAKAOTALK <버전>`)까지 잡아, 링크를 연 실제 사용자가 SPA 대신 OG용 텍스트 HTML을 받았다.

## 수정

- `kakao` → `kakaotalk-scrap`로 토큰을 좁혔다. 카카오 스크랩 봇 UA는 `facebookexternalhit/1.1; kakaotalk-scrap/1.0`이라 OG 미리보기는 기존 `facebookexternalhit` + 새 `kakaotalk-scrap` 양쪽으로 유지되고, 인앱 브라우저(`KAKAOTALK`)는 둘 다 안 걸려 SPA로 통과한다.
- OG fetch의 `API_BASE`가 dev 서버(`yourun.shop`)로 하드코딩돼 있어 `process.env.VITE_API_BASE_URL`로 교체했다. 클라이언트와 동일 소스를 사용해 환경별(prod/preview)로 올바른 백엔드를 조회한다. 미설정 시 가드로 SPA fallback.

`line` 등 다른 메신저 인앱 브라우저도 동일한 잠재 위험이 있으나 사용량이 적어 보류했다 (`docs/claude/features.md`에 캐비엇 기록).

## 관련 코드

- `middleware.ts` — `CRAWLER_PATTERN`, `API_BASE`, OG HTML 빌드/반환
- `src/pages/ClubDetailPage/components/ShareButton/ShareButton.tsx` — `/clubDetail/@{name}` 공유 링크 생성
- `src/utils/isKakaoTalkBrowser.ts` — 인앱 브라우저 UA(`KAKAOTALK`) 감지 (UA 문자열 교차검증)
