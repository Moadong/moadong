// 브랜드 도형 장식을 섹션 내용 뒤에 절대 위치로 까는 스타일 (드러나는 애니메이션은 감싸는 span이 맡는다)
import { motion } from 'framer-motion';
import styled from 'styled-components';

/* 섹션이 isolation으로 쌓임 맥락을 만들므로 -1이면 섹션 배경 위, 글자 아래에 놓인다 */
export const Doodle = styled(motion.span)`
  position: absolute;
  z-index: -1;
  display: block;
  pointer-events: none;

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;
