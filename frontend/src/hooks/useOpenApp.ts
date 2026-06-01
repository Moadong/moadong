import { useEffect, useRef, useState } from 'react';
import {
  APP_STORE_LINKS,
  detectPlatform,
  getAppStoreLink,
} from '@/utils/appStoreLink';

const ANDROID_PACKAGE = 'com.moadong.moadong';
const APP_HOST = 'www.moadong.com';
const IOS_SCHEME = 'moadongapp';
const STORE_FALLBACK_DELAY_MS = 2000;

/**
 * 일반 브라우저에서 앱을 연다. 앱이 설치돼 있으면 딥링크로 진입하고, 없으면 스토어로 보낸다.
 * (카카오 인앱브라우저 전용인 useOpenAppFromKakao와 달리 iOS 폴백이 스토어로 직접 이동한다.)
 */
const useOpenApp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const openApp = () => {
    const platform = detectPlatform();

    // 데스크톱 등: 앱이 없으니 스토어로 바로 이동
    if (platform === 'Other') {
      window.location.href = getAppStoreLink();
      return;
    }

    const url = new URL(window.location.href);
    const path = `${url.pathname}${url.search}${url.hash}`;

    if (platform === 'Android') {
      const fallback = encodeURIComponent(APP_STORE_LINKS.android);
      window.location.href =
        `intent://${APP_HOST}${path}` +
        `#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
      return;
    }

    // iOS: 커스텀 스킴 시도 → 앱이 열리지 않으면(=화면이 그대로면) 스토어로
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setIsLoading(true);
    window.location.href = `${IOS_SCHEME}://${path}`;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsLoading(false);
      if (!document.hidden) {
        window.location.href = APP_STORE_LINKS.iphone;
      }
    }, STORE_FALLBACK_DELAY_MS);

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

export default useOpenApp;
