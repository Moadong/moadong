import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as Styled from './PhotoList.styles';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';
import { usePhotoSwipe } from '@/hooks/usePhotoSwipe';
import usePhotoNavigation from '@/hooks/usePhotoNavigation';
import LazyImage from '@/hooks/LazyImage';

interface PhotoListProps {
  feeds: string[];
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const PhotoList = ({ feeds: photos, sectionRefs }: PhotoListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardWidth = 428; // 400px + 28px gap

  const convertedUrls = useMemo(
    () =>
      Array.isArray(photos)
        ? photos.map((photo) => convertGoogleDriveUrl(photo))
        : [],
    [photos],
  );

  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  const {
    handlePrev,
    handleNext,
    isLastCard,
    isLastCardInMiddle,
    isSecondLastCardAtStart,
    canScrollLeft,
    canScrollRight,
  } = usePhotoNavigation({
    currentIndex,
    setCurrentIndex,
    photosLength: photos.length,
    cardWidth,
    containerWidth,
    translateX,
    setTranslateX,
  });

  const { isDragging, handleTouchStart, handleTouchMove, handleTouchEnd } =
    usePhotoSwipe({
      translateX,
      currentIndex,
      photosLength: photos.length,
      cardWidth,
      containerWidth,
      handleNext,
      handlePrev,
      isLastCardInMiddle,
      isSecondLastCardAtStart,
      setTranslateX,
    });

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const newIndex = Math.floor((percentage / 100) * photos.length);

    if (
      newIndex !== currentIndex &&
      newIndex >= 0 &&
      newIndex < photos.length
    ) {
      const diff = newIndex - currentIndex;
      setCurrentIndex(newIndex);
      if (newIndex === photos.length - 1) {
        setTranslateX(containerWidth - 400);
      } else {
        setTranslateX((prev) => prev - diff * cardWidth);
      }
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const progress = ((currentIndex + 1) / photos.length) * 100;

  return (
    <Styled.PhotoListContainer
      ref={(el) => {
        sectionRefs.current[3] = el;
      }}>
      <h3>활동 사진</h3>

      <Styled.PhotoListWrapper>
        <Styled.PhotoList
          ref={containerRef}
          translateX={translateX}
          isLastCard={isLastCard}
          containerWidth={containerWidth}
          isDragging={isDragging}
          photoCount={photos.length}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          {convertedUrls.map((url, index) => (
            <Styled.PhotoCard key={index} photoCount={photos.length}>
              {!imageErrors[index] ? (
                <LazyImage
                  src={url}
                  alt={`활동 사진 ${index + 1}`}
                  onError={() => handleImageError(index)}
                />
              ) : (
                <Styled.NoImageContainer>
                  이미지 준비중..
                </Styled.NoImageContainer>
              )}
            </Styled.PhotoCard>
          ))}
        </Styled.PhotoList>
        {canScrollLeft && (
          <Styled.NavigationButton direction='left' onClick={handlePrev}>
            ←
          </Styled.NavigationButton>
        )}
        {canScrollRight && (
          <Styled.NavigationButton direction='right' onClick={handleNext}>
            →
          </Styled.NavigationButton>
        )}
      </Styled.PhotoListWrapper>
      {photos.length > 2 && (
        <Styled.ProgressBarContainer
          ref={progressBarRef}
          onClick={handleProgressBarClick}>
          <Styled.ProgressBar progress={progress} />
        </Styled.ProgressBarContainer>
      )}
    </Styled.PhotoListContainer>
  );
};

export default PhotoList;
