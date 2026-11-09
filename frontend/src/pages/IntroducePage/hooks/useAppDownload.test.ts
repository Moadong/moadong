// 소개 페이지 앱 다운로드의 기기 판별(QR·스토어·웹뷰)과 동작별 처리(트래킹·새 탭·이동)를 검증한다
import { renderHook } from '@testing-library/react';
import { APP_STORE_LINKS } from '@/utils/appStoreLink';
import useAppDownload, {
  isStoreDevice,
  shouldShowInstallQr,
} from './useAppDownload';

const trackEvent = jest.fn();
jest.mock('@/hooks/Mixpanel/useMixpanelTrack', () => ({
  __esModule: true,
  default: () => trackEvent,
}));

const UA = {
  iphone:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
  android:
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
  // iPadOS는 맥처럼 보이는 UA를 보낸다
  macLike:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  windows:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
};

const setDevice = ({
  ua,
  touchPoints,
  finePointer,
}: {
  ua: string;
  touchPoints: number;
  finePointer: boolean;
}) => {
  Object.defineProperty(window.navigator, 'userAgent', {
    value: ua,
    configurable: true,
  });
  Object.defineProperty(window.navigator, 'maxTouchPoints', {
    value: touchPoints,
    configurable: true,
  });
  window.matchMedia = jest.fn().mockReturnValue({ matches: finePointer });
};

describe('isStoreDevice / shouldShowInstallQr', () => {
  it('iPhone·Android 폰은 스토어로 보내고 QR은 보이지 않는다', () => {
    setDevice({ ua: UA.iphone, touchPoints: 5, finePointer: false });
    expect(isStoreDevice()).toBe(true);
    expect(shouldShowInstallQr()).toBe(false);

    setDevice({ ua: UA.android, touchPoints: 5, finePointer: false });
    expect(isStoreDevice()).toBe(true);
  });

  it('맥처럼 보이는 UA라도 터치가 있으면(iPad) 스토어 기기로 본다', () => {
    setDevice({ ua: UA.macLike, touchPoints: 5, finePointer: true });
    expect(isStoreDevice()).toBe(true);
    expect(shouldShowInstallQr()).toBe(false);
  });

  it('맥·윈도우 PC는 스토어로 보내지 않고 설치 QR을 보여 준다', () => {
    setDevice({ ua: UA.macLike, touchPoints: 0, finePointer: true });
    expect(isStoreDevice()).toBe(false);
    expect(shouldShowInstallQr()).toBe(true);

    setDevice({ ua: UA.windows, touchPoints: 0, finePointer: true });
    expect(shouldShowInstallQr()).toBe(true);
  });

  it('앱 웹뷰 안에서는 스토어로 다시 보내지 않는다', () => {
    setDevice({
      ua: `${UA.iphone} MoadongApp`,
      touchPoints: 5,
      finePointer: false,
    });
    expect(isStoreDevice()).toBe(false);
  });
});

describe('useAppDownload', () => {
  beforeEach(() => {
    trackEvent.mockClear();
    setDevice({ ua: UA.iphone, touchPoints: 5, finePointer: false });
  });

  it('qr은 트래킹만 하고 스토어를 열지 않는다', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { result } = renderHook(() => useAppDownload('hero'));

    result.current('qr');

    expect(trackEvent).toHaveBeenCalledWith(
      'App Download Introduce Clicked',
      expect.objectContaining({ location: 'hero', action: 'qr' }),
    );
    expect(open).not.toHaveBeenCalled();
    open.mockRestore();
  });

  it('open은 기기에 맞는 스토어를 새 탭으로 연다', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { result } = renderHook(() => useAppDownload('footer'));

    result.current('open');

    expect(open).toHaveBeenCalledWith(
      APP_STORE_LINKS.iphone,
      '_blank',
      'noopener,noreferrer',
    );
    open.mockRestore();
  });
});
