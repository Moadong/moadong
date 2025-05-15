import * as Styled from './DeadlineBadge.styles';

interface DeadlineBadgeProps {
  deadlineText: string;
}

const DeadlineBadge = ({ deadlineText }: DeadlineBadgeProps) => {
  return (
    <Styled.DeadlineBadgeWrapper>
      <Styled.DeadlineBadgeText>{deadlineText}</Styled.DeadlineBadgeText>
    </Styled.DeadlineBadgeWrapper>
  );
};

export default DeadlineBadge;
