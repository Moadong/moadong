import styled from 'styled-components';
import { colors } from '@/styles/theme/colors';

export const Wrapper = styled.section`
  padding: 0 18px;
`;

export const ImageContainer = styled.div<{ $expanded: boolean }>`
  position: relative;
  overflow: hidden;

  max-height: ${({ $expanded }) =>
    $expanded ? 'none' : '700px'};
`;

export const Image = styled.img`
  width: 100%;
  border-radius: 12px;
  margin-bottom: 12px;
`;

export const Gradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;

  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,1) 100%
  );
`;

export const MoreButton = styled.button`
  width: 100%;
  margin-top: 12px;   /* 이미지와 12px */
  padding: 12px;
  border-radius: 10px;
  background: ${colors.gray[200]};
  border: none;
  cursor: pointer;
`;