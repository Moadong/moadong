import * as Styled from './DdayBadge.styles';

interface DdayBadgeProps {
  dday: number;
}

const DdayBadge = ({ dday }: DdayBadgeProps) => {
  let label: string;

  if (dday > 0) {
    label = `D-${dday}`;
  } else if (dday === 0) {
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
