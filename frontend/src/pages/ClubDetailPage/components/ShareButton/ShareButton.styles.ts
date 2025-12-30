import { media } from '@/styles/mediaQuery';
import styled from 'styled-components';

export const ShareButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

export const ShareButtonIcon = styled.img`
  width: 60px;
  height: 60px;

  ${media.mobile} {
    width: 44px;
    height: 44px;
  }
`;