import { createContext, useContext, useState } from 'react';

const CategoryContext = createContext<{
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}>({
  selectedCategory: 'all',
  setSelectedCategory: () => {},
});

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error(
      'useCategory는 CategoryProvider 내부에서만 사용할 수 있습니다',
    );
  return context;
};

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
