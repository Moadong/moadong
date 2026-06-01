import { useEffect, useState } from 'react';
import { AppToWebMessage, requestAppVersion } from '@/utils/webviewBridge';

// 앱(웹뷰)에서 앱 버전을 받아온다. 일반 브라우저에서는 응답이 없어 빈 문자열로 유지된다.
const useAppVersion = () => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: AppToWebMessage;
      try {
        data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (data.type === 'APP_VERSION') {
        setVersion(data.payload.version);
      }
    };

    window.addEventListener('message', handleMessage);
    requestAppVersion();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return version;
};

export default useAppVersion;
