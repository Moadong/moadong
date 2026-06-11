import API_BASE_URL from '@/constants/api';
import { GameRankingResponse } from '@/types/game';
import { handleResponse } from './utils/apiHelpers';

export const postGameClick = async (
  clubName: string,
  count: number,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/game/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubName, count, ctAt: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error('클릭 요청에 실패했습니다.');
};

export const getGameRanking = async (): Promise<GameRankingResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/game/ranking`);
  const data = await handleResponse<GameRankingResponse>(
    response,
    '랭킹을 불러오는데 실패했습니다.',
  );
  if (!data) throw new Error('랭킹을 불러오는데 실패했습니다.');
  return data;
};
