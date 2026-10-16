import { ComponentProps, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '../Button/Button';
import Snackbar from './Snackbar';

const meta = {
  title: 'Components/Common/Snackbar',
  component: Snackbar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '스낵바의 노출 여부를 제어합니다.',
    },
    onClose: {
      action: 'closed',
      description: 'duration이 지나 스낵바가 사라질 때 호출되는 함수입니다.',
    },
    message: {
      control: 'text',
      description: '스낵바에 표시할 문구입니다.',
    },
    action: {
      control: 'object',
      description:
        '문구 옆에 렌더할 액션입니다. `{ label, onClick }` 형태이며 이 버튼만 눌립니다.',
    },
    backgroundColor: {
      control: 'color',
      description: '스낵바 배경색입니다. 기본값은 반투명 검정입니다.',
    },
    color: {
      control: 'color',
      description: '스낵바 글자색입니다. 기본값은 흰색입니다.',
    },
    duration: {
      control: 'number',
      description: '스낵바가 유지되는 시간(ms)입니다. 기본값은 6000입니다.',
    },
    bottomOffset: {
      control: 'text',
      description:
        '모바일·태블릿에서 화면 아래로부터의 거리(CSS length)입니다.',
    },
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SnackbarTrigger = (args: ComponentProps<typeof Snackbar>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    args.onClose();
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>스낵바 띄우기</Button>
      <Snackbar {...args} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

// 알림 권한을 거부한 사용자에게 앱 설정으로 가는 길을 열어 주는 케이스
export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    message: '알림 권한을 켜 주세요',
    action: { label: '설정에서 켜기', onClick: () => {} },
  },
  render: (args) => <SnackbarTrigger {...args} />,
};

// 하단 고정 버튼이 있는 화면(동아리 상세)에서 겹치지 않게 띄우는 경우
export const AboveFixedBottomButton: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    message: '알림 권한을 켜 주세요',
    action: { label: '설정에서 켜기', onClick: () => {} },
    bottomOffset: 'calc(96px + env(safe-area-inset-bottom))',
  },
  render: (args) => <SnackbarTrigger {...args} />,
};

// 문구가 길어 두 줄로 넘어갈 때의 모양
export const LongMessage: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    message:
      '알림 권한이 꺼져 있어 새 공지를 받아볼 수 없어요. 알림 권한이 꺼져 있어',
    action: { label: '설정에서 켜기', onClick: () => {} },
  },
  render: (args) => <SnackbarTrigger {...args} />,
};
