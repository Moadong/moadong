# 행동 직후 피드백 백엔드 설계

## 목표

특정 행동 직후 사용자와 동아리 관리자에게 짧은 피드백 창을 노출하고, 응답과 미응답 상태를 저장한다.

이번 기능은 기존 우체통 피드백과 목적이 다르다.

- 기존 우체통 피드백: 사용자가 직접 작성하는 문의/건의/답장 흐름
- 행동 직후 피드백: 특정 행동 완료 직후 UX 품질을 측정하는 제품 피드백 흐름

따라서 백엔드 도메인은 기존 `moadong.feedback` 하위에 두되, 패키지와 컬렉션은 `prompt` 또는 `product` 의미가 드러나도록 분리한다.

추천 패키지:

```text
moadong.feedback.prompt
```

추천 컬렉션:

```text
feedback_prompt_definitions
feedback_prompt_responses
feedback_prompt_interactions
```

## 필수 요구사항

1. 특정 행동 완료 후 피드백 노출 가능 여부를 서버가 판단한다.
2. 첫 응답은 1클릭으로 저장할 수 있어야 한다.
3. 부정 응답은 객관식 이유와 선택 자유 의견을 추가로 받을 수 있어야 한다.
4. 객관식 이유는 최대 8개까지 허용한다.
5. 자유 의견은 최대 500자까지 허용한다.
6. 관리자 플로우와 사용자 플로우의 재노출 정책을 분리한다.
7. 개발자 페이지에서 피드백창의 문항, 선택지, 배치 순서를 수정할 수 있어야 한다.
8. 개발자 페이지에서 특정 피드백 프롬프트를 활성/비활성 처리할 수 있어야 한다.
9. 개발자 페이지에서 프롬프트별 재노출 정책을 수정할 수 있어야 한다.

## 1차 적용 위치

### 관리자 플로우

```text
ADMIN_CLUB_BASIC_INFO_CREATED
ADMIN_CLUB_INFO_UPDATED
ADMIN_RECRUITMENT_INFO_SAVED
```

관리자 플로우는 저장 성공 알림 또는 기존 완료 UI 이후 피드백 노출 여부를 확인한다.

### 사용자 플로우

```text
USER_CLUB_DETAIL_EXIT
```

사용자 플로우는 동아리 상세 페이지 퇴장 시점을 기준으로 한다.

단, 브라우저 탭 닫기와 앱 웹뷰 종료는 안정적으로 API 호출을 보장하기 어렵다. 1차 구현에서는 라우트 이동, 뒤로가기, 상세 페이지 이탈 감지처럼 프론트가 신뢰할 수 있는 이벤트에서만 노출 가능 여부를 조회한다.

## 비목표

1차 구현에서는 아래를 제외한다.

- 피드백 작성자에게 개별 답장
- 패치노트 자동 생성
- 카카오톡 1대1 알림 자동 발송
- 실험군/A-B 테스트
- 피드백 문항별 다국어 지원

관리자에게 알림하거나 패치노트로 반영 사항을 공유하는 흐름은 응답 데이터가 쌓인 뒤 별도 설계로 분리한다.

## 전체 흐름

```text
특정 행동 완료
  |
  v
프론트가 노출 가능 여부 조회
  |
  v
GET /api/feedback-prompts/eligibility?triggerType=&clubId=
  |
  v
서버가 활성 프롬프트와 재노출 정책 판단
  |
  +-- 노출 불가: eligible=false
  |
  +-- 노출 가능: eligible=true, promptDefinition 반환
        |
        v
      프론트 피드백창 노출
        |
        +-- 닫기
        |     |
        |     v
        |   POST /api/feedback-prompts/{promptId}/dismiss
        |
        +-- 응답
              |
              v
            POST /api/feedback-prompts/{promptId}/responses
```

개발자 포털 설정 흐름:

```text
개발자 로그인
  |
  v
GET /api/admin/feedback-prompts
  |
  v
문항/선택지/순서/활성 상태 수정
  |
  v
PUT /api/admin/feedback-prompts/{promptId}
```

## 구현 가능성 판단

현재 설계는 구현 가능한 수준이다. 다만 구현자가 중간에 임의 판단하지 않도록 아래 결정은 확정하고 들어간다.

1. 1차 구현은 백엔드 API와 개발자 포털 설정 API까지 포함한다.
2. 실제 서비스 프론트 연결은 별도 작업으로 둔다.
3. 사용자 상세 페이지 퇴장 트리거는 API와 seed만 준비하고, 프론트 이탈 감지는 별도 작업에서 붙인다.
4. 응답 목록/통계 조회는 1차에서 제외한다. 개발자 포털은 프롬프트 정의 관리만 제공한다.
5. active 프롬프트는 `triggerType`당 1개만 허용한다.
6. 재노출 정책은 프롬프트별 `exposurePolicy`로 저장한다.
7. `reasonOption.id`는 생성 후 수정하지 않는다. 라벨/순서/활성 여부만 바꾼다.

## 구현 대상 파일

추천 파일 구조:

