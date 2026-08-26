import type { Meta, StoryObj } from '@storybook/react';
import DisconnectConfirmModal from './DisconnectConfirmModal';

const meta = {
  title: 'Admin/Calendar/DisconnectConfirmModal',
  component: DisconnectConfirmModal,
  parameters: { layout: 'fullscreen' },
  args: { isOpen: true, onClose: () => {}, onConfirm: () => {} },
} satisfies Meta<typeof DisconnectConfirmModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
