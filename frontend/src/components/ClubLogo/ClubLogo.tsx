import React from 'react';
import styled, { css } from 'styled-components';

type LogoVariant = 'main' | 'detail';

interface ClubLogoProps {
  imageSrc?: string;
  variant?: LogoVariant;
}

const presets = {
  main: {
    desktop: { width: '45px', height: '45px', radius: '6px' },
    mobile: { width: '36px', height: '35px', radius: '6px' },
  },
  detail: {
    desktop: { width: '80px', height: '80px', radius: '10px' },
    mobile: { width: '50px', height: '50px', radius: '6px' },
  },
};

const StyledClubLogo = styled.div<{ variant: LogoVariant; imageSrc?: string }>`
  ${({ variant, imageSrc }) => css`
    width: ${presets[variant].desktop.width};
    height: ${presets[variant].desktop.height};
    border-radius: ${presets[variant].desktop.radius};
    background-color: #efefef;
    background-size: cover;
    background-position: center;
    background-image: ${imageSrc ? `url(${imageSrc})` : 'none'};
  `}

  @media (max-width: 480px) {
    ${({ variant }) => css`
      width: ${presets[variant].mobile.width};
      height: ${presets[variant].mobile.height};
      border-radius: ${presets[variant].mobile.radius};
    `}
  }
`;

const ClubLogo = ({ imageSrc, variant = 'main' }: ClubLogoProps) => {
  return <StyledClubLogo imageSrc={imageSrc} variant={variant} />;
};

export default ClubLogo;
