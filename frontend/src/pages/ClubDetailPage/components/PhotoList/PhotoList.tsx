import { useState, useRef, useMemo, useCallback } from 'react';
import * as Styled from './PhotoList.styles';
import convertGoogleDriveUrl from '@/utils/convertGoogleDriveUrl';
import { usePhotoNavigation } from '@/hooks/PhotoList/usePhotoNavigation';
import { INFOTABS_SCROLL_INDEX } from '@/constants/scrollSections';
import PhotoModal from '@/pages/ClubDetailPage/components/PhotoList/PhotoModal/PhotoModal';
import { SlideButton } from '@/constants/banners';
import { useResponsiveLayout } from '@/hooks/PhotoList/useResponsiveLayout';
import PhotoCardList from '@/pages/ClubDetailPage/components/PhotoList/PhotoCardList/PhotoCardList';
import { usePhotoModal } from '@/hooks/PhotoList/usePhotoModal';

interface PhotoListProps {
  feeds: string[];
  sectionRefs: React.RefObject<(HTMLDivElement | null)[]>;
  clubName: string;
}

const PhotoList = ({ feeds, sectionRefs, clubName }: PhotoListProps) => {
  const photoUrls = useMemo(
    () => (Array.isArray(feeds) ? feeds.map(convertGoogleDriveUrl) : []),
    [feeds],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const { isOpen, index, open, close, setIndex } = usePhotoModal();

  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, containerWidth, cardWidth } =
    useResponsiveLayout(containerRef);

  const { handlePrev, handleNext, canScrollLeft, canScrollRight } =
    usePhotoNavigation({
      currentIndex,
      setCurrentIndex,
      photosLength: photoUrls.length,
      cardWidth,
      containerWidth,
      translateX,
      setTranslateX,
      isMobile,
    });

  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  const openModalAt = useCallback((i: number) => open(i), [open]);

  return (
    <Styled.PhotoListContainer
      ref={(el) => {
        sectionRefs.current[INFOTABS_SCROLL_INDEX.PHOTO_LIST_TAB] = el;
      }}
    >
      <Styled.PhotoListTitle>활동 사진</Styled.PhotoListTitle>

      <Styled.PhotoListWrapper ref={containerRef}>
        <Styled.PhotoList translateX={translateX} photoCount={photoUrls.length}>
          <PhotoCardList
            photoUrls={photoUrls}
            imageErrors={imageErrors}
            onImageClick={openModalAt}
            onImageError={handleImageError}
          />
        </Styled.PhotoList>
        {canScrollLeft && (
          <Styled.NavigationButton direction='left' onClick={handlePrev}>
            <img src={SlideButton[0]} alt='이전 사진' draggable={false} />
          </Styled.NavigationButton>
        )}
        {canScrollRight && (
          <Styled.NavigationButton direction='right' onClick={handleNext}>
            <img src={SlideButton[1]} alt='다음 사진' draggable={false} />
          </Styled.NavigationButton>
        )}
      </Styled.PhotoListWrapper>

      <PhotoModal
        isOpen={isOpen}
        onClose={close}
        clubName={clubName}
        photos={{
          currentIndex: index,
          urls: photoUrls,
          onChangeIndex: setIndex,
        }}
      />
    </Styled.PhotoListContainer>
  );
};

export default PhotoList;
