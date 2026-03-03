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

export const Wrapper = styled.div`
    margin-top: 4px;
    padding: 0px 20px 66px; 20px;
`;
