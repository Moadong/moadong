import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

export const ButtonArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 10px 20px calc(20px + env(safe-area-inset-bottom));
  z-index: ${Z_INDEX.clubDetailFooter};
  display: flex;
  justify-content: center;

  button {
    width: 517px;
    height: 60px;
    border-radius: 10px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    font-weight: 700;
  }

  ${media.tablet} {
    left: 0;
    transform: none;

    button {
      width: 100%;
      height: 50px;
      ${setTypography(typography.paragraph.p2)};
    }
  }

  button:disabled {
    background-color: ${colors.gray[500]};
    color: ${colors.base.white};
    opacity: 1;
  }
`;
