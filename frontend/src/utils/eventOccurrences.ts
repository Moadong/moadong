import { addDays } from 'date-fns';
import { DEFAULT_CUSTOM_EVENT_TYPE } from '@/constants/calendarEvent';
import type { ClubCalendarEvent } from '@/types/club';
import {
  buildDateKeyFromDate,
  dateFromKey,
  parseDateKey,
} from './calendarSyncUtils';

/**
 * 캘린더에 표시할 단일 발생일.
 * 반복/기간/다중 이벤트는 원형(event) 하나가 여러 발생일로 전개된다.
 */
export interface CalendarEventOccurrence {
  occurrenceId: string;
  eventId: string;
  dateKey: string;
  title: string;
  event: ClubCalendarEvent;
}

/** 발생일 하나를 가리키는 식별자 (목록 렌더링 key로도 사용) */
export const buildOccurrenceId = (eventId: string, dateKey: string) =>
  `${eventId}:${dateKey}`;

const clampToRange = (date: Date, rangeStart: Date, rangeEnd: Date) =>
  date >= rangeStart && date <= rangeEnd;

const buildOccurrence = (
  event: ClubCalendarEvent,
  dateKey: string,
): CalendarEventOccurrence => ({
  occurrenceId: buildOccurrenceId(event.id, dateKey),
  eventId: event.id,
  dateKey,
  title: event.title,
  event,
});

const expandRecurring = (
  event: ClubCalendarEvent,
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEventOccurrence[] => {
  const recurrence = event.recurrence;
  const startKey = parseDateKey(event.start);
  if (!recurrence || !startKey) return [];

  const seriesStart = dateFromKey(startKey);
  const seriesEndKey = recurrence.end ? parseDateKey(recurrence.end) : null;
  const seriesEnd = seriesEndKey ? dateFromKey(seriesEndKey) : rangeEnd;
  const excluded = new Set(recurrence.excludedDates ?? []);

  const from = seriesStart > rangeStart ? seriesStart : rangeStart;
  const to = seriesEnd < rangeEnd ? seriesEnd : rangeEnd;
  if (from > to) return [];

  const occurrences: CalendarEventOccurrence[] = [];
  const pushIfMatch = (date: Date, matches: boolean) => {
    if (!matches) return;
    const dateKey = buildDateKeyFromDate(date);
    if (excluded.has(dateKey)) return;
    occurrences.push(buildOccurrence(event, dateKey));
  };

  if (recurrence.frequency === 'WEEKLY') {
    const weekdays =
      recurrence.weekdays && recurrence.weekdays.length > 0
        ? new Set(recurrence.weekdays)
        : new Set([seriesStart.getDay()]);
    for (let date = from; date <= to; date = addDays(date, 1)) {
      pushIfMatch(date, weekdays.has(date.getDay()));
    }
    return occurrences;
  }

  if (recurrence.frequency === 'MONTHLY') {
    const dayOfMonth = seriesStart.getDate();
    for (let date = from; date <= to; date = addDays(date, 1)) {
      pushIfMatch(date, date.getDate() === dayOfMonth);
    }
    return occurrences;
  }

  // YEARLY
  const month = seriesStart.getMonth();
  const day = seriesStart.getDate();
  for (let date = from; date <= to; date = addDays(date, 1)) {
    pushIfMatch(date, date.getMonth() === month && date.getDate() === day);
  }
  return occurrences;
};

/**
 * 이벤트 목록을 [rangeStart, rangeEnd] 구간의 발생일 목록으로 전개한다.
 * - SINGLE(또는 eventType 없음): start 하루
 * - PERIOD: start~end 각 날
 * - MULTI: dates[] 각각
 * - RECURRING: 반복 규칙 전개 (excludedDates 제외)
 */
export const expandEventOccurrences = (
  events: ClubCalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date,
): CalendarEventOccurrence[] => {
  const occurrences: CalendarEventOccurrence[] = [];

  events.forEach((event) => {
    const eventType = event.eventType ?? DEFAULT_CUSTOM_EVENT_TYPE;

    if (eventType === 'RECURRING') {
      occurrences.push(...expandRecurring(event, rangeStart, rangeEnd));
      return;
    }

    if (eventType === 'MULTI') {
      (event.dates ?? []).forEach((rawDate) => {
        const dateKey = parseDateKey(rawDate);
        if (!dateKey) return;
        if (!clampToRange(dateFromKey(dateKey), rangeStart, rangeEnd)) return;
        occurrences.push(buildOccurrence(event, dateKey));
      });
      return;
    }

    if (eventType === 'PERIOD') {
      const startKey = parseDateKey(event.start);
      const endKey = event.end ? parseDateKey(event.end) : startKey;
      if (!startKey || !endKey) return;
      const periodEnd = dateFromKey(endKey);
      for (
        let date = dateFromKey(startKey);
        date <= periodEnd;
        date = addDays(date, 1)
      ) {
        if (!clampToRange(date, rangeStart, rangeEnd)) continue;
        occurrences.push(buildOccurrence(event, buildDateKeyFromDate(date)));
      }
      return;
    }

    // SINGLE
    const dateKey = parseDateKey(event.start);
    if (!dateKey) return;
    if (!clampToRange(dateFromKey(dateKey), rangeStart, rangeEnd)) return;
    occurrences.push(buildOccurrence(event, dateKey));
  });

  return occurrences.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
};
