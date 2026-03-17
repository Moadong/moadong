import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-top: 92px;

  ${media.mobile} {
    padding-top: 0;
  }
`;

export const Wrapper = styled.div`
  margin-top: 16px;
  padding: 0px 50px 90px;

  @media (max-width: 955px) {
    padding: 0px 36px 90px;
  }
  ${media.mini_mobile} {
    padding: 0px 20px 90px;
  }
`;
