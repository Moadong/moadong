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

## 관련 코드

- `src/apis/studentAuth.ts` — `getStudentOAuthUrl` (URL 조립), `exchangeStudentOAuthCode` (code → JWT)
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
