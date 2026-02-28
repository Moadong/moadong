import { refreshAccessToken } from '@/apis/auth/refreshAccessToken';

export const secureFetch = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const accessToken = localStorage.getItem('accessToken');

  // 1차 요청 시도
  let response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  });

  // accessToken 만료 시 → refresh 시도
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();
      localStorage.setItem('accessToken', newAccessToken);

      response = await fetch(input, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (err) {
      // refresh도 실패한 경우
      throw new Error(`REFRESH_FAILED: ${(err as Error).message}`);
    }
  }

  return response;
};
