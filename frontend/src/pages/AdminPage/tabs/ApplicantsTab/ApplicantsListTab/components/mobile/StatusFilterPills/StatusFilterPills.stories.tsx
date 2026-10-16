import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationStatus } from '@/types/applicants';
import StatusFilterPills, { FilterValue } from './StatusFilterPills';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusFilterPills',
  component: StatusFilterPills,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375, background: '#fff', padding: '16px 0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusFilterPills>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (args: React.ComponentProps<typeof StatusFilterPills>) => {
  const [selected, setSelected] = useState<FilterValue[]>(args.selected);
  return (
    <StatusFilterPills {...args} selected={selected} onChange={setSelected} />
  );
};

export const Default: Story = {
  args: { selected: ['ALL'], onChange: () => {} },
  render: (args) => <Interactive {...args} />,
};

export const MultiSelected: Story = {
  args: {
    selected: [ApplicationStatus.SUBMITTED, ApplicationStatus.ACCEPTED],
    onChange: () => {},
  },
  render: (args) => <Interactive {...args} />,
};
