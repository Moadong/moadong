import { asClubId } from '@/types/branded';
import { Club, RecruitmentStatus } from '@/types/club';
import partitionClubsByRecruitment from './partitionClubsByRecruitment';

const makeClub = (id: string, recruitmentStatus: RecruitmentStatus): Club => ({
  id: asClubId(id),
  name: `동아리 ${id}`,
  logo: '',
  tags: [],
  recruitmentStatus,
  division: '중동',
  category: '학술',
  introduction: '',
});

const ids = (clubs: Club[]) => clubs.map((club) => club.id);

describe('partitionClubsByRecruitment', () => {
  it('모집 중(ALWAYS·OPEN·UPCOMING)과 그 외로 나누고 각 쪽에서 서버 순서를 유지한다', () => {
    const clubs = [
      makeClub('a', 'CLOSED'),
      makeClub('b', 'OPEN'),
      makeClub('c', 'ALWAYS'),
      makeClub('d', 'CLOSED'),
      makeClub('e', 'UPCOMING'),
      makeClub('f', 'OPEN'),
    ];

    const { recruiting, closed } = partitionClubsByRecruitment(clubs);

    expect(ids(recruiting)).toEqual(['b', 'c', 'e', 'f']);
    expect(ids(closed)).toEqual(['a', 'd']);
  });

  it('누락·중복 없이 입력의 모든 동아리를 한 번씩 담는다', () => {
    const clubs = [
      makeClub('a', 'OPEN'),
      makeClub('b', 'CLOSED'),
      makeClub('c', 'UPCOMING'),
      makeClub('d', 'ALWAYS'),
      makeClub('e', 'CLOSED'),
    ];

    const { recruiting, closed } = partitionClubsByRecruitment(clubs);
    const merged = [...ids(recruiting), ...ids(closed)];

    expect(recruiting.length + closed.length).toBe(clubs.length);
    expect(new Set(merged).size).toBe(merged.length);
    expect(new Set(merged)).toEqual(new Set(ids(clubs)));
  });

  it('알 수 없는 모집 상태는 마감 쪽에 둔다', () => {
    const unknown = {
      ...makeClub('x', 'OPEN'),
      recruitmentStatus: 'PAUSED',
    } as unknown as Club;

    const { recruiting, closed } = partitionClubsByRecruitment([unknown]);

    expect(recruiting).toEqual([]);
    expect(ids(closed)).toEqual(['x']);
  });

  it('빈 입력이면 두 쪽 모두 빈 배열이다', () => {
    expect(partitionClubsByRecruitment([])).toEqual({
      recruiting: [],
      closed: [],
    });
  });

  it('전부 모집 중이면 마감 쪽이 비고, 전부 마감이면 모집 중 쪽이 빈다', () => {
    const allOpen = [makeClub('a', 'OPEN'), makeClub('b', 'ALWAYS')];
    const allClosed = [makeClub('c', 'CLOSED'), makeClub('d', 'CLOSED')];

    expect(partitionClubsByRecruitment(allOpen)).toEqual({
      recruiting: allOpen,
      closed: [],
    });
    expect(partitionClubsByRecruitment(allClosed)).toEqual({
      recruiting: [],
      closed: allClosed,
    });
  });

  it('입력 배열을 바꾸지 않는다', () => {
    const clubs = [makeClub('a', 'CLOSED'), makeClub('b', 'OPEN')];
    const snapshot = [...clubs];

    partitionClubsByRecruitment(clubs);

    expect(clubs).toEqual(snapshot);
  });
});
