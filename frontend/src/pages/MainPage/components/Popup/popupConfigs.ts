import AppDownloadImage from '@/assets/images/popup/app-download.webp';
import MailboxOpenImage from '@/assets/images/popup/mailbox-open.webp';
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
    window.open(getAppStoreLink(), '_blank', 'noopener');
  },
};

/** 앱 전용 — MainPage에서 웹뷰 분기로만 넘긴다 */
export const MAILBOX_OPEN_POPUP: PopupConfig = {
  id: 'mailbox_open',
  storageKey: 'mainpage_mailbox_popup_hidden_date',
  sessionKey: 'mainpage_mailbox_popup_closed',
  daysToHide: 7,
  image: MailboxOpenImage,
  imageAlt: '모아동 우체통 OPEN',
  to: '/feedback',
  onImageClick: (trackEvent) => {
    trackEvent(USER_EVENT.FEEDBACK_ENTRY_CLICKED, { source: 'main_popup' });
  },
};
