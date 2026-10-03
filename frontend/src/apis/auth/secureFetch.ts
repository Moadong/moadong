import { refreshAccessToken } from '@/apis/auth/refreshAccessToken';
import { fetchWithTimeout } from '@/apis/utils/fetchWithTimeout';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const secureFetch = async (
  input: RequestInfo,
  init?: RequestInit,
  timeoutMs?: number,
): Promise<Response> => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  // 1차 요청 시도
  let response = await fetchWithTimeout(
    input,
    {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    },
    timeoutMs,
  );

  // accessToken 만료 시 → refresh 시도
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshAccessToken();
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

      response = await fetchWithTimeout(
        input,
        {
          ...init,
          // Content-Type은 호출부가 정한 값을 그대로 쓴다.
          // multipart(FormData)는 브라우저가 boundary를 붙여야 해서 여기서 강제하면 재요청이 깨진다.
          headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
          },
          credentials: 'include',
        },
        timeoutMs,
      );
    } catch (err) {
      // refresh도 실패한 경우 → 토큰 제거로 다음 접속 시 관리자 UI 노출 방지
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      throw new Error(`REFRESH_FAILED: ${(err as Error).message}`);
    }
  }

  return response;
};
