import API_BASE_URL from '@/constants/api';
import { studentFetch } from './auth/studentFetch';
import { handleResponse } from './utils/apiHelpers';

const PROFILE_URL = `${API_BASE_URL}/api/student/profile`;
const PROFILE_IMAGE_URL = `${API_BASE_URL}/api/student/profile/image`;

export interface StudentProfile {
  nickname: string;
  profileImageUrl: string | null;
}

interface PresignedUploadResponse {
  presignedUrl: string;
  finalUrl: string;
  requiredHeaders: Record<string, string>;
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

export const uploadProfileImage = async (file: File): Promise<string> => {
  const urlResponse = await studentFetch(`${PROFILE_IMAGE_URL}/upload-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  });
  const urlData = await handleResponse<PresignedUploadResponse>(
    urlResponse,
    '업로드 URL 발급에 실패했습니다.',
  );
  if (!urlData) throw new Error('업로드 URL 데이터가 없습니다.');

  const { presignedUrl, finalUrl, requiredHeaders } = urlData;

  await fetch(presignedUrl, {
    method: 'PUT',
    headers: requiredHeaders,
    body: file,
  });

  const completeResponse = await studentFetch(`${PROFILE_IMAGE_URL}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileUrl: finalUrl }),
  });
  await handleResponse(completeResponse, '이미지 저장에 실패했습니다.');

  return finalUrl;
};

export const deleteProfileImage = async (): Promise<void> => {
  const response = await studentFetch(PROFILE_IMAGE_URL, { method: 'DELETE' });
  await handleResponse(response, '이미지 삭제에 실패했습니다.');
};
