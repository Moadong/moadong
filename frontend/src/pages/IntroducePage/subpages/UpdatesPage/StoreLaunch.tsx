// 업데이트 기록의 앱 출시 항목: 막 터진 종이 폭죽이 흩어진 판 위에 모아동 앱 아이콘과 스토어 로고를 두는 장면
import logoAppStore from '@/assets/images/introduce/updates/logo_app_store.svg';
import logoGooglePlay from '@/assets/images/introduce/updates/logo_google_play.svg';
import moadongMark from '@/assets/images/logos/moadong_mobile_logo.svg';
import type { StoreKind } from '@/pages/IntroducePage/constants/updates';
import { colors } from '@/styles/theme/colors';
import * as Styled from './StoreLaunch.styles';

const STORE: Record<StoreKind, { logo: string; name: string }> = {
  app_store: { logo: logoAppStore, name: 'App Store' },
  google_play: { logo: logoGooglePlay, name: 'Google Play' },
};

const CONFETTI_COLORS = [
  colors.primary[900],
  colors.secondary[2].main,
  colors.secondary[4].main,
  colors.secondary[1].main,
  colors.secondary[3].main,
  colors.secondary[6].main,
];

/** 판 위에 흩어 둔 종이 조각 (x·y는 판 기준 %, 매번 같은 자리에 놓인다) */
const PIECES = [
  [8, 14, 20, 'rect'],
  [18, 34, -35, 'circle'],
  [12, 62, 55, 'rect'],
  [22, 82, 10, 'ribbon'],
  [30, 10, 70, 'ribbon'],
  [34, 54, -20, 'circle'],
  [64, 12, -50, 'rect'],
  [72, 30, 15, 'circle'],
  [86, 18, 40, 'ribbon'],
  [90, 48, -15, 'rect'],
  [80, 70, 65, 'circle'],
  [68, 86, -40, 'ribbon'],
  [92, 84, 25, 'rect'],
  [6, 40, -60, 'ribbon'],
  [44, 90, 30, 'rect'],
  [56, 6, -10, 'circle'],
] as const;

interface StoreLaunchProps {
  store: StoreKind;
}

const StoreLaunch = ({ store }: StoreLaunchProps) => {
  const { logo, name } = STORE[store];

  return (
    <Styled.Scene>
      {PIECES.map(([x, y, rotate, shape], i) => (
        <Styled.Piece
          key={i}
          aria-hidden='true'
          $shape={shape}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            rotate: `${rotate}deg`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          }}
        />
      ))}
      <Styled.AppIcon>
        <img src={moadongMark} alt='모아동 앱 아이콘' />
      </Styled.AppIcon>
      <Styled.StoreName>
        <img src={logo} alt='' />
        {name}
      </Styled.StoreName>
    </Styled.Scene>
  );
};

export default StoreLaunch;
