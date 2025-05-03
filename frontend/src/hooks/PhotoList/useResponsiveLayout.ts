import { useEffect, useState, useMemo } from 'react';
import { DESKTOP_CARD_WIDTH, MOBILE_CARD_WIDTH } from '@/constants/photoLayout';

export const useResponsiveLayout = (
  ref: React.RefObject<HTMLElement | null>,
  breakPoint = 500,
) => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakPoint,
  );
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= breakPoint);
    const updateContainerWidth = () => {
      if (ref.current) {
        setContainerWidth(ref.current.offsetWidth);
      }
    };

    const handleResize = () => {
      updateIsMobile();
      updateContainerWidth();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref, breakPoint]);

  const cardWidth = useMemo(
    () => (isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH),
    [isMobile],
  );

  return { isMobile, containerWidth, cardWidth };
};
