import { useMemo, useState } from 'react';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import {
  CALENDAR_EVENT_COLORS,
  DEFAULT_CALENDAR_EVENT_COLOR,
} from '@/constants/calendarEventColors';
import { useGetCustomCalendarEvents } from '@/hooks/Queries/useCustomCalendarEvents';
import {
  buildDateKeyFromDate,
  buildMonthCalendarDays,
  formatMonthLabel,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import { buildWeekEventSegments } from '@/utils/calendarWeekSegments';
import {
  expandEventOccurrences,
  type CalendarEventOccurrence,
} from '@/utils/eventOccurrences';
import AddEventSheet from '../AddEventSheet/AddEventSheet';
import DayEventsModal from '../DayEventsModal/DayEventsModal';
import * as Styled from './MobileCalendarView.styles';

const MobileCalendarView = () => {
  const { data: events = [] } = useGetCustomCalendarEvents();

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [addSheetDate, setAddSheetDate] = useState<string | null>(null);

  const calendarDays = useMemo(() => buildMonthCalendarDays(month), [month]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let index = 0; index < calendarDays.length; index += 7) {
      result.push(calendarDays.slice(index, index + 7));
    }
    return result;
  }, [calendarDays]);

  /** 날짜별 일정 목록 (바텀시트에서 사용) */
  const occurrencesByDate = useMemo(() => {
    if (calendarDays.length === 0) return {};
    const occurrences = expandEventOccurrences(
      events,
      calendarDays[0],
      calendarDays[calendarDays.length - 1],
    );
    return occurrences.reduce<Record<string, CalendarEventOccurrence[]>>(
      (accumulator, occurrence) => {
        (accumulator[occurrence.dateKey] ??= []).push(occurrence);
        return accumulator;
      },
      {},
    );
  }, [events, calendarDays]);

  const todayKey = buildDateKeyFromDate(new Date());

  const changeMonth = (diff: number) =>
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));

  const goToday = () => {
    const now = new Date();
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <Styled.Container>
      <WebviewTopBar title='동아리 일정 관리' />
      <Styled.Content>
        <Styled.Header>
          <Styled.MonthNav>
            <Styled.ArrowButton
              type='button'
              aria-label='이전 달'
              onClick={() => changeMonth(-1)}
            >
              ◀
            </Styled.ArrowButton>
            <Styled.MonthLabel>{formatMonthLabel(month)}</Styled.MonthLabel>
            <Styled.ArrowButton
              type='button'
              aria-label='다음 달'
              onClick={() => changeMonth(1)}
            >
              ▶
            </Styled.ArrowButton>
          </Styled.MonthNav>
          <Styled.TodayButton type='button' onClick={goToday}>
            오늘
          </Styled.TodayButton>
        </Styled.Header>

        <Styled.WeekdayRow>
          {WEEKDAY_LABELS.map((label, index) => (
            <Styled.Weekday key={label} $dayIndex={index}>
              {label}
            </Styled.Weekday>
          ))}
        </Styled.WeekdayRow>

        <Styled.WeekList>
          {weeks.map((weekDays) => {
            const segments = buildWeekEventSegments(events, weekDays);

            return (
              <Styled.Week key={buildDateKeyFromDate(weekDays[0])}>
                <Styled.DayNumberRow>
                  {weekDays.map((day) => {
                    const dateKey = buildDateKeyFromDate(day);
                    return (
                      <Styled.DayNumberCell
                        key={dateKey}
                        type='button'
                        $isCurrentMonth={day.getMonth() === month.getMonth()}
                        onClick={() => setSelectedDateKey(dateKey)}
                      >
                        <Styled.DayNumber
                          $dayIndex={day.getDay()}
                          $isToday={dateKey === todayKey}
                        >
                          {day.getDate()}
                        </Styled.DayNumber>
                      </Styled.DayNumberCell>
                    );
                  })}
                </Styled.DayNumberRow>

                <Styled.EventLayer>
                  {segments.map((segment) => {
                    const palette =
                      CALENDAR_EVENT_COLORS[
                        segment.color ?? DEFAULT_CALENDAR_EVENT_COLOR
                      ];
                    return (
                      <Styled.EventBar
                        key={segment.key}
                        type='button'
                        $color={palette.main}
                        $back={palette.back}
                        $startIndex={segment.startIndex}
                        $span={segment.span}
                        $lane={segment.lane}
                        onClick={() => setSelectedDateKey(segment.dateKey)}
                      >
                        {segment.title}
                      </Styled.EventBar>
                    );
                  })}
                </Styled.EventLayer>
              </Styled.Week>
            );
          })}
        </Styled.WeekList>
      </Styled.Content>

      {selectedDateKey && (
        <DayEventsModal
          isOpen
          dateKey={selectedDateKey}
          occurrences={occurrencesByDate[selectedDateKey] ?? []}
          onClose={() => setSelectedDateKey(null)}
          onAddEvent={() => {
            setAddSheetDate(selectedDateKey);
            setSelectedDateKey(null);
          }}
        />
      )}

      {addSheetDate && (
        <AddEventSheet
          isOpen
          initialDate={addSheetDate}
          onClose={() => setAddSheetDate(null)}
        />
      )}
    </Styled.Container>
  );
};

export default MobileCalendarView;
