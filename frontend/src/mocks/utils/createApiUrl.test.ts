import { API_BASE, CLUB_ID } from '../constants/clubApi';
import { createApiUrl } from './createApiUrl';

describe('createApiUrl 함수 테스트', () => {
  it('올바른 클럽 ID로 URL이 정상 생성된다', () => {
    expect(createApiUrl(CLUB_ID)).toBe(`${API_BASE}/${CLUB_ID}/apply`);
  });

  it('clubId가 빈 문자열이면 에러를 반환해야 한다.', () => {
    expect(() => createApiUrl('')).toThrow('유효하지 않은 클럽 ID입니다.');
    expect(() => createApiUrl(' ')).toThrow('유효하지 않은 클럽 ID입니다.');
  });

  it('잘못된 형식의 클럽 ID로 URL 생성 시 에러가 발생한다', () => {
    expect(() => createApiUrl('123')).toThrow('유효하지 않은 클럽 ID입니다.');
    expect(() => createApiUrl('abc')).toThrow('유효하지 않은 클럽 ID입니다.');
  });
});
