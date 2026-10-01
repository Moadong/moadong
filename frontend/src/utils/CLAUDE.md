# utils — 공용 유틸리티 & SDK 초기화

`src/utils/`에 공용 유틸리티 함수 모음:

- `formatRelativeDateTime.ts` - 오늘은 시각("오후 2:30"), 과거는 날짜("2024.01.15")
- `formatTimeAgo.ts` - 항상 경과 시간으로 표시 ("5일 전"). 우체통 목록/상세에서 사용
- `recruitmentDateParser.ts` - 모집 기간 파싱
- `debounce.ts` - 디바운스 함수
- `cdnImage.ts` - `cdn.moadong.com` 이미지를 용도별 크기의 Cloudflare 변환 URL로 바꿈. 다른 호스트는 그대로. 모달 전체보기에는 쓰지 않는다(원본 유지)
- `validateSocialLink.ts` - SNS 링크 유효성 검사
- `isInAppWebView.ts` - 인앱 WebView 감지 (UA의 `MoadongApp`)
- `isIOS.ts` - UA로 iOS 기기 판별. 스토어 링크 분기 등에 사용
- `getDeviceLocale.ts` - 기기 언어 설정 조회 (앱 주입 `window.deviceLocale` → `navigator.language` 폴백)
- `webviewBridge.ts` - 네이티브 앱과 통신
- `initSDK.ts` - 외부 SDK 초기화

## 외부 서비스 통합

- **Mixpanel**: 사용자 분석 및 이벤트 트래킹
- **Sentry**: 에러 모니터링 및 성능 추적
- **Channel.io**: 고객 지원 채팅
- **Kakao SDK**: 카카오 공유 기능
- **Naver Map**: 동아리방 위치 지도 (네이버 클라우드 플랫폼)

Mixpanel·Sentry·Channel.io는 `initSDK.ts`에서 초기화.
Sentry만 `src/instrument.ts`를 거쳐 `index.tsx`의 첫 import에서 init한다. `AppRoutes`의 `Sentry.wrapUseRoutesV7`는 init 전에 평가되면 경고 없이 원래 `useRoutes`를 돌려줘서 트랜잭션 이름이 라우트 패턴이 아닌 URL로 남기 때문이다. 연동에 넘기는 `useLocation`은 pathname을 디코딩한 버전이다(한글 동아리명 URL 대응, 이유는 `initSDK.ts` 주석). 모든 Sentry 이벤트에는 `webview` 태그가 붙는다. Sentry `environment`는 빌드 MODE가 아니라 접속 도메인으로 정한다(`www.moadong.com`=production, localhost=development, 그 외 Vercel 프리뷰 등=preview). 성능 트랜잭션은 전량 수집한다(`tracesSampleRate: 1.0`, 근거는 `initSDK.ts` 주석).
Mixpanel Super Property는 `initializeMixpanel()`에서 `mixpanel.register()`로 1회 등록한다 (`$os_version`, `device_locale`).
`device_locale`은 앱이 웹뷰 콘텐츠 로드 **전에** `window.deviceLocale`을 주입해야 정확하며, 주입이 없으면 `navigator.language`로 폴백한다. Naver Map은 `loadNaverMapScript.ts`로 동적 로드(SDK init 아님). 각각 환경 변수 필요 (→ [frontend/CLAUDE.md](../../CLAUDE.md) 환경 변수 참고).
