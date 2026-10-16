# 모아동 우체통 — 백엔드/개발자 포털 전달 사항

작성일: 2026-08-10 (백엔드 1차 회신 반영)
작성 배경: 프론트(React)에서 우체통 화면을 MSW 목으로 먼저 구현했다. **응답 형태를 프론트가 임의로 정했으므로**, 실제 API가 이 문서와 다르면 프론트를 그에 맞춰 고쳐야 한다.

## 백엔드 회신 1차 (→ 프론트 반영 완료)

| 변경 | 프론트 대응 |
|---|---|
| 경로 `/api/feedback/**` → **`/api/student/feedback/**`** (`JwtAuthenticationFilter` 500 블로커 때문) | base URL 상수 1곳 변경 |
| **`PATCH .../received/{letterId}/read`** 신설 | 상세 진입 시 호출부 추가 |
| 운영 상태 3단계 + 전이 API 추가 | 사용자 응답은 2단계 유지 → **영향 없음** |
| 학생 토큰으로 신원 확정 | `studentFetch` 신설, 발급·저장·`Bearer` 부착 |

### 백엔드 회신 2차 (→ 반영 완료)

| 변경 | 프론트 대응 |
|---|---|
| 새 편지 발행 요청에서 **`sendToAll` 제외** — `{ category, title, body, sendPush }` | 영향 없음 (포털 전용) |
| 발행 응답 `{ letterId, pushSent, pushSuccessCount }` | 영향 없음 (포털 전용) |
| **초안(임시저장) API 4개 추가** | 영향 없음. 단 **초안이 사용자 목록에 노출되지 않아야 함** |
| 이미지 상한 **10MB 확정** (시안의 5MB가 오기) | 첨부 input에 `ALLOWED_IMAGE_TYPES` · `MAX_FILE_SIZE` 적용 |
| **답장 본문도 마크다운** (서버 변경 없음) | `REPLY` plain text 분기를 **되돌림** → 분류 구분 없이 마크다운 |

### 백엔드 회신 3차 (→ 문서 반영 완료)

| 변경 | 프론트 대응 |
|---|---|
| 이미지 업로드 엔드포인트 **2개 완료** (학생 presigned / 어드민 멀티파트) | ✅ **연결 완료** — `uploadFeedbackImages` 신설, `images`에 `finalUrl` 전달 |
| 초안 API 4개 시그니처 확정 | 영향 없음 (포털 전용) |
| 보낸 사람 식별자 `user_ + UUID 앞 8자리`로 확정 | 영향 없음 (운영 화면 전용) |

### 백엔드 회신 4차 — 최종 계약 (PR #1908, `develop/be` 대상)

**백엔드 구현 완료.** 계약을 대조한 결과 프론트가 이미 맞춘 것과 고친 것은 아래와 같다.

| 항목 | 결과 |
|---|---|
| 경로 `/api/student/feedback` | 이미 일치 |
| 모든 요청에 학생 토큰 (보내기 포함) | 이미 일치 — `uploadFeedbackImages`까지 `studentFetch` |
| 목록 응답 봉투 `{ letters }` · `{ feedbacks }` | 이미 일치 |
| 상세 조회는 읽음 처리를 하지 않음 → `PATCH .../read` 별도 | 이미 일치 |
| 확장자 6종 · 10MB · 4장 상한 | 이미 일치 (`ALLOWED_IMAGE_TYPES` · `MAX_FILE_SIZE`) |
| `myFeedback`이 `{ id, type, content, images, status, createdAt }` | **수정** — `SentFeedback`과 같은 형태로 맞춤 |
| `904-7` (429, 업로드 URL 발급 과다) 신규 | 실패로 처리되어 전송이 중단되고 트래킹에 남는다. 사용자 문구는 토스트 머지 후 (§9) |

`904-7`은 studentId·IP 각각 10분 40건 창이다(4장씩이면 10회). 정상 사용자는 닿지 않는다.

관련 브랜치
- 프론트 구현: `feature/letterbox` (`develop-fe` 계열)
- 백엔드 구현: PR #1908 (`develop/be` 대상)
- 포털 작업선: `develop/be`

---

## 백엔드 착수 체크리스트

현재 백엔드에 **`feedback` 도메인 자체가 없다.** 아래가 전부 신규 작업이다.
(현재 패키지: analytics, anthropic, calendar, club, fcm, gemma, global, log, media, sse, user)

| # | 작업 | 비고 |
|---|---|---|
| ~~0~~ | ~~사용자 식별 방식 확정~~ | ✅ 학생 토큰으로 결정, 프론트 구현 완료 (§0.5) |
| 1 | `feedback` 도메인 (엔티티 · 레포 · 서비스) | 3개 축은 §1 참조 |
| 2 | `POST /api/student/feedback` | 편지 보내기 |
| 3 | `GET /api/student/feedback/received` (+`?category=`) | 받은 편지 목록 |
| 4 | `GET /api/student/feedback/received/{letterId}` | 상세. `REPLY`면 원본 피드백 동봉 |
| 5 | `GET /api/student/feedback/sent` | 보낸 편지 목록 |
| 6 | `GET /api/student/feedback/sent/{feedbackId}` | 보낸 편지 상세 |
| 7 | `PATCH /api/student/feedback/received/{letterId}/read` | 읽음 처리. **멱등이어야 함** |
| 8 | `GET /api/admin/feedback` | ⚠️ **경로 규약 필수** (§0) |
| 9 | `POST /api/admin/feedback/{id}/reply` | 답장 발행 + FCM 푸시 |
| 10 | `POST /api/admin/feedback/letters` | 새 편지 발행. 필드 5개 (§3) |
| 11 | 상태 전이 API (운영) | 3단계 유지용. 프론트 영향 없음 |
| ~~12~~ | ~~임시저장(초안) API~~ | ✅ 4개 완료. 시그니처 §3 |
| ~~13~~ | ~~이미지 업로드~~ | ✅ 엔드포인트 2개 완료 §3. **프론트 연결도 완료** |
| ~~14~~ | ~~답장 도착 FCM 푸시 (⑫)~~ | ✅ 앱·웹 토큰 주입 완료. **앱 릴리즈 후 우체통을 배포하면 바로 동작** (§7) |

**의존 순서**: 1 → 2~7 (사용자 흐름이 먼저 돌아감) → 8~12 (운영이 답장·발행 가능) → 13·14

