import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Wrapper = styled.section`
  margin: 0;
`;

export const ImageContainer = styled.div<{ $expanded: boolean }>`
  position: relative;
  overflow: hidden;

  max-height: ${({ $expanded }) => ($expanded ? 'none' : '700px')};
`;

export const Image = styled.img`
  width: 100%;
  display: block;
  margin-bottom: 2px;
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 140px;

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.7) 60%,
    rgba(255, 255, 255, 1) 100%
  );

  pointer-events: none;
`;

export const MoreButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${colors.gray[200]};
  border: none;
  cursor: pointer;
`;
