# Google Calendar 연동 프론트엔드 작업 가이드

## 개요

백엔드에서 Google Calendar 연동 기능이 구현되었습니다. 기존 Notion Calendar와 함께 동시 연동이 가능하며, 두 캘린더의 이벤트가 통합 뷰로 제공됩니다.

---

## 1. 새로운 API 엔드포인트

### Google OAuth 연동

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|----------|
| GET | `/api/integration/google/oauth/authorize` | OAuth 인가 URL 생성 | Yes |
| POST | `/api/integration/google/oauth/token` | 인증 코드 → 토큰 교환 | Yes |
| GET | `/api/integration/google/calendars` | 캘린더 목록 조회 | Yes |
| POST | `/api/integration/google/calendars/{calendarId}/select` | 캘린더 선택 | Yes |
| DELETE | `/api/integration/google/connection` | 연결 해제 | Yes |

### 기존 엔드포인트 (변경 없음, 응답만 변경)

| Method | Endpoint | 변경 사항 |
|--------|----------|----------|
| GET | `/api/clubs/{clubId}/calendar-events` | `source` 필드 추가 |
| GET | `/api/clubs/name/{clubName}/calendar-events` | `source` 필드 추가 |

---

## 2. OAuth 연동 플로우

### 2.1 인가 URL 요청

```typescript
// GET /api/integration/google/oauth/authorize?state={state}
const response = await api.get('/api/integration/google/oauth/authorize', {
  params: { state: 'your-csrf-state' }
});

// Response
{
  "statuscode": "200",
  "message": "success",
  "data": {
    "authorizeUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=..."
  }
}
```

### 2.2 Google 로그인 후 콜백 처리

사용자가 Google 로그인을 완료하면 설정된 redirect URI로 `code` 파라미터와 함께 리다이렉트됩니다.

```typescript
// 콜백 URL에서 code 추출
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const state = urlParams.get('state');

// state 검증 (CSRF 방지)
if (state !== savedState) {
  throw new Error('Invalid state');
}
```

### 2.3 토큰 교환

```typescript
// POST /api/integration/google/oauth/token
const response = await api.post('/api/integration/google/oauth/token', {
  code: code
});

// Response
{
  "statuscode": "200",
  "message": "success",
  "data": {
    "email": "user@gmail.com"
  }
}
```

### 2.4 캘린더 목록 조회

```typescript
// GET /api/integration/google/calendars
const response = await api.get('/api/integration/google/calendars');

// Response (Google Calendar API 형식 + 선택된 캘린더 정보)
{
  "statuscode": "200",
  "message": "success",
  "data": {
    "kind": "calendar#calendarList",
    "items": [
      {
        "id": "primary",
        "summary": "user@gmail.com",
        "primary": true,
        "accessRole": "owner"
      },
      {
        "id": "ko.south_korea#holiday@group.v.calendar.google.com",
        "summary": "대한민국의 휴일",
        "accessRole": "reader"
      }
    ],
    "selectedCalendarId": "primary",  // 현재 선택된 캘린더 ID (선택된 캘린더가 있을 경우)
    "selectedCalendarName": "user@gmail.com"  // 현재 선택된 캘린더 이름 (선택된 캘린더가 있을 경우)
  }
}
```

**주의**: `selectedCalendarId`와 `selectedCalendarName`은 사용자가 이미 캘린더를 선택한 경우에만 응답에 포함됩니다. 처음 연동한 경우에는 포함되지 않습니다.

### 2.5 캘린더 선택

```typescript
// POST /api/integration/google/calendars/{calendarId}/select
const response = await api.post(`/api/integration/google/calendars/${encodeURIComponent(calendarId)}/select`, {
  calendarId: 'primary',
  calendarName: 'user@gmail.com'
});

// Response
{
  "statuscode": "200",
  "message": "success",
  "data": "캘린더가 선택되었습니다."
}
```

### 2.6 연결 해제

```typescript
// DELETE /api/integration/google/connection
const response = await api.delete('/api/integration/google/connection');

// Response
{
  "statuscode": "200",
  "message": "success",
  "data": "Google Calendar 연결이 해제되었습니다."
}
```

---

## 3. 캘린더 이벤트 응답 변경

### 기존 응답

```json
{
  "id": "event-1",
  "title": "동아리 정기 회의",
  "start": "2026-04-01",
  "end": "2026-04-01",
  "url": "https://notion.so/...",
  "description": "설명"
}
```

### 변경된 응답

```json
{
  "id": "event-1",
  "title": "동아리 정기 회의",
  "start": "2026-04-01",
  "end": "2026-04-01",
  "url": "https://notion.so/...",
  "description": "설명",
  "source": "NOTION"  // 또는 "GOOGLE"
}
```

