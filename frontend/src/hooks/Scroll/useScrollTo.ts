import { useCallback } from 'react';

interface ScrollToOptions {
  top?: number;
  behavior?: ScrollBehavior;
}

export const useScrollTo = () => {
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior });
  }, []);

  const scrollToElement = useCallback(
    (element: HTMLElement | null, offset: number = 0, behavior: ScrollBehavior = 'smooth') => {
      if (!element) return;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior,
      });
    },
    []
  );

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo({ behavior: 'smooth', ...options });
  }, []);

  return { scrollToTop, scrollToElement, scrollTo };
};
