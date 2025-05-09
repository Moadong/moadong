import React, { useEffect, useCallback } from 'react';
import { SlideButton } from '@/constants/banners';
import * as Styled from './PhotoModal.styles';
import useModalNavigation from '@/hooks/PhotoModal/useModalNavigation';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubName: string;
  photos: {
    currentIndex: number;
    urls: string[];
    onChangeIndex: (index: number) => void;
  };
}

const PhotoModal = ({ isOpen, onClose, clubName, photos }: PhotoModalProps) => {
  const { currentIndex, urls, onChangeIndex } = photos;

  const { handlePrev, handleNext } = useModalNavigation(
    currentIndex,
    urls.length,
    onChangeIndex,
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') return onClose();
      if (e.key === 'ArrowLeft') return handlePrev();
      if (e.key === 'ArrowRight') return handleNext();
    },
    [isOpen, onClose, handlePrev, handleNext],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <Styled.ModalOverlay onClick={onClose}>
      <Styled.ModalContent onClick={(e) => e.stopPropagation()}>
        <Styled.ModalHeader>
          <Styled.ClubName>{clubName}</Styled.ClubName>
          <Styled.CloseButton onClick={onClose} aria-label='닫기'>
            ×
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody>
          <Styled.ImageContainer>
            <Styled.Image src={urls[currentIndex]} alt='활동 사진' />
            {urls.length > 1 && (
              <>
                <Styled.NavButton
                  onClick={handlePrev}
                  position='left'
                  aria-label='이전 사진'>
                  <img src={SlideButton[0]} alt='이전 사진' />
                </Styled.NavButton>
                <Styled.NavButton
                  onClick={handleNext}
                  position='right'
                  aria-label='다음 사진'>
                  <img src={SlideButton[1]} alt='다음 사진' />
                </Styled.NavButton>
              </>
            )}
          </Styled.ImageContainer>
          <Styled.ThumbnailContainer>
            <Styled.ThumbnailList>
              {urls.map((url, idx) => (
                <Styled.Thumbnail
                  key={url}
                  isActive={idx === currentIndex}
                  onClick={() => onChangeIndex(idx)}>
                  <img src={url} alt='썸네일' />
                </Styled.Thumbnail>
              ))}
            </Styled.ThumbnailList>
          </Styled.ThumbnailContainer>
        </Styled.ModalBody>
      </Styled.ModalContent>
    </Styled.ModalOverlay>
  );
};

export default PhotoModal;
