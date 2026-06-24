import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Award, SemesterTerm } from '@/types/club';
import AwardSection from './AwardSection';

const handleNavigate = (award?: Award) => {
  if (!award) {
    console.log('수상 내역 추가 페이지로 이동합니다.');
    return;
  }
  const semester =
    award.semesterTerm === SemesterTerm.FIRST ? '1학기' : '2학기';
  console.log(
    `${award.year}년 ${semester} 수상 내역 수정 페이지로 이동합니다.`,
  );
};

const meta = {
  title: 'Pages/AdminPage/components/AwardSection',
  component: AwardSection,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AwardSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    awards: [],
    onNavigate: handleNavigate,
  },
  render: (args) => {
    const [awards, setAwards] = useState<Award[]>(args.awards);
    return <AwardSection awards={awards} onNavigate={args.onNavigate} />;
  },
};

export const Filled: Story = {
  args: {
    awards: [],
    onNavigate: handleNavigate,
  },
  render: (args) => {
    const [awards] = useState<Award[]>([
      {
        year: 2026,
        semesterTerm: SemesterTerm.SECOND,
        achievements: [
          '총장배 댄스 경연대회 1위',
          '부산 대학 연합 공연 우수상',
          '전국 대학 댄스 페스티벌 준우승',
        ],
      },
      {
        year: 2026,
        semesterTerm: SemesterTerm.FIRST,
        achievements: ['전국 대학 댄스 페스티벌 준우승', '교내 공연 대상'],
      },
      {
        year: 2025,
        semesterTerm: SemesterTerm.SECOND,
        achievements: [
          '부산 대학 연합 공연 우수상',
          '교내 체육대회 응원전 1위',
          '중앙 동아리 발표회 최우수상',
          '전국 댄스 배틀 4강',
          '캠퍼스 페스티벌 특별상',
        ],
      },
    ]);
    return <AwardSection awards={awards} onNavigate={args.onNavigate} />;
  },
};
