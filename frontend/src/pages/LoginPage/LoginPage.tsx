import { useNavigate } from 'react-router-dom';
import { getStudentOAuthUrl, type OAuthProvider } from '@/apis/studentAuth';
import moadong_name_logo from '@/assets/images/logos/moadong_name_logo.svg';
import Header from '@/components/common/Header/Header';
import SocialLoginButton from '@/components/SocialLoginButton/SocialLoginButton';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import * as Styled from './LoginPage.styles';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSocialLogin = (provider: OAuthProvider) => {
    sessionStorage.setItem(STORAGE_KEYS.STUDENT_OAUTH_PROVIDER, provider);
    window.location.href = getStudentOAuthUrl(provider);
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
              {/* Apple 로그인 미구현 - 추후 활성화
              <SocialLoginButton provider='apple' onClick={() => {}} />
              */}
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
