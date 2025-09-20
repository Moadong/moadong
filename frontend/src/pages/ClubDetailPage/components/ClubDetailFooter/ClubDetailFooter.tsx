import * as Styled from './ClubDetailFooter.styles';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { parseRecruitmentPeriod } from '@/utils/recruitmentPeriodParser';
import getDeadlineText from '@/utils/getDeadLineText';

interface ClubDetailFooterProps {
  recruitmentPeriod: string;
  recruitmentForm: string;
}

const ClubDetailFooter = ({ recruitmentPeriod }: ClubDetailFooterProps) => {
  const { recruitmentStart, recruitmentEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);

  const deadlineText = getDeadlineText(
    recruitmentStart,
    recruitmentEnd,
    new Date(),
  );

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton deadlineText={deadlineText} />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
