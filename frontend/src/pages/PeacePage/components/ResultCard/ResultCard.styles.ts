import { motion } from 'framer-motion';
import styled from 'styled-components';
import { setTypography } from '@/styles/theme/typography';

export const Perspective = styled.div`
  perspective: 1200px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

/** 등장 시 한 번 뒤집히는 바깥 껍질 */
export const Flip = styled(motion.div)`
  width: min(100%, 360px);
  transform-style: preserve-3d;
`;

/** 포인터에 따라 기울어지는 카드 본체 */
export const Card = styled(motion.div)<{ $bg: string }>`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 24px;
  background: ${({ $bg }) =>
    `linear-gradient(160deg, color-mix(in srgb, ${$bg} 55%, white) 0%, ${$bg} 55%, color-mix(in srgb, ${$bg} 85%, black) 100%)`};
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 24px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform;
  position: relative;
`;

/** 배경에서 천천히 떠다니는 반투명 원들 */
export const Decor = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

export const Blob = styled(motion.span)<{
  $size: number;
  $x: string;
  $y: string;
}>`
  position: absolute;
  left: ${({ $x }) => $x};
  top: ${({ $y }) => $y};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  filter: blur(1px);
`;

export const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 28px;
  height: 28px;
  /* 주황 단색 로고를 흰색으로 */
  filter: brightness(0) invert(1);
  opacity: 0.9;
`;

export const Symbol = styled.img`
  position: absolute;
  top: 16%;
  left: 50%;
  width: 40%;
  transform: translateX(-50%);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25));
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/** 이미지 유무와 무관하게 흰 글자 대비를 확보하는 하단 그라데이션 */
export const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 45%,
    rgba(0, 0, 0, 0.55) 100%
  );
  pointer-events: none;
`;

export const TextBlock = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  color: ${({ theme }) => theme.colors.base.white};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;

export const Name = styled.h1`
  ${({ theme }) => setTypography(theme.typography.title.title1)};
`;

export const Catchphrase = styled.p`
  ${({ theme }) => setTypography(theme.typography.paragraph.p1)};
  word-break: keep-all;
`;
