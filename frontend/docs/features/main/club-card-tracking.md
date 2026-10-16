# ClubCard 뷰 트래킹

ClubCard 컴포넌트의 Mixpanel 인상(impression) 트래킹 구현.

## 동작 방식

IntersectionObserver(threshold 50%)로 카드 진입/이탈을 감지한다.

- **진입 시**: `intersectStart`, `capturedTop`, `capturedScrollY` 기록. cooldown(2s) 이내 재진입은 무시.
- **이탈 시**: `fireImpressionEvent()` 호출 → `CLUB_CARD_VIEWED` 이벤트 발화.
- **탭 전환/종료 시**: `visibilitychange` 이벤트로 동일하게 처리.
- **언마운트 시**: cleanup에서 `fireImpressionEvent()` 호출.

## sessionStorage 구조

```text
clubcard_last_{page}_{clubId}   → 마지막 이벤트 발화 시각 (cooldown 판단용)
clubcard_count_{page}_{clubId}  → 탭 세션 내 누적 view_count
```

키에 `page`를 포함해 같은 카드가 여러 페이지에 렌더링돼도 독립 집계한다.

## CLUB_CARD_VIEWED 이벤트 프로퍼티

| 프로퍼티 | 설명 |
|----------|------|
| `club_id` / `club_name` | 카드 식별자 |
| `recruitment_status` | 모집 상태 |
| `page` | 렌더링된 페이지 |
| `scroll_y` | 진입 시점 스크롤 위치 |
| `card_top_in_viewport` | 진입 시점 카드 상단 좌표(px) |
| `dwell_ms` | 실제 체류 시간 (진입 → 이탈) |
| `view_count` | 탭 세션 내 누적 조회 횟수 |
| `reentry_count` | `view_count - 1` (재방문 횟수) |
| `device_type` | 디바이스 타입 |

## 관련 코드

- `src/pages/MainPage/components/ClubCard/ClubCard.tsx` — 트래킹 구현
- `src/constants/eventName.ts` — `CLUB_CARD_VIEWED`, `CLUB_CARD_CLICKED`, `BANNER_NAVIGATION_CLICKED`
