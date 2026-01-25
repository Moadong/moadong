import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/apis/auth';
import moadong_name_logo from '@/assets/images/logos/moadong_name_logo.svg';
import Button from '@/components/common/Button/Button';
import Header from '@/components/common/Header/Header';
import InputField from '@/components/common/InputField/InputField';
import { ADMIN_EVENT, PAGE_VIEW } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import useAuth from '@/hooks/useAuth';
import * as Styled from './LoginTab.styles';

const LoginTab = () => {
  useTrackPageView(PAGE_VIEW.LOGIN_PAGE);
  const trackEvent = useMixpanelTrack();

  const [userId, setUserId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { accessToken } = await login(userId, password);
      localStorage.setItem('accessToken', accessToken);
      alert('로그인 성공! 관리자 페이지로 이동합니다.');
      navigate('/admin');
    } catch (error: unknown) {
      console.error('로그인 실패:', error);
      let errorMessage =
        '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
    trackEvent(ADMIN_EVENT.LOGIN_BUTTON_CLICKED);
  };

  if (authLoading) return <div>로딩 중...</div>;

  return (
    <>
      <Header />
      <Styled.LoginContainer>
        <Styled.LoginBox>
          <Styled.Logo src={moadong_name_logo} alt='Moadong Logo' />
          <Styled.Title>Log in</Styled.Title>
          <Styled.LoginForm
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Styled.InputFieldsContainer>
              <InputField
                type='text'
                placeholder='아이디'
                showClearButton={false}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <InputField
                type='password'
                placeholder='비밀번호'
                showClearButton={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Styled.InputFieldsContainer>

            <Styled.ButtonWrapper>
              <Button width='100%' type='submit'>
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Styled.ButtonWrapper>
          </Styled.LoginForm>

          <Styled.ForgotLinks>
            <Styled.LinkButton
              type='button'
              onClick={() => {
                trackEvent(ADMIN_EVENT.SIGNUP_BUTTON_CLICKED);
                alert(
                  '해당 기능은 아직 준비 중이에요.\n필요하신 경우 관리자에게 문의해주세요☺',
                );
              }}
            >
              회원가입
            </Styled.LinkButton>
            <span>|</span>
            <Styled.LinkButton
              type='button'
              onClick={() => {
                trackEvent(ADMIN_EVENT.FORGOT_ID_BUTTON_CLICKED);
                alert(
                  '해당 기능은 아직 준비 중이에요.\n필요하신 경우 관리자에게 문의해주세요☺',
                );
              }}
            >
              아이디 찾기
            </Styled.LinkButton>
            <span>|</span>
            <Styled.LinkButton
              type='button'
              onClick={() => {
                trackEvent(ADMIN_EVENT.FORGOT_PASSWORD_BUTTON_CLICKED);
                alert(
                  '해당 기능은 아직 준비 중이에요.\n필요하신 경우 관리자에게 문의해주세요☺',
                );
              }}
            >
              비밀번호 찾기
            </Styled.LinkButton>
          </Styled.ForgotLinks>
        </Styled.LoginBox>
      </Styled.LoginContainer>
    </>
  );
};

export default LoginTab;
