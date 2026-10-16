import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TitleInput from './TitleInput';

const meta = {
  title: 'Admin/Calendar/TitleInput',
  component: TitleInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TitleInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = ({ initial }: { initial: string }) => {
  const [value, setValue] = useState(initial);
  return (
    <div
      style={{
        width: 340,
        background: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
      }}
    >
      <TitleInput value={value} onChange={setValue} />
    </div>
  );
};

export const Filled: Story = {
  args: { value: '정기모임', onChange: () => {} },
  render: () => <Template initial='정기모임' />,
};

export const Empty: Story = {
  args: { value: '', onChange: () => {} },
  render: () => <Template initial='' />,
};
