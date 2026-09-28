import { useGetCardList } from '@/hooks/Queries/useClub';
import ClubCard from '@/pages/MainPage/components/ClubCard/ClubCard';
import { Club, RecruitmentStatus } from '@/types/club';
import * as Styled from './RecommendedClubs.styles';

const MAX_CLUBS = 3;

/** 모집중·상시모집을 앞에 세운다. 나머지는 서버 순서 유지 */
const RECRUITING: RecruitmentStatus[] = ['OPEN', 'ALWAYS'];
const recruitingFirst = (a: Club, b: Club) =>
  Number(RECRUITING.includes(b.recruitmentStatus)) -
  Number(RECRUITING.includes(a.recruitmentStatus));

interface RecommendedClubsProps {
  /** CategoryButtonList와 같은 한글 분과 라벨 */
  category: string;
  onClubClick: (club: Club) => void;
}

/**
 * 유형의 분과에 속한 동아리를 모아동 API로 받아 홈과 같은 카드 3장으로 보여준다.
 * "부경대 학생이라면?"을 열 때만 마운트되므로 퀴즈 구간은 네트워크를 쓰지 않는다.
 */
const RecommendedClubs = ({ category, onClubClick }: RecommendedClubsProps) => {
  const { data, isPending, isError } = useGetCardList({
    keyword: '',
    recruitmentStatus: 'all',
    category,
    division: 'all',
  });

  if (isPending) return <Styled.Notice>동아리를 찾는 중이에요</Styled.Notice>;
  if (isError || !data?.clubs.length) return null;

  const clubs = [...data.clubs].sort(recruitingFirst).slice(0, MAX_CLUBS);

  return (
    <Styled.CardList>
      {clubs.map((club, index) => (
        <ClubCard
          key={club.id}
          club={club}
          index={index}
          onCardClick={onClubClick}
        />
      ))}
    </Styled.CardList>
  );
};

export default RecommendedClubs;
