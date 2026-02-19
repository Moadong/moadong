import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import * as Styled from './DatePickerPanel.styles';

interface DatePickerPanelProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const DatePickerPanel = ({ selectedDate, onChangeDate }: DatePickerPanelProps) => {
  return (
    <Styled.Container>
      <DatePicker
        inline
        locale={ko}
        selected={selectedDate}
        onChange={(date) => date && onChangeDate(date)}
        onChangeRaw={(e) => e && e.preventDefault()}
      />
    </Styled.Container>
  );
};

export default DatePickerPanel;
