import { createContext, useContext, useState } from 'react';

const CategoryContext = createContext<{
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}>({
  selectedCategory: 'all',
  setSelectedCategory: () => {},
});

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
