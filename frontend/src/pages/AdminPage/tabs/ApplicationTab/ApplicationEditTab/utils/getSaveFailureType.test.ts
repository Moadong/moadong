import { ApiError, HttpError, NetworkError } from '@/errors';
import { getSaveFailureType } from './getSaveFailureType';

describe('getSaveFailureType', () => {
  it('네트워크 오류는 network', () => {
    expect(getSaveFailureType(new NetworkError())).toBe('network');
  });

  it('토큰 갱신까지 실패하면 session_expired', () => {
    expect(
      getSaveFailureType(new Error('REFRESH_FAILED: refresh token expired')),
    ).toBe('session_expired');
  });

  it('서버가 에러로 응답하면 http', () => {
    expect(getSaveFailureType(new ApiError(500, 'Server Error'))).toBe('http');
    expect(getSaveFailureType(new HttpError(400, 'Bad Request'))).toBe('http');
  });

  it('그 밖의 오류는 unknown', () => {
    expect(getSaveFailureType(new Error('예상하지 못한 오류'))).toBe('unknown');
  });
});
