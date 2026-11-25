import { Club, RecruitmentStatus } from '@/types/club';

const RECRUITING_STATUSES: ReadonlySet<RecruitmentStatus> = new Set([
  'ALWAYS',
  'OPEN',
  'UPCOMING',
]);

/**
 * 둘러보기 응답을 모집 중(상시·모집중·모집예정)과 그 외로 나눈다.
 * 서버 정렬을 신뢰하므로 다시 정렬하지 않고, 각 쪽에서 응답 순서를 그대로 유지한다(stable partition).
 * 알 수 없는 상태값은 마감 쪽에 둔다.
 */
const partitionClubsByRecruitment = (
  clubs: Club[],
): { recruiting: Club[]; closed: Club[] } => {
  const recruiting: Club[] = [];
  const closed: Club[] = [];

  for (const club of clubs) {
    if (RECRUITING_STATUSES.has(club.recruitmentStatus)) {
      recruiting.push(club);
    } else {
      closed.push(club);
    }
  }

  return { recruiting, closed };
};

export default partitionClubsByRecruitment;
