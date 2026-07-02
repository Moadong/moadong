import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GameRankingEntry } from '@/types/game';
import * as S from './RankingBoard.styles';

interface RankingBoardProps {
  ranking: GameRankingEntry[];
  isDark?: boolean;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const TOP_COUNT = 3;

const RankingBoard = ({ ranking, isDark = false }: RankingBoardProps) => {
  const visibleRanking = ranking.slice(0, TOP_COUNT);

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title $dark={isDark}>🏆 Top 3 최종 순위</S.Title>
      </S.Header>
      {ranking.length === 0 ? (
        <S.EmptyMessage $dark={isDark}>
          아직 집계된 최종 순위가 없어요.
        </S.EmptyMessage>
      ) : (
        <S.List>
          <AnimatePresence initial={false}>
            {visibleRanking.map((entry, i) => (
              <motion.li
                key={entry.clubName}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: i * 0.1 }}
                style={{ listStyle: 'none' }}
              >
                <S.Item
                  as={Link}
                  to={`/clubDetail/@${encodeURIComponent(entry.clubName)}`}
                  $rank={entry.rank}
                  $dark={isDark}
                >
                  <S.Rank $rank={entry.rank}>
                    {MEDAL[entry.rank - 1] ?? entry.rank}
                  </S.Rank>
                  <S.ClubName $dark={isDark}>{entry.clubName}</S.ClubName>
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