### TypeScript 타입 정의

```typescript
interface ClubCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string | null;
  url: string | null;
  description: string | null;
  source: 'NOTION' | 'GOOGLE';  // 신규 필드
}
```

---

## 4. UI 구현 가이드

### 4.1 캘린더 연동 설정 페이지

```
┌─────────────────────────────────────────────────────┐
│  캘린더 연동 설정                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Notion Calendar                             │   │
│  │  ✅ 연동됨 - My Workspace                    │   │
│  │  [연결 해제]                                  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Google Calendar                             │   │
│  │  ❌ 연동되지 않음                             │   │
│  │  [Google 계정 연결]                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 캘린더 선택 모달

Google 연동 후 캘린더 선택 UI:

```
┌─────────────────────────────────────────────────────┐
│  연동할 캘린더를 선택하세요                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ○ user@gmail.com (기본)                            │
│  ○ 동아리 일정                                       │
│  ○ 대한민국의 휴일                                   │
│                                                     │
│                          [취소]  [선택 완료]         │
└─────────────────────────────────────────────────────┘
```

### 4.3 통합 캘린더 뷰

이벤트 출처 표시:

```
┌─────────────────────────────────────────────────────┐
│  4월 일정                                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  4월 1일 (월)                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟦 동아리 정기 회의        [Notion]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  4월 3일 (수)                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🟥 신입부원 면접           [Google]          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 4.4 출처별 색상/아이콘 제안

| Source | 색상 | 아이콘 |
|--------|------|--------|
| NOTION | 파란색 (#2196F3) | Notion 로고 또는 🟦 |
| GOOGLE | 빨간색 (#DB4437) | Google 로고 또는 🟥 |

---

## 5. 에러 처리

### 에러 코드

| 코드 | 설명 | 대응 |
|------|------|------|
| 960-1 | Google Calendar 설정 누락 | 관리자에게 문의 안내 |
| 960-2 | 토큰 교환 실패 | 다시 연동 시도 안내 |
| 960-3 | 토큰 갱신 실패 | 재연동 필요 안내 |
| 960-4 | Google Calendar 미연결 | 연동 페이지로 안내 |
| 960-5 | 캘린더 미선택 | 캘린더 선택 안내 |
| 960-6 | Google API 호출 실패 | 잠시 후 재시도 안내 |
| 960-7 | 동아리 정보 없음 | 동아리 등록 필요 안내 |

### 에러 처리 예시

```typescript
try {
  await api.post('/api/integration/google/oauth/token', { code });
} catch (error) {
  if (error.response?.data?.code === '960-2') {
    toast.error('Google 연동에 실패했습니다. 다시 시도해주세요.');
    // 연동 페이지로 리다이렉트
  }
}
```

---

## 6. 체크리스트

### 필수 구현

- [ ] Google OAuth 연동 플로우 (authorize → callback → token exchange)
- [ ] 캘린더 목록 조회 및 선택 UI
- [ ] 연결 해제 기능
- [ ] 캘린더 이벤트에 `source` 필드 표시
- [ ] 에러 핸들링 및 사용자 피드백

### 권장 구현

- [ ] 연동 상태 표시 (Notion/Google 각각)
- [ ] 출처별 색상/아이콘 구분
- [ ] 연동 설정 페이지에서 두 캘린더 관리
- [ ] OAuth state 파라미터로 CSRF 방지

### 테스트 시나리오

1. Google 계정 연동 → 캘린더 선택 → 이벤트 표시
2. Notion + Google 동시 연동 → 통합 이벤트 목록 확인
3. Google 연결 해제 → Notion 이벤트만 표시
4. 토큰 만료 시 자동 갱신 확인 (백엔드에서 처리)

---

## 7. 참고 사항

### Redirect URI 설정

프론트엔드 배포 환경에 맞는 redirect URI를 백엔드팀에 전달해주세요:

- 개발: `http://localhost:3000/callback/google`
- 스테이징: `https://staging.moadong.com/callback/google`
- 프로덕션: `https://moadong.com/callback/google`

### calendarId 인코딩

`calendarId`에 특수문자(`@`, `#` 등)가 포함될 수 있으므로 URL에 포함 시 반드시 인코딩하세요:

```typescript
const encodedId = encodeURIComponent(calendarId);
await api.post(`/api/integration/google/calendars/${encodedId}/select`, ...);
```

### 이벤트 정렬

백엔드에서 이미 `start` 기준으로 오름차순 정렬하여 반환합니다. 추가 정렬이 필요하면 프론트엔드에서 처리하세요.
