import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationStatus } from '@/types/applicants';
import { asApplicantId, asApplicationFormId } from '@/types/branded';
import AddItemButton from '@/pages/AdminPage/components/AddItemButton/AddItemButton';
import ApplicantListRow from './ApplicantListRow';

const mockApplicant = {
  id: asApplicantId('applicant-1'),
  status: ApplicationStatus.SUBMITTED,
  answers: [{ id: 1, value: '홍길동' }],
  memo: '면접 태도 좋음',
  createdAt: '2025-03-15T10:00:00Z',
  applicationFormId: asApplicationFormId('form-1'),
};

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantListRow',
  component: ApplicantListRow,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicantListRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveRow = (
  args: React.ComponentProps<typeof ApplicantListRow>,
) => {
  const [checked, setChecked] = useState(args.isChecked);
  return (
    <ApplicantListRow
      {...args}
      isChecked={checked}
      onCheck={() => setChecked((prev) => !prev)}
    />
  );
};

export const Unchecked: Story = {
  args: {
    applicant: mockApplicant,
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: (args) => <InteractiveRow {...args} />,
};

export const Checked: Story = {
  args: {
    applicant: mockApplicant,
    isChecked: true,
    onCheck: () => {},
    onClick: () => {},
  },
  render: (args) => <InteractiveRow {...args} />,
};

export const NoMemo: Story = {
  args: {
    applicant: { ...mockApplicant, memo: '' },
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: (args) => <InteractiveRow {...args} />,
};

export const Accepted: Story = {
  args: {
    applicant: { ...mockApplicant, status: ApplicationStatus.ACCEPTED },
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: (args) => <InteractiveRow {...args} />,
};

export const LongName: Story = {
  args: {
    applicant: {
      ...mockApplicant,
      answers: [{ id: 1, value: '이름이매우긴지원자홍길동이름이길어요' }],
      memo: '메모도 엄청 길게 적혀있는 경우 텍스트가 말줄임 처리 되어야 합니다',
    },
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: (args) => <InteractiveRow {...args} />,
};

const mockApplicants = [
  {
    id: asApplicantId('applicant-1'),
    status: ApplicationStatus.SUBMITTED,
    answers: [{ id: 1, value: '홍길동' }],
    memo: '서류를 잘썼음',
    createdAt: '2025-07-01T10:00:00Z',
    applicationFormId: asApplicationFormId('form-1'),
  },
  {
    id: asApplicantId('applicant-2'),
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    answers: [{ id: 1, value: '김민준' }],
    memo: '면접 태도 좋음',
    createdAt: '2025-07-01T11:00:00Z',
    applicationFormId: asApplicationFormId('form-1'),
  },
  {
    id: asApplicantId('applicant-3'),
    status: ApplicationStatus.ACCEPTED,
    answers: [{ id: 1, value: '이서연' }],
    memo: '',
    createdAt: '2025-07-01T12:00:00Z',
    applicationFormId: asApplicationFormId('form-1'),
  },
  {
    id: asApplicantId('applicant-4'),
    status: ApplicationStatus.DECLINED,
    answers: [{ id: 1, value: '박지훈' }],
    memo: '추후 재지원 가능',
    createdAt: '2025-07-01T13:00:00Z',
    applicationFormId: asApplicationFormId('form-1'),
  },
  {
    id: asApplicantId('applicant-5'),
    status: ApplicationStatus.SUBMITTED,
    answers: [{ id: 1, value: '최수아' }],
    memo: '',
    createdAt: '2025-07-01T14:00:00Z',
    applicationFormId: asApplicationFormId('form-1'),
  },
];

const MultipleRowsComponent = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const handleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  return (
    <div style={{ width: 375 }}>
      {mockApplicants.map((applicant) => (
        <ApplicantListRow
          key={applicant.id}
          applicant={applicant}
          isChecked={checkedIds.includes(applicant.id)}
          onCheck={handleCheck}
          onClick={() => {}}
        />
      ))}
    </div>
  );
};

export const MultipleApplicants: Story = {
  args: {
    applicant: mockApplicant,
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: () => <MultipleRowsComponent />,
};

export const EmptyApplicants: Story = {
  args: {
    applicant: mockApplicant,
    isChecked: false,
    onCheck: () => {},
    onClick: () => {},
  },
  render: () => (
    <div
      style={{
        width: 375,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '32px 0',
      }}
    >
      <span
        style={{
          fontFamily: 'Pretendard',
          fontWeight: 600,
          fontSize: 16,
          lineHeight: '140%',
          letterSpacing: '-0.02em',
          color: '#3A3A3A',
        }}
      >
        모아동 지원서를 등록해주세요
      </span>
      <AddItemButton onClick={() => {}}>모아동 지원서 만들기</AddItemButton>
    </div>
  ),
};
