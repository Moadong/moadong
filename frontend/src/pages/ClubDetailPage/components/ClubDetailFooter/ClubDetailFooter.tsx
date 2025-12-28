import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import ClubApplyButton from '../ClubApplyButton/ClubApplyButton';
import * as Styled from './ClubDetailFooter.styles';

interface ClubDetailFooterProps {
  recruitmentStart: string;
  recruitmentEnd: string;
}

const ClubDetailFooter = ({
  recruitmentStart,
  recruitmentEnd,
}: ClubDetailFooterProps) => {
  const deadlineText = getDeadlineText(
    recruitmentDateParser(recruitmentStart),
    recruitmentDateParser(recruitmentEnd),
    new Date(),
  );

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton deadlineText={deadlineText} />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
