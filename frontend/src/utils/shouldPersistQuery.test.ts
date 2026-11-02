import type { QueryStatus } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import shouldPersistQuery, {
  PERSISTED_QUERY_ROOTS,
} from './shouldPersistQuery';

const query = (
  queryKey: readonly unknown[],
  status: QueryStatus = 'success',
) => ({
  queryKey,
  state: { status },
});

describe('shouldPersistQuery', () => {
  it.each(PERSISTED_QUERY_ROOTS)('성공한 %s 루트 쿼리는 저장한다', (root) => {
    expect(shouldPersistQuery(query([root, 'list']))).toBe(true);
  });

  it('동아리 목록은 검색어와 상관없이 저장한다', () => {
    expect(
      shouldPersistQuery(
        query(queryKeys.club.list('suggestions', 'all', 'all', 'all')),
      ),
    ).toBe(true);
  });

  it.each([
    ['동아리 상세', queryKeys.club.detail('abc123')],
    ['동아리 캘린더', queryKeys.club.calendarEvents('abc123')],
    ['관리자 clubId 확인', queryKeys.auth.adminClubId('abc123')],
    ['지원자 목록', queryKeys.applicants.detail('form1')],
  ])('목록에 없는 루트(%s)는 저장하지 않는다', (_, queryKey) => {
    expect(shouldPersistQuery(query(queryKey))).toBe(false);
  });

  it.each<QueryStatus>(['pending', 'error'])(
    '성공하지 않은(%s) 쿼리는 루트가 목록에 있어도 저장하지 않는다',
    (status) => {
      expect(shouldPersistQuery(query(queryKeys.club.all, status))).toBe(false);
    },
  );
});
