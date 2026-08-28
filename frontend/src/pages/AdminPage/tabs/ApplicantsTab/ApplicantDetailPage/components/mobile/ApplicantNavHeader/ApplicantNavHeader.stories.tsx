import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ApplicantNavHeader from './ApplicantNavHeader';

const mockApplicants = [
  { id: 'a1', name: '이유주' },
  { id: 'a2', name: '서성원' },
  { id: 'a3', name: '김수현' },
  { id: 'a4', name: '김준서' },
  { id: 'a5', name: '박지훈' },
];

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/components/mobile/ApplicantNavHeader',
  component: ApplicantNavHeader,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375, padding: '0 20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicantNavHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveHeader = (
  args: React.ComponentProps<typeof ApplicantNavHeader>,
) => {
  const [currentIndex, setCurrentIndex] = useState(args.currentIndex);

  return (
    <ApplicantNavHeader
      {...args}
      currentIndex={currentIndex}
      onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
      onNext={() =>
        setCurrentIndex((i) => Math.min(args.applicants.length - 1, i + 1))
      }
      onSelect={(id) => {
        const index = args.applicants.findIndex((a) => a.id === id);
        if (index !== -1) setCurrentIndex(index);
      }}
    />
  );
};

export const Default: Story = {
  args: {
    applicants: mockApplicants,
    currentIndex: 0,
    onPrev: () => {},
    onNext: () => {},
    onSelect: () => {},
  },
  render: (args) => <InteractiveHeader {...args} />,
};

export const Middle: Story = {
  args: {
    applicants: mockApplicants,
    currentIndex: 2,
    onPrev: () => {},
    onNext: () => {},
    onSelect: () => {},
  },
  render: (args) => <InteractiveHeader {...args} />,
};

export const Last: Story = {
  args: {
    applicants: mockApplicants,
    currentIndex: 4,
    onPrev: () => {},
    onNext: () => {},
    onSelect: () => {},
  },
  render: (args) => <InteractiveHeader {...args} />,
};

export const SingleApplicant: Story = {
  args: {
    applicants: [{ id: 'a1', name: '홍길동' }],
    currentIndex: 0,
    onPrev: () => {},
    onNext: () => {},
    onSelect: () => {},
  },
  render: (args) => <InteractiveHeader {...args} />,
};

export const LongName: Story = {
  args: {
    applicants: [
      { id: 'a1', name: '이름이매우길어서넘치는경우테스트' },
      { id: 'a2', name: '서성원' },
    ],
    currentIndex: 0,
    onPrev: () => {},
    onNext: () => {},
    onSelect: () => {},
  },
  render: (args) => <InteractiveHeader {...args} />,
};
