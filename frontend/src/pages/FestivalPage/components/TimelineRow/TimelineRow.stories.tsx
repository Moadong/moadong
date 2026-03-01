import type { Meta, StoryObj } from '@storybook/react';
import PerformanceCard from '../PerformanceCard/PerformanceCard';
import TimelineRow from './TimelineRow';

const pastPerformance = {
  id: 1,
  clubName: '터',
  startTime: '12:30',
  endTime: '13:00',
  songs: ['차선농악 - 9명'],
};

const activePerformance = {
  id: 2,
  clubName: '매니아',
  startTime: '13:00',
  endTime: '13:30',
  songs: [
    'Blur - Song 2',
    'OASIS - Supersonic',
    'Green Day - Dillema',
    'Radiohead - My Iron Lung',
  ],
};

const upcomingPerformance = {
  id: 3,
  clubName: '씨사운드',
  startTime: '13:30',
  endTime: '14:00',
  songs: [
    'Best part (feat. H.E.R) - Daniel Caesar, H.E.R.',
    '좋은 밤 좋은 꿈 - 너드커넥션',
    'Good bye bye - 토미오카 아이',
    '사랑하게 될거야 - 한로로',
  ],
};

const meta = {
  title: 'Pages/FestivalPage/Components/TimelineRow',
  component: TimelineRow,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, padding: '0 16px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'radio',
      options: ['past', 'active', 'upcoming'],
    },
  },
} satisfies Meta<typeof TimelineRow>;

export default meta;
type Story = StoryObj<{
  time: string;
  status: 'past' | 'active' | 'upcoming';
  children?: React.ReactNode;
}>;

export const Past: Story = {
  args: {
    time: '12:30',
    status: 'past',
  },
  render: (args) => (
    <TimelineRow {...args}>
      <PerformanceCard performance={pastPerformance} active={false} />
    </TimelineRow>
  ),
};

export const Active: Story = {
  args: {
    time: '13:00',
    status: 'active',
  },
  render: (args) => (
    <TimelineRow {...args}>
      <PerformanceCard performance={activePerformance} active={true} />
    </TimelineRow>
  ),
};

export const Upcoming: Story = {
  args: {
    time: '13:30',
    status: 'upcoming',
  },
  render: (args) => (
    <TimelineRow {...args}>
      <PerformanceCard performance={upcomingPerformance} active={false} />
    </TimelineRow>
  ),
};

export const AllTogether: Story = {
  args: {
    time: '12:30',
    status: 'past',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TimelineRow time='12:30' status='past'>
        <PerformanceCard performance={pastPerformance} active={false} />
      </TimelineRow>
      <TimelineRow time='13:00' status='active'>
        <PerformanceCard performance={activePerformance} active={true} />
      </TimelineRow>
      <TimelineRow time='13:30' status='upcoming'>
        <PerformanceCard performance={upcomingPerformance} active={false} />
      </TimelineRow>
    </div>
  ),
};
