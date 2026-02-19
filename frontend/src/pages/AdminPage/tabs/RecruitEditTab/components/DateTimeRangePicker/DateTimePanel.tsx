import DatePickerPanel from './DatePickerPanel';
import TimePickerPanel from './TimePickerPanel';
import * as Styled from './DateTimePanel.styles';
import { useState } from 'react';

interface DateTimePanelProps {
  date: Date | null;
  onChangeDate: (date: Date) => void;
}

const DateTimePanel = ({ date, onChangeDate }: DateTimePanelProps) => {
  const [calendarHeight, setCalendarHeight] = useState<number>(0);

  if (!date) return null;

  return (
    <Styled.Panel>
      <Styled.Header>
        <Styled.NavButton onClick={() => {
          const d = new Date(date);
          d.setMonth(d.getMonth() - 1);
          onChangeDate(d);
        }}>{'<'}</Styled.NavButton>

        <Styled.Title>
          {date.getFullYear()}.{String(date.getMonth() + 1).padStart(2, '0')}
        </Styled.Title>

        <Styled.NavButton onClick={() => {
          const d = new Date(date);
          d.setMonth(d.getMonth() + 1);
          onChangeDate(d);
        }}>{'>'}</Styled.NavButton>

        <Styled.TimeLabel>시</Styled.TimeLabel>
        <Styled.TimeLabel>분</Styled.TimeLabel>
      </Styled.Header>

      <Styled.Body>
        <DatePickerPanel
          selectedDate={date}
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