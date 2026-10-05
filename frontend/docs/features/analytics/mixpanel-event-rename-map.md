# Mixpanel 이벤트 이름 변경 매핑

- **작성일**: 2026-09-29
- **기준**: 이 문서가 포함된 배포 이전(`develop-fe`)과 이후
- **규칙**: [mixpanel-naming-convention.md](mixpanel-naming-convention.md)

배포 시점 이전 데이터는 옛 이름, 이후 데이터는 새 이름으로 쌓인다. 코드는 새 이름만 보낸다(이중 전송 없음). 과거 데이터까지 이어서 보려면 아래 **배포 후 할 일**을 한다.

## 백엔드 통계와의 관계

백엔드(`backend/src/main/java/moadong/analytics`)는 Mixpanel Export API로 이벤트를 **이름으로** 가져와 관리자 통계·운영진 퍼널을 계산한다. 새 이름은 `MixpanelEventNormalizer`가 수집 시점에 옛 내부 이름으로 번역한다(예: `Page Viewed` + `page_name: club_detail` → `ClubDetailPage Visited`, `club_name` → `clubName`).

- **배포 순서**: 백엔드(번역 포함)를 먼저 배포한 뒤 프론트를 배포한다.
- **순서를 어기면**: 프론트 배포 ~ 백엔드 배포 사이의 통계·퍼널이 0으로 쌓인다. 백엔드 배포 후 `POST /api/admin/statistics/mixpanel/backfill`로 그 기간을 다시 수집하면 복구된다.
- 백엔드가 쓰는 이벤트명을 새로 바꾸거나 추가하면 `MixpanelEventNormalizer`에도 반영한다.

## 배포 후 할 일 (Mixpanel에서 사람이 직접)

1. **Lexicon Merge**: 아래 표에서 `이름 변경`인 이벤트는 옛 이름을 새 이름에 Merge한다. 과거 데이터가 새 이름으로 함께 조회된다.
2. **통합 이벤트**: `통합`인 이벤트(탭 3종, 입력 초기화 7종)는 Merge하면 옛 데이터에는 구분 속성(`tab`, `field`)이 없다. 과거 비교가 필요하면 옛 이벤트를 따로 조회한다.
3. **페이지뷰**: 옛 `{페이지} Visited`/`{페이지} Duration` 약 60종은 새 `Page Viewed`/`Page Left` + `page_name`으로 바뀌었다. 옛 이벤트에는 `page_name`이 없으므로 Merge보다 **Hide**하고, 페이지별 리포트를 `Page Viewed` + `page_name` 필터로 다시 만든다.
4. **속성 키**: camelCase 속성은 snake_case로 바뀌었다(아래 표). Lexicon에서 속성도 Merge할 수 있다.
5. **Lexicon Description**: 새 이벤트마다 `src/constants/eventName.ts`의 JSDoc 한글 설명을 Description에 옮긴다.
6. **리포트·대시보드**: 주간 리포트 프롬프트(`docs/mixpanel-weekly-report-prompts.md`, `docs/mixpanel-admin-weekly-report-prompts.md`)와 저장된 대시보드의 이벤트명을 새 이름으로 바꾼다.

## 이벤트

바뀌지 않은 이벤트(이미 규칙을 지키던 영문 이벤트)는 표에 없다.

### 학생(USER_EVENT)

