import React from 'react';
import ClubTag from '@/components/ClubTag/ClubTag';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import * as Styled from './ClubCard.styles';
import { Club } from '@/types/club';
import { useNavigate } from 'react-router-dom';

const ClubCard = ({ club }: { club: Club }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/club/${club.id}`);
  };

  return (
    <Styled.CardContainer
      state={club.recruitmentStatus}
      onClick={handleNavigate}>
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo imageSrc={club.logo} />
          <Styled.ClubName>{club.name}</Styled.ClubName>
        </Styled.ClubProfile>
        <ClubStateBox state={club.recruitmentStatus} />
      </Styled.CardHeader>
      <Styled.Introduction>{club.introduction}</Styled.Introduction>
      <Styled.TagsContainer>
        <ClubTag type={club.division} />
        <ClubTag type={club.classification} />
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
