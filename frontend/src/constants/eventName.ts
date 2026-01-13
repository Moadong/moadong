export const USER_EVENT = {
  CATEGORY_BUTTON_CLICKED: 'CategoryButton Clicked',
  SEARCH_BOX_CLICKED: 'SearchBox Clicked',

  // 메인 페이지 팝업
  MAIN_POPUP_VIEWED: 'Main Popup Viewed',
  MAIN_POPUP_NOT_SHOWN: 'Main Popup Not Shown',
  MAIN_POPUP_CLOSED: 'Main Popup Closed',
  APP_DOWNLOAD_POPUP_CLICKED: 'App Download Popup Clicked',

  // 배너 클릭
  BANNER_CLICKED: 'Banner Clicked',
  APP_DOWNLOAD_BANNER_CLICKED: 'App Download Banner Clicked',

  // 네비게이션
  BACK_BUTTON_CLICKED: 'Back Button Clicked',
  HOME_BUTTON_CLICKED: 'Home Button Clicked',
  MOBILE_HOME_BUTTON_CLICKED: 'Mobile Home Button Clicked',
  MOBILE_MENU_BUTTON_CLICKED: 'Mobile Menu Button Clicked',
  MOBILE_MENU_DELETE_BUTTON_CLICKED: 'Mobile Menubar delete Button Clicked',
  ADMIN_BUTTON_CLICKED: 'Admin Button Clicked',

  // 탭 & 섹션
  TAB_CLICKED: 'Tab Clicked',
  PHOTO_NAVIGATION_CLICKED: 'Photo Navigation',
  CLUB_CARD_CLICKED: 'ClubCard Clicked',
  CLUB_INTRO_TAB_CLICKED: 'Club Intro Tab Clicked',
  CLUB_FEED_TAB_CLICKED: 'Club Feed Tab Clicked',

  // 동아리 지원
  CLUB_APPLY_BUTTON_CLICKED: 'Club Apply Button Clicked',
  RECOMMENDED_CLUB_CLICKED: 'Recommended Club Clicked',
  CLUB_UNION_BUTTON_CLICKED: 'Club Union Button Clicked',

  // 공유 버튼
  SHARE_BUTTON_CLICKED: 'Share Button Clicked',
  SNS_LINK_CLICKED: 'SNS Link Button Clicked',

  STATUS_RADIO_BUTTON_CLICKED: 'StatusRadioButton Clicked',
  INTRODUCE_BUTTON_CLICKED: 'Introduce Button Clicked',
  APPLICATION_FORM_SUBMITTED: 'Application Form Submitted',
  PATCH_NOTE_BUTTON_CLICKED: 'Patch Note Button Clicked',
  FAQ_TOGGLE_CLICKED: 'FAQ Toggle Clicked',
} as const;

export const ADMIN_EVENT = {
  // 로그인 페이지
  LOGIN_BUTTON_CLICKED: '로그인 버튼클릭',
  SIGNUP_BUTTON_CLICKED: '회원가입 버튼클릭',
  FORGOT_ID_BUTTON_CLICKED: '아이디 찾기 버튼클릭',
  FORGOT_PASSWORD_BUTTON_CLICKED: '비밀번호 찾기 버튼클릭',

  // 사이드바
  CLUB_COVER_UPLOAD_BUTTON_CLICKED: '동아리 커버 업로드 버튼클릭',
  CLUB_COVER_RESET_BUTTON_CLICKED: '동아리 커버 초기화 버튼클릭',
  CLUB_LOGO_UPLOAD_BUTTON_CLICKED: '동아리 로고 업로드 버튼클릭',
  CLUB_LOGO_EDIT_BUTTON_CLICKED: '동아리 로고 수정 버튼클릭',
  CLUB_LOGO_RESET_BUTTON_CLICKED: '동아리 로고 초기화 버튼클릭',
  TAB_CLICKED: '사이드바 탭 클릭',
  LOGOUT_BUTTON_CLICKED: '로그아웃 버튼클릭',

  // 기본 정보 수정
  UPDATE_CLUB_BUTTON_CLICKED: '동아리 기본 정보 수정 버튼클릭',
  CLUB_NAME_CLEAR_BUTTON_CLICKED: '동아리 명 입력 초기화 버튼클릭',
  CLUB_PRESIDENT_CLEAR_BUTTON_CLICKED: '회장 정보 입력 초기화 버튼클릭',
  TELEPHONE_NUMBER_CLEAR_BUTTON_CLICKED: '전화번호 입력 초기화 버튼클릭',
  CLUB_INTRODUCTION_CLEAR_BUTTON_CLICKED: '한줄소개 입력 초기화 버튼클릭',
  CLUB_TAG_SELECT_BUTTON_CLICKED: '분류/분과/자유태그 선택 버튼클릭',
  CLUB_TAG_CLEAR_BUTTON_CLICKED: '자유태그 입력 초기화 버튼클릭',
  CLUB_SNS_LINK_CLEAR_BUTTON_CLICKED: 'SNS 링크 입력 초기화 버튼클릭',

  // 모집 정보 수정
  UPDATE_RECRUIT_BUTTON_CLICKED: '동아리 모집 정보 수정 버튼클릭',
  ALWAYS_RECRUIT_BUTTON_CLICKED: '상시모집 버튼클릭',
  RECRUITMENT_START_CHANGED: '모집 시작 날짜 변경',
  RECRUITMENT_END_CHANGED: '모집 종료 날짜 변경',
  RECRUITMENT_TARGET_CLEAR_BUTTON_CLICKED: '모집 대상 입력 초기화 버튼클릭',
  MARKDOWN_EDITOR_PREVIEW_BUTTON_CLICKED: '소개글 미리보기/편집 버튼클릭',

  // 활동 사진 수정
  IMAGE_UPLOAD_BUTTON_CLICKED: '활동 사진 업로드 버튼클릭',
  IMAGE_DELETE_BUTTON_CLICKED: '활동 사진 삭제 버튼클릭',

  // 비밀번호 수정
  PASSWORD_CHANGE_BUTTON_CLICKED: '비밀번호 변경 버튼클릭',
  NEW_PASSWORD_CLEAR_BUTTON_CLICKED: '새 비밀번호 입력 초기화 버튼클릭',
  CONFIRM_PASSWORD_CLEAR_BUTTON_CLICKED: '확인 비밀번호 입력 초기화 버튼클릭',
} as const;

export const PAGE_VIEW = {
  // 사용자
  APPLICATION_FORM_PAGE: 'ApplicationFormPage',
  CLUB_DETAIL_PAGE: 'ClubDetailPage',
  MAIN_PAGE: 'MainPage',
  INTRODUCE_PAGE: 'IntroducePage',
  CLUB_UNION_PAGE: 'ClubUnionPage',

  // 관리자
  LOGIN_PAGE: '로그인페이지',
  CLUB_INTRO_EDIT_PAGE: '동아리 소개 수정 페이지',
  CLUB_INFO_EDIT_PAGE: '동아리 기본 정보 수정 페이지',
  RECRUITMENT_INFO_EDIT_PAGE: '동아리 모집 정보 수정 페이지',
  PHOTO_EDIT_PAGE: '동아리 활동 사진 수정 페이지',
  ADMIN_ACCOUNT_EDIT_PAGE: '관리자 계정 수정 페이지',
} as const;
