import type { Meta, StoryObj } from '@storybook/react';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useSearchStore } from '@/store/useSearchStore';
import CategoryButtonList from './CategoryButtonList';

const resetStores = () => {
  useCategoryStore.setState({ selectedCategory: 'all' });
  useSearchStore.setState({ keyword: '', inputValue: '', isSearching: false });
  sessionStorage.removeItem('category-storage');
};

const meta = {
  title: 'Pages/MainPage/Components/CategoryButtonList',
  component: CategoryButtonList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '카테고리 필터 버튼 목록입니다.',
      },
    },
  },
  decorators: [
    (Story) => {
      resetStores();
      return <Story />;
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryButtonList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
