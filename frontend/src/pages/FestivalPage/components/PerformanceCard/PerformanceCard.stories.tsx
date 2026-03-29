import type { Meta, StoryObj } from '@storybook/react';
import PerformanceCard from './PerformanceCard';

const samplePerformance = {
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

const singleSongPerformance = {
  id: 1,
  clubName: '터',
  startTime: '12:30',
  endTime: '13:00',
  songs: ['차선농악 - 9명'],
};

const meta = {
  title: 'Pages/FestivalPage/Components/PerformanceCard',
  component: PerformanceCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 294 }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: '현재 공연 중 여부. true이면 기본 expanded 상태입니다.',
    },
  },
} satisfies Meta<typeof PerformanceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {
  args: {
    performance: samplePerformance,
    active: false,
  },
};

export const Active: Story = {
  args: {
    performance: samplePerformance,
    active: true,
  },
};

export const InactiveSingleSong: Story = {
  args: {
    performance: singleSongPerformance,
    active: false,
  },
};

export const ActiveSingleSong: Story = {
  args: {
    performance: singleSongPerformance,
    active: true,
  },
};
