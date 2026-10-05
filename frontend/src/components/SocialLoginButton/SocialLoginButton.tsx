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

const PROVIDER_CONFIG: Record<
  Provider,
  { icon: string; alt: string; label: string }
> = {
  kakao: { icon: kakaoIcon, alt: '카카오', label: '카카오로 로그인하기' },
  google: { icon: googleIcon, alt: '구글', label: '구글로 로그인하기' },
  apple: { icon: appleIcon, alt: 'Apple', label: 'Apple로 로그인하기' },
};

const SocialLoginButton = ({ provider, onClick }: SocialLoginButtonProps) => {
  const { icon, alt, label } = PROVIDER_CONFIG[provider];

  return (
    <Styled.SocialButton $provider={provider} onClick={onClick}>
      <Styled.LogoWrapper $width={WRAPPER_WIDTH}>
        <img src={icon} alt={alt} />
      </Styled.LogoWrapper>
      <Styled.Label>{label}</Styled.Label>
      <Styled.Spacer $width={WRAPPER_WIDTH} />
    </Styled.SocialButton>
  );
};

export default SocialLoginButton;
