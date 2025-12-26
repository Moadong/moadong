import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import ClubTag from '@/components/ClubTag/ClubTag';
import { USER_EVENT } from '@/constants/eventName';
import { Club } from '@/types/club';
import * as Styled from './ClubCard.styles';

const ClubCard = ({ club }: { club: Club }) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleNavigate = () => {
    setIsClicked(true);
    mixpanel.track(USER_EVENT.CLUB_CARD_CLICKED, {
      club_id: club.id,
      club_name: club.name,
      recruitment_status: club.recruitmentStatus,
    });

    setTimeout(() => {
      setIsClicked(false);
      navigate(`/club/${club.id}`);
    }, 150);
  };

  return (
    <Styled.CardContainer
      $state={club.recruitmentStatus}
      $isClicked={isClicked}
      onClick={handleNavigate}
    >
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo $imageSrc={club.logo || default_profile_image} />
          <Styled.ClubInfo>
            <Styled.ClubName>{club.name}</Styled.ClubName>
            <Styled.Introduction>{club.introduction}</Styled.Introduction>
          </Styled.ClubInfo>
        </Styled.ClubProfile>
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
