# 학생 소셜 로그인 (Student Social Login)

카카오/구글 OAuth 2.0 Authorization Code Flow를 사용한 학생 사용자 로그인.

## 플로우

```
버튼 클릭
→ FE가 OAuth URL 직접 조립 후 이동 (client_id + redirect_uri + response_type)
→ 카카오/구글 로그인 완료 후 /login/callback?code=xxx 로 리다이렉트
→ StudentOAuthCallbackPage에서 code 추출
→ POST /auth/student/oauth/{provider}/callback (code + redirectUri) 호출
→ BE가 code로 provider 토큰 교환 → JWT 발급
→ accessToken localStorage 저장, isNewUser에 따라 라우팅
```

## 설계 결정

BE는 OAuth URL 반환 API를 제공하지 않는다. FE가 `VITE_KAKAO_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID` 환경변수로 URL을 직접 조립한다. `redirectUri`는 `window.location.origin + /login/callback`으로 고정하며, BE 콜백 API 호출 시에도 동일한 값을 전달한다 (provider 토큰 교환 시 BE가 사용).

## 비고: 소셜 로그인은 필수가 아님 (앱 FCM 의존성)

앱 사용자는 `injectedJavaScriptBeforeContentLoaded`로 웹뷰에 학생 토큰을 주입하고, 그 토큰으로 FCM 디바이스 토큰을 백엔드 사용자 신원에 등록한다. 앱은 자체 로그인 흐름이 없고 모든 사용자가 그 경로로 푸시 알림을 받기 때문에, 소셜 로그인을 강제하면 FCM 등록이 끊어져 기존 앱 사용자에게 푸시가 가지 않는다.

따라서 앱 측에서 소셜 로그인을 강제하는 흐름이 추가되기 전까지 우체통 토큰은 다음 우선순위로 동작한다 (`src/apis/auth/studentFetch.ts`):

1. **소셜 로그인 토큰** — 로그인한 사용자. 없으면 아래로 폴백
2. **앱 주입 토큰** — `window.__MOADONG_STUDENT_TOKEN__`. 앱이 다른 토큰을 넣어주면 자동으로 그것으로 전환
3. **localStorage UUID** — 일반 웹 사용자
4. **신규 발급** — 위 셋이 모두 없을 때 `POST /auth/student`로 발급

소셜 로그인을 필수로 전환하는 시점에 이 우선순위에서 2번을 제거하고, 앱이 로그인 전 사용자에 대해 1번을 보장하도록 네이티브 측을 함께 수정해야 한다. 이 문서가 갱신되지 않은 채 앱이 강제 전환되면 FCM이 끊기므로 주의.

## 관련 코드

- `src/apis/studentAuth.ts` — `getStudentOAuthUrl` (URL 조립), `exchangeStudentOAuthCode` (code → JWT)
- `src/apis/auth/studentFetch.ts` — 학생 토큰 선택 및 401 재시도 (위 우선순위 구현)
- `src/pages/LoginPage/LoginPage.tsx` — 소셜 로그인 버튼 + 핸들러
- `src/pages/CallbackPage/StudentOAuthCallbackPage.tsx` — code 수신 및 JWT 저장

## 환경변수

| 변수 | 용도 |
|---|---|
| `VITE_KAKAO_CLIENT_ID` | 카카오 OAuth URL 조립 |
| `VITE_GOOGLE_CLIENT_ID` | 구글 OAuth URL 조립 |

## 외부 설정 (배포 시 필요)

- 카카오 디벨로퍼 > 카카오 로그인 > Redirect URI 등록
- Google Cloud Console > OAuth 클라이언트 > 승인된 리디렉션 URI 등록

등록 필요 URI: `{origin}/login/callback`
