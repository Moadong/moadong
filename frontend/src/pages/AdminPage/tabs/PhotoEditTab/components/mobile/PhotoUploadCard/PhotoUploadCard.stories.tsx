import type { Meta, StoryObj } from '@storybook/react';
import PhotoUploadCard from './PhotoUploadCard';

const meta = {
  title:
    'Pages/AdminPage/tabs/PhotoEditTab/components/mobile/PhotoUploadCard',
  component: PhotoUploadCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '335px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PhotoUploadCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    count: 0,
    disabled: false,
    onClick: () => {},
  },
};

export const Partial: Story = {
  args: {
    count: 8,
    disabled: false,
    onClick: () => {},
  },
};

export const Full: Story = {
  args: {
    count: 15,
    disabled: true,
    onClick: () => {},
  },
};
