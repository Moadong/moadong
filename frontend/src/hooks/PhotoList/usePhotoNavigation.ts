import { useCallback, useEffect } from 'react';
import useMixpanelTrack from '../useMixpanelTrack';

export const usePhotoNavigation = ({
  currentIndex,
  setCurrentIndex,
  photosLength,
  cardWidth,
  containerWidth,
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
  const trackEvent = useMixpanelTrack();

  const calculateTranslateX = useCallback(
    (index: number) => -index * cardWidth,
    [cardWidth],
  );

  useEffect(() => {
    setTranslateX(calculateTranslateX(currentIndex));
  }, [currentIndex, containerWidth, cardWidth, photosLength]);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= photosLength) return;
    setCurrentIndex(nextIndex);
    trackEvent('Photo Navigation', { action: 'next', index: nextIndex });
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex(currentIndex - 1);
    trackEvent('Photo Navigation', { action: 'prev', index: currentIndex - 1 });
  };

  const canScrollLeft = currentIndex > 0 && photosLength > 1;
  const canScrollRight = isMobile
    ? currentIndex < photosLength - 1
    : currentIndex < photosLength - 2;

  return {
    handlePrev,
    handleNext,
    canScrollLeft,
    canScrollRight,
  };
};