```text
backend/src/main/java/moadong/feedback/prompt/controller/FeedbackPromptController.java
backend/src/main/java/moadong/feedback/prompt/controller/FeedbackPromptAdminController.java

backend/src/main/java/moadong/feedback/prompt/service/FeedbackPromptDefinitionAdminService.java
backend/src/main/java/moadong/feedback/prompt/service/FeedbackPromptEligibilityService.java
backend/src/main/java/moadong/feedback/prompt/service/FeedbackPromptResponseService.java
backend/src/main/java/moadong/feedback/prompt/service/FeedbackPromptSeedService.java
backend/src/main/java/moadong/feedback/prompt/service/FeedbackPromptPolicyEvaluator.java

backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptDefinition.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptInteraction.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptResponse.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptRatingOption.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptReasonOption.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptFollowUp.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptExposurePolicy.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptSnapshot.java
backend/src/main/java/moadong/feedback/prompt/entity/FeedbackPromptClientContext.java

backend/src/main/java/moadong/feedback/prompt/enums/FeedbackPromptAudience.java
backend/src/main/java/moadong/feedback/prompt/enums/FeedbackPromptRating.java
backend/src/main/java/moadong/feedback/prompt/enums/FeedbackPromptTriggerType.java
backend/src/main/java/moadong/feedback/prompt/enums/FeedbackPromptInteractionType.java
backend/src/main/java/moadong/feedback/prompt/enums/FeedbackPromptIneligibleReason.java

backend/src/main/java/moadong/feedback/prompt/repository/FeedbackPromptDefinitionRepository.java
backend/src/main/java/moadong/feedback/prompt/repository/FeedbackPromptInteractionRepository.java
backend/src/main/java/moadong/feedback/prompt/repository/FeedbackPromptInteractionQueryRepository.java
backend/src/main/java/moadong/feedback/prompt/repository/FeedbackPromptResponseRepository.java

backend/src/main/java/moadong/feedback/prompt/payload/request/FeedbackPromptCreateRequest.java
backend/src/main/java/moadong/feedback/prompt/payload/request/FeedbackPromptUpdateRequest.java
backend/src/main/java/moadong/feedback/prompt/payload/request/FeedbackPromptResponseCreateRequest.java
backend/src/main/java/moadong/feedback/prompt/payload/request/FeedbackPromptDismissRequest.java
backend/src/main/java/moadong/feedback/prompt/payload/response/FeedbackPromptEligibilityResponse.java
backend/src/main/java/moadong/feedback/prompt/payload/response/FeedbackPromptDefinitionResponse.java
backend/src/main/java/moadong/feedback/prompt/payload/response/FeedbackPromptListResponse.java
backend/src/main/java/moadong/feedback/prompt/payload/response/FeedbackPromptResponseCreateResponse.java
```

`FeedbackPromptInteractionRepository`는 쿼리 조건이 길어지므로, 단순 CRUD repository와 `MongoTemplate` 기반 query repository를 분리하는 편이 낫다.

## 도메인 모델

### FeedbackPromptDefinition

피드백창의 문항, 선택지, 노출 위치, 배치 순서를 정의한다.

```java
@Document("feedback_prompt_definitions")
class FeedbackPromptDefinition {
    @Id
    private String id;

    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;

    private String title;
    private String description;

    private List<FeedbackPromptRatingOption> ratingOptions;
    private FeedbackPromptFollowUp followUp;
    private FeedbackPromptExposurePolicy exposurePolicy;

    private int displayOrder;
    private boolean active;

    private Instant createdAt;
    private Instant updatedAt;
}
```

필드 의미:

- `triggerType`: 어떤 행동 뒤에 노출되는지 식별한다.
- `audience`: `ADMIN` 또는 `USER`.
- `title`: 첫 질문. 예: `정보 수정 과정은 어떠셨나요?`
- `description`: 플로팅 말풍선 또는 보조 문구. 예: `더 나은 모아동을 위해 잠깐 시간을 내주세요`
- `ratingOptions`: 첫 응답 선택지. 기본은 긍정/보통/부정 3개.
- `followUp`: 부정 응답 또는 보통 응답 이후 추가 질문 설정.
- `exposurePolicy`: 응답/닫기/노출 이후 재노출 제한 설정.
- `displayOrder`: 같은 위치에 여러 프롬프트 후보가 있을 때 우선순위.
- `active`: 비활성 프롬프트는 노출하지 않는다.

### FeedbackPromptRatingOption

```java
class FeedbackPromptRatingOption {
    private FeedbackPromptRating rating;
    private String label;
    private int displayOrder;
    private boolean requiresFollowUp;
}
```

추천 기본값:

```text
POSITIVE / 편했어요 / 1 / false
NEUTRAL  / 보통이에요 / 2 / false
NEGATIVE / 불편했어요 / 3 / true
```

`NEUTRAL`을 추가 질문으로 연결할지는 개발자 페이지에서 `requiresFollowUp`으로 수정 가능하게 둔다.

### FeedbackPromptFollowUp

```java
class FeedbackPromptFollowUp {
    private String reasonQuestion;
    private List<FeedbackPromptReasonOption> reasonOptions;
    private String commentQuestion;
    private String commentPlaceholder;
    private int commentMaxLength;
}
```

제약:

- `reasonOptions`는 최대 8개
- `commentMaxLength`는 최대 500
- 1차 구현 기본값은 500

### FeedbackPromptReasonOption

```java
class FeedbackPromptReasonOption {
    private String id;
    private String label;
    private int displayOrder;
    private boolean active;
}
```

`id`는 화면 라벨이 바뀌어도 기존 응답 집계가 깨지지 않도록 안정적인 값으로 둔다.

예:

```text
TOO_MANY_FIELDS
HARD_TO_FIND_ITEM
PHOTO_UPLOAD
MOBILE_USABILITY
SAVE_FLOW
ERROR_OCCURRED
OTHER
```

### FeedbackPromptExposurePolicy

프롬프트별 재노출 정책이다. 개발자 페이지에서 수정할 수 있어야 한다.

```java
class FeedbackPromptExposurePolicy {
    private int answeredCooldownDays;
    private int dismissedCooldownDays;
    private int shownCooldownHours;
    private boolean oncePerClub;
    private int dailyExposureLimit;
}
```

필드 의미:

- `answeredCooldownDays`: 응답 제출 후 같은 조건에서 다시 노출하지 않을 일수.
- `dismissedCooldownDays`: 닫기 후 같은 조건에서 다시 노출하지 않을 일수.
- `shownCooldownHours`: 창이 노출된 뒤 응답/닫기 없이 이탈했을 때 다시 노출하지 않을 시간.
- `oncePerClub`: 동일 동아리 기준으로 한 번 응답하면 다시 노출하지 않을지 여부.
- `dailyExposureLimit`: 같은 식별자 기준 하루 최대 노출 횟수. 0이면 제한 없음.

