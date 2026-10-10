/**
 * Mixpanel 이벤트명 상수.
 * 이름 규칙은 docs/features/analytics/mixpanel-naming-convention.md를 따른다.
 * - 이벤트 값: 영문 Title Case, `[명사] + [과거형 동사]`
 * - 변형·동적 값은 이벤트명이 아니라 속성(snake_case)으로 보낸다
 * - 한글 설명은 값이 아니라 JSDoc 주석에 적는다 (IDE hover로 확인)
 */
export const USER_EVENT = {
  // 메인 탐색
  /** 메인 카테고리 버튼 클릭 */
  CATEGORY_BUTTON_CLICKED: 'Category Button Clicked',
  /** 검색 실행 (엔터·검색 버튼) */
  SEARCH_EXECUTED: 'Search Executed',

  // 메인 페이지 팝업
  /** 메인 팝업 노출 */
  MAIN_POPUP_VIEWED: 'Main Popup Viewed',
  /** 노출 조건에 맞는 팝업이 없어 메인 팝업을 띄우지 않음 */
  MAIN_POPUP_SKIPPED: 'Main Popup Skipped',
  /** 메인 팝업 닫기 (action으로 닫기 방식 구분) */
  MAIN_POPUP_CLOSED: 'Main Popup Closed',
  /** 앱 다운로드 팝업 클릭 */
  APP_DOWNLOAD_POPUP_CLICKED: 'App Download Popup Clicked',

  // 모아동 우체통
  /** 우체통 진입 클릭 (source로 진입 위치 구분) */
  FEEDBACK_ENTRY_CLICKED: 'Feedback Entry Clicked',
  /** 우체통 피드백 유형 선택 */
  FEEDBACK_TYPE_SELECTED: 'Feedback Type Selected',
  /** 우체통 피드백 전송 성공 */
  FEEDBACK_SUBMITTED: 'Feedback Submitted',
  /** 우체통 피드백 전송 실패 */
  FEEDBACK_SUBMIT_FAILED: 'Feedback Submit Failed',
  /** 우체통 작성 중 이탈 */
  FEEDBACK_WRITE_ABANDONED: 'Feedback Write Abandoned',
  /** 우체통 받은 편지 열람 */
  RECEIVED_LETTER_OPENED: 'Received Letter Opened',

  // 만족도 모달
  /** 만족도 모달 노출. 응답률·긍정률의 분모가 된다 */
  SATISFACTION_MODAL_VIEWED: 'Satisfaction Modal Viewed',
  /** 만족도 응답 (satisfied로 긍정/부정 구분) */
  SATISFACTION_ANSWERED: 'Satisfaction Answered',
  /** 만족도 응답 미룸 */
  SATISFACTION_SNOOZED: 'Satisfaction Snoozed',

  // 배너
  /** 메인 배너 클릭 */
  BANNER_CLICKED: 'Banner Clicked',
  /** 앱 다운로드 배너 클릭 */
  APP_DOWNLOAD_BANNER_CLICKED: 'App Download Banner Clicked',
  /** 배너 좌우 이동 버튼 클릭 */
  BANNER_NAVIGATION_CLICKED: 'Banner Navigation Clicked',

  // 헤더·상단 바 네비게이션
  /** 뒤로가기 버튼 클릭 */
  BACK_BUTTON_CLICKED: 'Back Button Clicked',
  /** 헤더 홈(로고) 클릭 */
  HOME_BUTTON_CLICKED: 'Home Button Clicked',
  /** 헤더 관리자 버튼 클릭 */
  ADMIN_BUTTON_CLICKED: 'Admin Button Clicked',
  /** 헤더 모아동 소개 버튼 클릭 */
  INTRODUCE_BUTTON_CLICKED: 'Introduce Button Clicked',
  /** 헤더 총동연 버튼 클릭 */
  CLUB_UNION_BUTTON_CLICKED: 'Club Union Button Clicked',
  /** 헤더 홍보 버튼 클릭 */
  PROMOTION_BUTTON_CLICKED: 'Promotion Button Clicked',

  // 동아리 목록
  /** 동아리 카드 클릭 */
  CLUB_CARD_CLICKED: 'Club Card Clicked',
  /** 동아리 카드가 화면에 일정 시간 이상 노출됨 */
  CLUB_CARD_VIEWED: 'Club Card Viewed',
  /** 스크롤 깊이 마일스톤 도달 */
  SCROLL_DEPTH_REACHED: 'Scroll Depth Reached',
  /** 모집중만 보기 토글 클릭 */
  STATUS_RADIO_BUTTON_CLICKED: 'Status Radio Button Clicked',
  /** 필터칩 클릭 */
  FILTER_OPTION_CLICKED: 'Filter Option Clicked',
  /** 하단 탭 클릭 */
  BOTTOM_TAB_CLICKED: 'Bottom Tab Clicked',

  // 동아리 상세
  /** 동아리 상세 탭 클릭 (tab: intro | photos | schedule) */
  CLUB_DETAIL_TAB_CLICKED: 'Club Detail Tab Clicked',
  /** 동아리 행사일정 캘린더 노출 */
  CLUB_SCHEDULE_CALENDAR_VIEWED: 'Club Schedule Calendar Viewed',
  /** 동아리 행사일정 캘린더 월 이동 */
  CLUB_SCHEDULE_MONTH_CHANGED: 'Club Schedule Month Changed',
  /** 동아리 행사일정 캘린더 오늘 버튼 클릭 */
  CLUB_SCHEDULE_TODAY_BUTTON_CLICKED: 'Club Schedule Today Button Clicked',
  /** 동아리방 지도 클릭 */
  CLUB_MAP_CLICKED: 'Club Map Clicked',
  /** 지원하기 버튼 클릭. 외부 폼 동아리까지 포함한 지원 의도 지표 */
  CLUB_APPLY_BUTTON_CLICKED: 'Club Apply Button Clicked',
  /** 공유 버튼 클릭 */
  SHARE_BUTTON_CLICKED: 'Share Button Clicked',
  /** 동아리 SNS 링크 클릭 */
  SNS_LINK_BUTTON_CLICKED: 'SNS Link Button Clicked',
  /** FAQ 펼치기/접기 */
  FAQ_TOGGLE_CLICKED: 'FAQ Toggle Clicked',
  /** 동아리 구독 토글 (웹뷰 상단 바·구독 버튼) */
  CLUB_SUBSCRIPTION_TOGGLED: 'Club Subscription Toggled',

  // 지원서
  /** 내부 지원서 제출. 내부 지원서를 쓰는 동아리만 발생한다 */
  APPLICATION_FORM_SUBMITTED: 'Application Form Submitted',

  // 총동연 페이지
  /** 총동연 SNS 클릭 */
  CLUB_UNION_SNS_CLICKED: 'Club Union SNS Clicked',

  // 구독 페이지
  /** 구독 페이지 앱 다운로드 버튼 클릭 */
  APP_DOWNLOAD_SUBSCRIPTIONS_CLICKED: 'App Download Subscriptions Clicked',

  // 동소한 (동아리 소개 한마당)
  /** 동소한 탭 클릭 */
  FESTIVAL_TAB_CLICKED: 'Festival Tab Clicked',
  /** 동소한 탭을 떠남 (duration_seconds로 체류시간) */
  FESTIVAL_TAB_LEFT: 'Festival Tab Left',
  /** 동소한 부스 클릭 */
  FESTIVAL_BOOTH_CLICKED: 'Festival Booth Clicked',
  /** 동소한 부스 지도 슬라이드 이동 */
  FESTIVAL_BOOTH_MAP_SLIDE_CHANGED: 'Festival Booth Map Slide Changed',
  /** 동소한 공연 카드 클릭 */
  FESTIVAL_PERFORMANCE_CARD_CLICKED: 'Festival Performance Card Clicked',

  // 버스킹 시간표
  /** 버스킹 시간표 날짜 이동 (festival로 행사 구분) */
  BUSKING_DAY_CHANGED: 'Busking Day Changed',
  /** 버스킹 시간표 날짜를 떠남 (duration_seconds로 체류시간) */
  BUSKING_DAY_LEFT: 'Busking Day Left',

  // 홍보
  /** 홍보 카드 클릭 */
  PROMOTION_CARD_CLICKED: 'Promotion Card Clicked',
  /** 홍보 상세의 동아리 보러가기 클릭 */
  PROMOTION_CLUB_CTA_CLICKED: 'Promotion Club CTA Clicked',
  /** 홍보 상세 지도 클릭 */
  PROMOTION_MAP_CLICKED: 'Promotion Map Clicked',
  /** 홍보 상세 이미지 더보기 클릭 */
  PROMOTION_IMAGE_MORE_CLICKED: 'Promotion Image More Clicked',

  // 퀴즈 (festival로 행사 구분. 평화축제는 2026-10 행사 종료 후 제거 대상)
  /** 퀴즈 시작 */
  QUIZ_STARTED: 'Quiz Started',
  /** 퀴즈 완료 (type으로 결과 유형) */
  QUIZ_COMPLETED: 'Quiz Completed',
  /** 퀴즈 결과의 추천 동아리 클릭. 홈 퍼널을 오염시키지 않도록 Club Card Clicked와 분리한다 */
  RECOMMENDED_CLUB_CLICKED: 'Recommended Club Clicked',
  /** 퀴즈 다시하기 버튼 클릭 */
  QUIZ_RETRY_BUTTON_CLICKED: 'Quiz Retry Button Clicked',
  /** 퀴즈 결과 공유 버튼 클릭 */
  QUIZ_SHARE_BUTTON_CLICKED: 'Quiz Share Button Clicked',
  /** 퀴즈 결과의 "부경대 학생이라면?" 영역 펼침 */
  QUIZ_STUDENT_SECTION_OPENED: 'Quiz Student Section Opened',
} as const;

