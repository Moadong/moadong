import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import * as Styled from './ClubDetailFooter.styles';

interface ClubDetailFooterProps {
  recruitmentStart: string;
  recruitmentEnd: string;
}

const ClubDetailFooter = ({
  recruitmentStart,
  recruitmentEnd,
}: ClubDetailFooterProps) => {
  // [ ] TODO: 예외 처리 추가
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
