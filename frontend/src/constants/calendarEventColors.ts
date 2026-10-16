import type { CalendarEventColor } from '@/types/club';

/**
 * 커스텀 캘린더 이벤트 색상 (Figma 색상바 순서).
 * theme의 secondary 팔레트와 같은 값이며 tag는 그보다 진한 배경 톤이다.
 */
export const CALENDAR_EVENT_COLORS: Record<
  CalendarEventColor,
  { main: string; back: string; tag: string }
> = {
  PINK: { main: '#FF7DA4', back: '#FFF0F4', tag: '#FFEBF1' },
  YELLOW: { main: '#FFD54A', back: '#FFF9E5', tag: '#FFF6D6' },
  MINT: { main: '#5FD8C0', back: '#EBFAF7', tag: '#E3FAF5' },
  BLUE: { main: '#7094FF', back: '#EFF3FF', tag: '#E5ECFF' },
  PURPLE: { main: '#C379F6', back: '#FAF2FF', tag: '#F7EBFF' },
  ORANGE: { main: '#FFA04D', back: '#FFF5E5', tag: '#FFF2DB' },
} as const;

export const CALENDAR_EVENT_COLOR_ORDER: CalendarEventColor[] = [
  'PINK',
  'YELLOW',
  'MINT',
  'BLUE',
  'PURPLE',
  'ORANGE',
];

export const DEFAULT_CALENDAR_EVENT_COLOR: CalendarEventColor = 'PINK';
