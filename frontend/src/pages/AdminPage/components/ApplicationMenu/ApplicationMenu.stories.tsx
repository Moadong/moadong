import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ApplicationMenu from './ApplicationMenu';

const meta = {
  title: 'Pages/AdminPage/components/ApplicationMenu',
  component: ApplicationMenu,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 200, height: 160 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onDelete: () => {},
  },
  render: (args) => {
    const [isActive, setIsActive] = useState(args.isActive);

    useEffect(() => {
      setIsActive(args.isActive);
    }, [args.isActive]);

    return (
      <ApplicationMenu
        {...args}
        isActive={isActive}
        onToggleStatus={() => setIsActive((prev) => !prev)}
        onEdit={() => console.log('edit')}
        onDuplicate={() => console.log('duplicate')}
      />
    );
  },
} satisfies Meta<typeof ApplicationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { isActive: true },
};

export const Inactive: Story = {
  args: { isActive: false },
};
