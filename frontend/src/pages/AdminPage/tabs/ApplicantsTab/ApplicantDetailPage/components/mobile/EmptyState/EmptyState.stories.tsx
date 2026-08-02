import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantDetailPage/components/mobile/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onCreateForm: () => alert('지원서 만들기'),
  },
};
