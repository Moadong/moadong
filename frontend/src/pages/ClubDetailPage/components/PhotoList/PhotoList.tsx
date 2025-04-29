import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as Styled from './PhotoList.styles';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';
import usePhotoNavigation from '@/hooks/PhotoList/usePhotoNavigation';
import LazyImage from '@/components/common/LazyImage/LazyImage';
import { INFOTABS_SCROLL_INDEX } from '@/constants/scrollSections';

interface PhotoListProps {
  feeds: string[];
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const DESKTOP_CARD_CONTENT_WIDTH = 400;
const CARD_GAP = 20;
const DESKTOP_CARD_WIDTH = DESKTOP_CARD_CONTENT_WIDTH + CARD_GAP;

const MOBILE_CARD_CONTENT_WIDTH = 350;
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

  // [x]FIXME: 백엔드에서 Url구조 수정 후 fix 예정
  const convertedUrls = useMemo(() => {
    if (!Array.isArray(photos) || photos.length === 0) {
      return [];
    }

    const realPhotos = Array.isArray(photos)
      ? photos.map((photo) => convertGoogleDriveUrl(photo))
      : [];
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
    });

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Styled.PhotoListContainer
      ref={(el) => {
        sectionRefs.current[INFOTABS_SCROLL_INDEX.PHOTO_LIST_TAB] = el;
      }}>
      <Styled.PhotoListTitle>활동 사진</Styled.PhotoListTitle>
      <Styled.PhotoListWrapper>
        <Styled.PhotoList
          ref={containerRef}
          translateX={translateX}
          isLastCard={isLastCard}
          containerWidth={containerWidth}
          cardWidth={cardWidth}
          photoCount={convertedUrls.length}>
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
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <Styled.NoImageContainer>
                    이미지 준비중..
                  </Styled.NoImageContainer>
                )
              ) : (
                <Styled.ImagePlaceholder />
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
    </Styled.PhotoListContainer>
  );
};

export default PhotoList;