권장 제약:

- `answeredCooldownDays`: 0 이상 365 이하
- `dismissedCooldownDays`: 0 이상 365 이하
- `shownCooldownHours`: 0 이상 24 * 30 이하
- `dailyExposureLimit`: 0 이상 20 이하
- `oncePerClub=true`는 `clubId`가 의미 있는 사용자 플로우에서만 사용한다.

기본값:

```text
관리자 프롬프트:
answeredCooldownDays = 30
dismissedCooldownDays = 7
shownCooldownHours = 24
oncePerClub = false
dailyExposureLimit = 0

사용자 동아리 상세 퇴장 프롬프트:
answeredCooldownDays = 0
dismissedCooldownDays = 7
shownCooldownHours = 24
oncePerClub = true
dailyExposureLimit = 1
```

### FeedbackPromptResponse

실제 사용자가 제출한 응답이다.

```java
@Document("feedback_prompt_responses")
class FeedbackPromptResponse {
    @Id
    private String id;

    private String promptId;
    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;

    private String userId;
    private String clubId;

    private FeedbackPromptRating rating;
    private List<String> reasonOptionIds;
    private String comment;

    private FeedbackPromptClientContext clientContext;

    private Instant createdAt;
}
```

주의:

- 사용자 플로우가 비로그인 상태에서도 열릴 수 있다면 `userId`는 nullable이다.
- 동일 사용자 식별이 필요한 경우 프론트에서 익명 클라이언트 ID를 만들어 `clientId`로 넘긴다.
- 민감한 개인정보 입력을 유도하지 않도록 comment placeholder와 운영 정책에 주의한다.

### FeedbackPromptInteraction

노출, 닫기, 응답 등 재노출 정책 판단용 이벤트다.

```java
@Document("feedback_prompt_interactions")
class FeedbackPromptInteraction {
    @Id
    private String id;

    private String promptId;
    private FeedbackPromptTriggerType triggerType;
    private FeedbackPromptAudience audience;

    private String userId;
    private String anonymousClientId;
    private String clubId;

    private FeedbackPromptInteractionType type;

    private Instant createdAt;
}
```

`type`:

```text
SHOWN
DISMISSED
ANSWERED
```

노출 가능 여부 판단은 가장 최근 `DISMISSED`, `ANSWERED`, `SHOWN` 이벤트를 조회해서 계산한다.

## Enum 설계

### FeedbackPromptAudience

```text
ADMIN
USER
```

### FeedbackPromptRating

```text
POSITIVE
NEUTRAL
NEGATIVE
```

### FeedbackPromptTriggerType

```text
ADMIN_CLUB_BASIC_INFO_CREATED
ADMIN_CLUB_INFO_UPDATED
ADMIN_RECRUITMENT_INFO_SAVED
USER_CLUB_DETAIL_EXIT
GENERAL_FEEDBACK
```

`GENERAL_FEEDBACK`은 모바일 메뉴의 `피드백을 주세요!` 같은 상시 진입점에 사용한다. 행동 직후 피드백과 통계를 섞지 않기 위해 별도 trigger로 둔다.

`FeedbackPromptTriggerType`은 audience를 직접 판별할 수 있어야 한다.

```java
public boolean isAdminTrigger() {
    return name().startsWith("ADMIN_");
}

public boolean isUserTrigger() {
    return name().startsWith("USER_") || this == GENERAL_FEEDBACK;
}
```

관리자 트리거는 인증된 동아리 관리자만 호출할 수 있다. 개발자 포털 관리 API와는 별개의 권한이다.

### FeedbackPromptInteractionType

```text
SHOWN
DISMISSED
ANSWERED
```

## API 설계

### 1. 노출 가능 여부 조회

```http
GET /api/feedback-prompts/eligibility?triggerType=ADMIN_CLUB_INFO_UPDATED&clubId={clubId}
Authorization: Bearer {token}
```

사용자 상세 퇴장처럼 비로그인도 가능한 플로우는 Authorization 없이 호출할 수 있어야 한다.

요청 파라미터:

```text
triggerType: required
clubId: optional
anonymousClientId: optional
```

응답:

```json
{
  "eligible": true,
  "reason": null,
  "prompt": {
    "id": "prompt-id",
    "triggerType": "ADMIN_CLUB_INFO_UPDATED",
    "audience": "ADMIN",
    "title": "정보 수정 과정은 어떠셨나요?",
    "description": "더 나은 모아동을 위해 잠깐 시간을 내주세요",
    "ratingOptions": [
      {
        "rating": "POSITIVE",
        "label": "편했어요",
        "displayOrder": 1,
        "requiresFollowUp": false
      },
      {
        "rating": "NEUTRAL",
        "label": "보통이에요",
        "displayOrder": 2,
        "requiresFollowUp": false
      },
      {
        "rating": "NEGATIVE",
        "label": "불편했어요",
        "displayOrder": 3,
        "requiresFollowUp": true
      }
    ],
    "followUp": {
      "reasonQuestion": "어떤 부분이 가장 불편했나요?",
      "reasonOptions": [
        {
          "id": "TOO_MANY_FIELDS",
          "label": "입력해야 할 정보가 많아요",
          "displayOrder": 1
        }
      ],
      "commentQuestion": "조금 더 알려주실 수 있나요?",
      "commentPlaceholder": "어떤 상황에서 불편했는지 알려주시면 개선에 큰 도움이 돼요.",
      "commentMaxLength": 500
    },
    "exposurePolicy": {
      "answeredCooldownDays": 30,
      "dismissedCooldownDays": 7,
      "shownCooldownHours": 24,
      "oncePerClub": false,
      "dailyExposureLimit": 0
    }
  }
}
```

`eligible=false`일 때:

