import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '../Button/Button';
import PortalModal from './PortalModal';

const meta = {
  title: 'Components/Common/PortalModal',
  component: PortalModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '모달의 열림/닫힘 상태를 제어합니다.',
    },
    onClose: {
      action: 'closed',
      description: '모달 닫기 버튼 클릭 시 호출되는 함수입니다.',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: '배경 클릭 시 모달을 닫을지 여부를 설정합니다.',
    },
    children: {
      control: 'text',
      description: '모달 내부에 렌더링될 컨텐츠입니다.',
    },
  },
} satisfies Meta<typeof PortalModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 공통 모달 내용
const ModalContent = ({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) => (
  <div
    style={{ padding: 20, background: '#fff', color: '#000', borderRadius: 8 }}
  >
    {text}
    <div style={{ marginTop: 12 }}>
      <Button onClick={onClose}>닫기</Button>
    </div>
  </div>
);

// 기본 모달 스토리(Backdrop 클릭 시 닫힘)
export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    closeOnBackdrop: true,
    children: null,
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    const handleClose = () => {
      setIsOpen(false);
      args.onClose();
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
        <PortalModal {...args} isOpen={isOpen} onClose={handleClose}>
          <ModalContent
            text='배경 클릭 시 모달이 닫힙니다.'
            onClose={handleClose}
          />
        </PortalModal>
      </>
    );
  },
};

// Backdrop 클릭해도 닫히지 않는 케이스
export const NoBackdropClose: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    closeOnBackdrop: false,
    children: null,
  },
  render: (args) => {
    const [open, setOpen] = useState(args.isOpen);

    const handleClose = () => {
      setOpen(false);
      args.onClose();
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>모달 열기</Button>

        <PortalModal {...args} isOpen={open} onClose={handleClose}>
          <ModalContent
            text='배경을 클릭해도 모달이 닫히지 않습니다.'
            onClose={handleClose}
          />
        </PortalModal>
      </>
    );
  },
};
