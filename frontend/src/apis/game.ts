import API_BASE_URL from '@/constants/api';
import { GameClickResponse, GameRankingResponse } from '@/types/game';
import { handleResponse } from './utils/apiHelpers';

export const postGameClick = async (
  clubName: string,
): Promise<GameClickResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/game/click`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clubName, ctAt: new Date().toISOString() }),
  });
  const data = await handleResponse<GameClickResponse>(
    response,
    '클릭 요청에 실패했습니다.',
  );
  return data!;
};

export const getGameRanking = async (): Promise<GameRankingResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/game/ranking`);
  const data = await handleResponse<GameRankingResponse>(
    response,
    '랭킹을 불러오는데 실패했습니다.',
  );
  return data!;
};
