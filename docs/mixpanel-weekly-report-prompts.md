# Mixpanel MCP 주간 리포트 고정 프롬프트 세트

## 목적

- 매주 같은 기준으로 KPI를 조회하고, 비교와 해석을 일관되게 남긴다.
- 리포트 품질을 사람 숙련도에 의존하지 않고 템플릿으로 표준화한다.

## 운영 원칙

- 기간은 항상 `지난주 (월요일 00:00 ~ 일요일 23:59, KST)`로 고정한다.
- 비교 기준은 항상 `직전 주`로 고정한다.
- 지표가 비어 있거나 이벤트명이 불일치하면, 추정하지 말고 누락 항목으로 명시한다.
- 결과는 아래 "리포트 템플릿" 순서로 정리한다.

## 고정 프롬프트 8개 (moadong 이벤트명 1차 치환)

1. `지난주(월~일, Asia/Seoul) 핵심 KPI를 보여줘. 이벤트는 정확히 다음 기준으로 집계해줘: "MainPage Visited"(유저 수), "ClubDetailPage Visited"(유저 수), "ApplicationFormPage Visited"(유저 수), "Application Form Submitted"(이벤트 수/유저 수). 직전 주 대비 증감률(%)도 포함해줘.`

2. `지난주(월~일, Asia/Seoul) 지원 퍼널 전환율을 보여줘: "MainPage Visited" -> "ClubCard Clicked" -> "ClubDetailPage Visited" -> "Club Apply Button Clicked" -> "ApplicationFormPage Visited" -> "Application Form Submitted". 각 단계 전환율/이탈률과 직전 주 대비 변화를 함께 보여줘.`

3. `지난주 "ClubCard Clicked" 사용자 cohort 기준 D1, D7 재방문율을 보여줘. 재방문 기준 이벤트는 "MainPage Visited"로 계산하고, 최근 4주 추세를 표로 정리해줘.`

4. `지난주 유입 채널 성과를 비교해줘. "MainPage Visited"의 referrer 속성 기준으로 채널을 나누고, 각 채널별 "ClubCard Clicked", "Club Apply Button Clicked", "Application Form Submitted" 전환율을 계산해줘.`

5. `지난주 디바이스/플랫폼별 성과를 비교해줘. Mixpanel 기본 디바이스 속성($os, $browser)을 사용해서 "MainPage Visited" -> "Application Form Submitted" 전환율을 iOS/Android/Web 기준으로 정리해줘.`

6. `직전 주 대비 "Application Form Submitted" 변화 원인을 이벤트 기여도로 분해해줘. 후보 이벤트는 "MainPage Visited", "ClubCard Clicked", "Club Apply Button Clicked", "ApplicationFormPage Visited"로 제한하고 증가/감소 기여 Top 5를 해석해줘.`

7. `지난주 이탈 구간을 진단해줘. "Club Apply Button Clicked" 대비 "ApplicationFormPage Visited", "ApplicationFormPage Visited" 대비 "Application Form Submitted" 전환율을 클럽별(club_id 또는 club_name 속성)로 비교해서 하위 10개를 보여줘.`

8. `위 1~7 결과를 기반으로 이번 주 실행 액션 3개를 제안해줘. 각 액션마다 목표 KPI(예: "Application Form Submitted" 유저 수), 기대효과, 검증방법(A/B 또는 관찰지표), 우선순위를 포함해줘.`

## 리포트 템플릿 (복붙용)

```md
# 주간 리포트 (YYYY-W##)

## 1) 한 줄 요약

-

## 2) KPI 스냅샷 (지난주 vs 직전 주)

- MainPage Visited (users):
- ClubDetailPage Visited (users):
- ApplicationFormPage Visited (users):
- Application Form Submitted (events/users):
- D1/D7 재방문율 (ClubCard Clicked cohort):

## 3) 핵심 변화 3가지

1.
2.
3.

## 4) 원인 가설

-

## 5) 이번 주 액션 3개

1. 액션:
   목표 KPI:
   기대효과:
   검증방법:
   우선순위:
2. 액션:
   목표 KPI:
   기대효과:
   검증방법:
   우선순위:
3. 액션:
   목표 KPI:
   기대효과:
   검증방법:
   우선순위:

## 6) 리스크 / 확인 필요

-
```

## 커스터마이즈 체크리스트

- 사용자 핵심 이벤트 확정: `MainPage Visited`, `ClubCard Clicked`, `ClubDetailPage Visited`, `Club Apply Button Clicked`, `ApplicationFormPage Visited`, `Application Form Submitted`
- KPI 정의를 팀 문서와 일치시킴 (예: 제출 KPI를 이벤트 수로 볼지 유저 수로 볼지)
- 채널 분류 기준 확정 (`referrer` 우선, 필요 시 UTM 속성 추가 수집)
- 플랫폼 구분 기준 확정 (`$os`, `$browser` 사용 여부)
- 관리자 리포트를 별도로 운영할지 결정 (`로그인 버튼클릭`, `동아리 모집 정보 수정 버튼클릭` 등 ADMIN_EVENT 기반)

## 실행 순서 권장

1. 프롬프트 1~7 실행 후 사실 데이터 확정
2. 프롬프트 8 실행으로 액션 도출
3. 템플릿에 결과 이관 후 팀 공유
