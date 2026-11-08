// 소개 하위 페이지(업데이트 기록·만드는 사람들) 전용 헤더의 메뉴 목록
export interface SubpageNavItem {
  label: string;
  to: string;
}

export const SUBPAGE_NAV: readonly SubpageNavItem[] = [
  { label: '업데이트 기록', to: '/introduce/updates' },
];
