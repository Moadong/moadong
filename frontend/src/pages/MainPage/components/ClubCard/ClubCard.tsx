import React, { useState, useEffect, useRef } from 'react';
import mixpanel from 'mixpanel-browser';
import ClubTag from '@/components/ClubTag/ClubTag';
import ClubLogo from '@/components/ClubLogo/ClubLogo';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import * as Styled from './ClubCard.styles';
import { Club } from '@/types/club';
import { useNavigate } from 'react-router-dom';
import default_profile_logo from '@/assets/images/logos/default_profile_image.svg';

const CATEGORY_BUTTON_LIST_OFFSET = 120;

const ClubCard = ({ club }: { club: Club }) => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchingCategory, setIsTouchingCategory] = useState(true);
  const clubCardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const checkCardPosition = () => {
      if (window.innerWidth > 500 || !clubCardRef.current) return;

      const rect = clubCardRef.current.getBoundingClientRect();
      setIsTouchingCategory(rect.top > CATEGORY_BUTTON_LIST_OFFSET);
    };

    checkCardPosition();
    window.addEventListener('scroll', checkCardPosition);
    window.addEventListener('resize', checkCardPosition);

    return () => {
      window.removeEventListener('scroll', checkCardPosition);
      window.removeEventListener('resize', checkCardPosition);
    };
  }, []);

  return (
    <Styled.CardContainer
      ref={clubCardRef}
      state={club.recruitmentStatus}
      isClicked={isClicked}
      showShadow={isTouchingCategory}
      onClick={handleNavigate}>
      <Styled.CardHeader>
        <Styled.ClubProfile>
          <ClubLogo imageSrc={default_profile_logo} />
          {/* TODO: 동아리 로고 이미지가 추가 되면 <ClubLogo imageSrc={club.logo} /> */}
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
