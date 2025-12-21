import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import ClubTag from '@/components/ClubTag/ClubTag';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import { Club } from '@/types/club';
import * as Styled from './ClubCard.styles';

const ClubCard = ({ club }: { club: Club }) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const trackEvent = useMixpanelTrack();

  const handleNavigate = () => {
    setIsClicked(true);

    trackEvent(USER_EVENT.RECOMMENDED_CLUB_CLICKED, {
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
          <Styled.ClubName>{club.name}</Styled.ClubName>
        </Styled.ClubProfile>
        <ClubStateBox state={club.recruitmentStatus} />
      </Styled.CardHeader>
      <Styled.Introduction>{club.introduction}</Styled.Introduction>
      <Styled.TagsContainer>
        <ClubTag key={`division-${club.id}`} type={club.division} />
        <ClubTag key={`category-${club.id}`} type={club.category} />
        {club.tags
          .filter((tag) => tag.trim())
          .map((tag) => (
            <ClubTag key={`tag-${club.id}-${tag}`} type={'자유'}>
              {tag}
            </ClubTag>
          ))}
      </Styled.TagsContainer>
    </Styled.CardContainer>
  );
};

export default ClubCard;
