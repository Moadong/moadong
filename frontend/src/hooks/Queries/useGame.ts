import { useQuery } from '@tanstack/react-query';
import { getGameRanking } from '@/apis/game';
import { queryKeys } from '@/constants/queryKeys';

export const useGameRanking = () => {
  return useQuery({
    queryKey: queryKeys.game.ranking(),
    queryFn: getGameRanking,
    staleTime: 60 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
