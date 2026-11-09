// 모아동 로고 도형을 원본 모양 그대로, 한 점에서 말랑하게 부풀어 빚어지듯 나타나게 보여주는 장식 (윤곽선 없이)
import { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  BRAND_SHAPES,
  BrandShape,
} from '@/pages/IntroducePage/constants/brandShapes';
import { colors } from '@/styles/theme/colors';
import * as Styled from './BrandDoodle.styles';

/**
 * 가운데 한 점에서 둥글게 부풀어 오르며 비틀림이 풀리듯 자리를 잡는다.
 * 스프링이 살짝 넘쳤다 돌아와 말랑하게 빚어지는 느낌을 준다
 */
const revealVariants: Variants = {
  hidden: {
    clipPath: 'circle(0% at 50% 50%)',
    opacity: 0,
    scale: 0.5,
    rotate: -24,
  },
  show: (delay: number) => ({
    clipPath: 'circle(110% at 50% 50%)',
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      clipPath: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
      opacity: { duration: 0.2, delay },
      scale: { type: 'spring', stiffness: 140, damping: 11, delay },
      rotate: { type: 'spring', stiffness: 90, damping: 14, delay },
    },
  }),
};

interface BrandDoodleProps {
  shape: BrandShape;
  /** 도형 너비(CSS 값). 높이는 원본 비율을 따른다 */
  width: string;
  /** 섹션 안에서의 위치 (top·left·right·bottom) */
  position: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'>;
  rotate?: number;
  /** 좌우 뒤집기 */
  flip?: boolean;
  /** 채움 진하기 (0~1) */
  fillOpacity?: number;
  delay?: number;
  /** mount: 붙자마자 그린다, inView: 스크롤로 보일 때 그린다 */
  trigger?: 'mount' | 'inView';
}

const BrandDoodle = ({
  shape,
  width,
  position,
  rotate = 0,
  flip = false,
  fillOpacity = 0.1,
  delay = 0,
  trigger = 'inView',
}: BrandDoodleProps) => {
  const reduceMotion = useReducedMotion();
  const { viewBox, d } = BRAND_SHAPES[shape];
  const play = reduceMotion
    ? { initial: 'show', animate: 'show' }
    : trigger === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : {
          initial: 'hidden',
          whileInView: 'show',
          viewport: { once: true, amount: 0.4 },
        };

  return (
    <Styled.Doodle
      aria-hidden='true'
      style={{ ...position, width }}
      custom={delay}
      variants={revealVariants}
      {...play}
    >
      <svg
        viewBox={viewBox}
        fill='none'
        style={{ transform: `rotate(${rotate}deg) scaleX(${flip ? -1 : 1})` }}
      >
        <path
          d={d}
          fill={colors.primary[900]}
          fillOpacity={fillOpacity}
          fillRule='evenodd'
        />
      </svg>
    </Styled.Doodle>
  );
};

export default BrandDoodle;
