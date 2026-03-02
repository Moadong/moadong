import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const BannerContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 88px;
  position: relative;

  ${media.laptop} {
    padding: 0 20px;
  }

  ${media.mobile} {
    margin-top: 0px;
    padding: 0;
  }
`;

export const BannerWrapper = styled.div`
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

export const NumericPagination = styled.div`
  position: absolute;
  bottom: 17px;
  right: -10px;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 3px 12px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: medium;
  z-index: 3;
`;

export const DotPagination = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  z-index: 3;
`;

export const Dot = styled.div<{ active: boolean }>`
  width: 8px;
  height: 8px;
  background-color: ${(props) => (props.active ? '#ff5414' : '#f5f5f5')};
  border-radius: 50%;
  transition: background-color 0.3s ease;
`;
