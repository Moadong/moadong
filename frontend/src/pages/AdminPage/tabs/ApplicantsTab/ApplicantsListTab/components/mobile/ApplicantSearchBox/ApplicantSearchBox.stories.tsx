import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ApplicantSearchBox from './ApplicantSearchBox';

const meta = {
  title: 'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/ApplicantSearchBox',
  component: ApplicantSearchBox,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 335 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicantSearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (args: React.ComponentProps<typeof ApplicantSearchBox>) => {
  const [value, setValue] = useState(args.value);
  return <ApplicantSearchBox {...args} value={value} onChange={setValue} />;
};

export const Empty: Story = {
  args: { value: '', onChange: () => {} },
  render: (args) => <Interactive {...args} />,
};

export const WithValue: Story = {
  args: { value: '홍길동', onChange: () => {} },
  render: (args) => <Interactive {...args} />,
};

const FocusedInteractive = (args: React.ComponentProps<typeof ApplicantSearchBox>) => {
  const [value, setValue] = useState(args.value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.querySelector('input')?.focus();
  }, []);

  return (
    <div ref={ref}>
      <ApplicantSearchBox {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Focused: Story = {
  args: { value: '', onChange: () => {} },
  render: (args) => <FocusedInteractive {...args} />,
};
