import useDevice from '@/hooks/useDevice';
import { RecruitmentStatus } from '@/types/club';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import ClubApplyButton from '../ClubApplyButton/ClubApplyButton';
import * as Styled from './ClubDetailFooter.styles';

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
  const { isMobile, isTablet } = useDevice();

  const deadlineText = getDeadlineText(
    recruitmentDateParser(recruitmentStart),
    recruitmentDateParser(recruitmentEnd),
    recruitmentStatus,
  );

  if (isMobile || isTablet) {
    return <ClubApplyButton deadlineText={deadlineText} />;
  }

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton deadlineText={deadlineText} />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