| 옛 이벤트명                        | 새 이벤트명                         | 추가 속성                              | 처리      |
| ---------------------------------- | ----------------------------------- | -------------------------------------- | --------- |
| `CategoryButton Clicked`           | `Category Button Clicked`           |                                        | 이름 변경 |
| `Main Popup Not Shown`             | `Main Popup Skipped`                |                                        | 이름 변경 |
| `우체통 진입 클릭`                 | `Feedback Entry Clicked`            |                                        | 이름 변경 |
| `우체통 피드백 유형 선택`          | `Feedback Type Selected`            |                                        | 이름 변경 |
| `우체통 피드백 전송`               | `Feedback Submitted`                |                                        | 이름 변경 |
| `우체통 피드백 전송 실패`          | `Feedback Submit Failed`            |                                        | 이름 변경 |
| `우체통 작성 이탈`                 | `Feedback Write Abandoned`          |                                        | 이름 변경 |
| `우체통 받은 편지 열람`            | `Received Letter Opened`            |                                        | 이름 변경 |
| `만족도 모달 노출`                 | `Satisfaction Modal Viewed`         |                                        | 이름 변경 |
| `만족도 응답`                      | `Satisfaction Answered`             |                                        | 이름 변경 |
| `만족도 응답 미룸`                 | `Satisfaction Snoozed`              |                                        | 이름 변경 |
| `ClubCard Clicked`                 | `Club Card Clicked`                 |                                        | 이름 변경 |
| `ClubCard Viewed`                  | `Club Card Viewed`                  |                                        | 이름 변경 |
| `Club Intro Tab Clicked`           | `Club Detail Tab Clicked`           | `tab: 'intro'`                         | 통합      |
| `Club Feed Tab Clicked`            | `Club Detail Tab Clicked`           | `tab: 'photos'`                        | 통합      |
| `Club Schedule Tab Clicked`        | `Club Detail Tab Clicked`           | `tab: 'schedule'`                      | 통합      |
| `StatusRadioButton Clicked`        | `Status Radio Button Clicked`       |                                        | 이름 변경 |
| `BottomTab Clicked`                | `Bottom Tab Clicked`                |                                        | 이름 변경 |
| `Festival BoothMap Slide Changed`  | `Festival Booth Map Slide Changed`  |                                        | 이름 변경 |
| `Festival PerformanceCard Clicked` | `Festival Performance Card Clicked` |                                        | 이름 변경 |
| `Festival Tab Duration`            | `Festival Tab Left`                 |                                        | 이름 변경 |
| `2026-daedong Day Changed`         | `Busking Day Changed`               | `festival: 'daedong_2026'`             | 이름 변경 |
| `2026-daedong Day Duration`        | `Busking Day Left`                  | `festival: 'daedong_2026'`             | 이름 변경 |
| `Webview Subscribe Toggled`        | `Club Subscription Toggled`         |                                        | 이름 변경 |
| `Peace Quiz Started`               | `Quiz Started`                      | `festival: 'un_peace_2026'`            | 이름 변경 |
| `Peace Quiz Completed`             | `Quiz Completed`                    | `festival: 'un_peace_2026'`            | 이름 변경 |
| `Peace Club Card Clicked`          | `Recommended Club Clicked`          | `festival: 'un_peace_2026'`, `club_id` | 이름 변경 |
| `Peace Retry Clicked`              | `Quiz Retry Button Clicked`         | `festival: 'un_peace_2026'`            | 이름 변경 |
| `Peace Share Clicked`              | `Quiz Share Button Clicked`         | `festival: 'un_peace_2026'`            | 이름 변경 |
| `Peace Student Toggle Opened`      | `Quiz Student Section Opened`       | `festival: 'un_peace_2026'`            | 이름 변경 |

### 관리자(ADMIN_EVENT)

