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
          '앱 네이티브 바텀탭을 웹으로 옮긴 하단 네비게이션입니다. (홈 / 구독 / 메뉴)',
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

export const Subscriptions: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/subscriptions']}>
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