이미지는 **편지 저장 API가 받지 않는다.** 업로드 API로 올려 URL을 받고,
그 URL을 본문 마크다운(`![](...)`)에 삽입하는 방식이다 (⑭ 안내 문구 기준).

✅ **엔드포인트 2개 구현 완료.** 인증 주체가 달라 경로를 나누고 서비스 계층만 공유한다.

### 사용자 첨부 — `POST /api/student/feedback/images/upload-url`

학생 토큰. presigned 방식이라 **프론트의 `uploadToStorage`를 그대로 재사용**한다.

```jsonc
// 요청 — 배열
[{ "fileName": "a.jpg", "contentType": "image/jpeg" }]

// 응답 data — 기존 feedApi.getUploadUrls와 동일한 배열
[{ "presignedUrl": "...",
   "finalUrl": "https://.../feedback/{studentId}/xxxx.jpg",
   "requiredHeaders": { "Content-Type": "image/jpeg" },
   "success": true, "failureReason": null }]
```

DTO가 `media`의 `UploadUrlRequest` / `PresignedUploadResponse` 그대로다.
`requiredHeaders`는 프론트 `PresignedData` 타입에 없지만 추가 필드라 무시된다.

**⚠️ 프론트가 반드시 처리해야 할 규약 2가지** (`generateFeedUploadUrls`와 동일):
- **항목별 부분 성공** — 실패한 항목만 `success: false`, 나머지는 정상 발급된다. 배열을 항목 단위로 확인해야 한다.
- **응답 배열 길이가 요청 수와 다를 수 있다** — 4장 초과 요청 시 앞 4건만 발급하고 마지막에 `TOO_MANY_FILES` 항목을 덧붙인다. 인덱스로 파일과 짝지을 때 주의.

발급 시점 제한은 느슨한 가드다. **진짜 상한은 `POST /api/student/feedback` 저장 시점**이라 1장씩 4번 나눠 호출해도 저장에서 막힌다.

### 어드민 본문 이미지 — `POST /api/admin/feedback/letters/images`

`DEVELOPER`. **멀티파트**(`multipart/form-data`, part 이름 `file`)다.

```json
{ "imageUrl": "https://.../feedback/letters/2026/08/{uuid}-name.jpg" }
```

⑭는 개발자 포털 화면이라 **React 프론트가 호출하지 않는다.** 포털은 이미 연결 완료.
(React에서 이 화면을 만들게 되면 presigned 배열 형태로 바꿔달라고 요청하면 된다.)

### 공유 범위

`AwsProperties` · `ServerProperties` · `ClubImageUtil.isImageExtension` · `R2ImageUploadService`는 재사용한다.
presign 호출부가 `CloudflareImageService`와 중복이지만, 공용 유틸로 빼려면 기존 미디어 코드를 건드려야 해서
**별도 리팩터링 건으로 남겼다.**

**2~7은 모두 학생 토큰(`Authorization: Bearer`)으로 호출된다.** 신원은 토큰의 `sub`(랜덤 UUID)다.

---

## 0. 가장 중요한 것 — 경로 규약

`SecurityConfig`가 이렇게 되어 있다.

```java
.requestMatchers("/api/admin/**").hasRole("DEVELOPER")
.anyRequest().permitAll()
```

**운영용 피드백 API는 반드시 `/api/admin/feedback` 아래에 둘 것.**
`/api/admin/**` 밖에 두면(예: `/api/student/feedback/admin`, `/api/dev/feedback`) `anyRequest().permitAll()`에 걸려 **인증 없이 그대로 뚫린다.**
피드백은 사용자가 쓴 개인적인 의견이라 유출되면 곤란하다.

참고: `/dev/index.html` 자체는 지금도 누구나 열 수 있다(정적 리소스, permitAll).
데이터를 지키는 건 페이지 숨김이 아니라 API 권한이므로, 위 규약만 지키면 된다.

---

## 0.5. ✅ 해결됨 — 사용자 식별 (학생 토큰)

이전 판에서 "최우선 미해결"로 올렸던 항목. **결정과 프론트 구현이 끝났다.**

`받은 편지` · `보낸 편지`는 사용자별 데이터인데 프론트 요청에 신원이 없던 문제를,
백엔드에 이미 있던 **익명 학생 토큰**으로 해결했다.

```java
@RequestMapping("/auth/student")
@PostMapping   // 랜덤 UUID를 sub로 쓰는 만료 없는 JWT
issueStudentToken()  →  StudentIssueResponse(String accessToken)
```

### 프론트가 구현한 것

`frontend/src/apis/auth/studentFetch.ts` (신규)

1. `localStorage[studentAccessToken]`에 토큰이 있으면 그대로 사용
2. 없으면 `POST /auth/student` → `data.accessToken` 저장
3. 모든 우체통 요청에 `Authorization: Bearer <token>` 부착
4. 401이 오면 **한 번만** 재발급 후 재시도 (만료는 없지만 서명 키 교체·환경 변경 대비)

`secureFetch`(동아리 관리자용)와는 별개다. 토큰에 만료가 없어 refresh 흐름은 없다.

⚠️ 이전 판에서 "`StudentUser.currentFcmToken`이 있으므로 ⑫ 답장 푸시도 이 신원으로 연결된다"고 적었는데 **틀렸다.**
`StudentUser`는 FCM 토큰을 등록할 때만 생기고, 웹뷰는 앱과 다른 studentId를 자체 발급한다.
→ 앱이 웹뷰에 자기 토큰을 주입하도록 고쳤고 웹은 그것을 우선 쓴다. §7 참조.

---

## 1. 도메인

백엔드에 `feedback` 패키지가 아직 없다 (현재: analytics, anthropic, calendar, club, fcm, gemma, global, log, media, sse, user).

개념이 **세 축**으로 나뉜다. 서로 다른 것이니 섞지 말 것.

| 축 | 값 | 쓰이는 곳 |
|---|---|---|
| 보내는 유형 `FeedbackType` | `BUG`(문제 신고) `FEATURE`(신규 기능) `QUESTION`(궁금한 점) `CHEER`(응원하기) | 사용자가 편지 쓸 때 |
| 받은 편지 분류 `LetterCategory` | `REPLY`(답장) `UPDATE`(업데이트) `STORY`(이야기) | 받은 편지함 필터 |
| 보낸 편지 상태 `SentFeedbackStatus` | `PENDING`(확인 중) `REPLIED`(답장 도착) | 보낸 편지함 태그 |

