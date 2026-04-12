import isInAppWebView from './isInAppWebView';

// 타입 정의 (Discriminated Union)
export type WebViewMessage =
  | { type: 'NAVIGATE_BACK' }
  | {
      type: 'NOTIFICATION_SUBSCRIBE';
      payload: { clubId: string; clubName?: string };
    }
  | { type: 'NOTIFICATION_UNSUBSCRIBE'; payload: { clubId: string } }
  | {
      type: 'SHARE';
      payload: { title: string; text: string; url: string };
    };

export type WebViewMessageType = WebViewMessage['type'];

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

// 핵심 함수
const isDev = process.env.NODE_ENV === 'development';

export const postMessageToApp = (message: WebViewMessage): boolean => {
  if (!isInAppWebView()) {
    if (isDev) {
    }
    return false;
  }

  try {
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    if (isDev) {
    }
    return true;
  } catch (_error) {
    return false;
  }
};

// 액션 헬퍼 함수 (Facade 패턴)
export const requestNavigateBack = (): boolean => {
  return postMessageToApp({ type: 'NAVIGATE_BACK' });
};

export const requestNotificationSubscribe = (
  clubId: string,
  clubName?: string,
): boolean => {
  return postMessageToApp({
    type: 'NOTIFICATION_SUBSCRIBE',
    payload: { clubId, clubName },
  });
};

export const requestNotificationUnsubscribe = (clubId: string): boolean => {
  return postMessageToApp({
    type: 'NOTIFICATION_UNSUBSCRIBE',
    payload: { clubId },
  });
};

export const requestShare = (payload: {
  title: string;
  text: string;
  url: string;
}): boolean => {
  return postMessageToApp({
    type: 'SHARE',
    payload,
  });
};
