import AllClubsDesktopImage from '@/assets/images/banners/banner_desktop1.png';
import StartNowDesktopImage from '@/assets/images/banners/banner_desktop2.png';
import AllClubsMobileImage from '@/assets/images/banners/banner_mobile1.png';
import StartNowMobileImage from '@/assets/images/banners/banner_mobile2.png';
import AppReleaseDesktopImage from '@/assets/images/banners/banner_desktop4.png';
import AppReleaseMobileImage from '@/assets/images/banners/banner_mobile4.png';

interface BannerItem {
  id: string;
  desktopImage: string;
  mobileImage: string;
  linkTo?: string;
  alt: string;
}

const BANNERS: BannerItem[] = [
  {
    id: 'app-release-december-2025',
    desktopImage: AppReleaseDesktopImage,
    mobileImage: AppReleaseMobileImage,
    linkTo: 'APP_STORE_LINK',
    alt: '모아동 12월 앱 릴리즈 안내 - 앱 다운로드 링크',
  },
  {
    id: 'all-clubs-in-one-place',
    desktopImage: AllClubsDesktopImage,
    mobileImage: AllClubsMobileImage,
    linkTo: '/introduce',
    alt: '모든 동아리 한곳에 모으다 - 모아동',
  },
  {
    id: 'start-with-moadong',
    desktopImage: StartNowDesktopImage,
    mobileImage: StartNowMobileImage,
    linkTo: '/introduce',
    alt: '지금 바로 모아동에서 시작하세요',
  },
];

export default BANNERS;
