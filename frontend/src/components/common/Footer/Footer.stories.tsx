import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

const meta = {
  title: 'Components/Common/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [(Story) => <Story />],
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'ipad',
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone6',
    },
  },
};
