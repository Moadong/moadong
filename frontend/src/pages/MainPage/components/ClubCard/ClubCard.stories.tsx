import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import ClubCard from './ClubCard';
import { Club } from '@/types/club';

const sampleClub: Club = {
  id: 'club-1',
  name: '모아동 밴드',
  logo: '',
  tags: ['락밴드', '공연'],
  recruitmentStatus: 'OPEN',
  division: 'central',
  category: '공연',
  introduction: '함께 무대에 설 멤버를 모집합니다.',
};

const meta = {
  title: 'Pages/MainPage/Components/ClubCard',
  component: ClubCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '동아리 카드 요약 정보를 표시합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    club: {
      description:
        '카드에 표시할 동아리 정보 객체입니다. (name, tags, recruitmentStatus 등)',
    },
  },
} satisfies Meta<typeof ClubCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    club: sampleClub,
  },
};

export const Closed: Story = {
  args: {
    club: {
      ...sampleClub,
      id: 'club-2',
      recruitmentStatus: 'CLOSED',
      name: '모아동 사진회',
      introduction: '정기 출사와 전시를 준비합니다.',
      tags: ['사진', '전시'],
      category: '취미교양',
    },
  },
};
