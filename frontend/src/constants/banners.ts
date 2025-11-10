import FirstSlideDesktopImage from '@/assets/images/banners/banner_desktop1.png';
import SecondSlideDesktopImage from '@/assets/images/banners/banner_desktop2.png';
import FirstSlideMobileImage from '@/assets/images/banners/banner_mobile1.png';
import SecondSlideMobileImage from '@/assets/images/banners/banner_mobile2.png';

import PrevButton from '@/assets/images/icons/prev_button_icon.svg';
import NextButton from '@/assets/images/icons/next_button_icon.svg';

export const DesktopBannerImageList = [
  {
    backgroundImage: FirstSlideDesktopImage,
    linkTo: '/introduce',
  },
  {
    backgroundImage: SecondSlideDesktopImage,
    linkTo: '/introduce',
  },
];

export const MobileBannerImageList = [
  {
    backgroundImage: FirstSlideMobileImage,
    linkTo: '/introduce',
  },
  {
    backgroundImage: SecondSlideMobileImage,
    linkTo: '/introduce',
  },
];

export const SlideButton = [PrevButton, NextButton];
