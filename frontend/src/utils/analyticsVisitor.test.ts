import {
  ANALYTICS_VISITOR_ID_KEY,
  createAnalyticsId,
  getAnalyticsVisitorId,
} from './analyticsVisitor';

describe('analyticsVisitor', () => {
  const originalCrypto = global.crypto;

  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: {
        randomUUID: jest.fn(() => 'uuid-1'),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(global, 'crypto', {
      configurable: true,
      value: originalCrypto,
    });
    jest.restoreAllMocks();
  });

  it('prefix가 붙은 analytics id를 생성한다', () => {
    expect(createAnalyticsId('visitor')).toBe('visitor_uuid-1');
  });

  it('visitor id가 없으면 생성하고 localStorage에 저장한다', () => {
    const visitorId = getAnalyticsVisitorId();

    expect(visitorId).toBe('visitor_uuid-1');
    expect(localStorage.getItem(ANALYTICS_VISITOR_ID_KEY)).toBe(
      'visitor_uuid-1',
    );
  });

  it('저장된 visitor id가 있으면 재사용한다', () => {
    localStorage.setItem(ANALYTICS_VISITOR_ID_KEY, 'visitor_existing');

    expect(getAnalyticsVisitorId()).toBe('visitor_existing');
  });

  it('storage 접근이 실패하면 undefined를 반환한다', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(getAnalyticsVisitorId()).toBeUndefined();
  });
});
