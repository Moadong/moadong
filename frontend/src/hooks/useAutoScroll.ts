import { useRef } from 'react';

const useAutoScroll = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>(
    new Array(4).fill(null),
  );

  const scrollToSection = (index: number) => {
    if (sectionRefs.current[index]) {
      const element = sectionRefs.current[index];
      const yOffset = -110;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY + yOffset,
        behavior: 'smooth',
      });
    }
  };

  return { sectionRefs, scrollToSection };
};

export default useAutoScroll;
