import * as Styled from './TimePickerPanel.styles';

interface TimePickerPanelProps {
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
}

const TimePickerPanel = ({
  selectedDate,
  onChangeDate,
}: TimePickerPanelProps) => {
  const changeHour = (hour: number) => {
    const next = new Date(selectedDate);
    next.setHours(hour);
    onChangeDate(next);
  };

  const changeMinute = (minute: number) => {
    const next = new Date(selectedDate);
    next.setMinutes(minute);
    onChangeDate(next);
  };

  return (
    <Styled.Container>
      <Styled.Column>
        <Styled.Header>시간</Styled.Header>
        <Styled.List>
          {Array.from({ length: 24 }).map((_, h) => (
            <Styled.Item
              key={h}
              $active={h === selectedDate.getHours()}
              onClick={() => changeHour(h)}
            >
              {h.toString().padStart(2, '0')}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.Column>

      <Styled.Column>
        <Styled.Header>분</Styled.Header>
        <Styled.List>
          {Array.from({ length: 60 }).map((_, m) => (
            <Styled.Item
              key={m}
              $active={m === selectedDate.getMinutes()}
              onClick={() => changeMinute(m)}
            >
              {m.toString().padStart(2, '0')}
            </Styled.Item>
          ))}
        </Styled.List>
      </Styled.Column>
    </Styled.Container>
  );
};

export default TimePickerPanel;
