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

const InteractiveTemplate = ({
  initialActive,
  showEdit,
  showDuplicate,
}: {
  initialActive: boolean;
  showEdit?: boolean;
  showDuplicate?: boolean;
}) => {
  const [isActive, setIsActive] = useState(initialActive);

  return (
    <div style={{ position: 'relative', width: 200, height: 130 }}>
      <ApplicationFormContextMenu
        isActive={isActive}
        onToggleStatus={() => setIsActive((prev) => !prev)}
        onEdit={showEdit ? () => console.log('edit') : undefined}
        onDuplicate={showDuplicate ? () => console.log('duplicate') : undefined}
        onDelete={() => console.log('delete')}
      />
    </div>
  );
};

export const ActiveWithEdit: Story = {
  render: () => <InteractiveTemplate initialActive={true} showEdit />,
};

export const InactiveWithEdit: Story = {
  render: () => <InteractiveTemplate initialActive={false} showEdit />,
};
