import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeStudentOAuthCode, type OAuthProvider } from '@/apis/studentAuth';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const STUDENT_OAUTH_PROVIDER_KEY = 'student_oauth_provider';

const VALID_PROVIDERS: OAuthProvider[] = ['kakao', 'google'];

const isOAuthProvider = (value: string | null): value is OAuthProvider =>
  VALID_PROVIDERS.includes(value as OAuthProvider);

const StudentOAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const provider = sessionStorage.getItem(STUDENT_OAUTH_PROVIDER_KEY);

      sessionStorage.removeItem(STUDENT_OAUTH_PROVIDER_KEY);

      if (!code || !isOAuthProvider(provider)) {
        navigate('/', { replace: true });
        return;
      }

      try {
        const { accessToken, isNewUser } = await exchangeStudentOAuthCode(
          provider,
          code,
        );

        localStorage.setItem(STORAGE_KEYS.STUDENT_LOGIN_ACCESS_TOKEN, accessToken);

        navigate(isNewUser ? '/profile/setup' : '/', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return null;
};

export default StudentOAuthCallbackPage;
