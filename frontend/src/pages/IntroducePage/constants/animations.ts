import type { Variants, Transition } from 'framer-motion';

export const transDefault: Transition = { duration: 0.5, ease: 'easeOut' };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: transDefault },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transDefault },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const scrollVariants: Variants = {
  scrolling: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
    transition: {
      ease: 'linear',
      duration: 40,
      repeat: Infinity,
      repeatType: 'loop',
    },
  }),
};

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.2,
};