- `REPLY` 편지는 특정 피드백에 대한 답장이라 **원본 피드백과 연결**되어야 한다.
- `UPDATE` / `STORY`는 운영진이 전체에게 발행하는 편지다.

제약
- 본문 최소 10자, 최대 300자
- 사진 최대 4장 (presigned 업로드 연결 완료 — §3 참조)

---

## 2. 사용자용 API (프론트가 현재 호출 중인 형태)

응답은 기존 규약대로 `{ statuscode, message, data }` 래핑을 가정했다.

⚠️ **`Content-Type: application/json`을 반드시 붙일 것.** 프론트 공용 `handleResponse`가
`content-type`에 `application/json`이 없거나 `content-length: 0`이면 **본문을 파싱하지 않고 `undefined`를 반환한다.**
`204 No Content`로 응답하면 프론트는 성공했는지 알 수 없다.

### `POST /api/student/feedback` — 피드백 보내기
```jsonc
// req — images는 선택. 생략·null·[] 모두 허용
{ "type": "BUG",
  "content": "10자 이상 300자 이하",
  "images": ["https://.../feedback/{studentId}/xxxx.jpg"] }

// res data
{ "feedbackId": "..." }
```

`images`에는 **upload-url 응답의 `finalUrl`** 을 넣는다 (`presignedUrl` 아님).
`FeedbackCreateRequest.java:18` — `List<String> images`.

**검증에 걸리면 피드백 자체가 저장되지 않는다.** 사진만 빠진 채 저장되는 일은 없다.

| 상황 | HTTP | statuscode | message |
|---|---|---|---|
| 사진 5장 이상 | 413 | `601-3` | 이미지 파일이 최대치보다 많습니다. |
| URL 200자 초과 / 도메인 불일치 / 다른 학생 경로 | 400 | `601-8` | 올바르지 않은 파일 URL입니다. |
| PUT을 안 했거나 실패해 R2에 파일 없음 | 404 | `601-2` | 이미지 파일을 찾을 수 없습니다. |
| 10MB 초과 | 413 | `601-10` | 파일 용량이 제한을 초과했습니다. |
| content 10자 미만 / 300자 초과 | 400 | `BAD_REQUEST` | content : 내용은 10자 이상 300자 이하로 입력해주세요. |

**`404`(`601-2`)가 실전에서 제일 자주 난다.** presigned PUT이 조용히 실패했거나(만료 10분),
업로드 완료를 기다리지 않고 전송하면 걸린다. 서버가 저장 직전에 R2에 `HeadObject`로 존재를 확인한다.
→ 프론트는 **업로드를 모두 끝낸 뒤에 저장을 호출한다** (`useCreateFeedback`이 한 뮤테이션 안에서 순차 처리).

`601-10`일 때는 서버가 해당 객체를 R2에서 삭제하므로 **재업로드가 필요하다.**

### `GET /api/student/feedback/received?category=REPLY` — 받은 편지 목록
`category`는 선택. 없으면 전체.
```json
// res data
{ "letters": [
  { "id": "...", "category": "REPLY", "title": "...",
    "preview": "...", "createdAt": "ISO8601", "isRead": false }
] }
```
- `preview`: 목록에 한 줄로 보여줄 요약
- `isRead`: **false면 목록 항목 배경을 채워 안 읽음 표시**, 필터 칩에 빨간 점

### `GET /api/student/feedback/received/{letterId}` — 받은 편지 상세
```json
// res data
{ "id": "...", "category": "REPLY", "title": "...",
  "createdAt": "ISO8601",
  "body": "마크다운",
  "myFeedback": {            // category=REPLY 일 때만
    "id": "...", "type": "FEATURE", "content": "...", "createdAt": "ISO8601"
  } }
```
- `body`는 **분류와 무관하게 마크다운**이다 (`react-markdown`). 지원 문법은 §3의 어드민 에디터 툴바와 같다.
  답장(`REPLY`)도 포함이다 — 결정 경위는 §5-7 참조.
- `myFeedback`은 상세 화면의 "내가 보낸 편지" 인용 카드에 쓰인다. 클릭하면 `/feedback/sent/{myFeedback.id}`로 이동.

### `GET /api/student/feedback/sent` — 보낸 편지 목록
```json
{ "feedbacks": [
  { "id": "...", "type": "BUG", "content": "...",
    "status": "PENDING", "createdAt": "ISO8601" }
] }
```

### `GET /api/student/feedback/sent/{feedbackId}` — 보낸 편지 상세
위 항목과 동일한 객체 하나.

### `PATCH /api/student/feedback/received/{letterId}/read` — 읽음 처리
받은 편지 **상세를 연 시점에** 프론트가 호출한다. 응답 본문은 쓰지 않는다.

- **편지당 한 번만** 보낸다 (재조회로 컴포넌트가 다시 렌더돼도 중복 호출하지 않도록 막아둠)
- 성공하면 프론트가 받은 편지 **목록 쿼리만** 무효화한다 → 안 읽음 배경과 필터 칩의 점이 사라진다
- 상세 쿼리는 일부러 무효화하지 않는다. 하면 재조회 → 이펙트 재실행으로 **순환한다**
- 이미 읽은 편지에 다시 와도 호출될 수 있으니 **멱등**이어야 한다

---

## 3. 운영용 API (개발자 포털이 쓸 것)

시안: `11173:1014` (⑬ 개발자 페이지 — 받은 피드백 & 답장 발행)
프레임 이름에 디자이너 메모가 있다: *"여긴 개발자들이 쓰는 페이지라 디자인 필요 없어용"* → 픽셀 맞추기보다 기능 위주로.

### `GET /api/admin/feedback` — 받은 피드백 목록
테이블 컬럼이 곧 필요한 필드다.

| 컬럼 | 내용 |
|---|---|
| 유형 | 기능 요청 / 문제 신고 / 응원 / 문의 |
| 내용 | 본문 (한 줄 말줄임) |
| 보낸 사람 | `user_a3f9c2d1` — 익명 ID (§5-4) |
| 받은 날짜 | `7월 20일` |
| 상태 | `답장 대기` / `확인 중` / `답장 완료` |