| 옛 이벤트명                          | 새 이벤트명                                | 추가 속성                       | 처리      |
| ------------------------------------ | ------------------------------------------ | ------------------------------- | --------- |
| `로그인 버튼클릭`                    | `Login Button Clicked`                     |                                 | 이름 변경 |
| `회원가입 버튼클릭`                  | `Signup Button Clicked`                    |                                 | 이름 변경 |
| `아이디 찾기 버튼클릭`               | `Forgot ID Button Clicked`                 |                                 | 이름 변경 |
| `비밀번호 찾기 버튼클릭`             | `Forgot Password Button Clicked`           |                                 | 이름 변경 |
| `동아리 커버 업로드 버튼클릭`        | `Club Cover Upload Button Clicked`         |                                 | 이름 변경 |
| `동아리 커버 초기화 버튼클릭`        | `Club Cover Reset Button Clicked`          |                                 | 이름 변경 |
| `동아리 로고 업로드 버튼클릭`        | `Club Logo Upload Button Clicked`          |                                 | 이름 변경 |
| `동아리 로고 수정 버튼클릭`          | `Club Logo Edit Button Clicked`            |                                 | 이름 변경 |
| `동아리 로고 초기화 버튼클릭`        | `Club Logo Reset Button Clicked`           |                                 | 이름 변경 |
| `사이드바 탭 클릭`                   | `Admin Tab Clicked`                        |                                 | 이름 변경 |
| `로그아웃 버튼클릭`                  | `Logout Button Clicked`                    |                                 | 이름 변경 |
| `동아리 기본 정보 수정 버튼클릭`     | `Club Update Button Clicked`               | `section: 'info' \| 'intro'`    | 이름 변경 |
| `동아리 명 입력 초기화 버튼클릭`     | `Input Cleared`                            | `field: 'club_name'`            | 통합      |
| `한줄소개 입력 초기화 버튼클릭`      | `Input Cleared`                            | `field: 'club_introduction'`    | 통합      |
| `분류/분과/자유태그 선택 버튼클릭`   | `Club Tag Selected`                        |                                 | 이름 변경 |
| `자유태그 입력 초기화 버튼클릭`      | `Input Cleared`                            | `field: 'club_tag'`             | 통합      |
| `SNS 링크 입력 초기화 버튼클릭`      | `Input Cleared`                            | `field: 'club_sns_link'`        | 통합      |
| `동아리 모집 정보 수정 버튼클릭`     | `Recruitment Update Button Clicked`        |                                 | 이름 변경 |
| `상시모집 버튼클릭`                  | `Always Open Recruitment Button Clicked`   |                                 | 이름 변경 |
| `모집 시작 날짜 변경`                | `Recruitment Start Changed`                |                                 | 이름 변경 |
| `모집 종료 날짜 변경`                | `Recruitment End Changed`                  |                                 | 이름 변경 |
| `소개글 미리보기/편집 버튼클릭`      | `Markdown Preview Button Clicked`          |                                 | 이름 변경 |
| `활동 사진 업로드 버튼클릭`          | `Club Photo Upload Button Clicked`         |                                 | 이름 변경 |
| `활동 사진 삭제 버튼클릭`            | `Club Photo Delete Button Clicked`         |                                 | 이름 변경 |
| `캘린더 월 이동`                     | `Calendar Month Changed`                   |                                 | 이름 변경 |
| `캘린더 오늘 버튼클릭`               | `Calendar Today Button Clicked`            |                                 | 이름 변경 |
| `캘린더 날짜 클릭`                   | `Calendar Date Clicked`                    |                                 | 이름 변경 |
| `일정 추가 버튼클릭`                 | `Calendar Add Event Button Clicked`        |                                 | 이름 변경 |
| `일정 유형 탭 클릭`                  | `Calendar Event Type Tab Clicked`          |                                 | 이름 변경 |
| `일정 제목 입력 초기화 버튼클릭`     | `Input Cleared`                            | `field: 'calendar_event_title'` | 통합      |
| `일정 날짜 선택`                     | `Calendar Event Date Selected`             |                                 | 이름 변경 |
| `일정 색상 선택`                     | `Calendar Color Selected`                  |                                 | 이름 변경 |
| `반복 주기 변경`                     | `Calendar Recurrence Frequency Changed`    |                                 | 이름 변경 |
| `반복 요일 선택`                     | `Calendar Recurrence Weekday Toggled`      |                                 | 이름 변경 |
| `반복 날짜 시트 열기`                | `Calendar Date Picker Opened`              |                                 | 이름 변경 |
| `반복 종료 날짜 지우기`              | `Calendar End Date Cleared`                |                                 | 이름 변경 |
| `일정 저장`                          | `Calendar Event Created`                   |                                 | 이름 변경 |
| `일정 스와이프`                      | `Calendar Event Row Swiped`                |                                 | 이름 변경 |
| `일정 삭제`                          | `Calendar Event Deleted`                   |                                 | 이름 변경 |
| `연동 일정 숨김`                     | `Calendar Event Hidden`                    |                                 | 이름 변경 |
| `캘린더 연동 버튼클릭`               | `Calendar Link Button Clicked`             |                                 | 이름 변경 |
| `캘린더 연동 해제 버튼클릭`          | `Calendar Unlink Button Clicked`           |                                 | 이름 변경 |
| `캘린더 연동 해제 취소`              | `Calendar Unlink Canceled`                 |                                 | 이름 변경 |
| `연동 일정 표시 토글`                | `Calendar Event Visibility Toggled`        |                                 | 이름 변경 |
| `AI 지원서 초안 버튼노출`            | `AI Draft Button Viewed`                   |                                 | 이름 변경 |
| `AI 지원서 초안 생성 버튼클릭`       | `AI Draft Button Clicked`                  |                                 | 이름 변경 |
| `AI 지원서 초안 덮어쓰기 취소`       | `AI Draft Overwrite Canceled`              |                                 | 이름 변경 |
| `AI 지원서 초안 생성 완료`           | `AI Draft Generated`                       |                                 | 이름 변경 |
| `AI 지원서 초안 생성 한도 초과`      | `AI Draft Limit Reached`                   |                                 | 이름 변경 |
| `AI 지원서 초안 생성 실패`           | `AI Draft Generation Failed`               |                                 | 이름 변경 |
| `지원서 저장`                        | `Application Form Saved`                   |                                 | 이름 변경 |
| `홍보 게시글 작성 버튼클릭`          | `Promotion Create Button Clicked`          |                                 | 이름 변경 |
| `홍보 게시글 저장 버튼클릭`          | `Promotion Save Button Clicked`            |                                 | 이름 변경 |
| `홍보 게시글 삭제 버튼클릭`          | `Promotion Delete Button Clicked`          |                                 | 이름 변경 |
| `비밀번호 변경 버튼클릭`             | `Password Change Button Clicked`           |                                 | 이름 변경 |
| `새 비밀번호 입력 초기화 버튼클릭`   | `Input Cleared`                            | `field: 'new_password'`         | 통합      |
| `확인 비밀번호 입력 초기화 버튼클릭` | `Input Cleared`                            | `field: 'confirm_password'`     | 통합      |
| `모집 기간 변경 버튼클릭`            | `Recruitment Period Change Button Clicked` |                                 | 이름 변경 |
| `모집 기간 변경 완료`                | `Recruitment Period Changed`               |                                 | 이름 변경 |

