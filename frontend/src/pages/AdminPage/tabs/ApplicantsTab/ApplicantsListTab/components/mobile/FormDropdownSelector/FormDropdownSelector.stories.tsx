import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { asApplicationFormId } from '@/types/branded';
import FormDropdownSelector from './FormDropdownSelector';

const mockForms = [
  {
    id: asApplicationFormId('form-1'),
    title: '2025 봄학기 신입 모집',
    editedAt: '2025-03-01',
    status: 'ACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-2'),
    title: '2024 가을학기 신입 모집',
    editedAt: '2024-09-01',
    status: 'INACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-3'),
    title: '2024 봄학기 신입 모집',
    editedAt: '2024-03-01',
    status: 'INACTIVE' as const,
  },
];

const mockFormsWithScroll = [
  {
    id: asApplicationFormId('form-1'),
    title: '2025 봄학기 신입 모집',
    editedAt: '2025-03-01',
    status: 'ACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-2'),
    title: '2024 가을학기 신입 모집',
    editedAt: '2024-09-01',
    status: 'INACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-3'),
    title: '2024 봄학기 신입 모집',
    editedAt: '2024-03-01',
    status: 'INACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-4'),
    title: '2023 가을학기 신입 모집',
    editedAt: '2023-09-01',
    status: 'INACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-5'),
    title: '2023 봄학기 신입 모집',
    editedAt: '2023-03-01',
    status: 'INACTIVE' as const,
  },
  {
    id: asApplicationFormId('form-6'),
    title: '2022 가을학기 신입 모집',
    editedAt: '2022-09-01',
    status: 'INACTIVE' as const,
  },
];

const meta = {
  title:
    'Pages/AdminPage/tabs/ApplicantsTab/ApplicantsListTab/components/mobile/FormDropdownSelector',
  component: FormDropdownSelector,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 335, position: 'relative', paddingBottom: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormDropdownSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const Interactive = (
  args: React.ComponentProps<typeof FormDropdownSelector>,
) => {
  const [selectedId, setSelectedId] = useState(args.selectedFormId);
  return (
    <FormDropdownSelector
      {...args}
      selectedFormId={selectedId}
      onSelect={setSelectedId}
    />
  );
};

export const Default: Story = {
  args: {
    forms: mockForms,
    selectedFormId: asApplicationFormId('form-1'),
    onSelect: () => {},
  },
  render: (args) => <Interactive {...args} />,
};

export const SingleItem: Story = {
  args: {
    forms: [mockForms[0]],
    selectedFormId: asApplicationFormId('form-1'),
    onSelect: () => {},
  },
  render: (args) => <Interactive {...args} />,
};

export const TwoItems: Story = {
  args: {
    forms: mockForms.slice(0, 2),
    selectedFormId: asApplicationFormId('form-1'),
    onSelect: () => {},
  },
  render: (args) => <Interactive {...args} />,
};

export const WithScroll: Story = {
  args: {
    forms: mockFormsWithScroll,
    selectedFormId: asApplicationFormId('form-1'),
    onSelect: () => {},
  },
  render: (args) => <Interactive {...args} />,
};

export const Empty: Story = {
  args: {
    forms: [],
    selectedFormId: asApplicationFormId(''),
    onSelect: () => {},
  },
  render: (args) => <Interactive {...args} />,
};
