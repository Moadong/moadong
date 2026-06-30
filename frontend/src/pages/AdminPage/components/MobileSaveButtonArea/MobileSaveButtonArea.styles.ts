import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { colors } from '@/styles/theme/colors';
import { Z_INDEX } from '@/styles/zIndex';

export const SaveButtonArea = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  padding: 10px 24px calc(20px + env(safe-area-inset-bottom));
  background: ${colors.base.white};
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
  z-index: ${Z_INDEX.clubDetailFooter};

  ${media.mobile} {
    left: 0;
    transform: none;
    max-width: 100%;
  }

  button {
    width: 100%;
    height: 50px;
    border-radius: 10px;
  }

  button:disabled {
    background-color: ${colors.gray[500]};
    color: ${colors.base.white};
    opacity: 1;
  }
`;
