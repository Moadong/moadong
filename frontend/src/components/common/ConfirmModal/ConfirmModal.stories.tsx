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
  },
} satisfies Meta<typeof ConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: '아직 작성이 완료되지 않았습니다.',
    description: '임시 저장 후 나가시겠습니까?',
    actions: [
      { label: '취소', variant: 'secondary', onClick: () => {} },
      { label: '확인', variant: 'primary', onClick: () => {} },
    ],
  },
};

export const Delete: Story = {
  args: {
    variant: 'warning',
    title: '질문을 삭제할까요?',
    description: '삭제된 질문은 복구할 수 없습니다.',
    actions: [
      { label: '취소', variant: 'secondary', onClick: () => {} },
      { label: '삭제', variant: 'primary', onClick: () => {} },
    ],
  },
};

export const Save: Story = {
  args: {
    variant: 'check',
    title: '지원서를 저장할까요?',
    description: '저장한 내용으로 지원서가 생성됩니다.',
    actions: [
      { label: '취소', variant: 'secondary', onClick: () => {} },
      { label: '저장', variant: 'primary', onClick: () => {} },
    ],
  },
};

export const Satisfaction: Story = {
  args: {
    variant: 'check',
    title: '모아동, 잘 사용하고 계신가요?',
    description: '솔직한 의견이 더 나은 모아동을 만들어요\n여러분의 한 마디가 큰 힘이 돼요',
    actions: [
      { label: '아쉬워요', variant: 'secondary', onClick: () => {} },
      { label: '좋아요!', variant: 'primary', onClick: () => {} },
    ],
  },
};
