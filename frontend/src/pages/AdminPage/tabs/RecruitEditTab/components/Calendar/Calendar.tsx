import { useCallback } from 'react';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import * as Styled from './Calendar.styles';

interface CalendarProps {
  recruitmentStart: Date | null;
  recruitmentEnd: Date | null;
  onChangeStart: (date: Date | null) => void;
  onChangeEnd: (date: Date | null) => void;
  disabled?: boolean;
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

const Calendar = ({
  recruitmentStart,
  recruitmentEnd,
  onChangeStart,
  onChangeEnd,
  disabled = false,
}: CalendarProps) => {
  const handleStartChange = useCallback(
    (date: Date | null) => {
      if (!disabled) return;
      onChangeStart(date);
      if (recruitmentEnd && date && date > recruitmentEnd) {
        onChangeEnd(date);
      }
    },
    [disabled, onChangeStart, onChangeEnd, recruitmentEnd],
  );

  const handleEndChange = useCallback(
    (date: Date | null) => {
      if (!disabled) return;
      onChangeEnd(date);
      if (recruitmentStart && date && date < recruitmentStart) {
        onChangeStart(date);
      }
    },
    [disabled, onChangeStart, onChangeEnd, recruitmentStart],
  );

  return (
    <Styled.DatepickerContainer data-disabled={disabled ? true : false}>
      <DatePicker
        disabled={disabled}
        locale={ko}
        selected={recruitmentStart}
        onChange={handleStartChange}
        showTimeSelect
        timeIntervals={30}
        timeCaption='시간'
        dateFormat='yyyy년 MM월 dd일 (eee) HH:mm'
        shouldCloseOnSelect={false}
        popperPlacement='bottom-start'
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        onChangeRaw={(e: any) => e.preventDefault()}
      />
      <Styled.Tidle>~</Styled.Tidle>
      <DatePicker
        disabled={disabled}
        locale={ko}
        selected={recruitmentEnd}
        onChange={handleEndChange}
        showTimeSelect
        timeIntervals={30}
        timeCaption='시간'
        dateFormat='yyyy년 MM월 dd일 (eee) HH:mm'
        shouldCloseOnSelect={false}
        popperPlacement='bottom-start'
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        onChangeRaw={(e: any) => e.preventDefault()}
      />
    </Styled.DatepickerContainer>
  );
};

export default Calendar;
