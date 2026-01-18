import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

const meta = {
  title: 'Components/Common/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'text',
      description: '스피너 컨테이너의 높이입니다. (기본값: 100vh)',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스피너 (전체 화면 높이)
export const Default: Story = {
  args: {},
};

// 커스텀 높이 스피너
export const CustomHeight: Story = {
  args: {
    height: '200px',
  },
  parameters: {
    docs: {
      description: {
        story:
          '특정 영역 안에서 로딩을 표시할 때 높이를 조절하여 사용할 수 있습니다.',
      },
    },
  },
  render: (args) => (
    <div style={{ border: '1px solid #ddd', width: '300px' }}>
      <Spinner {...args} />
    </div>
  ),
};
