import { useMemo, useState } from 'react';
import {
  CALENDAR_EVENT_COLORS,
  DEFAULT_CALENDAR_EVENT_COLOR,
} from '@/constants/calendarEventColors';
import { ADMIN_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import type { ClubCalendarEvent } from '@/types/club';
import {
  buildDateKeyFromDate,
  buildMonthCalendarDays,
  formatMonthDayWeekday,
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
import * as Styled from './CalendarBoard.styles';

interface CalendarBoardProps {
  /** Google·Notion·커스텀을 합친 표시용 이벤트 목록 */
  events: ClubCalendarEvent[];
}

/**
 * 관리자 월간 캘린더.
 * 모바일·태블릿·데스크탑이 같은 화면을 쓰고 셀 크기만 화면 폭에 따라 달라진다.
 */
const CalendarBoard = ({ events }: CalendarBoardProps) => {
  const trackEvent = useMixpanelTrack();
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

  /** 날짜별 일정 목록 (일정 모달에서 사용) */
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

  const changeMonth = (diff: number) => {
    trackEvent(ADMIN_EVENT.CALENDAR_MONTH_CHANGED, {
      direction: diff > 0 ? 'next' : 'prev',
    });
    setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + diff, 1));
  };

  const goToday = () => {
    trackEvent(ADMIN_EVENT.CALENDAR_TODAY_BUTTON_CLICKED);
    const now = new Date();
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  /** 날짜를 눌러 그 날 일정 모달을 연다 */
  const openDay = (targetDateKey: string) => {
    trackEvent(ADMIN_EVENT.CALENDAR_DATE_CLICKED, {
      dateKey: targetDateKey,
      eventCount: occurrencesByDate[targetDateKey]?.length ?? 0,
    });
    setSelectedDateKey(targetDateKey);
  };

  return (
    <Styled.Container>
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
              <Styled.DayHitRow>
                {weekDays.map((day) => {
                  const dateKey = buildDateKeyFromDate(day);
                  return (
                    <Styled.DayHitCell
                      key={dateKey}
                      type='button'
                      aria-label={`${formatMonthDayWeekday(dateKey)} 일정`}
                      onClick={() => openDay(dateKey)}
                    />
                  );
                })}
              </Styled.DayHitRow>

              <Styled.DayNumberRow>
                {weekDays.map((day) => {
                  const dateKey = buildDateKeyFromDate(day);
                  return (
                    <Styled.DayNumberCell
                      key={dateKey}
                      $isCurrentMonth={day.getMonth() === month.getMonth()}
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
                      onClick={() => openDay(segment.dateKey)}
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

export default CalendarBoard;
