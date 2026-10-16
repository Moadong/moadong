// 웹·앱 웹뷰를 구분하는 유일한 값인 is_webview 슈퍼 속성이 등록되는지 검증한다
import mixpanel from 'mixpanel-browser';
import getDeviceLocale from '@/utils/getDeviceLocale';
import getIOSVersion from '@/utils/getIOSVersion';
import isInAppWebView from '@/utils/isInAppWebView';
import registerMixpanelSuperProperties from './registerMixpanelSuperProperties';

jest.mock('mixpanel-browser', () => ({ register: jest.fn() }));
jest.mock('@/utils/isInAppWebView', () => jest.fn());
jest.mock('@/utils/getIOSVersion', () => jest.fn());
jest.mock('@/utils/getDeviceLocale', () => jest.fn());

describe('registerMixpanelSuperProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getIOSVersion as jest.Mock).mockReturnValue(null);
    (getDeviceLocale as jest.Mock).mockReturnValue(null);
  });

  it('앱 웹뷰면 is_webview를 true로 등록한다', () => {
    (isInAppWebView as jest.Mock).mockReturnValue(true);

    registerMixpanelSuperProperties();

    expect(mixpanel.register).toHaveBeenCalledWith({ is_webview: true });
  });

  it('웹이면 is_webview를 false로 등록한다', () => {
    (isInAppWebView as jest.Mock).mockReturnValue(false);

    registerMixpanelSuperProperties();

    expect(mixpanel.register).toHaveBeenCalledWith({ is_webview: false });
  });

  it('iOS 버전과 기기 언어가 있으면 함께 등록한다', () => {
    (isInAppWebView as jest.Mock).mockReturnValue(false);
    (getIOSVersion as jest.Mock).mockReturnValue('17.4');
    (getDeviceLocale as jest.Mock).mockReturnValue('en-US');

    registerMixpanelSuperProperties();

    expect(mixpanel.register).toHaveBeenCalledWith({ $os_version: '17.4' });
    expect(mixpanel.register).toHaveBeenCalledWith({ device_locale: 'en-US' });
  });
});
