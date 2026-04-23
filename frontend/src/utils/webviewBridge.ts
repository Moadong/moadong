import isInAppWebView from './isInAppWebView';

// 웹 → 앱 방향 메시지 타입
// postMessageToApp()으로 전송하며, 앱이 수신 후 처리
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
    }
  | { type: 'SUBSCRIBE_TOGGLE'; payload: { clubId: string } }
  | { type: 'REQUEST_SUBSCRIBE_STATE' }
  | { type: 'NAVIGATE_WEBVIEW'; payload: { slug: string } }
  | { type: 'OPEN_EXTERNAL_URL'; payload: { url: string } };

// 앱 → 웹 방향 메시지 타입
// 앱이 window.postMessage()로 전송하며, 웹이 message 이벤트로 수신
export type AppToWebMessage =
  | { type: 'SUBSCRIBE_STATE'; payload: { subscribedClubIds: string[] } }
  | {
      type: 'SUBSCRIBE_RESULT';
      payload: {
        clubId: string;
        subscribed: boolean;
        needsPermission: boolean;
      };
    };

// WebViewMessage의 type 문자열 유니온 (앱 측 타입 공유용)
export type WebViewMessageType = WebViewMessage['type'];

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const isDev = process.env.NODE_ENV === 'development';

// 웹뷰 브릿지 코어 함수 — 앱 환경이 아니면 무시하고 false 반환
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

// 앱의 네이티브 뒤로가기를 요청
// 언제: 웹뷰 내 TopBar의 뒤로가기 버튼. history.back()은 WebView 스택을 제어 못 하므로 항상 브릿지 우선,
//       반환값이 false(웹 환경)일 때만 navigate(-1) 폴백
export const requestNavigateBack = (): boolean => {
  return postMessageToApp({ type: 'NAVIGATE_BACK' });
};

// 특정 동아리 푸시 알림 구독 요청
// 언제: 앱 웹뷰 전용 — 알림 권한·토큰 관리는 앱이 담당하므로 브릿지로만 처리
export const requestNotificationSubscribe = (
  clubId: string,
  clubName?: string,
): boolean => {
  return postMessageToApp({
    type: 'NOTIFICATION_SUBSCRIBE',
    payload: { clubId, clubName },
  });
};

// 특정 동아리 푸시 알림 구독 해제 요청
// 언제: 앱 웹뷰 전용 — subscribe와 쌍으로 사용
export const requestNotificationUnsubscribe = (clubId: string): boolean => {
  return postMessageToApp({
    type: 'NOTIFICATION_UNSUBSCRIBE',
    payload: { clubId },
  });
};

// 앱 네이티브 공유 시트 호출
// 언제: 앱 웹뷰 환경에서 공유 버튼 클릭 시. 웹에서는 navigator.share() 또는 클립보드 복사로 폴백
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

// 특정 동아리 구독 토글 요청 — 결과는 SUBSCRIBE_RESULT 메시지로 수신
// 언제: 앱 웹뷰 전용 — 구독 상태는 앱이 관리하므로 브릿지로만 처리. 웹에는 구독 기능 없음
export const requestSubscribeToggle = (clubId: string): boolean => {
  return postMessageToApp({ type: 'SUBSCRIBE_TOGGLE', payload: { clubId } });
};

// 앱이 보유한 전체 구독 목록 요청 — 결과는 SUBSCRIBE_STATE 메시지로 수신
// 언제: 웹뷰 마운트 시 1회 호출해 초기 구독 상태를 동기화. useWebviewSubscribe 내부에서 자동 처리됨
export const requestSubscribeState = (): boolean => {
  return postMessageToApp({ type: 'REQUEST_SUBSCRIBE_STATE' });
};

// 앱 내 다른 웹뷰 화면으로 이동 요청 (slug로 앱이 라우팅 결정)
// 언제: 배너 등에서 앱 내부 특정 화면(예: 'festival-introduction')으로 이동할 때.
//       외부 URL이면 requestOpenExternalUrl 사용
export const requestNavigateWebview = (slug: string): boolean => {
  return postMessageToApp({ type: 'NAVIGATE_WEBVIEW', payload: { slug } });
};

// 외부 URL을 앱 브라우저로 열기 요청
// 언제: 앱 웹뷰에서 외부 링크(http/https) 클릭 시. 웹뷰 내에서 직접 열면 뒤로가기가 깨지므로 앱에 위임.
//       웹 환경에서는 window.open() 또는 <a target="_blank"> 사용
export const requestOpenExternalUrl = (url: string): boolean => {
  return postMessageToApp({ type: 'OPEN_EXTERNAL_URL', payload: { url } });
};
