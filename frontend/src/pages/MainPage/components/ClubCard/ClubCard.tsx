import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import ClubTag from '@/components/ClubTag/ClubTag';
import { USER_EVENT } from '@/constants/eventName';
import ClubLogo from '@/pages/MainPage/components/ClubLogo/ClubLogo';
import { Club } from '@/types/club';
import * as Styled from './ClubCard.styles';

interface ClubCardProps {
  club: Club;
  children?: React.ReactNode;
  onCardClick?: (club: Club) => void;
}

const ClubCard = ({ club, children, onCardClick }: ClubCardProps) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    mixpanel.track(USER_EVENT.CLUB_CARD_CLICKED, {
      club_id: club.id,
      club_name: club.name,
      recruitment_status: club.recruitmentStatus,
    });

    setTimeout(() => {
      setIsClicked(false);
      if (onCardClick) {
        onCardClick(club);
      } else {
        navigate(`/clubDetail/@${encodeURIComponent(club.name)}`);
      }
    }, 150);
  };

  return (
    <Styled.CardContainer
      $state={club.recruitmentStatus}
      $isClicked={isClicked}
      onClick={handleClick}
    >
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo $imageSrc={club.logo || default_profile_image} />
          <Styled.ClubInfo>
            <Styled.ClubName>{club.name}</Styled.ClubName>
            <Styled.Introduction>{club.introduction}</Styled.Introduction>
          </Styled.ClubInfo>
        </Styled.ClubProfile>
        {children}
      </Styled.CardHeader>

      <Styled.StateBoxTagContainer>
        <ClubStateBox state={club.recruitmentStatus} />
        <Styled.TagsContainer>
          <ClubTag key={`category-${club.id}`} type={club.category} />
          {club.tags
            .filter((tag) => tag.trim())
            .map((tag) => (
              <ClubTag key={`tag-${club.id}-${tag}`} type={'자유'}>
                {tag}
              </ClubTag>
            ))}
        </Styled.TagsContainer>
      </Styled.StateBoxTagContainer>
    </Styled.CardContainer>
  );
};

export default ClubCard;
