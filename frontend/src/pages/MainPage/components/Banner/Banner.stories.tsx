import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import Banner from './Banner';

const setViewportWidth = (width: number) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

const meta = {
  title: 'Pages/MainPage/Components/Banner',
  component: Banner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '메인 페이지 상단 배너 슬라이더입니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(1280);
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};

export const Mobile: Story = {
  decorators: [
    (Story) => {
      setViewportWidth(375);
      return (
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};
