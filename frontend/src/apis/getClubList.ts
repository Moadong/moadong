import API_BASE_URL from '@/constants/api';

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

  if (!response.ok) {
    throw new Error('클럽 데이터를 불러오는데 실패했습니다');
  }

  const result = await response.json();
  return {
    clubs: result.data.clubs,
    totalCount: result.data.totalCount,
  };
};
