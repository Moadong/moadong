import { useState } from 'react';
import DatePickerPanel from './DatePickerPanel';
import * as Styled from './DateTimePanel.styles';
import TimePickerPanel from './TimePickerPanel';

interface DateTimePanelProps {
  date: Date | null;
  onChangeDate: (date: Date) => void;
  $alignRight?: boolean;
}

const DateTimePanel = ({
  date,
  onChangeDate,
  $alignRight,
}: DateTimePanelProps) => {
  const [calendarHeight, setCalendarHeight] = useState<number>(0);
  const [viewMonth, setViewMonth] = useState<Date>(date || new Date());

  if (!date) return null;

  const handleMoveMonth = (offset: number) => {
    const newViewMonth = new Date(viewMonth);
    newViewMonth.setMonth(newViewMonth.getMonth() + offset);
    setViewMonth(newViewMonth);
  };

  const formattedYearMonth = `${viewMonth.getFullYear()}.${String(
    viewMonth.getMonth() + 1,
  ).padStart(2, '0')}`;

  return (
    <Styled.Panel $alignRight={$alignRight}>
      <Styled.Header>
        <Styled.NavButton onClick={() => handleMoveMonth(-1)}>
          {'<'}
        </Styled.NavButton>

        <Styled.Title>{formattedYearMonth}</Styled.Title>

        <Styled.NavButton onClick={() => handleMoveMonth(1)}>
          {'>'}
        </Styled.NavButton>

        <Styled.TimeLabel>시</Styled.TimeLabel>
        <Styled.TimeLabel>분</Styled.TimeLabel>
      </Styled.Header>

      <Styled.Body>
        <DatePickerPanel
          selectedDate={date}
          viewMonth={viewMonth}
          onViewMonthChange={setViewMonth}
          onChangeDate={onChangeDate}
          onHeightChange={setCalendarHeight}
        />
        <TimePickerPanel
          selectedDate={date}
          onChangeDate={onChangeDate}
          height={calendarHeight}
        />
      </Styled.Body>
    </Styled.Panel>
  );
};

export default DateTimePanel;
