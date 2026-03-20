import { useLayoutEffect, useRef } from 'react';
import * as Styled from './TimePickerPanel.styles';

interface TimePickerPanelProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  height: number;
}

const TimePickerPanel = ({
  selectedDate,
  onChangeDate,
  height,
}: TimePickerPanelProps) => {
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const alignScrollToCenter = (
    listElement: HTMLDivElement | null,
    targetIndex: number,
  ) => {
    if (!listElement) return;

    const selectedItem = listElement.children[targetIndex] as HTMLElement;
    if (!selectedItem) return;

    const scrollOffset =
      selectedItem.offsetTop -
      listElement.clientHeight / 2 +
      selectedItem.clientHeight / 2;

    listElement.scrollTo({
      top: scrollOffset,
      behavior: 'auto',
    });
  };

  useLayoutEffect(() => {
    const rafId = requestAnimationFrame(() => {
      alignScrollToCenter(hourListRef.current, selectedDate.getHours());
      alignScrollToCenter(minuteListRef.current, selectedDate.getMinutes());
    });

    return () => cancelAnimationFrame(rafId);
  }, [selectedDate]);

  const updateHour = (hour: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setHours(hour);
    onChangeDate(nextDate);
  };

  const updateMinute = (minute: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setMinutes(minute);
    onChangeDate(nextDate);
  };

  return (
    <Styled.Container>
      <Styled.Column>
        <Styled.ScrollList
          $containerHeight={height}
          ref={hourListRef}
          style={{ overflowY: 'auto', position: 'relative' }}
        >
          {Array.from({ length: 24 }).map((_, hour) => (
            <Styled.ItemWrapper key={hour}>
              <Styled.TimeItem
                $isSelected={hour === selectedDate.getHours()}
                onClick={() => updateHour(hour)}
              >
                {String(hour).padStart(2, '0')}
              </Styled.TimeItem>
            </Styled.ItemWrapper>
          ))}
        </Styled.ScrollList>
      </Styled.Column>

      <Styled.Column>
        <Styled.ScrollList
          $containerHeight={height}
          ref={minuteListRef}
          style={{ overflowY: 'auto', position: 'relative' }}
        >
          {Array.from({ length: 60 }).map((_, minute) => (
            <Styled.ItemWrapper key={minute}>
              <Styled.TimeItem
                $isSelected={minute === selectedDate.getMinutes()}
                onClick={() => updateMinute(minute)}
              >
                {String(minute).padStart(2, '0')}
              </Styled.TimeItem>
            </Styled.ItemWrapper>
          ))}
        </Styled.ScrollList>
      </Styled.Column>
    </Styled.Container>
  );
};

export default TimePickerPanel;
