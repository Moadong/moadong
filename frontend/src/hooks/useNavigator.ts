import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import isInAppWebView from '@/utils/isInAppWebView';
import { requestOpenExternalUrl } from '@/utils/webviewBridge';

const useNavigator = () => {
  const navigate = useNavigate();

  const handleLink = useCallback(
    (url: string) => {
      const trimmedUrl = url?.trim();
      if (!trimmedUrl) return;

      const isDangerousProtocol = /^(javascript|data|vbscript):/i.test(
        trimmedUrl,
      );
      if (isDangerousProtocol) return;

      const isExternalUrl = /^(https?|itms-apps):\/\//.test(trimmedUrl);

      if (isExternalUrl) {
        // 웹뷰에서 window.location.href로 외부 URL을 열면 WebView 자체가 이동해버리므로 앱에 위임
        if (isInAppWebView()) {
          requestOpenExternalUrl(trimmedUrl);
        } else {
          window.location.href = trimmedUrl;
        }
      } else {
        navigate(trimmedUrl);
      }
    },
    [navigate],
  );

  return handleLink;
};

export default useNavigator;
