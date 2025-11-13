import { useEffect, useState } from "react";

const SCROLL_TO_TOP_THRESHOLD = 500;

export const useScrollToTop = () => {
  const [isVisibleButton, setIsVisibleButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > SCROLL_TO_TOP_THRESHOLD) {
      setIsVisibleButton(true);
    } else {
      setIsVisibleButton(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const moveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return {isVisibleButton, moveToTop}
};