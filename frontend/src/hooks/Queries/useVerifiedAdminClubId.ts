import { useQuery } from '@tanstack/react-query';
import { getClubIdByToken } from '@/apis/auth';
import { queryKeys } from '@/constants/queryKeys';

/**
 * 저장된 관리자 clubId를 토큰으로 다시 확인한다.
 * 저장값만 믿으면 토큰이 만료됐거나 다른 계정 토큰으로 바뀌어도 이전 동아리의 관리자 UI가 공개 화면에 남는다.
 * 저장값이 없으면(일반 방문자) 요청하지 않는다.
 */
export const useVerifiedAdminClubId = (storedClubId: string | null) =>
  useQuery({
    queryKey: queryKeys.auth.adminClubId(storedClubId ?? ''),
    queryFn: getClubIdByToken,
    enabled: storedClubId !== null,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
