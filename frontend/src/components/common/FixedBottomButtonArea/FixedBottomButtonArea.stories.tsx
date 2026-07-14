import type { Meta, StoryObj } from '@storybook/react';
import FixedBottomButtonArea from './FixedBottomButtonArea';

const meta = {
  title: 'Components/Common/FixedBottomButtonArea',
  component: FixedBottomButtonArea,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: '버튼에 표시될 텍스트입니다.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부입니다.',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
} satisfies Meta<typeof FixedBottomButtonArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '저장하기',
    disabled: false,
    onClick: () => {},
  },
};

export const Apply: Story = {
  args: {
    children: '지원하기',
    disabled: false,
    onClick: () => {},
  },
};

export const Add: Story = {
  args: {
    children: '추가하기',
    disabled: false,
    onClick: () => {},
  },
};

export const DisabledSave: Story = {
  args: {
    children: '저장하기',
    disabled: true,
    onClick: () => {},
  },
};
