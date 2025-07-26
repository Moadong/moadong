import { useCallback } from 'react';

export default function useModalNavigation(
  currentIndex: number,
  total: number,
  setIndex: (index: number) => void,
) {
  const handlePrev = useCallback(() => {
    setIndex(currentIndex === 0 ? total - 1 : currentIndex - 1);
  }, [currentIndex, total, setIndex]);

  const handleNext = useCallback(() => {
    setIndex(currentIndex === total - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, total, setIndex]);

  return { handlePrev, handleNext };
}
