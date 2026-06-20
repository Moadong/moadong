export interface TabItem {
  label: string;
  path: string;
}

export interface TabCategory {
  category: string;
  items: TabItem[];
}

export const ADMIN_TABS: TabCategory[] = [
  {
    category: '동아리 정보',
    items: [
      { label: '기본 정보 수정', path: '/admin/club-info' },
      { label: '소개 정보 수정', path: '/admin/club-intro' },
      { label: '활동 사진 수정', path: '/admin/photo-edit' },
      ...(import.meta.env.DEV
        ? [{ label: '동아리 일정 관리', path: '/admin/calendar-sync' }]
        : []),
    ],
  },
  {
    category: '모집 정보',
    items: [{ label: '모집 정보 수정', path: '/admin/recruit-edit' }],
  },
  {
    category: '지원 관리',
    items: [
      { label: '지원서 관리', path: '/admin/application-list' },
      { label: '지원자 현황', path: '/admin/applicants-list' },
    ],
  },
  {
    category: '계정 관리',
    items: [{ label: '비밀번호 수정', path: '/admin/account-edit' }],
  },
];
