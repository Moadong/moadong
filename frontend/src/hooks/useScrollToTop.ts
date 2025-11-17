import { useEffect, useState } from "react";

interface ScrollTriggerOptions{
  threshold?: number;
  direction?: 'up' | 'down';
  passive?: boolean;
  onChange?: (next:boolean) => void;
}


export const useScrollToTop = ({
  threshold = 10,
  direction = 'down',
  passive = true,
  onChange,
}: ScrollTriggerOptions = {}) => {
  const [isTriggered, setIsTriggered] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const shouldShowButton = 
      direction === 'down' 
        ? scrollY > threshold 
        : scrollY < threshold;
  
    if (shouldShowButton === isTriggered) return; 
    
    setIsTriggered(shouldShowButton);
    onChange?.(shouldShowButton);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [passive, direction, threshold, isTriggered]);

  return { isTriggered };
};