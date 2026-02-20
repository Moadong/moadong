import { useState } from 'react';
import { APP_STORE_LINKS, detectPlatform } from '@/utils/appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';
const APP_HOST = 'www.moadong.com';
const IOS_SCHEME = 'moadongapp';

const useOpenAppFromKakao = () => {
  const [isLoading, setIsLoading] = useState(false);

  const openApp = () => {
    const platform = detectPlatform();
    const currentUrl = window.location.href;

    if (platform === 'Android') {
      const url = new URL(currentUrl);
      const fallback = encodeURIComponent(APP_STORE_LINKS.android);
      const intentUrl =
        `intent://${APP_HOST}${url.pathname}${url.search}${url.hash}` +
        `#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
      window.location.href = intentUrl;
      return;
    }

    setIsLoading(true);

    const url = new URL(currentUrl);
    window.location.href = `${IOS_SCHEME}://${url.pathname}${url.search}${url.hash}`;

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!document.hidden) {
        window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(APP_STORE_LINKS.iphone)}`;
      }
    }, 2000);

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          clearTimeout(timer);
          setIsLoading(false);
        }
      },
      { once: true },
    );
  };

  return { openApp, isLoading };
};

export default useOpenAppFromKakao;