export const WEBVIEW_LINK_TARGET = {
  CLUB_FESTIVAL: 'CLUB_FESTIVAL',
} as const;

export const ADMIN_EVENT = {
  // 로그인 페이지
  /** 로그인 버튼 클릭 */
  LOGIN_BUTTON_CLICKED: 'Login Button Clicked',
  /** 회원가입 버튼 클릭 */
  SIGNUP_BUTTON_CLICKED: 'Signup Button Clicked',
  /** 아이디 찾기 버튼 클릭 */
  FORGOT_ID_BUTTON_CLICKED: 'Forgot ID Button Clicked',
  /** 비밀번호 찾기 버튼 클릭 */
  FORGOT_PASSWORD_BUTTON_CLICKED: 'Forgot Password Button Clicked',

  // 공통 입력
  /** 입력 필드 초기화(X) 버튼 클릭 (field로 어떤 입력인지 구분) */
  INPUT_CLEARED: 'Input Cleared',

  // 사이드바
  /** 동아리 커버 업로드 버튼 클릭 */
  CLUB_COVER_UPLOAD_BUTTON_CLICKED: 'Club Cover Upload Button Clicked',
  /** 동아리 커버 초기화 버튼 클릭 */
  CLUB_COVER_RESET_BUTTON_CLICKED: 'Club Cover Reset Button Clicked',
  /** 동아리 로고 업로드 버튼 클릭 */
  CLUB_LOGO_UPLOAD_BUTTON_CLICKED: 'Club Logo Upload Button Clicked',
  /** 동아리 로고 수정 버튼 클릭 */
  CLUB_LOGO_EDIT_BUTTON_CLICKED: 'Club Logo Edit Button Clicked',
  /** 동아리 로고 초기화 버튼 클릭 */
  CLUB_LOGO_RESET_BUTTON_CLICKED: 'Club Logo Reset Button Clicked',
  /** 관리자 탭 이동 (사이드바·모바일 탭·설정 탭 공통, tab_name으로 구분) */
  ADMIN_TAB_CLICKED: 'Admin Tab Clicked',
  /** 로그아웃 버튼 클릭 */
  LOGOUT_BUTTON_CLICKED: 'Logout Button Clicked',

  // 기본 정보·소개 수정
  /** 동아리 정보 저장 버튼 클릭 (section: info | intro) */
  CLUB_UPDATE_BUTTON_CLICKED: 'Club Update Button Clicked',
  /** 분류/분과/자유태그 선택 */
  CLUB_TAG_SELECTED: 'Club Tag Selected',

  // 모집 정보 수정
  /** 모집 정보 저장 버튼 클릭 */
  RECRUITMENT_UPDATE_BUTTON_CLICKED: 'Recruitment Update Button Clicked',
  /** 상시모집 버튼 클릭 */
  ALWAYS_OPEN_RECRUITMENT_BUTTON_CLICKED:
    'Always Open Recruitment Button Clicked',
  /** 모집 시작 날짜 변경 */
  RECRUITMENT_START_CHANGED: 'Recruitment Start Changed',
  /** 모집 종료 날짜 변경 */
  RECRUITMENT_END_CHANGED: 'Recruitment End Changed',
  /** 소개글 미리보기/편집 전환 */
  MARKDOWN_PREVIEW_BUTTON_CLICKED: 'Markdown Preview Button Clicked',

  // 활동 사진 수정
  /** 활동 사진 업로드 버튼 클릭 */
  CLUB_PHOTO_UPLOAD_BUTTON_CLICKED: 'Club Photo Upload Button Clicked',
  /** 활동 사진 삭제 버튼 클릭 */
  CLUB_PHOTO_DELETE_BUTTON_CLICKED: 'Club Photo Delete Button Clicked',

  // 동아리 일정 관리
  /** 관리자 캘린더 월 이동 */
  CALENDAR_MONTH_CHANGED: 'Calendar Month Changed',
  /** 관리자 캘린더 오늘 버튼 클릭 */
  CALENDAR_TODAY_BUTTON_CLICKED: 'Calendar Today Button Clicked',
  /** 관리자 캘린더 날짜 클릭 */
  CALENDAR_DATE_CLICKED: 'Calendar Date Clicked',
  /** 일정 추가 버튼 클릭 */
  CALENDAR_ADD_EVENT_BUTTON_CLICKED: 'Calendar Add Event Button Clicked',
  /** 일정 유형 탭 클릭 */
  CALENDAR_EVENT_TYPE_TAB_CLICKED: 'Calendar Event Type Tab Clicked',
  /** 일정 날짜 선택 */
  CALENDAR_EVENT_DATE_SELECTED: 'Calendar Event Date Selected',
  /** 일정 색상 선택 */
  CALENDAR_COLOR_SELECTED: 'Calendar Color Selected',
  /** 반복 주기 변경 */
  CALENDAR_RECURRENCE_FREQUENCY_CHANGED:
    'Calendar Recurrence Frequency Changed',
  /** 반복 요일 선택/해제 */
  CALENDAR_RECURRENCE_WEEKDAY_TOGGLED: 'Calendar Recurrence Weekday Toggled',
  /** 반복 날짜 시트 열기 */
  CALENDAR_DATE_PICKER_OPENED: 'Calendar Date Picker Opened',
  /** 반복 종료 날짜 지우기 */
  CALENDAR_END_DATE_CLEARED: 'Calendar End Date Cleared',
  /** 일정 저장 성공 */
  CALENDAR_EVENT_CREATED: 'Calendar Event Created',
  /** 일정 행 스와이프 */
  CALENDAR_EVENT_ROW_SWIPED: 'Calendar Event Row Swiped',
  /** 일정 삭제 */
  CALENDAR_EVENT_DELETED: 'Calendar Event Deleted',
  /** 연동 일정 숨김 */
  CALENDAR_EVENT_HIDDEN: 'Calendar Event Hidden',
  /** 외부 캘린더 연동 버튼 클릭 */
  CALENDAR_LINK_BUTTON_CLICKED: 'Calendar Link Button Clicked',
  /** 외부 캘린더 연동 해제 버튼 클릭 */
  CALENDAR_UNLINK_BUTTON_CLICKED: 'Calendar Unlink Button Clicked',
  /** 외부 캘린더 연동 해제 취소 */
  CALENDAR_UNLINK_CANCELED: 'Calendar Unlink Canceled',
  /** 연동 일정 표시 토글 */
  CALENDAR_EVENT_VISIBILITY_TOGGLED: 'Calendar Event Visibility Toggled',

  // 지원서 관리
  /** AI 지원서 초안 버튼 노출 */
  AI_DRAFT_BUTTON_VIEWED: 'AI Draft Button Viewed',
  /** AI 지원서 초안 생성 버튼 클릭 */
  AI_DRAFT_BUTTON_CLICKED: 'AI Draft Button Clicked',
  /** AI 지원서 초안 덮어쓰기 취소 */
  AI_DRAFT_OVERWRITE_CANCELED: 'AI Draft Overwrite Canceled',
  /** AI 지원서 초안 생성 완료 */
  AI_DRAFT_GENERATED: 'AI Draft Generated',
  /** AI 지원서 초안 생성 한도 초과 */
  AI_DRAFT_LIMIT_REACHED: 'AI Draft Limit Reached',
  /** AI 지원서 초안 생성 실패 */
  AI_DRAFT_GENERATION_FAILED: 'AI Draft Generation Failed',
  /** 지원서 저장 */
  APPLICATION_FORM_SAVED: 'Application Form Saved',

  // 홍보 게시글 관리
  /** 홍보 게시글 작성 버튼 클릭 */
  PROMOTION_CREATE_BUTTON_CLICKED: 'Promotion Create Button Clicked',
  /** 홍보 게시글 저장 버튼 클릭 */
  PROMOTION_SAVE_BUTTON_CLICKED: 'Promotion Save Button Clicked',
  /** 홍보 게시글 삭제 버튼 클릭 */
  PROMOTION_DELETE_BUTTON_CLICKED: 'Promotion Delete Button Clicked',

  // 비밀번호 수정
  /** 비밀번호 변경 버튼 클릭 */
  PASSWORD_CHANGE_BUTTON_CLICKED: 'Password Change Button Clicked',

  // 동아리 상세 - 모집 기간 변경 (관리자 전용)
  /** 모집 기간 변경 버튼 클릭 */
  RECRUITMENT_PERIOD_CHANGE_BUTTON_CLICKED:
    'Recruitment Period Change Button Clicked',
  /** 모집 기간 변경 완료 */
  RECRUITMENT_PERIOD_CHANGED: 'Recruitment Period Changed',
} as const;

