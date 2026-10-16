# RN 에이전트 (React Native)

모아동 React Native + Expo 프로젝트 전담 에이전트.
WebView 브릿지, 딥링크/라우팅, Push 알림, API/인증 관련 코드를 분석하고 수정한다.

## 프로젝트 경로

/Users/seokyoung-won/Desktop/moadong-react-native/

## 기술 스택

- Expo SDK + Expo Router (파일 기반 라우팅)
- React Native New Architecture (`newArchEnabled: true`)
- React Compiler (실험적 기능)
- Axios (`publicApi` / `authApi`) — `api` default export는 deprecated
- React Context (Redux/Zustand 미사용)
- Firebase (Remote Config, FCM)
- Mixpanel 애널리틱스

## 아키텍처

### 라우팅 구조

```
app/
  _layout.tsx          # 루트 레이아웃: 부트스트랩, 스플래시, 강제 업데이트, Context
  (tabs)/
    index.tsx          # 홈 탭
    explore.tsx        # 탐색 탭
    more.tsx           # 더보기 탭
  club/[id].tsx        # 동아리 상세 (WebView)
  clubDetail/[id].tsx  # 동아리 상세 (네이티브)
  webview/[slug].tsx   # 범용 WebView 화면
  modal.tsx            # 모달
```

### UI 레이어 패턴

기능별 폴더 `ui/<feature>/` 하위 구조 (필요한 것만 생성):

- `hook/` — 데이터 페칭 훅 (예: `useClubs`, `useSubscribedClubs`)
- `model/` — 파생 상태 / 데이터 변환 (선택)
- `components/` — UI 컴포넌트
- `index.ts` — barrel export

### 부트스트랩 순서 (`app/_layout.tsx`)

1. Firebase Remote Config 강제 업데이트 체크
2. iOS ATT 권한 요청
3. 액세스 토큰 조회/생성
4. FCM 토큰 등록
5. 서버에서 구독 동아리 목록 동기화
6. Mixpanel 초기화

### API 클라이언트 (`services/api.ts`)

- `publicApi` — 인증 없는 요청
- `authApi` — Bearer 토큰 자동 첨부, 401 시 `/auth/student`로 자동 갱신
- ⚠️ `api` (default export) 는 deprecated — 신규 코드에 사용 금지

### 상태 관리 (Context)

- `SubscribedClubsProvider` (`contexts/subscribed-clubs-context.tsx`) — 구독 동아리 목록, 토글, 서버 동기화
- `MixpanelProvider` (`contexts/mixpanel-context.tsx`) — 애널리틱스

## 시나리오별 핵심 파일

### WebView 브릿지

웹 ↔ RN 메시지 통신 관련 파일:

- `app/club/[id].tsx` — WebView 컴포넌트, `onMessage` 핸들러
- `app/webview/[slug].tsx` — 범용 WebView, postMessage 처리
- 프론트엔드 쪽: `src/utils/webviewBridge.ts` (참조용, 수정 불가)

### 딥링크 / 라우팅

- `app/_layout.tsx` — Linking 설정, 초기 라우트 처리
- `app.json` — 딥링크 스킴(`moadongapp://`), associated domain(`www.moadong.com`)
- Expo Router 파일 기반 라우팅: `app/` 디렉토리에 파일 추가 = 라우트 자동 등록

### Push 알림

- `app/_layout.tsx` 4번째 부트스트랩 단계에서 FCM 토큰 등록
- `services/api.ts` — 토큰 등록 API 호출
- `google-services.json` / `GoogleService-Info.plist` — Firebase 설정 파일

### API / 인증

- `services/api.ts` — Axios 인스턴스 정의
- `contexts/subscribed-clubs-context.tsx` — `authApi` 사용 예시
- 환경 변수: `EXPO_PUBLIC_BASE_URL` (`.env` 파일)

## 디자인 시스템 (`constants/theme.ts`)

- `MainColors` — 오렌지 계열 (`main` = `#FF5414`)
- `TagColors` — 카테고리별 색상 (봉사/학술/종교/취미교양/운동/공연)
- `Spacing` — 4px 기준: `xs`(4) `sm`(8) `md`(16) `lg`(24) `xl`(32) `xxl`(40) `xxxl`(48)
- `BorderRadius` — `xs`(4) `sm`(8) `md`(12) `lg`(16) `xl`(20) `full`(9999)
- 폰트: Pretendard. RN `Text` 대신 `@/components/moa-text`의 `<MoaText type="...">` 사용

## 네이밍 컨벤션

- 파일명: `kebab-case.tsx`
- 컴포넌트: `PascalCase`
- 훅: `use` 접두사 + `camelCase`
- **named export 선호** — default export는 `app/` 화면 컴포넌트에만 허용
- 경로 별칭: `@/` → 프로젝트 루트
- 플랫폼별 파일: `.ios.tsx` / `.web.ts` 접미사

## 수정 체크리스트

코드 수정 시 반드시 확인:

- [ ] `authApi` / `publicApi` 구분 올바른가? (`api` default 사용 금지)
- [ ] 파일명이 `kebab-case`인가?
- [ ] named export를 사용했는가? (`app/` 화면 제외)
- [ ] `@/` 경로 별칭을 사용했는가? (상대 경로 지양)
- [ ] TypeScript 타입이 명시적인가? (`any` 금지)
- [ ] 디자인 토큰을 `constants/theme.ts`에서 가져왔는가?
- [ ] 텍스트에 RN `<Text>` 대신 `<MoaText type="...">` (`@/components/moa-text`)를 사용했는가?
