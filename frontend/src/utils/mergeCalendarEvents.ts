import type { GoogleCalendarEvent } from '@/apis/calendarOAuth';
import type { ClubCalendarEvent, HiddenCalendarEvent } from '@/types/club';
import {
  convertGoogleEventToUnified,
  convertNotionEventToUnified,
  type NotionCalendarEvent,
  type UnifiedCalendarEvent,
} from './calendarSyncUtils';

interface MergeCalendarEventsParams {
  googleCalendarEvents: GoogleCalendarEvent[];
  notionCalendarEvents: NotionCalendarEvent[];
  /** 커스텀 이벤트는 반복 규칙을 가진 원형 그대로 넘긴다 */
  customCalendarEvents: ClubCalendarEvent[];
  hiddenCalendarEvents: HiddenCalendarEvent[];
}

/**
 * Google·Notion 이벤트는 연동 시점에 이미 발생일별로 펼쳐져 내려오므로
 * 하루짜리 단일 일정으로 취급한다.
 */
const toSingleEvent = (unified: UnifiedCalendarEvent): ClubCalendarEvent => ({
  id: unified.id,
  title: unified.title,
  start: unified.dateKey,
  end: unified.end,
  url: unified.url,
  description: unified.description,
  source: unified.source,
  eventType: 'SINGLE',
});

/**
 * 캘린더에 표시할 모든 이벤트를 하나의 목록으로 합친다.
 * 커스텀 이벤트만 반복/기간/다중 정보를 유지하며, 전개는 표시 시점에 이뤄진다.
 */
export const mergeCalendarEvents = ({
  googleCalendarEvents,
  notionCalendarEvents,
  customCalendarEvents,
  hiddenCalendarEvents,
}: MergeCalendarEventsParams): ClubCalendarEvent[] => {
  const hiddenKeys = new Set(
    hiddenCalendarEvents.map((event) => `${event.source}:${event.eventId}`),
  );

  const googleEvents = googleCalendarEvents
    .filter((event) => !hiddenKeys.has(`GOOGLE:${event.id}`))
    .map(convertGoogleEventToUnified)
    .filter((event): event is UnifiedCalendarEvent => event !== null)
    .map(toSingleEvent);

  const notionEvents = notionCalendarEvents
    .filter((event) => !hiddenKeys.has(`NOTION:${event.id}`))
    .map(convertNotionEventToUnified)
    .map(toSingleEvent);

  return [...googleEvents, ...notionEvents, ...customCalendarEvents];
};
