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
      if (/^(javascript|data|vbscript):/i.test(trimmedUrl)) return;

      const inWebview = isInAppWebView();
      const isExternal = /^(https?|itms-apps):\/\//.test(trimmedUrl);

      if (isExternal) {
        if (inWebview && !requestOpenExternalUrl(trimmedUrl))
          window.open(trimmedUrl);
        else if (!inWebview) window.location.href = trimmedUrl;
        return;
      }

      navigate(trimmedUrl);
    },
    [navigate],
  );

  return handleLink;
};

export default useNavigator;