- 사이드바 `받은 피드백` 항목에 **미답변 개수 뱃지**가 붙는다 → 카운트 필요
- 상태값이 사용자쪽 `PENDING/REPLIED`보다 하나 많다(`답장 대기`, `확인 중`, `답장 완료`). **운영 상태를 3단계로 둘지, 사용자에게는 2단계로 축약해 보여줄지 정해야 한다.**

### `POST /api/admin/feedback/{feedbackId}/reply` — 답장 발행
우측 패널이 요구하는 것:
```json
{ "title": "즐겨찾기한 동아리 알림, 이렇게 준비 중이에요",
  "body": "...",
  "sendPush": true }
```
- 발행하면 그 피드백을 보낸 사용자의 **받은 편지함에 `REPLY` 편지가 생성**되고, 원본 피드백 상태가 `답장 완료`로 바뀐다.
- `sendPush`가 true면 해당 유저에게 FCM 푸시. `fcm` 패키지가 이미 있으니 재사용.
- ⚠️ 이 `body`도 결국 사용자 상세에서 **마크다운으로 렌더된다.** 시안 ⑬의 답장 패널엔 툴바가 없지만
  저장되는 건 같은 편지이므로, 답장 본문도 마크다운으로 취급할지 정해야 한다 (§5).

### `POST /api/admin/feedback/letters` — 새 편지 발행 (⑭)

시안 `11175:1014` — 프레임 이름이 `⑭ 어드민 — 새 편지 발행 (마크다운 + 이미지)`다.

화면 구성: 좌측 마크다운 에디터(697px) + 우측 실시간 **미리보기**(300px), 하단에 이미지 업로드 영역.

필요한 필드
```json
{ "category": "UPDATE",              // 토글: 이야기 / 업데이트
  "title": "v1.4 — 고객의 소리함이 생겼어요",
  "body": "## ...\n![업데이트 화면](/uploads/letterbox-01.png)\n### ...",
  "sendPush": true }                 // '발행 시 푸시 알림 보내기'
```

시안엔 `전체 유저에게 발행` 체크박스도 있지만 **`sendToAll`은 넣지 않는다** — 대상 선택 UI가 없어
`false`의 의미를 정의할 수 없다. 항상 전체 발행으로 본다 (§5-6).

응답:
```json
{ "letterId": "...",
  "pushSent": true,          // sendPush 요청대로 푸시를 시도했는지
  "pushSuccessCount": 128 }  // 실제 전송 성공 건수
```
`pushSuccessCount`가 있으므로 **포털에서 "N명에게 발송됨" 같은 결과 표시가 가능하다.**
푸시 실패가 발행 실패는 아니라는 뜻이기도 하다 — 편지는 발행되고 푸시만 일부 실패할 수 있다.

- **임시저장** 버튼이 `발행하기`와 별도로 있다 → **초안 API 4개가 추가됐다** (아래).
- 헤더에 작성자 표시(`준서 · 운영팀`)가 있다.
- `sendToAll`이 체크박스라는 건 **전체 발행이 아닌 경우도 상정했다**는 뜻인데, 시안에 대상 선택 UI는 없다 → §5 참조.

**에디터 툴바 = 지원해야 할 마크다운 문법의 정의다.**
```text
H2 · H3 · B · I · 링크 · 인용 · 목록 · 구분선 · 이미지
```

이미지 업로드 영역 안내 문구:
> `PNG · JPG · 최대 5MB — 업로드하면 본문에 ![]( ) 로 삽입돼요`

⚠️ **이 문구의 규격 부분은 실제 시스템과 다르다. 디자이너 정정이 필요하다.**

| | 시안 문구 | 실제 |
|---|---|---|
| 확장자 | PNG · JPG | **jpeg · jpg · png · gif · bmp · webp** (6종) |
| 최대 크기 | 5MB | **10MB** |

근거 — 프론트와 백엔드가 이미 같은 값으로 맞아 있다.
```ts
// frontend/src/constants/uploadLimit.ts
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/gif','image/bmp','image/webp']
```
```yaml
# backend/src/main/resources/application.yml
server.image.max-size: "10485760"      # 10MB
spring.servlet.multipart.max-file-size: "10MB"
```

이 상수는 `useClubImages` · `photoEditUtils` · `MobileBannerSection` 등 **기존 업로드 경로에서 이미 쓰이고 테스트도 있다.**
우체통만 PNG·JPG/5MB로 좁히면 서비스 안에 업로드 규약이 두 개가 된다. **기존 규약을 따르고 시안 문구를 고치는 쪽을 권한다.**

참고로 `ClubImageUtil.resizeImage`는 초과분을 **리사이즈해서 맞추는** 구조라, 5MB를 하드 리밋처럼 안내하는 것 자체가 실제 동작과 다르다.

### 초안(임시저장) API — 4개

⑭의 `임시저장` 버튼용. 전부 `/api/admin/feedback` 아래라 `ROLE_DEVELOPER`가 필요하다.
**포털 전용이므로 React 프론트는 호출하지 않는다.**

```text
POST   /api/admin/feedback/letters/drafts
GET    /api/admin/feedback/letters/drafts
PUT    /api/admin/feedback/letters/drafts/{draftId}
DELETE /api/admin/feedback/letters/drafts/{draftId}
```

```jsonc
// POST · PUT 요청 — 작성 도중 저장이라 필수값 검증 없음 (전부 null 허용)
{ "category": "UPDATE", "title": "...", "body": "## ...", "sendPush": true }

// POST · PUT 응답 data
{ "id": "...", "category": "UPDATE", "title": "...", "body": "...",
  "sendPush": true, "updatedAt": "ISO8601" }

// GET 응답 data — 최근 수정순
{ "drafts": [ /* 위 객체 */ ] }

// DELETE 응답 data: null
```

없는 초안에 `PUT`·`DELETE` → `404` · `904-5` `"편지 초안이 존재하지 않습니다."`

**발행 API와 결합하지 않았다.** 발행 성공 후 클라이언트가 `DELETE`를 호출하는 방식이고,
삭제 실패 시 포털이 "초안이 남아 있습니다"로 안내한다.

#### 초안이 사용자에게 노출될 수 없는 구조

컬렉션이 물리적으로 분리돼 있다.
```text
Letter.java:15       @Document("feedback_letters")
LetterDraft.java:20  @Document("feedback_letter_drafts")
```
받은 편지함을 담당하는 `FeedbackService`는 `LetterDraftRepository`를 **주입받지도 않는다**
(`FeedbackRepository`, `LetterRepository`, `FeedbackImageService`만 사용).
`GET /api/student/feedback/received`는 `LetterRepository`만 조회하므로 초안이 섞일 경로 자체가 없다.

