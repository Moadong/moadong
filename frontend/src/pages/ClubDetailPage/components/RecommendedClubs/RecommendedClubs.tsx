import ClubCard from '@/pages/ClubDetailPage/components/ClubCard/ClubCard';
import { Club } from '@/types/club';
import * as Styled from './RecommendedClubs.styles';

const RecommendedClubs = ({ clubs }: { clubs: Club[] }) => {
  if (!clubs || clubs.length === 0) return null;

  const displayClubs = clubs.slice(0, 6);
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
};

export default RecommendedClubs;