```json
{
  "eligible": false,
  "reason": "ANSWERED_COOLDOWN",
  "prompt": null
}
```

추천 reason:

```text
PROMPT_NOT_FOUND
PROMPT_INACTIVE
ANSWERED_COOLDOWN
DISMISSED_COOLDOWN
USER_CLUB_ALREADY_ANSWERED
USER_DAILY_LIMIT
UNAUTHORIZED
```

노출 가능하다고 응답하는 시점에 `SHOWN` interaction을 저장한다. 그래야 창을 띄운 뒤 사용자가 아무 행동 없이 이탈해도 과도한 재노출을 줄일 수 있다.

주의:

- `eligibility` 조회는 읽기 API처럼 보이지만 `SHOWN` 이벤트를 저장하므로 side effect가 있다.
- 프론트는 같은 화면 렌더마다 반복 호출하지 말고, 실제 노출 후보 시점에 1회만 호출해야 한다.
- 사용자가 이미 다른 피드백창을 보고 있다면 프론트에서 중복 호출을 막는다.

### 2. 응답 제출

```http
POST /api/feedback-prompts/{promptId}/responses
Authorization: Bearer {token}
```

요청:

```json
{
  "triggerType": "ADMIN_CLUB_INFO_UPDATED",
  "clubId": "club-id",
  "anonymousClientId": null,
  "rating": "NEGATIVE",
  "reasonOptionIds": ["PHOTO_UPLOAD", "SAVE_FLOW"],
  "comment": "사진 업로드 후 저장 완료 여부가 헷갈렸어요.",
  "clientContext": {
    "path": "/admin/clubs/club-id/info",
    "deviceType": "PC",
    "userAgent": "optional",
    "appWebView": false
  }
}
```

응답:

```json
{
  "responseId": "response-id",
  "message": "감사합니다. 더 편리한 모아동을 만들어볼게요."
}
```

검증:

- `promptId`가 존재하고 active여야 한다.
- `triggerType`은 prompt의 triggerType과 같아야 한다.
- `rating`은 prompt의 ratingOptions 안에 있어야 한다.
- `requiresFollowUp=false`인 rating은 `reasonOptionIds`, `comment` 없이 제출 가능하다.
- `requiresFollowUp=true`인 rating은 이유 선택 없이도 제출을 허용할지 정책 결정이 필요하다.
- 추천은 이유 선택 없이도 제출 허용이다. 그래야 자유 의견만 쓰거나 바로 닫는 사용자를 막지 않는다.
- `reasonOptionIds`는 prompt의 active reason option 안에 있어야 한다.
- `reasonOptionIds`는 최대 8개다.
- `comment`는 500자 이하다.

저장 후 `ANSWERED` interaction을 함께 저장한다.

### 3. 닫기 저장

```http
POST /api/feedback-prompts/{promptId}/dismiss
Authorization: Bearer {token}
```

요청:

```json
{
  "triggerType": "ADMIN_CLUB_INFO_UPDATED",
  "clubId": "club-id",
  "anonymousClientId": null
}
```

응답:

```json
{
  "message": "ok"
}
```

저장 후 동일 조건에서 일정 기간 재노출하지 않는다.

### 4. 개발자용 프롬프트 목록 조회

```http
GET /api/admin/feedback-prompts
Authorization: Bearer {developerToken}
```

응답:

```json
{
  "prompts": [
    {
      "id": "prompt-id",
      "triggerType": "ADMIN_CLUB_INFO_UPDATED",
      "audience": "ADMIN",
      "title": "정보 수정 과정은 어떠셨나요?",
      "description": "더 나은 모아동을 위해 잠깐 시간을 내주세요",
      "displayOrder": 1,
      "active": true,
      "exposurePolicy": {
        "answeredCooldownDays": 30,
        "dismissedCooldownDays": 7,
        "shownCooldownHours": 24,
        "oncePerClub": false,
        "dailyExposureLimit": 0
      },
      "updatedAt": "2026-09-01T00:00:00Z"
    }
  ]
}
```

### 5. 개발자용 프롬프트 상세 조회

```http
GET /api/admin/feedback-prompts/{promptId}
Authorization: Bearer {developerToken}
```

프론트 노출 응답과 동일한 상세 구조를 반환하되, inactive reason option도 포함한다.

### 6. 개발자용 프롬프트 생성

```http
POST /api/admin/feedback-prompts
Authorization: Bearer {developerToken}
```

요청은 `FeedbackPromptDefinition` 생성 DTO와 동일하다.

제약:

- 동일 `triggerType` 안에서 active 프롬프트가 여러 개일 수는 있다.
- 이 경우 `displayOrder`가 낮은 프롬프트를 먼저 노출 후보로 사용한다.
- 1차 구현에서 혼선을 줄이려면 동일 `triggerType` active 프롬프트는 1개만 허용해도 된다.

추천은 1차에서 `triggerType`당 active 1개 정책이다.

### 7. 개발자용 프롬프트 수정

```http
PUT /api/admin/feedback-prompts/{promptId}
Authorization: Bearer {developerToken}
```

수정 가능 항목:

- `title`
- `description`
- `ratingOptions.label`
- `ratingOptions.displayOrder`
- `ratingOptions.requiresFollowUp`
- `followUp.reasonQuestion`
- `followUp.reasonOptions.label`
- `followUp.reasonOptions.displayOrder`
- `followUp.reasonOptions.active`
- `followUp.commentQuestion`
- `followUp.commentPlaceholder`
- `followUp.commentMaxLength`
- `exposurePolicy.answeredCooldownDays`
- `exposurePolicy.dismissedCooldownDays`
- `exposurePolicy.shownCooldownHours`
- `exposurePolicy.oncePerClub`
- `exposurePolicy.dailyExposureLimit`
- `displayOrder`
- `active`

수정 불가 권장 항목:

- `id`
- `createdAt`
- 기존 응답에서 사용된 `reasonOption.id`

