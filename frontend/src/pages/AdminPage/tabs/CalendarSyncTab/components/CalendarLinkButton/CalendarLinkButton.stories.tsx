import type { Meta, StoryObj } from '@storybook/react';
import CalendarLinkButton from './CalendarLinkButton';

const meta = {
  title: 'Admin/Calendar/CalendarLinkButton',
  component: CalendarLinkButton,
  parameters: { layout: 'centered' },
  args: { onClick: () => {} },
} satisfies Meta<typeof CalendarLinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { status: 'idle' },
};

/** 마우스를 올리면 '취소'로 바뀐다 */
export const Loading: Story = {
  args: { status: 'loading' },
};

export const Connected: Story = {
  args: { status: 'connected' },
};
