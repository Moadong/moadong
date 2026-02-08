import { ko } from 'date-fns/locale';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Styled from './RecruitmentDatePicker.styles';

interface Props {
  date: Date;
  onChange: (date: Date) => void;
}

/** 기존 Calendar에서 쓰던 헤더 그대로 */
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) => (
  <div className="react-datepicker__header-custom">
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      className="react-datepicker__navigation--custom react-datepicker__navigation--previous--custom"
      onMouseDown={(e) => e.preventDefault()}
    >
      {'<'}
    </button>

    <span className="react-datepicker__current-month">
      {date.getFullYear()}.{(date.getMonth() + 1).toString().padStart(2, '0')}
    </span>

    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      className="react-datepicker__navigation--custom react-datepicker__navigation--next--custom"
      onMouseDown={(e) => e.preventDefault()}
    >
      {'>'}
    </button>
  </div>
);

const RecruitmentDatePicker = ({ date, onChange }: Props) => {
  return (
    <Styled.DatePickerScope>
      <DatePicker
        inline
        locale={ko}
        selected={date}
        onChange={(d) => d && onChange(d)}
        dateFormat="yyyy년 MM월 dd일 (eee)"
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        onChangeRaw={(e) => e && e.preventDefault()}
      />
    </Styled.DatePickerScope>
  );
};

export default RecruitmentDatePicker;
