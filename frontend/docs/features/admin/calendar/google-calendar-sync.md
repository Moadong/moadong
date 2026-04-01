# Google 캘린더 연동

Google Calendar API를 백엔드를 통해 연동하여 동아리 일정을 동기화하는 기능.

## 연동 흐름

1. 사용자가 "Google 캘린더 연동하기" 버튼 클릭
2. `startGoogleOAuth()` → 백엔드 OAuth URL로 리다이렉트
3. Google 인증 완료 후 `/callback/google` 페이지로 콜백
4. 토큰 저장 후 `isGoogleConnected = true`
5. 캘린더 목록 자동 조회 (`googleCalendars`)
6. 동기화할 캘린더 선택 (`selectGoogleCalendar`)

## UI 상태

| 상태 | 표시 내용 |
|------|----------|
| 미연결 | 안내 메시지 + 연동 버튼 |
| 연결됨 | 성공 메시지 + 캘린더 선택 드롭다운 + 연결 해제 버튼 |

## 관련 코드

- `src/pages/AdminPage/tabs/CalendarSyncTab/CalendarSyncTab.tsx` — UI 컴포넌트
- `src/pages/AdminPage/tabs/CalendarSyncTab/hooks/useCalendarSync.ts` — 상태 관리 훅
- `src/pages/AdminPage/tabs/CalendarSyncTab/hooks/useGoogleCalendarOAuth.ts` — Google OAuth 훅
- `src/pages/GoogleCallbackPage/GoogleCallbackPage.tsx` — OAuth 콜백 페이지
- `src/apis/calendar/googleCalendar.ts` — 백엔드 API 함수
