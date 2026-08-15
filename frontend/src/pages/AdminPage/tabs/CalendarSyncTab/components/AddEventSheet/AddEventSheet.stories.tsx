import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Button from '@/components/common/Button/Button';
import AddEventSheet from './AddEventSheet';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: 'Admin/Calendar/AddEventSheet',
  component: AddEventSheet,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof AddEventSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{ height: '100dvh', padding: 20 }}>
      <Button onClick={() => setIsOpen(true)}>일정 추가 시트 열기</Button>
      {isOpen && (
        <AddEventSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialDate='2026-03-16'
        />
      )}
    </div>
  );
};

export const Default: Story = {
  args: { isOpen: true, onClose: () => {}, initialDate: '2026-03-16' },
  render: () => <Template />,
};
