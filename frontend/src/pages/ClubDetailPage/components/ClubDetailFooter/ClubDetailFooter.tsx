import { RecruitmentStatus } from '@/types/club';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import ClubApplyButton from '../ClubApplyButton/ClubApplyButton';
import * as Styled from './ClubDetailFooter.styles';

interface ClubDetailFooterProps {
  recruitmentStart: string;
  recruitmentEnd: string;
  recruitmentStatus: RecruitmentStatus;
  hideShareButtonOnMobile?: boolean;
}

const ClubDetailFooter = ({
  recruitmentStart,
  recruitmentEnd,
  recruitmentStatus,
  hideShareButtonOnMobile = false,
}: ClubDetailFooterProps) => {
  const deadlineText = getDeadlineText(
    recruitmentDateParser(recruitmentStart),
    recruitmentDateParser(recruitmentEnd),
    recruitmentStatus,
  );

  return (
    <Styled.ClubDetailFooterContainer>
      <ClubApplyButton
        deadlineText={deadlineText}
        hideShareButtonOnMobile={hideShareButtonOnMobile}
      />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
