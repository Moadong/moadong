import * as Styled from './ClubDetailHeader.styles';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import getDeadlineText from '@/utils/getDeadLineText';
interface ClubDetailHeaderProps {
  name: string;
  category: string;
  division: string;
  tags: string[];
  logo: string;
  recruitmentPeriod: string;
  recruitmentForm?: string;
  presidentPhoneNumber?: string;
}

const ClubDetailHeader = ({
  name,
  category,
  division,
  tags,
  logo,
  recruitmentPeriod,
  recruitmentForm,
  presidentPhoneNumber,
}: ClubDetailHeaderProps) => {
  const { recruitmentStart, recruitmentEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);

  const deadlineText = getDeadlineText(
    recruitmentStart,
    recruitmentEnd,
    new Date(),
  );

  return (
    <Styled.ClubDetailHeaderContainer>
      <ClubProfile
        name={name}
        category={category}
        division={division}
        tags={tags}
        logo={logo}
      />
      <ClubApplyButton
        isRecruiting={deadlineText !== '모집 마감'}
      />
    </Styled.ClubDetailHeaderContainer>
  );
};

export default ClubDetailHeader;
