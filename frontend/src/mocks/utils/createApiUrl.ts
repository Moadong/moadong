import { API_BASE } from '../constants/api';

export const createApiUrl = (
  clubId: string | number,
  action: string = 'apply',
) => {
  // 유효하지 않은 clubId 케이스
  if (clubId === '' || clubId === 0) {
    return `${API_BASE}/${action}`;
  }
  return `${API_BASE}/${clubId}/${action}`;
};
