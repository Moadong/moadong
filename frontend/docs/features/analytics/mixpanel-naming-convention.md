# Mixpanel 이벤트 네이밍 컨벤션

- **최종 수정**: 2026-09-29
- **최종 수정자**: 김준서
- **목적**: 일관된 이벤트 스키마를 유지하고, 분석 및 협업 과정에서 혼동을 줄이기 위해 아래 네이밍 규칙을 따른다.
- **범위**: 웹 프론트엔드(`frontend/`)에서 보내는 Mixpanel 이벤트. 앱(`moadong-react-native`)은 아직 적용하지 않는다.

기존 이벤트를 옮긴 내역은 [mixpanel-event-rename-map.md](mixpanel-event-rename-map.md)에 있다.

## 0. 한 줄 요약

| 구분           | 규칙                                             | 예시                        |
| -------------- | ------------------------------------------------ | --------------------------- |
| 이벤트         | 영문 Title Case + 공백, `[명사] + [과거형 동사]` | `Club Card Clicked`         |
| 이벤트 속성    | snake_case                                       | `club_id`                   |
| 속성 값        | 제한 없음 (한글 데이터 그대로)                   | `club_name: '모아동'`       |
| 유저·슈퍼 속성 | snake*case (불리언은 `is*`/`has\_`)              | `device_locale`, `has_logo` |
| 한글 설명      | 이벤트명이 아니라 코드 JSDoc + Lexicon 설명에    | `/** 동아리 카드 클릭 */`   |

## 1. 케이스 & 시제 규칙

### 1-1. 이벤트 = 영문 Title Case + 공백, 명사 + 과거형 동사

```text
Good: Club Card Clicked, Feedback Submitted, Page Viewed
Bad : club_card_clicked, clubCardClicked, Click Club Card, ClubCard Clicked, 동아리 카드 클릭
```

**이유**

1. **가독성.** 분석할 때 `Club Card Clicked`가 `club_card_clicked`보다 빨리 읽힌다. 분석 화면은 PM·디자이너도 본다.
2. **과거형.** 이벤트는 행동이 **이미 일어난 뒤** 발생한다. `Submit`이면 제출 중인지 완료인지 모호하지만 `Submitted`면 완료가 명확하다. 과거형 동사가 없는 이름(`Festival Tab Duration`)도 쓰지 않는다. 체류시간은 `... Left` 이벤트에 `duration_seconds`로 담는다.
3. **단어는 띄어 쓴다.** `ClubCard`, `BottomTab`처럼 붙이지 않는다. 약어는 원래 표기를 따른다(`FAQ`, `SNS`, `AI`, `CTA`).
4. **Mixpanel 이벤트명은 대소문자·공백까지 구분한다.** 글자 하나만 달라도 다른 이벤트가 되므로 규칙이 하나여야 한다.

### 1-2. 이벤트명에 한글을 쓰지 않는다

`eventName.ts`의 **키**(`LOGIN_BUTTON_CLICKED`)는 코드 안에서만 쓰는 이름이고, Mixpanel로 전송되는 것은 **값**이다. 값이 한글이면 Mixpanel에 한글 이벤트명이 쌓인다.

```ts
// Bad — 값(=Mixpanel 이벤트명)이 한글
LOGIN_BUTTON_CLICKED: '로그인 버튼클릭',

// Good — 값은 영문, 한글 설명은 JSDoc
/** 로그인 버튼 클릭 */
LOGIN_BUTTON_CLICKED: 'Login Button Clicked',
```

**이유**

1. **한 제품 안에서 두 언어가 섞이면** 이벤트 목록 정렬·검색이 들쭉날쭉해지고, 같은 행동을 영문·한글 두 이름으로 만드는 중복이 생긴다.
2. **데이터를 내보낼 때**(CSV, 웨어하우스, SQL) 영문 식별자가 다루기 쉽다.
3. **한글 설명은 버리지 않는다.** 코드에서는 JSDoc(`/** */`)으로 남겨 IDE hover로 보이게 하고, Mixpanel에서는 Lexicon의 Description·Display Name에 적는다.

