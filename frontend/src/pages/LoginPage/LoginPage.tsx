import moadong_name_logo from '@/assets/images/logos/moadong_name_logo.svg';
import Header from '@/components/common/Header/Header';
import SocialLoginButton from '@/components/SocialLoginButton/SocialLoginButton';
import * as Styled from './LoginPage.styles';

const LoginPage = () => {
  return (
    <>
      <Header />
      <Styled.Wrapper>
        <Styled.Page>
          <Styled.TopSpacer />
          <Styled.LogoGroup>
            <Styled.Logo src={moadong_name_logo} alt='모아동 로고' />
            <Styled.Subtitle>부경대학교의 모든 동아리를 한눈에</Styled.Subtitle>
          </Styled.LogoGroup>
          <Styled.MiddleSpacer />
          <Styled.LoginBox>
            <Styled.TooltipWrapper>
              <Styled.TooltipPill>
                회원가입하면 더 다양한 기능을 이용할 수 있어요!
              </Styled.TooltipPill>
            </Styled.TooltipWrapper>
            <Styled.ButtonList>
              <SocialLoginButton provider='kakao' onClick={() => {}} />
              <SocialLoginButton provider='google' onClick={() => {}} />
              <SocialLoginButton provider='apple' onClick={() => {}} />
            </Styled.ButtonList>
            <Styled.SignUpText>관리자 로그인</Styled.SignUpText>
          </Styled.LoginBox>
        </Styled.Page>
      </Styled.Wrapper>
    </>
  );
};

export default LoginPage;
