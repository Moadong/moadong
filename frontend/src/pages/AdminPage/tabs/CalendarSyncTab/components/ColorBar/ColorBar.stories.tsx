import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { CalendarEventColor } from '@/types/club';
import ColorBar from './ColorBar';

const meta = {
  title: 'Admin/Calendar/ColorBar',
  component: ColorBar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ColorBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  const [color, setColor] = useState<CalendarEventColor>('PINK');
  return (
    <div
      style={{
        width: 340,
        background: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
      }}
    >
      <ColorBar value={color} onChange={setColor} />
    </div>
  );
};

export const Default: Story = {
  args: { value: 'PINK', onChange: () => {} },
  render: () => <Template />,
};
