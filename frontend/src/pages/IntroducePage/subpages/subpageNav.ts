// 소개 페이지 전용 헤더의 메뉴 목록
export interface SubpageNavItem {
  label: string;
  to: string;
}

export const SUBPAGE_NAV: readonly SubpageNavItem[] = [
  { label: '서비스 소개', to: '/introduce' },
  { label: '업데이트 기록', to: '/introduce/updates' },
];
