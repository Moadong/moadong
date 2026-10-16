# 날짜 칸 클릭과 일정 모달 레이아웃

관리자 월간 캘린더에서 일정 모달을 여는 클릭 영역과, 모달 내부 스크롤 구조에 대한 문서입니다.

## 날짜 칸 전체 클릭

기존에는 날짜 숫자(`DayNumberCell` 버튼, 30px)만 클릭 대상이라 칸의 빈 공간을 눌러도 모달이 열리지 않았습니다. 주(week) 영역 전체를 덮는 투명 클릭 레이어를 깔아 해결합니다.

```text
Week (position: relative)
 ├── DayHitRow   (position: absolute; inset: 0, 7칸 그리드) ← 클릭 담당
 ├── DayNumberRow (position: relative; pointer-events: none)
 └── EventLayer   (position: relative; pointer-events: none)
      └── EventBar (pointer-events: auto)  ← 막대 클릭은 그대로 유지
```

- `DayHitRow`의 `grid-template-columns`와 `gap`은 `DayNumberRow`·`EventLayer`와 동일하게 맞춰, 누른 위치와 열리는 날짜가 항상 일치합니다. 칸 사이 8px 거터는 클릭 대상에서 제외됩니다.
- `inset: 0`이 `Week`의 `padding: 8px 0`까지 덮으므로 주 사이에 죽은 영역이 없습니다.
- `EventLayer`는 `pointer-events: none`, 막대만 `auto`이므로 막대 사이 빈 공간 클릭은 뒤의 날짜 셀로 전달됩니다.
- `DayHitCell`은 내용이 없는 버튼이라 `aria-label`로 날짜를 제공합니다 (`3월 10일 (화) 일정`).

## 일정 모달 레이아웃

`DayEventsModal`은 일정 개수와 무관하게 높이가 고정됩니다.

- `Body`: `height: 360px` + `overflow: hidden`. `max-height: calc(100dvh - 120px)`는 낮은 뷰포트 가드로 함께 둡니다.
- `EventList`: `flex: 1; min-height: 0; overflow-y: auto` — 일정이 많아지면 목록만 스크롤되고 날짜 헤더와 추가 버튼은 고정됩니다.
- `AddButton`: `flex-shrink: 0` — 목록이 넘칠 때 52px 높이가 눌리지 않게 합니다.
- `Empty`: `flex: 1` + flex 중앙 정렬 — 일정이 없을 때 문구가 빈 영역 중앙에 표시됩니다.

## 관련 코드

- `src/pages/AdminPage/tabs/CalendarSyncTab/components/CalendarBoard/CalendarBoard.tsx` — 주별 클릭 레이어 렌더링
- `src/pages/AdminPage/tabs/CalendarSyncTab/components/CalendarBoard/CalendarBoard.styles.ts` — `DayHitRow`/`DayHitCell`, `pointer-events` 레이어링
- `src/pages/AdminPage/tabs/CalendarSyncTab/components/DayEventsModal/DayEventsModal.styles.ts` — 고정 높이·내부 스크롤 구조
