import { ApiError } from '@/errors';

/**
 * 서버가 내려준 문구를 그대로 꺼낸다.
 * `handleResponse`가 error.message를 호출부 기본 문구로 덮어쓰기 때문에 원본은 data에 남는다.
 * 사진이 R2에 없다(601-2), 10자 미만이다 같은 실패는 사용자가 고칠 수 있는 것이라
 * "실패했어요"보다 이유를 보여주는 편이 낫다.
 *
 * 폴백은 화면마다 달라서 인자로 받는다.
 */
export const getServerErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!(error instanceof ApiError)) return fallback;

  const body = error.data;
  if (typeof body !== 'object' || body === null) return fallback;

  const { message } = body as { message?: unknown };

  // 빈 문자열이면 빈 토스트가 뜬다. handleResponse도 같은 이유로 truthy 검사를 한다.
  return typeof message === 'string' && message !== '' ? message : fallback;
};
