# 행동 직후 피드백 프론트엔드 구현계획서 — MOA-1114

- 작성일: 2026-09-16
- 작업 브랜치: `feature/#2047-front-feedback-MOA-1114`
- 프론트 기준: `ecd71f97` (`develop-fe`에서 분기한 현재 코드)
- 백엔드 계약 기준: `bc14b372`, [PR #1977](https://github.com/Moadong/moadong/pull/1977)
- 상태: 코드·계약 대조 리뷰 후 구현 착수 기준 확정. 아래 규칙을 기본 구현으로 사용한다. Figma 승인이나 실제 동작 검증 완료를 의미하지 않는다.

## 1. 목표와 범위

관리자의 정보 저장과 사용자의 동아리 탐색 직후 짧은 평가를 수집한다. 기존 모아동의 공통 모달, 테마, 입력 패턴을 사용해 서비스 안에 자연스럽게 연결한다.

완료 기준은 서버 문항 기반 표시, 응답·닫기 저장, 기존 작업 흐름 보존, 모바일·데스크톱 디자인 검증, 실제 백엔드 연동 검증이다. 기존 우체통의 문의·답장 API와 앱 만족도 설문은 각각의 기능을 유지한다.

| 구분 | 이번 구현 범위 |
| --- | --- |
| 공통 | 문항 렌더링, 평점 선택, 후속 사유·의견, 제출·닫기, 오류 처리 |
| 관리자 | 기본정보 수정 성공, 모집정보 저장 성공 |
| 일반 사용자 | 지원하는 SPA 경로에서 동아리 상세 이탈 후 표시 |
| 별도 후속 범위 | 최초 기본정보 등록: 이번 완료 조건에서 제외. 별도 이슈에서 최초 완료 신호 및 진입점을 확정 |
| 제외 | 응답 통계 화면, 프롬프트 관리 화면 재개발, 우체통 답장, 앱 리뷰 이동, 탭/앱 종료 시 설문 |

현재 프론트 브랜치에는 피드백 프롬프트 백엔드 소스가 없다. 위 백엔드 브랜치의 Controller/DTO/Service를 기준으로 계약을 확인했으며, 오래된 설계 문서의 예제보다 실제 응답을 우선한다. 조사 시점 PR #1977은 OPEN으로, 머지·배포 완료로 간주하지 않는다.

## 2. 기존 구조와 변경 영향

| 기존 파일 (`frontend/src/` 기준) | 역할과 계획 |
| --- | --- |
| `components/common/Modal/Modal.tsx` | Portal, 스크롤 잠금, 포커스 트랩, 최상위 Escape 처리 재사용 |
| `components/common/SatisfactionModal/*` | 기존 만족도 질문의 색상·모서리·타이포그래피 참고. 동시 노출 조정 |
| `hooks/useSatisfactionSurvey.ts` | 기존 앱 설문의 자격 판단·카운터 유지. 표시 허용과 실제 노출을 분리할 최소 수정 |
| `components/common/Toast/*` | 제출 완료 메시지 표시. 현재는 props로 제어하는 컴포넌트이며 전역 toast API가 있다고 가정하지 않음 |
| `components/common/Button/Button.tsx` | 네이티브 버튼 속성, disabled 동작 재사용 |
| `components/common/CustomTextArea/*` | 글자 수·입력 패턴 참고만 수행. 1차 입력은 도메인 전용 textarea |
| `pages/AdminPage/tabs/ClubInfoEditTab/hooks/useClubInfoEdit.ts` | PC/모바일 공통 저장 완료 진입점 |
| `pages/AdminPage/tabs/RecruitEditTab/RecruitEditTab.tsx` | 모집정보 저장 완료 진입점 |
| `pages/ClubDetailPage/ClubDetailPage.tsx`, `LegacyClubDetailPage.tsx` | 신규·기존 상세에서 유효한 조회 방문을 등록 |
| `App.tsx`, `routes/AppRoutes.tsx`, `routes/webviewRoutes.tsx` | 라우트 간 유지되는 Host, 이탈 관찰, 별칭 URL 정규화 |
| `apis/auth/secureFetch.ts`, `apis/utils/apiHelpers.ts` | 기존 인증 동작 참고, 공통 응답 해석 재사용. 설문 요청은 세션 토큰을 고정하는 별도 얇은 transport 사용 |
| `styles/theme/*`, `styles/mediaQuery.ts`, `styles/zIndex.ts` | 색상·글자·반응형·레이어 기준 |

일반 사용자, 관리자, 메인 만족도 설문이 영향 범위다. 외부 경계는 백엔드 MongoDB에 저장되는 노출/응답 이력, 브라우저 localStorage, 앱 웹뷰의 라우팅·키보드다. 이번 계획의 필수 구현은 프론트이며, 서버 개선과 네이티브 앱 신원 연계는 별도 항목으로 둔다.

## 3. 실제 백엔드 API 계약

공통 응답 래퍼의 `data`를 기존 `handleResponse<T>()`로 해석한다. 성공 응답이 비어 있거나 필수 필드가 없으면 노출하지 않는다. 아래 표의 반환값은 래퍼 내부다.

| 기능 | 메서드·경로 | 입력 | 반환 |
| --- | --- | --- | --- |
| 노출 판단 | `GET /api/feedback-prompts/eligibility` | query: `triggerType`, 선택 `clubId`, `anonymousClientId` | `{ eligible, reason, prompt }` |
| 응답 제출 | `POST /api/feedback-prompts/{promptId}/responses` | 아래 제출 DTO | `{ responseId, message }` |
| 닫기 | `POST /api/feedback-prompts/{promptId}/dismiss` | `{ triggerType, clubId?, anonymousClientId? }` | 공통 성공 응답, 본문 데이터에 의존하지 않음 |

### 타입과 렌더링 규칙

- `triggerType`: `ADMIN_CLUB_BASIC_INFO_CREATED`, `ADMIN_CLUB_INFO_UPDATED`, `ADMIN_RECRUITMENT_INFO_SAVED`, `USER_CLUB_DETAIL_EXIT`, `GENERAL_FEEDBACK`.
- `GENERAL_FEEDBACK`는 타입만 지원하고 이번 화면에서 발생시키지 않는다.
- `audience`: `ADMIN | USER`.
- `rating`: `POSITIVE | NEUTRAL | NEGATIVE`.
- `prompt`: `id`, `triggerType`, `audience`, `title`, `description`, `ratingOptions`, nullable `followUp`, `exposurePolicy`, `displayOrder`, `active`, `createdAt`, `updatedAt`.
- `ratingOptions[]`: `rating`, `label`, `displayOrder`, `requiresFollowUp`. 서버는 서로 다른 평점 1~3개를 허용하며 반드시 3개일 필요는 없다.
- `followUp`: `reasonQuestion`, `reasonOptions`, `commentQuestion`, `commentPlaceholder`, `commentMaxLength`.
- `reasonOptions[]`: `id`, `label`, `displayOrder`, `active`. 사용자 응답은 서버가 활성 사유만 필터링하고 순서대로 반환한다. 프론트도 해당 순서를 유지한다.
- 문구·사유 ID·선택지 순서를 하드코딩하지 않는다. 긍정/보통/부정 이름으로 후속 질문 여부를 추측하지 않는다.
- 문항 텍스트는 일반 텍스트로 렌더링한다. HTML/Markdown 파싱은 필요하지 않다.
- `eligible=false`의 `reason`은 `PROMPT_NOT_FOUND`, `PROMPT_INACTIVE`, `ANSWERED_COOLDOWN`, `DISMISSED_COOLDOWN`, `SHOWN_COOLDOWN`, `USER_CLUB_ALREADY_ANSWERED`, `USER_DAILY_LIMIT`, `UNAUTHORIZED`다. 모두 사용자 오류창 없이 종료한다.

응답 요청 예시:

```json
{
  "triggerType": "USER_CLUB_DETAIL_EXIT",
  "clubId": "club-id",
  "anonymousClientId": "persistent-client-uuid",
  "rating": "NEGATIVE",
  "reasonOptionIds": ["HARD_TO_FIND_ITEM"],
  "comment": "모집 일정을 찾기 어려웠어요.",
  "clientContext": {
    "path": "/club/club-id",
    "deviceType": "mobile",
    "userAgent": "browser-user-agent",
    "appWebView": false
  }
}
```

`clientContext`는 선택이며, `path`는 설문을 띄운 다음 화면이 아닌 원래 행동이 발생한 pathname을 기록한다. 검색 파라미터와 토큰은 넣지 않는다. `deviceType`은 서버의 자유 문자열 필드이므로 프론트에서 `mobile | tablet | desktop`으로 일관되게 보낸다.

### 저장 시점과 제한

1. `requiresFollowUp=false`: 평점을 누르면 사유 `[]`, 의견 미입력으로 한 번 제출한다.
2. `requiresFollowUp=true`: 평점을 로컬에 보관하고 후속 화면으로 이동한다. 제출 버튼에서 평점·사유·의견을 한 번 저장한다.
3. 사유·의견은 현 서버에서 필수가 아니다. 아무것도 추가하지 않고도 선택한 평점을 제출할 수 있게 한다. 별도 '기타 입력 필수' 규칙을 만들지 않는다.
4. 사유는 중복 없는 ID 최대 8개, 의견은 `min(commentMaxLength, 500)`자다. 글자 수는 현재 JS/Java 문자열 길이 계약에 맞추며 한글 IME 조합을 검증한다.
5. 후속 화면에서 이전 단계로 돌아가 다른 평점을 고르면 사유·의견을 초기화해 긍정 응답에 잘못 붙지 않게 한다.
6. 후속 입력 중 닫으면 미제출 평점은 저장하지 않고 dismiss만 보낸다. 응답 수정 API가 없어 평점 선저장 후 추가 제출은 중복 응답이 된다.
7. 응답 성공 후 닫힐 때 dismiss를 보내지 않는다. 감사 문구는 서버의 `message`를 사용한다.

## 4. 인증·노출·오류 처리

### 신원

- 관리자 트리거는 실제 관리 중인 `clubId`와 요청 시 캡처한 관리자 accessToken을 사용한다. 서버는 인증 사용자 `clubId`와 요청 값이 같은지 확인한다. 11절에 따라 설문 세션 중 토큰 교체·자동 갱신을 하지 않는다.
- 일반 사용자 1차는 `fetchWithTimeout` + `anonymousClientId`를 사용한다. 학생 토큰이나 관리자 토큰을 자동으로 첨부하지 않는다.
- UUID를 최초 한 번 생성해 `storageKeys.ts`의 신규 키로 localStorage에 보관한다. 조회·제출·닫기가 같은 ID를 사용해야 한다. 저장소 접근 불가 시 일반 사용자 설문은 생략한다.
- 우체통의 `studentFetch`는 `/api/student/**`용 학생 신원 경로다. 새 `/api/feedback-prompts/**`에 그대로 붙이지 않는다.
- 웹뷰도 현재 origin의 저장 ID를 쓴다. 앱 재설치·저장소 초기화·다른 웹뷰 저장소 사이의 동일인 보장은 이번 계약에 없다. 앱/웹 학생 신원 통합이 필요하면 별도 서버·앱 설계가 필요하다.
- 설문이 열린 동안 관리자 로그아웃/동아리 변경이 발생하면 세션을 취소한다. 이전 컨텍스트에 새 인증 정보로 제출하지 않는다.

### eligibility는 읽기 전용 조회가 아니다

현 서버는 eligible=true를 반환하기 전에 `SHOWN`을 저장한다. 따라서 `useMutation`으로 명시 호출하고 `retry: 0`을 설정한다. 마운트 시 자동 조회, focus refetch, prefetch, 영속 캐시, 성공 후 invalidate/refetch를 사용하지 않는다.

호출 전 표시 슬롯을 선점하고 현재 경로·활성 모달·중복 이벤트·document visibility를 확인한다. `eventId`와 요청 세대를 관리해 StrictMode, 같은 저장 성공 이벤트, 연속 이탈의 중복 호출을 막는다. 진행 중 새 이벤트는 쌓지 않고 버린다. 늦게 도착한 이전 세션 응답은 UI에 반영하지 않는다.

요청 후 화면이 바뀌거나 연결이 끊기면 실제 표시 없이 SHOWN만 남을 수 있다. AbortController나 프론트 잠금으로 서버 저장을 되돌릴 수 없다. 현재 이력은 '실제 렌더 완료'와 완전히 같지 않다는 한계를 명시한다.

쿨다운은 서버가 판단한다. 현재 기본값은 관리자 응답 후 30일/닫기 후 7일/노출 후 24시간, 사용자 동일 동아리 응답 제한/닫기 후 7일/노출 후 24시간/하루 1회다. 프론트에 기간을 복제하지 않는다.

### 실패와 닫기

| 상황 | UI 및 API 처리 |
| --- | --- |
| 조회 실패·노출 불가 | 조용히 종료, 원래 작업·이동은 정상 완료 |
| 제출 진행 | 중복 클릭과 평가 변경 잠금, 버튼 진행 문구 및 `aria-busy` |
| 제출의 명확한 검증 오류 | 11절의 오류 코드별 규칙 적용. 문항 변경 오류는 재조회하지 않고 종료 |
| 제출 timeout·5xx·성공 본문 파싱 실패 등 저장 여부 불명 | `unknownOutcome`으로 전환. 입력은 읽기 전용으로 보존하고 닫기만 제공. 해당 세션의 수동·자동 재전송과 dismiss 금지 |
| 비활성/삭제된 문항 | 반복 조회·제출하지 않고 종료 안내 |
| X·나중에·Escape | 동일 close handler에서 dismiss 최대 1회, UI는 즉시 닫힘 |
| 배경 클릭 | `closeOnBackdrop=false`로 입력 유실 방지 |
| 제출 중 사용자가 닫음 | UI만 닫고 요청 결과 처리 유지, ANSWERED와 DISMISSED를 동시에 기록하지 않음 |
| 라우트 이동 | 이동은 허용. 미제출 노출 세션만 best-effort dismiss, 종료된 문맥에서는 새 UI를 열지 않음 |
| effect cleanup·Host 정리 | 네트워크 요청을 발생시키지 않음. StrictMode 가상 해제와 실제 이탈을 혼동하지 않음 |
| dismiss 실패 | 자동 재시도·사용자 오류창 없음. 서버 SHOWN 쿨다운은 남을 수 있음 |

프론트의 재전송 정책만으로 exactly-once 저장을 보장하지 않는다. 현 서버의 응답 저장과 ANSWERED 저장도 별도 작업이므로 부분 저장 가능성이 있다.

## 5. 화면 디자인 계획

### 디자인 기준

현재 `SatisfactionModal`은 흰 배경, 20px 모서리, 24px 수평 패딩, title5 제목, 12px 버튼 모서리를 사용한다. 행동 피드백도 이 계열로 구성한다. 앞선 구상의 모바일 하단 시트 대신 **1차는 PC·모바일 모두 기존 중앙 모달**을 사용해 공통 Modal의 정렬·접근성 동작을 유지한다.

아래 숫자는 신규 전역 토큰이 아니라 이 화면의 초기 레이아웃 제안이다. 색상·타이포그래피는 반드시 기존 토큰에서 가져온다.

| 요소 | 계획 |
| --- | --- |
| 컨테이너 | `width: min(400px, calc(100vw - 32px))`, `box-sizing: border-box`, radius 20px, padding 24px |
| 배경·레이어 | `colors.base.white`, 기존 Modal backdrop 및 `Z_INDEX.overlay` 사용 |
| 제목 | `typography.title.title5`, `colors.base.black`; 여러 줄 허용 |
| 설명 | `paragraph.p5`, `colors.gray[800]`, 제목 아래 8px |
| 세로 간격 | 제목 그룹→선택지 24px, 입력 그룹 간 20~24px, 세부 요소 8~12px |
| 평점 버튼 | 서버 선택지 수 N(1~3)에 맞춘 N열, 375px 이하 1열. gap 8px, 높이 최소 48px, radius 12px, 긴 라벨은 줄바꿈 |
| 선택지 기본 | 흰 배경, `gray[300]` 테두리, `gray[900]` 텍스트 |
| 선택·포커스 | `primary[500]` 배경, `primary[900]` 테두리와 포커스 표시. 본문은 진한 무채색으로 가독성 유지 |
| 사유 | 자동 줄바꿈되는 checkbox 카드, 긴 라벨 허용, 선택 표시와 텍스트 함께 제공 |
| 의견 | 회색 입력 배경, p3/p4 본문, 남은 글자 수, 선택 입력 안내 |
| 제출 | 기존 Button의 `gray[900]` 배경·흰 글자 유지. 화면 전용 확장으로 높이 48px·너비 100%·radius 12px. 브랜드색은 선택 배경·보더에 사용 |
| 보조 행동 | '나중에'와 '이전'은 무채색 텍스트 버튼, 터치 영역 최소 44px |
| 완료 | 모달 닫힘 후 기존 Toast로 서버 감사 문구 표시 |

모든 평점을 같은 강도로 보여준다. 긍정만 브랜드색으로 강조하거나 기본 선택하지 않는다. 별도 일러스트·이모지·새 아이콘 스타일을 도입하지 않고 기존 닫기 SVG를 활용한다.

### 와이어프레임

```text
평점 단계                         후속 단계
┌──────────────────────────┐     ┌──────────────────────────┐
│                       ×  │     │ 이전                  ×  │
│ 서버의 질문 제목         │     │ 서버의 후속 질문         │
│ 서버의 설명              │     │                          │
│                          │     │ □ 사유 A   □ 사유 B      │
│ [평점 A][평점 B][평점 C]  │     │ □ 긴 사유 C              │
│                          │     │                          │
│         나중에           │     │ 의견 질문 · 선택         │
└──────────────────────────┘     │ [자유 의견 입력        ] │
                                 │                   0/500  │
                                 │ [       보내기         ] │
                                 └──────────────────────────┘
```

### 작은 화면·키보드·접근성

- 기존 breakpoint 375/500/700/1280px를 따른다. 375px 이하 평점은 1열, 그보다 넓으면 선택지 수에 맞춘 열을 사용한다. 각 셀에 `min-width:0`, `overflow-wrap:anywhere`를 적용한다.
- 모달의 최대 높이는 사용 가능한 viewport에서 상하 16px와 safe area를 뺀 값으로 제한한다. 본문만 `overflow-y:auto`, `touch-action:pan-y`, `overscroll-behavior:contain`으로 둔다.
- 기존 Overlay의 `touch-action:none`을 상속 경로에 그대로 두지 않는다. Modal에 선택적 `scrollableContent?: boolean`(기본 false)을 추가하고 이 설문만 true로 전달한다. true일 때 Overlay는 `touch-action:auto`, 배경 스크롤은 기존 useBodyScrollLock으로 막고 본문에 pan-y를 적용한다. 기존 사용처는 기본값을 유지한다.
- 키보드에 제목·의견 입력·제출 버튼이 가려지지 않게 한다. `dvh`와 내부 스크롤에 더해 VisualViewport 지원 환경에서는 11.7절의 전용 높이·위치 제한을 적용한다.
- `role=dialog`, `aria-modal`, 제목 ID, 실제 input/textarea label 연결, 보이는 focus ring을 제공한다. 공통 포커스 트랩과 Escape 처리를 재사용한다.
- 후속 단계 전환 시 제목/첫 입력으로 포커스를 이동한다. 닫힐 때 기존 트리거가 제거됐으면 이동한 페이지의 안정적인 제목/컨테이너를 포커스 복귀점으로 삼는다.
- `CustomTextArea`는 현재 label/id 연결과 최대 높이 제어가 부족하므로 이번에는 도메인 전용 native textarea를 사용한다. label/htmlFor/id, maxLength, rows=3, 높이 96px, 내부 overflow:auto, 기존 p3·gray[100]·radius 8px를 적용한다. 공통 입력 컴포넌트는 수정하지 않는다.
- 기존 transition 토큰을 사용하고 `prefers-reduced-motion`을 존중한다. 글자 대비와 200% 확대는 화면 검증 항목이며, 기존 토큰 사용 자체를 접근성 통과로 간주하지 않는다.

## 6. 트리거와 설문 간 우선순위

### 관리자

대표 저장 성공 callback에서만 `requestFeedback({ triggerType, clubId, sourcePath, eventId })`를 호출한다. 기존 성공 alert는 사용자가 확인한 뒤 요청한다. 로고 업로드, 링크·태그 개별 저장, 데이터 재조회만으로는 호출하지 않는다.

모집정보와 소개정보가 같은 하위 API를 사용해도 트리거는 화면의 업무 의미로 구분한다. `useUpdateClubDescription` 같은 공통 mutation 자체에 설문을 붙이지 않는다. 최초 등록은 이름/필드가 비어 있다는 추정으로 판단하지 않고 확인된 등록 완료 신호가 있어야 연결한다.

### 일반 사용자

상세 데이터가 성공적으로 표시된 방문에만 visit ID와 실제 club ID를 기록한다. router의 이전/현재 상세 식별값으로 이탈을 판별하며 effect cleanup 자체를 이탈 이벤트로 사용하지 않는다.

1차는 신규·기존 상세에서 메인 `/` 또는 구독 `/subscriptions`로 이동한 경우만 허용한다. 11.3절의 목적지 ready 이후 표시 슬롯을 요청한다. query/hash·소개/사진/일정 탭 변경, 상세 별칭 URL의 canonical redirect, 지도/다른 상세 이동, 지원서/로그인/외부 링크 진입은 제외한다. 브라우저 뒤로가기도 실제 SPA 목적지와 같은 기준을 적용한다.

출발 `clubId`, pathname, 신원은 한 세션 안에서 고정한다. 조회 중 목적지가 다시 바뀌면 늦은 응답을 표시하지 않는다. 연속 이동 이벤트를 대기열로 쌓아 오래된 동아리를 나중에 묻지 않는다.

### 기존 SatisfactionModal과 공존

공통 Modal의 레이어 처리는 두 설문의 동시 표시를 자동으로 막아주지 않는다. 설문 전용 작은 coordinator에서 `owner: satisfaction | feedbackPrompt | null`을 관리한다.

- 이미 열린 설문이 우선한다. 행동 피드백은 슬롯이 없으면 eligibility를 호출하지 않는다.
- 같은 경로 전환의 경쟁 요청은 기존 SatisfactionModal을 우선하고 행동 피드백 이벤트를 폐기한다. 11절의 목적지 ready handshake 및 원자적 슬롯 획득으로 처리한다.
- 만족도 훅의 '질문 자격 있음'과 '실제로 열림'을 분리하고 노출 분석 이벤트는 실제 표시 시점에만 기록한다. 기존 응답/미루기 카운터 정책은 유지한다.
- 동의·확인 모달처럼 중요한 기존 대화상자가 열려 있을 때도 신규 질문을 요청하지 않는다. 11절의 overlay registry를 Modal·BottomSheet·메인 Popup에 연결한다. z-index만으로 배타 제어하지 않는다.

## 7. 구현 구조와 상태 전이

```text
frontend/src/
  apis/feedbackPrompt.ts
  types/feedbackPrompt.ts
  hooks/Queries/useFeedbackPrompt.ts
  hooks/useClubDetailExitFeedback.ts
  store/useFeedbackPromptStore.ts
  store/useSurveyCoordinatorStore.ts
  store/useOverlayRegistryStore.ts
  hooks/useOverlayRegistration.ts
  utils/feedbackPromptTransport.ts
  utils/feedbackPromptSession.ts
  utils/feedbackPromptIdentity.ts
  components/FeedbackPrompt/
    FeedbackPromptHost.tsx
    FeedbackPromptDialog.tsx
    FeedbackPromptDialog.styles.ts
    FeedbackPromptDialog.stories.tsx
    FeedbackPromptDialog.test.tsx
    FeedbackPromptFollowUp.tsx
```

API와 identity 유틸은 인접 테스트를 둔다. 피드백 도메인 UI는 `components/FeedbackPrompt`에 두고 일반적인 Modal/Button/Toast만 `components/common`에서 재사용한다.

Host는 `App.tsx`의 BrowserRouter 및 Theme/Query provider 내부, 라우트 페이지의 형제 위치에 한 번 마운트한다. Store에는 순간적인 UI 상태만 두며 제출 본문을 persist하지 않는다. 초기 로딩 때 API를 호출하지 않는다.

```text
idle → checking → rating → submitting → idle + toast
                     └→ followUp → submitting
checking → idle                  ├→ validationError
                                 └→ unknownOutcome(재전송 금지)
rating/followUp → dismissing → idle
```

`sessionId`, `eventId`, 요청 세대, `prompt`, 원래 trigger/club/path/identity, 선택값, 제출 여부를 명시적으로 관리한다. 응답·닫기의 종료 처리는 같은 세션에서 한 번만 실행한다. 컴포넌트에는 네트워크 호출을 흩뿌리지 않는다.

API 훅 스킬의 일부 예시 export는 현재 코드와 다르므로 실제 `fetchWithTimeout`, `handleResponse` 경로를 따른다. 기존 secureFetch는 재요청 시 토큰을 교체하므로 세션 신원 고정을 위해 이 기능에서 직접 사용하지 않는다. 이 기능은 읽기 캐시를 사용하지 않으므로 불필요한 query key와 invalidate를 추가하지 않는다.

## 8. 작업 단계와 수용 기준

| 단계 | 작업 | 통과 조건 |
| --- | --- | --- |
| 1 | API 타입·인증·MSW fixture | 실제 DTO와 래퍼 일치, 관리자/익명 요청 분리, 자동 재호출 없음 |
| 2 | 공통 화면·Storybook | 평점/후속/진행/실패/긴 문구/최대 8사유 상태, 기존 모달과 나란히 시각 검증 |
| 3 | Host·coordinator | StrictMode 중복 없음, 기존 만족도/동의 모달과 동시 노출 없음 |
| 4 | 관리자 2개 진입점 | 성공한 대표 저장 후에만 조회, PC/모바일 동일 정책, 저장 오류와 피드백 오류 분리 |
| 5 | 사용자 이탈 | 허용 목적지와 뒤로가기만 동작, query 변화·빠른 재이동·별칭 리다이렉트 오탐 없음 |
| 6 | 실제 서버·운영 설정 | 익명·관리자 응답/닫기/쿨다운 확인, 문항 변경 반영, 운영 노출 조건 확인 |

이번 브랜치의 완료 범위는 단계 1~6 전체다. 커밋은 API/화면/관리자/사용자/검증으로 나누되 최초 등록 트리거는 포함하지 않는다.

### 자동 검증

- Jest/Testing Library/MSW: eligible false·401·403·404·5xx·timeout, 관리자 clubId, 익명 UUID 지속성, payload 제한.
- 후속 없음은 클릭 1회에 응답 1개, 후속 있음은 평점 클릭 시 0개/최종 제출 시 1개.
- X/Escape/나중에 dismiss 1회, 성공 후 dismiss 0회, 제출 중 닫기 경쟁 상태.
- 더블 클릭, StrictMode, 오래된 응답, 요청 중 라우트 이동, 로그아웃/관리 동아리 변경.
- 실제 페이지 통합 테스트: 저장 실패 미노출, 개별 링크·태그 저장 미노출, 탭 변경 미노출, 두 설문 충돌.
- 서버 변경 문구/순서/비활성 사유, 선택지 긴 문자열, 의견 500자 및 더 작은 서버 제한.

`frontend/`에서 구현 후 `npm run test -- --runInBand`, `npm run build`, `npm run build-storybook`을 수행한다. build는 sitemap 생성 및 타입 검사도 포함하므로 외부 API/환경 의존 실패를 코드 실패와 구분해 기록한다. 변경 파일 ESLint는 `--fix` 없는 검사로 실행한다.

### 시각·동작 검증

- 320, 375, 390, 500, 700, 1280px 및 넓은 데스크톱에서 기존 SatisfactionModal과 함께 비교.
- 밝은 배경, 브랜드 선택 표시, 기존 어두운 CTA, 모서리, 본문 간격, 기존 Toast 위치의 조화 확인.
- iOS/Android 웹뷰: 키보드, safe area, 긴 입력 내부 스크롤, 뒤로가기.
- 키보드 Tab/Shift+Tab/Escape, 스크린리더 이름, 200% 확대, 모션 축소, 색상 대비.
- 각 상태의 스크린샷을 PR에 남긴다. Storybook 테스트만으로 실서버/웹뷰 검증을 대체하지 않는다.

## 9. 배포 순서와 서버 후속 사항

1. 백엔드 PR #1977의 머지·배포와 실제 API 응답을 확인한다. 프론트 브랜치로 백엔드 구현을 통째로 병합할 필요는 없다.
2. 운영 노출 전 프롬프트를 비활성화하거나 배포 환경의 설정으로 노출을 통제한다. 현재 seed는 active=true라 최초 프론트 연동과 동시에 표시될 수 있다.
3. 사용자 상세용 seed 사유가 관리자 저장 중심 문구이므로 개발자 포털에서 탐색 목적에 맞게 수정한다. 안정적인 reason ID는 유지한다.
4. 프론트 관리자 흐름을 검증 후 활성화하고, 사용자 이탈은 문구·쿨다운·모달 충돌 검증 후 활성화한다.
5. 프론트가 먼저 배포되면 API 부재/실패 시 조용히 생략한다. 이를 기능 배포 완료로 취급하지 않는다. 중단 시 서버 프롬프트 비활성화로 신규 노출을 막는다.

서버 개선 후보는 아래와 같으며 이번 프론트 코드에서 해결됐다고 주장하지 않는다.

- 실제 표시를 구분할 SHOWN 확정/예약 계약: 현 GET 부작용과 재조회 한계 해소.
- 응답 멱등성 키, 응답·ANSWERED 원자 저장: 재전송 중복 및 부분 저장 방지.
- 동시 eligibility의 노출 제한 및 활성 문항 유일성 보장.
- 평점 클릭 즉시 저장이 필수일 때 응답 보완 API. 현재 계획은 후속 질문 완료 후 일괄 제출.

## 10. 구현 전후 체크리스트

- [ ] 기본 UI 치수를 Storybook에서 기존 모달과 비교해 조정한다.
- [ ] 일반 사용자 1차 식별은 별도 anonymousClientId라는 점을 유지한다.
- [ ] 기존 앱 설문과 중요한 대화상자 상태를 coordinator가 실제로 관찰한다.
- [ ] 최초 등록 이벤트는 확실한 업무 신호 확인 전까지 발생시키지 않는다.
- [ ] 서버 멱등성 미지원 상황의 불명확한 제출 실패 UX를 명시한다.
- [ ] API 자동 재조회, 자동 재전송, 설문 큐 적재를 하지 않는다.
- [ ] 운영 seed 활성 상태와 사용자 질문 문구를 점검한다.
- [ ] 자동 테스트·화면 비교·실서버 연동 결과를 기록한다.

이 문서는 구현계획이며 체크 항목을 통과했다고 의미하지 않는다. 이 문서 작성에서는 서비스 코드·API·운영 설정을 변경하지 않는다.

## 11. 리뷰로 확정한 구현 명세

이 절은 앞선 절의 세부 실행 규칙이다. '나중에 결정'하는 대신 아래 기본값으로 개발한다. 실제 브라우저 검증이 필요한 항목은 구현 후 통과해야 할 출시 조건으로 남긴다.

### 11.1 이벤트·세션·API 함수 계약

```ts
type EnabledFeedbackTrigger =
  | 'ADMIN_CLUB_INFO_UPDATED'
  | 'ADMIN_RECRUITMENT_INFO_SAVED'
  | 'USER_CLUB_DETAIL_EXIT';

type FeedbackIdentity =
  | { kind: 'anonymous'; anonymousClientId: string }
  | { kind: 'admin'; accessToken: string; clubId: string; authEpoch: number };

type FeedbackEvent = {
  eventId: string;
  triggerType: EnabledFeedbackTrigger;
  clubId: string;
  sourcePath: string;
  destinationKey: string;
};

// 반환 Promise는 결과를 알리기 위한 것. 저장 성공이나 라우팅을 await로 막지 않는다.
type RequestFeedbackResult = 'skipped' | 'opened' | 'cancelled';
// requestFeedback(event: FeedbackEvent): Promise<RequestFeedbackResult>
// checkFeedbackEligibility(event, identity, signal): Promise<EligibilityResponse>
// submitFeedback(promptId, payload, identity): Promise<ResponseCreateResponse>
// dismissFeedback(promptId, payload, identity): Promise<void>
```

- 토큰은 단일 요청 컨텍스트 메모리에만 보관한다. Zustand DevTools/persist/분석 이벤트에 담지 않는다. UI Store에는 identity 종류와 컨텍스트 비교용 epoch만 두며 종료 시 토큰 참조를 제거한다.
- 관리자 event ID는 대표 저장을 시작할 때 만든 UUID다. 같은 요청의 성공 callback은 그 ID를 재사용한다. 다음 명시적 저장은 새 ID다.
- 사용자 event ID는 `exit:${visitId}`다. visitId는 상세에서 실제 clubDetail.id를 처음 등록할 때 생성한다. StrictMode 재실행·refetch·탭 변경은 같은 방문 ID를 재사용한다.
- 세션 상태 전환은 Zustand `get/set` 또는 순수 reducer를 통한 동기식 compare-and-set으로 처리한다. 렌더가 끝나기 전 두 번 누르는 상황도 `submitting` 전환 즉시 차단한다.
- 소비한 event ID는 메모리 Set에 최근 100개까지 보관한다. 컴포넌트 cleanup에서 비우지 않고 전체 새 앱 실행 시 초기화한다. 이것은 재노출 쿨다운의 대체물이 아니다.
- 결과 없는 Promise rejection이 저장 화면으로 전파되지 않도록 requestFeedback은 오류를 내부에서 처리한다. 제출/닫기 요청은 session controller가 소유하고 useMutation에는 `retry:0`을 명시한다.

### 11.2 관리자 인증의 구체적인 처리

현재 `useAuth`는 최초 마운트에만 검사하고, `useAdminClubStore`에는 clubId만 있다. localStorage의 변경은 같은 탭에서 React를 갱신하지 않는다. 따라서 '로그아웃 감지'를 기존 코드가 자동 제공한다고 가정하지 않는다.

1. `feedbackPromptSession.ts`에 authEpoch와 `invalidateAdminFeedback()`을 둔다.
2. `hooks/useLogout.ts`는 사용자가 확인하고 로그아웃 API를 시작하기 전에 invalidate를 호출한다. 로그아웃 실패 시에도 기존 설문은 재개하지 않는다.
3. `pages/AdminPage/auth/LoginTab/LoginTab.tsx`는 로그인 성공 토큰을 저장하기 전에 invalidate를 호출한다.
4. Host는 `useAdminClubStore`의 clubId 변경과 다른 탭의 accessToken `storage` 이벤트를 구독해 세션을 취소한다. session을 열기 전에 현재 store clubId와 event clubId가 같아야 한다.
5. `feedbackPromptTransport.ts`는 `fetchWithTimeout`에 세션에서 캡처한 Bearer 토큰과 credentials:include를 전달한다. 각 전송 직전에 epoch·clubId·현재 저장 토큰 일치를 검사한다. 불일치면 요청하지 않는다.
6. 기존 secureFetch의 401 refresh/replay는 설문에서는 사용하지 않는다. 401/403은 종료한다. 다른 작업이 토큰을 정상 갱신해도 비교에서 바뀌었다면 설문은 보수적으로 취소한다. 선택적 피드백 때문에 로그인 화면으로 강제 이동하지 않는다.
7. 전송 이후의 로그아웃은 이미 서버에 도착한 쓰기를 취소할 수 없다. 오래된 응답의 UI 반영만 차단하며, 취소 과정에서 다른 사용자의 토큰으로 dismiss를 보내지 않는다.

관리자 저장 API의 인증 동작은 그대로 유지한다. 새 인증 프레임워크나 refresh 정책 변경은 필요하지 않다.

일반 사용자 저장 키는 `STORAGE_KEYS.FEEDBACK_PROMPT_ANONYMOUS_ID = 'moadong.feedbackPrompt.anonymousClientId'`로 고정한다. read→없으면 crypto.randomUUID→write→read-back을 동기적으로 처리하고 그 반환값을 세션에 캡처한다. 탭 간 최초 동시 생성에서는 마지막 저장값이 우선할 수 있으며, 완전한 사람 단위 식별을 보장하지 않는다. 세션 중 저장값이 바뀌어도 진행 중 payload는 캡처한 ID를 유지한다. UUID 생성/저장 실패는 조회 이전에 종료한다.

### 11.3 목적지 ready와 설문 경쟁 처리

'화면이 안정되면'은 임의의 긴 setTimeout이나 데이터 캐시 도착 순서로 구현하지 않는다. 다음 handshake를 사용한다.

- Host의 라우트 observer는 location.key 변경 시 해당 navigation의 후보를 만들고, 목적지 ready가 등록되기 전에는 eligibility를 호출하지 않는다.
- `MainPage`의 SatisfactionModal은 최초 `shouldAskOnMount` 결과를 보존한 뒤 effect에서 `{ navigationKey, satisfactionEligible }`를 coordinator에 등록한다. 같은 effect에서 메인의 ready를 등록한다. 최초 `isOpen`은 false이고 coordinator 허가 후에만 true다.
- `SubscriptionsPage`는 effect에서 `{ navigationKey, satisfactionEligible:false, ready:true }`를 등록한다. 관리자 이벤트는 성공 alert가 반환된 callback에서 해당 destinationKey의 ready를 등록한다.
- 같은 navigation의 ready와 후보가 모두 모였을 때만 coordinator가 처리한다. 어느 effect가 먼저 실행돼도 동일하다. 같은 프레임의 일반 overlay 등록을 반영하도록 requestAnimationFrame에서 한 번 최종 검사한 뒤 동기적으로 owner를 획득한다. timer/RAF는 경로 변경 시 취소한다.
- 위 ready+후보 조건은 행동 피드백에만 적용한다. 기존 만족도 설문은 메인 ready와 자체 자격만으로 획득을 시도하므로 상세 이탈 후보가 없는 앱 최초 접속에서도 기존대로 작동한다. 행동 피드백 flag가 false여도 만족도 ready 등록과 기존 설문은 유지한다.
- 순서는 `일반 overlay 존재 → 모두 보류 없이 폐기`, `이미 owner 존재 → 신규 행동 피드백 폐기`, `satisfactionEligible → satisfaction 획득·행동 피드백 폐기`, `그 외 → feedbackPrompt 획득`이다.
- 만족도 설문이 다른 overlay 때문에 표시되지 못하면 그 마운트에서는 재시도하지 않는다. 카운터나 answered 값을 변경하지 않는다. 다음 메인 방문에서는 기존 자격 규칙으로 다시 평가한다.
- ready가 1초 내 오지 않으면 후보를 폐기한다. document가 hidden이면 기다렸다가 띄우지 않고 폐기한다. 이후 서버 요청 자체는 5초 timeout이다. 관리자 auth 실패·조회 실패도 재시도하지 않는다.
- 메인 Popup은 이미지 로딩 후 뒤늦게 열릴 수 있다. registry에서 blocking overlay가 새로 등록되면 checking은 취소하고, 열린 미제출 피드백은 닫고 dismiss한다. 제출 중/unknownOutcome은 UI만 숨긴다. 기존 만족도 설문은 answered/snooze를 기록하지 않고 숨기며 같은 마운트에서 재개하지 않는다.

### 11.4 overlay registry와 공통 모달의 최소 변경

신규 `useOverlayRegistryStore`는 `Map<instanceId, 'blocking' | 'survey'>`만 제공한다. `useOverlayRegistration(isOpen, kind)`는 안정적인 instance ID와 useLayoutEffect로 등록/해제한다. 해제는 idempotent하며 cleanup에서 네트워크 요청을 하지 않는다.

| 파일 | 변경 |
| --- | --- |
| `components/common/Modal/Modal.tsx` | `overlayKind?: 'blocking' | 'survey'` 기본 blocking, registry 등록. `scrollableContent?: boolean` 기본 false 추가 |
| `components/common/Modal/Modal.styles.ts` | scrollableContent일 때만 touch-action:auto. 기존 backdrop·정렬·z-index 유지 |
| `components/common/BottomSheet/BottomSheet.tsx` | 기본 blocking으로 등록. 드래그·포커스·스타일은 유지 |
| `pages/MainPage/components/Popup/Popup.tsx` | 자체 Overlay이므로 blocking 등록. 이미지 대기 후 열림도 registry에 반영 |
| `components/common/SatisfactionModal/SatisfactionModal.tsx` | survey 등록, coordinator 허가로 표시, 실제 표시에서만 SHOWN 분석 이벤트 |
| `FeedbackPromptDialog.tsx` | survey 및 scrollableContent=true 전달 |

registry는 '설문을 띄워도 되는가'만 판단한다. 기존 일반 모달의 표시를 registry가 막거나 자동으로 닫지 않는다. MapModal/PhotoModal/PersonalInfoConsentModal은 공통 Modal을 사용하므로 추가 등록이 필요 없다. survey 자신을 blocker로 세지 않는다.

### 11.5 이탈을 정의하는 알고리즘

1. `ClubDetailPage`와 `LegacyClubDetailPage` 양쪽에서 `clubDetail?.id`가 있고 error가 없을 때만 `registerDetailVisit({ pathname, clubId })`를 호출한다. 라우트 파라미터가 동아리 이름일 수 있으므로 파라미터를 ID로 보내지 않는다.
2. Host는 `pathname`을 기준으로 이전 화면을 분류하고 `location.key`는 취소/ready 검증에 사용한다. 소개·사진·일정 탭과 hash/query 변경은 같은 방문이다.
3. 실제 상세 경로는 `routes/AppRoutes.tsx`의 `/club/:clubId`(LegacyClubDetailPage), `/clubDetail/:clubId`, `/clubDetail/@:clubName`(ClubDetailPage)을 기준으로 분류한다. `/map`은 별도 목적지라 설문 후보 없이 방문을 종료한다. 웹뷰 redirect는 목적지가 같은 상세이면 새 이탈로 만들지 않는다.
4. 상세에서 다른 상세로 이동하면 이전 방문을 후보 없이 끝내고 새 데이터 ID로 새 방문을 만든다. 같은 ID의 별칭 이동은 동일 방문으로 유지한다.
5. 마지막으로 성공 등록된 상세에서 `/` 또는 `/subscriptions`로 직접 이동한 경우만 후보를 만든다. 알 수 없는 URL→catch-all `/`의 경우 중간 navigation에서 방문을 이미 종료하므로 후보가 생기지 않는다.
6. 새 상세의 데이터가 늦게 도착하면 pathname과 해당 요청의 club ID를 확인한 등록만 수용한다. 이미 떠난 화면의 뒤늦은 등록은 버린다.
7. 한 번 떠난 방문은 즉시 consumed 처리한다. 뒤로가기로 같은 상세에 돌아오면 새 방문이며, 최종 노출 제한은 서버가 판단한다.
8. 라우트 observer와 페이지의 등록은 controller에 저장한 값으로 결합한다. cleanup에서 submit/dismiss/이탈 발생을 하지 않는다. 기존 체류시간 수집 훅은 별도로 유지한다.

사용자가 설문을 보는 중 새 navigation을 하면 닫는다. POP을 막거나 synthetic history entry를 추가하지 않으며 네이티브 웹뷰 종료 인터셉트도 도입하지 않는다.

### 11.6 응답 검증·오류 상태의 종료 규칙

TypeScript 타입 선언만으로 외부 JSON을 신뢰하지 않는다. eligibility 응답에 대해 아래 작은 type guard를 작성한다. 새 schema 라이브러리는 추가하지 않는다.

- eligible는 boolean. false이면 prompt를 읽지 않고 종료한다. 알 수 없는 reason도 미노출로 처리한다.
- true이면 prompt의 id/title이 비어 있지 않고 triggerType/audience가 요청과 일치하며 active=true여야 한다.
- 평점은 1~3개, 알려진 enum, 중복 없음, label 비어 있지 않음, requiresFollowUp boolean이어야 한다. 잘못된 문항은 전체 미노출로 처리한다.
- followUp=null인데 후속 질문을 요구하는 평점이 있으면 미노출한다. 전부 즉시 제출 평점이면 null을 허용한다.
- followUp이 있으면 reasonOptions는 배열, 활성 옵션의 ID/label 유효·중복 없음·최대 8개, commentMaxLength는 0~500 정수여야 한다.
- reasonOptions가 비어 있으면 사유 그룹을 숨긴다. commentMaxLength=0이면 의견 입력과 카운터를 숨긴다. 두 입력이 모두 없더라도 후속 화면은 평점 확인과 제출 버튼을 제공한다.
- 서버 질문 문구가 빈 값이면 사유 질문은 '어떤 점이 아쉬웠나요?', 의견 label은 '추가 의견 (선택)'을 사용한다. 이 문구는 결손 필드용 UI 기본값이며 저장할 사유 ID/label을 생성하지 않는다.
- 제출 성공은 2xx와 유효한 responseId가 함께 있어야 한다. message만 없으면 기존 감사 문구를 사용한다. responseId가 없는 성공 응답은 unknownOutcome이다.

| 응답 분류 | 다음 상태 | 사용자 행동 및 추가 API |
| --- | --- | --- |
| 2xx + responseId | 완료 | 현재 세션·현재 화면일 때만 감사 Toast. submit 후 dismiss 없음 |
| 400 / 904-12 | validationError | '의견 길이를 줄여 다시 보내주세요', 평점/사유 고정, 의견 수정 후 재제출 가능. 빈 의견에서도 거절되면 닫기만 제공 |
| 400 / 904-9, 그 밖의 400 | unavailable | '질문이 변경되어 전송하지 못했어요', 닫기만. stale 문항 자동 재조회/재제출 없음 |
| 404 / 904-8 | unavailable | '지금은 이 질문에 응답할 수 없어요', 닫기만 |
| 401, 403 / 700-5 | unavailable | 종료 안내, 새 인증으로 재전송하거나 로그인 강제 이동하지 않음 |
| network/timeout, 5xx, 미분류 실패, 성공 본문 불명 | unknownOutcome | '전송 결과를 확인하지 못했어요', 읽기 전용 입력·닫기만. 자동/수동 재전송 모두 금지 |

닫기 handler는 상태로 결정한다. rating/followUp 및 저장 전 검증 거절인 validationError에서는 dismiss를 한 번 시도한다. submitting/unknownOutcome/unavailable/success에서는 dismiss하지 않는다. dismiss와 submit의 pending Promise는 session ID로 분리한다.

사용자가 submitting에서 닫아도 진행 중 요청은 취소하지 않는다. 네트워크 결과가 도착할 때까지 추가 행동 피드백을 허용하지 않되 UI는 즉시 사라진다. 결과 도착 후 세션을 정리하며 Toast/재오픈은 하지 않는다. 제출 timeout은 10초, dismiss는 3초로 고정한다.

### 11.7 레이아웃·포커스 구현값

- Dialog는 flex column, header/body/footer 구조다. header/footer는 shrink:0, body는 min-height:0 및 overflow-y:auto다. 의견 textarea의 자체 스크롤과 body 스크롤을 함께 검증한다.
- 최대 높이는 `calc(100dvh - 32px - env(safe-area-inset-top) - env(safe-area-inset-bottom))`, 100vh fallback을 둔다. VisualViewport가 있으면 height와 offsetTop 변화에 대응하는 전용 변수로 Dialog 위치·높이를 제한한다. resize/scroll 리스너는 cleanup한다.
- 375px 이하에는 padding 20px, 그 이상 24px. 사유는 500px 이하 1열, 그 이상 2열이며 긴 문구는 줄바꿈한다. 높이를 고정해 자르지 않는다.
- 입력·보조 글자는 gray[800] 이상을 사용한다. 브랜드 orange 배경/흰 16px 글자 조합을 필수 CTA에 쓰지 않고 기존 어두운 Button을 유지한다.
- 포커스 복귀는 공통 useFocusTrap의 기존 동작을 우선한다. 종료 다음 RAF에서 현재 focus가 body이거나 분리된 노드일 때만 `#feedback-route-focus-anchor`에 preventScroll focus한다. Host에 pathname별 갱신되는 visually-hidden 안내와 tabIndex=-1인 anchor를 두며 다른 모달이 열려 있으면 복귀를 건너뛴다.
- 후속 화면은 title에 tabIndex=-1를 주고 단계 전환 다음 effect에서 focus한다. 자동으로 textarea를 focus해 모바일 키보드를 강제로 열지 않는다.

### 11.8 배포 설정과 관측

`constants/feedbackPrompt.ts`에 두 build-time flag를 둔다. `VITE_FEEDBACK_PROMPT_ADMIN_ENABLED === 'true'`, `VITE_FEEDBACK_PROMPT_USER_ENABLED === 'true'`만 활성으로 해석하고 미설정은 false다. Vite env 타입 선언과 환경변수 예시 문서도 추가한다. Storybook은 flag와 별개로 UI를 직접 렌더링한다.

flag가 꺼진 흐름은 후보 등록/identity 생성/API 호출을 하지 않는다. build-time flag 변경은 재배포가 필요하므로 즉시 중단은 서버 active=false를 사용한다. 설정 API 역시 이번 사용자 UI에 노출하지 않는다.

신규 Mixpanel 제품 이벤트는 이번 범위에 추가하지 않는다. 기존 만족도 이벤트의 실제 표시 시점만 보존한다. 개발 오류 관측은 기존 Sentry를 사용하되 자유 의견·사유 본문·토큰·anonymousClientId를 extra/breadcrumb에 넣지 않는다. 로그에는 stage, triggerType, HTTP status 정도만 기록한다.

### 11.9 파일별 작업 및 테스트 명세

| 작업 | 추가/수정 파일 | 필수 증거 |
| --- | --- | --- |
| DTO/transport | types/feedbackPrompt.ts, apis/feedbackPrompt.ts, utils/feedbackPromptTransport.ts | 래퍼·빈 응답·1/2/3평점·commentMaxLength=0·인증 고정 테스트 |
| 세션/identity | feedbackPromptSession.ts, feedbackPromptIdentity.ts, useFeedbackPromptStore.ts, storageKeys.ts | 동기 잠금·event dedup·잘못된 UUID·저장 불가·불명확한 결과 재전송 0회 |
| 공통 overlay | useOverlayRegistryStore.ts, useOverlayRegistration.ts, Modal, BottomSheet, Popup | 일반 overlay 기본 동작 유지·StrictMode 등록 해제·설문 자기 차단 없음 |
| 만족도 통합 | useSurveyCoordinatorStore.ts, useSatisfactionSurvey.ts, SatisfactionModal | ready 등록 순서가 역전돼도 기존 설문 우선, suppressed에서 snooze 기록 없음 |
| 관리자 | useClubInfoEdit.ts, RecruitEditTab.tsx, useLogout.ts, LoginTab.tsx | 저장 성공/실패·개별 저장 제외·인증 바뀐 후 요청 0회 |
| 사용자 라우트 | useClubDetailExitFeedback.ts, ClubDetailPage.tsx, MainPage/SatisfactionModal, SubscriptionsPage, App.tsx | 실 ID·일정 탭·별칭·catch-all·느린 응답·POP·중간 다른 경로 |
| 기존 상세 호환 | LegacyClubDetailPage.tsx | `/club/:clubId` 이탈 등록, 기존 앱 링크에서도 같은 API 계약 |
| 화면 | FeedbackPromptDialog/FollowUp/Host, 인접 styles/stories/tests | 긴 문구·1/2/3평점·0/8사유·진행 중 닫기·모바일 스크롤 |
| 설정 | constants/feedbackPrompt.ts, Vite env 선언, 환경 예시 | 두 flag false이면 API 0회, 관리자만 켜면 사용자 API 0회 |

테스트에서 QueryClient는 매 테스트 새로 생성하고 retry를 끈다. fake timers/RAF를 제어해 ready 1초·조회 5초·제출 10초·닫기 3초 경계를 검증한다. MSW 요청 카운터와 payload 검사를 통해 '화면이 한 번 보였다'뿐 아니라 쓰기 API 횟수를 확인한다. store/controller reset은 테스트 전용으로 제공하고 프로덕션 cleanup에 연결하지 않는다.

설문 회귀 테스트는 상세 이탈 없는 메인 최초 진입, 두 기능 flag=false, 메인 재방문에도 기존 SatisfactionModal이 원래 자격 정책대로 동작하는 경우를 반드시 포함한다. 한 설문을 응답/닫은 직후 다른 설문을 연속 표시하지 않도록 해당 navigation의 패배한 후보는 복구하지 않는다.

MSW 정상 fixture는 백엔드 seed와 같은 enum/field shape를 사용한다. 실제 서버 검증은 운영 DB 대신 테스트 환경의 새 익명 ID와 테스트 관리자 계정으로 수행한다. 첫 eligibility=true 뒤 동일 조건의 재조회가 SHOWN_COOLDOWN으로 막히는지 확인하고, 새 식별자로 응답/dismiss 시나리오를 나눠 실행한다. 현재 조회 자체가 쓰기이므로 운영에서 단순 확인용 호출을 반복하지 않는다.

## 12. 리뷰 결과와 착수 판단

| 발견한 문제 | 보완 결과 |
| --- | --- |
| 3개 평점 고정 가정 | 서버 validator 기준 1~3개, 동적 열과 fixture 명시 |
| followUp null/0자/빈 사유 처리 없음 | 런타임 검증·숨김·기본 문구 규칙 확정 |
| 5xx에서 수동 재시도 가능 여부 모호 | unknownOutcome의 재전송·dismiss 금지, 닫기만 허용 |
| secureFetch 갱신 중 다른 세션 신원으로 요청 가능 | 캡처 토큰 transport 및 authEpoch 취소 명시 |
| 동일 시점 설문 경쟁을 effect 순서에 의존 | 목적지 ready handshake 및 단일 owner 획득 절차 확정 |
| Modal만 보면 메인 Popup을 놓침 | Modal/BottomSheet/자체 Popup 등록 범위 명시 |
| 뒤늦게 뜨는 다른 overlay | 활성 요청 취소/미제출 dismiss/제출 결과만 유지 규칙 확정 |
| effect cleanup의 StrictMode 중복 쓰기 | 이탈은 라우트 observer에서만, cleanup 네트워크 금지 |
| 모바일 scroll과 touch-action:none 충돌 | 하위 pan-y만 추가하지 않고 선택적 Modal prop으로 상위 경로 수정 |
| 기준 없는 최초 등록 트리거 | 이번 완료 범위에서 제외하고 별도 후속으로 명시 |
| 활성 seed로 인한 즉시 공개 가능성 | 기본 false인 관리자/사용자 flag 및 단계별 활성화 확정 |
| `/club/:clubId`의 별도 Legacy 화면 누락 | 신규·기존 상세 모두 방문 등록과 회귀 테스트에 포함 |

문서 수준의 미결 구현 선택지는 위 기본값으로 해소했다. 착수 가능 범위는 기존 백엔드 계약을 유지하는 관리자 수정·모집 저장·사용자 이탈 세 가지다. 실제 서버 배포, 운영 문항 확인, 모바일 실기기와 접근성 검증은 출시 전 실행해야 할 조건이며 완료됐다고 간주하지 않는다. 최초 등록·학생 토큰 통합·응답 멱등성 개선은 명시적인 후속 범위다.

## 13. 구현 기록 (2026-09-16)

아래 항목을 프론트엔드에 구현했다.

- `types/feedbackPrompt.ts`, `apis/feedbackPrompt.ts`와 런타임 문항 검증으로 eligibility, 응답, dismiss 계약을 분리했다. 문항의 평점 수·중복·후속 입력 제한이 계약과 다르면 표시하지 않는다.
- 일반 사용자는 localStorage의 영속 UUID만 사용하고, 관리자는 저장 성공 시점의 access token을 캡처해 별도 요청으로 전송한다. 설문 요청은 `secureFetch`의 refresh/replay 경로를 사용하지 않는다.
- 공통 `FeedbackPromptDialog`는 서버 문구·평점·사유·의견 길이를 동적으로 표시한다. 후속 질문이 없는 평점은 클릭 한 번으로 제출하며, 닫기 시에는 dismiss를 best-effort로 기록한다.
- `FeedbackPromptHost`가 실제 동아리 ID가 등록된 상세 방문에서 홈 또는 구독 화면으로 이동할 때만 사용자 설문 후보를 만든다. 신규 및 Legacy 상세 경로를 모두 등록한다.
- 관리자 기본정보·모집정보의 대표 저장 성공 callback에서만 후보를 만들며, 저장 실패·링크/태그 개별 저장은 제외했다.
- `VITE_FEEDBACK_PROMPT_ADMIN_ENABLED`, `VITE_FEEDBACK_PROMPT_USER_ENABLED`가 정확히 `true`일 때만 각 흐름을 활성화한다. 미설정 상태는 API를 호출하지 않는다.

자동 검증은 문항 계약(1개 평점, 후속 입력 없음, 중복 평점, 잘못된 제한)과 익명 ID 생성·지속성을 포함한다. 전체 Jest 실행 결과는 59 suites, 482 tests passed였다. 운영 API, 활성 문항, 모바일 실기기, 접근성 수동 검증은 별도로 완료해야 한다.

### 리뷰 보완 (2026-09-16)

- eligibility 요청 전에 단일 슬롯을 선점하고 제출 중에도 새 후보를 막아, 여러 행동이 겹쳐도 SHOWN 조회가 중복되지 않게 했다.
- 제출 중 닫기는 UI만 닫고 dismiss를 보내지 않는다. 응답 요청이 완료될 때까지 전역 제출 잠금을 유지한다.
- 공통 Modal에 overlay 종류를 표시하고, blocking 또는 기존 survey가 열려 있으면 피드백 설문을 열지 않는다. 기존 만족도 모달은 survey로 표시한다.
- 상세의 query/hash 변경은 방문을 소진하지 않는다. catch-all의 replace 이동은 사용자 이탈 후보에서 제외한다.