### 페이지뷰(PAGE_VIEW)

옛 `{페이지} Visited` → `Page Viewed`, `{페이지} Duration` → `Page Left`로 바뀌고 페이지는 `page_name`으로 구분한다.

| 옛 이벤트명                                                                              | 새 `page_name`                |
| ---------------------------------------------------------------------------------------- | ----------------------------- |
| `ApplicationFormPage Visited` / `ApplicationFormPage Duration`                           | `application_form`            |
| `ClubDetailPage Visited` / `ClubDetailPage Duration`                                     | `club_detail`                 |
| `MainPage Visited` / `MainPage Duration`                                                 | `main`                        |
| `SubscriptionsPage Visited` / `SubscriptionsPage Duration`                               | `subscriptions`               |
| `MenuPage Visited` / `MenuPage Duration`                                                 | `menu`                        |
| `IntroducePage Visited` / `IntroducePage Duration`                                       | `introduce`                   |
| `ClubUnionPage Visited` / `ClubUnionPage Duration`                                       | `club_union`                  |
| `동소한 페이지 Visited` / `동소한 페이지 Duration`                                       | `festival_introduction`       |
| `2026 대동제 버스킹 시간표 페이지 Visited` / `2026 대동제 버스킹 시간표 페이지 Duration` | `busking_timetable`           |
| `홍보 목록 페이지 Visited` / `홍보 목록 페이지 Duration`                                 | `promotion_list`              |
| `홍보 상세 페이지 Visited` / `홍보 상세 페이지 Duration`                                 | `promotion_detail`            |
| `GamePage Visited` / `GamePage Duration`                                                 | `game`                        |
| `PeaceIntroPage Visited` / `PeaceIntroPage Duration`                                     | `peace_intro`                 |
| `PeaceQuizPage Visited` / `PeaceQuizPage Duration`                                       | `peace_quiz`                  |
| `PeaceResultPage Visited` / `PeaceResultPage Duration`                                   | `peace_result`                |
| `우체통 목록 페이지 Visited` / `우체통 목록 페이지 Duration`                             | `feedback_list`               |
| `우체통 유형 선택 페이지 Visited` / `우체통 유형 선택 페이지 Duration`                   | `feedback_type_select`        |
| `우체통 편지 작성 페이지 Visited` / `우체통 편지 작성 페이지 Duration`                   | `feedback_write`              |
| `우체통 전송 완료 페이지 Visited` / `우체통 전송 완료 페이지 Duration`                   | `feedback_complete`           |
| `우체통 받은 편지 상세 페이지 Visited` / `우체통 받은 편지 상세 페이지 Duration`         | `received_letter_detail`      |
| `우체통 보낸 편지 상세 페이지 Visited` / `우체통 보낸 편지 상세 페이지 Duration`         | `sent_feedback_detail`        |
| `WebviewMainPage Visited` / `WebviewMainPage Duration`                                   | `main` + `is_webview: true`   |
| `로그인페이지 Visited` / `로그인페이지 Duration`                                         | `admin_login`                 |
| `동아리 소개 수정 페이지 Visited` / `동아리 소개 수정 페이지 Duration`                   | `admin_club_intro_edit`       |
| `동아리 기본 정보 수정 페이지 Visited` / `동아리 기본 정보 수정 페이지 Duration`         | `admin_club_info_edit`        |
| `동아리 모집 정보 수정 페이지 Visited` / `동아리 모집 정보 수정 페이지 Duration`         | `admin_recruitment_info_edit` |
| `동아리 활동 사진 수정 페이지 Visited` / `동아리 활동 사진 수정 페이지 Duration`         | `admin_photo_edit`            |
| `동아리 통계 페이지 Visited` / `동아리 통계 페이지 Duration`                             | `admin_statistics`            |
| `관리자 계정 수정 페이지 Visited` / `관리자 계정 수정 페이지 Duration`                   | `admin_account_edit`          |
| `동아리 일정 관리 페이지 Visited` / `동아리 일정 관리 페이지 Duration`                   | `admin_calendar`              |
| `홍보 게시글 관리 페이지 Visited` / `홍보 게시글 관리 페이지 Duration`                   | `admin_promotion_list`        |
| `홍보 게시글 작성 페이지 Visited` / `홍보 게시글 작성 페이지 Duration`                   | `admin_promotion_edit`        |

