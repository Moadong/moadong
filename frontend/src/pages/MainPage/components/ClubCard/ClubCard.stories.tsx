import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { asClubId } from '@/types/branded';
import { Club } from '@/types/club';
import ClubCard from './ClubCard';

// 시안(Figma 4060-16963)의 내용과 맞춘다. 카테고리·태그가 다르면 팔레트가 갈려
// 시안 대조에서 실제 차이가 아닌 불일치가 잡힌다.
const sampleClub: Club = {
  id: asClubId('club-1'),
  name: 'WAP',
  logo: '',
  tags: ['프로젝트', '소프트웨어'],
  recruitmentStatus: 'OPEN',
  division: 'central',
  category: '학술',
  introduction: '프로젝트 중심 개발동아리입니다 입니다',
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
        <div style={{ width: 335 }}>
          <Story />
        </div>
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
      id: asClubId('club-2'),
      recruitmentStatus: 'CLOSED',
      name: '모아동 사진회',
      introduction: '정기 출사와 전시를 준비합니다.',
      tags: ['사진', '전시'],
      category: '취미교양',
    },
  },
};
