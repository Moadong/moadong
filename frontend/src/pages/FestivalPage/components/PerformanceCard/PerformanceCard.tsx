import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

      <Styled.SongArea $active={active}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Styled.SongItem $collapsed={!expanded}>
            {performance.songs[0]}
          </Styled.SongItem>
          {performance.songs.length > 1 && (
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <Styled.SongList>
                {performance.songs.slice(1).map((song) => (
                  <Styled.SongItem key={song}>{song}</Styled.SongItem>
                ))}
              </Styled.SongList>
            </motion.div>
          )}
        </div>

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
