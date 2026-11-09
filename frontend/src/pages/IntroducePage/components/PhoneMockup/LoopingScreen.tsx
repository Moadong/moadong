// 폰 화면 안에서 긴 실제 화면 캡처를 천천히 내려 보며 둘러보다가 다시 올라오는 장면 (폰 폭이 바뀌어도 비율로 움직인다)
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import * as Styled from './PhoneMockup.styles';

const LOOP_SECONDS = 14;

interface LoopingScreenProps {
  src: string;
  alt: string;
  /** 캡처 원본 크기 (CSS px). 보이는 칸은 폰 화면 비율(viewWidth:viewHeight)로 잡는다 */
  imageWidth: number;
  imageHeight: number;
  viewWidth: number;
  viewHeight: number;
}

const LoopingScreen = ({
  src,
  alt,
  imageWidth,
  imageHeight,
  viewWidth,
  viewHeight,
}: LoopingScreenProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  // 캡처 높이 중 화면 밖에 있는 비율만큼 올린다 (폭에 맞춰 늘고 줄어도 비율은 같다)
  const travel =
    (1 - (viewHeight / viewWidth) * (imageWidth / imageHeight)) * 100;

  return (
    <Styled.LoopViewport
      ref={ref}
      style={{ aspectRatio: `${viewWidth} / ${viewHeight}` }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', height: 'auto' }}
        animate={
          inView && !reduceMotion
            ? { y: ['0%', '0%', `-${travel}%`, `-${travel}%`, '0%'] }
            : { y: '0%' }
        }
        transition={{
          duration: LOOP_SECONDS,
          times: [0, 0.12, 0.6, 0.78, 1],
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </Styled.LoopViewport>
  );
};

export default LoopingScreen;
