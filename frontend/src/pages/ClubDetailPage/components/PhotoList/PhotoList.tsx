import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as Styled from './PhotoList.styles';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';
import usePhotoNavigation from '@/hooks/usePhotoNavigation';
import LazyImage from '@/components/common/LazyImage/LazyImage';
import { SECTION_INDEX } from '@/constants/section';

interface PhotoListProps {
  feeds: string[];
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const DESKTOP_CARD_CONTENT_WIDTH = 400;
const CARD_GAP = 28;
const DESKTOP_CARD_WIDTH = DESKTOP_CARD_CONTENT_WIDTH + CARD_GAP;

const MOBILE_CARD_CONTENT_WIDTH = 300;
const MOBILE_CARD_WIDTH = MOBILE_CARD_CONTENT_WIDTH + CARD_GAP;

const PhotoList = ({ feeds: photos, sectionRefs }: PhotoListProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {},
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // [x]FIXME: 백엔드에서 Url구조 수정 후 fix 예정
  const convertedUrls = useMemo(() => {
    const realPhotos = Array.isArray(photos)
      ? photos.map((photo) => convertGoogleDriveUrl(photo))
      : [];
    // 가짜 카드 추가
    return [...realPhotos, 'placeholder'];
  }, [photos]);

  const cardWidth = useMemo(() => {
    return isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH;
  }, [isMobile]);

  useEffect(() => {
    const updateIsMobile = () => {
      const newIsMobile = window.innerWidth <= 500;
      setIsMobile(newIsMobile);
    };

    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    const handleWindowResize = () => {
      updateIsMobile();
      updateContainerWidth();
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const { handlePrev, handleNext, isLastCard, canScrollLeft, canScrollRight } =
    usePhotoNavigation({
      currentIndex,
      setCurrentIndex,
      photosLength: convertedUrls.length,
      cardWidth,
      containerWidth,
      translateX,
      setTranslateX,
      isMobile,
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
        const totalContentWidth = photos.length * cardWidth;
        const maxTranslateX = totalContentWidth - containerWidth;
        setTranslateX(Math.max(0, maxTranslateX));
      } else {
        setTranslateX((prev) => prev - diff * DESKTOP_CARD_WIDTH);
      }
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const progress = ((currentIndex + 2) / photos.length) * 100;

  return (
    <Styled.PhotoListContainer
      ref={(el) => {
        sectionRefs.current[SECTION_INDEX.PHOTO_LIST_TAB] = el;
      }}>
      <h3>활동 사진</h3>

      <Styled.PhotoListWrapper>
        <Styled.PhotoList
          ref={containerRef}
          translateX={translateX}
          isLastCard={isLastCard}
          containerWidth={containerWidth}
          cardWidth={cardWidth}
          photoCount={photos.length}>
          {convertedUrls.map((url, index) => (
            <Styled.PhotoCard
              key={index}
              photoCount={photos.length}
              isPlaceholder={url === 'placeholder'}>
              {url !== 'placeholder' ? (
                !imageErrors[index] ? (
                  <LazyImage
                    src={url}
                    alt={`활동 사진 ${index + 1}`}
                    index={index}
                    delayMs={200}
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <Styled.NoImageContainer>
                    이미지 준비중..
                  </Styled.NoImageContainer>
                )
              ) : (
                <></> // 가짜 카드는 비워둠
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
