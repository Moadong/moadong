import styled from 'styled-components';
import { BannerProps } from './Banner';
import { media } from '@/styles/mediaQuery';

export const BannerContainer = styled.div`
  padding: 0 40px;
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 90px;
  position: relative;

  ${media.mobile} {
    margin-top: 56px;
    padding: 0;
  }
`;

export const BannerWrapper = styled.div<BannerProps>`
  position: relative;
  width: 100%;
  max-width: 1180px;
  height: auto;
  aspect-ratio: 1180 / 316;
  border-radius: 26px;
  overflow: hidden;
  background-color: transparent;

  ${media.mobile} {
    width: 100%;
    aspect-ratio: 1.8;
    border-radius: 0;
  }
`;

export const BannerItem = styled.div<{ isClickable: boolean }>`
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
`;

export const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 2;
  pointer-events: none;
`;

export const SlideButton = styled.button`
  width: 60px;
  height: auto;
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  pointer-events: auto;

  img {
    width: 28px;
    height: auto;
    object-fit: cover;
  }

  ${media.tablet} {
    padding: 6px 12px;
  }

  ${media.mobile} {
    display: none;
  }
`;
