import { ko } from 'date-fns/locale';
import DatePicker, {ReactDatePickerCustomHeaderProps} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Styled from './DatePickerPanel.styles';

interface DatePickerPanelProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => (
  <div className='react-datepicker__header-custom'>
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className='react-datepicker__navigation--custom react-datepicker__navigation--previous--custom'
      onMouseDown={(e) => e.preventDefault()}
    >
      {'<'}
    </button>
    <span className='react-datepicker__current-month'>
      {date.getFullYear()}.{(date.getMonth() + 1).toString().padStart(2, '0')}
    </span>
    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      className='react-datepicker__navigation--custom react-datepicker__navigation--next--custom'
      onMouseDown={(e) => e.preventDefault()}
    >
      {'>'}
    </button>
  </div>
);

const DatePickerPanel = ({
  selectedDate,
  onChangeDate,
}: DatePickerPanelProps) => {
  return (
    <Styled.Container>
      <DatePicker
        inline
        locale={ko}
        selected={selectedDate}
        onChange={(date) => date && onChangeDate(date)}
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        calendarClassName="recruitment-calendar"
        dayClassName={() => 'recruitment-day'}
        onChangeRaw={(e) => e && e.preventDefault()}
      />
    </Styled.Container>
  );
};

export default DatePickerPanel;
