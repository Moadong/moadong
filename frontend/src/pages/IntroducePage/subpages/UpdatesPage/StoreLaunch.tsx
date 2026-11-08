// 업데이트 기록의 앱 출시 항목: 모아동 앱 아이콘 주위로 폭죽 조각이 터지고, 아래에 공식 스토어 배지를 두는 장면
import { useReducedMotion } from 'framer-motion';
import badgeAppStore from '@/assets/images/introduce/updates/badge_app_store.svg';
import badgeGooglePlay from '@/assets/images/introduce/updates/badge_google_play.png';
import moadongMark from '@/assets/images/logos/moadong_mobile_logo.svg';
import type { StoreKind } from '@/pages/IntroducePage/constants/updates';
import { colors } from '@/styles/theme/colors';
import * as Styled from './StoreLaunch.styles';

const BADGE: Record<StoreKind, { src: string; alt: string }> = {
  app_store: { src: badgeAppStore, alt: 'App Store에서 다운로드' },
  google_play: { src: badgeGooglePlay, alt: 'Google Play에서 다운로드' },
};

const CONFETTI_COLORS = [
  colors.primary[900],
  colors.secondary[2].main,
  colors.secondary[4].main,
  colors.secondary[1].main,
  colors.secondary[3].main,
  colors.secondary[6].main,
];

/** 아이콘 둘레로 고르게 흩어지는 조각들 (각도·거리·모양을 미리 정해 두어 매번 같은 모양으로 터진다) */
const PIECES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12);
  const distance = 92 + (i % 4) * 18;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance * 0.78,
    rotate: (i * 47) % 360,
    round: i % 3 === 0,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

interface StoreLaunchProps {
  store: StoreKind;
}

const StoreLaunch = ({ store }: StoreLaunchProps) => {
  const reduceMotion = useReducedMotion();
  const viewport = { once: true, amount: 0.6 };

  return (
    <Styled.Scene>
      <Styled.IconArea>
        {PIECES.map((piece, i) => (
          <Styled.Piece
            key={i}
            aria-hidden='true'
            $round={piece.round}
            style={{ background: piece.color }}
            initial={
              reduceMotion
                ? { x: piece.x, y: piece.y, rotate: piece.rotate, opacity: 1 }
                : { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.4 }
            }
            whileInView={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotate,
              opacity: 1,
              scale: 1,
            }}
            viewport={viewport}
            transition={{
              duration: 0.7,
              delay: 0.15 + (i % 4) * 0.03,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
        <Styled.AppIcon
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <img src={moadongMark} alt='모아동 앱 아이콘' />
        </Styled.AppIcon>
      </Styled.IconArea>
      <Styled.Badge src={BADGE[store].src} alt={BADGE[store].alt} />
    </Styled.Scene>
  );
};

export default StoreLaunch;
