import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ApplicationMenu from './ApplicationMenu';

const meta = {
  title: 'Pages/AdminPage/components/ApplicationMenu',
  component: ApplicationMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 200, height: 130 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationMenu>;

export default meta;
type Story = StoryObj<typeof ApplicationMenu>;

const InteractiveTemplate = ({ initialActive }: { initialActive: boolean }) => {
  const [isActive, setIsActive] = useState(initialActive);

  return (
    <div style={{ position: 'relative', width: 200, height: 130 }}>
      <ApplicationMenu
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
