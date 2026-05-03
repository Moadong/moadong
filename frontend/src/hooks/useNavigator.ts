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
        // 웹뷰에서 window.location.href로 외부 URL을 열면 WebView 자체가 이동해버리므로 앱에 위임.
        // requestOpenExternalUrl은 http/https만 허용하므로, itms-apps:// 등 비표준 스킴은 false를
        // 반환 → window.open으로 폴백해 OS가 처리하도록 위임
        if (isInAppWebView()) {
          if (!requestOpenExternalUrl(trimmedUrl)) {
            window.open(trimmedUrl);
          }
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
