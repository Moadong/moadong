import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { setTypography, typography } from '@/styles/theme/typography';
import { Z_INDEX } from '@/styles/zIndex';

export const ButtonArea = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 10px 0 24px;
  z-index: ${Z_INDEX.clubDetailFooter};
  background: ${colors.base.white};
  box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.16);

  button {
    width: 517px;
    height: 60px;
    border-radius: 14px;
    font-size: 20px;
    font-weight: 700;
  }

  ${media.tablet} {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 500px;
    padding: 10px 20px calc(20px + env(safe-area-inset-bottom));
    background: transparent;
    box-shadow: none;

    button {
      width: 100%;
      height: 50px;
      ${setTypography(typography.paragraph.p2)};
    }
  }

  ${media.mobile} {
    left: 0;
    transform: none;
    max-width: 100%;
  }

  button:disabled {
    background-color: ${colors.gray[500]};
    color: ${colors.base.white};
    opacity: 1;
  }
`;
