# 개발자 포털: 임의 동아리 외부폼 연결 + 지원기간 설정

작성일: 2026-07-21
브랜치: master-account-club-form-editor

## 목표

개발자(DEVELOPER) 계정으로 개발자 포털(`/dev`)에서 **임의 동아리**의:

1. **지원기간 설정** — 모집 시작/종료 (`ClubRecruitmentInformation.recruitmentStart/End`)
2. **외부 지원폼 연결** — 구글폼/네이버폼 등 외부 URL을 실제 지원 버튼에 연결

을 할 수 있게 한다. **자체 지원폼(질문 빌더)은 범위 밖.** 외부 URL 연결만.

## 배경 / 현황 (조사 결과)

- 개발자 포털 = `backend/src/main/resources/static/dev/index.html`. "동아리 관리" 탭에서 동아리 클릭 시 `edit.html?clubId=...` 팝업이 열림.
- `edit.html`은 이미 **모집 시작/종료(지원기간)**를 `PUT /api/admin/club/{clubId}/description` 로 저장한다. (동작함 — 구현 시 검증)
- `edit.html`의 "외부 지원 URL" 필드는 `ClubRecruitmentInformation.externalApplicationUrl`에 저장되지만, **실제 지원 버튼은 이 값을 쓰지 않는다.** `ClubDetailedResult`에 노출만 될 뿐이다.
- 실제 지원 버튼(`frontend .../ClubApplyButton.tsx`)은 **`ClubApplicationForm`**(status=ACTIVE)을 불러와, `formMode === EXTERNAL`이면 그 폼의 `externalApplicationUrl`로 이동한다.
- `ClubApplicationForm` 관리 API(`/api/club/application/**`, `ClubApplyAdminController`)는 전부 `@PreAuthorize("isAuthenticated()")` + `user.getClubId()` — **로그인한 본인 동아리만** 대상. 개발자가 clubId를 지정해 다른 동아리 폼을 만드는 엔드포인트가 **없음**. → 이것이 진짜 갭.

### 핵심 도메인 사실

- `ApplicationFormStatus`: `ACTIVE`(게시 중) / `PUBLISHED`(게시된 적 있음) / `UNPUBLISHED`(게시된 적 없음).
- **생성(`createApplicationForm`)은 status를 세팅하지 않아 기본 `UNPUBLISHED`** → 지원 버튼에 안 뜬다. 실제 연결하려면 생성 시 `ACTIVE`로 만들어야 한다.
- 공개 지원 목록 쿼리: `{'clubId': ?0, 'status': 'ACTIVE'}` (`ClubApplicationFormsRepository.findClubActiveFormsByClubId`).
- 외부 URL 허용 도메인은 엔티티(`ClubApplicationForm.updateExternalApplicationUrl`)에서 검증: `forms.gle`, `docs.google.com/forms`, `form.naver.com`, `naver.me`, `everytime.kr` → 구글폼·네이버폼 커버됨. 위반 시 `NOT_ALLOWED_EXTERNAL_URL`.
- 학기 유효성(`validateSemester`): 현재 학기 + 향후 2개 학기만 허용.

## 접근 방식: A (초경량)

"이 동아리에 외부폼 URL을 연결한다" 중심. 새 폼 생성 시 즉시 `ACTIVE`. 최소 엔드포인트 3개(목록/연결/삭제)만 추가.

- 이미 활성 폼이 여러 개면 지원 버튼에 선택 모달이 뜨는 것은 기존 동작 그대로 유지 (자동 비활성화하지 않음). 개발자가 목록에서 불필요한 폼을 삭제해 정리.

## 백엔드 변경

### 1) 새 관리자 엔드포인트 (DEVELOPER 전용, clubId 파라미터)

