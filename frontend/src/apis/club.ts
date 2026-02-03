import API_BASE_URL from '@/constants/api';
import { ClubDescription, ClubDetail } from '@/types/club';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

export const getClubDetail = async (clubId: string): Promise<ClubDetail> => {
  const response = await fetch(`${API_BASE_URL}/api/club/${clubId}`);
  const data = await handleResponse<{ club: ClubDetail }>(
    response,
    '클럽 정보를 불러오는데 실패했습니다.',
  );
  if (!data?.club) {
    throw new Error('클럽 정보를 가져올 수 없습니다.');
  }
  return data.club;
};

export const getClubList = async (
  keyword: string = '',
  recruitmentStatus: string = 'all',
  category: string = 'all',
  division: string = 'all',
) => {
  const url = new URL(`${API_BASE_URL}/api/club/search/`);
  const params = new URLSearchParams({
    keyword,
    recruitmentStatus,
    category,
    division,
  });

  url.search = params.toString();
  const response = await fetch(url);
  const data = await handleResponse<{
    clubs: ClubDetail[];
    totalCount: number;
  }>(response, '클럽 데이터를 불러오는데 실패했습니다.');

  if (!data) {
    throw new Error('클럽 데이터를 가져올 수 없습니다.');
  }

  return {
    clubs: data.clubs || [],
    totalCount: data.totalCount || 0,
  };
};

export const updateClubDescription = async (
  updatedData: ClubDescription,
): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/api/club/description`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  await handleResponse(response, '클럽 설명 수정에 실패했습니다.');
};

export const updateClubDetail = async (
  updatedData: Partial<ClubDetail>,
): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/api/club/info`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  await handleResponse(response, '클럽 정보 수정에 실패했습니다.');
};