/** ADMIN_EVENT.INPUT_CLEARED의 field 값. 어떤 입력을 지웠는지 구분한다 */
export const INPUT_FIELD = {
  CLUB_NAME: 'club_name',
  CLUB_INTRODUCTION: 'club_introduction',
  CLUB_SNS_LINK: 'club_sns_link',
  CLUB_TAG: 'club_tag',
  CALENDAR_EVENT_TITLE: 'calendar_event_title',
  NEW_PASSWORD: 'new_password',
  CONFIRM_PASSWORD: 'confirm_password',
} as const;

/** 모든 페이지(학생·관리자) 공통 페이지뷰 이벤트. 어떤 페이지인지는 page_name으로 구분한다 */
export const PAGE_EVENT = {
  /** 페이지 진입 */
  PAGE_VIEWED: 'Page Viewed',
  /** 페이지 이탈·탭 숨김 (duration_seconds로 체류시간) */
  PAGE_LEFT: 'Page Left',
} as const;

/** 페이지뷰 이벤트의 page_name 값 */
export const PAGE_VIEW = {
  // 사용자
  /** 내부 지원서 작성 */
  APPLICATION_FORM_PAGE: 'application_form',
  /** 동아리 상세 */
  CLUB_DETAIL_PAGE: 'club_detail',
  /** 메인. 웹·앱 웹뷰 공통이며 is_webview 슈퍼 속성으로 구분한다 */
  MAIN_PAGE: 'main',
  /** 구독 목록 */
  SUBSCRIPTIONS_PAGE: 'subscriptions',
  /** 메뉴 */
  MENU_PAGE: 'menu',
  /** 모아동 소개 */
  INTRODUCE_PAGE: 'introduce',
  /** 모아동 팀원 모집 */
  RECRUIT_PAGE: 'recruit',
  /** 모아동 팀원 모집 포지션 상세 */
  RECRUIT_POSITION_PAGE: 'recruit_position',
  /** 총동연 */
  CLUB_UNION_PAGE: 'club_union',
  /** 동소한 (동아리 소개 한마당) */
  FESTIVAL_INTRODUCTION_PAGE: 'festival_introduction',
  /** 2026 대동제 버스킹 시간표 */
  BUSKING_TIMETABLE_PAGE: 'busking_timetable',
  /** 홍보 목록 */
  PROMOTION_LIST_PAGE: 'promotion_list',
  /** 홍보 상세 */
  PROMOTION_DETAIL_PAGE: 'promotion_detail',
  /** 게임 */
  GAME_PAGE: 'game',
  /** 평화축제 퀴즈 소개 */
  PEACE_INTRO_PAGE: 'peace_intro',
  /** 평화축제 퀴즈 문항 */
  PEACE_QUIZ_PAGE: 'peace_quiz',
  /** 평화축제 퀴즈 결과 */
  PEACE_RESULT_PAGE: 'peace_result',

  // 모아동 우체통
  /** 우체통 목록 */
  FEEDBACK_LIST_PAGE: 'feedback_list',
  /** 우체통 유형 선택 */
  FEEDBACK_TYPE_SELECT_PAGE: 'feedback_type_select',
  /** 우체통 편지 작성 */
  FEEDBACK_WRITE_PAGE: 'feedback_write',
  /** 우체통 전송 완료 */
  FEEDBACK_COMPLETE_PAGE: 'feedback_complete',
  /** 우체통 받은 편지 상세 */
  RECEIVED_LETTER_DETAIL_PAGE: 'received_letter_detail',
  /** 우체통 보낸 편지 상세 */
  SENT_FEEDBACK_DETAIL_PAGE: 'sent_feedback_detail',

  // 관리자
  /** 관리자 로그인 */
  LOGIN_PAGE: 'admin_login',
  /** 동아리 소개 수정 */
  CLUB_INTRO_EDIT_PAGE: 'admin_club_intro_edit',
  /** 동아리 기본 정보 수정 */
  CLUB_INFO_EDIT_PAGE: 'admin_club_info_edit',
  /** 동아리 모집 정보 수정 */
  RECRUITMENT_INFO_EDIT_PAGE: 'admin_recruitment_info_edit',
  /** 동아리 활동 사진 수정 */
  PHOTO_EDIT_PAGE: 'admin_photo_edit',
  /** 동아리 통계 */
  ADMIN_STATISTICS_PAGE: 'admin_statistics',
  /** 관리자 계정 수정 */
  ADMIN_ACCOUNT_EDIT_PAGE: 'admin_account_edit',
  /** 동아리 일정 관리 */
  ADMIN_CALENDAR_PAGE: 'admin_calendar',
  /** 홍보 게시글 관리 */
  ADMIN_PROMOTION_LIST_PAGE: 'admin_promotion_list',
  /** 홍보 게시글 작성 */
  ADMIN_PROMOTION_EDIT_PAGE: 'admin_promotion_edit',
} as const;

export type PageViewName = (typeof PAGE_VIEW)[keyof typeof PAGE_VIEW];

/** 카드·스크롤·구독 이벤트의 page/source 값. page_name과 같은 값을 써서 페이지뷰와 이어 본다 */
export const PAGE_NAME = {
  MAIN: PAGE_VIEW.MAIN_PAGE,
  INTRODUCE: PAGE_VIEW.INTRODUCE_PAGE,
  SUBSCRIPTIONS: PAGE_VIEW.SUBSCRIPTIONS_PAGE,
  CLUB_DETAIL: PAGE_VIEW.CLUB_DETAIL_PAGE,
} as const;

export type PageName = (typeof PAGE_NAME)[keyof typeof PAGE_NAME];
