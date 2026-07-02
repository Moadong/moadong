import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { GameRankingEntry } from '@/types/game';
import * as S from './RankingBoard.styles';

interface RankingBoardProps {
  ranking: GameRankingEntry[];
  myClubName?: string;
  isDark?: boolean;
  rankDelta?: Map<string, number>;
  onSelectClub?: (clubName: string) => void;
}

const MEDAL = ['🥇', '🥈', '🥉'];
const TOP_COUNT = 3;

const RankingBoard = ({
  ranking,
  myClubName,
  isDark = false,
  rankDelta,
  onSelectClub,
}: RankingBoardProps) => {
  const trackEvent = useMixpanelTrack();

  const visibleRanking = ranking.slice(0, TOP_COUNT);

  return (
    <S.Wrapper>
      <S.Header>
        <S.Title $dark={isDark}>🏆 Top 3 최종 순위</S.Title>
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
                    delay: Math.min(i * 0.02, 0.4),
                  }}
                  style={{ listStyle: 'none' }}
                >
                  <S.Item
                    {...(onSelectClub
                      ? {
                          onClick: () => {
                            // 카드 클릭 = 게임 대상 동아리 변경 (상세 이동과 별개 이벤트)
                            trackEvent(USER_EVENT.GAME_RANKING_CLUB_SELECTED, {
                              clubName: entry.clubName,
                              rank: entry.rank,
                            });
                            onSelectClub(entry.clubName);
                          },
                        }
                      : {
                          as: Link,
                          to: `/clubDetail/@${encodeURIComponent(entry.clubName)}`,
                        })}
                    $isMe={entry.clubName === myClubName}
                    $rank={entry.rank}
                    $dark={isDark}
                  >
                    <S.Rank $rank={entry.rank}>
                      {MEDAL[entry.rank - 1] ?? entry.rank}
                    </S.Rank>
                    <S.ClubName $dark={isDark}>{entry.clubName}</S.ClubName>
                    {(() => {
                      const delta = rankDelta?.get(entry.clubName) ?? 0;
                      if (delta === 0) return null;
                      return (
                        <S.RankDelta $direction={delta > 0 ? 'up' : 'down'}>
                          {delta > 0 ? '▲' + delta : '▼' + Math.abs(delta)}
                        </S.RankDelta>
                      );
                    })()}
                    <S.ClickCount>
                      {entry.clickCount.toLocaleString()}회
                    </S.ClickCount>
                    {onSelectClub && (
                      <S.DetailLink
                        as={Link}
                        to={`/clubDetail/@${encodeURIComponent(entry.clubName)}`}
                        onClick={(e: React.MouseEvent) => {
                          // 네비게이션 버튼 클릭 = 상세페이지 이동 (카드 선택과 별개 이벤트)
                          e.stopPropagation();
                          trackEvent(USER_EVENT.GAME_RANKING_DETAIL_CLICKED, {
                            clubName: entry.clubName,
                            rank: entry.rank,
                          });
                        }}
                        $dark={isDark}
                        aria-label={`${entry.clubName} 상세페이지`}
                      >
                        →
                      </S.DetailLink>
                    )}
                  </S.Item>
                </motion.li>
              ))}
            </AnimatePresence>
          </S.List>
        </>
      )}
    </S.Wrapper>
  );
};

export default RankingBoard;
