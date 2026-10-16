# 주간 리포트 (2026-W12)

## 1) 한 줄 요약

- 트래픽(Main/Detail) 감소와 중후반 퍼널(Detail→Apply, Apply→Form) 전환 저하가 겹치며 제출 유저가 전주 대비 크게 감소했다.

## 2) KPI 스냅샷 (지난주 vs 직전 주)

- MainPage Visited (users): `822` vs `1,287` (`-36.1%`)
- ClubDetailPage Visited (users): `531` vs `893` (`-40.5%`)
- ApplicationFormPage Visited (users): `8` vs `55` (`-85.5%`)
- Application Form Submitted (events/users): `11 / 3` vs `34 / 33` (`-67.6% / -90.9%`)
- D1/D7 재방문율 (ClubCard Clicked cohort): `36% / 6%` (4주 추세 하락)

## 3) 핵심 변화 3가지

1. 퍼널 절대 볼륨 하락: `Main 822 → Card 483 → Detail 133 → Apply 18 → Form 2 → Submit 1`
2. 단계 전환 하락: `Detail→Apply 14%`(전주 `19%`), `Apply→Form 11%`(전주 `18%`)
3. 제출 표본 급감: 제출 유저 `33 → 3`로 감소, 채널/플랫폼별 해석 표본 부족

## 4) 원인 가설

- 상단 유입 감소(Main/Detail 동반 하락) + 지원 직전 구간 UX/정보 전달 부족이 동시 발생.
- 이벤트 스키마 결측(`Club Apply Button Clicked`의 `club_id/club_name=undefined`)으로 클럽별 병목 탐지가 막혀, 최적화 속도가 느려짐.
- 리텐션 추세(최근 4주) 하락으로 재방문 모수 자체가 줄어든 상태.

## 5) 이번 주 액션 3개

1. 액션: `Club Apply Button Clicked`에 `club_id`, `club_name` 필수 전송
   목표 KPI: 클럽별 `Apply→Form` 관측 가능률 `100%`
   기대효과: 병목 클럽 정확 식별
   검증방법: 다음 주 리포트에서 `undefined` 비중 0% 확인
   우선순위: `P0`
2. 액션: ClubDetail 지원 CTA/가이드 개선(마감, 지원 조건, 외부폼 안내 즉시 노출)
   목표 KPI: `Detail→Apply` 전환율 `+3%p`
   기대효과: 중간 퍼널 회복
   검증방법: A/B 테스트 또는 주차 비교
   우선순위: `P1`
3. 액션: ApplicationForm 이탈 방지(필수문항 즉시 표시, 에러메시지 개선, 임시저장 명확화)
   목표 KPI: `Apply→Form`, `Form→Submit` 개선
   기대효과: 제출 유저 회복
   검증방법: 단계 전환율 주간 추적
   우선순위: `P1`

## 6) 리스크 / 확인 필요

- 채널 분석은 `undefined` 비중이 높아 정밀 해석 제한.
- 플랫폼별 제출 표본이 3명으로 매우 작아 결론 신뢰도 낮음.
- `Apply→Form` 클럽별 하위 10은 이벤트 속성 누락으로 산출 불가 (우선 스키마 수정 필요).
