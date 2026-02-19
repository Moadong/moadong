import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import * as Styled from './DatePickerPanel.styles';
import { useEffect, useRef } from 'react';

interface DatePickerPanelProps {
  selectedDate: Date;
  viewMonth: Date;
  onViewMonthChange: (date: Date) => void;
  onChangeDate: (date: Date) => void;
  onHeightChange: (height: number) => void;
}

const DatePickerPanel = ({
  selectedDate,
  viewMonth,
  onViewMonthChange,
  onChangeDate,
  onHeightChange,
}: DatePickerPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const monthEl = containerRef.current.querySelector(
      '.react-datepicker__month'
    ) as HTMLElement | null;

    if (!monthEl) return;

    const observer = new ResizeObserver(() => {
      onHeightChange(monthEl.offsetHeight);
    });

    observer.observe(monthEl);
    onHeightChange(monthEl.offsetHeight);

    return () => observer.disconnect();
  }, [selectedDate, onHeightChange]);

  return (
    <Styled.Container ref={containerRef}>
      <DatePicker
        inline
        locale={ko}
        selected={selectedDate}
        openToDate={viewMonth}
        onMonthChange={onViewMonthChange}
        onChange={(date) => date && onChangeDate(date)}
        onChangeRaw={(e) => e && e.preventDefault()}
      />
    </Styled.Container>
  );
};

export default DatePickerPanel;
