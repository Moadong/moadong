import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Grid = styled.div`
  display: grid;
  gap: 14px;
  justify-items: center;

  grid-template-columns: repeat(2, 1fr);

  ${media.mobile} {
    gap: 7px;
  }
`;
