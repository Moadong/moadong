# AGENTS.md

## 목적

이 문서는 코딩 에이전트가 `moadong` 저장소에 들어왔을 때 바로 작업을 시작할 수 있도록 프로젝트 구조, 실행 방법, 코드 작성 규칙, 검증 방식, 협업 규칙을 전달하기 위한 가이드다.

## 프로젝트 구조

- 루트는 `frontend/`와 `backend/`로 나뉜다.
- 프론트엔드는 React + TypeScript + Vite 기반이다.
- 백엔드는 Spring Boot + Gradle 기반이다.

### 프론트엔드 주요 경로

- `frontend/src/pages/`
  - 라우트 단위 페이지
- `frontend/src/components/`
  - 공통 UI 컴포넌트
- `frontend/src/hooks/`
  - 재사용 훅
- `frontend/src/hooks/Queries/`
  - 서버 상태 조회 및 변경 훅
- `frontend/src/apis/`
  - API 호출 함수
- `frontend/src/store/`
  - 클라이언트 상태
- `frontend/src/styles/`
  - 전역 스타일 및 테마

### 백엔드 주요 경로

- `backend/src/main/java/moadong/`
  - 도메인별 패키지 루트
- `backend/src/main/java/moadong/global/`
  - 공통 설정, 예외, 유틸
- `backend/src/main/java/moadong/club/`
  - 동아리 관련 도메인
- `backend/src/main/java/moadong/user/`
  - 사용자 관련 도메인

## 개발 환경

### 프론트엔드

- 작업 경로: `/Users/seokyoung-won/Desktop/moadong/frontend`
- Node 버전: `frontend/.nvmrc` 기준
- 현재 확인된 버전: `22.12.0`
- 번들러: Vite
- 설정 파일: `frontend/config/vite.config.ts`

### 백엔드

- 작업 경로: `/Users/seokyoung-won/Desktop/moadong/backend`
- Java 버전: 17
- 빌드 도구: Gradle

## 빌드 및 테스트 명령어

### 프론트엔드

```bash
nvm use
npm install
npm run dev
npm run build
npm run test
npm run typecheck
```

### 백엔드

```bash
./gradlew bootRun
./gradlew test
./gradlew unitTest
./gradlew integrationTest
```

## 작업 원칙

- 기존 구조와 패턴을 먼저 따르고, 필요가 명확할 때만 새 패턴을 추가한다.
- 변경 범위는 가능한 한 작게 유지한다.
- 기능 변경과 대규모 리팩터링을 한 번에 섞지 않는다.
- 학생용 흐름과 관리자용 흐름에 공통으로 영향을 주는 수정은 양쪽 화면을 함께 의식한다.
- API 계약을 바꾸는 수정은 프론트와 백엔드 영향 범위를 같이 확인한다.

## 코드 스타일 규칙

### 프론트엔드

- 먼저 기존 페이지와 인접한 파일의 코드 스타일을 따른다.
- 데이터 패칭은 `frontend/src/hooks/Queries/`의 기존 패턴을 우선 재사용한다.
- API 호출은 `frontend/src/apis/`에 두고, 페이지나 컴포넌트 안에 직접 분산시키지 않는다.
- 공통 UI가 필요하면 `frontend/src/components/`에서 재사용 가능한지 먼저 확인한다.
- 타입이 필요하면 기존 타입 선언 위치와 네이밍 규칙을 따른다.

### 백엔드

- 도메인 패키지 구성을 유지한다.
- controller, service, repository, dto 또는 payload 역할을 섞지 않는다.
- 예외 처리와 검증은 기존 프로젝트 방식과 일관되게 맞춘다.
- 파일 업로드, 알림, 실시간 이벤트처럼 부작용이 있는 로직은 연관 기능까지 같이 확인한다.

## 검증 기준

- 수정 후에는 가능한 한 가장 좁은 범위의 검증부터 실행한다.
- 프론트 UI 수정이면 관련 페이지와 훅, 테스트 가능 여부를 먼저 확인한다.
- 공통 상태나 공통 컴포넌트 변경이면 영향 받는 페이지를 넓게 살핀다.
- 백엔드 수정이면 관련 테스트 태스크가 있는지 먼저 확인한 뒤 필요한 범위만 실행한다.
- 실행하지 못한 테스트가 있으면 결과 보고 시 명시한다.

## 소규모 보안 주의사항

- 비밀키, 토큰, 계정 정보, 민감 설정값을 코드나 문서에 직접 남기지 않는다.
- `.env`나 로컬 설정 파일을 새로 만들거나 수정할 때는 커밋 대상인지 반드시 확인한다.
- 사용자 입력은 신뢰하지 않고 검증 로직을 유지한다.
- 로그에 개인정보나 민감한 식별자를 과도하게 남기지 않는다.
- 인증, 파일 업로드, 외부 스토리지, 푸시, 메일 관련 변경은 영향 범위를 명확히 확인한다.

## 커밋 규칙

- 한글로 작성한다.
- 한 커밋은 하나의 목적을 가지도록 유지한다.
- 커밋 메시지는 짧고 명확하게 작성한다.
- 가능하면 변경 이유가 드러나는 동사를 사용한다.

예시:

```text
feat: 관리자 지원자 상태 변경 UI 추가
fix: 모집 종료일 검증 오류 수정
refactor: 지원서 조회 훅 분리
test: 지원 폼 유효성 검사 케이스 추가
```

## PR 작성 규칙

- 제목만 보고도 변경 목적을 이해할 수 있게 작성한다.
- 본문에는 최소한 다음 내용을 포함한다.
  - 변경 내용
  - 변경 이유
  - 검증 방법
  - 영향 범위
- UI 변경이면 가능하면 스크린샷 또는 화면 설명을 첨부한다.
- 학생용 화면 변경인지 관리자용 화면 변경인지 드러나게 적는다.

## 신규 멤버를 위한 메모

- 먼저 `README.md`를 읽고 서비스 맥락을 파악한다.
- 프론트엔드는 `frontend/package.json`, `frontend/src/pages/`, `frontend/src/hooks/Queries/`를 먼저 보면 구조 파악이 빠르다.
- 백엔드는 `backend/build.gradle`과 주요 도메인 패키지를 먼저 보면 된다.
- 처음 수정할 때는 넓은 리팩터링보다 작은 기능 단위로 진입하는 편이 안전하다.
- 운영 데이터나 배포 방식은 문서가 없으면 추측하지 말고 팀의 기존 절차를 확인한다.
