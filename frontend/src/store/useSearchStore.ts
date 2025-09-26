import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface SearchStore {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  resetSearch: () => void;
}

export const useSearchStore = create<SearchStore>()(
  subscribeWithSelector((set) => ({
    keyword: '',
    setKeyword: (keyword) => set({ keyword }),
    inputValue: '',
    setInputValue: (value) => set({ inputValue: value }),
    isSearching: false,
    setIsSearching: (isSearching) => set({ isSearching }),
    resetSearch: () => set({ keyword: '', inputValue: '', isSearching: false }),
  })),
);

export const useSearchKeyword = () => {
  const keyword = useSearchStore((state) => state.keyword);
  const setKeyword = useSearchStore((state) => state.setKeyword);
  return { keyword, setKeyword };
};

export const useSearchIsSearching = () => {
  const isSearching = useSearchStore((state) => state.isSearching);
  const setIsSearching = useSearchStore((state) => state.setIsSearching);
  return { isSearching, setIsSearching };
};

export const useSearchInput = () => {
  const inputValue = useSearchStore((state) => state.inputValue);
  const setInputValue = useSearchStore((state) => state.setInputValue);
  const setKeyword = useSearchStore((state) => state.setKeyword);
  const setIsSearching = useSearchStore((state) => state.setIsSearching);

  return { inputValue, setInputValue, setKeyword, setIsSearching };
};
