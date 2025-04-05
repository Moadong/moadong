import API_BASE_URL from '@/constants/api';

interface LoginResponseData {
  accessToken: string;
  clubId: string;
}

interface LoginResponse {
  statuscode: string;
  message: string;
  data: LoginResponseData;
}

export const login = async (
  userId: string,
  password: string,
): Promise<LoginResponseData> => {
  const response = await fetch(`${API_BASE_URL}/auth/user/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });

  if (!response.ok) {
    throw new Error(`로그인에 실패하였습니다: ${response.statusText}`);
  }

  const jsonResponse: LoginResponse = await response.json();

  return jsonResponse.data;
};
