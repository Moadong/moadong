import { LETTER_CATEGORY_META } from '@/constants/feedback';
import type { ReceivedLetter } from '@/types/feedback';
import formatTimeAgo from '@/utils/formatTimeAgo';
import FeedbackTag from './FeedbackTag';
import * as Styled from './LetterListItem.styles';

interface ReceivedLetterItemProps {
  letter: ReceivedLetter;
  onClick: (letterId: string) => void;
}

const ReceivedLetterItem = ({ letter, onClick }: ReceivedLetterItemProps) => {
  const category = LETTER_CATEGORY_META[letter.category];

  return (
    <Styled.Item
      type='button'
      $unread={!letter.isRead}
      onClick={() => onClick(letter.id)}
    >
      <div>
        <Styled.Title>{letter.title}</Styled.Title>
        <Styled.Preview>{letter.preview}</Styled.Preview>
      </div>
      <Styled.Meta>
        <FeedbackTag
          label={category.label}
          backgroundColor={category.backgroundColor}
          color={category.color}
        />
        <Styled.TimeAgo>{formatTimeAgo(letter.createdAt)}</Styled.TimeAgo>
      </Styled.Meta>
    </Styled.Item>
  );
};

export default ReceivedLetterItem;
