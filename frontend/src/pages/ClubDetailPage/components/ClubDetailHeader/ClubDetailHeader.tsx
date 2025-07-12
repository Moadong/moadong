import * as Styled from './ClubDetailHeader.styles';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';
import { parseRecruitmentPeriod } from '@/utils/stringToDate';
import getDeadlineText from '@/utils/getDeadLineText';
import ShareButton from '../Share/ShareButton/ShareButton';
interface ClubDetailHeaderProps {
  name: string;
  category: string;
  division: string;
  tags: string[];
  logo: string;
  recruitmentPeriod: string;
  recruitmentForm?: string;
  presidentPhoneNumber?: string;
  clubId: string;
  description: string;
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
  clubId,
  description
}: ClubDetailHeaderProps) => {
  const { recruitmentStart, recruitmentEnd } =
    parseRecruitmentPeriod(recruitmentPeriod);

  const deadlineText = getDeadlineText(
    recruitmentStart,
    recruitmentEnd,
    new Date(),
  );

  const shareUrl = `${window.location.origin}/club/${clubId}`;
  const shareTitle = `${name} - 동아리 정보`;
  const shareText = `${description}`;

  return (
    <Styled.ClubDetailHeaderContainer>
      <ClubProfile
        name={name}
        category={category}
        division={division}
        tags={tags}
        logo={logo}
      />
      <Styled.ButtonContainer>
        <ClubApplyButton
          {...(deadlineText !== '모집 마감' && {
            recruitmentForm,
            presidentPhoneNumber,
          })}
        />
        <ShareButton
          url={shareUrl}
          title={shareTitle}
          text={shareText}
          buttonText="공유"
          className="share-button"
        />
      </Styled.ButtonContainer>
    </Styled.ClubDetailHeaderContainer>
  );
};

export default ClubDetailHeader;
