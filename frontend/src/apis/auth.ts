import API_BASE_URL from '@/constants/api';
import { secureFetch } from './auth/secureFetch';
import { handleResponse } from './utils/apiHelpers';

interface LoginResponseData {
  accessToken: string;
  clubId: string;
  allowedPersonalInformation: boolean;
}

interface ChangePasswordPayload {
  password: string;
}

export const login = async (
  userId: string,
  password: string,
): Promise<LoginResponseData | undefined> => {
  const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });
  return handleResponse<LoginResponseData>(
    response,
    '로그인에 실패하였습니다.',
  );
};

export const logout = async (): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/user/logout`, {
    method: 'GET',
    credentials: 'include',
  });

  await handleResponse(response, '로그아웃에 실패하였습니다.');
};

export const getClubIdByToken = async (): Promise<string> => {
  const response = await secureFetch(`${API_BASE_URL}/auth/user/find/club`, {
    method: 'POST',
  });
  const data = await handleResponse<{ clubId: string }>(
    response,
    '인증에 실패했습니다.',
  );
  if (!data?.clubId) {
    throw new Error('ClubId를 가져올 수 없습니다.');
  }
  return data.clubId;
};

export const allowPersonalInformation = async (): Promise<void> => {
  const response = await secureFetch(
    `${API_BASE_URL}/allow/personal-information`,
    {
      method: 'PUT',
    },
  );
  await handleResponse(response, '개인정보 활용 동의에 실패했습니다.');
};

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<void> => {
  const response = await secureFetch(`${API_BASE_URL}/auth/user/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  await handleResponse(response, '비밀번호 변경에 실패했습니다.');
};
