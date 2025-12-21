import * as Styled from './ClubDetailFooter.styles';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import getDeadlineText from '@/utils/getDeadLineText';

interface ClubDetailFooterProps {
  recruitmentStart: string;
  recruitmentEnd: string;
  recruitmentForm: string;
}

const ClubDetailFooter = ({
  recruitmentStart,
  recruitmentEnd,
}: ClubDetailFooterProps) => {
  const startDate = recruitmentStart
    ? recruitmentDateParser(recruitmentStart)
    : null;
  const endDate = recruitmentEnd ? recruitmentDateParser(recruitmentEnd) : null;

  const deadlineText = getDeadlineText(startDate, endDate, new Date());

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton deadlineText={deadlineText} />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
