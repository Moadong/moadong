import type { Meta, StoryObj } from '@storybook/react';
import addLargeIcon from '@/assets/images/icons/add_large_icon.svg';
import MobileFloatingButton from './MobileFloatingButton';

const meta = {
  title: 'Pages/AdminPage/components/MobileFloatingButton',
  component: MobileFloatingButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 320, height: 200 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    bottom: {
      control: 'text',
      description:
        'CSS bottom 값 (기본: calc(24px + env(safe-area-inset-bottom)))',
    },
  },
} satisfies Meta<typeof MobileFloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: addLargeIcon,
    ariaLabel: '항목 추가',
    onClick: () => console.log('clicked'),
  },
};
