import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GameRankingEntry } from '@/types/game';
import * as S from './RankingBoard.styles';

interface RankingBoardProps {
  ranking: GameRankingEntry[];
  myClubName?: string;
  isDark?: boolean;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const TOP_COUNT = 20;

const RankingBoard = ({
  ranking,
  myClubName,
  isDark = false,
}: RankingBoardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleRanking = isExpanded ? ranking : ranking.slice(0, TOP_COUNT);
  const hasMore = ranking.length > TOP_COUNT;

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title $dark={isDark}>🏆 Top 20 실시간 순위</S.Title>
      </S.Header>
      {ranking.length === 0 ? (
        <S.EmptyMessage $dark={isDark}>
          아직 참여한 동아리가 없어요. 첫 번째로 클릭해보세요!
        </S.EmptyMessage>
      ) : (
        <>
          <S.List>
            <AnimatePresence initial={false}>
              {visibleRanking.map((entry, i) => (
                <motion.li
                  key={entry.clubName}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.2,
                    delay:
                      (isExpanded && i >= TOP_COUNT ? i - TOP_COUNT : i) * 0.02,
                  }}
                  style={{ listStyle: 'none' }}
                >
                  <S.Item
                    as={Link}
                    to={`/clubDetail/@${encodeURIComponent(entry.clubName)}`}
                    $isMe={entry.clubName === myClubName}
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
          {hasMore && (
            <S.MoreButton
              $dark={isDark}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              {isExpanded
                ? '접기'
                : `더보기 (${ranking.length - TOP_COUNT}개 동아리)`}
            </S.MoreButton>
          )}
        </>
      )}
    </S.Wrapper>
  );
};

export default RankingBoard;
