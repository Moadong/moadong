# harry 백엔드 리뷰 기준

`backend/` 아래 파일이 바뀐 PR에 `.github/harry-review-rules.md`와 함께 적용해요.
페르소나·말투·출력 형식과 주석·보안(공통) 기준은 그 파일을 따라요.

## 지적 기준

- 실제 보안 취약점, 장애, 데이터 손실, API 호환성 손상, 테스트 신뢰성 저하, 운영 성능·확장성 저하로 이어질 때만 지적해요.
  단, 아래 「계층·패키지」와 공통 「주석」 기준은 이 조건과 상관없이 적용해요.
- 기존 코드에 이미 있던 문제는 이번 변경이 새 결함을 만들지 않았으면 지적하지 않아요.
- 네이밍·서식·선호 스타일만의 차이는 지적하지 않아요.
- 확신이 없으면 재현 조건과 영향 범위를 함께 적고 단정하지 않아요.

## 계층·패키지

- controller / service / repository / dto(payload) 역할을 한 클래스에 섞으면 지적해요.
- 도메인 패키지 구성을 벗어나면 지적해요.
- 파일 업로드 / 알림 / 실시간 이벤트처럼 부작용이 있는 로직은 영향 범위를 확인했는지 봐요.

## Controller (`**/controller/**`)

- 인증이 필요한 엔드포인트가 공개되지 않았는지, 학생·관리자 권한 경계가 `SecurityConfig`·`@PreAuthorize`·`@CurrentUser`
  (`@AuthenticationPrincipal`) 사용과 맞는지 봐요.
- 외부 입력은 `@Valid`와 Bean Validation으로 검증해요. 요청 DTO가 없거나 검증을 우회하는 변경은
  실제로 잘못된 요청을 허용할 때만 지적해요.
- 컨트롤러는 HTTP 요청·응답 조립만 해요. Repository나 외부 시스템을 직접 부르거나 도메인 규칙을 구현하면 지적해요.
- 기존 `Response` 응답 형식과 `RestApiException`/`ErrorCode` 예외 처리 규약을 깨는 API 계약 변경을 지적해요.

## Service (`**/service/**`)

- 엔티티를 바꾸고 저장하는 쓰기 유스케이스의 트랜잭션 경계, 실패 시 데이터 일관성, 중복 요청에 안전한지 봐요.
- `Optional.get()`, nullable 외부 응답, 비어 있는 인증 주체처럼 확인하지 않은 값 때문에 500 오류나
  데이터 손실이 날 수 있으면 지적해요.
- 목록·검색 API의 무제한 조회, N+1 조회, 요청마다 반복되는 원격 호출처럼 운영에서 확장성 문제를 만드는 변경을 지적해요.

## 외부 연동 (`fcm/adapter`, `calendar/google`·`calendar/notion`, `analytics`, `media`, `anthropic`·`gemma` 등)

- HTTP, S3/R2, Firebase, RabbitMQ 같은 외부 연동은 timeout·실패 처리, 상태 코드 검증,
  재시도 때 부작용이 중복되는지, 민감 정보가 노출되는지 봐요.
- DB 트랜잭션 안에서 되돌릴 수 없는 외부 부작용을 일으키는데 보상이나 실패 처리 전략이 없으면 지적해요.
- 액세스 토큰, refresh token, API 키, 사용자 식별자, 원본 파일 URL을 로그·응답에 불필요하게 남기면 지적해요.

## 공통 설정·유틸 (`global/config`, `global/util`)

- Spring Security matcher, JWT 필터 순서, CORS/CSRF, 비밀번호 인코더 변경이 관리자·학생 인증 흐름을
  우회하거나 약화하지 않는지 봐요.
- 비밀값을 코드에 하드코딩하지 않고 환경별 주입 방식을 유지해야 해요. 운영에서 불안정한 기본값이나
  fail-open 동작만 지적해요.

## Gradle (`backend/build.gradle`)

- 의존성 추가·업데이트가 Spring Boot 3.3, Java 17과 호환되는지, snapshot/milestone 저장소나
  취약한 의존성 범위를 들여오지 않는지 봐요.
- 테스트 태스크(`unitTest`, `integrationTest`, `test`)의 태그 구분과 RabbitMQ 리스너 비활성화 설정을 깨면 지적해요.

## 테스트 (`backend/src/test/**`)

- 바뀐 동작의 성공·실패·권한 경계를 검증하는지 봐요. 실제 프로덕션 버그를 놓칠 수 있는 누락만 지적해요.
- 테스트가 외부 네트워크, 현재 시간, 실행 순서, 공유 상태에 기대 비결정적이 되면 지적해요.
