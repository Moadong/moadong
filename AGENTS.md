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

## 착수 전 확인

여러 워크스페이스와 에이전트가 동시에 작업한다. 작업 트리가 깨끗하다고 해서 아무도 손대지 않았다는 뜻이 아니다.

- 구현을 시작하기 전에 열린 PR과 최근 머지를 먼저 확인한다. `gh pr list --state open`, `gh pr list --state merged --limit 20`, `git fetch origin && git log origin/develop-fe -20` (백엔드는 `origin/develop/be`). fetch를 건너뛰면 오래된 로컬 ref를 보게 되어 확인한 의미가 없다.
- 관련 레포가 여러 개면 각각 확인한다. 이 저장소 외에 앱은 `Moadong/moadong-react-native`에 있다.
- `git worktree list`로 다른 워크스페이스가 같은 작업을 진행 중인지 본다.
- 이미 올라온 작업과 겹치면 구현하지 말고 그 사실을 먼저 알린다. 접근이 다르면 어떻게 다른지 비교해서 전달한다.

## 작업 원칙

- 기존 구조와 패턴을 먼저 따르고, 필요가 명확할 때만 새 패턴을 추가한다.
- 변경 범위는 가능한 한 작게 유지한다.
- 기능 변경과 대규모 리팩터링을 한 번에 섞지 않는다.
- 학생용 흐름과 관리자용 흐름에 공통으로 영향을 주는 수정은 양쪽 화면을 함께 의식한다.
- API 계약을 바꾸는 수정은 프론트와 백엔드 영향 범위를 같이 확인한다.
- 프론트, 백엔드, 앱 중 둘 이상에 걸치는 변경은 코드부터 만들지 않는다. 레포별로 무엇이 필요한지, 어떤 순서로 배포해야 하는지, 순서를 어기면 무슨 일이 생기는지를 먼저 정리해 판단을 받는다. 구현이 이미 끝난 상태로 보고하면 결정할 사항이 완료 보고처럼 보이고, 되돌리는 비용이 생긴다.

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
- "영향 없다", "회귀 없다", "배포 순서 제약 없다" 같은 단정은 근거의 축이 질문과 같은지 확인한 뒤에만 쓴다. 하위 호환이 지켜지는 것과 데이터가 보존되는 것은 다른 축이고, 컴파일이나 테스트 통과가 시나리오 커버를 뜻하지도 않는다. 확신이 없으면 조건을 붙여 말한다.

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
