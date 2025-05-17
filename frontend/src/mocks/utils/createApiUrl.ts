import { API_BASE } from '../constants/clubApi';

export const createApiUrl = (clubId: string, action: string = 'apply') => {
  if (clubId.trim() === '') {
    throw new Error('유효하지 않은 클럽 ID입니다.');
  }

  if (!/^[0-9a-fA-F]{24}$/.test(clubId)) {
    throw new Error('유효하지 않은 클럽 ID입니다.');
  }

  return `${API_BASE}/${clubId}/${action}`;
};