같은 컬렉션에 상태 플래그를 두지 않은 이유가 이것이다 — **쿼리 조건 하나만 빠져도 쓰다 만 글이 전체 유저에게 노출된다.**

즉 이미지는 별도 업로드 API로 올린 뒤 **URL을 본문 마크다운에 삽입**하는 방식이다.
`body` 안에 이미지 경로가 들어가므로 편지 저장 API는 이미지를 따로 받지 않는다.

---

## 4. 개발자 포털 작업

파일: `backend/src/main/resources/static/dev/index.html` (약 175KB 단일 파일)

- 사이드바에 `받은 피드백` 추가 (현재: API 문서 / 동아리 관리 / 단어사전 / 홍보 게시판 / 배너 이미지 / FCM 알림 / 통계 Backfill / 이미지 변환 배치)
- **기존 `홍보 게시판` 섹션이 테이블 + 폼 구조라 거의 그대로 베낄 수 있다.**
- 레이아웃: 좌 사이드바 · 중앙 피드백 테이블 · 우 답장 작성 패널(370px)
- 답장 패널 구성: 원문 인용 → 제목 입력 → 본문 textarea → `발행하면 이 유저에게 푸시 알림 보내기` 체크박스 → `답장 발행` 버튼

주의: 이 워크스페이스(`feature/letterbox`)와 `develop/be`의 `index.html`이 이미 다르다(174,825 vs 177,585 바이트). **포털은 `develop/be`에서 작업할 것.** 프론트 브랜치에서 건드리면 충돌한다.

---

## 5. 미결 — 정해야 할 것

1. ~~**이미지 업로드**~~ ✅ **백엔드·프론트 모두 완료.** 브라우저에서 실제 흐름까지 확인했다.
   ```text
   POST /images/upload-url  →  PUT ×2 (presignedUrl)  →  POST /feedback (images: [finalUrl])
   ```
   사진이 없으면 `upload-url` 호출 없이 `images`를 생략한다.
   `PresignedUploadResponse.requiredHeaders`는 `Content-Type` 하나로 고정이고
   백엔드에 확장 계획이 없다(`CloudflareImageService`가 `putObjectRequest.contentType()`만
   지정하므로 서명 대상은 host + Content-Type뿐). 프론트는 이 필드를 읽지 않고
   `file.type`을 직접 보내는데, presign 요청에도 같은 `file.type`을 실으므로 값이 어긋나지
   않는다. **두 지점이 갈라지면 R2가 403을 낸다** — 한쪽만 고치지 말 것.
2. ~~**읽음 처리 API**~~ ✅ `PATCH .../read` 신설, 프론트 호출부 연결 완료
3. ~~**운영 상태 3단계 vs 사용자 2단계**~~ ✅ 운영 3단계 + 전이 API 추가, 사용자 응답은 `PENDING`/`REPLIED` 2단계 유지. 프론트 영향 없음
4. ~~**보낸 사람 식별자**~~ ✅ **익명 ID로 확정, 구현 완료.**
   ```text
   user_a3f9c2d1     // "user_" + 학생 토큰 sub(UUID)의 앞 8자리
   ```
   학번은 내리지 않는다 — 서버가 학번을 알지 못하고(`StudentUser.studentId`가 랜덤 UUID), 알더라도 운영 화면에 노출할 이유가 없다.

   **시안의 `user_8842`(4자리)를 따르지 않았다.** 4자리는 1만 버킷이라 제보자 200명에서 충돌 확률 86%,
   500명이면 사실상 100%다. 서로 다른 학생이 같은 ID로 보여 **운영자가 동일인의 반복 제보로 오해한다.**
   8자리(32비트)면 1만 명에서도 충돌 1.2% 수준이다. ⑬ 프레임에 "여긴 개발자들이 쓰는 페이지라 디자인 필요 없어용"
   메모가 있어 자릿수 변경은 문제없다고 판단했다.
5. **모달 카피** — 작성 화면 이탈/저장 모달 문구가 시안에 **다른 기능 것(지원서 질문 삭제)으로 잘못 들어가 있다.** 디자이너 확인 필요. 프론트는 임시 문구로 넣고 `Todo` 주석을 달아뒀다.
6. ~~**`sendToAll` 해제 시 동작**~~ ✅ **필드를 빼기로 했다.** ⑭에 체크박스는 있지만 대상 선택 UI가 피그마 어디에도 없어서 `false`의 의미를 아무도 정의할 수 없다. 지금 넣으면 정의되지 않은 값이 API에 남는다. 대상 지정이 실제로 필요해지면 그때 추가한다. → §3의 요청 필드에서 제외.
7. ~~**답장 본문도 마크다운인가**~~ ✅ **마크다운이다** (백엔드 확정, 서버는 이미 그렇게 취급 중).
   프론트도 분류 구분 없이 마크다운으로 렌더한다.

   경위: 한때 피그마 근거로 `REPLY`만 plain text로 분기했다가 되돌렸다.
   근거였던 것은 ⑬ 답장 패널에 **에디터 툴바가 없다**는 점, ⑬ 목업 본문에 마크다운 문법이 없다는 점,
   렌더된 `편지 상세 — 답장`(11366:19211)에 볼드·제목이 없다는 점이었다.

   **남는 실질적 이슈 2가지** — 백엔드 결정을 따르되 확인이 필요하다.
   - ⑬ 답장 패널에 툴바가 없으므로 **운영자가 마크다운을 손으로 입력**해야 한다. 포털에 툴바를 넣을지 정해야 한다.
   - 서식 없이 쓴 평문에 `*`, `#`, 줄머리 `-`(뒤에 공백)가 섞이면 **의도치 않게 서식으로 먹는다.** (예: `*중요*` → 이탤릭)

### 문서에 명시 안 된 것 (프론트가 가정한 대로 두면 되는지 확인 필요)

