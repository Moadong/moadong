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

export const PAGE_VIEW = {
  APPLICATION_FORM_PAGE: 'ApplicationFormPage' as const,
  CLUB_DETAIL_PAGE: 'ClubDetailPage' as const,
  MAIN_PAGE: 'MainPage' as const,
  INTRODUCE_PAGE: 'IntroducePage' as const,
  CLUB_UNION_PAGE: 'ClubUnionPage' as const,
} as const;