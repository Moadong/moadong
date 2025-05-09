import React, { useState } from 'react';
import mixpanel from 'mixpanel-browser';
import ClubTag from '@/components/ClubTag/ClubTag';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import * as Styled from './ClubCard.styles';
import { Club } from '@/types/club';
import { useNavigate } from 'react-router-dom';
import default_profile_image from '@/assets/images/logos/default_profile_image.svg';

const ClubCard = ({ club }: { club: Club }) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleNavigate = () => {
    setIsClicked(true);
    mixpanel.track('ClubCard Clicked', {
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
      onClick={handleNavigate}>
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo $imageSrc={club.logo || default_profile_image} />
          <Styled.ClubName>{club.name}</Styled.ClubName>
        </Styled.ClubProfile>
        <ClubStateBox state={club.recruitmentStatus} />
      </Styled.CardHeader>
      <Styled.Introduction>{club.introduction}</Styled.Introduction>
      <Styled.TagsContainer>
        <ClubTag type={club.division} />
        <ClubTag type={club.category} />
        {club.tags.map((tag) => (
          <ClubTag key={tag} type={'자유'}>
            {tag}
          </ClubTag>
        ))}
      </Styled.TagsContainer>
    </Styled.CardContainer>
  );
};

export default ClubCard;
