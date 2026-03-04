import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import 'swiper/css';
import BoothMapSection from './BoothMapSection';

const meta = {
  title: 'Pages/FestivalPage/Components/BoothMapSection',
  component: BoothMapSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '동아리 소개 한마당 부스지도를 슬라이드로 보여주는 섹션입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof BoothMapSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
