import styled, { css } from 'styled-components';
import { colors } from '@/styles/theme/colors';

type LogoVariant = 'main' | 'card' | 'detail' | 'compact';

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
  // 동아리 카드용. 카드 글자 세 줄 높이에 맞춰 로고를 키운다
  card: {
    desktop: { width: '80px', height: '80px', radius: '18px' },
    mobile: { width: '64px', height: '64px', radius: '14px' },
  },
  // 메인 모집 마감 구간의 낮은 밀도 행용
  compact: {
    desktop: { width: '44px', height: '44px', radius: '10px' },
    mobile: { width: '40px', height: '40px', radius: '10px' },
  },
};

const StyledClubLogo = styled.div<{
  $variant: LogoVariant;
  $imageSrc?: string;
}>`
  ${({ $variant, $imageSrc }) => css`
    width: ${presets[$variant].desktop.width};
    height: ${presets[$variant].desktop.height};
    border-radius: ${presets[$variant].desktop.radius};
    background-color: ${colors.gray[250]};
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
