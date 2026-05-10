import AppDownloadImage from '@/assets/images/popup/app-download.png';
import DaedongImage from '@/assets/images/popup/daedong.png';
import { USER_EVENT } from '@/constants/eventName';
import { detectPlatform, getAppStoreLink } from '@/utils/appStoreLink';
import { PopupConfig } from '@/utils/popupUtils';

export const APP_DOWNLOAD_POPUP: PopupConfig = {
  id: 'app_download',
  storageKey: 'mainpage_popup_hidden_date',
  sessionKey: 'mainpage_popup_closed',
  daysToHide: 7,
  image: AppDownloadImage,
  imageAlt: '앱 다운로드',
  mobileOnly: true,
  onImageClick: (trackEvent) => {
    trackEvent(USER_EVENT.APP_DOWNLOAD_POPUP_CLICKED, {
      popupType: 'app_download',
      platform: detectPlatform(),
    });
    window.open(getAppStoreLink(), '_blank');
  },
};

export const DAEDONG_POPUP: PopupConfig = {
  id: 'daedong_2026',
  storageKey: 'mainpage_daedong_popup_hidden_date',
  sessionKey: 'mainpage_daedong_popup_closed',
  daysToHide: 7,
  image: DaedongImage,
  imageAlt: '2026 대동제',
  to: '/festival-busking',
};
