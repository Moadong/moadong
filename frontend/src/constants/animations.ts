// framer-motion 애니메이션 설정 상수
export const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  },
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

// 뷰포트 설정 상수
export const VIEWPORT_CONFIG = {
  once: true,
  amount: 0.2,
};
