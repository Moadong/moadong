import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Wrapper = styled.section`
  margin: 0;

  position: sticky;
  top: 120px;

  ${media.tablet} {
    position: static;
  }
`;

export const ImageContainer = styled.div<{ $expanded: boolean }>`
  position: relative;
  overflow: hidden;
  max-height: ${({ $expanded }) => ($expanded ? 'none' : '700px')};
`;

export const Image = styled.img`
  width: 100%;
  display: block;
  margin-bottom: 3px;
  border-radius: 20px;

  ${media.tablet} {
    border-radius: 0px;
    margin-bottom: 2px;
  }
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 180px;
  z-index: 1;

  pointer-events: none;

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.5) 60%,
    rgba(0, 0, 0, 0.8) 80%,
    rgba(0, 0, 0, 1) 100%
  );

  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 40%,
    rgba(255, 255, 255, 0.6) 70%,
    rgba(255, 255, 255, 1) 100%
  );
`;

export const ImageMoreButtonWrapper = styled.div`
  padding: 0px 0px 32px;

  ${media.mobile} {
    padding: 0 20px;
  }
`;
