import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const SearchBoxWrapper = styled.div`
  width: 100%;
  max-width: 345px;
  ${media.mobile} {
    max-width: 255px;
  }
`;
