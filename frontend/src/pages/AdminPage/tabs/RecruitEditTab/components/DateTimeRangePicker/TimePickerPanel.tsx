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
  height
}: TimePickerPanelProps) => {
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const scrollToSelected = (
    listElement: HTMLDivElement | null,
    index: number
  ) => {
    if (listElement) {
      const activeItem = listElement.children[index] as HTMLElement;

      if (activeItem) {
        const scrollTarget = 
          activeItem.offsetTop - (listElement.clientHeight / 2) + (activeItem.clientHeight / 2);
        
        listElement.scrollTo({
          top: scrollTarget,
          behavior: 'auto',
        });
      }
    }
  };

  useLayoutEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelected(hourListRef.current, selectedDate.getHours());
      scrollToSelected(minuteListRef.current, selectedDate.getMinutes());
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const setHour = (hour: number) => {
    const next = new Date(selectedDate);
    next.setHours(hour);
    onChangeDate(next);
  };

  const setMinute = (minute: number) => {
    const next = new Date(selectedDate);
    next.setMinutes(minute);
    onChangeDate(next);
  };

  return (
    <Styled.Container>
      <Styled.Column>
        <Styled.List 
          $height={height} 
          ref={hourListRef} 
          style={{ overflowY: 'auto', position: 'relative' }}
        >
          {Array.from({ length: 24 }).map((_, h) => (
            <Styled.ItemWrapper key={h}>
              <Styled.ItemBox
                $active={h === selectedDate.getHours()}
                onClick={() => setHour(h)}
              >
                {String(h).padStart(2, '0')}
              </Styled.ItemBox>
            </Styled.ItemWrapper>
          ))}
        </Styled.List>
      </Styled.Column>

      <Styled.Column>
        <Styled.List 
          $height={height} 
          ref={minuteListRef} 
          style={{ overflowY: 'auto', position: 'relative' }}
        >
          {Array.from({ length: 60 }).map((_, m) => (
            <Styled.ItemWrapper key={m}>
              <Styled.ItemBox
                $active={m === selectedDate.getMinutes()}
                onClick={() => setMinute(m)}
              >
                {String(m).padStart(2, '0')}
              </Styled.ItemBox>
            </Styled.ItemWrapper>
          ))}
        </Styled.List>
      </Styled.Column>
    </Styled.Container>
  );
};

export default TimePickerPanel;