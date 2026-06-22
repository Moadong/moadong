import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';
import { Z_INDEX } from '@/styles/zIndex';

export const ClubDetailFooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: ${Z_INDEX.clubDetailFooter};
  width: 100%;
  padding: 10px 0px 24px 0px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  background-color: white;
  border-top: 1px solid #cdcdcd;

  ${media.tablet} {
    position: fixed;
    left: 0;
    right: 0;
    padding: 10px 0px calc(24px + env(safe-area-inset-bottom)) 0px;
  }

  ${media.mobile} {
    padding: 10px 0px calc(16px + env(safe-area-inset-bottom)) 0px;
  }
`;
