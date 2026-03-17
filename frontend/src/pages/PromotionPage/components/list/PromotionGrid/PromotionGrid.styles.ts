import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Grid = styled.div`
  display: grid;
  gap: 14px;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  ${media.laptop} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 955px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  ${media.mobile} {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  ${media.mini_mobile} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 7px;
  }
`;
