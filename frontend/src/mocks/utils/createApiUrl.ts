import { API_BASE } from '../constants/clubApi';
import { validateClubId } from './validateClubId';

export const createApiUrl = (clubId: string, action: string = 'apply') => {
  if (!validateClubId(clubId)) {
    throw new Error('유효하지 않은 클럽 ID입니다.');
  }

  return `${API_BASE}/${clubId}/${action}`;
};
