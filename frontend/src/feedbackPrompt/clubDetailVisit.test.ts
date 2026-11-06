import {
  clearClubDetailVisit,
  consumeClubDetailVisit,
  registerClubDetailVisit,
} from './clubDetailVisit';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('registerClubDetailVisit', () => {
  const originalRandomUUID = globalThis.crypto.randomUUID;

  afterEach(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      value: originalRandomUUID,
      configurable: true,
      writable: true,
    });
    clearClubDetailVisit();
  });

  it('crypto.randomUUID가 없는 웹뷰에서도 방문을 등록한다', () => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    expect(() =>
      registerClubDetailVisit('club-1', '/clubDetail/@club'),
    ).not.toThrow();

    const visit = consumeClubDetailVisit();
    expect(visit).toMatchObject({
      clubId: 'club-1',
      pathname: '/clubDetail/@club',
    });
    expect(visit?.id).toMatch(UUID_V4);
  });
});
