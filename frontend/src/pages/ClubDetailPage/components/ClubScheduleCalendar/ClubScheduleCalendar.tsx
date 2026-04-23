import { useEffect, useMemo, useRef, useState } from 'react';
import type { ClubCalendarEvent } from '@/types/club';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestOpenExternalUrl } from '@/utils/webviewBridge';
import {
  buildDateKeyFromDate,
  buildMonthCalendarDays,
  dateFromKey,
  formatMonthLabel,
  parseDateKey,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './ClubScheduleCalendar.styles';

const EVENT_COLORS = [
  '#FF7DA4',
  '#FFD54A',
  '#5FD8C0',
  '#7094FF',
  '#FFA04D',
  '#C379F6',
  '#7ED957',
  '#4FC3F7',
] as const;

interface CalendarEventItem {
  id: string;
  title: string;
  description?: string;
  url?: string;
  dateKey: string;
  groupKey: string;
}

interface ClubScheduleCalendarProps {
  events: ClubCalendarEvent[];
}

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

const buildSeededPalette = (seed: string) => {
  const palette = [...EVENT_COLORS];
  let hash = hashText(seed) || 1;

  for (let index = palette.length - 1; index > 0; index -= 1) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const swapIndex = hash % (index + 1);
    [palette[index], palette[swapIndex]] = [palette[swapIndex], palette[index]];
  }

  return palette;
};

