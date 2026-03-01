import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { performances } from '../../data/performances';
import { useCurrentTime } from '../../hooks/useCurrentTime';
import PerformanceCard from '../PerformanceCard/PerformanceCard';
import TimelineRow from '../TimelineRow/TimelineRow';

type Status = 'past' | 'active' | 'upcoming';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getStatus(
  startTime: string,
  endTime: string,
  currentMinutes: number,
): Status {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  if (currentMinutes >= start && currentMinutes < end) return 'active';
  if (currentMinutes >= end) return 'past';
  return 'upcoming';
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 8px;
`;

const PerformanceList = () => {
  const currentTime = useCurrentTime();
  const currentMinutes = toMinutes(currentTime);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentTime]);

  return (
    <List>
      {performances.map((performance) => {
        const status = getStatus(
          performance.startTime,
          performance.endTime,
          currentMinutes,
        );
        const isActive = status === 'active';

        return (
          <div key={performance.id} ref={isActive ? activeRef : null}>
            <TimelineRow time={performance.startTime} status={status}>
              <PerformanceCard performance={performance} active={isActive} />
            </TimelineRow>
          </div>
        );
      })}
    </List>
  );
};

export default PerformanceList;
