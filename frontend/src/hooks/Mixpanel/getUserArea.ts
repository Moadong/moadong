// Mixpanel 이벤트가 학생·관리자 중 어느 영역의 행동인지 판별한다 (user_area 속성)
import { ADMIN_EVENT, PageViewName } from '@/constants/eventName';

export type UserArea = 'student' | 'admin';

const ADMIN_EVENT_NAMES: ReadonlySet<string> = new Set(
  Object.values(ADMIN_EVENT),
);

/** ADMIN_EVENT에 있는 이벤트면 관리자 행동이다. 동아리 상세의 모집 기간 변경처럼 학생 화면에서 일어나도 같다 */
export const getEventUserArea = (eventName: string): UserArea =>
  ADMIN_EVENT_NAMES.has(eventName) ? 'admin' : 'student';

/** 관리자 페이지는 page_name이 admin_으로 시작한다 */
export const getPageUserArea = (pageName: PageViewName): UserArea =>
  pageName.startsWith('admin_') ? 'admin' : 'student';
