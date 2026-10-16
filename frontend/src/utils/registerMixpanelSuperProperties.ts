// 모든 Mixpanel 이벤트에 자동으로 붙는 슈퍼 속성($os_version, is_webview, device_locale)을 등록한다
import mixpanel from 'mixpanel-browser';
import getDeviceLocale from '@/utils/getDeviceLocale';
import getIOSVersion from '@/utils/getIOSVersion';
import isInAppWebView from '@/utils/isInAppWebView';

/** initSDK는 import.meta.env를 써서 테스트할 수 없으므로, 등록 로직만 따로 두고 테스트한다 */
const registerMixpanelSuperProperties = () => {
  const iosVersion = getIOSVersion();
  if (iosVersion) {
    mixpanel.register({ $os_version: iosVersion });
  }

  // 같은 화면이 웹과 앱 웹뷰에서 열리므로 이벤트·페이지를 나누지 않고 이 속성으로 구분한다
  mixpanel.register({ is_webview: isInAppWebView() });

  // 외국인 유학생 등 비한국어 사용자 식별용 — 이후 모든 이벤트에 자동 포함
  const deviceLocale = getDeviceLocale();
  if (deviceLocale) {
    mixpanel.register({ device_locale: deviceLocale });
  }
};

export default registerMixpanelSuperProperties;
