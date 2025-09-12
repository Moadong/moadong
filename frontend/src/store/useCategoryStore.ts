import { create } from 'zustand';
import {
  persist,
  subscribeWithSelector,
  createJSONStorage,
} from 'zustand/middleware';

interface CategoryStore {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedCategory: 'all',
        setSelectedCategory: (category) => set({ selectedCategory: category }),
      }),
      {
        name: 'category-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

export const useSelectedCategory = () => {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  const setSelectedCategory = useCategoryStore(
    (state) => state.setSelectedCategory,
  );
  return { selectedCategory, setSelectedCategory };
};
