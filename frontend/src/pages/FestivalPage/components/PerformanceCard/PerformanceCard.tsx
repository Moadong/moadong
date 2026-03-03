import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { USER_EVENT } from '@/constants/eventName';
import useMixpanelTrack from '@/hooks/Mixpanel/useMixpanelTrack';
import { Performance } from '../../data/performances';
import * as Styled from './PerformanceCard.styles';

interface PerformanceCardProps {
  performance: Performance;
  active: boolean;
}

const PerformanceCard = ({ performance, active }: PerformanceCardProps) => {
  const trackEvent = useMixpanelTrack();
  const [expanded, setExpanded] = useState(active);

  useEffect(() => {
    if (active) setExpanded(true);
  }, [active]);

  const toggleExpanded = () => {
    const nextExpanded = !expanded;
    trackEvent(USER_EVENT.FESTIVAL_PERFORMANCE_CARD_CLICKED, {
      clubName: performance.clubName,
      expanded: nextExpanded,
      active,
    });
    setExpanded(nextExpanded);
  };

  return (
    <Styled.Card $active={active} onClick={toggleExpanded}>
      <Styled.ClubName $active={active}>{performance.clubName}</Styled.ClubName>

      <Styled.SongArea $active={active} $expanded={expanded}>
        <AnimatePresence initial={false} mode='wait'>
          {expanded ? (
            <motion.div
              key='expanded'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden', flex: 1 }}
            >
              <Styled.SongList>
                {performance.songs.map((song) => (
                  <Styled.SongItem key={song}>{song}</Styled.SongItem>
                ))}
              </Styled.SongList>
            </motion.div>
          ) : (
            <motion.div
              key='collapsed'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ flex: 1 }}
            >
              <Styled.CollapsedSong>
                {performance.songs[0]}
              </Styled.CollapsedSong>
            </motion.div>
          )}
        </AnimatePresence>

        <Styled.ChevronWrapper>
          <Styled.ChevronIcon
            $expanded={expanded}
            $active={active}
            viewBox='0 0 10 5'
            fill='none'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M1 1L5 4.5L9 1' />
          </Styled.ChevronIcon>
        </Styled.ChevronWrapper>
      </Styled.SongArea>
    </Styled.Card>
  );
};

export default PerformanceCard;
