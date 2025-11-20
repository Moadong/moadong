export const USER_EVENT = {
  CATEGORY_BUTTON_CLICKED: 'CategoryButton Clicked' as const,
  SEARCH_BOX_CLICKED: 'SearchBox Clicked' as const,

  // 네비게이션
  BACK_BUTTON_CLICKED: 'Back Button Clicked' as const,
  HOME_BUTTON_CLICKED: 'Home Button Clicked' as const,
  MOBILE_HOME_BUTTON_CLICKED: 'Mobile Home Button Clicked' as const,
  MOBILE_MENU_BUTTON_CLICKED: 'Mobile Menu Button Clicked' as const,
  MOBILE_MENU_DELETE_BUTTON_CLICKED:
    'Mobile Menubar delete Button Clicked' as const,

  // 탭 & 섹션
  TAB_CLICKED: 'Tab Clicked' as const,
  PHOTO_NAVIGATION_CLICKED: 'Photo Navigation' as const,
  CLUB_CARD_CLICKED: 'ClubCard Clicked' as const,

  // 동아리 지원
  CLUB_APPLY_BUTTON_CLICKED: 'Club Apply Button Clicked' as const,
  RECOMMENDED_CLUB_CLICKED: 'Recommended Club Clicked' as const,
  CLUB_UNION_BUTTON_CLICKED: 'Club Union Button Clicked' as const,

  // 공유 버튼
  SHARE_BUTTON_CLICKED: 'Share Button Clicked' as const,
  SNS_LINK_CLICKED: 'SNS Link Button Clicked' as const,

  STATUS_RADIO_BUTTON_CLICKED: 'StatusRadioButton Clicked' as const,
  INTRODUCE_BUTTON_CLICKED: 'Introduce Button Clicked' as const,
  APPLICATION_FORM_SUBMITTED: 'Application Form Submitted' as const,
  PATCH_NOTE_BUTTON_CLICKED: 'Patch Note Button Clicked' as const,
} as const;

export const ADMIN_EVENT = {
  // 로그인 페이지
  LOGIN_BUTTON_CLICKED: '로그인 버튼클릭' as const,
  SIGNUP_BUTTON_CLICKED: '회원가입 버튼클릭' as const,
  FORGOT_ID_BUTTON_CLICKED: '아이디 찾기 버튼클릭' as const,
  FORGOT_PASSWORD_BUTTON_CLICKED: '비밀번호 찾기 버튼클릭' as const,

  // 사이드바
  TAB_CLICKED: '사이드바 탭 클릭' as const,
  LOGOUT_BUTTON_CLICKED: '로그아웃 버튼클릭' as const,

  // 기본 정보 수정
  UPDATE_CLUB_BUTTON_CLICKED: '동아리 기본 정보 수정 버튼클릭' as const,
  CLUB_NAME_CLEAR_BUTTON_CLICKED: '동아리 명 입력 초기화 버튼클릭' as const,
  CLUB_PRESIDENT_CLEAR_BUTTON_CLICKED: '회장 정보 입력 초기화 버튼클릭' as const,
  TELEPHONE_NUMBER_CLEAR_BUTTON_CLICKED: '전화번호 입력 초기화 버튼클릭' as const,
  CLUB_INTRODUCTION_CLEAR_BUTTON_CLICKED: '한줄소개 입력 초기화 버튼클릭' as const,
  CLUB_TAG_SELECT_BUTTON_CLICKED: '분류/분과/자유태그 선택 버튼클릭' as const,
  CLUB_TAG_CLEAR_BUTTON_CLICKED: '자유태그 입력 초기화 버튼클릭' as const,
  CLUB_SNS_LINK_CLEAR_BUTTON_CLICKED: 'SNS 링크 입력 초기화 버튼클릭' as const,

  // 모집 정보 수정
  UPDATE_RECRUIT_BUTTON_CLICKED: '동아리 모집 정보 수정 버튼클릭' as const,
  ALWAYS_RECRUIT_BUTTON_CLICKED: '상시모집 버튼클릭' as const,
  RECRUITMENT_START_CHANGED: '모집 시작 날짜 변경' as const,
  RECRUITMENT_END_CHANGED: '모집 종료 날짜 변경' as const,
  RECRUITMENT_TARGET_CLEAR_BUTTON_CLICKED: '모집 대상 입력 초기화 버튼클릭' as const,
  MARKDOWN_EDITOR_PREVIEW_BUTTON_CLICKED: '소개글 미리보기/편집 버튼클릭' as const,

  // 활동 사진 수정
  IMAGE_UPLOAD_BUTTON_CLICKED: '활동 사진 업로드 버튼클릭' as const,
  IMAGE_DELETE_BUTTON_CLICKED: '활동 사진 삭제 버튼클릭' as const,

  // 비밀번호 수정
  PASSWORD_CHANGE_BUTTON_CLICKED: '비밀번호 변경 버튼클릭' as const,
  NEW_PASSWORD_CLEAR_BUTTON_CLICKED: '새 비밀번호 입력 초기화 버튼클릭' as const,
  CONFIRM_PASSWORD_CLEAR_BUTTON_CLICKED: '확인 비밀번호 입력 초기화 버튼클릭' as const,
} as const;

export const PAGE_VIEW = {
  // 사용자
  APPLICATION_FORM_PAGE: 'ApplicationFormPage' as const,
  CLUB_DETAIL_PAGE: 'ClubDetailPage' as const,
  MAIN_PAGE: 'MainPage' as const,
  INTRODUCE_PAGE: 'IntroducePage' as const,
  CLUB_UNION_PAGE: 'ClubUnionPage' as const,

  // 관리자
  LOGIN_PAGE: '로그인페이지' as const,
  CLUB_INFO_EDIT_PAGE: '동아리 기본 정보 수정 페이지' as const,
  RECRUITMENT_INFO_EDIT_PAGE: '동아리 모집 정보 수정 페이지' as const,
  PHOTO_EDIT_PAGE: '동아리 활동 사진 수정 페이지' as const,
  ADMIN_ACCOUNT_EDIT_PAGE: '관리자 계정 수정 페이지' as const,
} as const;