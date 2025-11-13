import styled from 'styled-components';
import { media } from '@/styles/mediaQuery';

export const PhotoListTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
`;

export const PhotoListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  width: 100%;
  border-radius: 18px;
  border: 1px solid #dcdcdc;
  padding: 30px;
  gap: 30px;
  margin-bottom: 60px;

  ${media.mobile} {
    margin-top: 0;
    width: 100%;
    border: none;
    border-radius: 0;
    padding: 20px;
  }
`;

export const PhotoListWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
`;

export const PhotoList = styled.div<{
  translateX: number;
  photoCount: number;
}>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  transition: transform 0.3s ease;

  transform: ${({ translateX, photoCount }) =>
    photoCount <= 2 ? 'none' : `translateX(${translateX}px)`};

  user-select: none;

  ${media.mobile} {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    transform: none;
  }
`;

export const PhotoCard = styled.div`
  flex-shrink: 0;
  border-radius: 18px;
  width: 400px;
  height: 400px;
  background-color: #cdcdcd;
  overflow: hidden;
  touch-action: none;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  ${media.mobile} {
    width: 100%;
    aspect-ratio: 1 / 1;
    height: auto;
    min-width: 0;
    min-height: 0;
    border-radius: 8px;
  }
`;

export const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ direction }) => (direction === 'left' ? 'left: 10px;' : 'right: 10px;')}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  ${media.mobile} {
    width: 30px;
    height: 30px;
    font-size: 15px;
    ${({ direction }) => (direction === 'left' ? 'left: 5px;' : 'right: 5px;')}
  }
`;

export const NoImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #666;
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
`;
