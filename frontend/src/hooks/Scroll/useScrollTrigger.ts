import { useCallback, useEffect, useRef, useState } from 'react';

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
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const prevScrollY = useRef(window.scrollY);

  const handleScroll = useCallback(() => {
    if (document.body.style.position === 'fixed') return;

    const scrollY = window.scrollY;
    const scrollingUp = scrollY < prevScrollY.current;
    prevScrollY.current = scrollY;

    const shouldShowButton =
      direction === 'down' ? scrollY > threshold : scrollY < threshold;

    setIsTriggered((prev) => {
      if (shouldShowButton === prev) return prev;
      onChange?.(shouldShowButton);
      return shouldShowButton;
    });

    setIsScrollingUp(scrollingUp && scrollY > threshold);
  }, [direction, threshold, onChange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, passive]);

  return { isTriggered, isScrollingUp };
};
