import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PageContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.mobile} {
    padding: 0 20px;
  }

  ${media.mini_mobile} {
    padding: 0 10px;
  }
`;
