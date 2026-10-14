# 백엔드 AI 자동 리뷰 규칙

## 목적

CodeRabbit이 Spring Boot 백엔드 변경을 검토할 때 형식적인 스타일 의견보다 인증·권한, API 계약, 데이터 일관성, 외부 연동 실패와 테스트 누락처럼 운영에 영향을 주는 문제를 우선 발견한다.

## 적용 범위

규칙은 루트 `.coderabbit.yaml`의 `reviews.path_instructions`에 정의한다. `backend/` 경로에만 추가 지침이 적용되므로 프론트엔드 리뷰 기준은 변경하지 않는다.

## 리뷰 정책

| 대상 | 중점 검토 항목 |
| --- | --- |
| Controller | 인증·권한, 요청 검증, Response/ErrorCode 기반 API 계약, 계층 분리 |
| Service | 트랜잭션, 데이터 일관성, null/Optional 안전성, 무제한 조회·N+1·반복 원격 호출 |
| Adapter 및 외부 연동 | timeout·실패 처리, 상태 코드 검증, 재시도 중복 부작용, 민감 정보 노출 |
| Global config/util | Spring Security, JWT 필터, CORS/CSRF, 비밀값과 fail-open 설정 |
| Gradle | Java 17/Spring Boot 3.3 호환성, 의존성·저장소 위험, 테스트 태스크 유지 |
| Test | 성공·실패·권한 경계, 비결정적 테스트 방지 |

## 코멘트 기준

1. 실제 보안 취약점, 장애, 데이터 손실, API 호환성 손상 또는 테스트 신뢰성 저하로 이어지는 경우에만 코멘트한다.
2. 기존 코드에 이미 존재한다는 사실만으로 변경 라인에 새 결함이 생기지 않은 경우는 코멘트하지 않는다.
3. 네이밍·서식·선호 스타일만의 차이는 코멘트하지 않는다.
4. 불확실한 경우에는 재현 조건과 영향 범위를 함께 제시하고 단정하지 않는다.

## 검증

1. `.coderabbit.yaml`의 경로별 지침은 CodeRabbit 공식 `reviews.path_instructions` 형식을 따른다.
2. 변경은 리뷰 설정과 Markdown 문서뿐이며, 애플리케이션 런타임 동작과 테스트 실행 결과에는 영향을 주지 않는다.
