import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGameRanking } from '@/hooks/Queries/useGame';
import isInAppWebView from '@/utils/isInAppWebView';
import BackgroundFirework from './components/BackgroundFirework/BackgroundFirework';
import DotTextEffect from './components/DotTextEffect/DotTextEffect';
import RankingBoard from './components/RankingBoard/RankingBoard';
import * as S from './GamePage.styles';

const DARK_KEY = 'game_dark_mode';
const FIREWORK_INTERVAL = 10000;
const FIREWORK_DURATION = 2200;

const SunIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
  >
    <circle cx='12' cy='12' r='4' fill='currentColor' stroke='none' />
    <line x1='12' y1='1.5' x2='12' y2='4' />
    <line x1='12' y1='20' x2='12' y2='22.5' />
    <line x1='1.5' y1='12' x2='4' y2='12' />
    <line x1='20' y1='12' x2='22.5' y2='12' />
    <line x1='4.6' y1='4.6' x2='6.4' y2='6.4' />
    <line x1='17.6' y1='17.6' x2='19.4' y2='19.4' />
    <line x1='4.6' y1='19.4' x2='6.4' y2='17.6' />
    <line x1='17.6' y1='6.4' x2='19.4' y2='4.6' />
  </svg>
);

const MoonIcon = () => (
  <svg width='15' height='15' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
);

const GamePage = () => {
  const [bgBursts, setBgBursts] = useState<number[]>([]);
  const [isDark, setIsDark] = useState<boolean>(
    () => sessionStorage.getItem(DARK_KEY) === 'true',
  );

  const { data: rankingData } = useGameRanking();

  useTrackPageView(PAGE_VIEW.GAME_PAGE);

  const top1Club = rankingData?.clubs[0];

  // 게임 종료: 진입 시 한 번 + 이후 10초마다 축하 폭죽 자동 발사
  const burstIdRef = useRef(0);
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const fireBurst = () => {
      const id = burstIdRef.current++;
      setBgBursts((prev) => [...prev, id]);
      const timeout = setTimeout(() => {
        setBgBursts((prev) => prev.filter((b) => b !== id));
      }, FIREWORK_DURATION);
      timeouts.push(timeout);
    };

    fireBurst();
    const interval = setInterval(fireBurst, FIREWORK_INTERVAL);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const prevBackground = document.body.style.background;
    const bg = isDark ? '#111111' : '#F5F5F5';
    document.body.style.background = bg;
    return () => {
      document.body.style.background = prevBackground;
    };
  }, [isDark]);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      sessionStorage.setItem(DARK_KEY, String(next));
      return next;
    });
  };

  return (
    <>
      {isInAppWebView() && <WebviewTopBar title='클릭 배틀' />}
      <S.PageContainer $dark={isDark}>
        {bgBursts.map((id) => (
          <BackgroundFirework key={id} />
        ))}

        <S.Content>
          <S.ToggleBar>
            <S.ToggleSwitch
              $dark={isDark}
              onClick={toggleDark}
              aria-label='다크모드 토글'
              aria-pressed={isDark}
            >
              <S.ToggleKnob $dark={isDark}>
                {isDark ? <MoonIcon /> : <SunIcon />}
              </S.ToggleKnob>
            </S.ToggleSwitch>
          </S.ToggleBar>

          {/* 상단: 타이틀(좌) + 최종 순위(우) */}
          <S.TopRow>
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <S.PageTitle $dark={isDark}>동아리 클릭 배틀</S.PageTitle>
              <S.PageDescription $dark={isDark}>
                클릭 배틀이 종료되었어요! 최종 순위를 확인해보세요.
              </S.PageDescription>
            </motion.div>

            <S.DesktopOnly>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <RankingBoard ranking={rankingData?.clubs ?? []} isDark={isDark} />
              </motion.div>
            </S.DesktopOnly>
          </S.TopRow>

          {/* 중앙: 도트 글자 */}
          {top1Club && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <DotTextEffect
                text={top1Club.clubName}
                fontSize={200}
                spacing={6}
                dotR={1.3}
                hoverRadius={20}
                dotColor={isDark ? '#FFFFFF' : '#000000'}
              />
            </motion.div>
          )}

          {/* 모바일 전용: 순위표 최하단 */}
          <S.MobileOnly>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RankingBoard ranking={rankingData?.clubs ?? []} isDark={isDark} />
            </motion.div>
          </S.MobileOnly>
        </S.Content>
      </S.PageContainer>
    </>
  );
};

export default GamePage;
