import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import * as Styled from './Banner.styles';
import BANNERS from './bannerData';
import useDevice from '@/hooks/useDevice';
import useNavigator from '@/hooks/useNavigator';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import NextButton from '@/assets/images/icons/next_button_icon.svg';


const APP_STORE_LINKS = {
  ios: 'itms-apps://itunes.apple.com/app/6755062085',
  android: 'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
  default: 'https://play.google.com/store/apps/details?id=com.moadong.moadong&pcampaignid=web_share',
};

const getAppStoreLink = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
    return APP_STORE_LINKS.ios;
  }
  if (/android/.test(userAgent)) {
    return APP_STORE_LINKS.android;
  }

  
  return APP_STORE_LINKS.default;
};

const Banner = () => {
  const { isMobile } = useDevice();
  const handleLink = useNavigator();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  const handleBannerClick = (url?: string) => {
    if (!url) return;

    if (url === 'APP_STORE_LINK') {
      const storeLink = getAppStoreLink();
      handleLink(storeLink);
      return;
    }
    handleLink(url);
  };

  return (
    <Styled.BannerContainer>
      <Styled.BannerWrapper>
        <Styled.ButtonContainer>
          <Styled.SlideButton onClick={handlePrev} aria-label='이전 배너'>
            <img src={PrevButton} alt='' />
          </Styled.SlideButton>
          <Styled.SlideButton onClick={handleNext} aria-label='다음 배너'>
            <img src={NextButton} alt='' />
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
          {BANNERS.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Styled.BannerItem
                isClickable={!!banner.linkTo}
                onClick={() => handleBannerClick(banner.linkTo)}
              >
                <img
                  src={isMobile ? banner.mobileImage : banner.desktopImage}
                  alt={banner.alt}
                />
              </Styled.BannerItem>
            </SwiperSlide>
          ))}
        </Swiper>
        {isMobile && (
          <Styled.NumericPagination>
            {currentIndex + 1} / {BANNERS.length}
          </Styled.NumericPagination>
        )}

        {!isMobile && (
          <Styled.DotPagination>
            {BANNERS.map((_, index) => (
              <Styled.Dot key={index} active={currentIndex === index} />
            ))}
          </Styled.DotPagination>
        )}
      </Styled.BannerWrapper>
    </Styled.BannerContainer>
  );
};

export default Banner;
