import { useCallback, useEffect, useState } from 'react';

interface ScrollTriggerOptions {
  threshold?: number;
  direction?: 'up' | 'down';
  passive?: boolean;
  onChange?: (next: boolean) => void;
}

export const useScrollTrigger = ({
  threshold = 10,
  direction = 'down',
  passive = true,
  onChange,
}: ScrollTriggerOptions = {}) => {
  const [isTriggered, setIsTriggered] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const shouldShowButton =
      direction === 'down' ? scrollY > threshold : scrollY < threshold;

    setIsTriggered((prev) => {
      if (shouldShowButton === prev) return prev;
      onChange?.(shouldShowButton);
      return shouldShowButton;
    });
  }, [direction, threshold, onChange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, passive]);

  return { isTriggered };
};
