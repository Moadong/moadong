import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import * as Styled from './Banner.styles';
import { SlideButton } from '@/constants/banners';

export interface BannerProps {
  backgroundImage?: string;
}

interface BannerComponentProps {
  desktopBanners: BannerProps[];
  mobileBanners: BannerProps[];
}

const Banner = ({ desktopBanners, mobileBanners }: BannerComponentProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const banners = isMobile ? mobileBanners : desktopBanners;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleNext = () => {
    swiperInstance?.slideNext();
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
              <Styled.BannerItem>
                <img src={banner.backgroundImage} alt={`banner-${index}`} />
              </Styled.BannerItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </Styled.BannerWrapper>
    </Styled.BannerContainer>
  );
};

export default Banner;
