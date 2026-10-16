import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { CustomEventType } from '@/types/club';
import SegmentTabs from './SegmentTabs';

const meta = {
  title: 'Admin/Calendar/SegmentTabs',
  component: SegmentTabs,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SegmentTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  const [value, setValue] = useState<CustomEventType>('RECURRING');
  return (
    <div
      style={{
        width: 340,
        background: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
      }}
    >
      <SegmentTabs value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  args: { value: 'SINGLE', onChange: () => {} },
  render: () => <Template />,
};
