import { useEffect, useState } from 'react';
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
        {expanded ? (
          <Styled.SongList>
            {performance.songs.map((song) => (
              <Styled.SongItem key={song}>{song}</Styled.SongItem>
            ))}
          </Styled.SongList>
        ) : (
          <Styled.CollapsedSong>{performance.songs[0]}</Styled.CollapsedSong>
        )}

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
