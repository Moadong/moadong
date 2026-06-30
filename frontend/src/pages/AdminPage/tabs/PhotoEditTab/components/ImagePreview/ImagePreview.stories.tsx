import type { Meta, StoryObj } from '@storybook/react';
import { ImagePreview } from './ImagePreview';

const SAMPLE_IMAGE = 'https://picsum.photos/seed/moadong/400/500';

const meta = {
  title: 'Admin/PhotoEditTab/ImagePreview',
  component: ImagePreview,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 180 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    image: SAMPLE_IMAGE,
    onDelete: () => {},
  },
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Uploaded: Story = {};

export const Pending: Story = {
  args: { status: 'pending' },
};

export const Uploading: Story = {
  args: { status: 'uploading' },
};

export const Failed: Story = {
  args: {
    status: 'failed',
    onRetry: () => {},
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
