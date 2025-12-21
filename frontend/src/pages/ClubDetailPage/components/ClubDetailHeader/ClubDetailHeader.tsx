import * as Styled from './ClubDetailHeader.styles';
import ClubProfile from '@/pages/ClubDetailPage/components/ClubProfile/ClubProfile';

interface ClubDetailHeaderProps {
  name: string;
  category: string;
  division: string;
  tags: string[];
  logo: string;
  recruitmentStart: string;
  recruitmentEnd: string;
  recruitmentForm?: string;
  presidentPhoneNumber?: string;
}

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
    </Styled.ClubDetailHeaderContainer>
  );
};

export default ClubDetailHeader;