### 삭제

| 옛 이벤트명                      | 이유                                                    |
| -------------------------------- | ------------------------------------------------------- |
| `회장 정보 입력 초기화 버튼클릭` | 호출하는 코드가 없던 상수. `Input Cleared` 통합 시 제거 |
| `전화번호 입력 초기화 버튼클릭`  | 〃                                                      |
| `모집 대상 입력 초기화 버튼클릭` | 〃                                                      |

## 속성 값

`Club Card Viewed`·`Club Card Clicked`의 `page`와 `Club Subscription Toggled`의 `source` 값을 `page_name`과 같은 표기로 맞췄다. 웹뷰 메인은 따로 구분하지 않고 `is_webview`로 구분한다.

| 옛 값          | 새 값                       |
| -------------- | --------------------------- |
| `webview-main` | `main` + `is_webview: true` |
| `club-detail`  | `club_detail`               |

`Scroll Depth Reached`의 `page`는 원래부터 웹뷰에서도 `main`이었고 바뀌지 않았다. `main`, `introduce`, `subscriptions`는 그대로다.

## 새로 붙는 속성

| 속성         | 붙는 곳                                                                                                                                                                      | 값                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `user_area`  | 모든 이벤트 (자동)                                                                                                                                                           | `student` / `admin` |
| `is_webview` | 모든 이벤트 (슈퍼 속성)                                                                                                                                                      | `true` / `false`    |
| `club_id`    | 동아리 상세 페이지뷰, `Club Apply Button Clicked`, `Club Map Clicked`, `Club Detail Tab Clicked`, `Share Button Clicked`, `SNS Link Button Clicked`, `Promotion Map Clicked` | 동아리 id           |

## 속성 키

값은 그대로이고 키 이름만 바뀌었다. `club_id`, `club_name`은 원래 두 형태가 섞여 있던 것을 하나로 합친 것이다.

| 옛 키                   | 새 키                     |     | 옛 키                      | 새 키                        |
| ----------------------- | ------------------------- | --- | -------------------------- | ---------------------------- |
| `clubId`                | `club_id`                 |     | `hasEndDate`               | `has_end_date`               |
| `clubName`              | `club_name`               |     | `calendarType`             | `calendar_type`              |
| `recruitmentStatus`     | `recruitment_status`      |     | `eventCount`               | `event_count`                |
| `inputValue`            | `input_value`             |     | `snsPlatform`              | `sns_platform`               |
| `tabName`               | `tab_name`                |     | `tagIndex`                 | `tag_index`                  |
| `newPasswordLength`     | `new_password_length`     |     | `tagName`                  | `tag_name`                   |
| `confirmPasswordLength` | `confirm_password_length` |     | `showToPreview`            | `show_to_preview`            |
| `isEdit`                | `is_edit`                 |     | `actionType`               | `action_type`                |
| `formMode`              | `form_mode`               |     | `previousStatus`           | `previous_status`            |
| `draftSource`           | `draft_source`            |     | `contentLength`            | `content_length`             |
| `aiGenerated`           | `ai_generated`            |     | `imageCount`               | `image_count`                |
| `questionCount`         | `question_count`          |     | `slideIndex` / `slideName` | `slide_index` / `slide_name` |
| `hasUserInput`          | `has_user_input`          |     | `bannerId` / `bannerName`  | `banner_id` / `banner_name`  |
| `eventType`             | `event_type`              |     | `linkTo`                   | `link_to`                    |
| `dateKey`               | `date_key`                |     | `popupType`                | `popup_type`                 |
|                         |                           |     | `promotionId`              | `promotion_id`               |

SNS 종류를 뜻하던 `platform`(`SNS Link Button Clicked`, `Club Union SNS Clicked`)은 `sns_platform`으로 바뀌었다. 앱스토어 OS를 뜻하는 `platform`(앱 다운로드 이벤트)은 그대로다.
