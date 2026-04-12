describe('isKakaoTalkBrowser', () => {
  const userAgentGetter = jest.spyOn(navigator, 'userAgent', 'get');

  afterEach(() => {
    userAgentGetter.mockRestore();
    jest.resetModules(); // Important to re-import the module for each test
  });

  it('should return true if user agent contains KAKAOTALK', () => {
    userAgentGetter.mockReturnValue('Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36 KAKAOTALK');
    const isKakaoTalkBrowser = require('./isKakaoTalkBrowser').default;
    expect(isKakaoTalkBrowser()).toBe(true);
  });

  it('should return false if user agent does not contain KAKAOTALK', () => {
    userAgentGetter.mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36');
    const isKakaoTalkBrowser = require('./isKakaoTalkBrowser').default;
    expect(isKakaoTalkBrowser()).toBe(false);
  });
});
