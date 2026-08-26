import { FEEDBACK_TYPE_META, SENT_STATUS_META } from '@/constants/feedback';
import type { SentFeedback } from '@/types/feedback';
import formatTimeAgo from '@/utils/formatTimeAgo';
import FeedbackTag from './FeedbackTag';
import * as Styled from './LetterListItem.styles';

interface SentFeedbackItemProps {
  feedback: SentFeedback;
  onClick: (feedbackId: string) => void;
}

const SentFeedbackItem = ({ feedback, onClick }: SentFeedbackItemProps) => {
  const type = FEEDBACK_TYPE_META[feedback.type];
  const status = SENT_STATUS_META[feedback.status];

  return (
    <Styled.SentItem type='button' onClick={() => onClick(feedback.id)}>
      <Styled.SentContent>{feedback.content}</Styled.SentContent>
      <Styled.Meta>
        <Styled.Tags>
          <FeedbackTag
            label={type.tagLabel}
            backgroundColor={type.backgroundColor}
            color={type.accentColor}
            Icon={type.Icon}
          />
          <FeedbackTag
            label={status.label}
            backgroundColor={status.backgroundColor}
            color={status.color}
          />
        </Styled.Tags>
        <Styled.TimeAgo>{formatTimeAgo(feedback.createdAt)}</Styled.TimeAgo>
      </Styled.Meta>
    </Styled.SentItem>
  );
};

export default SentFeedbackItem;
