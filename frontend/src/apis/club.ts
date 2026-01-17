import API_BASE_URL from '@/constants/api';
import { secureFetch } from './auth/secureFetch';
import { ClubDetail, ClubDescription } from '@/types/club';
import { handleResponse, withErrorHandling } from './utils/apiHelpers';

export const getClubDetail = async (clubId: string): Promise<ClubDetail> => {
  return withErrorHandling(async () => {
    const response = await fetch(`${API_BASE_URL}/api/club/${clubId}`);
    const data = await handleResponse(response, '클럽 정보를 불러오는데 실패했습니다.');
    return data.club;
  }, 'Error fetching club details');
};

export const getClubList = async (
  keyword: string = '',
  recruitmentStatus: string = 'all',
  category: string = 'all',
  division: string = 'all',
) => {
  return withErrorHandling(async () => {
    const url = new URL(`${API_BASE_URL}/api/club/search/`);
    const params = new URLSearchParams({
      keyword,
      recruitmentStatus,
      category,
      division,
    });

    url.search = params.toString();
    const response = await fetch(url);
    const data = await handleResponse(response, '클럽 데이터를 불러오는데 실패했습니다.');

    return {
      clubs: data.clubs,
      totalCount: data.totalCount,
    };
  }, '클럽 데이터를 불러오는데 실패했습니다');
};

export const updateClubDescription = async (
  updatedData: ClubDescription,
): Promise<void> => {
  return withErrorHandling(async () => {
    const response = await secureFetch(`${API_BASE_URL}/api/club/description`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    await handleResponse(response, '클럽 설명 수정에 실패했습니다.');
  }, 'Failed to update club description');
};

export const updateClubDetail = async (
  updatedData: Partial<ClubDetail>,
): Promise<void> => {
  return withErrorHandling(async () => {
    const response = await secureFetch(`${API_BASE_URL}/api/club/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    await handleResponse(response, '클럽 정보 수정에 실패했습니다.');
  }, 'Failed to update club detail');
};
