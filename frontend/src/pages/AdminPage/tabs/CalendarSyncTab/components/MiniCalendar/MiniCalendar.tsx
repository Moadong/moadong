import { useMemo } from 'react';
import {
  CALENDAR_EVENT_COLORS,
  DEFAULT_CALENDAR_EVENT_COLOR,
} from '@/constants/calendarEventColors';
import type { CalendarEventColor } from '@/types/club';
import {
  buildDateKeyFromDate,
  buildMonthCalendarDays,
  formatMonthLabel,
  WEEKDAY_LABELS,
} from '@/utils/calendarSyncUtils';
import * as Styled from './MiniCalendar.styles';

export type MiniCalendarMode = 'single' | 'range' | 'multi';

interface MiniCalendarProps {
  month: Date;
  onMonthChange: (next: Date) => void;
  mode: MiniCalendarMode;
  /** single 모드 선택일 */
  selectedDate?: string;
  /** range 모드 시작/종료 */
  rangeStart?: string;
  rangeEnd?: string;
  /** multi 모드 선택일 목록 */
  selectedDates?: string[];
  onSelectDate: (dateKey: string) => void;
  showHeader?: boolean;
  /** 선택 표시 색상 (ColorBar 연동) */
  accentColor?: CalendarEventColor;
  /** 이 날짜까지(포함) 고를 수 없게 막는다 */
  disabledUntil?: string;
}

const MiniCalendar = ({
  month,
  onMonthChange,
  mode,
  selectedDate,
  rangeStart,
  rangeEnd,
  selectedDates,
  onSelectDate,
  showHeader = true,
  accentColor = DEFAULT_CALENDAR_EVENT_COLOR,
  disabledUntil,
}: MiniCalendarProps) => {
  const accent = CALENDAR_EVENT_COLORS[accentColor];
  const calendarDays = useMemo(() => buildMonthCalendarDays(month), [month]);
  const todayKey = buildDateKeyFromDate(new Date());
  const multiSet = useMemo(() => new Set(selectedDates ?? []), [selectedDates]);

  const changeMonth = (diff: number) =>
    onMonthChange(new Date(month.getFullYear(), month.getMonth() + diff, 1));

  const goToday = () => {
    const now = new Date();
    onMonthChange(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const isSelected = (dateKey: string) => {
    if (mode === 'single') return dateKey === selectedDate;
    if (mode === 'multi') return multiSet.has(dateKey);
    return dateKey === rangeStart || dateKey === rangeEnd;
  };

  const hasRange = mode === 'range' && !!rangeStart && !!rangeEnd;

  return (
    <Styled.Container>
      {showHeader && (
        <Styled.Header>
          <Styled.MonthLabel>{formatMonthLabel(month)}</Styled.MonthLabel>
          <Styled.HeaderControls>
            <Styled.ArrowButton
              type='button'
              aria-label='이전 달'
              onClick={() => changeMonth(-1)}
            >
              ◀
            </Styled.ArrowButton>
            <Styled.TodayButton type='button' onClick={goToday}>
              오늘
            </Styled.TodayButton>
            <Styled.ArrowButton
              type='button'
              aria-label='다음 달'
              onClick={() => changeMonth(1)}
            >
              ▶
            </Styled.ArrowButton>
          </Styled.HeaderControls>
        </Styled.Header>
      )}

      <Styled.WeekdayRow>
        {WEEKDAY_LABELS.map((label, index) => (
          <Styled.Weekday key={label} $dayIndex={index}>
            {label}
          </Styled.Weekday>
        ))}
      </Styled.WeekdayRow>

      <Styled.DayGrid>
        {calendarDays.map((day) => {
          const dateKey = buildDateKeyFromDate(day);
          const isCurrentMonth = day.getMonth() === month.getMonth();
          const selected = isSelected(dateKey);
          const inRange =
            hasRange && dateKey >= rangeStart! && dateKey <= rangeEnd!;
          const blocked = !!disabledUntil && dateKey <= disabledUntil;

          return (
            <Styled.DayCell
              key={dateKey}
              type='button'
              $dayIndex={day.getDay()}
              $isCurrentMonth={isCurrentMonth}
              $isSelected={selected}
              $isToday={dateKey === todayKey}
              $inRange={inRange}
              $isRangeStart={hasRange && dateKey === rangeStart}
              $isRangeEnd={hasRange && dateKey === rangeEnd}
              $accentBack={accent.back}
              $isBlocked={blocked}
              disabled={!isCurrentMonth || blocked}
              onClick={() => onSelectDate(dateKey)}
            >
              <Styled.DayNumber
                $isSelected={selected && !blocked}
                $isToday={dateKey === todayKey && !selected}
                $accentMain={accent.main}
              >
                {day.getDate()}
              </Styled.DayNumber>
            </Styled.DayCell>
          );
        })}
      </Styled.DayGrid>
    </Styled.Container>
  );
};

export default MiniCalendar;
