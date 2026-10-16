import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApplicationFormMode } from '@/types/application';
import ApplicationTypeTab from './ApplicationTypeTab';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicationTab/ApplicationEditTab/components/mobile/ApplicationTypeTab',
  component: ApplicationTypeTab,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationTypeTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeMode: ApplicationFormMode.INTERNAL,
    onChange: () => {},
  },
  render: (args) => {
    const [activeMode, setActiveMode] = useState(args.activeMode);
    return (
      <ApplicationTypeTab
        activeMode={activeMode}
        onChange={(mode) => {
          setActiveMode(mode);
          args.onChange(mode);
        }}
      />
    );
  },
};

export const ExternalActive: Story = {
  args: {
    activeMode: ApplicationFormMode.EXTERNAL,
    onChange: () => {},
  },
  render: (args) => {
    const [activeMode, setActiveMode] = useState(args.activeMode);
    return (
      <ApplicationTypeTab
        activeMode={activeMode}
        onChange={(mode) => {
          setActiveMode(mode);
          args.onChange(mode);
        }}
      />
    );
  },
};
