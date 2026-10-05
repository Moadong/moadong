import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';
import { media } from '@/styles/mediaQuery';
import { setTypography, typography } from '@/styles/theme/typography';

type Provider = 'kakao' | 'google' | 'apple';

const providerStyles: Record<Provider, ReturnType<typeof css>> = {
  kakao: css`
    background-color: ${colors.social.kakao};
    color: ${colors.gray[950]};
    border: none;
  `,
  google: css`
    background-color: ${colors.base.white};
    color: ${colors.gray[900]};
    border: 1px solid ${colors.gray[400]};
  `,
  apple: css`
    background-color: ${colors.base.black};
    color: ${colors.base.white};
    border: none;
  `,
};

export const Button = styled.button<{ $provider: Provider }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  ${setTypography(typography.etc.semibold15)}
  cursor: pointer;
  outline: none;
  padding: 0 24px;

  ${media.mobile} {
    justify-content: flex-start;
    gap: 0;
    padding: 0;
  }

  ${({ $provider }) => providerStyles[$provider]}

  &:active {
    opacity: 0.85;
  }
`;

export const LogoWrapper = styled.span<{ $width: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${media.mobile} {
    width: ${({ $width }) => $width}px;
  }
`;

export const Label = styled.span`
  text-align: left;

  ${media.mobile} {
    flex: 1;
    text-align: center;
  }
`;

export const Spacer = styled.span<{ $width: number }>`
  display: none;

  ${media.mobile} {
    display: block;
    width: ${({ $width }) => $width}px;
    flex-shrink: 0;
  }
`;
