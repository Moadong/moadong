import { useEffect, useState } from "react";

export const useScrollToTop = () => {
  const [isVisibleButton, setIsVisibleButton] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 500) {
      setIsVisibleButton(true);
    } else {
      setIsVisibleButton(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
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