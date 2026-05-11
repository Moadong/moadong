# 2026 대동제 버스킹 시간표 페이지

4일간 진행되는 버스킹 공연 시간표를 제공하는 페이지. 날짜 네비게이션 방식을 A/B 테스트로 검증한다.

## 라우트

`/festival-busking` → `BuskingPage`

## 페이지 구조

```
BuskingPage
├── DayTabsNav (variant: 'tabs')     — UnderlineTabs로 날짜 탭
├── DayArrowsNav (variant: 'arrows') — ‹ 날짜 › 화살표 네비게이션
├── SectionLabel "동아리 공연"        — 두 섹션 모두 있을 때만 표시
├── PerformanceList (performances)   — 동아리 공연 목록
├── SectionLabel "🎤 아티스트 공연"
└── PerformanceList (mainStagePerformances, hideSongs) — 아티스트 공연 목록
    └── TimelineRow + PerformanceCard
```

## A/B 실험

| 항목      | 내용                        |
| --------- | --------------------------- |
| 실험 키   | `festival_timetable_nav_v1` |
| Variant A | `tabs` — 날짜 4개 탭        |
| Variant B | `arrows` — 화살표 순차 이동 |
| 비율      | 50 : 50                     |

실험 정의: `src/experiments/definitions.ts` → `festivalTimetableNavExperiment`

## Mixpanel 이벤트

| 이벤트명                            | 트리거                  | 주요 속성                                          |
| ----------------------------------- | ----------------------- | -------------------------------------------------- |
| `2026-daedong 버스킹 시간표 페이지` | 페이지 진입             | —                                                  |
| `2026-daedong Day Changed`          | 날짜 전환               | `from_day`, `to_day`, `nav_variant`, `interaction` |
| `2026-daedong Day Duration`         | 날짜 이탈 / 페이지 이탈 | `day`, `nav_variant`, `duration_seconds`           |

`interaction` 값: `'click'` (버튼) / `'swipe'` (터치 제스처)

## 데이터

`src/pages/FestivalPage/data/buskingDays.ts` — `BUSKING_DAYS: FestivalDay[]`

- `performances: []`이고 `mainStagePerformances`도 없는 날짜는 탭/화살표에서 제외
- 오늘 날짜가 축제 기간이면 해당 날짜로 자동 진입
- `mainStagePerformances`: 동아리 공연 종료 후 진행되는 아티스트 공연 (Day1~4 모두 포함)

### 아티스트 공연 라인업

| 날짜 | 아티스트            |
| ---- | ------------------- |
| Day1 | YB                  |
| Day2 | 최예나, 이창섭      |
| Day3 | FIFTY FIFTY, 비와이 |
| Day4 | V.O.S, 청하         |

## 관련 코드

- `src/pages/FestivalPage/BuskingPage/BuskingPage.tsx` — 메인 페이지, 실험 분기 및 이벤트 트래킹
- `src/pages/FestivalPage/components/DayTabsNav/DayTabsNav.tsx` — tabs variant
- `src/pages/FestivalPage/components/DayArrowsNav/DayArrowsNav.tsx` — arrows variant
- `src/pages/FestivalPage/data/buskingDays.ts` — 4일치 공연 데이터 (`performances` + `mainStagePerformances`)
- `src/pages/FestivalPage/components/PerformanceList/PerformanceList.tsx` — `performances`, `festivalDate`, `hideSongs` props 지원
- `src/pages/FestivalPage/components/PerformanceCard/PerformanceCard.tsx` — `hideSongs`이면 곡목 영역 숨김, `songs: []`이면 "🎵 추후 공개 예정" 표시
