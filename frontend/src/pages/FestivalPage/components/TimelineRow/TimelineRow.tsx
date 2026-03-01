import * as Styled from './TimelineRow.styles';

type Status = 'past' | 'active' | 'upcoming';

interface TimelineRowProps {
  time: string;
  status: Status;
  children: React.ReactNode;
}

const TimelineRow = ({ time, status, children }: TimelineRowProps) => {
  return (
    <Styled.Row>
      <Styled.TimelineColumn>
        <Styled.TimeLabel $status={status}>{time}</Styled.TimeLabel>
        <Styled.Line $status={status} />
      </Styled.TimelineColumn>

      <Styled.CardColumn>{children}</Styled.CardColumn>
    </Styled.Row>
  );
};

export default TimelineRow;
