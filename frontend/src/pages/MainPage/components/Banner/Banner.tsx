import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import NextButton from '@/assets/images/icons/next_button_icon.svg';
import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import { USER_EVENT } from '@/constants/eventName';
import useDevice from '@/hooks/useDevice';
import useMixpanelTrack from '@/hooks/useMixpanelTrack';
import useNavigator from '@/hooks/useNavigator';
import { detectPlatform, getAppStoreLink } from '@/utils/appStoreLink';
import { getABTestGroup } from '@/pages/MainPage/components/Popup/Popup';
import * as Styled from './Banner.styles';
import BANNERS from './bannerData';

const Banner = () => {
  const { isMobile } = useDevice();
  const handleLink = useNavigator();
  const trackEvent = useMixpanelTrack();
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  const handleBannerClick = (
    bannerId: string,
    bannerName: string,
    url?: string,
  ) => {
    if (!url) return;

    if (url === 'APP_STORE_LINK') {
      const storeLink = getAppStoreLink();
      const abGroup = getABTestGroup();
      trackEvent(USER_EVENT.APP_DOWNLOAD_BANNER_CLICKED, {
        bannerId,
        bannerName,
        platform: detectPlatform(),
        abTestGroup: abGroup,
      });
      handleLink(storeLink);
      return;
    }

    trackEvent(USER_EVENT.BANNER_CLICKED, {
      bannerId,
      bannerName,
      linkTo: url,
    });
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
                onClick={() =>
                  handleBannerClick(banner.id, banner.alt, banner.linkTo)
                }
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
