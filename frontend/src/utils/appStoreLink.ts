export const APP_STORE_LINKS = {
  ios: 'itms-apps://itunes.apple.com/app/6755062085',
  android:
    'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
  default:
    'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
} as const;

export type Platform = 'iOS' | 'Android' | 'Other';

export const getAppStoreLink = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
    return APP_STORE_LINKS.ios;
  }
  if (/android/.test(userAgent)) {
    return APP_STORE_LINKS.android;
  }
  return APP_STORE_LINKS.default;
};

export const detectPlatform = (): Platform => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
    return 'iOS';
  }
  if (/android/.test(userAgent)) {
    return 'Android';
  }
  return 'Other';
};
