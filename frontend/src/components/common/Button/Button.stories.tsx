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
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: '버튼의 시각적 스타일을 지정합니다.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기를 지정합니다.',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: '버튼의 타입을 지정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: '버튼의 활성화/비활성화 상태를 지정합니다.',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 버튼',
    onClick: () => {},
  },
};

export const Primary: Story = {
  args: {
    ...Default.args,
    children: 'Primary 버튼',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    ...Default.args,
    children: 'Secondary 버튼',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    ...Default.args,
    children: 'Ghost 버튼',
    variant: 'ghost',
  },
};

export const Danger: Story = {
  args: {
    ...Default.args,
    children: 'Danger 버튼',
    variant: 'danger',
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    children: 'Small 버튼',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    children: 'Large 버튼',
    size: 'large',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    children: '비활성화 버튼',
    disabled: true,
  },
};

export const Animated: Story = {
  args: {
    ...Default.args,
    children: '애니메이션 버튼',
    animated: true,
  },
};

// 조합 예시
export const PrimaryLarge: Story = {
  args: {
    ...Primary.args,
    ...Large.args,
    children: 'Primary Large 버튼',
  },
};

export const GhostSmallDisabled: Story = {
  args: {
    ...Ghost.args,
    ...Small.args,
    ...Disabled.args,
    children: 'Ghost Small 비활성화 버튼',
  },
};

export const CustomWidth: Story = {
  args: {
    ...Default.args,
    children: '너비 지정 버튼',
    width: '200px',
  },
};
