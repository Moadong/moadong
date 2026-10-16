import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import CalendarLinkCard, { type CalendarLinkEvent } from './CalendarLinkCard';

const meta = {
  title: 'Admin/Calendar/CalendarLinkCard',
  component: CalendarLinkCard,
  parameters: { layout: 'centered' },
  args: {
    title: 'Google 캘린더',
    description: 'Google 계정을 연동하여 캘린더를 가져오세요',
    onButtonClick: () => {},
  },
  decorators: [
    (Story) => (
      <div style={{ width: 340, background: '#F5F5F5', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarLinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const EVENTS: CalendarLinkEvent[] = [
  { id: '1', date: '2026. 07. 30', title: '정기모ㅊㅊㅊㅊㅊㅊㅊㅊ임ㅓㅓㅓ' },
  { id: '2', date: '2026. 07. 30', title: '2....' },
  { id: '3', date: '2026. 07. 30', title: '정기모임' },
  { id: '4', title: '안녕안녕하세요' },
  { id: '5', title: '아ㅏㅏㅏㅏ 무나워마' },
  { id: '6', date: '2026. 07. 30', title: '정기모임' },
  { id: '7', date: '2026. 07. 30', title: '정기모임' },
  { id: '8', date: '2026. 07. 30', title: '정기모임' },
  { id: '9', date: '2026. 07. 30', title: '정기모임' },
];

export const NotConnected: Story = {
  args: { status: 'idle' },
};

/** 마우스를 올리면 버튼이 '취소'로 바뀐다 */
export const Loading: Story = {
  args: { status: 'loading' },
};

export const Connected: Story = {
  args: { status: 'connected' },
};

/** 연동되면 일정 목록이 함께 보인다 (목록이 길면 스크롤) */
export const ConnectedWithEvents: Story = {
  args: { status: 'connected', events: EVENTS },
  render: (args) => {
    const [checkedEventIds, setCheckedEventIds] = useState<string[]>([]);
    return (
      <CalendarLinkCard
        {...args}
        checkedEventIds={checkedEventIds}
        onToggleEvent={(eventId) =>
          setCheckedEventIds((prev) =>
            prev.includes(eventId)
              ? prev.filter((id) => id !== eventId)
              : [...prev, eventId],
          )
        }
      />
    );
  },
};