const formatSelectedDate = (dateKey: string) => {
  const date = dateFromKey(dateKey);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const ClubScheduleCalendar = ({ events }: ClubScheduleCalendarProps) => {
  const didInitFromEventsRef = useRef(false);

  const parsedEvents = useMemo<CalendarEventItem[]>(() => {
    const normalizedEvents = events.flatMap((event) => {
      const dateKey = parseDateKey(event.start);
      if (!dateKey) return [];

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        url: event.url,
        dateKey,
        groupKey: normalizeEventGroupKey(event.title),
      } satisfies CalendarEventItem;
    });

    return normalizedEvents.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }, [events]);

  const firstEventMonth = parsedEvents[0]
    ? dateFromKey(parsedEvents[0].dateKey)
    : new Date();
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    new Date(firstEventMonth.getFullYear(), firstEventMonth.getMonth(), 1),
  );

  const monthKey = `${visibleMonth.getFullYear()}-${visibleMonth.getMonth() + 1}`;

  const monthEvents = useMemo(() => {
    return parsedEvents.filter((event) => {
      const date = dateFromKey(event.dateKey);
      return (
        date.getFullYear() === visibleMonth.getFullYear() &&
        date.getMonth() === visibleMonth.getMonth()
      );
    });
  }, [parsedEvents, visibleMonth]);

  const colorByGroup = useMemo(() => {
    const groups = Array.from(
      new Set(monthEvents.map((event) => event.groupKey)),
    );
    const palette = buildSeededPalette(monthKey);
    return groups.reduce<Record<string, string>>(
      (accumulator, group, index) => {
        accumulator[group] = palette[index % palette.length];
        return accumulator;
      },
      {},
    );
  }, [monthEvents, monthKey]);

  const eventsByDate = useMemo(() => {
    return monthEvents.reduce<Record<string, CalendarEventItem[]>>(
      (accumulator, event) => {
        if (!accumulator[event.dateKey]) {
          accumulator[event.dateKey] = [];
        }
        accumulator[event.dateKey].push(event);
        return accumulator;
      },
      {},
    );
  }, [monthEvents]);

  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    if (parsedEvents[0]) return parsedEvents[0].dateKey;
    return buildDateKeyFromDate(new Date());
  });

  useEffect(() => {
    if (didInitFromEventsRef.current || parsedEvents.length === 0) return;
    const firstDate = dateFromKey(parsedEvents[0].dateKey);
    setVisibleMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
    setSelectedDateKey(parsedEvents[0].dateKey);
    didInitFromEventsRef.current = true;
  }, [parsedEvents]);

  const calendarDays = useMemo(
    () => buildMonthCalendarDays(visibleMonth),
    [visibleMonth],
  );

  const selectedEvents = eventsByDate[selectedDateKey] ?? [];

  const changeMonth = (diff: number) => {
    const next = new Date(
      visibleMonth.getFullYear(),
      visibleMonth.getMonth() + diff,
      1,
    );
    setVisibleMonth(next);

    const firstDayKey = buildDateKeyFromDate(next);
    const firstEventInMonth = parsedEvents.find((event) => {
      const date = dateFromKey(event.dateKey);
      return (
        date.getFullYear() === next.getFullYear() &&
        date.getMonth() === next.getMonth()
      );
    });
    setSelectedDateKey(firstEventInMonth?.dateKey ?? firstDayKey);
  };

  if (parsedEvents.length === 0) {
    return (
      <Styled.ScheduleCard>
        <Styled.SectionTitle>일정</Styled.SectionTitle>
        <Styled.EmptyText>등록된 행사 일정이 없습니다.</Styled.EmptyText>
      </Styled.ScheduleCard>
    );
  }

  return (
    <Styled.Container>
      <Styled.CalendarCard>
        <Styled.MonthHeader>
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
        </Styled.MonthHeader>

        <Styled.WeekdayGrid>
          {WEEKDAY_LABELS.map((day, dayIndex) => (
            <Styled.Weekday key={day} $dayIndex={dayIndex}>
              {day}
            </Styled.Weekday>
          ))}
        </Styled.WeekdayGrid>

        <Styled.DayGrid>
          {calendarDays.map((day) => {
            const dateKey = buildDateKeyFromDate(day);
            const dayEvents = eventsByDate[dateKey] ?? [];
            const firstColor = dayEvents[0]
              ? colorByGroup[dayEvents[0].groupKey]
              : undefined;
            const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
            const uniqueColors = Array.from(
              new Set(
                dayEvents
                  .map((event) => colorByGroup[event.groupKey])
                  .filter((color): color is string => !!color),
              ),
            );

            return (
              <Styled.DayCell
                type='button'
                key={dateKey}
                $isCurrentMonth={isCurrentMonth}
                $isSelected={selectedDateKey === dateKey}
                onClick={() => setSelectedDateKey(dateKey)}
              >
                <Styled.DayNumber $highlightColor={firstColor}>
                  {day.getDate()}
                </Styled.DayNumber>
                <Styled.DotRow>
                  {uniqueColors.slice(0, 3).map((color) => (
                    <Styled.Dot key={`${dateKey}-${color}`} $color={color} />
                  ))}
                </Styled.DotRow>
              </Styled.DayCell>
            );
          })}
        </Styled.DayGrid>
      </Styled.CalendarCard>

      <Styled.ScheduleCard>
        <Styled.SectionTitle>일정</Styled.SectionTitle>
        <Styled.SelectedDateLabel>
          {formatSelectedDate(selectedDateKey)}
        </Styled.SelectedDateLabel>
        <Styled.MobilePanelHint>
          같은 이름 계열의 이벤트는 같은 색으로 표시됩니다.
        </Styled.MobilePanelHint>

        {selectedEvents.length === 0 ? (
          <Styled.EmptyText>
            선택한 날짜에 등록된 일정이 없습니다.
          </Styled.EmptyText>
        ) : (
          <Styled.EventList>
            {selectedEvents.map((event) => {
              const eventColor =
                colorByGroup[event.groupKey] ?? EVENT_COLORS[0];
              return (
                <Styled.EventItem key={event.id}>
                  <Styled.EventHeader>
                    <Styled.Dot $color={eventColor} />
                    <Styled.EventTitle>{event.title}</Styled.EventTitle>
                  </Styled.EventHeader>
                  {event.description && (
                    <Styled.EventDescription>
                      {event.description}
                    </Styled.EventDescription>
                  )}
                  {event.url && (
                    <Styled.EventLink
                      href={isInAppWebView() ? undefined : event.url}
                      target={isInAppWebView() ? undefined : '_blank'}
                      rel='noreferrer'
                      onClick={(e) => {
                        if (isInAppWebView()) {
                          e.preventDefault();
                          requestOpenExternalUrl(event.url!);
                        }
                      }}
                    >
                      일정 상세 보기
                    </Styled.EventLink>
                  )}
                </Styled.EventItem>
              );
            })}
          </Styled.EventList>
        )}
      </Styled.ScheduleCard>
    </Styled.Container>
  );
};

export default ClubScheduleCalendar;
