import ChevronIcon from '@/assets/images/icons/menu/chevron.svg?react';
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
        <Icon width={22} height={22} aria-hidden />
      </Styled.IconBox>
      <Styled.Label>{cardLabel}</Styled.Label>
      <Styled.Chevron>
        <ChevronIcon width={16} height={16} aria-hidden />
      </Styled.Chevron>
    </Styled.Card>
  );
};

export default FeedbackTypeCard;
