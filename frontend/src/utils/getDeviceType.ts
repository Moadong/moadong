import { BREAKPOINT } from '@/styles/mediaQuery';

type DeviceType = 'mini_mobile' | 'mobile' | 'tablet' | 'laptop' | 'desktop';

const getDeviceType = (): DeviceType => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width <= BREAKPOINT.mini_mobile) return 'mini_mobile';
  if (width <= BREAKPOINT.mobile) return 'mobile';
  if (width <= BREAKPOINT.tablet) return 'tablet';
  if (width <= BREAKPOINT.laptop) return 'laptop';
  return 'desktop';
};

export default getDeviceType;
