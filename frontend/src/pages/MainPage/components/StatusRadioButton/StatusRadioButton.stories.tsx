import type { Meta, StoryObj } from '@storybook/react';
import StatusRadioButton from './StatusRadioButton';

const meta = {
  title: 'Pages/MainPage/Components/StatusRadioButton',
  component: StatusRadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '모집중/모집예정 필터 토글입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: {
      description: '상태 변경 시 호출되는 콜백입니다.',
      table: {
        type: { summary: '(selectedStatus: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof StatusRadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: (selected) => {
      console.log('selected:', selected);
    },
  },
};
