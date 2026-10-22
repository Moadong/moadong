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
          '앱 네이티브 바텀탭을 웹으로 옮긴 하단 네비게이션입니다. (홈 / 구독 / 홍보 / 메뉴)',
      },
    },
  },
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

export const Subscriptions: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/subscriptions']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

const withHomeRouter: Story['decorators'] = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
      <Story />
    </MemoryRouter>
  ),
];

/** 첫 방문이고 홍보 글이 있으면 '홍보' 탭에 점이 붙는다 */
export const WithPromotionDot: Story = {
  args: { promotionNotification: 'dot' },
  decorators: withHomeRouter,
};

/** 마지막 확인 이후 새로 생성된 홍보 글 수가 '홍보' 탭에 붙는다 */
export const WithPromotionCount: Story = {
  args: { promotionNotification: 3 },
  decorators: withHomeRouter,
};

/** 새 글이 10개 이상이면 9+로 표시한다 */
export const WithPromotionCountOverflow: Story = {
  args: { promotionNotification: 12 },
  decorators: withHomeRouter,
};
