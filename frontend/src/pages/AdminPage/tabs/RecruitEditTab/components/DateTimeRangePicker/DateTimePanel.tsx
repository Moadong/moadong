import DatePickerPanel from './DatePickerPanel';
import TimePickerPanel from './TimePickerPanel';
import * as Styled from './DateTimePanel.styles';

interface DateTimePanelProps {
  date: Date | null;
  onChangeDate: (date: Date) => void;
}

const DateTimePanel = ({ date, onChangeDate }: DateTimePanelProps) => {
  if (!date) return null;

  return (
    <Styled.Panel>
      <DatePickerPanel
        selectedDate={date}
        onChangeDate={onChangeDate}
      />
      <TimePickerPanel
        selectedDate={date}
        onChangeDate={onChangeDate}
      />
    </Styled.Panel>
  );
};

export default DateTimePanel;
