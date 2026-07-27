import { useMemo, useState } from 'react';
import ResponsiveSheet from '@/components/common/ResponsiveSheet/ResponsiveSheet';
import { DEFAULT_CALENDAR_EVENT_COLOR } from '@/constants/calendarEventColors';
import { useCreateCustomCalendarEvent } from '@/hooks/Queries/useCustomCalendarEvents';
import { colors } from '@/styles/theme/colors';
import type {
  CalendarEventColor,
  CustomCalendarEventInput,
  CustomEventType,
  RecurrenceFrequency,
} from '@/types/club';
import { dateFromKey, formatMonthLabel } from '@/utils/calendarSyncUtils';
import ColorBar from '../ColorBar/ColorBar';
import MiniCalendar from '../MiniCalendar/MiniCalendar';
import RecurrenceFields from '../RecurrenceFields/RecurrenceFields';
import SegmentTabs from '../SegmentTabs/SegmentTabs';
import TitleInput from '../TitleInput/TitleInput';
import * as Styled from './AddEventSheet.styles';

interface AddEventSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** 셀에서 열었을 때 기본 선택 날짜 (YYYY-MM-DD) */
  initialDate: string;
}

const AddEventSheet = ({
  isOpen,
  onClose,
  initialDate,
}: AddEventSheetProps) => {
  const createMutation = useCreateCustomCalendarEvent();

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<CustomEventType>('SINGLE');
  const [color, setColor] = useState<CalendarEventColor>(
    DEFAULT_CALENDAR_EVENT_COLOR,
  );
  const [month, setMonth] = useState(() => {
    const base = dateFromKey(initialDate);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [errorMessage, setErrorMessage] = useState('');

  // SINGLE
  const [selectedDate, setSelectedDate] = useState(initialDate);
  // PERIOD
  const [rangeStart, setRangeStart] = useState<string | undefined>(initialDate);
  const [rangeEnd, setRangeEnd] = useState<string | undefined>();
  // MULTI
  const [multiDates, setMultiDates] = useState<string[]>([initialDate]);
  // RECURRING
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('WEEKLY');
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [recurStart, setRecurStart] = useState(initialDate);
  const [recurEnd, setRecurEnd] = useState<string | null>(null);

  const handleRangeSelect = (dateKey: string) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dateKey);
      setRangeEnd(undefined);
      return;
    }
    if (dateKey < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(dateKey);
      return;
    }
    setRangeEnd(dateKey);
  };

  const handleMultiSelect = (dateKey: string) =>
    setMultiDates((prev) =>
      prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey].sort(),
    );

  /**
   * 반복 기간도 기간 탭과 동일하게 캘린더에서 두 번 눌러 정한다.
   * 첫 클릭 = 시작 날짜(종료 초기화), 두 번째 클릭 = 종료 날짜.
   */
  const handleRecurrenceRangeSelect = (dateKey: string) => {
    if (recurEnd || dateKey < recurStart) {
      setRecurStart(dateKey);
      setRecurEnd(null);
      return;
    }
    setRecurEnd(dateKey);
  };

  const toggleWeekday = (weekday: number) =>
    setWeekdays((prev) =>
      prev.includes(weekday)
        ? prev.filter((d) => d !== weekday)
        : [...prev, weekday],
    );

  const canSave = useMemo(() => {
    if (!title.trim()) return false;
    if (eventType === 'SINGLE') return !!selectedDate;
    if (eventType === 'PERIOD') return !!rangeStart && !!rangeEnd;
    if (eventType === 'MULTI') return multiDates.length > 0;
    return !!recurStart;
  }, [
    title,
    eventType,
    selectedDate,
    rangeStart,
    rangeEnd,
    multiDates,
    recurStart,
  ]);

  const buildPayload = (): CustomCalendarEventInput => {
    const base = { title: title.trim(), color, eventType };
    if (eventType === 'SINGLE') return { ...base, start: selectedDate };
    if (eventType === 'PERIOD')
      return { ...base, start: rangeStart!, end: rangeEnd };
    if (eventType === 'MULTI')
      return { ...base, start: multiDates[0], dates: multiDates };
    return {
      ...base,
      start: recurStart,
      recurrence: {
        frequency,
        weekdays:
          frequency === 'WEEKLY' && weekdays.length > 0 ? weekdays : undefined,
        end: recurEnd ?? undefined,
      },
    };
  };

  const handleSave = () => {
    if (!canSave || createMutation.isPending) return;
    if (eventType === 'RECURRING' && recurEnd && recurEnd < recurStart) {
      setErrorMessage('종료 날짜는 시작 날짜보다 빠를 수 없습니다.');
      return;
    }
    setErrorMessage('');
    createMutation.mutate(buildPayload(), {
      onSuccess: onClose,
      onError: () => setErrorMessage('일정 저장에 실패했습니다.'),
    });
  };

  return (
    <ResponsiveSheet
      isOpen={isOpen}
      onClose={onClose}
      sheetBackground={colors.gray[100]}
    >
      <Styled.Body>
        <TitleInput value={title} onChange={setTitle} />
        <SegmentTabs value={eventType} onChange={setEventType} />
        <Styled.MonthLabel>{formatMonthLabel(month)}</Styled.MonthLabel>

        {eventType === 'SINGLE' && (
          <MiniCalendar
            month={month}
            onMonthChange={setMonth}
            mode='single'
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            showHeader={false}
            accentColor={color}
          />
        )}

        {eventType === 'PERIOD' && (
          <MiniCalendar
            month={month}
            onMonthChange={setMonth}
            mode='range'
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onSelectDate={handleRangeSelect}
            showHeader={false}
            accentColor={color}
          />
        )}

        {eventType === 'MULTI' && (
          <MiniCalendar
            month={month}
            onMonthChange={setMonth}
            mode='multi'
            selectedDates={multiDates}
            onSelectDate={handleMultiSelect}
            showHeader={false}
            accentColor={color}
          />
        )}

        {eventType === 'RECURRING' && (
          <>
            <RecurrenceFields
              frequency={frequency}
              onFrequencyChange={setFrequency}
              weekdays={weekdays}
              onToggleWeekday={toggleWeekday}
              startDate={recurStart}
              endDate={recurEnd}
            />
            <MiniCalendar
              month={month}
              onMonthChange={setMonth}
              mode='range'
              rangeStart={recurStart}
              rangeEnd={recurEnd ?? undefined}
              onSelectDate={handleRecurrenceRangeSelect}
              accentColor={color}
            />
          </>
        )}

        <ColorBar value={color} onChange={setColor} />

        {errorMessage && <Styled.ErrorText>{errorMessage}</Styled.ErrorText>}

        <Styled.SaveButton
          type='button'
          disabled={!canSave || createMutation.isPending}
          onClick={handleSave}
        >
          {createMutation.isPending ? '저장 중…' : '저장하기'}
        </Styled.SaveButton>
      </Styled.Body>
    </ResponsiveSheet>
  );
};

export default AddEventSheet;
