import { useEffect, useRef, useState } from 'react';
import { DEFAULT_CUSTOM_EVENT_TYPE } from '@/constants/calendarEvent';
import {
  CALENDAR_EVENT_COLOR_ORDER,
  CALENDAR_EVENT_COLORS,
} from '@/constants/calendarEventColors';
import type { CalendarEventColor, ClubCalendarEvent } from '@/types/club';
import {
  buildDateKeyFromDate,
  buildMonthCalendarDays,
  dateFromKey,
  formatMonthLabel,
  formatShortMonthDay,
  parseDateKey,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import { buildWeekEventSegments } from '@/utils/calendarWeekSegments';
import { expandEventOccurrences } from '@/utils/eventOccurrences';
import * as Styled from './ClubScheduleCalendar.styles';

interface ScheduleListItem {
  key: string;
  title: string;
  dateText: string;
  color: CalendarEventColor;
}

const isPeriodEvent = (event: ClubCalendarEvent) =>
  (event.eventType ?? DEFAULT_CUSTOM_EVENT_TYPE) === 'PERIOD';

/**
 * 제목이 같은 계열인 이벤트를 한 그룹으로 묶기 위한 키.
 * 관리자에서 색을 지정하지 않은 이벤트(Google/Notion 등)에만 쓰인다.
 */
const normalizeEventGroupKey = (title: string) => {
  const normalized = title
    .toLowerCase()
    .replace(/[\d]+/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[^가-힣a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized || title.trim().toLowerCase();
};

const hashText = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
};

/** 월마다 다른 순서로 섞인 팔레트를 만들어 그룹별 색을 배정한다. */
const buildSeededPalette = (seed: string) => {
  const palette = [...CALENDAR_EVENT_COLOR_ORDER];
  let hash = hashText(seed) || 1;

  for (let index = palette.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const swapIndex = hash % (index + 1);
    [palette[index], palette[swapIndex]] = [palette[swapIndex], palette[index]];
  }

  return palette;
};

const splitIntoWeeks = (days: Date[]) => {
  const weeks: Date[][] = [];
  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }
  return weeks;
};

interface ClubScheduleCalendarProps {
  events: ClubCalendarEvent[];
}

const ClubScheduleCalendar = ({ events }: ClubScheduleCalendarProps) => {
  const didInitFromEventsRef = useRef(false);

  const sortedEvents = [...events]
    .filter((event) => parseDateKey(event.start))
    .sort((a, b) => a.start.localeCompare(b.start));

  const firstEventKey = parseDateKey(sortedEvents[0]?.start ?? '');
  const firstEventMonth = firstEventKey
    ? dateFromKey(firstEventKey)
    : new Date();
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    new Date(firstEventMonth.getFullYear(), firstEventMonth.getMonth(), 1),
  );

  useEffect(() => {
    if (didInitFromEventsRef.current || !firstEventKey) return;
    const firstDate = dateFromKey(firstEventKey);
    setVisibleMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
    didInitFromEventsRef.current = true;
  }, [firstEventKey]);

  const calendarDays = buildMonthCalendarDays(visibleMonth);
  const weeks = splitIntoWeeks(calendarDays);

  /** 관리자가 지정한 색이 없으면 제목 계열별로 팔레트에서 배정한다. */
  const monthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth() + 1}`;
  const palette = buildSeededPalette(monthKey);
  const groupColors = new Map<string, CalendarEventColor>();
  sortedEvents.forEach((event) => {
    const groupKey = normalizeEventGroupKey(event.title);
    if (groupColors.has(groupKey)) return;
    groupColors.set(groupKey, palette[groupColors.size % palette.length]);
  });
  const colorOf = (event: ClubCalendarEvent): CalendarEventColor =>
    event.color ??
    groupColors.get(normalizeEventGroupKey(event.title)) ??
    palette[0];

  const periodEvents = sortedEvents.filter(isPeriodEvent);

  /**
   * 날짜 숫자를 색 원으로 채울 날짜 목록.
   * 기간 일정은 시작일/종료일에만 원을 찍고 사이는 띠로 잇는다.
   */
  const circleColorByDate = new Map<string, CalendarEventColor>();
  expandEventOccurrences(
    sortedEvents.filter((event) => !isPeriodEvent(event)),
    calendarDays[0],
    calendarDays[calendarDays.length - 1],
  ).forEach((occurrence) => {
    circleColorByDate.set(occurrence.dateKey, colorOf(occurrence.event));
  });
  periodEvents.forEach((event) => {
    const startKey = parseDateKey(event.start);
    const endKey = event.end ? parseDateKey(event.end) : startKey;
    [startKey, endKey].forEach((dateKey) => {
      if (!dateKey) return;
      circleColorByDate.set(dateKey, colorOf(event));
    });
  });

  /** 그 달에 걸치는 모든 일정을 날짜순으로 나열한다. */
  const monthStart = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
    1,
  );
  const monthEnd = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  );
  const scheduleItems: ScheduleListItem[] = sortedEvents
    .flatMap<ScheduleListItem & { sortKey: string }>((event) => {
      const color = colorOf(event);

      if (isPeriodEvent(event)) {
        const startKey = parseDateKey(event.start);
        const endKey = event.end ? parseDateKey(event.end) : startKey;
        if (!startKey || !endKey) return [];
        // 기간이 이번 달에 조금이라도 걸치면 한 줄로 표시한다
        if (endKey < buildDateKeyFromDate(monthStart)) return [];
        if (startKey > buildDateKeyFromDate(monthEnd)) return [];

        return {
          key: event.id,
          title: event.title,
          dateText:
            startKey === endKey
              ? formatShortMonthDay(startKey)
              : `${formatShortMonthDay(startKey)} - ${formatShortMonthDay(endKey)}`,
          color,
          sortKey: startKey,
        };
      }

      return expandEventOccurrences([event], monthStart, monthEnd).map(
        (occurrence) => ({
          key: occurrence.occurrenceId,
          title: occurrence.title,
          dateText: formatShortMonthDay(occurrence.dateKey),
          color,
          sortKey: occurrence.dateKey,
        }),
      );
    })
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const todayKey = buildDateKeyFromDate(new Date());

  const changeMonth = (diff: number) => {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + diff, 1),
    );
  };

  const moveToToday = () => {
    const today = new Date();
    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  if (sortedEvents.length === 0) {
    return (
      <Styled.EmptyState>
        곧 새로운 일정이 업데이트될 예정이에요
      </Styled.EmptyState>
    );
  }

  return (
    <Styled.Container>
      <Styled.MonthHeader>
        <Styled.MonthNav>
          <Styled.MonthMoveButton
            type='button'
            aria-label='이전 달'
            onClick={() => changeMonth(-1)}
          >
            ◀
          </Styled.MonthMoveButton>
          <Styled.MonthLabel>
            {formatMonthLabel(visibleMonth)}
          </Styled.MonthLabel>
          <Styled.MonthMoveButton
            type='button'
            aria-label='다음 달'
            onClick={() => changeMonth(1)}
          >
            ▶
          </Styled.MonthMoveButton>
        </Styled.MonthNav>
        <Styled.TodayButton type='button' onClick={moveToToday}>
          오늘
        </Styled.TodayButton>
      </Styled.MonthHeader>

      <Styled.CalendarCard>
        <Styled.WeekdayGrid>
          {WEEKDAY_LABELS.map((day, dayIndex) => (
            <Styled.Weekday key={day} $dayIndex={dayIndex}>
              {day}
            </Styled.Weekday>
          ))}
        </Styled.WeekdayGrid>

        <Styled.WeekList>
          {weeks.map((weekDays) => {
            const bands = buildWeekEventSegments(periodEvents, weekDays);

            return (
              <Styled.Week key={buildDateKeyFromDate(weekDays[0])}>
                <Styled.BandLayer aria-hidden>
                  {bands.map((band) => (
                    <Styled.Band
                      key={band.key}
                      $startIndex={band.startIndex}
                      $span={band.span}
                      $back={CALENDAR_EVENT_COLORS[band.color ?? 'PINK'].tag}
                    />
                  ))}
                </Styled.BandLayer>

                <Styled.DayGrid>
                  {weekDays.map((day) => {
                    const dateKey = buildDateKeyFromDate(day);
                    const circleColor = circleColorByDate.get(dateKey);

                    return (
                      <Styled.DayCell
                        key={dateKey}
                        $isCurrentMonth={
                          day.getMonth() === visibleMonth.getMonth()
                        }
                      >
                        <Styled.DayNumber
                          $dayIndex={day.getDay()}
                          $fill={
                            circleColor
                              ? CALENDAR_EVENT_COLORS[circleColor].main
                              : undefined
                          }
                          $isToday={dateKey === todayKey}
                        >
                          {day.getDate()}
                        </Styled.DayNumber>
                      </Styled.DayCell>
                    );
                  })}
                </Styled.DayGrid>
              </Styled.Week>
            );
          })}
        </Styled.WeekList>
      </Styled.CalendarCard>

      <Styled.ScheduleSection>
        <Styled.SectionTitle>일정</Styled.SectionTitle>

        {scheduleItems.length === 0 ? (
          <Styled.EmptyText>이 달에 등록된 일정이 없습니다.</Styled.EmptyText>
        ) : (
          <Styled.EventList>
            {scheduleItems.map((item) => {
              const main = CALENDAR_EVENT_COLORS[item.color].main;
              return (
                <Styled.EventItem key={item.key}>
                  <Styled.EventLabel>
                    <Styled.Dot $color={main} />
                    <Styled.EventTitle>{item.title}</Styled.EventTitle>
                  </Styled.EventLabel>
                  <Styled.EventDate $color={main}>
                    {item.dateText}
                  </Styled.EventDate>
                </Styled.EventItem>
              );
            })}
          </Styled.EventList>
        )}
      </Styled.ScheduleSection>
    </Styled.Container>
  );
};

export default ClubScheduleCalendar;
