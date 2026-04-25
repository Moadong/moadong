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