`ClubAdminController` (`/api/admin`)에 추가. `/api/admin/**`는 `SecurityConfig`에서 이미 `hasRole("DEVELOPER")`로 보호됨.

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/admin/club/{clubId}/application` | 해당 동아리의 지원폼 목록 조회 |
| POST | `/api/admin/club/{clubId}/application` | 외부폼 연결 (생성 + 즉시 ACTIVE) |
| DELETE | `/api/admin/club/{clubId}/application/{formId}` | 지원폼 삭제 |

- POST 요청 바디: `{ title, externalApplicationUrl, semesterYear, semesterTerm }`
  - `formMode`는 서버에서 `EXTERNAL` 고정. `externalApplicationUrl` 필수(허용 도메인 검증은 엔티티 재사용).
  - `title` 기본값 허용(예: "외부 지원폼")으로 개발자 편의. semester 기본은 현재 학기(프론트에서 채워 보냄).
- 지원기간은 **기존** `PUT /api/admin/club/{clubId}/description` 재사용(신규 없음).

### 2) 서비스 계층

`ClubApplyAdminService`에 **clubId를 명시적으로 받는** 메서드 추가(기존 `user.getClubId()` 메서드는 그대로 두고 오버로드/신규 추가):

- `createExternalApplicationFormForClub(String clubId, request)`:
  - `validateSemester(...)`
  - `ClubApplicationForm.builder().clubId(clubId).build()` → title/semester/externalApplicationUrl(허용검증)/formMode=EXTERNAL 세팅
  - **`updateFormStatus(true)`로 ACTIVE 설정** 후 save
- `getApplicationFormsForClub(String clubId)`: `findClubApplicationFormsByClubId(clubId)` 재사용
- `deleteApplicationFormForClub(String clubId, String formId)`: `findByClubIdAndId(clubId, formId)` → 지원자 삭제 + 폼 삭제 (기존 delete 로직과 동일 패턴)

리팩터링은 최소로: 기존 본인-동아리 메서드가 새 clubId 메서드를 호출하도록 위임할 수 있으면 위임, 아니면 신규 메서드만 추가.

### 3) 요청 DTO

- 신규 `AdminExternalFormConnectRequest(String title, String externalApplicationUrl, Integer semesterYear, SemesterTerm semesterTerm)` 또는 기존 `ClubApplicationFormCreateRequest` 재사용(formMode 서버 고정). 재사용이 더 단순하면 재사용.

## 프론트엔드 (개발자 포털 정적 페이지)

`backend/src/main/resources/static/dev/edit.html` 확장:

- 기존 "모집정보 수정" 섹션(모집 시작/종료 = 지원기간) **유지**. 로드/저장 실동작 검증.
- 새 섹션 **"지원폼 연결 (외부)"** 추가:
  - 현재 연결된 지원폼 목록 표시 (`GET /api/admin/club/{clubId}/application`): 제목/모드/상태/URL + 삭제 버튼
  - 입력: 외부 URL(구글폼/네이버폼), (선택) 제목 → "연결" 버튼 → `POST /api/admin/club/{clubId}/application`
  - 성공/실패 메시지는 기존 `showResult` 패턴 재사용. 허용 도메인 위반 시 서버 에러 메시지 표시.
- 학기는 현재 학기를 기본으로 자동 세팅(프론트에서 계산해 전송).

## 에러 처리

- 허용되지 않은 URL → 서버 `NOT_ALLOWED_EXTERNAL_URL` → 팝업에 메시지.
- 잘못된 학기 → `APPLICATION_SEMESTER_INVALID`.
- 존재하지 않는 clubId/formId → `CLUB_NOT_FOUND` / `APPLICATION_NOT_FOUND`.

## 테스트

- 백엔드: `ClubApplyAdminService`의 새 clubId 메서드에 대한 유닛 테스트(생성 시 ACTIVE 확인, 허용도메인 위반 예외, 삭제). 컨트롤러는 DEVELOPER 권한 통합 테스트가 있으면 패턴 따라 추가.
- 수동 검증: 개발자 포털에서 임의 동아리에 구글폼 URL 연결 → 해당 동아리 상세 페이지 "지원하기" → 외부 URL로 이동하는지 확인. 지원기간 저장 후 재조회로 반영 확인.

## 범위 밖 (YAGNI)

- 자체 지원폼(질문 빌더) 개발자 편집.
- 활성 폼 자동 단일화(다른 폼 자동 비활성화).
- `ClubRecruitmentInformation.externalApplicationUrl`(미사용 레거시 필드) 정리 — 건드리지 않음.
