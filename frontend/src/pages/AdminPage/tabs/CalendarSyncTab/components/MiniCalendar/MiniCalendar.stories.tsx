import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MiniCalendar from './MiniCalendar';

const meta = {
  title: 'Admin/Calendar/MiniCalendar',
  component: MiniCalendar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MiniCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperStyle = {
  width: 340,
  background: '#F5F5F5',
  padding: 16,
  borderRadius: 16,
};

const SingleTemplate = () => {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [selected, setSelected] = useState('2026-03-16');
  return (
    <div style={wrapperStyle}>
      <MiniCalendar
        month={month}
        onMonthChange={setMonth}
        mode='single'
        selectedDate={selected}
        onSelectDate={setSelected}
      />
    </div>
  );
};

const RangeTemplate = () => {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [range, setRange] = useState<{ start?: string; end?: string }>({
    start: '2026-03-16',
    end: '2026-03-20',
  });
  const handleSelect = (dateKey: string) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: dateKey };
      }
      if (dateKey < prev.start) return { start: dateKey, end: prev.start };
      return { start: prev.start, end: dateKey };
    });
  };
  return (
    <div style={wrapperStyle}>
      <MiniCalendar
        month={month}
        onMonthChange={setMonth}
        mode='range'
        rangeStart={range.start}
        rangeEnd={range.end}
        onSelectDate={handleSelect}
      />
    </div>
  );
};

const MultiTemplate = () => {
  const [month, setMonth] = useState(new Date(2026, 2, 1));
  const [dates, setDates] = useState<string[]>([
    '2026-03-10',
    '2026-03-16',
    '2026-03-17',
    '2026-03-20',
    '2026-03-24',
    '2026-03-31',
  ]);
  const toggle = (dateKey: string) =>
    setDates((prev) =>
      prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey],
    );
  return (
    <div style={wrapperStyle}>
      <MiniCalendar
        month={month}
        onMonthChange={setMonth}
        mode='multi'
        selectedDates={dates}
        onSelectDate={toggle}
      />
    </div>
  );
};

const baseArgs = {
  month: new Date(2026, 2, 1),
  onMonthChange: () => {},
  onSelectDate: () => {},
};

export const Single: Story = {
  args: { ...baseArgs, mode: 'single' },
  render: () => <SingleTemplate />,
};

export const Range: Story = {
  args: { ...baseArgs, mode: 'range' },
  render: () => <RangeTemplate />,
};

export const Multi: Story = {
  args: { ...baseArgs, mode: 'multi' },
  render: () => <MultiTemplate />,
};
