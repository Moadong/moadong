import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import WebviewTopBar from '@/components/common/WebviewTopBar/WebviewTopBar';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { useGameRanking } from '@/hooks/Queries/useGame';
import isInAppWebView from '@/utils/isInAppWebView';
import BackgroundFirework from './components/BackgroundFirework/BackgroundFirework';
import ClickButton from './components/ClickButton/ClickButton';
import ClubNameInput from './components/ClubNameInput/ClubNameInput';
import DotTextEffect from './components/DotTextEffect/DotTextEffect';
import FallingBubbles from './components/FallingBubbles/FallingBubbles';
import RankingBoard from './components/RankingBoard/RankingBoard';
import * as S from './GamePage.styles';
import { useBatchedClick } from './hooks/useBatchedClick';

const STORAGE_KEY = 'game_club_name';
const DARK_KEY = 'game_dark_mode';
const MILESTONE_UNIT = 100;

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
  const [clubName, setClubName] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) ?? '',
  );
  const [isEditing, setIsEditing] = useState(false);
  const [bgBursts, setBgBursts] = useState<number[]>([]);
  const [isDark, setIsDark] = useState<boolean>(
    () => sessionStorage.getItem(DARK_KEY) === 'true',
  );

  const [myCount, setMyCount] = useState(0);

  const { data: rankingData } = useGameRanking();
  const sendClick = useBatchedClick(clubName);

  // 버튼 클릭(1)과 비눗방울 터치(방울 값)를 합산해 개인 카운터와 서버에 반영
  const gainCount = useCallback(
    (amount: number) => {
      setMyCount((prev) => prev + amount);
      sendClick(amount);
    },
    [sendClick],
  );

  const handleButtonClick = useCallback(() => gainCount(1), [gainCount]);

  useTrackPageView(PAGE_VIEW.GAME_PAGE);

  const top1Club = rankingData?.clubs[0];

  // 직전 카운트와 비교해 어떤 동아리든 100단위를 넘기면 배경 폭죽 발사
  const prevCountsRef = useRef<Map<string, number>>(new Map());
  const initializedRef = useRef(false);
  const burstIdRef = useRef(0);

  // 순위 변동 추적
  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const [rankDelta, setRankDelta] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const clubs = rankingData?.clubs;
    if (!clubs) return;

    if (!initializedRef.current) {
      clubs.forEach((c) => prevCountsRef.current.set(c.clubName, c.clickCount));
      clubs.forEach((c) => prevRanksRef.current.set(c.clubName, c.rank));
      initializedRef.current = true;
      return;
    }

    // 순위 변동 계산 (양수 = 상승, 음수 = 하락), 변동이 있을 때만 갱신
    let hasRankChange = false;
    clubs.forEach((c) => {
      const prevRank = prevRanksRef.current.get(c.clubName);
      if (prevRank !== undefined && prevRank !== c.rank) {
        hasRankChange = true;
      }
    });

    if (hasRankChange) {
      const newDelta = new Map<string, number>();
      clubs.forEach((c) => {
        const prevRank = prevRanksRef.current.get(c.clubName);
        if (prevRank !== undefined) {
          newDelta.set(c.clubName, prevRank - c.rank);
        }
      });
      setRankDelta(newDelta);
    }
    clubs.forEach((c) => prevRanksRef.current.set(c.clubName, c.rank));

    const crossed = clubs.some((c) => {
      const prev = prevCountsRef.current.get(c.clubName) ?? 0;
      return (
        Math.floor(c.clickCount / MILESTONE_UNIT) >
        Math.floor(prev / MILESTONE_UNIT)
      );
    });

    clubs.forEach((c) => prevCountsRef.current.set(c.clubName, c.clickCount));

    if (crossed) {
      const id = burstIdRef.current++;
      setBgBursts((prev) => [...prev, id]);
      setTimeout(() => {
        setBgBursts((prev) => prev.filter((b) => b !== id));
      }, 2200);
    }
  }, [rankingData]);

  useEffect(() => {
    const prevBackground = document.body.style.background;
    const bg = isDark ? '#111111' : '#F5F5F5';
    document.body.style.background = bg;
    return () => {
      document.body.style.background = prevBackground;
    };
  }, [isDark]);

  const handleStart = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name);
    setClubName(name);
    setIsEditing(false);
  };

  const handleChangeClub = () => {
    setIsEditing(true);
  };

  const handleCancelChange = () => {
    setIsEditing(false);
  };

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

        {clubName && !isEditing && <FallingBubbles onCatch={gainCount} />}

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

          {/* 상단: 타이틀(좌) + 실시간 순위(우) */}
          <S.TopRow>
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <S.PageTitle $dark={isDark}>동아리 클릭 배틀</S.PageTitle>
              <S.PageDescription $dark={isDark}>
                우리 동아리를 응원해주세요! 클릭할수록 순위가 올라가요.
              </S.PageDescription>
            </motion.div>

            <S.DesktopOnly>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <RankingBoard
                  ranking={rankingData?.clubs ?? []}
                  myClubName={clubName}
                  isDark={isDark}
                  rankDelta={rankDelta}
                  onSelectClub={handleStart}
                />
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

          {/* 하단: 클릭 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            style={{ marginTop: '40px' }}
          >
            {!clubName || isEditing ? (
              <ClubNameInput
                onStart={handleStart}
                onCancel={isEditing ? handleCancelChange : undefined}
                isDark={isDark}
              />
            ) : (
              <ClickButton
                clubName={clubName}
                count={myCount}
                onClickGame={handleButtonClick}
                onChangeClub={handleChangeClub}
                isDark={isDark}
              />
            )}
          </motion.div>

          {/* 모바일 전용: 순위표 최하단 */}
          <S.MobileOnly>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <RankingBoard
                ranking={rankingData?.clubs ?? []}
                myClubName={clubName}
                isDark={isDark}
                rankDelta={rankDelta}
                onSelectClub={handleStart}
              />
            </motion.div>
          </S.MobileOnly>
        </S.Content>
      </S.PageContainer>
    </>
  );
};

export default GamePage;
