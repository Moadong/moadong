import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TextField from './TextField';

const meta = {
  title: 'Pages/AdminPage/Components/editFields/TextField',
  component: TextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <div style={{ width: 335 }}>
        <Story key={context.id} />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithValue: Story = {
  args: {
    label: '동아리명',
    value: 'WAP',
    onChange: () => {},
    onClear: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <TextField
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
      />
    );
  },
};

export const Empty: Story = {
  args: {
    label: '동아리명',
    value: '',
    onChange: () => {},
    onClear: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <TextField
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
      />
    );
  },
};

export const LongValue: Story = {
  args: {
    label: '동아리소개',
    value: '한줄소개 한줄소개 한줄. 소개한줄소개한줄소개한줄소개한줄소개한줄소개',
    onChange: () => {},
    onClear: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <TextField
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue('')}
      />
    );
  },
};
