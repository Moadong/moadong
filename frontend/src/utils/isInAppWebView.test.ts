import isInAppWebView from './isInAppWebView';

describe('isInAppWebView 함수', () => {
  const originalUserAgent = navigator.userAgent;

  afterEach(() => {
    // 각 테스트 후 userAgent 원복
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: false,
      configurable: true,
    });
  });

  test('userAgent에 "MoadongApp"이 포함되어 있을 때 true를 반환한다', () => {
    // Given: userAgent에 "MoadongApp" 문자열이 포함된 환경이 주어졌을 때
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0) MoadongApp',
      configurable: true,
    });

    // When: isInAppWebView 함수를 실행하면
    const result = isInAppWebView();

    // Then: true를 반환해야 한다
    expect(result).toBe(true);
  });

  test('userAgent에 "MoadongApp"이 포함되어 있지 않을 때 false를 반환한다', () => {
    // Given: userAgent에 "MoadongApp" 문자열이 없는 환경이 주어졌을 때
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    // When: isInAppWebView 함수를 실행하면
    const result = isInAppWebView();

    // Then: false를 반환해야 한다
    expect(result).toBe(false);
  });
});
