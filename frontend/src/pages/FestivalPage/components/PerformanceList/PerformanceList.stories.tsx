import type { Meta, StoryObj } from '@storybook/react';
import { performances } from '../../data/performances';
import TimelineRow from '../TimelineRow/TimelineRow';
import PerformanceCard from '../PerformanceCard/PerformanceCard';
import styled from 'styled-components';

type Status = 'past' | 'active' | 'upcoming';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getStatus(startTime: string, endTime: string, currentMinutes: number): Status {
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

function PerformanceListPreview({ currentTime }: { currentTime: string }) {
  const currentMinutes = toMinutes(currentTime);

  return (
    <List>
      {performances.map((performance) => {
        const status = getStatus(
          performance.startTime,
          performance.endTime,
          currentMinutes,
        );
        return (
          <TimelineRow key={performance.id} time={performance.startTime} status={status}>
            <PerformanceCard performance={performance} active={status === 'active'} />
          </TimelineRow>
        );
      })}
    </List>
  );
}

const meta = {
  title: 'Pages/FestivalPage/Components/PerformanceList',
  component: PerformanceListPreview,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 375, margin: '0 auto', paddingTop: 16, background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    currentTime: {
      control: 'text',
      description: '현재 시각 (HH:mm)',
    },
  },
} satisfies Meta<typeof PerformanceListPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// 13:00~13:30 매니아 공연 중
export const WithActive: Story = {
  args: { currentTime: '13:15' },
};

// 공연 시작 전 — 전부 upcoming
export const BeforeAll: Story = {
  args: { currentTime: '12:00' },
};
