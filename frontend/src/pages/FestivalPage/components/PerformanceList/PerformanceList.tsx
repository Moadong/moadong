import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { Performance } from '../../data/performances';
import { performances as defaultPerformances } from '../../data/performances';
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

interface PerformanceListProps {
  performances?: Performance[];
  festivalDate?: string; // 'YYYY-MM-DD', 생략 시 2026-03-05 기본값
}

const PerformanceList = ({
  performances = defaultPerformances,
  festivalDate = '2026-03-05',
}: PerformanceListProps) => {
  const currentTime = useCurrentTime();
  const currentMinutes = toMinutes(currentTime);
  const activeRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const [year, month, day] = festivalDate.split('-').map(Number);
  const isFestivalDate =
    now.getFullYear() === year &&
    now.getMonth() === month - 1 &&
    now.getDate() === day;

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <List>
      {performances.map((performance) => {
        const status = isFestivalDate
          ? getStatus(
              performance.startTime,
              performance.endTime,
              currentMinutes,
            )
          : 'upcoming';
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
