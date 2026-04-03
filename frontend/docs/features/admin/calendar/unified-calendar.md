# 통합 캘린더 — Google과 Notion 이벤트를 하나의 UI에 표시

Google Calendar와 Notion 캘린더 페이지를 하나의 통합 캘린더 UI에 동시에 표시하는 기능입니다. 각 소스의 이벤트를 색상으로 구분하고, 독립적으로 표시 여부를 제어할 수 있습니다.

## 주요 기능

- Google Calendar 이벤트와 Notion 페이지를 하나의 캘린더에 통합 표시
- 출처별 색상 구분 (파란색=Google, 보라색=Notion)
- 각 소스별 독립적인 표시 토글 기능
- 날짜별 자동 정렬 및 그룹화

## 아키텍처

### 데이터 흐름

```text
Google API → fetchGoogleCalendarEvents() → GoogleCalendarEvent[]
                                                    ↓
                                           convertGoogleEventToUnified()
                                                    ↓
                                          UnifiedCalendarEvent[] ←
                                                    ↑
                                           convertNotionEventToUnified()
                                                    ↑
Notion API → fetchNotionPages() → NotionSearchItem[] → NotionCalendarEvent[]
```

### 타입 정의

**UnifiedCalendarEvent** (`src/utils/calendarSyncUtils.ts`)

```typescript
interface UnifiedCalendarEvent {
  id: string; // "google-{id}" 또는 "notion-{id}" 형식
  title: string;
  start: string; // ISO 8601 형식
  dateKey: string; // YYYY-MM-DD 형식
  end?: string;
  url?: string;
  source: 'GOOGLE' | 'NOTION';
  description?: string;
}
```

### Hooks 계층

```
useCalendarSync (통합)
    ├── useGoogleCalendarData (Google 데이터)
    │   └── googleCalendarEvents: GoogleCalendarEvent[]
    ├── useNotionCalendarData (Notion 데이터)
    │   └── notionItems: NotionSearchItem[]
    ├── useNotionCalendarUiState (Notion 전용 UI)
    │   └── notionCalendarEvents: NotionCalendarEvent[]
    └── useUnifiedCalendarUiState (통합 UI) ★
        ├── allUnifiedEvents: UnifiedCalendarEvent[]
        ├── visibleUnifiedEvents: UnifiedCalendarEvent[]
        └── eventsByDate: Record<string, UnifiedCalendarEvent[]>
```

## 관련 코드

- `src/types/google.ts` — GoogleCalendarEvent 타입 정의
- `src/utils/calendarSyncUtils.ts` — UnifiedCalendarEvent 타입 및 변환 함수
- `src/apis/calendarOAuth.ts` — fetchGoogleCalendarEvents API 함수
- `src/pages/AdminPage/tabs/CalendarSyncTab/hooks/useGoogleCalendarData.ts` — 구글 캘린더 이벤트 자동 로드
- `src/pages/AdminPage/tabs/CalendarSyncTab/hooks/useUnifiedCalendarUiState.ts` — 통합 캘린더 UI 상태 관리
- `src/pages/AdminPage/tabs/CalendarSyncTab/hooks/useCalendarSync.ts` — 통합 데이터 제공
- `src/pages/AdminPage/tabs/CalendarSyncTab/CalendarSyncTab.tsx` — 통합 캘린더 UI 렌더링
- `src/pages/AdminPage/tabs/CalendarSyncTab/CalendarSyncTab.styles.ts` — 출처별 색상 스타일

## 구현 세부사항

### ID 충돌 방지

Google과 Notion에서 같은 ID가 올 수 있으므로, prefix를 추가하여 구분합니다:

- Google 이벤트: `google-{originalId}`
- Notion 이벤트: `notion-{originalId}`

### 날짜 파싱

`parseDateKey()` 함수로 다양한 날짜 형식을 `YYYY-MM-DD` 키로 정규화:

- 순수 날짜 (`YYYY-MM-DD`): 그대로 반환
- ISO 8601 datetime: UTC 기준으로 파싱하여 날짜 추출

### 자동 이벤트 로드

선택된 Google 캘린더가 변경되면 자동으로 이벤트를 로드합니다:

```typescript
useEffect(() => {
  if (selectedCalendarId && isGoogleConnected) {
    loadGoogleCalendarEvents(selectedCalendarId);
  }
}, [selectedCalendarId, isGoogleConnected]);
```

### 출처별 색상

styled-components의 `$source` prop으로 출처에 따라 다른 배경색 적용:

- `GOOGLE`: `#dbeafe` (파란색)
- `NOTION`: `#f3e8ff` (보라색)