`reasonOption.id`를 수정하면 과거 응답 집계가 깨진다. 라벨 변경과 active 변경으로 처리한다.

### 8. 개발자용 프롬프트 삭제

```http
DELETE /api/admin/feedback-prompts/{promptId}
Authorization: Bearer {developerToken}
```

물리 삭제는 권장하지 않는다. 과거 응답이 promptId를 참조하기 때문이다.

1차 구현은 삭제 API를 만들지 않고 `active=false`로 비활성화한다.

## 재노출 정책

재노출 정책은 코드 상수가 아니라 `FeedbackPromptDefinition.exposurePolicy`에 저장된 운영 설정을 기준으로 계산한다.

개발자 페이지에서 프롬프트별로 아래 항목을 수정할 수 있어야 한다.

```text
응답 후 재노출 제한 일수
닫기 후 재노출 제한 일수
노출만 되고 이탈한 경우 재노출 제한 시간
동일 동아리 1회 제한 여부
하루 최대 노출 횟수
```

### 관리자 기본 정책

기준 키:

```text
audience + userId + triggerType
```

정책:

```text
ANSWERED 이후 answeredCooldownDays 동안 동일 triggerType 노출 X
DISMISSED 이후 dismissedCooldownDays 동안 동일 triggerType 노출 X
SHOWN 이후 shownCooldownHours 동안 동일 triggerType 노출 X
dailyExposureLimit > 0이면 하루 노출 횟수 제한 적용
```

관리자 플로우는 특정 동아리 관리자 계정이 대상이므로 기본 키에서 `clubId`를 제외한다.

단, 한 관리자가 여러 동아리를 관리하는 구조로 확장될 가능성이 있으면 `clubId`를 포함하는 옵션을 열어둔다.

### 사용자 기본 정책

기준 키:

```text
audience + userId 또는 anonymousClientId + triggerType + clubId
```

정책:

```text
oncePerClub=true이면 동일 동아리 + 동일 triggerType에 ANSWERED 이력이 있을 때 재노출 X
dailyExposureLimit > 0이면 사이트 전체 기준 하루 노출 횟수 제한 적용
DISMISSED 이후 dismissedCooldownDays 동안 동일 동아리 + 동일 triggerType 노출 X
SHOWN 이후 shownCooldownHours 동안 동일 동아리 + 동일 triggerType 노출 X
answeredCooldownDays > 0이면 ANSWERED 이후 해당 기간 동안 동일 조건 노출 X
```

비로그인 사용자는 `anonymousClientId` 기반으로 판단한다. 프론트는 localStorage에 익명 ID를 저장하고 요청에 포함한다.

### 정책 계산 순서

`FeedbackPromptPolicyEvaluator`는 아래 순서로 판단한다.

```text
1. triggerType에 해당하는 active prompt 조회
2. active prompt가 없으면 PROMPT_NOT_FOUND
3. prompt.audience와 triggerType prefix가 맞지 않으면 PROMPT_INACTIVE 또는 invalid configuration 로그
4. ADMIN trigger인데 인증 사용자가 없으면 UNAUTHORIZED
5. USER trigger인데 userId와 anonymousClientId가 모두 없으면 UNAUTHORIZED
6. oncePerClub=true인데 clubId가 없으면 eligible=false
7. oncePerClub=true이고 동일 clubId ANSWERED 이력이 있으면 USER_CLUB_ALREADY_ANSWERED
8. answeredCooldownDays > 0이고 최근 ANSWERED가 기간 안이면 ANSWERED_COOLDOWN
9. dismissedCooldownDays > 0이고 최근 DISMISSED가 기간 안이면 DISMISSED_COOLDOWN
10. shownCooldownHours > 0이고 최근 SHOWN이 기간 안이면 SHOWN_COOLDOWN
11. dailyExposureLimit > 0이고 오늘 SHOWN 횟수가 제한 이상이면 USER_DAILY_LIMIT
12. eligible=true, SHOWN 저장
```

`SHOWN_COOLDOWN`은 `FeedbackPromptIneligibleReason`에 추가한다.

날짜 기준:

- 서버 계산 기준은 `Instant`다.
- 하루 제한은 `Asia/Seoul` 날짜 경계로 계산한다.
- KST 기준 오늘 00:00:00부터 내일 00:00:00 직전까지를 하루로 본다.

식별자 우선순위:

```text
ADMIN: user.id 필수
USER 로그인: user.id 우선
USER 비로그인: anonymousClientId 사용
```

`anonymousClientId`는 1차에서 서버가 발급하지 않는다. 프론트가 생성해서 요청에 포함한다.

## 개발자 페이지 요구사항

`backend/src/main/resources/static/dev/index.html`에 새 섹션을 추가한다.

섹션 이름 예:

```text
행동 피드백 프롬프트 관리
```

필수 UI:

- 프롬프트 목록 조회
- triggerType 필터
- active 상태 표시
- 선택한 프롬프트 상세 편집
- 첫 질문 title 편집
- 플로팅 설명 description 편집
- 긍정/보통/부정 라벨 및 순서 편집
- 긍정/보통/부정별 추가 질문 여부 편집
- 부정 응답 이유 선택지 추가/비활성/순서 변경
- 자유 입력 질문/placeholder/최대 길이 편집
- 응답 후 재노출 제한 일수 편집
- 닫기 후 재노출 제한 일수 편집
- 노출 후 미응답 재노출 제한 시간 편집
- 동일 동아리 1회 제한 토글
- 하루 최대 노출 횟수 편집
- 프롬프트 displayOrder 편집
- 프롬프트 active 토글
- 저장 전 JSON 미리보기

개발자 페이지 구현은 기존 컨벤션을 따른다.

- `/api/admin/**` 호출
- `headers()` 함수 재사용
- 403은 `개발자 계정으로 로그인하세요.` 메시지
- 새 기능은 `section` 단위로 추가
- 버튼 로딩 상태와 message-box 사용

