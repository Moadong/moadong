import { motion } from 'framer-motion';
import TwistLeft from '@/assets/images/introduce/background-twist-left.svg';
import TwistRight from '@/assets/images/introduce/background-twist-right.svg';
import CircleSmall from '@/assets/images/introduce/background-circle-small.svg';
import CircleLarge from '@/assets/images/introduce/background-circle-large.svg';

export const BackgroundTwistLeft = () => (
  <motion.img
    src={TwistLeft}
    width={496}
    height={439}
    alt='Background Twist Left'
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: 'easeInOut' }}
  />
);

export const BackgroundTwistRight = () => (
  <motion.img
    src={TwistRight}
    width={288}
    height={392}
    alt='Background Twist Right'
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: 'easeInOut' }}
  />
);

export const BackgroundCircleSmall = () => (
  <motion.img
    src={CircleSmall}
    width={60}
    height={60}
    alt='Background Circle Small'
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  />
);

export const BackgroundCircleLarge = () => (
  <motion.img
    src={CircleLarge}
    width={123}
    height={123}
    alt='Background Circle Large'
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  />
);
