import * as Styled from './ClubDetailHeader.styles';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';
import ClubApplyButton from '@/pages/ClubDetailPage/components/ClubApplyButton/ClubApplyButton';

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

// 데스크탑용 상세페이지 헤더
const ClubDetailHeader = ({
  name,
  category,
  division,
  tags,
  logo,
}: ClubDetailHeaderProps) => {
  return (
    <Styled.ClubDetailHeaderContainer>
      <ClubProfile
        name={name}
        category={category}
        division={division}
        tags={tags}
        logo={logo}
      />
      <ClubApplyButton />
    </Styled.ClubDetailHeaderContainer>
  );
};

export default ClubDetailHeader;
