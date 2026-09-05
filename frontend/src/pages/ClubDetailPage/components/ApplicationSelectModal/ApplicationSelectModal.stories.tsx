import type { Meta, StoryObj } from '@storybook/react';
import { asApplicationFormId } from '@/types/branded';
import ApplicationSelectModal from './ApplicationSelectModal';

const meta = {
  title: 'Pages/ClubDetailPage/Components/ApplicationSelectModal',
  component: ApplicationSelectModal,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    onClose: () => {},
    onOptionSelect: () => {},
  },
} satisfies Meta<typeof ApplicationSelectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    applicationOptions: [
      { id: asApplicationFormId('1'), title: '일반 지원' },
      { id: asApplicationFormId('2'), title: '특기자 지원' },
    ],
  },
};

export const SingleOption: Story = {
  args: {
    applicationOptions: [{ id: asApplicationFormId('1'), title: '일반 지원' }],
  },
};

export const ManyOptions: Story = {
  args: {
    applicationOptions: [
      { id: asApplicationFormId('1'), title: '일반 지원' },
      { id: asApplicationFormId('2'), title: '특기자 지원' },
      { id: asApplicationFormId('3'), title: '편입 지원' },
      { id: asApplicationFormId('4'), title: '재입학 지원' },
    ],
  },
};

export const LongOptionText: Story = {
  args: {
    applicationOptions: [
      { id: asApplicationFormId('1'), title: '2024학년도 1학기 일반전형 신입생 지원' },
      { id: asApplicationFormId('2'), title: '2024학년도 1학기 특기자전형 신입생 지원' },
    ],
  },
};

export const Empty: Story = {
  args: {
    applicationOptions: [],
  },
};
