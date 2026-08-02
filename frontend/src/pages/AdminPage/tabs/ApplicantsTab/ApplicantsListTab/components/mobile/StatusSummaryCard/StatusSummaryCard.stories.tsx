import type { Meta, StoryObj } from '@storybook/react';
import StatusSummaryCard from './StatusSummaryCard';

const meta = {
  title: 'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/StatusSummaryCard',
  component: StatusSummaryCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375, padding: '0 20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      total: 50,
      reviewRequired: 30,
      scheduledInterview: 15,
      accepted: 5,
      declined: 0,
    },
  },
};

export const AllZero: Story = {
  args: {
    data: {
      total: 0,
      reviewRequired: 0,
      scheduledInterview: 0,
      accepted: 0,
      declined: 0,
    },
  },
};
