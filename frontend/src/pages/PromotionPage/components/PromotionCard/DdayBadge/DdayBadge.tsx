import * as Styled from './DdayBadge.styles';

interface DdayBadgeProps {
  startDate: string;
}

const DdayBadge = ({ startDate }: DdayBadgeProps) => {
  const today = new Date();
  const start = new Date(startDate);

  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let label: string;

  if (diff > 0) {
    label = `D-${diff}`;
  } else if (diff === 0) {
    label = 'D-Day';
  } else {
    label = '종료';
  }

  return (
    <Styled.Container>
      <Styled.DdayText>{label}</Styled.DdayText>
    </Styled.Container>
  );
};

export default DdayBadge;