import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EventCheckItem from './EventCheckItem';

const meta = {
  title: 'Admin/Calendar/EventCheckItem',
  component: EventCheckItem,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof EventCheckItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = ({
  initial,
  date,
  title,
}: {
  initial: boolean;
  date?: string;
  title: string;
}) => {
  const [checked, setChecked] = useState(initial);
  return (
    <div style={{ width: 206, background: '#FFFFFF', padding: 16 }}>
      <EventCheckItem
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        date={date}
        title={title}
      />
    </div>
  );
};

export const Unchecked: Story = {
  args: {
    checked: false,
    onChange: () => {},
    date: '2026. 07. 30',
    title: '정기모임',
  },
  render: () => (
    <Template initial={false} date='2026. 07. 30' title='정기모임' />
  ),
};

export const Checked: Story = {
  args: {
    checked: true,
    onChange: () => {},
    date: '2026. 07. 30',
    title: '정기모임',
  },
  render: () => <Template initial date='2026. 07. 30' title='정기모임' />,
};

/** 제목이 길면 한 줄로 말줄임 처리된다 */
export const LongTitle: Story = {
  args: {
    checked: false,
    onChange: () => {},
    date: '2026. 07. 30',
    title: '정기모ㅊㅊㅊㅊㅊㅊㅊㅊㅊ임ㅓㅓㅓ',
  },
  render: () => (
    <Template
      initial={false}
      date='2026. 07. 30'
      title='정기모ㅊㅊㅊㅊㅊㅊㅊㅊㅊ임ㅓㅓㅓ'
    />
  ),
};

/** 날짜가 없는 일정 */
export const NoDate: Story = {
  args: { checked: false, onChange: () => {}, title: '안녕안녕하세요' },
  render: () => <Template initial={false} title='안녕안녕하세요' />,
};
