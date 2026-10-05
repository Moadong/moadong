import styled from 'styled-components';
import Button from '@/components/common/Button/Button';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';
import { setTypography, typography } from '@/styles/theme/typography';

export type Provider = 'kakao' | 'google' | 'apple';

const PROVIDER_BG: Record<Provider, string> = {
  kakao: colors.social.kakao,
  google: colors.base.white,
  apple: colors.base.black,
};

const PROVIDER_COLOR: Record<Provider, string> = {
  kakao: colors.gray[950],
  google: colors.gray[900],
  apple: colors.base.white,
};

const PROVIDER_BORDER: Record<Provider, string> = {
  kakao: 'none',
  google: `1px solid ${colors.gray[400]}`,
  apple: 'none',
};

export const SocialButton = styled(Button)<{ $provider: Provider }>`
  display: flex;
  width: 100%;
  height: 48px;
  border-radius: 12px;
  padding: 0 24px;
  gap: 8px;
  ${setTypography(typography.etc.semibold15)}
  font-family: 'Inter', sans-serif;
  background-color: ${({ $provider }) => PROVIDER_BG[$provider]};
  color: ${({ $provider }) => PROVIDER_COLOR[$provider]};
  border: ${({ $provider }) => PROVIDER_BORDER[$provider]};

  &:hover:not(:disabled) {
    background-color: ${({ $provider }) => PROVIDER_BG[$provider]};
  }

  ${media.tablet} {
    justify-content: flex-start;
    gap: 0;
    padding: 0;
  }
`;

export const LogoWrapper = styled.span<{ $width: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${media.tablet} {
    width: ${({ $width }) => $width}px;
  }
`;

export const Label = styled.span`
  text-align: left;

  ${media.tablet} {
    flex: 1;
    text-align: center;
  }
`;

export const Spacer = styled.span<{ $width: number }>`
  display: none;

  ${media.tablet} {
    display: block;
    width: ${({ $width }) => $width}px;
    flex-shrink: 0;
  }
`;
