import { useState, useEffect } from 'react';
import * as Styled from './RecommendedClubs.styles';
import ClubCard from '@/pages/ClubDetailPage/components/ClubCard/ClubCard';
import { Club } from '@/types/club';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface RecommendedClubsProps {
  clubs: Club[];
}

const getABGroup = (): 'A' | 'B' => {
  const savedGroup = localStorage.getItem('recommendABGroup');
  if (savedGroup === 'A' || savedGroup === 'B') return savedGroup;
  const group = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem('recommendABGroup', group);
  return 'A';
};

const RecommendedClubs = ({ clubs }: RecommendedClubsProps) => {
  const [abGroup, setAbGroup] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const group = getABGroup();
    setAbGroup(group);
  }, []);

  if (!clubs || clubs.length === 0) return null;

  const displayClubs = clubs.slice(0, 6);

  if (abGroup === 'A') {
    // 기존 그리드 + 기존 문구
    return (
      <Styled.Container>
        <Styled.Title>이런 동아리는 어때요? 지금 바로 확인! 🔥</Styled.Title>
        <Styled.GridList>
          {displayClubs.map((club) => (
            <Styled.CardWrapper key={club.id}>
              <ClubCard club={club} />
            </Styled.CardWrapper>
          ))}
        </Styled.GridList>
      </Styled.Container>
    );
  } else {
    // B 그룹: 슬라이더 + 문구 변경
    return (
      <Styled.Container>
        <Styled.Title>당신에게 맞는 동아리 안내드려요! ✨</Styled.Title>
        <Swiper spaceBetween={16} slidesPerView={2} freeMode={true}>
          {displayClubs.map((club) => (
            <SwiperSlide key={club.id}>
              <Styled.CardWrapper>
                <ClubCard club={club} />
              </Styled.CardWrapper>
            </SwiperSlide>
          ))}
        </Swiper>
      </Styled.Container>
    );
  }
};

export default RecommendedClubs;