## 저장 정책

프롬프트 정의는 운영 중 수정될 수 있다. 응답 데이터의 해석 안정성을 위해 응답 저장 시점에 아래 중 하나를 선택해야 한다.

### 선택지 A: 응답에 스냅샷 저장

`FeedbackPromptResponse`에 당시 문항과 선택지 라벨을 함께 저장한다.

장점:

- 나중에 문항 라벨이 바뀌어도 당시 사용자가 본 내용을 알 수 있다.

단점:

- 응답 문서가 커진다.

### 선택지 B: id만 저장

응답에는 `promptId`, `rating`, `reasonOptionIds`만 저장한다.

장점:

- 구현이 단순하다.

단점:

- 개발자가 라벨을 바꾸면 과거 응답 화면에서 현재 라벨로 보일 수 있다.

추천은 A다. 문항 수정 요구사항이 있으므로 응답 시점 스냅샷을 저장해야 분석 신뢰도가 높다.

추천 스냅샷:

```java
class FeedbackPromptSnapshot {
    private String title;
    private String description;
    private String ratingLabel;
    private String reasonQuestion;
    private List<FeedbackPromptReasonSnapshot> selectedReasons;
    private String commentQuestion;
    private FeedbackPromptExposurePolicy exposurePolicy;
}
```

스냅샷에 `exposurePolicy`를 포함하면 당시 어떤 재노출 정책 아래에서 응답이 수집됐는지 추적할 수 있다.

## Repository 설계

### FeedbackPromptDefinitionRepository

필요 쿼리:

```java
List<FeedbackPromptDefinition> findByTriggerTypeAndActiveTrueOrderByDisplayOrderAsc(FeedbackPromptTriggerType triggerType);
List<FeedbackPromptDefinition> findAllByOrderByAudienceAscTriggerTypeAscDisplayOrderAsc();
Optional<FeedbackPromptDefinition> findById(String id);
```

### FeedbackPromptInteractionRepository

필요 쿼리:

```java
Optional<FeedbackPromptInteraction> findTopByAudienceAndUserIdAndTriggerTypeAndTypeOrderByCreatedAtDesc(...);
Optional<FeedbackPromptInteraction> findTopByAudienceAndAnonymousClientIdAndTriggerTypeAndClubIdAndTypeOrderByCreatedAtDesc(...);
long countByAudienceAndUserIdAndTypeAndCreatedAtBetween(...);
long countByAudienceAndAnonymousClientIdAndTypeAndCreatedAtBetween(...);
boolean existsByAudienceAndUserIdAndTriggerTypeAndClubIdAndType(...);
boolean existsByAudienceAndAnonymousClientIdAndTriggerTypeAndClubIdAndType(...);
```

쿼리 메서드가 길어지면 `MongoTemplate` 기반 custom repository로 분리한다.

### FeedbackPromptResponseRepository

필요 쿼리:

```java
List<FeedbackPromptResponse> findByPromptIdOrderByCreatedAtDesc(String promptId);
List<FeedbackPromptResponse> findByTriggerTypeOrderByCreatedAtDesc(FeedbackPromptTriggerType triggerType);
```

1차 구현에서 개발자 포털 조회가 필요 없다면 response 조회 API는 미룰 수 있다.

## Service 설계

### FeedbackPromptDefinitionAdminService

역할:

- 프롬프트 목록/상세 조회
- 프롬프트 생성
- 프롬프트 수정
- 입력 제약 검증
- reason option id 안정성 보장

### FeedbackPromptEligibilityService

역할:

- triggerType에 맞는 active prompt 선택
- audience 판단
- 인증/비인증 사용자 식별
- 관리자/사용자 재노출 정책 계산
- eligible=true일 때 `SHOWN` interaction 저장

### FeedbackPromptResponseService

역할:

- 응답 검증
- 응답 저장
- prompt snapshot 생성
- `ANSWERED` interaction 저장
- 닫기 처리 시 `DISMISSED` interaction 저장

## 보안

현재 `SecurityConfig`는 `/api/admin/**`만 `ROLE_DEVELOPER`로 제한하고 나머지는 permitAll이다.

따라서 API 보안은 다음처럼 나눈다.

- `/api/admin/feedback-prompts/**`: 개발자 전용
- `/api/feedback-prompts/**`: 사용자/관리자 클라이언트용

주의:

- 관리자 플로우의 eligibility/response/dismiss는 로그인 관리자만 허용해야 한다.
- 사용자 플로우는 비로그인도 가능하게 둘 수 있다.
- triggerType이 `ADMIN_`으로 시작하는데 인증이 없으면 `UNAUTHORIZED` 또는 401/403으로 처리한다.
- 응답 저장 API는 악성 대량 제출 가능성이 있으므로 최소한 동일 식별자 기준 쿨다운을 적용한다.

컨트롤러 구현 방식:

```java
@GetMapping("/eligibility")
public ResponseEntity<?> getEligibility(
        @RequestParam FeedbackPromptTriggerType triggerType,
        @RequestParam(required = false) String clubId,
        @RequestParam(required = false) String anonymousClientId,
        @CurrentUser CustomUserDetails user
) {
    ...
}
```

현재 SecurityConfig상 `/api/feedback-prompts/**`는 permitAll이다. 따라서 `@CurrentUser`는 nullable일 수 있다고 보고 서비스에서 명시적으로 검사한다.

관리자 트리거 권한 검사:

```text
triggerType.isAdminTrigger()
  -> user != null 필수
  -> user.clubId와 요청 clubId가 일치해야 함
```

사용자 트리거 권한 검사:

```text
triggerType.isUserTrigger()
  -> user.id 또는 anonymousClientId 중 하나 필수
```

개발자 포털 API는 `/api/admin/feedback-prompts/**` 아래에 두므로 기존 `SecurityConfig`의 `hasRole("DEVELOPER")` 정책을 그대로 탄다.

