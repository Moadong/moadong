import { useMutation, useQuery } from '@tanstack/react-query';
import { getGameRanking, postGameClick } from '@/apis/game';
import { queryKeys } from '@/constants/queryKeys';

export const useGameRanking = () => {
  return useQuery({
    queryKey: queryKeys.game.ranking(),
    queryFn: getGameRanking,
    refetchInterval: 2000,
    staleTime: 0,
  });
};

export const useClickGame = () => {
  return useMutation({
    mutationFn: (clubName: string) => postGameClick(clubName),
    onError: (error) => {
      console.error('Error clicking game:', error);
    },
  });
};
