import styled from 'styled-components';
import { BannerProps } from './Banner';

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

  @media (max-width: 500px) {
    margin-top: 42px;
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
  ${({ backgroundImage }) =>
    backgroundImage &&
    `
    background-image: url(${backgroundImage});
    background-size: cover;
    background-position: center;
    `}

  @media (max-width: 500px) {
    width: 100vw;
    height: 250px;
    border-radius: 0;
  }
`;

export const SlideWrapper = styled.div<{ isAnimating: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  ${({ isAnimating }) =>
    isAnimating
      ? 'transition: transform 0.5s ease-in-out;'
      : 'transition: none;'}
`;

export const BannerItem = styled.div`
  flex: none;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 1;
`;

export const SlideButton = styled.button`
  width: 60px;
  height: auto;
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  @media (max-width: 698px) {
    width: 35px;
    padding: 6px 12px;
  }

  @media (max-width: 500px) {
    display: none;
  }
`;
