# Mixpanel 리포팅 문서 인덱스

## 개요

moadong에서 Mixpanel MCP로 주간 리포트를 만들 때 사용하는 문서 모음이다.

## 문서 바로가기

- 사용자(학생) 흐름 리포트: [mixpanel-weekly-report-prompts.md](/Users/seokyoung-won/Desktop/moadong/docs/mixpanel-weekly-report-prompts.md)
- 관리자(Admin) 흐름 리포트: [mixpanel-admin-weekly-report-prompts.md](/Users/seokyoung-won/Desktop/moadong/docs/mixpanel-admin-weekly-report-prompts.md)

## 최근 주간 리포트

- 2026-W12 사용자 리포트: [2026-W12-user-mixpanel-report.md](/Users/seokyoung-won/Desktop/moadong/docs/weekly-reports/2026-W12-user-mixpanel-report.md)

## 주간 실행 순서

1. Mixpanel MCP 연결 상태 확인
   - `codex mcp list`
2. 사용자 리포트 실행
   - `docs/mixpanel-weekly-report-prompts.md`의 고정 프롬프트 1~8 순서대로 실행
3. 관리자 리포트 실행
   - `docs/mixpanel-admin-weekly-report-prompts.md`의 고정 프롬프트 1~8 순서대로 실행
4. 각 템플릿에 결과 이관 후 팀 공유

## 운영 규칙

- 기간 기준 고정: `지난주 (월요일 00:00 ~ 일요일 23:59, KST)`
- 비교 기준 고정: `직전 주`
- 이벤트 누락/속성 불일치 시 추정하지 않고 리스크로 명시

## 업데이트 규칙

- 신규 이벤트 추가 시, 먼저 `frontend/src/constants/eventName.ts`를 기준으로 이벤트명을 확인한다.
- 이벤트/속성 변경 시 사용자 문서와 관리자 문서를 함께 갱신한다.
- 퍼널 정의가 바뀌면 템플릿 KPI 항목도 함께 수정한다.
