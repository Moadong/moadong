import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Keyboard, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import CloseButtonIcon from '@/assets/images/icons/close_button_icon.svg?react';
import NextButton from '@/assets/images/icons/next_button_icon.svg';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import Modal from '@/components/common/Modal/Modal';
import cdnImage from '@/utils/cdnImage';
import getAdjacentIndexes from './getAdjacentIndexes';
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
  // Swiper가 슬라이드를 전부 마운트하므로, 본 이미지는 현재 사진과 양옆만 요청한다.
  // 한 번 가까이 간 사진은 목록에 남겨서 되돌아올 때 다시 받거나 깜빡이지 않게 한다.
  const [visitedUrls, setVisitedUrls] = useState<Set<string>>(() => new Set());
  const nearbyUrls = getAdjacentIndexes(currentIndex, urls.length).map(
    (i) => urls[i],
  );
  const shouldLoad = (url: string) =>
    visitedUrls.has(url) || nearbyUrls.includes(url);

  const handleSlideChange = (swiper: SwiperType) => {
    const nextUrls = getAdjacentIndexes(swiper.realIndex, urls.length).map(
      (i) => urls[i],
    );
    setVisitedUrls((prev) => new Set([...prev, ...nearbyUrls, ...nextUrls]));
    onChangeIndex(swiper.realIndex);
  };

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
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={true}>
      <Styled.ModalContent onClick={(e) => e.stopPropagation()}>
        <Styled.ModalHeader>
          <Styled.ClubName>{clubName}</Styled.ClubName>
          <Styled.ImageCounter>
            {currentIndex + 1} / {urls.length}
          </Styled.ImageCounter>
          <Styled.CloseButton onClick={onClose} aria-label='닫기'>
            <CloseButtonIcon />
          </Styled.CloseButton>
        </Styled.ModalHeader>
        <Styled.ModalBody>
          <Styled.ImageContainer>
            <Swiper
              modules={[Navigation, Keyboard]}
              initialSlide={currentIndex}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={handleSlideChange}
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
              style={{ width: '100%', height: '100%' }}
            >
              {urls.map((url, idx) => (
                <SwiperSlide key={url}>
                  <Styled.SlideInner>
                    {shouldLoad(url) && (
                      <Styled.Image
                        src={cdnImage(url, 'modal')}
                        alt={`활동 사진 ${idx + 1}`}
                      />
                    )}
                  </Styled.SlideInner>
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
                  <img src={cdnImage(url, 'thumbnail')} alt='썸네일' />
                </Styled.Thumbnail>
              ))}
            </Styled.ThumbnailList>
          </Styled.ThumbnailContainer>
        </Styled.ModalBody>
      </Styled.ModalContent>
    </Modal>
  );
};

export default PhotoModal;
