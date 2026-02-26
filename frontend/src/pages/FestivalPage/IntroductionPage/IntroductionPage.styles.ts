import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding: 24px 20px 0;

  ${media.mobile} {
    padding: 0 20px;
  }
`;
