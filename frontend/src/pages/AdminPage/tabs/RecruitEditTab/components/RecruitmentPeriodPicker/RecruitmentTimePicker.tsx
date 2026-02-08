import * as Styled from './RecruitmentTimePicker.styles';

interface Props {
  mode: 'hour' | 'minute';
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
}

const RecruitmentTimePicker = ({
  mode,
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: Props) => {
  const isHour = mode === 'hour';

  return (
    <Styled.TimeContainer>
      <Styled.TimeHeader>{isHour ? '시간' : '분'}</Styled.TimeHeader>

      <Styled.TimeList>
        {Array.from(
          { length: isHour ? 24 : 60 },
          (_, v) => v,
        ).map((value) => (
          <Styled.TimeItem
            key={value}
            $active={isHour ? value === hour : value === minute}
            onClick={() =>
              isHour ? onHourChange(value) : onMinuteChange(value)
            }
          >
            {value.toString().padStart(2, '0')}
          </Styled.TimeItem>
        ))}
      </Styled.TimeList>
    </Styled.TimeContainer>
  );
};

export default RecruitmentTimePicker;
