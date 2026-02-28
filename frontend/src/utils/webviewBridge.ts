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
      console.log('[WebViewBridge] 웹 환경, 메시지 무시:', message.type);
    }
    return false;
  }

  try {
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
    if (isDev) {
      console.log('[WebViewBridge] 앱으로 전송:', message.type);
    }
    return true;
  } catch (error) {
    console.error('[WebViewBridge] 전송 실패:', error);
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
