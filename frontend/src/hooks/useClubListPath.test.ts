import { renderHook } from '@testing-library/react';
import isInAppWebView from '@/utils/isInAppWebView';
import useClubListPath from './useClubListPath';

jest.mock('@/utils/isInAppWebView', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const setWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  });
};

describe('useClubListPath', () => {
  afterEach(() => {
    jest.mocked(isInAppWebView).mockReset();
  });

  it('모바일 웹은 /clubs를 쓴다', () => {
    setWidth(390);
    jest.mocked(isInAppWebView).mockReturnValue(false);

    expect(renderHook(() => useClubListPath()).result.current).toBe('/clubs');
  });

  it('앱 웹뷰는 폭이 넓어도 /clubs를 쓴다', () => {
    setWidth(1024);
    jest.mocked(isInAppWebView).mockReturnValue(true);

    expect(renderHook(() => useClubListPath()).result.current).toBe('/clubs');
  });

  it('태블릿·데스크톱 웹은 홈(/)이 곧 목록이다', () => {
    setWidth(1024);
    jest.mocked(isInAppWebView).mockReturnValue(false);

    expect(renderHook(() => useClubListPath()).result.current).toBe('/');
  });
});
