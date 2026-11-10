import { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { NAME_QUESTION_ID } from '@/constants/applicationForm';
import { ApplicationFormData, ApplicationFormMode } from '@/types/application';
import ApplicationEditTabMobile from './ApplicationEditTabMobile';

const meta = {
  title: 'Pages/AdminPage/tabs/ApplicationTab/ApplicationEditTabMobile',
  component: ApplicationEditTabMobile,
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ApplicationEditTabMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialFormData: ApplicationFormData = {
  title: '모아동 지원서',
  description: '',
  semesterYear: 2026,
  formMode: ApplicationFormMode.INTERNAL,
  questions: [
    {
      id: NAME_QUESTION_ID,
      title: '이름을 입력해주세요',
      description: '',
      type: 'SHORT_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 2,
      title: '지원 동기',
      description: '지원하게 된 이유를 적어주세요',
      type: 'LONG_TEXT',
      options: { required: true },
      items: [],
    },
    {
      id: 3,
      title: '희망 활동',
      description: '',
      type: 'MULTI_CHOICE',
      options: { required: false },
      items: [{ value: '운동' }, { value: '공연' }],
    },
  ],
};

const StatefulEditor = ({
  initialMode,
}: {
  initialMode: ApplicationFormMode;
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [mode, setMode] = useState(initialMode);
  const [url, setUrl] = useState('');
  return (
    <ApplicationEditTabMobile
      formData={formData}
      setFormData={setFormData}
      applicationFormMode={mode}
      setApplicationFormMode={setMode}
      externalApplicationUrl={url}
      setExternalApplicationUrl={setUrl}
      onSubmit={() => {}}
    />
  );
};

export const Internal: Story = {
  args: {} as Story['args'],
  render: () => <StatefulEditor initialMode={ApplicationFormMode.INTERNAL} />,
};

export const External: Story = {
  args: {} as Story['args'],
  render: () => <StatefulEditor initialMode={ApplicationFormMode.EXTERNAL} />,
};
