import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const Container = styled.div`
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  padding-top: 24px;

  ${media.mobile} {
    padding-top: 0;
  }
`;

export const SectionTitle = styled.h2`
  margin: 16px 20px 12px;
  font-size: 16px;
  font-weight: 700;
  color: #3a3a3a;
`;

export const SliderWrapper = styled.div`
  padding: 0;
  width: 100%;
  .swiper {
    width: 100%;
  }
`;

export const MapFrame = styled.article<{ $backgroundColor: string }>`
  position: relative;
  width: 100%;
  max-width: 500px;
  aspect-ratio: 500 / 522;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0 0 20px 20px;
  background: ${({ $backgroundColor }) => $backgroundColor};
`;

export const SideBar = styled.div<{
  $side: 'left' | 'right';
  $top: string;
  $height: string;
  $color: string;
}>`
  position: absolute;
  ${({ $side }) =>
    $side === 'left' ? 'left: 0; width: 7.733%;' : 'right: 0; width: 7.467%;'}
  top: ${({ $top }) => $top};
  height: ${({ $height }) => $height};
  background: ${({ $color }) => $color};
  border-radius: ${({ $side }) =>
    $side === 'left' ? '0 10px 10px 0' : '10px 0 0 10px'};
`;

export const SideLabel = styled.span<{
  $x: string;
  $y: string;
  $rotation: number;
}>`
  position: absolute;
  left: ${({ $x }) => $x};
  top: ${({ $y }) => $y};
  color: #787878;
  font-size: 15px;
  font-weight: 600;
  line-height: 17.667px;
  text-align: center;
  transform: ${({ $rotation }) =>
    `translate(-50%, -50%) rotate(${$rotation}deg)`};
  transform-origin: center;
  font-family: 'Paperlogy', 'Pretendard', sans-serif;
  white-space: nowrap;
`;

export const Booth = styled.div`
  position: absolute;
  border-radius: 10px;
  background: #ffffff;
  color: #4b4b4b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 6px;
`;

export const DotPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#ff5414' : '#dcdcdc')};

  &:focus-visible {
    outline: 2px solid #ff5414;
    outline-offset: 2px;
  }
`;

export const SlideCounter = styled.div`
  width: fit-content;
  min-width: 76px;
  width: 62.7px;
  padding: 10px;
  margin: 20px auto 0;
  border-radius: 999px;
  background: #e5e5e5;
  color: #454545;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
`;
