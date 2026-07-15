import type { Meta, StoryObj } from '@storybook/react';
import EditField from './EditField';

const meta = {
  title: 'Pages/AdminPage/tabs/ClubInfoEditTab/components/mobile/EditField',
  component: EditField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EditField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '동아리명',
    children: null,
  },
};

export const Active: Story = {
  args: {
    label: '동아리명',
    children: null,
  },
};
