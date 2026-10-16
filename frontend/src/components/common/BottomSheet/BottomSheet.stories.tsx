import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '../Button/Button';
import BottomSheet from './BottomSheet';

const meta = {
  title: 'Components/Common/BottomSheet',
  component: BottomSheet,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '바텀시트 열림/닫힘 상태입니다.',
    },
    onClose: {
      action: 'closed',
      description: '닫기(배경 클릭/ESC) 시 호출됩니다.',
    },
    closeOnBackdrop: {
      control: 'boolean',
      description: '배경 클릭 시 닫을지 여부입니다.',
    },
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTemplate = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{ height: '100dvh', padding: 20 }}>
      <Button onClick={() => setIsOpen(true)}>바텀시트 열기</Button>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div style={{ padding: '8px 0 40px' }}>
          <h4 style={{ margin: '0 0 12px' }}>바텀시트 콘텐츠</h4>
          <p style={{ margin: 0, color: '#787878' }}>
            하단에서 올라오는 시트입니다. 배경 클릭 또는 ESC로 닫힙니다.
          </p>
        </div>
      </BottomSheet>
    </div>
  );
};

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: null,
  },
  render: () => <InteractiveTemplate />,
};
