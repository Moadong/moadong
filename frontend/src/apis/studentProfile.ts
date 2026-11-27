import API_BASE_URL from '@/constants/api';
import { studentFetch } from './auth/studentFetch';
import { handleResponse } from './utils/apiHelpers';

const PROFILE_URL = `${API_BASE_URL}/api/student/profile`;

export interface StudentProfile {
  nickname: string;
  profileImageUrl: string | null;
}

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await studentFetch(PROFILE_URL);
  const data = await handleResponse<StudentProfile>(
    response,
    '프로필을 불러오지 못했습니다.',
  );
  if (!data) throw new Error('프로필 데이터가 없습니다.');
  return data;
};

export const updateStudentProfile = async (nickname: string): Promise<void> => {
  const response = await studentFetch(PROFILE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname }),
  });
  await handleResponse(response, '프로필 저장에 실패했습니다.');
};
