import appleIcon from '@/assets/images/icons/sns/apple_icon.svg';
import googleIcon from '@/assets/images/icons/sns/google_icon.svg';
import kakaoIcon from '@/assets/images/icons/sns/kakao_icon.svg';
import type { Provider } from './SocialLoginButton.styles';
import * as Styled from './SocialLoginButton.styles';

interface SocialLoginButtonProps {
  provider: Provider;
  onClick: () => void;
}

const WRAPPER_WIDTH = 47.92;

const PROVIDER_CONFIG: Record<Provider, { icon: string; label: string }> = {
  kakao: { icon: kakaoIcon, label: '카카오로 로그인하기' },
  google: { icon: googleIcon, label: '구글로 로그인하기' },
  apple: { icon: appleIcon, label: 'Apple로 로그인하기' },
};

const SocialLoginButton = ({ provider, onClick }: SocialLoginButtonProps) => {
  const { icon, label } = PROVIDER_CONFIG[provider];

  return (
    <Styled.SocialButton $provider={provider} onClick={onClick}>
      <Styled.LogoWrapper $width={WRAPPER_WIDTH}>
        <img src={icon} alt='' />
      </Styled.LogoWrapper>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Spacer $width={WRAPPER_WIDTH} />
    </Styled.SocialButton>
  );
};

export default SocialLoginButton;
