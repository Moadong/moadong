import { DEFAULT_CUSTOM_EVENT_TYPE } from '@/constants/calendarEvent';
import type { CalendarEventColor, ClubCalendarEvent } from '@/types/club';
import { buildDateKeyFromDate, parseDateKey } from './calendarSyncUtils';
import { buildOccurrenceId, expandEventOccurrences } from './eventOccurrences';

/**
 * 한 주(7일) 안에서 렌더링할 이벤트 막대 하나.
 * - 기간(PERIOD) 일정: 주 경계로 잘린 연속 막대 (span > 1 가능)
 * - 그 외: 하루짜리 칩 (span === 1)
 */
export interface WeekEventSegment {
  key: string;
  eventId: string;
  title: string;
  color?: CalendarEventColor;
  /** 주 내 시작 위치 (0=일요일 ~ 6=토요일) */
  startIndex: number;
  /** 가로로 차지하는 칸 수 */
  span: number;
  /** 세로 줄 번호 (0부터, 겹치지 않게 배정됨) */
  lane: number;
  /** 클릭 시 열 날짜 */
  dateKey: string;
}

const isPeriodEvent = (event: ClubCalendarEvent) =>
  (event.eventType ?? DEFAULT_CUSTOM_EVENT_TYPE) === 'PERIOD';

/** 겹치지 않도록 각 막대에 세로 줄(lane)을 배정한다. */
const assignLanes = (
  segments: Omit<WeekEventSegment, 'lane'>[],
): WeekEventSegment[] => {
  // 시작이 빠른 순 → 긴 막대 우선 (기간 일정이 위로 오도록)
  const sorted = [...segments].sort(
    (a, b) => a.startIndex - b.startIndex || b.span - a.span,
  );
  const lanes: boolean[][] = [];

  return sorted.map((segment) => {
    const columns = Array.from(
      { length: segment.span },
      (_, offset) => segment.startIndex + offset,
    );

    let lane = 0;
    for (;;) {
      if (!lanes[lane]) lanes[lane] = new Array(7).fill(false);
      const isFree = columns.every((column) => !lanes[lane][column]);
      if (isFree) {
        columns.forEach((column) => {
          lanes[lane][column] = true;
        });
        break;
      }
      lane += 1;
    }

    return { ...segment, lane };
  });
};

/**
 * 주어진 주(7일)에 표시할 이벤트 막대 목록을 만든다.
 * 기간 일정은 하나의 연속 막대로, 나머지는 날짜별 칩으로 전개된다.
 */
export const buildWeekEventSegments = (
  events: ClubCalendarEvent[],
  weekDays: Date[],
  /**
   * 주면 이 달에 속한 날짜까지만 막대를 그린다.
   * 월 그리드의 첫/마지막 주에는 앞뒤 달 날짜가 섞여 있는데,
   * 그 칸까지 색이 새지 않도록 자르는 용도.
   */
  visibleMonth?: Date,
): WeekEventSegment[] => {
  if (weekDays.length === 0) return [];

  const weekKeys = weekDays.map(buildDateKeyFromDate);
  const weekStartKey = weekKeys[0];
  const weekEndKey = weekKeys[weekKeys.length - 1];

  const monthStartKey = visibleMonth
    ? buildDateKeyFromDate(
        new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1),
      )
    : null;
  const monthEndKey = visibleMonth
    ? buildDateKeyFromDate(
        new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0),
      )
    : null;

  const rangeStartKey =
    monthStartKey && monthStartKey > weekStartKey ? monthStartKey : weekStartKey;
  const rangeEndKey =
    monthEndKey && monthEndKey < weekEndKey ? monthEndKey : weekEndKey;

  const segments: Omit<WeekEventSegment, 'lane'>[] = [];

  events.forEach((event) => {
    if (isPeriodEvent(event)) {
      const startKey = parseDateKey(event.start);
      const endKey = event.end ? parseDateKey(event.end) : startKey;
      if (!startKey || !endKey) return;

      // 이벤트 기간과 이번 주 표시 범위의 교집합
      const from = startKey > rangeStartKey ? startKey : rangeStartKey;
      const to = endKey < rangeEndKey ? endKey : rangeEndKey;
      if (from > to) return;

      const startIndex = weekKeys.indexOf(from);
      const endIndex = weekKeys.indexOf(to);
      if (startIndex === -1 || endIndex === -1) return;

      segments.push({
        key: buildOccurrenceId(event.id, from),
        eventId: event.id,
        title: event.title,
        color: event.color,
        startIndex,
        span: endIndex - startIndex + 1,
        dateKey: from,
      });
      return;
    }

    // SINGLE / MULTI / RECURRING → 날짜별 칩
    expandEventOccurrences(
      [event],
      weekDays[0],
      weekDays[weekDays.length - 1],
    ).forEach((occurrence) => {
      if (occurrence.dateKey < rangeStartKey) return;
      if (occurrence.dateKey > rangeEndKey) return;
      const startIndex = weekKeys.indexOf(occurrence.dateKey);
      if (startIndex === -1) return;
      segments.push({
        key: occurrence.occurrenceId,
        eventId: occurrence.eventId,
        title: occurrence.title,
        color: event.color,
        startIndex,
        span: 1,
        dateKey: occurrence.dateKey,
      });
    });
  });

  return assignLanes(segments);
};
