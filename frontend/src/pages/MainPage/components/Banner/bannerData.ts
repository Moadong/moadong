import AllClubsDesktopImage from '@/assets/images/banners/banner_desktop1.png';
import StartNowDesktopImage from '@/assets/images/banners/banner_desktop2.png';
import PatchNoteDesktopImage from '@/assets/images/banners/banner_desktop3.png';
import AllClubsMobileImage from '@/assets/images/banners/banner_mobile1.png';
import StartNowMobileImage from '@/assets/images/banners/banner_mobile2.png';
import PatchNoteMobileImage from '@/assets/images/banners/banner_mobile3.png';

interface BannerItem {
  id: string;
  desktopImage: string;
  mobileImage: string;
  linkTo?: string;
  alt: string;
}

const BANNERS: BannerItem[] = [
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
  {
    id: 'patch-note-november-2025',
    desktopImage: PatchNoteDesktopImage,
    mobileImage: PatchNoteMobileImage,
    linkTo:
      'https://honorable-cough-8f9.notion.site/1e8aad232096804f9ea9ee4f5cf0cd10',
    alt: '모아동 11월 패치노트 안내 - 지원서 관리 및 메인페이지 개편',
  },
];

export default BANNERS;
