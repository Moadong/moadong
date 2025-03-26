const usePhotoNavigation = ({
  currentIndex,
  setCurrentIndex,
  photosLength,
  cardWidth,
  containerWidth,
  translateX,
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
  const isLastCard = currentIndex === photosLength - 1;
  const isLastCardInMiddle =
    isLastCard && containerWidth > 0 && translateX > -(containerWidth - 400);
  const isSecondLastCardAtStart =
    currentIndex === photosLength - 2 && translateX === 0;

  const canScrollLeft = currentIndex > 0 && photosLength > 2;
  const canScrollRight =
    currentIndex < photosLength - 1 &&
    !isLastCardInMiddle &&
    !isSecondLastCardAtStart &&
    currentIndex < photosLength - 2 &&
    photosLength > 2;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTranslateX((prev) => prev + cardWidth);
    }
  };

  const handleNext = () => {
    if (
      currentIndex < photosLength - 1 &&
      !isLastCardInMiddle &&
      !isSecondLastCardAtStart
    ) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (nextIndex === photosLength - 1) {
        setTranslateX(containerWidth - 400);
      } else {
        setTranslateX((prev) => prev - cardWidth);
      }
    }
  };

  return {
    handlePrev,
    handleNext,
    isLastCard,
    isLastCardInMiddle,
    isSecondLastCardAtStart,
    canScrollLeft,
    canScrollRight,
  };
};

export default usePhotoNavigation;
