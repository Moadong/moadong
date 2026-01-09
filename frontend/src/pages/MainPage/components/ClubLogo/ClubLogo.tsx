import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

type LogoVariant = 'main' | 'detail';

interface ClubLogoProps {
  $imageSrc?: string;
  $variant?: LogoVariant;
}

const presets = {
  main: {
    desktop: { width: '66px', height: '66px', radius: '14px' },
    mobile: { width: '50px', height: '50px', radius: '10px' },
  },
  detail: {
    desktop: { width: '80px', height: '80px', radius: '10px' },
    mobile: { width: '50px', height: '50px', radius: '6px' },
  },
};

const StyledClubLogo = styled.div<{
  $variant: LogoVariant;
  $imageSrc?: string;
}>`
  ${({ $variant, $imageSrc }) => css`
    width: ${presets[$variant].desktop.width};
    height: ${presets[$variant].desktop.height};
    border: 0.5px solid ${colors.gray[400]};
    border-radius: ${presets[$variant].desktop.radius};
    background-color: ${colors.base.white};
    background-size: cover;
    background-position: center;
    background-image: ${$imageSrc ? `url("${$imageSrc}")` : 'none'};
  `}

  @media (max-width: 500px) {
    ${({ $variant }) => css`
      width: ${presets[$variant].mobile.width};
      height: ${presets[$variant].mobile.height};
      border-radius: ${presets[$variant].mobile.radius};
    `}
  }
`;

const ClubLogo = ({ $imageSrc, $variant = 'main' }: ClubLogoProps) => {
  return <StyledClubLogo $imageSrc={$imageSrc} $variant={$variant} />;
};

export default ClubLogo;
