import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import SearchBox from './SearchBox';

const meta = {
  title: 'Pages/MainPage/Components/SearchBox',
  component: SearchBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '메인 페이지 검색 입력 영역입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/search']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
