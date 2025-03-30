import { useState } from 'react';

interface UsePhotoSwipeProps {
  translateX: number;
  currentIndex: number;
  photosLength: number;
  cardWidth: number;
  containerWidth: number;
  handleNext: () => void;
  handlePrev: () => void;
  isLastCardInMiddle: boolean;
  isSecondLastCardAtStart: boolean;
  setTranslateX: React.Dispatch<React.SetStateAction<number>>;
}

export const usePhotoSwipe = ({
  translateX,
  currentIndex,
  photosLength,
  cardWidth,
  containerWidth,
  handleNext,
  handlePrev,
  isLastCardInMiddle, // 	마지막 카드를 절반만 보여주는 상태인지
  isSecondLastCardAtStart, // 마지막에서 2번째 카드가 가장 왼쪽에 있을 때인지
  setTranslateX,
}: UsePhotoSwipeProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentTranslate(translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    const maxSlideDistance = window.innerWidth <= 500 ? 100 : cardWidth;

    const newTranslate =
      currentTranslate +
      (Math.abs(diff) > maxSlideDistance
        ? maxSlideDistance * Math.sign(diff)
        : diff);

    if (currentIndex === photosLength - 1 && newTranslate > 0) {
      setTranslateX(0);
    } else if (currentIndex === 0 && newTranslate < 0) {
      setTranslateX(0);
    } else if (
      currentIndex >= photosLength - 2 &&
      newTranslate < currentTranslate
    ) {
      setTranslateX(currentTranslate);
    } else if (
      currentIndex === photosLength - 1 &&
      newTranslate < containerWidth - 400
    ) {
      setTranslateX(containerWidth - 400);
    } else {
      setTranslateX(newTranslate);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const diff = currentTranslate - translateX;
    const threshold = window.innerWidth <= 500 ? 50 : 100;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        handlePrev();
      } else if (
        diff < 0 &&
        currentIndex < photosLength - 1 &&
        !isLastCardInMiddle &&
        !isSecondLastCardAtStart
      ) {
        handleNext();
      } else {
        setTranslateX(currentTranslate);
      }
    } else {
      setTranslateX(currentTranslate);
    }
  };

  return {
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