속성 **값**은 실제 데이터이므로 한글이어도 된다(`club_name`, `tab_name` 등).

### 1-3. 속성 = snake_case

```text
Good: club_id, duration_seconds, popup_type
Bad : clubId, ClubID, club id
```

**이유**

1. **이벤트와 속성을 한눈에 구분한다.** 이벤트(Title Case)와 속성(snake_case)이 다른 모양이면 화면에서 바로 구분된다.
2. **같은 속성이 둘로 갈라지지 않는다.** 예전에는 `clubId`와 `club_id`, `clubName`과 `club_name`이 섞여 같은 의미의 속성이 두 개였고, 필터·breakdown을 할 때마다 둘 다 챙겨야 했다.
3. **Mixpanel 예약 접두어를 피한다.** `$`, `mp_`로 시작하는 이름은 Mixpanel 기본 속성용이다. 우리 속성에는 쓰지 않는다.

## 2. 핵심 원칙

### 2-1. 변형은 이벤트명이 아니라 속성으로

```text
Good: Club Detail Tab Clicked + { tab: 'intro' | 'photos' | 'schedule' }
Bad : Club Intro Tab Clicked, Club Feed Tab Clicked, Club Schedule Tab Clicked
```

**이유**: 변형마다 이벤트를 만들면 이벤트 종류가 불필요하게 늘어나 관리·분석이 어렵다. 하나의 이벤트를 속성으로 필터링·breakdown하는 편이 낫다.

### 2-2. 이벤트명에 동적 값 금지

```text
Good: Page Viewed + { page_name: 'club_detail' }
      Busking Day Changed + { festival: 'daedong_2026' }
Bad : ClubDetailPage Visited, `${pageName} Visited`, 2026-daedong Day Changed
```

**이유**: ID·페이지명·연도 같은 동적 값이 이벤트명에 들어가면 이벤트 종류가 값만큼 늘어나고, "모든 페이지의 방문 수"처럼 같은 행동을 한 번에 보기 어렵다. 동적 값은 모두 속성으로 보낸다. ESLint `local/no-hardcoded-event-name`이 템플릿·문자열 연결로 만든 이벤트명을 막는다.

### 2-3. 사용자의 행동을 중심으로 정의한다

```text
Good: 학생이 보낸 편지 → Feedback Submitted
      모달이 학생에게 보인 것 → Satisfaction Modal Viewed
Bad : Message Sent (학생이 보낸 건지 우리가 보낸 건지 모호)
```

**이유**: 이름만 보고 누가 한 행동인지 알 수 있어야 퍼널과 사용자 여정을 읽기 쉽다.

### 2-4. 입도(granularity): 의미 있는 행동만 추적

```text
Good: 퍼널·리텐션 분석에 쓰는 행동, 또는 같은 종류의 클릭을 속성으로 묶은 하나의 이벤트
      (Input Cleared + { field: 'club_name' })
Bad : 입력 필드의 X 버튼마다 이벤트를 따로 만들기
```

**이유**: 모든 클릭을 따로 추적하면 노이즈가 늘어 핵심 행동을 찾기 어렵다. "나중에 분석할 가능성이 있는 데이터는 수집하되, 목적 없는 이벤트는 만들지 않는다."

### 2-5. PII(Personally Identifiable Information) 금지

```text
Bad : email, phone, student_number, 편지 본문
Good: club_id, content_length (길이만)
```

**이유**: 프라이버시·보안·법적 컴플라이언스. 한 번 들어간 PII는 회수가 어렵다. 자유 입력 텍스트(검색어, 에러 메시지 등)를 보낼 때는 개인정보가 섞일 수 있는지 먼저 검토한다.

## 3. 페이지뷰 규칙

모든 페이지(학생·관리자)는 `useTrackPageView`로 아래 두 이벤트만 보낸다.

| 이벤트        | 시점                           | 주요 속성                                                                      |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `Page Viewed` | 페이지 진입                    | `page_name`, `url`, `referrer`, `club_name`, `recruitment_status`              |
| `Page Left`   | 이탈·새로고침·탭 숨김(한 번만) | `page_name`, `duration`, `duration_seconds`, `club_name`, `recruitment_status` |

