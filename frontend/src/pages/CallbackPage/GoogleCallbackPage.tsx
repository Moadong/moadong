import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeGoogleCode } from '@/apis/calendarOAuth';

const GOOGLE_STATE_KEY = 'admin_calendar_sync_google_state';
const GOOGLE_OAUTH_SUCCESS_KEY = 'admin_calendar_sync_google_oauth_success';
const GOOGLE_OAUTH_ERROR_KEY = 'admin_calendar_sync_google_oauth_error';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Google 인증 처리 중...');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const error = params.get('error');
      const expectedState = sessionStorage.getItem(GOOGLE_STATE_KEY);

      if (error) {
        sessionStorage.setItem(
          GOOGLE_OAUTH_ERROR_KEY,
          `Google OAuth 실패: ${error}`,
        );
        sessionStorage.removeItem(GOOGLE_STATE_KEY);
        navigate('/admin/calendar-sync', { replace: true });
        return;
      }

      if (!code || !state || !expectedState || state !== expectedState) {
        sessionStorage.setItem(
          GOOGLE_OAUTH_ERROR_KEY,
          'Google OAuth 인증 정보가 올바르지 않습니다.',
        );
        sessionStorage.removeItem(GOOGLE_STATE_KEY);
        navigate('/admin/calendar-sync', { replace: true });
        return;
      }

      try {
        setStatus('토큰 교환 중...');
        await exchangeGoogleCode(code);
        sessionStorage.setItem(GOOGLE_OAUTH_SUCCESS_KEY, 'true');
        sessionStorage.removeItem(GOOGLE_STATE_KEY);
        navigate('/admin/calendar-sync', { replace: true });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Google 인증에 실패했습니다. 다시 시도해주세요.';
        sessionStorage.setItem(GOOGLE_OAUTH_ERROR_KEY, message);
        sessionStorage.removeItem(GOOGLE_STATE_KEY);
        navigate('/admin/calendar-sync', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}
    >
      {status}
    </div>
  );
};

export default GoogleCallbackPage;
