import { useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import * as Styled from './DatePickerPanel.styles';

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
  const prevHeightRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const monthElement = container.querySelector(
      '.react-datepicker__month',
    ) as HTMLElement | null;
    if (!monthElement) return;

    const observer = new ResizeObserver(() => {
      const nextHeight = monthElement.offsetHeight;

      if (prevHeightRef.current !== nextHeight) {
        prevHeightRef.current = nextHeight;
        onHeightChange(nextHeight);
      }
    });

    observer.observe(monthElement);

    // 초기 달력 높이 설정
    onHeightChange(monthElement.offsetHeight);

    return () => observer.disconnect();
  }, [onHeightChange]);

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
