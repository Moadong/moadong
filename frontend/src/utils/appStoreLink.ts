export const APP_STORE_LINKS = {
  iphone: 'https://apps.apple.com/app/id6755062085',
  apple: 'itms-apps://itunes.apple.com/app/6755062085',
  android:
    'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
  default:
    'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
} as const;

export type Platform = 'iOS' | 'Android' | 'Other';

export const getAppStoreLink = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();

  // iPhone은 웹뷰 대응을 위해 HTTPS 링크 사용
  if (/iphone/.test(userAgent)) {
    return APP_STORE_LINKS.iphone;
  }
  // iPad, iPod, Mac은 itms-apps 딥링크 사용
  if (/ipad|ipod|macintosh/.test(userAgent)) {
    return APP_STORE_LINKS.apple;
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
