# 2026 대동제 버스킹 시간표 페이지

4일간 진행되는 버스킹 공연 시간표를 제공하는 페이지. 날짜 네비게이션 방식을 A/B 테스트로 검증한다.

## 라우트

`/festival-busking` → `BuskingPage`

## 페이지 구조

```
BuskingPage
├── DayTabsNav (variant: 'tabs')     — UnderlineTabs로 날짜 4개 탭
├── DayArrowsNav (variant: 'arrows') — ‹ 날짜 › 화살표 네비게이션
└── PerformanceList                  — 날짜별 공연 목록 (공통 컴포넌트)
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

- `performances: []`인 날짜는 자동으로 탭/화살표에서 제외
- 오늘 날짜가 축제 기간이면 해당 날짜로 자동 진입

## 관련 코드

- `src/pages/FestivalPage/BuskingPage/BuskingPage.tsx` — 메인 페이지, 실험 분기 및 이벤트 트래킹
- `src/pages/FestivalPage/components/DayTabsNav/DayTabsNav.tsx` — tabs variant
- `src/pages/FestivalPage/components/DayArrowsNav/DayArrowsNav.tsx` — arrows variant
- `src/pages/FestivalPage/data/buskingDays.ts` — 4일치 공연 데이터
- `src/pages/FestivalPage/components/PerformanceList/PerformanceList.tsx` — `performances`, `festivalDate` props 지원 (기존 IntroductionPage와 공유)
- `src/pages/FestivalPage/components/PerformanceCard/PerformanceCard.tsx` — `songs: []`이면 "🎵 추후 공개 예정" 표시
