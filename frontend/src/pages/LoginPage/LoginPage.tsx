import { useNavigate } from 'react-router-dom';
import { fetchStudentOAuthUrl, type OAuthProvider } from '@/apis/studentAuth';
import moadong_name_logo from '@/assets/images/logos/moadong_name_logo.svg';
import Header from '@/components/common/Header/Header';
import SocialLoginButton from '@/components/SocialLoginButton/SocialLoginButton';
import { STUDENT_OAUTH_PROVIDER_KEY } from '@/pages/CallbackPage/StudentOAuthCallbackPage';
import * as Styled from './LoginPage.styles';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSocialLogin = async (provider: OAuthProvider) => {
    const redirectUrl = await fetchStudentOAuthUrl(provider);
    sessionStorage.setItem(STUDENT_OAUTH_PROVIDER_KEY, provider);
    window.location.href = redirectUrl;
  };

  const handleAdminLoginClick = () => navigate('/admin/login');

  return (
    <>
      <Header />
      <Styled.Wrapper>
        <Styled.Page>
          <Styled.LogoGroup>
            <Styled.Logo src={moadong_name_logo} alt='모아동 로고' />
            <Styled.Subtitle>부경대학교의 모든 동아리를 한눈에</Styled.Subtitle>
          </Styled.LogoGroup>
          <Styled.LoginBox>
            <Styled.TooltipWrapper>
              <Styled.TooltipPill>
                회원가입하면 더 다양한 기능을 이용할 수 있어요!
              </Styled.TooltipPill>
            </Styled.TooltipWrapper>
            <Styled.ButtonList>
              <SocialLoginButton
                provider='kakao'
                onClick={() => handleSocialLogin('kakao')}
              />
              <SocialLoginButton
                provider='google'
                onClick={() => handleSocialLogin('google')}
              />
              <SocialLoginButton provider='apple' onClick={() => {}} />
            </Styled.ButtonList>
            <Styled.AdminLoginButton onClick={handleAdminLoginClick}>
              관리자 로그인
            </Styled.AdminLoginButton>
          </Styled.LoginBox>
        </Styled.Page>
      </Styled.Wrapper>
    </>
  );
};

export default LoginPage;
