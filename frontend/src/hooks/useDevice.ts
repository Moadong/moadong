import { useEffect, useState } from 'react';
import { BREAKPOINT } from '@/styles/mediaQuery';

const useDevice = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    isMobile: width <= BREAKPOINT.mobile, // ≤ 500
    isTablet: width > BREAKPOINT.mobile && width <= BREAKPOINT.tablet, // 501 ~ 700
    isLaptop: width > BREAKPOINT.tablet && width <= BREAKPOINT.laptop, // 701 ~ 1280
    isDesktop: width > BREAKPOINT.laptop, // ≥ 1281
  };
};

export default useDevice;
