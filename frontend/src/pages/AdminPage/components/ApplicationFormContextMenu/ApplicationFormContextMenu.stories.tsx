import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ApplicationFormContextMenu from './ApplicationFormContextMenu';

const meta = {
  title: 'Pages/AdminPage/components/ApplicationFormContextMenu',
  component: ApplicationFormContextMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 200, height: 130 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationFormContextMenu>;

export default meta;
type Story = StoryObj<typeof ApplicationFormContextMenu>;

const InteractiveTemplate = ({ initialActive }: { initialActive: boolean }) => {
  const [isActive, setIsActive] = useState(initialActive);

  return (
    <div style={{ position: 'relative', width: 200, height: 130 }}>
      <ApplicationFormContextMenu
        isActive={isActive}
        onToggleStatus={() => setIsActive((prev) => !prev)}
        onEdit={() => console.log('edit')}
        onDelete={() => console.log('delete')}
      />
    </div>
  );
};

export const Active: Story = {
  render: () => <InteractiveTemplate initialActive={true} />,
};

export const Inactive: Story = {
  render: () => <InteractiveTemplate initialActive={false} />,
};
