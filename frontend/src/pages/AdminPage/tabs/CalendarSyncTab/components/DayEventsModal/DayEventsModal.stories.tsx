import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Button from '@/components/common/Button/Button';
import type { ClubCalendarEvent } from '@/types/club';
import {
  buildOccurrenceId,
  type CalendarEventOccurrence,
} from '@/utils/eventOccurrences';
import DayEventsModal from './DayEventsModal';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const meta = {
  title: 'Admin/Calendar/DayEventsModal',
  component: DayEventsModal,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof DayEventsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

const buildOccurrence = (
  event: ClubCalendarEvent,
  dateKey: string,
): CalendarEventOccurrence => ({
  occurrenceId: buildOccurrenceId(event.id, dateKey),
  eventId: event.id,
  dateKey,
  title: event.title,
  event,
});

const OCCURRENCES: CalendarEventOccurrence[] = [
  buildOccurrence(
    {
      id: 'seed-recurring',
      title: '정기모임',
      start: '2026-03-02',
      source: 'CUSTOM',
      eventType: 'RECURRING',
      color: 'PINK',
      recurrence: { frequency: 'WEEKLY', weekdays: [5, 6] },
    },
    '2026-03-20',
  ),
  buildOccurrence(
    {
      id: 'seed-single',
      title: '운영진 회의',
      start: '2026-03-20',
      source: 'CUSTOM',
      eventType: 'SINGLE',
      color: 'BLUE',
    },
    '2026-03-20',
  ),
];

const Template = ({
  occurrences,
}: {
  occurrences: CalendarEventOccurrence[];
}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div style={{ height: '100dvh', padding: 20 }}>
      <Button onClick={() => setIsOpen(true)}>일정 목록 열기</Button>
      <DayEventsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        dateKey='2026-03-20'
        occurrences={occurrences}
        onAddEvent={() => {}}
      />
    </div>
  );
};

const baseArgs = {
  isOpen: true,
  onClose: () => {},
  dateKey: '2026-03-20',
  occurrences: OCCURRENCES,
  onAddEvent: () => {},
};

export const WithEvents: Story = {
  args: baseArgs,
  render: () => <Template occurrences={OCCURRENCES} />,
};

export const EmptyDay: Story = {
  args: { ...baseArgs, occurrences: [] },
  render: () => <Template occurrences={[]} />,
};
