import type { Meta, StoryObj } from '@storybook/react';
import ConfirmModal from './ConfirmModal';

const meta = {
  title: 'Components/Common/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
  },
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: '아직 작성이 완료되지 않았습니다.',
    description: '임시 저장 후 나가시겠습니까?',
    confirmLabel: '확인',
  },
};

export const Delete: Story = {
  args: {
    variant: 'warning',
    title: '질문을 삭제할까요?',
    description: '삭제된 질문은 복구할 수 없습니다.',
    confirmLabel: '삭제',
  },
};

export const Save: Story = {
  args: {
    variant: 'check',
    title: '지원서를 저장할까요?',
    description: '저장한 내용으로 지원서가 생성됩니다.',
    confirmLabel: '저장',
  },
};
