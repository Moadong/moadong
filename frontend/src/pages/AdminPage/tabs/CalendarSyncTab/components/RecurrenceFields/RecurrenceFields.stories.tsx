import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { RecurrenceFrequency } from '@/types/club';
import RecurrenceFields from './RecurrenceFields';

const meta = {
  title: 'Admin/Calendar/RecurrenceFields',
  component: RecurrenceFields,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RecurrenceFields>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = ({ initialWeekdays }: { initialWeekdays: number[] }) => {
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('WEEKLY');
  const [weekdays, setWeekdays] = useState<number[]>(initialWeekdays);
  const toggleWeekday = (weekday: number) =>
    setWeekdays((prev) =>
      prev.includes(weekday)
        ? prev.filter((d) => d !== weekday)
        : [...prev, weekday],
    );
  return (
    <div
      style={{
        width: 340,
        background: '#F5F5F5',
        padding: 16,
        borderRadius: 16,
      }}
    >
      <RecurrenceFields
        frequency={frequency}
        onFrequencyChange={setFrequency}
        weekdays={weekdays}
        onToggleWeekday={toggleWeekday}
        startDate='2026-03-10'
        endDate={null}
        onOpenStartPicker={() => {}}
        onOpenEndPicker={() => {}}
      />
    </div>
  );
};

const baseArgs = {
  frequency: 'WEEKLY' as const,
  onFrequencyChange: () => {},
  weekdays: [],
  onToggleWeekday: () => {},
  startDate: '2026-03-10',
  endDate: null,
  onOpenStartPicker: () => {},
  onOpenEndPicker: () => {},
};

export const Weekly: Story = {
  args: baseArgs,
  render: () => <Template initialWeekdays={[5, 6]} />,
};
