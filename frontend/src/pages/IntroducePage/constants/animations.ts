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
  left: {
    x: ['0%', '-50%'],
    transition: { ease: 'linear', duration: 20, repeat: Infinity },
  },
  right: {
    x: ['-50%', '0%'],
    transition: { ease: 'linear', duration: 20, repeat: Infinity },
  },
};

export const cardVariants: Record<string, Variants> = {
  left: {
    hidden: { opacity: 0, x: -100 },
    show: { opacity: 1, x: 0, transition: transDefault },
  },
  right: {
    hidden: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0, transition: transDefault },
  },
  top: {
    hidden: { opacity: 0, y: -100 },
    show: { opacity: 1, y: 0, transition: transDefault },
  },
  bottom: {
    hidden: { opacity: 0, y: 100 },
    show: { opacity: 1, y: 0, transition: transDefault },
  },
};

export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.2,
};
