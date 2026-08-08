import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { colors } from '@/styles/theme/colors';
import Button from '../Button/Button';
import Toast from './Toast';

const meta = {
  title: 'Components/Common/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '토스트의 노출 여부를 제어합니다.',
    },
    onClose: {
      action: 'closed',
      description: 'duration이 지나 토스트가 사라질 때 호출되는 함수입니다.',
    },
    message: {
      control: 'text',
      description: '토스트에 표시할 문구입니다.',
    },
    backgroundColor: {
      control: 'color',
      description: '토스트 배경색입니다. 기본값은 반투명 검정입니다.',
    },
    color: {
      control: 'color',
      description: '토스트 글자색입니다. 기본값은 흰색입니다.',
    },
    duration: {
      control: 'number',
      description: '토스트가 유지되는 시간(ms)입니다.',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const ToastTrigger = (args: ComponentProps<typeof Toast>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>토스트 띄우기</Button>
      <Toast {...args} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

// 기본 토스트(반투명 검정 배경 + 흰 글자)
export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    message: '같은 기기에서 작성 상태는 저장돼요.',
  },
  render: (args) => <ToastTrigger {...args} />,
};

// 호출부에서 색상을 지정한 케이스
export const CustomColor: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    message: '지원서가 제출되었어요.',
    backgroundColor: colors.primary[900],
    color: colors.base.white,
  },
  render: (args) => <ToastTrigger {...args} />,
};
