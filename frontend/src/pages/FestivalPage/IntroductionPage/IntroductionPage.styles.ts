import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding-top: 24px;

  ${media.mobile} {
    padding-top: 0;
  }
`;