- **정렬** — 목록 2종 모두 **최신순(`createdAt` 내림차순)** 을 가정했다. 프론트는 받은 순서 그대로 렌더한다.
- **페이지네이션** — 없다. 전체를 한 번에 받는다. 편지 수가 많아질 기능이면 커서/오프셋을 넣어야 하고, 그러면 프론트도 고쳐야 한다.
- **`preview` 생성 주체** — **서버가 잘라서 준다**고 가정했다. 프론트는 CSS 한 줄 말줄임만 한다. 서버가 전체 본문을 주면 목록이 무거워진다.
- **에러 응답 형태** — 프론트 `ApiError`가 `statusCode`/`statuscode`와 `message`를 읽는다. 404·400도 같은 봉투로 주는 게 안전하다.
- ~~**`body` 마크다운 허용 범위**~~ ✅ 시안 ⑭의 에디터 툴바가 곧 정의였다 (H2·H3·볼드·이탤릭·링크·인용·목록·구분선·이미지). 프론트 `BodyCard`에 해당 요소 스타일을 모두 넣었다.
  - 다만 **원본 HTML 허용 여부**는 여전히 미결이다. `react-markdown`은 기본적으로 raw HTML을 막으므로, 지금 상태에서 `<script>`가 들어와도 렌더되지 않는다. **막힌 상태를 유지하는 것을 권한다.**

---

## 6. 프론트 현황 (참고)

`develop-fe`에 머지 완료. **실제 API를 호출한다** — MSW 목은 제거됐다.

| 화면 | 라우트 |
|---|---|
| 받은/보낸 편지 목록 | `/feedback` (`?tab=sent`) |
| 유형 선택 | `/feedback/write` |
| 편지 작성 | `/feedback/write/:type` |
| 전송 완료 (2초 뒤 자동 복귀) | `/feedback/complete` |
| 받은 편지 상세 | `/feedback/letters/:letterId` |
| 보낸 편지 상세 (읽기 전용) | `/feedback/sent/:feedbackId` |

진입점: 메뉴 페이지 `모아동 우체통` 카드 → `/feedback`

API: `frontend/src/apis/feedback.ts` (학생 토큰을 붙이는 `frontend/src/apis/auth/studentFetch.ts` 경유)
쿼리 훅: `frontend/src/hooks/Queries/useFeedback.ts`
타입: `frontend/src/types/feedback.ts` ← **이 문서의 계약과 1:1 대응**

실제 응답이 이 문서와 다르면 위 API 모듈과 타입을 고치면 된다.

로딩·에러 UI, Mixpanel 트래킹(`PAGE_VIEW` 6종 + `USER_EVENT` 4종), 테스트(`feedback` API 6 · `formatTimeAgo` 4), `FeedbackTag` 스토리까지 붙어 있다.

### 프론트에서 아직 안 만든 시안

우체통 흐름과 **독립적**이라 미뤄둔 것들이다. 없어도 편지를 읽고 쓰는 흐름은 끊기지 않는다.

- ~~**⑩ 만족도 모달 (`11170:1014`)** · **⑪ App Store 리뷰 이동 (`11177:1014`)**~~ ✅ `SatisfactionModal` + `useSatisfactionSurvey`로 구현했다. 만족하면 스토어 리뷰로, 아니면 `/feedback/write`로 보낸다.
- ~~**사진 그리드 (보낸 편지 상세)**~~ ✅ presigned 업로드(`uploadFeedbackImages`)와 함께 붙였다.
- **⑫ 답장 도착 푸시** — 앱·웹 토큰 주입까지 끝났다. 앱 릴리즈 후 우체통을 배포하면 동작한다 (§7).

## 7. ⑫ 답장 도착 푸시 — 앱 릴리즈 후 배포 (결정)

**앱 토큰 주입이 앱·웹 양쪽에 들어갔고 앱 릴리즈도 끝났다.** 우체통을 배포하면 답장 푸시가
바로 동작한다. 다만 푸시를 눌러서 편지가 열리는 건 별개 축이다 — §7-1.

우체통 프로덕션 배포를 **앱 릴리즈 뒤로 맞추기로 했다.** 앱보다 먼저 내면 그 사이
웹뷰 자체 신원으로 쌓인 편지가 앱 업데이트 시점에 유실되는데, 릴리즈가 얼마 안 걸려
기다리는 쪽을 택했다. 그래서 **신원 이관 API는 필요 없다.**

아래 내용은 왜 이 순서여야 하는지의 근거로 남긴다.

### 지금도 되는 푸시 / 안 되는 푸시

푸시가 세 종류인데 대상 선정 방식이 다르다. **둘은 지금도 정상 동작한다.**

| 푸시 | 대상 선정 | 상태 |
|---|---|---|
| 동아리 구독 알림 | FCM 토큰(기기) | 정상 |
| 전체 발행 편지 (`sendBroadcastPush` → `fcmAdminService.sendToAll`) | 등록된 전 토큰 배치 | 정상 |
| 내 피드백의 답장 (`sendReplyPush`) | `StudentUser.findByStudentId(studentId).currentFcmToken` | **안 감** |

앞의 둘은 studentId를 쓰지 않으므로 이 결정과 무관하다.

### 답장 푸시만 안 되는 이유

`StudentUser` 문서는 `StudentFcmTokenService.upsertStudentUser()`에서만 생기고, 그건
`rotateFcmToken()`(= `PUT /api/student/fcm-token`)에서만 불린다. 우체통은 `StudentUser`를
만들지 않는다.

앱은 웹뷰 껍데기다(`app/index.tsx` → `HomeWebViewScreen` → `/webview/main` → 웹 SPA 루트).
웹뷰의 localStorage는 앱의 AsyncStorage와 별개라, 웹뷰는 앱과 **다른 studentId**를 자체 발급한다.
그 studentId에는 `StudentUser`가 없으므로 `currentFcmToken`을 못 찾고 아래 로그만 남는다.

```text
Reply push skipped. no fcm token for feedback letter={}
```

운영 포털에서 답장 발행 시 `pushSent: false`가 항상 뜨는 게 정상이다. 버그가 아니다.

**편지 수신 자체는 정상이다.** 받은 편지함은 `letterRepository.findInboxByStudentId(studentId)`로
조회하는데, 웹뷰 안에서는 신원이 일관되므로 답장이 목록에 그대로 뜬다. 알림만 없다.

### 나중에 붙일 때 필요한 것

