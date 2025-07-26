import * as Styled from './ClubDetailFooter.styles';
import DeadlineBadge from '@/pages/ClubDetailPage/components/DeadlineBadge/DeadlineBadge';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import getDeadlineText from '@/utils/getDeadLineText';

interface ClubDetailFooterProps {
  recruitmentPeriod: string;
  recruitmentForm: string;
  presidentPhoneNumber: string;
}

const ClubDetailFooter = ({
  recruitmentPeriod,
  recruitmentForm,
  presidentPhoneNumber,
}: ClubDetailFooterProps) => {
  const { recruitmentStart, recruitmentEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);

  const deadlineText = getDeadlineText(
    recruitmentStart,
    recruitmentEnd,
    new Date(),
  );

  return (
    <Styled.ClubDetailFooterContainer>
      <DeadlineBadge deadlineText={deadlineText} />
      <ClubApplyButton
        {...(deadlineText !== '모집 마감' && {
          recruitmentForm,
          presidentPhoneNumber,
        })}
      />
    </Styled.ClubDetailFooterContainer>
  );
};

export default ClubDetailFooter;
