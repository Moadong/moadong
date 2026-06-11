import { AnimatePresence, motion } from 'framer-motion';
import { GameRankingEntry } from '@/types/game';
import * as S from './RankingBoard.styles';

interface RankingBoardProps {
  ranking: GameRankingEntry[];
  resetAt?: string;
  myClubName?: string;
}

const MEDAL = ['🥇', '🥈', '🥉'];

const RankingBoard = ({ ranking, resetAt, myClubName }: RankingBoardProps) => {
  const resetTime = resetAt
    ? new Date(resetAt).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title>🏆 Top 20 실시간 순위</S.Title>
        {resetTime && <S.ResetInfo>매일 {resetTime} 초기화</S.ResetInfo>}
      </S.Header>
      {ranking.length === 0 ? (
        <S.EmptyMessage>
          아직 참여한 동아리가 없어요. 첫 번째로 클릭해보세요!
        </S.EmptyMessage>
      ) : (
        <S.List>
          <AnimatePresence initial={false}>
            {ranking.map((entry, i) => (
              <motion.li
                key={entry.clubName}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                style={{ listStyle: 'none' }}
              >
                <S.Item
                  $isMe={entry.clubName === myClubName}
                  $rank={entry.rank}
                >
                  <S.Rank $rank={entry.rank}>
                    {MEDAL[entry.rank - 1] ?? entry.rank}
                  </S.Rank>
                  <S.ClubName>{entry.clubName}</S.ClubName>
                  <S.ClickCount>
                    {entry.clickCount.toLocaleString()}회
                  </S.ClickCount>
                </S.Item>
              </motion.li>
            ))}
          </AnimatePresence>
        </S.List>
      )}
    </S.Wrapper>
  );
};

export default RankingBoard;
