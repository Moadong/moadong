import { useEffect, useRef, useState } from 'react';
import { APP_STORE_LINKS, detectPlatform } from '@/utils/appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';
const APP_HOST = 'www.moadong.com';
const IOS_SCHEME = 'moadongapp';

const useOpenAppFromKakao = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

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

    if (timerRef.current !== null) clearTimeout(timerRef.current);

    setIsLoading(true);

    const url = new URL(currentUrl);
    window.location.href = `${IOS_SCHEME}://${url.pathname}${url.search}${url.hash}`;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsLoading(false);
      if (!document.hidden) {
        window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(APP_STORE_LINKS.iphone)}`;
      }
    }, 2000);
    // 2초 딜레이를 주는 이유는 앱 다운로드 페이지가 로드되는 시간을 주기 위함

    document.addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden && timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          setIsLoading(false);
        }
      },
      { once: true },
    );
  };

  return { openApp, isLoading };
};

export default useOpenAppFromKakao;
