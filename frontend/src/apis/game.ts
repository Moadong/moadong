import API_BASE_URL from '@/constants/api';
import { GameRankingResponse } from '@/types/game';
import { handleResponse } from './utils/apiHelpers';
import { fetchWithTimeout } from './utils/fetchWithTimeout';

export const getGameRanking = async (): Promise<GameRankingResponse> => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/game/ranking`);
  const data = await handleResponse<GameRankingResponse>(
    response,
    '랭킹을 불러오는데 실패했습니다.',
  );
  if (!data) throw new Error('랭킹을 불러오는데 실패했습니다.');
  return data;
};
