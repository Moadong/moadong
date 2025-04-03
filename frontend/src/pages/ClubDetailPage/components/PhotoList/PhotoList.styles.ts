import styled from 'styled-components';

export const PhotoListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 34px;
  width: 100%;
  border-radius: 18px;
  border: 1px solid #dcdcdc;
  padding: 30px;
  gap: 30px;

  @media (max-width: 500px) {
    margin-top: 0;
    width: 100%;
    border: none;
    border-radius: 0;
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
  isLastCard: boolean;
  containerWidth: number;
  photoCount: number;
  cardWidth: number;
}>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  transition: transform 0.3s ease;

  transform: ${({
    translateX,
    isLastCard,
    containerWidth,
    photoCount,
    cardWidth,
  }) => {
    if (photoCount <= 2) return 'none';
    if (isLastCard) {
      const maxTranslate = containerWidth - cardWidth;
      return `translateX(${maxTranslate}px)`;
    }
    return `translateX(${translateX}px)`;
  }};
  cursor: ${({ photoCount }) => (photoCount > 2 ? 'grab' : 'default')};
  user-select: none;

  &:active {
    cursor: ${({ photoCount }) => (photoCount > 2 ? 'grabbing' : 'default')};
  }
`;

export const PhotoCard = styled.div<{
  photoCount: number;
  isPlaceholder?: boolean;
}>`
  flex-shrink: 0;
  border-radius: 18px;
  width: 400px;
  height: 400px;
  background-color: #cdcdcd;
  overflow: hidden;
  touch-action: none;

  visibility: ${({ isPlaceholder }) => (isPlaceholder ? 'hidden' : 'visible')};
  opacity: ${({ isPlaceholder }) => (isPlaceholder ? 0 : 1)};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  @media (max-width: 500px) {
    width: 300px;
    height: 300px;
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

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 500px) {
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