## ErrorCode 추가

기존 `ErrorCode`의 `904xx`는 우체통 피드백에서 사용 중이다. 행동 직후 피드백은 같은 큰 범주로 두되 뒤 번호를 추가한다.

추가 후보:

```java
FEEDBACK_PROMPT_NOT_FOUND(HttpStatus.NOT_FOUND, "904-8", "피드백 프롬프트가 존재하지 않습니다."),
FEEDBACK_PROMPT_INVALID_REQUEST(HttpStatus.BAD_REQUEST, "904-9", "피드백 프롬프트 요청이 올바르지 않습니다."),
FEEDBACK_PROMPT_POLICY_INVALID(HttpStatus.BAD_REQUEST, "904-10", "피드백 재노출 정책이 올바르지 않습니다."),
FEEDBACK_PROMPT_REASON_LIMIT_EXCEEDED(HttpStatus.BAD_REQUEST, "904-11", "피드백 선택지는 최대 8개까지 등록할 수 있습니다."),
FEEDBACK_PROMPT_COMMENT_TOO_LONG(HttpStatus.BAD_REQUEST, "904-12", "피드백 의견은 최대 500자까지 입력할 수 있습니다."),
FEEDBACK_PROMPT_ACTIVE_DUPLICATED(HttpStatus.CONFLICT, "904-13", "같은 트리거에 활성화된 피드백 프롬프트가 이미 존재합니다.")
```

`eligible=false`는 정상 응답이므로 예외를 던지지 않는다. 위 에러는 잘못된 요청, 잘못된 설정, 저장 실패성 검증 오류에만 사용한다.

## 초기 데이터

앱 기동 시 기본 프롬프트가 없으면 seed 데이터를 넣는 방식을 권장한다.

후보:

```text
ApplicationRunner
FeedbackPromptSeedService
```

초기 seed 예:

```yaml
triggerType: ADMIN_CLUB_INFO_UPDATED
audience: ADMIN
title: 정보 수정 과정은 어떠셨나요?
description: 더 나은 모아동을 위해 잠깐 시간을 내주세요
ratingOptions:
  - rating: POSITIVE
    label: 편했어요
    displayOrder: 1
    requiresFollowUp: false
  - rating: NEUTRAL
    label: 보통이에요
    displayOrder: 2
    requiresFollowUp: false
  - rating: NEGATIVE
    label: 불편했어요
    displayOrder: 3
    requiresFollowUp: true
followUp:
  reasonQuestion: 어떤 부분이 가장 불편했나요?
  reasonOptions:
    - id: TOO_MANY_FIELDS
      label: 입력해야 할 정보가 많아요
      displayOrder: 1
      active: true
    - id: HARD_TO_FIND_ITEM
      label: 원하는 항목을 찾기 어려워요
      displayOrder: 2
      active: true
    - id: PHOTO_UPLOAD
      label: 사진 등록이 불편해요
      displayOrder: 3
      active: true
    - id: MOBILE_USABILITY
      label: 모바일에서 사용하기 불편해요
      displayOrder: 4
      active: true
    - id: SAVE_FLOW
      label: 저장/수정 과정이 불편해요
      displayOrder: 5
      active: true
    - id: ERROR_OCCURRED
      label: 오류가 있었어요
      displayOrder: 6
      active: true
    - id: OTHER
      label: 기타
      displayOrder: 7
      active: true
  commentQuestion: 조금 더 알려주실 수 있나요?
  commentPlaceholder: 어떤 상황에서 불편했는지 알려주시면 개선에 큰 도움이 돼요.
  commentMaxLength: 500
exposurePolicy:
  answeredCooldownDays: 30
  dismissedCooldownDays: 7
  shownCooldownHours: 24
  oncePerClub: false
  dailyExposureLimit: 0
displayOrder: 1
active: true
```

seed는 없는 데이터만 생성하고, 이미 존재하는 프롬프트는 덮어쓰지 않는다. 운영자가 개발자 페이지에서 수정한 문항을 배포 때마다 되돌리면 안 된다.

### Seed 대상

1차 seed는 아래 4개를 생성한다.

```text
ADMIN_CLUB_BASIC_INFO_CREATED
ADMIN_CLUB_INFO_UPDATED
ADMIN_RECRUITMENT_INFO_SAVED
USER_CLUB_DETAIL_EXIT
```

관리자 3개 프롬프트는 같은 followUp/reason/exposurePolicy를 사용해도 된다. 단, `title`은 행동에 맞게 다르게 둔다.

추천 title:

```text
ADMIN_CLUB_BASIC_INFO_CREATED: 동아리 기본정보 등록 과정은 어떠셨나요?
ADMIN_CLUB_INFO_UPDATED: 동아리 정보 수정 과정은 어떠셨나요?
ADMIN_RECRUITMENT_INFO_SAVED: 모집 정보 등록/수정 과정은 어떠셨나요?
USER_CLUB_DETAIL_EXIT: 동아리 상세정보는 도움이 되었나요?
```

seed 조건:

```text
findByTriggerType(triggerType)가 비어 있을 때만 생성
```

active 프롬프트가 이미 있으면 절대 덮어쓰지 않는다.

## 인덱스

권장 MongoDB 인덱스:

```text
feedback_prompt_definitions:
- triggerType + active + displayOrder
- audience + triggerType + displayOrder

feedback_prompt_interactions:
- audience + userId + triggerType + type + createdAt
- audience + anonymousClientId + triggerType + clubId + type + createdAt
- audience + userId + type + createdAt
- audience + anonymousClientId + type + createdAt

feedback_prompt_responses:
- promptId + createdAt
- triggerType + createdAt
- audience + createdAt
```

## 프론트와의 계약

프론트는 피드백 노출 후보 시점마다 먼저 eligibility API를 호출한다.

