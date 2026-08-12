import { FEEDBACK_TYPE_META } from '@/constants/feedback';
import type { FeedbackType } from '@/types/feedback';
import * as Styled from './FeedbackTypeCard.styles';

interface FeedbackTypeCardProps {
  type: FeedbackType;
  onClick: (type: FeedbackType) => void;
}

const FeedbackTypeCard = ({ type, onClick }: FeedbackTypeCardProps) => {
  const { cardLabel, backgroundColor, Icon } = FEEDBACK_TYPE_META[type];

  return (
    <Styled.Card
      type='button'
      $backgroundColor={backgroundColor}
      onClick={() => onClick(type)}
    >
      <Styled.IconBox>
        <Icon width={26} height={26} aria-hidden />
      </Styled.IconBox>
      <Styled.Label>{cardLabel}</Styled.Label>
    </Styled.Card>
  );
};

export default FeedbackTypeCard;
