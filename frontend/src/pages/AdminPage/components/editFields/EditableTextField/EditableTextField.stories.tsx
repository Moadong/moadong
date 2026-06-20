import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EditableTextField from './EditableTextField';

const meta = {
  title: 'Pages/AdminPage/Components/editFields/EditableTextField',
  component: EditableTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableTextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: any) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <div style={{ width: 335 }}>
      <EditableTextField
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
      />
    </div>
  );
};

export const WithValue: Story = {
  args: {
    label: '동아리명',
    value: 'WAP',
    onChange: () => {},
    onClear: () => {},
  },
  render: Template,
};

export const Empty: Story = {
  args: { label: '동아리명', value: '', onChange: () => {}, onClear: () => {} },
  render: Template,
};

export const LongValue: Story = {
  args: {
    label: '동아리소개',
    value:
      '한줄소개 한줄소개 한줄. 소개한줄소개한줄소개한줄소개한줄소개한줄소개',
    onChange: () => {},
    onClear: () => {},
  },
  render: Template,
};