1. ✅ **앱 — 웹뷰에 학생 토큰 주입** (`ui/home/home-webview-screen.tsx` 한 곳) — **완료**
   `ensureAccessToken()`(`services/auth-token.service.ts`)을 기다렸다가
   `injectedJavaScriptBeforeContentLoaded`로 `window.__MOADONG_STUDENT_TOKEN__`에 넣는다.
   `sessionLoading`을 기다렸다가 URL을 만드는 기존 패턴과 같다.
   메뉴 → `/feedback`은 React Router 클라이언트 라우팅이라 같은 웹뷰 문서 안에서 일어난다.
   그래서 이 한 곳이면 우체통 전체가 커버된다.
   **주입 스크립트에 origin 가드가 필요하다.** 웹뷰가 로드하는 모든 문서에서 실행되므로
   외부 사이트로 이동하면 베어러 토큰이 노출된다.

   앱 구현 시 두 가지가 추가로 반영됐다.
   `ensureAccessToken()`에 single-flight 가드를 넣었다. 스플래시 아래에서 부트스트랩과
   홈 화면이 동시에 마운트되는데, 신규 설치처럼 저장된 토큰이 없으면 `getOrCreateAuthSubject()`가
   병렬 진입해 서로 다른 UUID 두 개를 만들고 `/auth/student`가 두 번 호출된다.
   FCM은 한쪽으로 등록되고 웹뷰엔 다른 쪽이 주입돼 고치려던 버그가 그대로 남는다.
   (웹의 `issueStudentTokenOnce`와 같은 결함이다)
   그리고 토큰 조회 실패 시에도 웹뷰가 뜨도록 별도 플래그로 게이트했다. 실패하면 주입만
   건너뛰고 웹이 자체 토큰으로 폴백한다.

2. ✅ **웹 — 주입 토큰 우선** (`frontend/src/apis/auth/studentFetch.ts`) — **완료**
   `window.__MOADONG_STUDENT_TOKEN__` → localStorage → 신규 발급 순.
   localStorage가 앞서면 브리지 이전에 자체 발급해둔 토큰이 계속 이긴다.

3. ~~**백엔드 — 신원 이관 엔드포인트**~~ — **불필요해졌다. 만들지 않아도 된다.**
   우체통 배포를 앱 릴리즈 뒤로 맞추기로 해서 신원이 갈리는 구간 자체가 없다.
   (앱보다 먼저 냈다면 옛 토큰으로 소유권을 증명해 `Feedback.studentId`와 편지 수신자를
   옮기는 일회성 API가 필요했다)

### 7-1. 푸시가 **가는 것**과 눌러서 **열리는 것**은 다른 축이다

위까지는 전부 **대상 선정**(누구에게 보낼지) 이야기다. 그게 풀려도 푸시를 탭했을 때
편지가 열리지는 않는다. 앱 릴리즈 후 실제로 이 증상이 나왔다 — 알림은 오는데 눌러도
앱 홈만 뜬다.

원인은 payload 규약 불일치였다. 앱은 `hooks/use-fcm.ts`에서 `data.action === 'NAVIGATE_WEBVIEW'`
하나로만 분기하는데, 우체통 푸시는 `{ type, letterId }`만 실어서 분기에 안 걸렸다.
구독 알림이 쓰던 `ClubNotificationPayloadFactory`의 `action`/`path` 규약을 우체통이
따르지 않은 결과다.

**백엔드에서 `letterNavigationData()`로 통일해 해결했다.** 답장·전체 발행 양쪽 모두
아래를 싣는다.

```json
{ "type": "...", "letterId": "...",
  "action": "NAVIGATE_WEBVIEW",
  "path": "/feedback/letters/{letterId}" }
```

경로에 함정이 둘 있다.

- **`letters` 복수형이다.** 프론트 라우트가 `AppRoutes.tsx`에 `/feedback/letters/:letterId`로
  등록돼 있다. 단수로 넣으면 매칭에 실패해 빈 화면이 뜬다.
- **`/webview/` 접두사를 붙이지 않는다.** 앱이 `router.push({ pathname: '/webview/[slug]',
  params: { slug: 'external', path } })`로 받아 `` `${webviewUrl}${path}` ``로 이어붙이므로
  `path`는 웹 라우트 원본이어야 한다. 구독 알림의 `/webview/clubDetail/{clubId}`는
  네이티브 화면으로 빠지는 특수 분기 전용이라 우체통에는 해당하지 않는다.

답장과 전체 발행이 같은 경로를 쓰는 게 맞다. `LetterCategory`에 `REPLY`가 포함되고
`ReceivedLetterDetail.myFeedback`이 답장일 때 원본을 함께 주므로, 둘 다 받은 편지 상세
하나로 수렴한다.

앱·프론트는 수정할 게 없고 **앱 재릴리즈도 불필요하다.** 기존 `NAVIGATE_WEBVIEW` 분기가
그대로 처리한다.

**실패하면 §8-2를 먼저 본다.** 웹뷰의 학생 신원이 푸시 대상과 다르면 경로는 맞게 열리는데
편지를 못 찾는다. 라우팅 문제로 오인하기 쉬운 증상이다.

---

## 8. 익명 신원을 오래 유지하기

우체통은 로그인이 없어서 **신원이 클라이언트 저장소에만 있다.** 저장소가 비거나
서버가 토큰을 거부하면 그 사용자의 편지함은 되찾을 방법이 없다.

전제부터 분명히 하면, **로그인이 없는 한 기기·브라우저 경계는 넘을 수 없다.**
폰을 바꾸거나 다른 브라우저로 오면 어떤 수정으로도 이어줄 수 없다.
아래는 그 안에서 얼마나 오래 버티느냐의 문제다.

두 건 다 출시를 막지는 않는다. 출시 후에 붙여도 그때부터 보호된다.
다만 그 전에 유실된 편지는 되돌릴 수 없다.

### 8-1. 웹 localStorage는 사파리에서 7일에 비워질 수 있다

사파리 ITP는 스크립트가 쓸 수 있는 저장소(localStorage 포함)를 **마지막 상호작용 후
7일**에 비운다. 우체통 사용 패턴이 정확히 여기 걸린다.

```text
피드백 보냄 → (며칠~몇 주) → 답장 도착 → 열어보러 옴
                    ↑
            그 사이 방문이 없으면 localStorage 소멸 → 보낸 편지도 받은 편지도 사라짐
```

**단, ITP의 7일 규칙은 사파리 앱에만 적용된다.** 앱이 쓰는 WKWebView는 대상이 아니라서
용량 압박에 따른 LRU 제거만 받는다. 즉 이 항목은 **웹 브라우저로 우체통을 쓰는 사용자**의
문제이고, 앱 웹뷰 사용자는 해당되지 않는다.

