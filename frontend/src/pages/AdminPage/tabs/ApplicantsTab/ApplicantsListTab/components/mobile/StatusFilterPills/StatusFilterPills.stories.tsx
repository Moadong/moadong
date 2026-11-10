import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationStatus } from '@/types/applicants';
import StatusFilterPills, { FilterValue } from './StatusFilterPills';
import figmaMapping from './StatusFilterPills.figma.json';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusFilterPills',
  component: StatusFilterPills,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 261, background: '#fff' }}>
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
  parameters: {
    design: {
      type: 'figma',
      url: figmaMapping['StatusFilterPills/Default'].figma,
    },
  },
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
