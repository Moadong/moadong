---
description: 세션 작업 기록 + 기능 문서화 + 변경 내용 커밋
allowed-tools: Bash(mkdir *), Bash(ls *), Bash(date *), Bash(npm run format), Bash(git status), Bash(git diff *), Bash(git log *), Bash(git add *), Bash(git commit *), Read, Write, Edit, Glob, Grep
---

# 작업 지시

현재 세션의 작업 내용을 기록하고, 기능별 문서를 자동 생성한 뒤, 변경 파일을 커밋합니다.

---

## Phase 1: 세션 기록

먼저 세션 작업 내용을 dailyNote에 기록합니다.

1. `dailyNote/` 폴더가 없으면 생성
2. 오늘 날짜 파일 확인 (형식: `YYYY-MM-DD.md`)
3. 파일이 없으면 새로 생성, 있으면 기존 내용 뒤에 `---` 구분선 추가 후 이어서 작성

**기록할 내용:**

- 세션에서 논의한 내용
- 고민한 흔적과 의사결정 과정 (Decision Log)
- 트러블슈팅 경험
- 새로 배운 기술이나 발견한 것들

**기록 형식 예시:**

```markdown
## [14:30] 세션 요약

### 논의 내용

- React Query의 stale time 설정에 대해 고민

### Decision Log

- useEffect 의존성 배열에서 함수 참조 문제 해결을 위해 useCallback 적용 결정

### 트러블슈팅

- MSW 핸들러에서 응답 지연 시 스토리북 렌더링 이슈 발견 → delay 시간 조정으로 해결
```

---

## Phase 2: 기능 문서화 (선택적)

세션에서 새로운 기능을 구현하거나 중요한 변경이 있었다면 문서화합니다.

### 기능 매핑 테이블

| 기능                | 문서 경로                          | 키워드                                                                                    |
| ------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Main Page           | `docs/features/main/`              | MainPage, ClubCard, Filter, Banner, CategoryButton, SearchBox, Popup                      |
| Club Detail         | `docs/features/club-detail/`       | ClubDetailPage, ClubFeed, ClubProfileCard, ShareButton, ApplyButton, ClubScheduleCalendar |
| Admin - Info        | `docs/features/admin/info/`        | ClubInfoEditTab, MakeTags, SelectTags                                                     |
| Admin - Intro       | `docs/features/admin/intro/`       | ClubIntroEditTab, AwardEditor, FAQEditor                                                  |
| Admin - Photo       | `docs/features/admin/photo/`       | PhotoEditTab, ImagePreview, ClubLogoEditor, ClubCoverEditor                               |
| Admin - Recruit     | `docs/features/admin/recruit/`     | RecruitEditTab, DateTimeRangePicker, MarkdownEditor                                       |
| Admin - Application | `docs/features/admin/application/` | ApplicationEditTab, QuestionBuilder, ApplicationListTab                                   |
| Admin - Applicants  | `docs/features/admin/applicants/`  | ApplicantsTab, ApplicantDetailPage, ApplicantsListTab                                     |
| Admin - Calendar    | `docs/features/admin/calendar/`    | CalendarSyncTab, calendarOAuth                                                            |
| Admin - Account     | `docs/features/admin/account/`     | AccountEditTab, LoginTab, PrivateRoute                                                    |
| Application Form    | `docs/features/application-form/`  | ApplicationFormPage, QuestionAnswerer, QuestionContainer                                  |
| Auth                | `docs/features/auth/`              | auth, secureFetch, refreshAccessToken, JWT                                                |
| API Layer           | `docs/features/api/`               | apis, apiHelpers, handleResponse, withErrorHandling                                       |
| Hooks               | `docs/features/hooks/`             | useClub, useApplication, useApplicants, React Query                                       |
| Store               | `docs/features/store/`             | Zustand, useCategoryStore, useSearchStore                                                 |
| Components          | `docs/features/components/`        | 공용 컴포넌트                                                                             |
| Utils               | `docs/features/utils/`             | debounce, validateSocialLink, formatRelativeDateTime, recruitmentDateParser               |
| Experiments         | `docs/features/experiments/`       | A/B test, useExperiment, Mixpanel                                                         |
| Festival            | `docs/features/festival/`          | FestivalPage, PerformanceCard, TimelineRow, BoothMapSection                               |
| Introduce           | `docs/features/introduce/`         | IntroducePage, FeatureSection                                                             |

어려우면 사용자에게 물어봅니다. 매핑에 없는 기능이면 새 폴더를 만듭니다.

**문서 형식:**

```markdown
# [제목 — 세션 핵심 주제]

[본문 — 세션에서 논의/작업한 내용을 정리]

## 관련 코드

- `[세션에서 다룬 파일 경로]` — [간단한 설명]
```

**원칙:**

- 억지로 내용을 늘리지 않는다
- 대화체 → 문서체로 변환
- 제목, 본문: 한국어 / 코드, 경로, 기술 용어: 영어

**결과 출력:**

```text
## 문서화 완료
- **경로**: `docs/features/[기능]/[파일명]`
- **내용**: [1줄 요약]
```

---

## Phase 3: Git Commit

기록이 완료되면 커밋을 수행합니다.

1. `npm run format` 실행하여 코드 포맷팅
2. `git status`로 변경된 파일 확인
3. `git diff HEAD`로 모든 변경사항 확인 (또는 `git diff`와 `git diff --staged`를 각각 실행)
4. `git log --oneline -5`로 최근 커밋 스타일 참고
5. 변경된 파일을 **기능(scope) 단위로 그룹핑**
   - 같은 기능/도메인에 속하는 파일끼리 묶음 (예: store 변경, admin UI 변경, hooks 변경 등)
   - 논리적으로 독립적인 변경은 별도 커밋으로 분리
   - `docs/features/` 문서 파일은 관련 기능 커밋에 포함
   - `dailyNote/`는 gitignore 대상이므로 제외
6. **커밋 전에 그룹핑 계획과 각 커밋 메시지를 사용자에게 확인 요청**
7. 사용자 승인 후 그룹별로 순서대로 커밋 실행
   - 각 그룹: `git add <관련 파일들>` → `git commit -m "..."` 순으로 반복

**커밋 메시지 형식:**

```text
<type>(<scope>): <subject>

<body>
```

**타입:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 기타 변경

**스코프 예시:**

- `main`, `club-detail`, `admin`, `application`, `auth`, `api`, `hooks`, `store`, `utils`, `components`

**주의사항:**

- Co-Authored-By 라인을 추가하지 않는다

---

## 참고사항

- dailyNote는 `.gitignore`에 포함되어 커밋 대상이 아님
- 문서화는 중요한 변경이 있을 때만 수행 (매 세션 필수 아님)
- 사소한 변경은 Phase 1만 수행하고 커밋하지 않아도 됨
