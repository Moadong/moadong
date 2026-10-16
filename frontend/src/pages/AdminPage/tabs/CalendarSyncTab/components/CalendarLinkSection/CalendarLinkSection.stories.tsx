import type { Meta, StoryObj } from '@storybook/react';
import CalendarLinkCard, {
  type CalendarLinkEvent,
} from '../CalendarLinkCard/CalendarLinkCard';
import CalendarLinkSection from './CalendarLinkSection';

const meta = {
  title: 'Admin/Calendar/CalendarLinkSection',
  component: CalendarLinkSection,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 340, background: '#F5F5F5', padding: 16 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CalendarLinkSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const EVENTS: CalendarLinkEvent[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index),
  date: '2026. 07. 30',
  title: '정기모ㅊㅊㅊㅊㅊㅊㅊㅊ임ㅓㅓㅓ',
}));

export const NotConnected: Story = {
  args: { children: null },
  render: () => (
    <CalendarLinkSection>
      <CalendarLinkCard
        title='Google 캘린더'
        description='Google 계정을 연동하여 캘린더를 가져오세요'
        status='idle'
        onButtonClick={() => {}}
      />
      <CalendarLinkCard
        title='Notion 캘린더'
        description='Notion 계정을 연동하여 캘린더를 가져오세요'
        status='idle'
        onButtonClick={() => {}}
      />
    </CalendarLinkSection>
  ),
};

export const Connected: Story = {
  args: { children: null },
  render: () => (
    <CalendarLinkSection>
      <CalendarLinkCard
        title='Google 캘린더'
        description='Google 계정을 연동하여 캘린더를 가져오세요'
        status='connected'
        onButtonClick={() => {}}
        events={EVENTS}
      />
      <CalendarLinkCard
        title='Notion 캘린더'
        description='Notion 계정을 연동하여 캘린더를 가져오세요'
        status='connected'
        onButtonClick={() => {}}
        events={EVENTS}
      />
    </CalendarLinkSection>
  ),
};
