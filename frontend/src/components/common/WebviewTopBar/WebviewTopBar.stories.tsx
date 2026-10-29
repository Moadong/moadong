import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import WebviewTopBar from './WebviewTopBar';

const meta = {
  title: 'Components/Common/WebviewTopBar',
  component: WebviewTopBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: '상단바 가운데에 표시할 제목입니다.',
    },
    onBack: {
      action: 'back',
      description:
        '뒤로가기 버튼 클릭 시 실행될 함수입니다. 없으면 앱 브릿지 → 브라우저 history → fallbackPath 순으로 이동합니다.',
    },
    fallbackPath: {
      control: 'text',
      description:
        '앱이 처리하지 않고 이전 화면도 없을 때 이동할 경로입니다. 기본값은 `/`입니다.',
    },
  },
} satisfies Meta<typeof WebviewTopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '동아리 상세',
    onBack: () => {},
  },
};

// 제목이 길어도 뒤로가기 버튼과 오른쪽 여백 사이에 가운데 정렬로 남는지 확인
export const LongTitle: Story = {
  args: {
    title: '모아동 중앙동아리 연합 신입 부원 모집 안내와 자주 묻는 질문',
    onBack: () => {},
  },
};

// onBack이 없는 경우. 컴포넌트가 window.history.state로 이전 화면을 판단해서
// 스토리에서는 history 분기를 재현할 수 없고 항상 fallbackPath로 이동한다.
export const WithFallbackPath: Story = {
  args: {
    title: '동아리 상세',
    fallbackPath: '/promotions',
  },
};
