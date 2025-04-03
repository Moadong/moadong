import { useCallback, useEffect } from 'react';

const usePhotoNavigation = ({
  currentIndex,
  setCurrentIndex,
  photosLength,
  cardWidth,
  containerWidth,
  setTranslateX,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  photosLength: number;
  cardWidth: number;
  containerWidth: number;
  translateX: number;
  setTranslateX: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const calculateTranslateX = useCallback(
    (index: number) => {
      return index === photosLength - 1
        ? containerWidth - cardWidth
        : -index * cardWidth;
    },
    [photosLength, cardWidth, containerWidth],
  );

  useEffect(() => {
    setTranslateX(calculateTranslateX(currentIndex));
  }, [currentIndex, containerWidth, cardWidth, photosLength]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= photosLength) return;
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const isLastCard = currentIndex === photosLength - 1;
  const canScrollLeft = currentIndex > 0 && photosLength > 2;
  const canScrollRight = photosLength > 2 && currentIndex < photosLength - 2;

  return {
    handlePrev,
    handleNext,
    isLastCard,
    canScrollLeft,
    canScrollRight,
  };
};

export default usePhotoNavigation;
