# Mixpanel MCP 관리자 주간 리포트 고정 프롬프트 세트

## 목적

- 관리자(Admin) 사용 흐름을 주 단위로 모니터링한다.
- 설정/수정 관련 행동 데이터를 표준 템플릿으로 축적한다.

## 운영 원칙

- 기간은 항상 `지난주 (월요일 00:00 ~ 일요일 23:59, KST)`로 고정한다.
- 비교 기준은 항상 `직전 주`로 고정한다.
- 관리자 이벤트에는 "클릭" 위주 이벤트가 많으므로, 저장 성공/실패는 별도 백엔드 로그와 함께 해석한다.
- 이벤트명은 2026-10-05부터 쌓인 새 이름 기준이다. 페이지 방문·체류는 `Page Viewed`·`Page Left` 하나씩이고 페이지는 `page_name` 속성으로 구분한다. 그 전 주를 조회할 때는 `frontend/docs/features/analytics/mixpanel-event-rename-map.md`의 옛 이름을 쓴다.
- 결과는 아래 "리포트 템플릿" 순서로 정리한다.

## 고정 프롬프트 8개 (moadong ADMIN_EVENT 치환)

1. `지난주(월~일, Asia/Seoul) 관리자 핵심 KPI를 보여줘. 다음 이벤트를 기준으로 유저 수와 이벤트 수를 각각 보여줘: "Page Viewed"(page_name=admin_login), "Login Button Clicked", "Admin Tab Clicked", "Club Update Button Clicked", "Recruitment Update Button Clicked", "Club Photo Upload Button Clicked", "Password Change Button Clicked". 직전 주 대비 증감률(%) 포함.`

2. `지난주 관리자 진입 퍼널을 보여줘: "Page Viewed"(page_name=admin_login) -> "Login Button Clicked" -> "Page Viewed"(page_name=admin_club_info_edit, 또는 admin_login을 뺀 다른 admin_* page_name). 단계별 전환율/이탈률과 직전 주 대비 변화를 계산해줘.`

3. `지난주 사이드바 탭 이동 패턴을 분석해줘. "Admin Tab Clicked" 이벤트의 tab_name 속성 기준으로 탭별 클릭 수, 유저 수, 전주 대비 증감을 표로 보여줘.`

4. `지난주 동아리 기본 정보 수정 관련 행동을 요약해줘: "Club Update Button Clicked"(section 속성으로 info/intro 구분), "Club Tag Selected", "Input Cleared"(field=club_tag), "Input Cleared"(field=club_sns_link). 이벤트별 유저 수/이벤트 수와 전주 대비 변화 포함.`

5. `지난주 모집 정보 수정 관련 행동을 요약해줘: "Recruitment Update Button Clicked", "Always Open Recruitment Button Clicked", "Markdown Preview Button Clicked". 이벤트별 추세와 함께 보여줘.`

6. `지난주 이미지 자산 편집 행동을 비교해줘: "Club Cover Upload Button Clicked", "Club Cover Reset Button Clicked", "Club Logo Upload Button Clicked", "Club Logo Reset Button Clicked", "Club Photo Upload Button Clicked", "Club Photo Delete Button Clicked". 업로드/초기화/삭제 비율도 계산해줘.`

7. `지난주 계정 보안 관련 행동을 보여줘: "Password Change Button Clicked", "Input Cleared"(field=new_password), "Input Cleared"(field=confirm_password). 전주 대비 증감과 이상 패턴(초기화 클릭 과다 등)을 코멘트해줘.`

8. `위 1~7 결과를 바탕으로 이번 주 관리자 UX 개선 액션 3개를 제안해줘. 각 액션마다 목표 KPI, 기대효과, 검증방법(A/B 또는 관찰지표), 우선순위를 포함해줘.`

## 리포트 템플릿 (복붙용)

```md
# 관리자 주간 리포트 (YYYY-W##)

## 1) 한 줄 요약

-

## 2) KPI 스냅샷 (지난주 vs 직전 주)

- Page Viewed, page_name=admin_login (users/events):
- Login Button Clicked (users/events):
- Admin Tab Clicked (users/events):
- Club Update Button Clicked (users/events):
- Recruitment Update Button Clicked (users/events):
- Club Photo Upload Button Clicked (users/events):
- Password Change Button Clicked (users/events):

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

- 실제 운영 탭 이름 확인: `Admin Tab Clicked`의 `tab_name` 속성 값
- 수정 성공 지표 보강 여부 결정: 클릭 이벤트 외 백엔드 성공 로그 연동
- 관리자 계정 식별 기준 확정 (distinct_id 또는 사용자 속성)
- 페이지 체류 지표 활용 여부 결정 (`Page Left`의 `page_name`: `admin_login`, `admin_club_info_edit` 등)

## 실행 순서 권장

1. 프롬프트 1~7 실행 후 사실 데이터 확정
2. 프롬프트 8 실행으로 액션 도출
3. 템플릿에 결과 이관 후 팀 공유
