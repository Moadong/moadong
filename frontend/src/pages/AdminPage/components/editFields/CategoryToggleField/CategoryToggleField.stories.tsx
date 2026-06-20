import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CategoryToggleField from './CategoryToggleField';

const meta = {
  title: 'Pages/AdminPage/Components/editFields/CategoryToggleField',
  component: CategoryToggleField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryToggleField>;

export default meta;
type Story = StoryObj<typeof meta>;

const CATEGORY_OPTIONS = ['봉사', '종교', '취미교양', '학술', '운동', '공연'];

const Template = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <div style={{ width: 335 }}>
      <CategoryToggleField {...args} value={value} onSelect={setValue} />
    </div>
  );
};

export const WithSelectedValue: Story = {
  args: {
    label: '분과',
    options: CATEGORY_OPTIONS,
    value: '학술',
    onSelect: () => {},
  },
  render: Template,
};

export const Unselected: Story = {
  args: {
    label: '분과',
    options: CATEGORY_OPTIONS,
    value: '',
    onSelect: () => {},
  },
  render: Template,
};
