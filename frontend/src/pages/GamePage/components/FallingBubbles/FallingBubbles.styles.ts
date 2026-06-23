import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Layer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  overflow: hidden;
`;

export const Bubble = styled(motion.div)<{
  $size: number;
  $hue: number;
  $xPct: number;
}>`
  position: absolute;
  top: 0;
  left: ${({ $xPct }) => `${$xPct}%`};
  margin-left: ${({ $size }) => `${-$size / 2}px`};
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  background: ${({ $hue }) =>
    `radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.95), hsla(${$hue}, 85%, 78%, 0.4) 46%, hsla(${$hue}, 80%, 66%, 0.16) 72%, transparent 100%)`};
  border: ${({ $hue }) => `1.5px solid hsla(${$hue}, 70%, 82%, 0.65)`};
  box-shadow: ${({ $hue }) =>
    `inset 6px 6px 12px rgba(255, 255, 255, 0.55), 0 0 16px hsla(${$hue}, 80%, 70%, 0.4)`};
  -webkit-tap-highlight-color: transparent;
`;

export const BubbleValue = styled.span<{ $size: number }>`
  font-size: ${({ $size }) => `${Math.round($size * 0.34)}px`};
  font-weight: 800;
  color: #3a3a3a;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  user-select: none;
`;

export const Pop = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${({ $x }) => `${$x}px`};
  top: ${({ $y }) => `${$y}px`};
  pointer-events: none;
`;

export const PopRing = styled(motion.span)<{ $hue: number }>`
  position: absolute;
  left: -24px;
  top: -24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: ${({ $hue }) => `3px solid hsla(${$hue}, 80%, 70%, 0.8)`};
`;

export const PopValue = styled(motion.span)<{ $hue: number }>`
  position: absolute;
  left: -20px;
  top: -14px;
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ $hue }) => `hsl(${$hue}, 70%, 45%)`};
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.9);
  white-space: nowrap;
`;
