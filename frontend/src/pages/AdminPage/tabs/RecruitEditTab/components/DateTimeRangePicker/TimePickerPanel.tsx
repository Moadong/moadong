import * as Styled from './TimePickerPanel.styles';

interface TimePickerPanelProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const TimePickerPanel = ({
  selectedDate,
  onChangeDate,
}: TimePickerPanelProps) => {
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
        <Styled.List>
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
        <Styled.List>
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
