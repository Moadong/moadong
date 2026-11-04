import type { Query } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

// 백엔드 장애로 refetch가 불가능한 상황에서도 메인페이지가 마지막 데이터를 보여주도록
// 성공한 공개 쿼리만 localStorage에 영속화한다.
export const PERSISTED_QUERY_ROOTS: string[] = [
  queryKeys.club.all[0],
  queryKeys.promotion.all[0],
  queryKeys.banner.all[0],
  queryKeys.game.all[0],
];

type PersistCandidate = Pick<Query, 'queryKey'> & {
  state: Pick<Query['state'], 'status'>;
};

/** 성공한 메인 공개 데이터만 저장. 개인/인증/어드민 데이터·실패 응답은 제외. 키의 첫 칸만 본다 */
const shouldPersistQuery = (query: PersistCandidate) => {
  if (query.state.status !== 'success') return false;
  const [root] = query.queryKey as [string];
  return PERSISTED_QUERY_ROOTS.includes(root);
};

export default shouldPersistQuery;
