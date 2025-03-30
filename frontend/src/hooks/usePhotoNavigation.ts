import { useEffect } from 'react';

const usePhotoNavigation = ({
  currentIndex,
  setCurrentIndex,
  photosLength,
  cardWidth,
  containerWidth,
  translateX,
  setTranslateX,
  isMobile,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  photosLength: number;
  cardWidth: number;
  containerWidth: number;
  translateX: number;
  setTranslateX: React.Dispatch<React.SetStateAction<number>>;
  isMobile: boolean;
}) => {
  useEffect(() => {
    if (currentIndex === photosLength - 1) {
      setTranslateX(containerWidth - cardWidth);
    } else {
      setTranslateX(-currentIndex * cardWidth);
    }
  }, [
    currentIndex,
    containerWidth,
    cardWidth,
    photosLength,
    setTranslateX,
    isMobile,
  ]);

  const isLastCard = currentIndex === photosLength - 1;
  const isLastCardPartiallyVisible =
    isLastCard &&
    containerWidth > 0 &&
    translateX > -(containerWidth - cardWidth);
  const isSecondLastCardAtStart =
    currentIndex === photosLength - 2 && translateX === 0;

  const canScrollLeft = currentIndex > 0 && photosLength > 2;
  const canScrollRight = isMobile
    ? currentIndex < photosLength - 1 && photosLength > 2
    : currentIndex < photosLength - 2 &&
      !isSecondLastCardAtStart &&
      photosLength > 2;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranslateX((prev) => prev + cardWidth);
    }
  };

  const handleNext = () => {
    if (currentIndex === photosLength - 2) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex >= photosLength) return;
    setCurrentIndex(nextIndex);

    if (nextIndex === photosLength - 1) {
      setTranslateX(containerWidth - cardWidth);
    } else {
      setTranslateX((prev) => prev - cardWidth);
    }
  };

  return {
    handlePrev,
    handleNext,
    isLastCard,
    isLastCardInMiddle: isLastCardPartiallyVisible,
    isSecondLastCardAtStart,
    canScrollLeft,
    canScrollRight,
  };
};

export default usePhotoNavigation;