백엔드는 프론트가 문항을 하드코딩하지 않도록 `prompt` 전체를 내려준다. 프론트는 서버에서 받은 `ratingOptions`, `reasonOptions`, `displayOrder`, `active`를 그대로 렌더링한다.

프론트가 담당할 것:

- PC 우하단 플로팅
- 모바일 하단 시트
- 모바일 메뉴의 `피드백을 주세요!` 진입점
- 첫 응답 1클릭 UX
- 부정 응답 시 추가 질문 UI
- 500자 입력 제한의 클라이언트 검증
- anonymousClientId 생성 및 저장

백엔드가 담당할 것:

- 문항/선택지 설정의 원천
- 노출 가능 여부 판단
- 재노출 제한
- 응답 검증
- 응답 저장
- 개발자 포털 설정 API

## 구현 순서

1. Enum과 ErrorCode 추가
2. Definition 관련 entity/embedded value/repository 추가
3. Definition validation 로직 추가
4. seed 서비스 추가
5. 개발자용 프롬프트 목록/상세/생성/수정 API 추가
6. Interaction entity/repository/query repository 추가
7. `FeedbackPromptPolicyEvaluator` 구현
8. eligibility API 구현
9. Response entity/repository/snapshot 생성 로직 추가
10. 응답 제출 API 구현
11. dismiss API 구현
12. 관리자 정책 단위 테스트 추가
13. 사용자 정책 단위 테스트 추가
14. 개발자 포털 정적 HTML 섹션 추가
15. 프론트 공통 피드백 UI 연결

## 1차 구현 완료 기준

백엔드 PR은 아래 조건을 만족하면 완료로 본다.

1. 앱 기동 시 4개 기본 프롬프트가 생성된다.
2. 개발자 권한으로 프롬프트 목록/상세를 조회할 수 있다.
3. 개발자 권한으로 문항/선택지/순서/활성 여부/재노출 정책을 수정할 수 있다.
4. 같은 triggerType에 active 프롬프트를 중복 생성하거나 활성화할 수 없다.
5. eligibility API가 active 프롬프트와 재노출 정책을 반영한다.
6. eligibility=true일 때 `SHOWN` interaction이 저장된다.
7. 응답 제출 시 response와 `ANSWERED` interaction이 저장된다.
8. dismiss 호출 시 `DISMISSED` interaction이 저장된다.
9. 관리자 trigger는 인증 사용자와 clubId 일치 검사를 통과해야 한다.
10. 사용자 trigger는 로그인 사용자 또는 anonymousClientId 중 하나로 식별된다.
11. 단위 테스트가 정책 핵심 분기를 검증한다.

## 테스트 계획

### Definition 관리

- 개발자가 프롬프트를 생성할 수 있다.
- reason option이 8개를 초과하면 실패한다.
- commentMaxLength가 500을 초과하면 실패한다.
- displayOrder 변경이 저장된다.
- active=false 프롬프트는 eligibility에서 제외된다.
- 기존 reason option id 변경 시 실패하거나 새 option으로만 추가된다.
- 재노출 정책 값이 저장된다.
- 재노출 정책 값이 허용 범위를 벗어나면 실패한다.

### Eligibility

- active prompt가 없으면 eligible=false
- 관리자 최초 조건 충족 시 eligible=true
- 관리자 ANSWERED 이후 `answeredCooldownDays` 이내 eligible=false
- 관리자 DISMISSED 이후 `dismissedCooldownDays` 이내 eligible=false
- `shownCooldownHours` 이내에 다시 조회하면 eligible=false
- 사용자 동일 동아리 ANSWERED 이력이 있으면 eligible=false
- `dailyExposureLimit`을 초과하면 eligible=false
- eligible=true 응답 시 SHOWN interaction이 저장된다.

### Response

- 긍정 응답은 reason/comment 없이 저장된다.
- 부정 응답은 reason/comment와 함께 저장된다.
- comment가 500자를 초과하면 실패한다.
- 존재하지 않는 reasonOptionId가 들어오면 실패한다.
- 응답 저장 시 prompt snapshot이 함께 저장된다.
- 응답 저장 시 ANSWERED interaction이 저장된다.

### Dismiss

- 닫기 저장 시 DISMISSED interaction이 저장된다.
- 닫기 이후 동일 정책 기간에는 eligible=false가 된다.

## 미결정 사항

1. `NEUTRAL` 응답도 추가 질문으로 연결할지 여부
2. 부정 응답에서 이유 선택을 필수로 강제할지 여부
3. 사용자 상세 페이지 퇴장 이벤트를 어떤 프론트 이벤트로 확정할지 여부
4. 비로그인 사용자의 anonymousClientId 생성/보관 정책
5. 개발자 포털에서 응답 목록/통계 조회까지 1차에 포함할지 여부
6. 같은 triggerType에 active 프롬프트 여러 개를 허용할지 여부
7. 개발자 페이지에서 정책을 전역 기본값으로도 관리할지, 프롬프트별 정책만 둘지 여부

## 추천 결정

1차 구현에서는 아래 정책을 추천한다.

- `NEUTRAL`은 추가 질문 없이 종료한다.
- 부정 응답도 이유 선택 없이 제출 가능하게 한다.
- active 프롬프트는 triggerType당 1개만 허용한다.
- 응답에는 prompt snapshot을 저장한다.
- 재노출 정책은 프롬프트별 설정으로 저장하고 개발자 페이지에서 수정한다.
- 개발자 포털은 문항 관리까지만 1차에 포함하고, 응답 통계는 2차로 분리한다.
- 사용자 상세 페이지 퇴장 피드백은 관리자 플로우 구현 이후 붙인다.

위 추천 결정을 따르면 미결정 사항 중 1, 2, 5, 6, 7은 닫힌다.

남는 미결정 사항은 프론트 작업과 연결된 3, 4뿐이다. 백엔드 1차 구현은 3, 4가 완전히 확정되지 않아도 진행 가능하다.
