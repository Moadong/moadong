# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드입니다.

## 빌드 및 테스트 명령어

```bash
# 빌드
./gradlew build

# 애플리케이션 실행
./gradlew bootRun

# 테스트
./gradlew test              # 전체 테스트
./gradlew unitTest          # 유닛 테스트만 (@UnitTest 태그)
./gradlew integrationTest   # 통합 테스트만 (@IntegrationTest 태그)

# 단일 테스트 클래스 실행
./gradlew test --tests "moadong.club.service.ClubServiceTest"

# 단일 테스트 메서드 실행
./gradlew test --tests "moadong.club.service.ClubServiceTest.testMethodName"
```

## 환경 설정

이 프로젝트는 Infisical을 사용하여 시크릿을 관리합니다. 로컬 실행 전 설정:

```bash
# Infisical CLI 설치
brew install infisical/get-cli/infisical

# 로그인 및 초기화
infisical login
infisical init

# dev 환경 시크릿 가져오기 (application.yml과 firebase.json 생성)
./gradlew setupDev
```

사용 가능한 환경: `setupDev`, `setupStaging`, `setupProd`

## 아키텍처

동아리 관리 플랫폼을 위한 Spring Boot 3.3.8 / Java 17 / MongoDB 백엔드.

### 모듈 구조

```
src/main/java/moadong/
├── club/           # 동아리 CRUD, 모집, 지원서
├── user/           # 인증, JWT, 프로필
├── calendar/notion/# 캘린더용 Notion OAuth 연동
├── fcm/            # Firebase 푸시 알림 (port/adapter 패턴 사용)
├── media/          # CloudFlare R2 파일 업로드, 이미지 리사이징
├── gemma/          # AI 연동 (Google Gemma)
├── sse/            # 실시간 업데이트용 Server-Sent Events
├── log/club/       # Javers를 활용한 감사 로깅
└── global/         # 공통 관심사: 설정, 보안, 예외, 유틸리티
```

### 주요 패턴

- **Repositories**: Spring Data MongoDB + 커스텀 쿼리 레포지토리 (예: `ClubSearchRepository`)
- **DTOs**: `payload/` 디렉토리에 Java record로 요청/응답 정의
- **Validation**: `global/validator/`에 커스텀 검증기 (Korean, PhoneNumber, UserId, Password)
- **에러 처리**: `GlobalExceptionHandler` + 약 99개의 사전 정의된 `ErrorCode` enum
- **응답 래퍼**: statuscode, message, data를 포함하는 `Response<T>` record
- **보안**: `JwtAuthenticationFilter`를 통한 JWT 인증, 민감 데이터용 AES 암호화 (`AESCipher`)
- **비동기**: 이벤트 기반 요약을 위한 RabbitMQ, 캐싱/pub-sub을 위한 Redis

### 테스트 컨벤션

- 유닛 테스트에는 `@UnitTest` 어노테이션 사용 (MockitoExtension 포함)
- 통합 테스트에는 `@IntegrationTest` 어노테이션 사용 (SpringBootTest 포함)
- 테스트 픽스처는 `src/test/java/moadong/fixture/`에 위치 (UserFixture, ClubFixture 등)

### 외부 서비스

- MongoDB Atlas (주 데이터베이스)
- Redis (캐싱, 세션)
- RabbitMQ (비동기 메시징)
- CloudFlare R2 / AWS S3 (파일 저장소)
- Firebase (FCM 푸시 알림)
- Notion API (캘린더 OAuth)
- Google Gemma (AI 기능)
