import { useCallback } from 'react';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker';
import * as Styled from './Calendar.styles';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { ADMIN_EVENT } from '@/constants/eventName';

interface CalendarProps {
  recruitmentStart: Date | null;
  recruitmentEnd: Date | null;
  onChangeStart: (date: Date | null) => void;
  onChangeEnd: (date: Date | null) => void;
  disabledEnd?: boolean;
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
  disabledEnd = false,
}: CalendarProps) => {
  const trackEvent = useMixpanelTrack();

  const handleStartChange = useCallback(
    (date: Date | null) => {
      onChangeStart(date);
      if (recruitmentEnd && date && date > recruitmentEnd) {
        onChangeEnd(date);
      }
      trackEvent(ADMIN_EVENT.RECRUITMENT_START_CHANGED, {
        recruitmentStartDate: date?.toISOString() ?? null,
      });
    },
    [onChangeStart, onChangeEnd, recruitmentEnd, trackEvent],
  );

  const handleEndChange = useCallback(
    (date: Date | null) => {
      if (disabledEnd) return;
      onChangeEnd(date);
      if (recruitmentStart && date && date < recruitmentStart) {
        onChangeStart(date);
      }
      trackEvent(ADMIN_EVENT.RECRUITMENT_END_CHANGED, {
        recruitmentEndDate: date?.toISOString() ?? null,
      });
    },
    [disabledEnd, onChangeStart, onChangeEnd, recruitmentStart, trackEvent],
  );

  return (
    <Styled.DatepickerContainer data-disabled={disabledEnd ? true : false}>
      <DatePicker
        disabled={false}
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
        disabled={disabledEnd}
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
