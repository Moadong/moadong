import type { Meta, StoryObj } from '@storybook/react';
import BulkActionBar from './BulkActionBar';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/BulkActionBar',
  component: BulkActionBar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BulkActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {
  args: {
    enabled: false,
    onStatusChange: () => {},
    onDelete: () => {},
  },
};

export const Enabled: Story = {
  args: {
    enabled: true,
    onStatusChange: () => {},
    onDelete: () => {},
  },
};
