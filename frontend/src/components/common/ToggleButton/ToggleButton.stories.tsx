import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ToggleButton from './ToggleButton';

const meta = {
  title: 'Components/Common/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: 'boolean',
      description: '선택된 상태인지 여부입니다. 배경색과 글자색이 바뀝니다.',
    },
    children: {
      control: 'text',
      description: '버튼 내부에 들어갈 텍스트를 지정합니다.',
    },
    onClick: {
      description: '버튼 클릭 시 실행될 함수입니다.',
    },
  },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 여러 개를 나란히 두고 하나만 고르는 필터 칩 형태로 쓰는 경우
const ToggleGroup = () => {
  const options = ['전체', '모집 중', '모집 예정', '모집 마감'];
  const [selected, setSelected] = useState(options[0]);

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map((option) => (
        <ToggleButton
          key={option}
          active={selected === option}
          onClick={() => setSelected(option)}
        >
          {option}
        </ToggleButton>
      ))}
    </div>
  );
};

// 선택되지 않은 기본 상태
export const Inactive: Story = {
  args: {
    active: false,
    children: '모집 중',
  },
};

// 선택된 상태
export const Active: Story = {
  args: {
    active: true,
    children: '모집 중',
  },
};

// 문구가 길어졌을 때의 모양
export const LongText: Story = {
  args: {
    active: true,
    children: '이번 학기 신입 부원을 모집하는 동아리만 보기',
  },
};

// 클릭할 때마다 선택이 바뀌는 그룹
export const Group: Story = {
  args: {
    active: false,
    children: null,
  },
  render: () => <ToggleGroup />,
};
