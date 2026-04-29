import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const MapArea = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const InfoCardWrapper = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  ${media.tablet} {
    bottom: 30px;
  }
`;
