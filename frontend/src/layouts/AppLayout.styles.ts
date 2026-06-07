import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Content = styled.div`
  ${media.tablet} {
    padding-bottom: calc(56px + env(safe-area-inset-bottom));
  }
`;
