// 긴 화면 캡처를 폰 화면 높이 안에서 위→아래로 천천히 스크롤했다가 다시 올라오는 장면
import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import * as Styled from './PhoneMockup.styles';

const SCROLL_SECONDS = 9;

interface ScrollingCaptureProps {
  src: string;
  alt: string;
  /** 폰 화면에서 보이는 높이(px) */
  viewportHeight: number;
}

const ScrollingCapture = ({
  src,
  alt,
  viewportHeight,
}: ScrollingCaptureProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [travel, setTravel] = useState(0);

  return (
    <Styled.ScrollViewport ref={ref} style={{ height: viewportHeight }}>
      <motion.img
        src={src}
        alt={alt}
        onLoad={(event) => {
          const image = event.currentTarget;
          setTravel(Math.max(0, image.offsetHeight - viewportHeight));
        }}
        style={{ display: 'block', width: '100%', height: 'auto' }}
        animate={
          inView && !reduceMotion && travel > 0
            ? { y: [0, 0, -travel, -travel, 0] }
            : { y: 0 }
        }
        transition={{
          duration: SCROLL_SECONDS,
          times: [0, 0.12, 0.7, 0.85, 1],
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </Styled.ScrollViewport>
  );
};

export default ScrollingCapture;
