import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: '버튼의 너비를 지정합니다.',
    },
    children: {
      control: 'text',
      description: '버튼 내부에 들어갈 텍스트를 지정합니다.',
    },
    animated: {
      control: 'boolean',
      description: '버튼의 애니메이션 효과를 활성화/비활성화합니다.',
    },
    onClick: {
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '버튼',
    onClick: () => {
      console.log('버튼이 클릭되었습니다.');
    },
  },
};

export const Animated: Story = {
  args: {
    children: '애니메이션 버튼',
    animated: true,
    onClick: () => {
      console.log('애니메이션 버튼이 클릭되었습니다.');
    },
  },
};

// 너비가 지정된 버튼
export const CustomWidth: Story = {
  args: {
    children: '너비 지정 버튼',
    width: '200px',
    onClick: () => {
      console.log('너비 지정 버튼이 클릭되었습니다.');
    },
  },
};

// 긴 텍스트가 있는 버튼
export const LongText: Story = {
  args: {
    children: '이것은 매우 긴 텍스트가 있는 버튼입니다',
    onClick: () => {
      console.log('긴 텍스트 버튼이 클릭되었습니다.');
    },
  },
};

// 애니메이션과 커스텀 너비가 모두 적용된 버튼
export const AnimatedWithCustomWidth: Story = {
  args: {
    children: '애니메이션 + 너비 지정',
    width: '300px',
    animated: true,
    onClick: () => {
      console.log('애니메이션 + 너비 지정 버튼이 클릭되었습니다.');
    },
  },
};
