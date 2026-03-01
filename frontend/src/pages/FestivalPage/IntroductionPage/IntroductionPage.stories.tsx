import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import 'swiper/css';
import IntroductionPage from './IntroductionPage';

const setViewportWidth = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const meta = {
  title: 'Pages/FestivalPage/IntroductionPage',
  component: IntroductionPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '동소한 부스지도를 슬라이드로 확인하는 소개 페이지입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/festival-introduction']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof IntroductionPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(375);
      return <Story />;
    },
  ],
};

export const Desktop: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(1024);
      return <Story />;
    },
  ],
};
