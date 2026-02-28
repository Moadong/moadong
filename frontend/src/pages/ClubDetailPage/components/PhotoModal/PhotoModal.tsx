import { useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import NextButton from '@/assets/images/icons/next_button_icon.svg';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import PortalModal from '@/components/common/Modal/PortalModal';
import * as Styled from './PhotoModal.styles';

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
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swiperRef = useRef<SwiperType | null>(null);

  // 현재 인덱스가 변경되면 해당 썸네일로 스크롤
  useEffect(() => {
    const currentThumbnail = thumbnailRefs.current[currentIndex];
    if (currentThumbnail) {
      currentThumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  if (!isOpen) return null;

  return (
    <PortalModal isOpen={isOpen} onClose={onClose} closeOnBackdrop={true}>
      <Styled.ModalContent onClick={(e) => e.stopPropagation()}>
        <Styled.ModalHeader>
          <Styled.ClubName>{clubName}</Styled.ClubName>
          <Styled.ImageCounter>
            {currentIndex + 1} / {urls.length}
          </Styled.ImageCounter>
          <Styled.CloseButton onClick={onClose} aria-label='닫기'>
            ×
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody>
          <Styled.ImageContainer>
            <Swiper
              modules={[Navigation, Keyboard]}
              initialSlide={currentIndex}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => onChangeIndex(swiper.realIndex)}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              keyboard={{
                enabled: true,
              }}
              loop={urls.length > 1}
              spaceBetween={0}
              slidesPerView={1}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {urls.map((url, idx) => (
                <SwiperSlide
                  key={url}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Styled.Image src={url} alt={`활동 사진 ${idx + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
            {urls.length > 1 && (
              <>
                <Styled.NavButton
                  className='swiper-button-prev-custom'
                  position='left'
                  aria-label='이전 사진'
                >
                  <img src={PrevButton} alt='이전 사진' />
                </Styled.NavButton>
                <Styled.NavButton
                  className='swiper-button-next-custom'
                  position='right'
                  aria-label='다음 사진'
                >
                  <img src={NextButton} alt='다음 사진' />
                </Styled.NavButton>
              </>
            )}
          </Styled.ImageContainer>
          <Styled.ThumbnailContainer>
            <Styled.ThumbnailList>
              {urls.map((url, idx) => (
                <Styled.Thumbnail
                  key={url}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el;
                  }}
                  isActive={idx === currentIndex}
                  onClick={() => {
                    if (swiperRef.current) {
                      swiperRef.current.slideToLoop(idx, 300);
                    }
                  }}
                >
                  <img src={url} alt='썸네일' />
                </Styled.Thumbnail>
              ))}
            </Styled.ThumbnailList>
          </Styled.ThumbnailContainer>
        </Styled.ModalBody>
      </Styled.ModalContent>
    </PortalModal>
  );
};

export default PhotoModal;
