import { HttpError, NetworkError } from '@/errors';

// secureFetch가 토큰 갱신까지 실패했을 때 던지는 에러 메시지의 접두어
const REFRESH_FAILED_PREFIX = 'REFRESH_FAILED';

export type SaveFailureType =
  | 'network'
  | 'session_expired'
  | 'http'
  | 'unknown';

/** 지원서 저장 실패 원인을 이벤트로 나눠 보기 위한 분류 */
export const getSaveFailureType = (error: Error): SaveFailureType => {
  if (error instanceof NetworkError) return 'network';
  if (error.message.startsWith(REFRESH_FAILED_PREFIX)) return 'session_expired';
  if (error instanceof HttpError) return 'http';
  return 'unknown';
};
