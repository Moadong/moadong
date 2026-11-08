// 업데이트 기록의 앱 출시 항목에 넣는 App Store·Google Play 로고 (스토어 화면 캡처 대신 로고만 크게 보여 준다)
import { useId } from 'react';
import type { StoreKind } from '@/pages/IntroducePage/constants/updates';

const AppStoreLogo = () => {
  const gradientId = useId();
  return (
    <svg viewBox='0 0 120 120' width='120' height='120' aria-hidden='true'>
      <defs>
        <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#18BFFB' />
          <stop offset='100%' stopColor='#2072F3' />
        </linearGradient>
      </defs>
      <rect width='120' height='120' rx='27' fill={`url(#${gradientId})`} />
      <g stroke='#fff' strokeWidth='8' strokeLinecap='round' fill='none'>
        <path d='M66 30 41 80' />
        <path d='M54 30 79 80' />
        <path d='M32 68h40' />
        <path d='M36 88l-3 5' />
      </g>
    </svg>
  );
};

const GooglePlayLogo = () => (
  <svg viewBox='0 0 120 120' width='120' height='120' aria-hidden='true'>
    <polygon points='30,18 66,60 30,102' fill='#4285F4' />
    <polygon points='30,18 82,47 66,60' fill='#34A853' />
    <polygon points='30,102 66,60 82,73' fill='#EA4335' />
    <polygon points='82,47 98,60 82,73 66,60' fill='#FBBC04' />
  </svg>
);

const STORE_NAME: Record<StoreKind, string> = {
  app_store: 'App Store',
  google_play: 'Google Play',
};

interface StoreLogoProps {
  store: StoreKind;
}

const StoreLogo = ({ store }: StoreLogoProps) => (
  <>
    {store === 'app_store' ? <AppStoreLogo /> : <GooglePlayLogo />}
    <span>{STORE_NAME[store]}</span>
  </>
);

export default StoreLogo;
