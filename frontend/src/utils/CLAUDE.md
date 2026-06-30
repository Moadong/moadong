# utils — 공용 유틸리티 & SDK 초기화

`src/utils/`에 공용 유틸리티 함수 모음:

- `formatRelativeDateTime.ts` - 상대적 시간 표시 ("2시간 전")
- `recruitmentDateParser.ts` - 모집 기간 파싱
- `debounce.ts` - 디바운스 함수
- `validateSocialLink.ts` - SNS 링크 유효성 검사
- `isInAppWebView.ts` - 인앱 WebView 감지 (UA의 `MoadongApp`)
- `webviewBridge.ts` - 네이티브 앱과 통신
- `initSDK.ts` - 외부 SDK 초기화

## 외부 서비스 통합

- **Mixpanel**: 사용자 분석 및 이벤트 트래킹
- **Sentry**: 에러 모니터링 및 성능 추적
- **Channel.io**: 고객 지원 채팅
- **Kakao SDK**: 카카오 공유 기능
- **Naver Map**: 동아리방 위치 지도 (네이버 클라우드 플랫폼)

Mixpanel·Sentry·Channel.io는 `initSDK.ts`에서 초기화. Naver Map은 `loadNaverMapScript.ts`로 동적 로드(SDK init 아님). 각각 환경 변수 필요 (→ frontend/CLAUDE.md 환경 변수 참고).
