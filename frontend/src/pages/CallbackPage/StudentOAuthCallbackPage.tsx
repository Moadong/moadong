import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  exchangeStudentOAuthCode,
  type OAuthProvider,
} from '@/apis/studentAuth';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const VALID_PROVIDERS: OAuthProvider[] = ['kakao', 'google'];

const isOAuthProvider = (value: string | null): value is OAuthProvider =>
  VALID_PROVIDERS.includes(value as OAuthProvider);

const StudentOAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('로그인 처리 중...');

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');

      if (error) {
        setStatus('로그인이 취소됐어요.');
        navigate('/login', { replace: true });
        return;
      }

      const code = params.get('code');
      const state = params.get('state');
      const provider = sessionStorage.getItem(
        STORAGE_KEYS.STUDENT_OAUTH_PROVIDER,
      );
      const savedState = sessionStorage.getItem(
        STORAGE_KEYS.STUDENT_OAUTH_STATE,
      );

      sessionStorage.removeItem(STORAGE_KEYS.STUDENT_OAUTH_PROVIDER);
      sessionStorage.removeItem(STORAGE_KEYS.STUDENT_OAUTH_STATE);

      if (
        !code ||
        !isOAuthProvider(provider) ||
        !state ||
        state !== savedState
      ) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        const { accessToken, isNewUser } = await exchangeStudentOAuthCode(
          provider,
          code,
        );

        localStorage.setItem(
          STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN,
          accessToken,
        );

        navigate(isNewUser ? '/profile/setup' : '/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
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

export default StudentOAuthCallbackPage;
