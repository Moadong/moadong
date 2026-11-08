// 업데이트 기록의 앱 출시 항목: 모아동 앱 아이콘과 스토어 로고를 두고, 화면에 들어올 때마다 종이 폭죽이 터졌다가 떨어지는 장면
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useInView, useReducedMotion } from 'framer-motion';
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

/** 아이콘 높이쯤에서 양옆으로 두 번 터뜨린다 */
const BURSTS = [
  { angle: 60, x: 0.3 },
  { angle: 120, x: 0.7 },
];

interface StoreLaunchProps {
  store: StoreKind;
}

const StoreLaunch = ({ store }: StoreLaunchProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvasRef, { amount: 0.6 });
  const reduceMotion = useReducedMotion();

  // 화면에 들어올 때마다 한 번씩 터진다. 조각은 중력으로 떨어지며 사라진다
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !inView || reduceMotion) return;
    const fire = confetti.create(canvas, { resize: true });
    BURSTS.forEach(({ angle, x }) =>
      fire({
        particleCount: 60,
        angle,
        spread: 70,
        startVelocity: 38,
        gravity: 1,
        ticks: 180,
        scalar: 0.9,
        origin: { x, y: 0.62 },
        colors: CONFETTI_COLORS,
      }),
    );
    return () => fire.reset();
  }, [inView, reduceMotion]);

  const { logo, name } = STORE[store];

  return (
    <Styled.Scene>
      <Styled.Canvas ref={canvasRef} aria-hidden='true' />
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