그래도 우리가 아무것도 안 해도 발생한다는 점에서 8-2(서명 키 교체)보다 빈도가 높다.
우체통을 앱 전용으로 좁히면 이 항목의 우선순위는 내려간다.

**제안: 서버가 발급하는 httpOnly 쿠키를 1차 신원으로 둔다.**

```text
Set-Cookie: studentId=...; HttpOnly; Secure; SameSite=Lax; Max-Age=63072000
```

- 스크립트가 못 쓰는 저장소라 ITP 7일 상한을 받지 않는다
- 신원을 서버가 소유하게 되어, 클라이언트가 무엇을 하든 매 요청에 붙는다

XSS 관점의 이득은 제한적이다. 쿠키 자체는 JS로 못 읽지만, 8-2를 함께 넣어
localStorage의 `sub`로 재발급이 가능해지면 **`sub`를 훔친 스크립트가 같은 신원의 토큰을
새로 받을 수 있다.** 쿠키를 넣는다고 XSS가 막히지는 않는다.

`CookieMaker`(`moadong/user/util/CookieMaker.java`)가 이미 관리자 refresh 토큰에
쓰이고 있으므로 새로 만들 것은 없다. CORS는 credentials 허용이 필요하다.

프론트는 **쿠키 1차 · localStorage 2차**로 둔다. 둘 중 하나만 살아남아도 신원이 이어진다.

```text
쿠키에 신원이 있으면 그대로 사용
없으면 localStorage의 sub로 재발급 요청 (8-2)
둘 다 없으면 신규 발급 후 양쪽에 저장
```

### 8-2. ~~`/auth/student`가 `sub`를 버린다~~ ✅ 해결

**백엔드가 `sub`를 받도록 고쳤다.** 아래는 확정된 계약이다.

| 요청 본문 | 동작 |
|---|---|
| 없음 / `{}` / `{"sub": null}` | 새 UUID 발급 (하위 호환 — 본문 없이 POST하는 기존 클라이언트도 그대로 동작) |
| `{"sub": "<UUIDv4>"}` | **소문자로 정규화한 뒤** 그 값을 `sub`로 발급 |
| UUIDv4가 아닌 값 | 400 |

`StudentIssueRequest`가 `@Pattern(regexp = RegexConstants.UUID_V4)`로 검증하고,
`resolveStudentId()`가 본문 없음/null이면 `UUID.randomUUID()`를 돌려준다.

⚠️ **보낸 `sub`가 그대로 돌아온다고 가정하면 안 된다.** 서버가 소문자로 정규화하는데
`Feedback.studentId`는 문자열을 그대로 비교하므로, 대문자로 보낸 값을 클라이언트가
따로 기억해 쓰면 편지함이 둘로 갈린다. **신원은 항상 응답 토큰에서 다시 읽는다.**
웹(`studentFetch.ts`)은 발급 응답의 `accessToken`만 저장하고 `sub`는 매번 토큰에서
꺼내므로 이 조건을 이미 만족한다.

**UUIDv4 제약은 형식 검증이 아니라 권한 경계다.**
`JwtAuthenticationFilter`가 토큰의 `sub`로 `loadUserByUsername()` → `findUserByUserId()`를
호출하고, `validateToken()`은 서명과 subject 일치만 본다. 임의 문자열 `sub`를 허용하면
관리자 `userId`를 담은 토큰을 무인증 엔드포인트에서 정당하게 발급받을 수 있다.
`userId` 패턴(`^(?=.*[a-z])[a-zA-Z\d!@#$~]{5,20}$`)은 하이픈 불가·최대 20자라
UUIDv4(36자, 하이픈 포함)와 구조적으로 충돌할 수 없다. 이 제약만으로 경로가 닫힌다.

아래는 결정 배경으로 남겨 둔다.

지금은 구독 푸시에 영향이 없다. `createOrClaimToken()`이 같은 FCM 토큰 레코드를 찾아
`updateStudentId()`로 새 신원에 갈아끼워 주기 때문에, studentId가 바뀌어도 구독이 따라온다.
반면 `Feedback.studentId`에는 그런 복구가 없어서(코드베이스에서 `updateStudentId`는
`StudentFcmToken`에만 있다) **재발급이 일어나면 편지함이 유실된다.**

토큰에 만료가 없어 재발급은 서명 키 교체나 저장소 손상에서만 난다. 평상시에는 안 나지만
**서명 키를 한 번 갈면 전 사용자가 같은 날 편지함을 잃는다.** 조금씩 새는 게 아니라
한 번에 터지는 종류다. 그래서 마감은 "출시 후 서명 키를 교체하기 전"이다.

이 수정이 막는 범위를 좁혀 말하면 이렇다.

| 상황 | `sub` 수정으로 해결되나 |
|---|---|
| 서버가 토큰을 거부 (서명 키 교체) | **된다** — 저장된 sub로 같은 신원을 다시 발급 |
| 저장소가 통째로 날아감 (앱 삭제, 브라우저 데이터 삭제, 시크릿 모드) | **안 된다** — sub도 함께 사라진다 |

두 번째는 로그인이 없는 구조의 한계이고, 8-1의 쿠키로도 완전히는 못 막는다.

`sub`가 곧 인증 수단이 되므로 두 가지가 따라붙었다.

- ~~서버에서 UUIDv4 형식을 검증해야 임의 문자열로 의도적 충돌을 막을 수 있다~~ ✅ 위 참조.
- ~~앱의 UUID 생성이 `Math.random()` 기반이다. CSPRNG로 교체해야 한다~~
  ✅ 앱 PR [#32](https://github.com/Moadong/moadong-react-native/pull/32) (2026-08-18 머지)에서
  `crypto.getRandomValues` 기반으로 교체했다(`react-native-get-random-values` 폴리필).
  같은 PR에서 `resolveAuthSubject()`를 추가해, 저장된 토큰이 있으면 그 `payload.sub`를
  다시 보내고 신규 설치에서만 `@auth_subject`를 쓴다. 서버가 `sub`를 무시하던 시절의
  기존 설치는 `@auth_subject`와 토큰 안 신원이 서로 다른데, 편지함이 달린 쪽은 토큰이므로
  이 처리가 필요했다.
  웹은 애초에 스스로 UUID를 만들지 않고 서버가 발급한 토큰에서 읽은 `sub`만 보낸다.
