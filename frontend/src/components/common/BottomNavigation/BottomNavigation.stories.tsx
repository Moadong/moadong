import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import BottomNavigation from './BottomNavigation';

const meta = {
  title: 'Components/Common/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '앱 네이티브 바텀탭을 웹으로 옮긴 하단 네비게이션입니다. (홈 / 동아리 / 홍보 / 메뉴) 개편을 받지 않은 사용자(main_redesign control 등)에게는 동아리 대신 구독 탭이 들어갑니다.',
      },
    },
  },
  args: { showClubsTab: true },
  tags: ['autodocs'],
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Clubs: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/clubs']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Promotions: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/promotions']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export const Menu: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/menu']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

/** 개편을 받지 않은 사용자: 동아리 자리에 구독 탭 */
export const Control: Story = {
  args: { showClubsTab: false },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/subscriptions']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

/** 홍보 게시판에 확인하지 않은 새 글이 있을 때 '홍보' 탭에 점이 붙는다 */
export const WithPromotionNotification: Story = {
  args: { hasPromotionNotification: true },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};
