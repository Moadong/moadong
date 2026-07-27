import type { CalendarEventColor } from '@/types/club';

/** 커스텀 캘린더 이벤트 색상 (Figma 색상바 순서) */
export const CALENDAR_EVENT_COLORS: Record<
  CalendarEventColor,
  { main: string; back: string }
> = {
  PINK: { main: '#FF7DA4', back: '#FFF0F4' },
  YELLOW: { main: '#FFD54A', back: '#FFF9E5' },
  MINT: { main: '#5FD8C0', back: '#EBFAF7' },
  BLUE: { main: '#7094FF', back: '#EFF3FF' },
  PURPLE: { main: '#C379F6', back: '#FAF2FF' },
  ORANGE: { main: '#FFA04D', back: '#FFF5E5' },
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