- `page_name` 값은 `PAGE_VIEW` 상수의 snake_case 영문이다(`club_detail`, `admin_calendar`).
- 관리자 페이지는 `admin_` 접두어를 붙인다.
- 새 페이지는 `PAGE_VIEW`에 값을 추가하고 `useTrackPageView(PAGE_VIEW.XXX)`로 호출한다. 이벤트를 새로 만들지 않는다.

## 4. 거버넌스 (운영 규칙)

### 4-1. 이벤트명 하드코딩 금지 → 상수로 관리

모든 이벤트명은 `src/constants/eventName.ts`에 상수로 정의한다.

```ts
export const USER_EVENT = {
  /** 동아리 카드 클릭 */
  CLUB_CARD_CLICKED: 'Club Card Clicked',
} as const;
```

- 학생 행동은 `USER_EVENT`, 관리자 행동은 `ADMIN_EVENT`, 페이지뷰는 `PAGE_EVENT` + `PAGE_VIEW`에 둔다.
- **상수마다 한글 JSDoc 한 줄**로 언제 발생하는지 적는다. 속성으로 변형을 구분하면 그 속성도 적는다(`(tab: intro | photos | schedule)`).
- `trackEvent('...')`처럼 문자열을 직접 넘기면 ESLint가 에러를 낸다.

**이유**: 문자열 오타와 대소문자 불일치를 막는다. 상수 하나를 고치면 모든 호출부가 같이 바뀐다.

### 4-2. Mixpanel Lexicon으로 문서화

- 새 이벤트를 배포하면 Lexicon에 **Description**(JSDoc과 같은 한글 설명)을 적는다.
- 더 이상 보내지 않는 이벤트는 Lexicon에서 **Hide** 처리한다.
- 이름만 바뀐 이벤트는 Lexicon **Merge**로 옛 이름과 새 이름을 합쳐, 과거 데이터까지 한 이벤트로 조회되게 한다.

### 4-3. 개발/운영 데이터 분리

- `localhost`에서는 `mixpanel.disable()`로 이벤트를 보내지 않는다(`src/utils/initSDK.ts`).
- 운영 프로젝트(Moadong)와 별도로 테스트 프로젝트(moa_test)가 있다. 테스트 이벤트가 운영 리포트에 섞이지 않도록, 개발·스테이징 배포의 `VITE_MIXPANEL_TOKEN`이 테스트 프로젝트를 가리키는지 확인한다.

### 4-4. 이벤트 변경 관리

이벤트명이나 속성 키·타입을 바꾸면 기존 리포트·퍼널·코호트가 끊긴다. 바꾸기 전에 아래를 한다.

1. 영향받는 대시보드·리포트를 찾는다.
2. 옛 이름 → 새 이름 매핑을 [mixpanel-event-rename-map.md](mixpanel-event-rename-map.md)에 남긴다.
3. 배포 직후 Lexicon에서 Merge(이름만 바뀐 경우) 또는 Hide(없어진 경우)를 하고, 리포트를 새 이름으로 고친다.

## 5. 신규 이벤트 추가 체크리스트

- [ ] 영문 `[명사] + [과거형 동사]`, Title Case인가?
- [ ] 같은 행동을 이미 추적하는 이벤트가 있는가? (중복 금지. 있으면 속성을 추가한다)
- [ ] 변형은 속성으로 분리했는가?
- [ ] 동적 값이 이벤트명에 들어가지 않았는가?
- [ ] 속성 키가 snake_case인가?
- [ ] PII가 포함되지 않았는가?
- [ ] `src/constants/eventName.ts`에 상수와 한글 JSDoc을 등록했는가?
- [ ] 배포 후 Lexicon에 설명을 적었는가?

## 참고자료

- Mixpanel Lexicon: https://docs.mixpanel.com/docs/data-governance/lexicon
- Mixpanel 트래킹 플랜: https://docs.mixpanel.com/docs/tracking-best-practices/tracking-plan
- 원본 컨벤션(Amplitude 기준)에서 참고한 자료: https://amplitude.com/docs/data/data-planning-playbook
