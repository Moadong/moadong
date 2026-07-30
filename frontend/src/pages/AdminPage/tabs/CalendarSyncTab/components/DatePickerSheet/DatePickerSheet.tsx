import ResponsiveSheet from '@/components/common/ResponsiveSheet/ResponsiveSheet';
import type { CalendarEventColor } from '@/types/club';
import MiniCalendar from '../MiniCalendar/MiniCalendar';
import * as Styled from './DatePickerSheet.styles';

interface DatePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  month: Date;
  onMonthChange: (next: Date) => void;
  selectedDate?: string;
  onSelectDate: (dateKey: string) => void;
  accentColor?: CalendarEventColor;
  /** 이 날짜까지(포함) 고를 수 없게 막는다 */
  disabledUntil?: string;
  /** 넘기면 '없음'으로 되돌리는 버튼을 띄운다 (종료 날짜 전용) */
  onClear?: () => void;
}

/** 날짜 하나를 고르는 시트. 반복 일정의 시작/종료 날짜를 각각 정할 때 쓴다. */
const DatePickerSheet = ({
  isOpen,
  onClose,
  month,
  onMonthChange,
  selectedDate,
  onSelectDate,
  accentColor,
  disabledUntil,
  onClear,
}: DatePickerSheetProps) => (
  <ResponsiveSheet isOpen={isOpen} onClose={onClose}>
    <Styled.Body>
      <MiniCalendar
        month={month}
        onMonthChange={onMonthChange}
        mode='single'
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        accentColor={accentColor}
        disabledUntil={disabledUntil}
      />
      {onClear && (
        <Styled.ClearButton type='button' onClick={onClear}>
          종료 없음
        </Styled.ClearButton>
      )}
    </Styled.Body>
  </ResponsiveSheet>
);

export default DatePickerSheet;
