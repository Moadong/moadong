import { ApiError, NetworkError } from '@/errors';
import { getServerErrorMessage } from './getServerErrorMessage';

const FALLBACK = '전송에 실패했어요. 잠시 후 다시 시도해주세요.';

/** handleResponse가 실제로 만드는 형태. message는 호출부 기본 문구로 덮인 뒤다 */
const createApiError = (data: unknown) =>
  new ApiError(
    400,
    'Bad Request',
    '601-2',
    data,
    '피드백 전송에 실패했습니다.',
  );

describe('getServerErrorMessage', () => {
  it('ApiError의 data.message가 있으면 그것을 반환한다', () => {
    const error = createApiError({
      statuscode: '601-2',
      message: '이미지 파일을 찾을 수 없습니다.',
    });

    expect(getServerErrorMessage(error, FALLBACK)).toBe(
      '이미지 파일을 찾을 수 없습니다.',
    );
  });

  it('덮어써진 error.message가 아니라 data.message를 본다', () => {
    const error = createApiError({
      message: '이미지 파일을 찾을 수 없습니다.',
    });

    expect(getServerErrorMessage(error, FALLBACK)).not.toBe(error.message);
  });

  it('data가 없으면 폴백을 반환한다', () => {
    expect(getServerErrorMessage(createApiError(undefined), FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it('data에 message가 없으면 폴백을 반환한다', () => {
    expect(
      getServerErrorMessage(createApiError({ statuscode: '601-2' }), FALLBACK),
    ).toBe(FALLBACK);
  });

  it('ApiError가 아닌 일반 Error면 폴백을 반환한다', () => {
    expect(getServerErrorMessage(new Error('boom'), FALLBACK)).toBe(FALLBACK);
  });

  it('NetworkError처럼 data가 없는 에러도 폴백을 반환한다', () => {
    expect(getServerErrorMessage(new NetworkError(), FALLBACK)).toBe(FALLBACK);
  });

  // data는 서버 JSON 그대로라 객체라는 보장이 없다
  it.each([
    ['문자열', '이미지 파일을 찾을 수 없습니다.'],
    ['숫자', 500],
    ['배열', [{ message: '이미지 파일을 찾을 수 없습니다.' }]],
    ['null', null],
    ['message가 문자열이 아닌 객체', { message: 601 }],
    ['message가 빈 문자열인 객체', { message: '' }],
  ])('data가 %s면 폴백을 반환한다', (_, data) => {
    expect(getServerErrorMessage(createApiError(data), FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it('폴백은 화면마다 다르게 넘길 수 있다', () => {
    const error = createApiError(undefined);

    expect(getServerErrorMessage(error, '저장에 실패했어요.')).toBe(
      '저장에 실패했어요.',
    );
  });
});
