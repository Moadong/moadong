import { RecruitmentStatus } from '@/types/club';
import getDeadlineText from '@/utils/getDeadLineText';
import { recruitmentDateParser } from '@/utils/recruitmentDateParser';
import ClubApplyButton from '../ClubApplyButton/ClubApplyButton';

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

  return <ClubApplyButton deadlineText={deadlineText} />;
};

export default ClubDetailFooter;
