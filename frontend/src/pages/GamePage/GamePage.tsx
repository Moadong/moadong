import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useClickGame, useGameRanking } from '@/hooks/Queries/useGame';
import ClickButton from './components/ClickButton/ClickButton';
import ClubNameInput from './components/ClubNameInput/ClubNameInput';
import DotTextEffect from './components/DotTextEffect/DotTextEffect';
import RankingBoard from './components/RankingBoard/RankingBoard';
import * as S from './GamePage.styles';

const STORAGE_KEY = 'game_club_name';


const BLOBS = [
  {
    size: 320,
    top: '-80px',
    left: '-100px',
    color: 'rgba(255, 84, 20, 0.12)',
    dy: 30,
    duration: 7,
  },
  {
    size: 260,
    top: '20%',
    left: '75%',
    color: 'rgba(255, 157, 124, 0.15)',
    dy: -40,
    duration: 9,
  },
  {
    size: 200,
    top: '55%',
    left: '-60px',
    color: 'rgba(255, 212, 50, 0.12)',
    dy: 25,
    duration: 11,
  },
  {
    size: 180,
    top: '70%',
    left: '80%',
    color: 'rgba(95, 216, 192, 0.13)',
    dy: -30,
    duration: 8,
  },
  {
    size: 140,
    top: '40%',
    left: '45%',
    color: 'rgba(112, 148, 255, 0.1)',
    dy: 20,
    duration: 13,
  },
];

const GamePage = () => {
  const [clubName, setClubName] = useState<string>(
    () => sessionStorage.getItem(STORAGE_KEY) ?? '',
  );
  const [myClickCount, setMyClickCount] = useState(0);

  const pendingRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: rankingData } = useGameRanking();
  const { mutate: clickGame } = useClickGame();

  const top1Club = rankingData?.clubs[0];

  const flush = (name: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const count = pendingRef.current;
    if (count === 0) return;
    pendingRef.current = 0;
    clickGame({ clubName: name, count });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStart = (name: string) => {
    sessionStorage.setItem(STORAGE_KEY, name);
    setClubName(name);
  };

  const handleClick = () => {
    setMyClickCount((prev) => prev + 1);
    pendingRef.current += 1;

    if (pendingRef.current >= 5) {
      flush(clubName);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => flush(clubName), 500);
    }
  };

  return (
    <S.PageContainer>
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', zIndex: 0 }}
          animate={{ y: [0, blob.dy, 0] }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <S.Blob
            $size={blob.size}
            $top={blob.top}
            $left={blob.left}
            $color={blob.color}
          />
        </motion.div>
      ))}

      <S.Content>
        {/* 상단: 타이틀(좌) + 실시간 순위(우) */}
        <S.TopRow>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <S.PageTitle>동아리 클릭 배틀</S.PageTitle>
            <S.PageDescription>
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
                resetAt={rankingData?.resetAt}
                myClubName={clubName}
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
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <DotTextEffect
              text={top1Club.clubName}
              fontSize={200}
              spacing={6}
              dotR={1.3}
              hoverRadius={20}
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
          {!clubName ? (
            <ClubNameInput onStart={handleStart} />
          ) : (
            <ClickButton
              clubName={clubName}
              clickCount={myClickCount}
              onClickGame={handleClick}
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
              resetAt={rankingData?.resetAt}
              myClubName={clubName}
            />
          </motion.div>
        </S.MobileOnly>
      </S.Content>
    </S.PageContainer>
  );
};

export default GamePage;
