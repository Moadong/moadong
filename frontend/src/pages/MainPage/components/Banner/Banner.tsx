import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import * as Styled from './Banner.styles';
import { SlideButton } from '@/constants/banners';
import useDevice from '@/hooks/useDevice';
import useNavigator from '@/hooks/useNavigator';

export interface BannerProps {
  backgroundImage?: string;
  linkTo?: string;
}

interface BannerComponentProps {
  desktopBanners: BannerProps[];
  mobileBanners: BannerProps[];
}

const Banner = ({ desktopBanners, mobileBanners }: BannerComponentProps) => {
  const { isMobile } = useDevice();
  const handleLink = useNavigator();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = isMobile ? mobileBanners : desktopBanners;

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  const handleBannerClick = (url?: string) => {
    if (url) {
      handleLink(url);
    }
  };

  return (
    <Styled.BannerContainer>
      <Styled.BannerWrapper>
        <Styled.ButtonContainer>
          <Styled.SlideButton onClick={handlePrev}>
            <img src={SlideButton[0]} alt='Previous Slide' />
          </Styled.SlideButton>
          <Styled.SlideButton onClick={handleNext}>
            <img src={SlideButton[1]} alt='Next Slide' />
          </Styled.SlideButton>
        </Styled.ButtonContainer>

        <Swiper
          modules={[Navigation, Autoplay]}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
          onSwiper={setSwiperInstance}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          speed={500}
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <Styled.BannerItem
                isClickable={!!banner.linkTo}
                onClick={() => handleBannerClick(banner.linkTo)}
              >
                <img src={banner.backgroundImage} alt={`banner-${index}`} />
              </Styled.BannerItem>
            </SwiperSlide>
          ))}
        </Swiper>
        {isMobile && (
          <Styled.NumericPagination>
            {currentIndex + 1} / {banners.length}
          </Styled.NumericPagination>
        )}

        {!isMobile && (
          <Styled.DotPagination>
            {banners.map((_, index) => (
              <Styled.Dot key={index} active={currentIndex === index} />
            ))}
          </Styled.DotPagination>
        )}
      </Styled.BannerWrapper>
    </Styled.BannerContainer>
  );
};

export default Banner;
