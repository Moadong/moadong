import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextType {
  keyword: string;
  setKeyword: (keyword: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

interface SearchProviderProps {
  children: ReactNode;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [keyword, setKeyword] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  return (
    <SearchContext.Provider
      value={{
        keyword,
        setKeyword,
        inputValue,
        setInputValue,
      }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
