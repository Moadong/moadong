import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import ClubApplyButton from '../ClubApplyButton/ClubApplyButton';
import * as Styled from './ClubDetailFooter.styles';
import { RecruitmentStatus } from '@/types/club';

interface ClubDetailFooterProps {
  recruitmentStart: string;
  recruitmentEnd: string;
  recruitmentStatus: RecruitmentStatus;
}

const ClubDetailFooter = ({
  recruitmentStart,
  recruitmentEnd,
  recruitmentStatus,
}: ClubDetailFooterProps) => {
  const deadlineText = getDeadlineText(
    recruitmentDateParser(recruitmentStart),
    recruitmentDateParser(recruitmentEnd),
    recruitmentStatus,
  );

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton deadlineText={deadlineText} />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
