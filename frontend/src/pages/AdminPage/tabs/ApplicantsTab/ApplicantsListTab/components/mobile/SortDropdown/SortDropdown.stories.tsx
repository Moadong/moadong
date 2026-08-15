import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SortDropdown, { SortValue } from './SortDropdown';

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/SortDropdown',
  component: SortDropdown,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div
        style={{
          width: 375,
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SortDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (args: React.ComponentProps<typeof SortDropdown>) => {
  const [value, setValue] = useState<SortValue>(args.value);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SortDropdown
      {...args}
      value={value}
      onChange={setValue}
      isOpen={isOpen}
      onToggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export const Default: Story = {
  args: {
    value: 'date',
    onChange: () => {},
    isOpen: false,
    onToggle: () => {},
  },
  render: (args) => <Interactive {...args} />,
};

export const NameSorted: Story = {
  args: {
    value: 'name',
    onChange: () => {},
    isOpen: false,
    onToggle: () => {},
  },
  render: (args) => <Interactive {...args} />,
};
