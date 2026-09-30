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
/** 아래 비율 목록·상세 패널과 같은 폭(칼럼 안쪽 전체) */
export const Flip = styled(motion.div)`
  width: 100%;
  transform-style: preserve-3d;
`;

/** 포인터에 따라 기울어지는 카드 본체 */
export const Card = styled(motion.div)<{ $bg: string }>`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 24px;
  /* color-mix 미지원(iOS < 16.2, Chrome < 111)이면 아래 선언이 무효라 단색으로 남는다 */
  background: ${({ $bg }) => $bg};
  background: ${({ $bg, theme }) =>
    `linear-gradient(160deg, color-mix(in srgb, ${$bg} 55%, ${theme.colors.base.white}) 0%, ${$bg} 55%, color-mix(in srgb, ${$bg} 92%, ${theme.colors.base.black}) 100%)`};
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
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

/** $disc: 심볼과 카드 색이 같아 묻히는 유형(활력가)에만 흰 원을 깐다 */
export const Symbol = styled.img<{ $disc: boolean }>`
  position: absolute;
  top: 14%;
  left: 50%;
  width: 40%;
  transform: translateX(-50%);
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.25));

  ${({ $disc }) =>
    $disc &&
    `
    width: 46%;
    padding: 9%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
    filter: none;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.18);
  `}
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
  /* 글자가 있는 아래 1/3에만 어둡게. 위쪽까지 깔면 주황·노랑 카드가 갈색으로 탁해진다 */
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 60%,
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
