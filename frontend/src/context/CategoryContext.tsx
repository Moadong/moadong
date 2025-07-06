import { createContext, useContext, useEffect, useState } from 'react';

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
  const [selectedCategory, setSelectedCategoryState] = useState(() => {
    return localStorage.getItem('selectedCategory') || 'all';
  });

  const setSelectedCategory = (category: string) => {
    setSelectedCategoryState(category);
    localStorage.setItem('selectedCategory', category);
  };

  useEffect(() => {
    const handler = () => {
      setSelectedCategoryState(
        localStorage.getItem('selectedCategory') || 'all',
      );
    };
    window.addEventListener('storage', handler);

    const handleBeforeUnload = () => {
      localStorage.removeItem('selectedCategory');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
